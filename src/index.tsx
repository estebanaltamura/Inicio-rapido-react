import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from 'contexts/userContext';
import AuthGuard from 'guard/authGuard';
import Layout from 'layout/Layout';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Router>
      <UserProvider>
        <Layout>
          <App />
        </Layout>
      </UserProvider>
    </Router>
  </React.StrictMode>,
);
