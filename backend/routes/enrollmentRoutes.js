const express = require('express');
const router = express.Router();
const {
  enrollInCourse,           // Student requests enrollment
  getMyCourses,             // Student fetches their specific courses
  updateEnrollmentProgress, // Student updates course progress
  getAllEnrollments,        // Admin reads all requests
  updateEnrollmentStatus,   // Admin approves or rejects
  deleteEnrollment          // Controller for hard delete
} = require('../controllers/enrollmentController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// ========================================================
// STUDENT ROUTES
// ========================================================

// Request new enrollment (Status: pending)
router.post('/enroll', protect, authorize('student'), enrollInCourse);

// Fetch student's own courses
router.get('/my-courses', protect, authorize('student'), getMyCourses);

// Update progress 
router.put('/:id/progress', protect, authorize('student'), updateEnrollmentProgress);


// ========================================================
// ADMIN ROUTES (GOVERNANCE)
// ========================================================

// Admin monitors all requests
router.get('/admin/all', protect, authorize('admin'), getAllEnrollments);

// Admin approves or rejects a pending request
router.put('/admin/status/:id', protect, authorize('admin'), updateEnrollmentStatus);


router.delete('/admin/:id', protect, authorize('admin'), deleteEnrollment);

module.exports = router;