// models/SavedWorkout.js
const mongoose = require('mongoose');

const SavedWorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  exercises: [{
    name: String,
    sets: Number,
    reps: String,
    instructions: String,
    difficulty: String,
    musclesWorked: [String],
    gifUrl: String
  }],
  progress: {
    type: Number,
    default: 0
  },
  completedExercises: {
    type: [Number],
    default: []
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SavedWorkout', SavedWorkoutSchema);