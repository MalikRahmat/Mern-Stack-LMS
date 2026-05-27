// src/services/courseService.js
import axios from '../api/axios'; // Centralized Axios instance configured with baseURL

/**
 * Fetch all available courses
 * Endpoint: GET /courses
 */
const getAllCourses = async () => {
  const response = await axios.get('/courses');
  return response.data.data || response.data;
};

/**
 * Fetch a single course by its ID
 * Endpoint: GET /courses/:id
 */
const getCourseById = async (id) => {
  const response = await axios.get(`/courses/${id}`);
  return response.data.data || response.data;
};

/**
 * Fetch instructor-specific courses
 * Endpoint: GET /courses/instructor/me
 * (Backend dependent endpoint for instructor's own courses)
 */
const getInstructorCourses = async () => {
  const response = await axios.get('/courses/instructor/me');
  return response.data.data || response.data;
};

/**
 * Create a new course (Instructor only)
 * Endpoint: POST /courses
 */
const createCourse = async (courseData) => {
  const response = await axios.post('/courses', courseData);
  return response.data.data || response.data;
};

/**
 * Update existing course by ID
 * Endpoint: PUT /courses/:id
 */
const updateCourse = async (id, courseData) => {
  const response = await axios.put(`/courses/${id}`, courseData);
  return response.data.data || response.data;
};

/**
 * Delete a course by ID
 * Endpoint: DELETE /courses/:id
 */
const deleteCourse = async (id) => {
  const response = await axios.delete(`/courses/${id}`);
  return response.data.data || response.data;
};

export default {
  getAllCourses,
  getCourseById,
  getInstructorCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};