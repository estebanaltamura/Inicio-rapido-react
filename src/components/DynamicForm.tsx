import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputLocation from './InputLocation.js';

export interface Field {
  name?: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'timestamp' | 'geoPoint' | 'email' | 'select' | 'multiSelect';
  codeInEntity: string;
  isRequired?: boolean;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  options?: { name: string; code: string }[]; // Para select y multiselect
}

export interface Selector {
  label: string;
  options: string[];
  fieldsByOption: Record<string, Field[]>;
}

interface GeoPointData {
  lat: number;
  lng: number;
  address: string;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  streetAndNumber: string | null;
}

interface DynamicFormProps {
  fields: (Field | Selector)[];
  onSubmit: (data: any) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [charCount, setCharCount] = useState<Record<string, number>>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [dropdownState, setDropdownState] = useState<Record<string, boolean>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const navigate = useNavigate();

  const validateField = (field: Field, value: any) => {
    let error = '';

    if (field.isRequired && !value) {
      error = `${field.label} es obligatorio`;
    }

    if (field.type !== 'email') {
      if (field.minLength && value && value.length < field.minLength) {
        error = `${field.label} debe tener al menos ${field.minLength} caracteres.`;
      }

      if (field.maxLength && value && value.length > field.maxLength) {
        error = `${field.label} no puede tener más de ${field.maxLength} caracteres.`;
      }
    }

    if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = 'Por favor, ingrese un email válido.';
      }
    }

    return error;
  };

  const handleBlur = (field: Field) => {
    const value = formData[field.codeInEntity];
    const error = validateField(field, value);

    if (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field.codeInEntity]: error,
      }));
    } else {
      setErrors((prevErrors) => {
        const { [field.codeInEntity]: removedError, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | GeoPointData,
    field?: Field,
  ) => {
    if (!field) return;

    let name = field.codeInEntity;
    let value: any;

    if (field.type === 'geoPoint' && 'lat' in e && 'lng' in e) {
      name = 'location';
      value = {
        lat: e.lat,
        lng: e.lng,
        address: e.address,
        city: e.city,
        state: e.state,
        country: e.country,
        postal_code: e.postal_code,
        streetAndNumber: e.streetAndNumber,
      };
    } else if ('target' in e) {
      value = e.target.value;

      switch (field.type) {
        case 'string':
          if (field.maxLength && value.length > field.maxLength) {
            value = value.slice(0, field.maxLength);
          }
          setCharCount((prevCount) => ({
            ...prevCount,
            [field.codeInEntity]: value.length,
          }));
          break;
        case 'number':
          if (value === '' || /^[0-9]*$/.test(value)) {
            if (field.maxLength && value.length > field.maxLength) {
              value = value.slice(0, field.maxLength);
            }
            value = value !== '' ? Number(value) : '';
          }
          break;
        case 'boolean':
          value = e.target.value === 'true';
          break;
        case 'timestamp':
          value = new Date(value);
          break;
        case 'select':
          value = e.target.value;
          break;
        case 'multiSelect':
          value = formData[field.codeInEntity] || [];
          if (value.includes(e.target.value)) {
            value = value.filter((v: string) => v !== e.target.value);
          } else {
            value.push(e.target.value);
          }
          break;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const error = validateField(field, value);
    if (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field.codeInEntity]: error,
      }));
    } else {
      setErrors((prevErrors) => {
        const { [field.codeInEntity]: removedError, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleClear = (field: Field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field.codeInEntity]: '',
    }));

    setErrors((prevErrors) => {
      const { [field.codeInEntity]: removedError, ...rest } = prevErrors;
      return rest;
    });

    setCharCount((prevCount) => ({
      ...prevCount,
      [field.codeInEntity]: 0,
    }));
  };

  const handleSelectorChange = (e: React.ChangeEvent<HTMLSelectElement>, selector: Selector) => {
    const selectedValue = e.target.value;
    setSelectedOptions((prev) => ({
      ...prev,
      [selector.label]: selectedValue,
    }));
  };

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    const allRequiredFieldsFilled = fields.every((field) => {
      if ('fieldsByOption' in field) {
        const selectedValue = selectedOptions[field.label];
        const selectedFields = field.fieldsByOption[selectedValue] || [];
        return selectedFields.every((f) => (f.isRequired ? !!formData[f.codeInEntity] : true));
      }
      return field.isRequired ? !!formData[field.codeInEntity] : true;
    });

    setIsFormValid(!hasErrors && allRequiredFieldsFilled);
  }, [errors, formData, fields, selectedOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFormData = { ...formData };
    onSubmit(cleanFormData);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleDropdown = (fieldCode: string) => {
    setDropdownState((prevState) => ({
      ...prevState,
      [fieldCode]: !prevState[fieldCode],
    }));
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={handleGoBack}
      >
        &times;
      </button>
      <form
        onSubmit={handleSubmit}
        className="space-y-1 bg-white rounded-xl p-9 max-w-2xl mx-auto border border-gray-300 mt-14"
      >
        {fields.map((field) => {
          if ('fieldsByOption' in field) {
            return (
              <div key={field.label} className="flex flex-col relative mb-4">
                <label className="text-gray-700" htmlFor={field.label}>
                  {field.label}
                </label>
                <select
                  name={field.label}
                  id={field.label}
                  onChange={(e) => handleSelectorChange(e, field)}
                  className="w-full h-11 p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccione una opción</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {selectedOptions[field.label] &&
                  field.fieldsByOption[selectedOptions[field.label]].map((dependentField) => (
                    <div key={dependentField.codeInEntity}>{renderField(dependentField)}</div>
                  ))}
              </div>
            );
          }

          return renderField(field as Field);
        })}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded disabled:opacity-50"
            disabled={!isFormValid}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );

  function renderField(field: Field) {
    return (
      <div key={field.codeInEntity} className="flex flex-col relative mb-4">
        <label className="text-gray-700" htmlFor={field.codeInEntity}>
          {field.label}
          {field.isRequired && <span className="text-red-500"> *</span>}
        </label>

        {field.type === 'string' && (
          <div className="relative">
            <input
              type="text"
              name={field.codeInEntity}
              id={field.codeInEntity}
              maxLength={field.maxLength}
              placeholder={field.placeholder || ''}
              value={formData[field.codeInEntity] || ''}
              onChange={(e) => handleChange(e, field)}
              onBlur={() => handleBlur(field)}
              className={`w-full h-11 p-2 pr-12 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors[field.codeInEntity] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => handleClear(field)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              style={{ height: 'fit-content', fontSize: '16px' }}
            >
              &times;
            </button>
            {field.maxLength && (
              <div className="absolute bottom-0 right-4 text-xs text-gray-500">
                {charCount[field.codeInEntity] || 0}/{field.maxLength} caracteres
              </div>
            )}
            <p
              className={`text-red-600 text-sm mt-1 leading-4 ${
                errors[field.codeInEntity] ? 'block' : 'invisible'
              }`}
            >
              {errors[field.codeInEntity] || 'Error placeholder'}
            </p>
          </div>
        )}

        {field.type === 'number' && (
          <div className="relative">
            <input
              type="number"
              name={field.codeInEntity}
              id={field.codeInEntity}
              maxLength={field.maxLength}
              placeholder={field.placeholder || ''}
              value={formData[field.codeInEntity] || ''}
              onChange={(e) => handleChange(e, field)}
              onBlur={() => handleBlur(field)}
              className={`w-full h-11 p-2 pr-12 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors[field.codeInEntity] ? 'border-red-500' : 'border-gray-300'
              }`}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                if (field.maxLength && input.value.length > field.maxLength) {
                  input.value = input.value.slice(0, field.maxLength);
                }
              }}
            />
            <button
              type="button"
              onClick={() => handleClear(field)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              style={{ height: 'fit-content', fontSize: '16px' }}
            >
              &times;
            </button>
            {field.maxLength && (
              <div className="absolute bottom-0 right-4 text-xs text-gray-500">
                {formData[field.codeInEntity]?.toString().length || 0}/{field.maxLength} caracteres
              </div>
            )}
            <p
              className={`text-red-600 text-sm mt-1 leading-4 ${
                errors[field.codeInEntity] ? 'block' : 'invisible'
              }`}
            >
              {errors[field.codeInEntity] || 'Error placeholder'}
            </p>
          </div>
        )}

        {field.type === 'email' && (
          <>
            <input
              type="email"
              name={field.codeInEntity}
              id={field.codeInEntity}
              placeholder={field.placeholder || ''}
              value={formData[field.codeInEntity] || ''}
              onChange={(e) => handleChange(e, field)}
              onBlur={() => handleBlur(field)}
              className={`w-full h-11 p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors[field.codeInEntity] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p
              className={`text-red-600 text-sm mt-1 leading-4 ${
                errors[field.codeInEntity] ? 'block' : 'invisible'
              }`}
            >
              {errors[field.codeInEntity] || 'Error placeholder'}
            </p>
          </>
        )}

        {field.type === 'boolean' && (
          <>
            <select
              name={field.codeInEntity}
              id={field.codeInEntity}
              onChange={(e) => handleChange(e, field)}
              onBlur={() => handleBlur(field)}
              className={`w-full h-11 p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors[field.codeInEntity] ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="true">SI</option>
              <option value="false">NO</option>
            </select>
            <p
              className={`text-red-600 text-sm mt-1 leading-4 ${
                errors[field.codeInEntity] ? 'block' : 'invisible'
              }`}
            >
              {errors[field.codeInEntity] || 'Error placeholder'}
            </p>
          </>
        )}

        {field.type === 'timestamp' && (
          <>
            <input
              type="date"
              name={field.codeInEntity}
              id={field.codeInEntity}
              placeholder={field.placeholder || ''}
              value={formData[field.codeInEntity]?.toISOString().split('T')[0] || ''}
              onChange={(e) => handleChange(e, field)}
              onBlur={() => handleBlur(field)}
              className={`w-full h-11 p-2 pr-12 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors[field.codeInEntity] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p
              className={`text-red-600 text-sm mt-1 leading-4 ${
                errors[field.codeInEntity] ? 'block' : 'invisible'
              }`}
            >
              {errors[field.codeInEntity] || 'Error placeholder'}
            </p>
          </>
        )}

        {field.type === 'geoPoint' && (
          <>
            <InputLocation
              label={field.label}
              placeholder={field.placeholder || ''}
              onPlaceSelected={(place: GeoPointData) => handleChange(place, field)}
              value={formData.location?.address || ''}
              variant="outlined"
              isDisabled={false}
              helperText="Podes ingresar más de una"
            />
            <p
              className={`text-red-600 text-sm mt-1 leading-4 ${
                errors[field.codeInEntity] ? 'block' : 'invisible'
              }`}
            >
              {errors[field.codeInEntity] || 'Error placeholder'}
            </p>
          </>
        )}

        {field.type === 'select' && (
          <div className="relative">
            <select
              name={field.codeInEntity}
              id={field.codeInEntity}
              value={formData[field.codeInEntity] || ''}
              onChange={(e) => handleChange(e, field)}
              className={`w-full h-11 p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors[field.codeInEntity] ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccione una opción</option>
              {field.options?.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </select>
            <p
              className={`text-red-600 text-sm mt-1 leading-4 ${
                errors[field.codeInEntity] ? 'block' : 'invisible'
              }`}
            >
              {errors[field.codeInEntity] || 'Error placeholder'}
            </p>
          </div>
        )}

        {field.type === 'multiSelect' && (
          <div className="relative">
            <button
              type="button"
              className="w-full h-11 p-2 border border-gray-300 rounded flex justify-between items-center focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              onClick={() => toggleDropdown(field.codeInEntity)}
            >
              <span className="text-left">
                {formData[field.codeInEntity]?.length > 0
                  ? formData[field.codeInEntity]
                      .map((code: string) => field.options?.find((opt) => opt.code === code)?.name)
                      .join(', ')
                  : field.placeholder || 'Seleccione una opción'}
              </span>
              <svg
                className={`w-4 h-4 transform ${
                  dropdownState[field.codeInEntity] ? 'rotate-180' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownState[field.codeInEntity] && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded shadow-lg max-h-56 overflow-auto custom-scrollbar">
                {field.options?.map((option) => (
                  <div
                    key={option.code}
                    className={`flex items-center p-2 cursor-pointer ${
                      formData[field.codeInEntity]?.includes(option.code) ? 'bg-blue-100' : 'bg-white'
                    }`}
                    onClick={() => {
                      const selectedOptions = formData[field.codeInEntity] || [];
                      const newSelectedOptions = selectedOptions.includes(option.code)
                        ? selectedOptions.filter((code: string) => code !== option.code)
                        : [...selectedOptions, option.code];
                      setFormData((prev) => ({
                        ...prev,
                        [field.codeInEntity]: newSelectedOptions,
                      }));
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData[field.codeInEntity]?.includes(option.code) || false}
                      className="mr-2"
                    />
                    <span>{option.name}</span>
                  </div>
                ))}
              </div>
            )}
            <p
              className={`text-red-600 text-sm mt-1 leading-4 ${
                errors[field.codeInEntity] ? 'block' : 'invisible'
              }`}
            >
              {errors[field.codeInEntity] || 'Error placeholder'}
            </p>
          </div>
        )}
      </div>
    );
  }
};

export default DynamicForm;
