// models/Exercise.js
const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  focus_tag: { type: String, required: true },
  equipment_tag: { type: String, required: true },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);