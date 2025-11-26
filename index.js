
const express = require('express');
const connectDB = require('./db');
const Exercise = require('./models/Exercise');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Keep fs for debugging if needed
require('dotenv').config();

// Connect to Database
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// --- CRITICAL FIX: Pointing to 'client' folder ---
// 1. Serve the static files (CSS, JS) from the 'client' folder
app.use(express.static(path.join(process.cwd(), 'client')));

// 2. Serve the HTML file from the 'client' folder
app.get('/', (req, res) => {
    const indexPath = path.join(process.cwd(), 'client', 'index.html');
    res.sendFile(indexPath);
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

// Debug Route (Keep this just in case!)
app.get('/debug', (req, res) => {
    try {
        const folderName = process.cwd();
        const files = fs.readdirSync(folderName);
        res.json({ "Server Location": folderName, "Files Found": files });
    } catch (e) {
        res.json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});