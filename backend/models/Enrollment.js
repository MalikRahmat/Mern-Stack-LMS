const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  progress: {
    type: Number,
    required: true,
    default: 0,
  },
  completedLessons: {
    type: Array, // Holds completed lesson IDs/indexes
    default: [],
  },
  //Enterprise Approval Flow (Pending by default)
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);