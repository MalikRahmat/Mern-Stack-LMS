const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  getLessonsByCourse, 
  createLesson, 
  updateLesson, 
  deleteLesson 
} = require('../controllers/lessonController');

// Multer Storage Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/lessons/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// ==========================
// CRITICAL ROUTE SEQUENCE 
// ==========================

// 1.  GET ROUTE
router.get('/:courseId', getLessonsByCourse);

// 2. Base POST Route (Create Lesson)
router.post('/', upload.single('videoFile'), createLesson);

// 3. PUT Route (Update Lesson)
router.put('/:id', upload.single('videoFile'), updateLesson);

// 4. DELETE Route (Delete Lesson)
router.delete('/:id', deleteLesson);

module.exports = router;