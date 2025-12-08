# itcc14-api-project-Spontaneous-Workout

This repository contains the backend API for **Spontaneity Fit**, an instant workout generator. This service is designed to eliminate workout decision fatigue by providing instant, customized workout plans via a simple RESTful API.

## Team Members
1. [Mine Galve](https://github.com/Mine-Galve)(Group Leader)
2. [Jerome Llyod Langcao](https://github.com/Jerome407/Jerome407)
3. [Johann Nocete](https://github.com/Johann-Nocete/Johann-Nocete.git)

## Project Details

### 1. Problem Statement

Many individuals, especially students, struggle with workout monotony or lack the time and knowledge to create varied, effective fitness plans. This leads to decision fatigue and inconsistent training.

### 2. Solution

We are building a "headless" RESTful API that acts as the brain for any fitness application. It will accept a user's desired **focus** (e.g., `legs`, `full_body`) and available **equipment** (e.g., `bodyweight`, `dumbbells_only`) as parameters. In response, it will instantly generate a simple, effective workout routine by querying our database, randomly selecting 3-5 exercises, and returning them in a clean JSON format.

### 3. Technology Stack

* **Language/Framework:** Node.js (with Express)
* **Database:** MongoDB (with Mongoose)
* **Development Tool:** MongoDB Compass
* **Deployment:** Render or Heroku (free tier)

### 4\. Data Model

Our project uses a single collection: exercises. Each document follows this Mongoose schema:

// models/Exercise.js
const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  focus_tag: {
    type: String,
    required: true,
  },
  equipment_tag: {
    type: String,
    required: true,
  },
});

-----

## Project Milestones (with MongoDB)

### Milestone 1 (Nov Week 1): Project Setup & Local Database Connection

*Status: Completed*
*Summary:* Finalized the topic, defined the data structure, and set up the local development environment with Node.js and MongoDB.

  - [x] Hold team meeting to finalize the technology stack (e.g., Node.js + Mongoose).
  - [x] Set up local MongoDB server and get our database connection string (MONGO_URI).
  - [x] Define the Exercise schema (the fields for our document) in the README.md.
  - [x] Commit all changes and push to the main GitHub repository.

### Milestone 2 (Nov Week 2): Basic API & Mongoose Model (Local DB)

*Status: Completed*
*Summary:* Created the basic Express server and connected it to the database. Wrote a seed script to populate the database with sample exercises.

  - [x] Initialize the project (npm init -y).
  - [x] Install Express, Mongoose, and dotenv (npm install express mongoose dotenv).
  - [x] Create the database connection module (db.js).
  - [x] Use environment variables (.env file) to store the MONGO_URI securely.
  - [x] Create the Mongoose Exercise model file (models/Exercise.js).
  - [x] Write and run the seed.js script to add sample exercises to the live database.
  - [x] Push the basic server structure to GitHub.

### Milestone 3 (Nov Week 3): Implement Core Generation Endpoint (DB Query)

*Status: Completed*
*Summary:* Built the core GET /api/v1/generate-workout endpoint using MongoDB aggregation to randomly select exercises based on user filters.

  - [x] Create the route for GET /api/v1/generate-workout.
  - [x] Implement logic to read focus and equipment from req.query.
  - [x] Write the Mongoose query (using Exercise.aggregate).
  - [x] Implement the random selection logic (using $sample).
  - [x] Test endpoint locally

### Milestone 4 (Nov Week 4): Format JSON Response & Finalize API

*Status: Completed*
*Summary:* Formatted the JSON response to include default sets/reps and a routine title.

  - [x] Create the final JSON response structure (e.g., routine_title, exercises array).
  - [x] Add the logic to assign default sets (e.g., 3) and reps (e.g., "10-12") to each exercise returned from the database.
  - [x] Handle edge cases (e.g., the database query returns 0 exercises).
  - [x] Update the README.md with final API documentation.

### Milestone 5 (Dec Week 1): Deployment (Atlas + Render)

*Status: Completed*
*Summary:* Migrated the database to MongoDB Atlas (cloud) and deployed the full application to Render.

  - [x] Create a free account on MongoDB Atlas.
  - [x] Get the new MONGO_URI connection string from Atlas.
  - [x] In MongoDB Atlas, change IP Whitelist to "Allow Access from Anywhere" (0.0.0.0/0).
  - [x] Deploy the application to Render.
  - [x] In the Render dashboard, add the MONGO_URI environment variable.
  - [x] Run the seed.js script to populate the new Atlas database.
  - [x] Test all live endpoints to confirm they work.
  - [x] Add the live URL to the top of this README.md.

### Milestone 6 (Dec Week 1): Frontend Integration (Bonus)

*Status: Completed*
*Summary:* Created a simple web interface to demonstrate the API functionality visually.

  - [x] Create frontend folder with index.html, styles.css, and app.js.
  - [x] Implement fetch logic to retrieve data from the live API.
  - [x] Add CORS middleware to the backend to allow browser connections.
  - [x] Integrate frontend files into the project structure.
----
