const mongoose = require('mongoose');

/**
 * @typedef {Object} Category
 * @property {string} name - The unique name of the course category
 * @property {Date} createdAt - Timestamp when the category was created
 * @property {Date} updatedAt - Timestamp when the category was last updated
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Add index to enhance read operation speeds for large catalogs
categorySchema.index({ name: 1 });

module.exports = mongoose.model('Category', categorySchema);