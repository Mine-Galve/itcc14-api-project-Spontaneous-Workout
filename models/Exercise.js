// models/Exercise.js
const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  focus_tag: { type: String, required: true },
  equipment_tag: { type: String, required: true },
  instructions: { type: String, required: true }, // NEW FIELD
  difficulty: { type: String, default: 'beginner' }, // NEW FIELD (optional)
  musclesWorked: [{ type: String }] // NEW FIELD (optional)
});

module.exports = mongoose.model('Exercise', ExerciseSchema);