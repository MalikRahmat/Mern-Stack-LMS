const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student',
  },
  phone: {
    type: String,
    required: false,
    default: ""
  },
  bio: {
    type: String,
    required: false,
    default: ""
  },
  profilePicture: {
    type: String,
    required: false,
    default: ""
  },
  
  // Password Reset Functionality
  resetPasswordToken: {
    type: String,
    required: false,
    default: undefined
  },
  resetPasswordExpires: {
    type: Date,
    required: false,
    default: undefined
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);