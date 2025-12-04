
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// --- IMPORTS ---
const Exercise = require('./models/Exercise');
const User = require('./models/User');
const SavedWorkout = require('./models/SavedWorkout');
const auth = require('./middleware/auth');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

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

// Login User
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

// Save Workout
app.post('/api/workouts/save', auth, async (req, res) => {
  try {
    const { title, exercises, progress } = req.body;
    const newWorkout = new SavedWorkout({
      user: req.user.id,
      title,
      exercises,
      progress: progress || 0,
      completedExercises: []
    });
    const workout = await newWorkout.save();
    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get User's Workouts
app.get('/api/workouts/my-workouts', auth, async (req, res) => {
  try {
    const workouts = await SavedWorkout.find({ user: req.user.id }).sort({ savedAt: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update Workout Progress
app.put('/api/workouts/:id', auth, async (req, res) => {
  try {
    const { progress, completedExercises } = req.body;
    
    let workout = await SavedWorkout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ msg: 'Workout not found' });
    }
    
    // Make sure user owns this workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    workout.progress = progress;
    workout.completedExercises = completedExercises;
    
    await workout.save();
    res.json(workout);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Workout not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Delete Workout
app.delete('/api/workouts/:id', auth, async (req, res) => {
  try {
    const workout = await SavedWorkout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ msg: 'Workout not found' });
    }
    
    // Make sure user owns this workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    await workout.deleteOne();
    res.json({ msg: 'Workout removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Workout not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Generate Workout
app.get('/api/v1/generate-workout', async (req, res) => {
  try {
    const { focus, equipment } = req.query;
    
    const filter = {};
    if (focus) filter.focus_tag = focus;
    if (equipment) filter.equipment_tag = equipment;

    const exercises = await Exercise.aggregate([
      { $match: filter },
      { $sample: { size: 5 } }, 
    ]);

    if (!exercises || exercises.length === 0) {
      return res.status(404).json({ msg: 'No exercises found matching your criteria.' });
    }

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