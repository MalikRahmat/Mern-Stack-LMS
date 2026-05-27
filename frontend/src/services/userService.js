import axios from '../api/axios';

// ============================
// GET ALL USERS
// ============================
const getAllUsers = async () => {
  const response = await axios.get('/users');
  return response.data.data;
};

// ============================
// REGISTER NEW INSTRUCTOR (ADMIN ONLY)
// ============================
const createInstructor = async (instructorData) => {
  const response = await axios.post('/users/create-instructor', instructorData);
  return response.data.data;
};

// ============================
// REPLACE INSTRUCTOR IN COURSES (ADMIN ONLY)
// ============================
const replaceInstructor = async (replaceData) => {
  const response = await axios.post('/users/replace-instructor', replaceData);
  return response.data; 
};

// ============================
// DELETE USER OR INSTRUCTOR
// ============================
const deleteUser = async (id) => {
  const response = await axios.delete(`/users/${id}`);
  return response.data.data;
};

// ============================
// UPDATE USER PROFILE
// ============================
const updateProfile = async (formData) => {
  const response = await axios.put('/users/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// ============================
// EXPORTS
// ============================
export default {
  getAllUsers,
  createInstructor,
  replaceInstructor,
  deleteUser,
  updateProfile,
};