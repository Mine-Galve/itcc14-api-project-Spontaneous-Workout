
const express = require('express');
const connectDB = require('./db');
const Exercise = require('./models/Exercise');
const cors = require('cors');
const path = require('path'); // Import path
require('dotenv').config();

// Connect to Database
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. THIS IS THE MISSING LINE ---
// This tells the server: "Allow users to download files (css, js) from the 'public' folder"
app.use(express.static(path.join(process.cwd(), 'frontend')));

// --- 2. UPDATE THE ROUTE ---
// Send the index.html file from the 'public' folder
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'frontend', 'index.html'));
});

// --- API ENDPOINT ---
app.get('/api/v1/generate-workout', async (req, res) => {
  try {
    const { focus, equipment } = req.query;
    const filter = {};
    if (focus) filter.focus_tag = focus;
    if (equipment) filter.equipment_tag = equipment;

    const exercises = await Exercise.aggregate([
      { $match: filter },
      { $sample: { size: 3 } }, 
    ]);

    if (!exercises || exercises.length === 0) {
      return res.status(404).json({ msg: 'No exercises found matching your criteria.' });
    }

    const formattedExercises = exercises.map((ex) => {
      return {
        name: ex.name,
        sets: 3,
        reps: '10-12',
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