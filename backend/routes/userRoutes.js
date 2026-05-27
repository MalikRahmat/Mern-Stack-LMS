const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  getAllUsers, 
  getUserDetails,
  createInstructor, 
  adminResetUserPassword,
  replaceInstructor, 
  deleteUser,
  updateUserProfile // Imported the new controller function
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// ==========================================
// MULTER FILE UPLOAD CONFIGURATION (UPDATED)
// ==========================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // FIX: Profile pictures ab safely separate profiles folder me jayengi
    cb(null, 'uploads/profiles/'); 
  },
  filename: function (req, file, cb) {
    // FIX: User ID aur timestamp laga kar filename ko unique banaya taake image browser me instantly refresh ho
    const userId = req.user?._id || req.user?.id || 'user';
    cb(null, `${userId}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpg, jpeg, png, webp) are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // Max limit 2MB
});

// ==========================================
// USER & PROFILE ROUTES
// ==========================================

// Authenticated User Profile Route (Available for Student/Instructor/Admin)
router.put('/profile', protect, upload.single('profilePicture'), updateUserProfile);

// Base Routes: /api/users (Admin Only Control Layer)
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUserDetails); 
router.delete('/:id', protect, authorize('admin'), deleteUser);

// Administrative operations for Instructor / User Governance (Admin Only)
router.post('/create-instructor', protect, authorize('admin'), createInstructor);
router.post('/replace-instructor', protect, authorize('admin'), replaceInstructor);
router.post('/reset-password', protect, authorize('admin'), adminResetUserPassword); 

module.exports = router;