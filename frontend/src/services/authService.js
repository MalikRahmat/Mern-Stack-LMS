import axios from '../api/axios';

/**
 * @service authService
 * @description Handles core identity operations using industry-standard short-lived sessionStorage.
 */

const register = async (name, email, password, role, phone) => {
  const response = await axios.post('/auth/register', { name, email, password, role, phone });
  
  if (response.data.success && response.data.data.token) {
    // sessionStorage for immediate session drop on tab close
    sessionStorage.setItem('token', response.data.data.token);
    sessionStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data.data;
};

const login = async (email, password) => {
  const response = await axios.post('/auth/login', { email, password });
  
  if (response.data.success && response.data.data.token) {
    // Forcing short-lived session token tracking
    sessionStorage.setItem('token', response.data.data.token);
    sessionStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data.data;
};

const logout = () => {
  //Purging runtime credentials from session registers
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

const getCurrentUser = () => {
  // Reading state indices exclusively from temporary session storage
  const user = sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};