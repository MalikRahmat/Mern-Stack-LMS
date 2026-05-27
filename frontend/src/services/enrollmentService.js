import axios from '../api/axios';

// ==========================
// STUDENT OPERATIONS
// ==========================
const enrollCourse = async (courseId) => {
  const response = await axios.post('/enrollments/enroll', { courseId });
  return response.data.data;
};

const getMyCourses = async () => {
  const response = await axios.get('/enrollments/my-courses');
  return response.data.data;
};

const updateProgress = async (enrollmentId, progressData) => {
  const response = await axios.put(
    `/enrollments/${enrollmentId}/progress`,
    progressData
  );
  return response.data.data;
};

// ==========================
// ADMINISTRATIVE (ADMIN ONLY)
// ==========================
const getAllEnrollments = async () => {
  const response = await axios.get('/enrollments/admin/all');
  return response.data.data;
};

const updateEnrollmentStatus = async (id, status) => {
  const response = await axios.put(`/enrollments/admin/status/${id}`, { status });
  return response.data;
};

const deleteEnrollment = async (id) => {
  const response = await axios.delete(`/enrollments/admin/${id}`);
  return response.data.data;
};


export default {
  enrollCourse,
  getMyCourses,
  updateProgress,
  getAllEnrollments,
  updateEnrollmentStatus,
  deleteEnrollment,
};