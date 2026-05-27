const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');

// Importing protective authorization middleware from your asset directory
const { protect } = require('../middleware/authMiddleware');

/**
 * Endpoint routes map for /api/categories
 * Public profiles can view existing items, updates require a valid bearer authorization key.
 */
router
  .route('/')
  .get(getCategories) // Public access for instructors/students to populate listings
  .post(protect, createCategory); // Protected action: Requires active login status

module.exports = router;