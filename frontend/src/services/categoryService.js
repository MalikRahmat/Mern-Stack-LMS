import axios from '../api/axios';

/**
 * @service categoryService
 * @description Manages all asynchronous academic taxonomy queries and synchronization with remote data states.
 */

/**
 * Fetch all available course categories from the database storage registries.
 * @returns {Promise<Array>} List of category objects arranged alphabetically.
 */
const getCategories = async () => {
  const response = await axios.get('/categories');
  // Dynamic unfolding: directly extraction of data payloads safely for components mapping
  return response.data.data;
};

/**
 * Persists a new unique custom course classification tag.
 * @param {string} categoryName - The name of the custom taxonomy node to inject.
 * @returns {Promise<Object>} The fresh database-mapped record document.
 */
const createCategory = async (categoryName) => {
  // Mapping parameter keys precisely to match backend validation constraints
  const response = await axios.post('/categories', { name: categoryName });
  return response.data.data;
};

// Exporting standard interface actions
export default {
  getCategories,
  createCategory,
};