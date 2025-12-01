
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// --- IMPORTS ---
const Exercise = require('./models/Exercise'); // original model
const User = require('./models/User');         // New User model
const SavedWorkout = require('./models/SavedWorkout'); // New SavedWorkout model
const auth = require('./middleware/auth');     // New Middleware
const crypto = require('crypto');              // Native Node security
const jwt = require('jsonwebtoken');           // login tokens


connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(process.cwd(), 'client')));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client', 'index.html'));
});


// Register User
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ username, email });

    // Hashing
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
    user.password = `${salt}:${hash}`;

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const [salt, storedHash] = user.password.split(':');
    const inputHash = crypto.createHmac('sha256', salt).update(password).digest('hex');

    if (inputHash !== storedHash) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});




app.post('/api/workouts/save', auth, async (req, res) => {
  try {
    const { title, exercises } = req.body;
    const newWorkout = new SavedWorkout({
      user: req.user.id,
      title,
      exercises
    });
    const workout = await newWorkout.save();
    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


app.get('/api/workouts/my-workouts', auth, async (req, res) => {
  try {
    const workouts = await SavedWorkout.find({ user: req.user.id }).sort({ savedAt: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


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

    // Format response
    const formattedExercises = exercises.map((ex) => {
      return {
        name: ex.name,
        sets: 3,
        reps: '10-12',
        instructions: ex.instructions || 'No instructions available',
        difficulty: ex.difficulty || 'beginner',
        musclesWorked: ex.musclesWorked || [],
        gifUrl: ex.gifUrl
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

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});