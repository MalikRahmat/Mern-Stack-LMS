// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // success/info message

  useEffect(() => {
    const loadedUser = authService.getCurrentUser();
    if (loadedUser) {
      setUser(loadedUser);
      setMessage(`Welcome back, ${loadedUser.name}!`); // show on reload
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      setMessage(`Login successful! Logged in as ${userData.role}.`);
      setLoading(false);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const userData = await authService.register(name, email, password, role);
      setUser(userData);
      setMessage(`Registration successful! You are now a ${userData.role}.`);
      setLoading(false);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  const updateUser = (newUserData) => {
    if (newUserData) {
      setUser(newUserData);
      sessionStorage.setItem('user', JSON.stringify(newUserData));
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setMessage('You have been logged out.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        message,   // expose success/info message
        login,
        register,
        logout,
        updateUser, // Expose update functionality safely
        setError,
        setMessage, // allow manual message reset
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};