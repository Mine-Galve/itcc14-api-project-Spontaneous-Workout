// old data for documentation purposes only
const mongoose = require('mongoose');
const connectDB = require('./db');
const Exercise = require('./models/Exercise');
require('dotenv').config();

const sampleExercises = [
  { name: 'Push Up', focus_tag: 'push', equipment_tag: 'bodyweight' },
  { name: 'Air Squat', focus_tag: 'legs', equipment_tag: 'bodyweight' },
  { name: 'Plank', focus_tag: 'full_body', equipment_tag: 'bodyweight' },
  { name: 'Dumbbell Goblet Squat', focus_tag: 'legs', equipment_tag: 'dumbbells_only' },
  { name: 'Dumbbell Push Press', focus_tag: 'push', equipment_tag: 'dumbbells_only' },
  { name: 'Dumbbell Row (per arm)', focus_tag: 'push', equipment_tag: 'dumbbells_only' }
];

const importData = async () => {
  await connectDB();
  try {
    await Exercise.deleteMany();
    await Exercise.insertMany(sampleExercises);
    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};
importData();