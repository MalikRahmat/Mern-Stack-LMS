import axios from '../api/axios';

const getLessonsByCourse = async (courseId) => {
  const response = await axios.get(`/lessons/${courseId}`);
  return response.data.data;
};

// Multipart configuration header
const config = {
  headers: { 'Content-Type': 'multipart/form-data' }
};

const createLesson = async (lessonData) => {
  let data = lessonData;
  if (!(lessonData instanceof FormData)) {
    data = new FormData();
    data.append('courseId', lessonData.course || lessonData.courseId);
    data.append('title', lessonData.title);
    data.append('content', lessonData.content);
    if (lessonData.videoFile) data.append('videoFile', lessonData.videoFile);
    else data.append('videoUrl', lessonData.videoUrl || '');
  }

  const response = await axios.post('/lessons', data, config);
  return response.data.data;
};

const updateLesson = async (id, lessonData) => {
  // Multi-part compatibility check
  let data = lessonData;
  if (!(lessonData instanceof FormData)) {
    data = new FormData();
    data.append('title', lessonData.title);
    data.append('content', lessonData.content);
    if (lessonData.videoFile) data.append('videoFile', lessonData.videoFile);
    else data.append('videoUrl', lessonData.videoUrl || '');
  }

  const response = await axios.put(`/lessons/${id}`, data, config);
  return response.data.data;
};

const deleteLesson = async (id) => {
  const response = await axios.delete(`/lessons/${id}`);
  return response.data.data;
};

export default {
  getLessonsByCourse,
  createLesson,
  updateLesson,
  deleteLesson,
};