
const express = require('express');
const connectDB = require('./db');
const Exercise = require('./models/Exercise');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const fs = require('fs');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ FIXED: Changed 'public' to 'client'
app.use(express.static(path.join(process.cwd(), 'client')));

// ✅ FIXED: Changed 'public' to 'client'
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'index.html'));
});

// API ENDPOINT
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

// DEBUG ROUTE
app.get('/debug', (req, res) => {
    try {
        const folderName = process.cwd();
        const files = fs.readdirSync(folderName);
        res.json({
            "Server Location": folderName,
            "Files Found": files
        });
    } catch (e) {
        res.json({ error: e.message });
    }
});