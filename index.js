// index.js
const express = require('express');
const connectDB = require('./db');
require('dotenv').config();

connectDB();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('SpontaneityFit API is running...');
});

// --- TODO: Add your /api/v1/generate-workout route here (for Milestone 3) ---

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});