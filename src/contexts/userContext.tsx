import { CircularProgress } from '@mui/material';
import Loader from 'components/Loader';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from 'firebaseConfig'; // Asegúrate de que esta ruta apunte correctamente
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('User: ', user);
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe(); // Limpia la suscripción al desmontar
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {!loading ? children : <Loader />}
    </UserContext.Provider>
  );
};
