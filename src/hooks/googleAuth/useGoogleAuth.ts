import { useUser } from 'contexts/userContext';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  getRedirectResult,
  UserCredential,
} from 'firebase/auth';
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
      if (isMobile) {
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        await handleAuthResult(result);
      }
    } catch (error) {
      console.error('Error en la autenticación:', error);
    }
  };

  const handleAuthResult = async (result: UserCredential | null) => {
    if (!result) return; // Asegúrate de que result no sea null

    const userUid = result.user.uid;
    const userDocRef = doc(db, 'users', userUid);
    const userDoc = await getDoc(userDocRef);

    const lastLogin = new Date(); // Campo para registrar el último login

    if (config.allowRegisterNewUsers) {
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
      setUser(result.user); // Actualizar el contexto del usuario
    } else {
      if (userDoc.exists()) {
        // Usuario está registrado en la colección 'users'
        const updateData = {
          lastLogin,
          email: userDoc.data()?.email,
          displayName: userDoc.data()?.displayName,
        };

        await updateDoc(userDocRef, updateData);
        setUser(result.user); // Actualizar el contexto del usuario
      } else {
        // Usuario no está registrado
        alert('No tienes una cuenta registrada. Por favor, contacta al administrador.');
        await signOut(auth);
      }
    }
  };

  useEffect(() => {
    console.log(auth);
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          await handleAuthResult(result);
        }
      } catch (error) {
        console.error('Error al obtener el resultado de la redirección:', error);
      }
    };

    checkRedirectResult();

    return () => {
      if (config.persistToken === false) signOut(auth);
    };
  }, [auth]);

  return { user, handleLogin, handleLogout: async () => await signOut(auth) };
};

export default useGoogleAuth;
