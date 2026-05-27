const Category = require('../models/Category');

/**
 * @desc    Get all available course categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    // Sort categories alphabetically (A-Z) for a clean UI dropdown layout
    const categories = await Category.find().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    // Forwarding database exceptions to global central error middleware
    next(error);
  }
};

/**
 * @desc    Create a new course category taxonomy
 * @route   POST /api/categories
 * @access  Private (Restricted to authenticated instructors/admins)
 */
const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid category name.',
      });
    }

    const sanitizedName = name.trim();

    // Defensive check: Verify if the taxonomy already exists in data storage records
    const categoryExists = await Category.findOne({ name: sanitizedName });
    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'This category classification already exists in the system.',
      });
    }

    // Persisting the new entity node inside MongoDB collections
    const newCategory = await Category.create({
      name: sanitizedName,
    });

    return res.status(201).json({
      success: true,
      message: 'New academic taxonomy registered successfully.',
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
};