// src/services/analyticsService.js
import axios from '../api/axios'; // Centralized Axios instance with base configuration

/**
 * Fetch platform analytics data from backend API
 * Endpoint: GET /api/analytics
 */
const getAnalytics = async () => {
  // API call to retrieve analytics data from backend
  const response = await axios.get('/analytics');

  return response.data.data;
};

export default {
  getAnalytics,
};