import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AuthGuard from 'guard/authGuard';
import { AppBar, Toolbar, Button, useMediaQuery, Box } from '@mui/material';
import { useUser } from 'contexts/userContext';
import Home from 'pages/Home';
import Landing from 'pages/Landing';
import useGoogleAuth from 'hooks/googleAuth/useGoogleAuth';
import { useEffect } from 'react';
import { menuBarHeight } from 'globalConfig';

function App() {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 600px)'); // Verificamos si es un dispositivo móvil
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
      <AppBar position="fixed" sx={{ height: `${menuBarHeight}px` }}>
        <Toolbar sx={{ height: '48px !important', minHeight: '48px !important' }}>
          <Box sx={{ display: 'flex', flexGrow: 1 }}></Box>
          {!user ? (
            <Button color="inherit" onClick={handleLogin}>
              Login
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

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
    </>
  );
}

export default App;
