import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AuthGuard from 'guard/authGuard';
import { useUser } from 'contexts/userContext';
import Home from 'pages/Home';
import Landing from 'pages/Landing';
import useGoogleAuth from 'hooks/googleAuth/useGoogleAuth';
import { useEffect } from 'react';
import { menuBarHeight } from 'globalConfig';

function App() {
  const location = useLocation();
  const isMobile = window.matchMedia('(max-width: 600px)').matches; // Verificamos si es un dispositivo móvil
  const { user } = useUser();
  const navigate = useNavigate();
  const { handleLogin, handleLogout } = useGoogleAuth();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full h-[${menuBarHeight}px] bg-gray-800 text-white flex items-center justify-between px-4 z-50`}
      >
        <div className="flex-grow"></div>
        {!user ? (
          <button className="text-white" onClick={handleLogin}>
            Login
          </button>
        ) : (
          <button className="text-white" onClick={handleLogout}>
            Logout
          </button>
        )}
      </header>

      <main className="pt-[48px]">
        {' '}
        {/* Ajuste del padding top para compensar la altura del AppBar */}
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/landing" element={<Landing />} />
          <Route
            path="/home"
            element={
              <AuthGuard>
                <Home />
              </AuthGuard>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
