import { useEffect, useRef, useState } from 'react';
import { geohashForLocation } from 'geofire-common';
import PropTypes from 'prop-types';

const InputLocation = ({
  label,
  placeholder,
  onPlaceSelected,
  value,
  variant = 'outlined',
  isDisabled,
  helperText = 'Podes ingresar mas de una',
  className = '',
  keepValue = false,
}) => {
  const [selectedPlaceId, setSelectedPlaceId] = useState(0);
  const [query, setQuery] = useState(value);
  const autoCompleteRef = useRef(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false); // Estado para controlar la carga del script

  let autoComplete;

  async function handlePlaceSelect(updateQuery) {
    const addressObject = autoComplete.getPlace();
    const queryStr = addressObject.formatted_address;
    updateQuery(queryStr);

    if (!addressObject.geometry || !addressObject.geometry.location) {
      return;
    }

    let city = addressObject.address_components
      ? addressObject.address_components.find((ad) => {
          if (ad && ad.types) {
            return ad.types.find((t) => t === 'locality');
          }
          return false;
        })
      : null;

    if (!city)
      city = addressObject.address_components
        ? addressObject.address_components.find((ad) => {
            if (ad && ad.types) {
              return ad.types.find((t) => t === 'sublocality');
            }
            return false;
          })
        : null;

    const county = addressObject.address_components
      ? addressObject.address_components.find((ad) => {
          if (ad && ad.types) {
            return ad.types.find((t) => t === 'administrative_area_level_2');
          }
          return false;
        })
      : null;

    const postal_code = addressObject.address_components
      ? addressObject.address_components.find((ad) => {
          if (ad && ad.types) {
            return ad.types.find((t) => t === 'postal_code');
          }
          return false;
        })
      : null;

    const state = addressObject.address_components
      ? addressObject.address_components.find((ad) => {
          if (ad && ad.types) {
            return ad.types.find((t) => t === 'administrative_area_level_1');
          }
          return false;
        })
      : null;

    let street = addressObject.address_components
      ? addressObject.address_components.find((ad) => {
          if (ad && ad.types) {
            return ad.types.find((t) => t === 'route');
          }
          return false;
        })
      : '';

    if (street) street = street.long_name;

    let streetNumber = addressObject.address_components
      ? addressObject.address_components.find((ad) => {
          if (ad && ad.types) {
            return ad.types.find((t) => t === 'street_number');
          }
          return false;
        })
      : '';

    if (streetNumber) streetNumber = streetNumber.long_name;

    const country = addressObject.address_components
      ? addressObject.address_components.find((ad) => {
          if (ad && ad.types) {
            return ad.types.find((t) => t === 'country');
          }
          return false;
        })
      : '';

    onPlaceSelected({
      lat: addressObject.geometry.location.lat(),
      lng: addressObject.geometry.location.lng(),
      city: city ? city.long_name : null,
      county: county ? county.long_name : null,
      postal_code: postal_code ? postal_code.long_name : null,
      state: state ? state.long_name : null,
      addressObject,
      addressString: addressObject.formatted_address,
      streetAndNumber: streetNumber ? `${street} ${streetNumber}` : street,
      country: country ? country.long_name : null,
      geohash: geohashForLocation([
        addressObject.geometry.location.lat(),
        addressObject.geometry.location.lng(),
      ]),
    });

    if (!keepValue) setQuery('');

    setSelectedPlaceId((prevId) => prevId + 1);
  }

  function handleScriptLoad(updateQuery, autoCompleteRefAux) {
    if (window.google && window.google.maps) {
      autoComplete = new window.google.maps.places.Autocomplete(autoCompleteRefAux.current, {
        types: ['(cities)'],
        componentRestrictions: { country: 'ar' },
      });

      autoComplete.setFields(['address_components', 'formatted_address', 'geometry']);
      autoComplete.addListener('place_changed', () => handlePlaceSelect(updateQuery));
    } else {
      console.error('Google Maps script not loaded properly.');
    }
  }

  function loadGoogleMapsScript(callback) {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps) {
          setIsGoogleMapsLoaded(true); // Marcar que el script ha sido cargado
          callback();
        } else {
          console.error('Google Maps script failed to load.');
        }
      };
      script.onerror = () => console.error('Error loading Google Maps script.');
      document.head.appendChild(script);
    } else {
      setIsGoogleMapsLoaded(true); // Marcar que el script ya estaba cargado
      callback();
    }
  }

  useEffect(() => {
    if (!isGoogleMapsLoaded) {
      loadGoogleMapsScript(() => {
        if (autoCompleteRef.current && window.google) {
          handleScriptLoad(setQuery, autoCompleteRef);
        }
      });
    } else if (autoCompleteRef.current && window.google) {
      handleScriptLoad(setQuery, autoCompleteRef);
    }
  }, [isGoogleMapsLoaded]);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          ref={autoCompleteRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={isDisabled}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <img src="/images/icons/locationProfileJourneyIcon.svg" alt="" width="22px" />
        </div>
      </div>
      {helperText && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

InputLocation.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onPlaceSelected: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  variant: PropTypes.string,
  isDisabled: PropTypes.bool,
  helperText: PropTypes.string,
  className: PropTypes.string,
  keepValue: PropTypes.bool,
};

export default InputLocation;
