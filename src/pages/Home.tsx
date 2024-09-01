import DynamicForm, { Field, Selector } from 'components/DynamicForm';
import Typo from 'components/Typo';

const Home = () => {
  const handleSubmit = (data: any) => {
    console.log(data);
  };

  const categories = {
    music: 'Música',
    sports: 'Deportes',
    tech: 'Tecnología',
    food: 'Comida',
    video: 'Videojuegos',
    games: 'Juegos',
  };

  const fields: (Field | Selector)[] = [
    {
      label: 'Categorías del evento',
      type: 'multiSelect',
      codeInEntity: 'categoriesTypes',
      placeholder: 'Ingresa las categorías del evento',
      isRequired: true,
      options: (Object.keys(categories) as Array<keyof typeof categories>).map((key) => ({
        name: categories[key],
        code: key,
      })),
    },
    {
      label: 'select comun',
      type: 'select',
      codeInEntity: 'select',
      placeholder: 'Ingresa el select',
      options: [
        {
          name: 'select 1',
          code: 'select1',
        },
        {
          name: 'select 2',
          code: 'select2',
        },
        {
          name: 'select 3',
          code: 'select3',
        },
      ],
    },
    {
      label: 'Título del evento',
      type: 'string',
      codeInEntity: 'title',
      placeholder: 'Ingresa el título del evento',
      isRequired: true,
      maxLength: 100,
    },
    {
      label: 'Descripción breve',
      type: 'string',
      codeInEntity: 'briefDescription',
      placeholder: 'Ingresa una breve descripción',
      isRequired: true,
      maxLength: 255,
    },
    {
      label: 'Fecha y hora del evento',
      type: 'timestamp',
      codeInEntity: 'dateTime',
      placeholder: 'Selecciona la fecha y hora del evento',
      isRequired: true,
    },

    {
      label: 'Tipos de eventos',
      type: 'string',
      codeInEntity: 'eventTypes',
      placeholder: 'Ingresa los tipos de eventos',
    },
    {
      label: '¿Tiene límite de capacidad?',
      type: 'boolean',
      codeInEntity: 'hasEventCapacityLimit',
      placeholder: '¿El evento tiene límite de capacidad?',
    },
    {
      label: '¿Es en línea?',
      type: 'boolean',
      codeInEntity: 'isOnline',
      placeholder: '¿Es un evento en línea?',
    },
    {
      label: 'Ubicación del evento',
      type: 'geoPoint',
      codeInEntity: 'locationInfo',
      placeholder: 'Ingresa la información de la ubicación',
    },
    {
      label: 'Operación a nivel nacional',
      type: 'boolean',
      codeInEntity: 'operatesNationwide',
      placeholder: '¿Opera a nivel nacional?',
    },
    {
      label: 'Estados donde opera',
      type: 'string',
      codeInEntity: 'operatesStates',
      placeholder: 'Ingresa los estados donde opera',
    },
    {
      label: 'Imagen de portada',
      type: 'string',
      codeInEntity: 'coverImage',
      placeholder: 'Ingresa la URL de la imagen de portada',
    },
    {
      label: '¿Tiene enlace externo?',
      options: ['Sí', 'No'],
      fieldsByOption: {
        Sí: [
          {
            label: 'Enlace externo',
            type: 'string',
            codeInEntity: 'externalLink',
            placeholder: 'Ingresa el enlace externo',
            isRequired: true,
          },
        ],
        No: [],
      },
    },
    {
      label: 'Tipos de palabras clave',
      type: 'string',
      codeInEntity: 'keywordsTypes',
      placeholder: 'Ingresa los tipos de palabras clave',
    },
  ];

  return (
    <>
      <Typo type="title1">Formulario dinamico</Typo>
      <DynamicForm fields={fields} onSubmit={handleSubmit} />
    </>
  );
};

export default Home;
