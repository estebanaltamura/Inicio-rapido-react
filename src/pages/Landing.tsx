import { useUser } from 'contexts/userContext';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (user) navigate('/home');

  return <div>Landing</div>;
};

export default Landing;
