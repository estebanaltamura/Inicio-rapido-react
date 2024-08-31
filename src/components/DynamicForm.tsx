import React, { useState } from 'react';
import { Timestamp, GeoPoint } from 'firebase/firestore';
import { Field } from 'types';
import InputLocation from './InputLocation.js';

interface DynamicFormProps {
  fields: Field[];
  onSubmit: (data: any) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, onSubmit }) => {
  const [formData, setFormData] = useState<any>({});
  const [geoData, setGeoData] = useState<{ lat: string; lng: string }>({ lat: '', lng: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: Field) => {
    const { name, value } = e.target;
    let parsedValue: any = value;

    if (field.type === 'number') {
      parsedValue = Number(value);
    } else if (field.type === 'boolean') {
      parsedValue = value === 'true';
    } else if (field.type === 'timestamp') {
      parsedValue = Timestamp.fromDate(new Date(value));
    }

    setFormData((prevData: any) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  const handleGeoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    // const { name, value } = e.target;
    // setGeoData((prevGeoData) => ({
    //   ...prevGeoData,
    //   [name]: value,
    // }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newFormData = { ...formData };

    // Si se ingresaron datos para latitud y longitud, agregarlos como GeoPoint en un Map
    if (geoData.lat && geoData.lng) {
      newFormData.location = {
        geopoint: new GeoPoint(Number(geoData.lat), Number(geoData.lng)),
      };
    }

    onSubmit(newFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label className="mb-1 text-gray-700" htmlFor={field.name}>
            {field.label}
          </label>
          {field.type === 'string' && (
            <input
              type="text"
              name={field.name}
              id={field.name}
              onChange={(e) => handleChange(e, field)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          )}
          {field.type === 'number' && (
            <input
              type="number"
              name={field.name}
              id={field.name}
              onChange={(e) => handleChange(e, field)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          )}
          {field.type === 'boolean' && (
            <select
              name={field.name}
              id={field.name}
              onChange={(e) => handleChange(e, field)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          )}
          {field.type === 'timestamp' && (
            <input
              type="date"
              name={field.name}
              id={field.name}
              onChange={(e) => handleChange(e, field)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          )}
          {field.type === 'geoPoint' && (
            <InputLocation
              label={field.label}
              placeholder="Ingresa tu ubicación"
              onPlaceSelected={(place: any) => handleGeoChange(place)}
              value={geoData.lat}
              variant="outlined"
              isDisabled={false}
              helperText="Podes ingresar mas de una"
              className="w-full p-2 border border-gray-300 rounded"
            />
          )}
        </div>
      ))}
      <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
