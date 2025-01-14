const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the Employee model
    required: true
  },
  type: {
    type: String,
    enum: ['Ferie', 'Sykepermisjon', 'Personlig permisjon', 'Other'], // Types of applications
    required: true
  },
  reason: {
    type: String, // Reason or details about the application
    required: true
  },
  startDate: {
    type: Date, // When the leave starts
    required: false
  },
  endDate: {
    type: Date, // When the leave ends
    required: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'], // Status of the application
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now // Automatically set the creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now // Automatically set the last update date
  }
});

// Middleware to update `updatedAt` before saving
applicationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
