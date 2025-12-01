
const express = require('express');
const connectDB = require('./db');
const Exercise = require('./models/Exercise');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Connect to Database
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from 'client' folder
// Using process.cwd() is safer for Render deployment
app.use(express.static(path.join(process.cwd(), 'client')));

// Root route - serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'index.html'));
});

// API ENDPOINT
app.get('/api/v1/generate-workout', async (req, res) => {
  try {
    const { focus, equipment } = req.query;
    
    // Build filter object
    const filter = {};
    if (focus) filter.focus_tag = focus;
    if (equipment) filter.equipment_tag = equipment;

    // Get 5 random exercises matching the filter
    const exercises = await Exercise.aggregate([
      { $match: filter },
      { $sample: { size: 5 } }, 
    ]);

    if (!exercises || exercises.length === 0) {
      return res.status(404).json({ msg: 'No exercises found matching your criteria.' });
    }

    // Format response - CRITICAL FIX: Include gifUrl here!
    const formattedExercises = exercises.map((ex) => {
      return {
        name: ex.name,
        sets: 3,
        reps: '10-12',
        instructions: ex.instructions || 'No instructions available',
        difficulty: ex.difficulty || 'beginner',
        musclesWorked: ex.musclesWorked || [],
        gifUrl: ex.gifUrl // <--- THIS WAS MISSING. Now images will show!
      };
    });

    const routineTitle = `${focus || 'Full Body'} ${equipment || ''} Workout`.trim();

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