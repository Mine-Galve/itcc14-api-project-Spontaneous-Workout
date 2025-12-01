const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  focus_tag: { type: String, required: true },
  equipment_tag: { type: String, required: true },
  instructions: { type: String, required: true },
  difficulty: { type: String, default: 'beginner' },
  musclesWorked: [{ type: String }],
  gifUrl: { type: String } // <--- NEW FIELD
});

module.exports = mongoose.model('Exercise', ExerciseSchema);