// index.js
const express = require('express');
const connectDB = require('./db');
const Exercise = require('./models/Exercise'); // 1. IMPORT YOUR MODEL
require('dotenv').config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Health Check Route
app.get('/', (req, res) => {
  res.send('SpontaneityFit API is running...');
});

// --- THIS IS YOUR NEW API ENDPOINT (MILESTONE 3 & 4) ---
app.get('/api/v1/generate-workout', async (req, res) => {
  try {
    // 2. Get query parameters from the URL
    const { focus, equipment } = req.query;

    // 3. Build the filter for the database query
    const filter = {};
    if (focus) {
      filter.focus_tag = focus;
    }
    if (equipment) {
      filter.equipment_tag = equipment;
    }

    // 4. Use Mongoose Aggregation to find matches AND select 3 random ones
    // $match finds exercises based on your filter
    // $sample selects 3 random documents from the results
    const exercises = await Exercise.aggregate([
      { $match: filter },
      { $sample: { size: 3 } }, 
    ]);

    if (!exercises || exercises.length === 0) {
      return res
        .status(404)
        .json({ msg: 'No exercises found matching your criteria.' });
    }

    // 5. Format the final response (as required by your PDF proposal)
    const formattedExercises = exercises.map((ex) => {
      return {
        name: ex.name,
        sets: 3, // Add default sets
        reps: '10-12', // Add default reps
      };
    });

    const routineTitle = `${focus || 'Full Body'} ${
      equipment || ''
    } Workout`.trim();

    res.json({
      routine_title: routineTitle,
      exercises: formattedExercises,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// ----------------------------------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});