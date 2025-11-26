
const express = require('express');
const connectDB = require('./db');
const Exercise = require('./models/Exercise'); // 1. IMPORT YOUR MODEL
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Connect to Database
connectDB();

const app = express();
app.use(cors());
// Middleware
app.use(express.json());



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// --- THIS IS YOUR NEW API ENDPOINT (MILESTONE 3 & 4) ---
app.get('/api/v1/generate-workout', async (req, res) => {
  try {
    // Get query parameters from the URL
    const { focus, equipment } = req.query;

    //  Build the filter for the database query
    const filter = {};
    if (focus) {
      filter.focus_tag = focus;
    }
    if (equipment) {
      filter.equipment_tag = equipment;
    }

    //  Use Mongoose Aggregation to find matches AND select 3 random ones
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

    // Format the final response (as required by your PDF proposal)
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


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});