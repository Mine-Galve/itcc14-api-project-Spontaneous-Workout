# itcc14-api-project-Spontaneous-Workout

This repository contains the backend API for **Spontaneity Fit**, an instant workout generator. This service is designed to eliminate workout decision fatigue by providing instant, customized workout plans via a simple RESTful API.

## Team Members
1. [Mine Galve](https://github.com/Mine-Galve)(Group Leader)
2. 
3. 

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

### 4. Data Model

Our project uses a single collection: `exercises`. Each document in this collection follows this Mongoose schema:

```javascript
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

---

My Project Milestones (with MongoDB)
Milestone 1 (Nov Week 1): Project Setup & Local Database Connection
What we'll do: This week, our team will finalize the "Spontaneity Fit" topic, define our exercise document structure, and set up our local MongoDB database (managed with Compass).

Deliverables: This README.md file will be updated with the "Problem Statement," "Solution," and "Technology Stack". We will also add a new "Data Model" section to this README that describes our exercise document.

Checklists:

[x] Hold team meeting to finalize the technology stack (e.g., Node.js + Mongoose).

[x] Set up local MongoDB server and get our database connection string (MONGO_URI).

[x] Define the Exercise schema (the fields for our document) in the README.md.

[x] Commit all changes and push to the main GitHub repository.

Milestone 2 (Nov Week 2): Basic API & Mongoose Model (Local DB)
What we'll do: We will set up the basic project scaffolding for our Node.js server. The primary goal is to create a server that runs, successfully connects to the local MongoDB database, and has a script to populate it with sample data.

Deliverables: A functional server that can be started locally. A new module/file (e.g., db.js) that handles the Mongoose connection. A seed.js script that uses our Exercise model to populate the database with 15-20 sample exercises.

Checklists:

[x] Initialize the project (npm init -y).

[x] Install Express, Mongoose, and dotenv (npm install express mongoose dotenv).

[x] Create the database connection module (db.js).

[x] Use environment variables (.env file) to store the MONGO_URI securely.

[x] Create the Mongoose Exercise model file (models/Exercise.js).

[x] Write and run the seed.js script to add sample exercises to the live database.

[x] Push the basic server structure to GitHub (make sure the .env file is in .gitignore).

Milestone 3 (Nov Week 3): Implement Core Generation Endpoint (DB Query)
What we'll do: We will build the primary feature: the GET /api/v1/generate-workout endpoint. This will involve writing a Mongoose query to fetch data from our exercises collection based on the user's parameters.

Deliverables: A functional GET /api/v1/generate-workout endpoint. The endpoint must correctly read the focus and equipment query parameters and use them to query the local MongoDB database.

Checklists:

[x] Create the route for GET /api/v1/generate-workout.

[x] Implement logic to read focus and equipment from req.query.

[x] Write the Mongoose query (using Exercise.aggregate).

[x] Implement the random selection logic (using $sample).

[x] Test the endpoint locally.

Milestone 4 (Nov Week 4): Format JSON Response & Finalize API
What we'll do: We will finalize the generate-workout endpoint by formatting the data from the database into the specific JSON response required by the proposal. This includes adding the default set/rep scheme.

Deliverables: The GET /api/v1/generate-workout endpoint will return a fully-formed JSON object that matches the sample output. The README.md will be updated with API usage instructions.

Checklists:

[x] Create the final JSON response structure (e.g., routine_title, exercises array).

[x] Add the logic to assign default sets (e.g., 3) and reps (e.g., "10-12") to each exercise returned from the database.

[x] Handle edge cases (e.g., the database query returns 0 exercises).

[x] Update the README.md with final API documentation.

Milestone 5 (Dec Week 1): Deployment (Migrate to Atlas & Deploy)
Note: For our API to work on a live website (like Render), it must connect to a cloud database. Our local localhost database won't work. This milestone is about moving our database to the cloud (MongoDB Atlas) and deploying the app.

What we'll do: We will create a free MongoDB Atlas account, move our database to the cloud, and deploy the completed API to a free-tier hosting service (like Render).

Deliverables: A live, public URL for the Spontaneity Fit API.

Checklists:

[ ] Create a free account on MongoDB Atlas.

[ ] Get the new MONGO_URI connection string from Atlas.

[ ] In MongoDB Atlas, change IP Whitelist to "Allow Access from Anywhere" (0.0.0.0/0) so Render can connect.

[ ] Deploy the application to Render (or a similar service).

[ ] In the Render dashboard, add the MONGO_URI environment variable.

[ ] Run the seed.js script (locally or on Render) to populate the new Atlas database.

[ ] Test all live endpoints to confirm they work.

[ ] Add the live URL to the top of this README.md.
