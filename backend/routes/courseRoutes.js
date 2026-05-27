const express = require('express');
const router = express.Router();


const {
  getAllCourses,
  getCourseById,
  getInstructorCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');


router.get('/instructor/me', protect, authorize('instructor'), getInstructorCourses);
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

module.exports = router;