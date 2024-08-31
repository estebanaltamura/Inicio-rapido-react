import DynamicForm from 'components/DynamicForm';
import Typo from 'components/Typo';
import { Field } from 'types';

const Home = () => {
  const handleSubmit = (data: any) => {
    console.log(data);
  };

  const fields: Field[] = [
    {
      label: 'Nombre',
      type: 'string',
      name: 'name',
    },
    {
      label: 'Email',
      type: 'string',
      name: 'email',
    },
    {
      label: 'Fecha de nacimiento',
      type: 'timestamp',
      name: 'birthday',
    },
    {
      label: 'Ubicación',
      type: 'geoPoint',
      name: 'location',
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
