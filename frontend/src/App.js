import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './assets/styles/global.css';
import './assets/styles/dashboard.css';

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
