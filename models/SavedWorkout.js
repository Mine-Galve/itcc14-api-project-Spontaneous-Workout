// models/SavedWorkout.js
const mongoose = require('mongoose');

const SavedWorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links this workout to a specific User document
    required: true
  },
  title: {
    type: String,
    required: true
  },
  // We snapshot the exercises so the workout stays the same 
  // even if the original database changes
  exercises: [{
    name: String,
    sets: Number,
    reps: String,
    instructions: String,
    difficulty: String,
    musclesWorked: [String],
    gifUrl: String
  }],
  savedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SavedWorkout', SavedWorkoutSchema);