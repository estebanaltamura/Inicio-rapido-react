import { useUser } from 'contexts/userContext';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import { useEffect } from 'react';

const useGoogleAuth = () => {
  const { user, setUser } = useUser();
  const auth = getAuth();
  const isMobile = window.innerWidth <= 600;

  const config = {
    allowRegisterNewUsers: true,
    persistToken: true,
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      let result;
      if (isMobile) {
        await signInWithRedirect(auth, provider);
        return;
      } else {
        result = await signInWithPopup(auth, provider);
      }

      const userUid = result.user.uid;
      const userDocRef = doc(db, 'users', userUid);
      const userDoc = await getDoc(userDocRef);

      const lastLogin = new Date(); // Campo para registrar el último login

      if (config.allowRegisterNewUsers) {
        // Modo 1: Acepta usuarios nuevos
        if (!userDoc.exists()) {
          // Registrar el nuevo usuario en la entidad users
          await setDoc(userDocRef, {
            email: result.user.email,
            displayName: result.user.displayName,
            uid: result.user.uid,
            createdAt: new Date(),
            lastLogin, // Almacenar el último login
          });
        } else {
          // Actualizar el último login si el usuario ya existe
          await updateDoc(userDocRef, { lastLogin });
        }
        setUser(result.user);
      } else {
        // Modo 2: Solo permite usuarios registrados
        if (userDoc.exists()) {
          // Usuario está registrado en la colección 'users'
          const updateData: {
            lastLogin: Date;
            email: string | undefined | null;
            displayName: string | undefined | null;
          } = {
            lastLogin,
            email: userDoc.data()?.email,
            displayName: userDoc.data()?.displayName,
          };

          await updateDoc(userDocRef, updateData);
          setUser(result.user);
        } else {
          // Usuario no está registrado
          alert('No tienes una cuenta registrada. Por favor, contacta al administrador.');
          await signOut(auth);
        }
      }
    } catch (error) {
      console.error('Error en la autenticación:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (config.persistToken === false) signOut(auth);
    };
  }, []);

  return { user, handleLogin, handleLogout };
};

export default useGoogleAuth;
