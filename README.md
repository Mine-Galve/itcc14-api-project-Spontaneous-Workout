# itcc14-api-project-Spontaneous-Workout


This repository contains the backend API for **Spontaneity Fit**, an instant workout generator. This service is designed to eliminate workout decision fatigue by providing instant, customized workout plans via a simple RESTful API.

## Team Members
Jerome Sareno
Johann Nocete
Mine Galve

* [Mine Galve - Group Leader]
* *(Other team members will add their names here via Pull Request)*

## Project Details

### 1. Problem Statement

Many individuals, especially students, struggle with workout monotony or lack the time and knowledge to create varied, effective fitness plans. This leads to decision fatigue and inconsistent training.

### 2. Solution

We are building a "headless" RESTful API that acts as the brain for any fitness application. It will accept a user's desired **focus** (e.g., `legs`, `full_body`) and available **equipment** (e.g., `bodyweight`, `dumbbells_only`) as parameters. In response, it will instantly generate a simple, effective workout routine by filtering a local JSON database of exercises, randomly selecting 3-5, and returning them in a clean JSON format.

### 3. Technology Stack

Language/Framework:** Node.js (with Express) or Python (with Flask) [
* **Data Storage:** A single, local `exercises.json` file. No external database is required.
* **Deployment:** Render or Heroku (free tier) 

---

## My Project Milestones (with MongoDB)
Milestone 1 (Nov Week 1): Project Setup & Database Connection
What we'll do: This week, our team will finalize the "Spontaneity Fit" topic, define our exercise document structure, and set up our free cloud database with MongoDB Atlas.

Deliverables: This README.md file will be updated with the "Problem Statement," "Solution," and "Technology Stack". We will also add a new "Data Models" section to this README that describes our exercise document.

Checklists:

[ ] Hold team meeting to finalize the technology stack (e.g., Node.js + Mongoose).

[ ] Create a free account on MongoDB Atlas and get our database connection string (the MONGO_URI).

[ ] Whitelist our IP addresses in Atlas to allow connections.

[ ] Define the Exercise schema (the fields for our document) in the README.md.

[ ] Commit all changes and push to the main GitHub repository.

Milestone 2 (Nov Week 2): Basic API & Mongoose Model
What we'll do: We will set up the basic project scaffolding for our Node.js server. The primary goal is to create a server that runs, successfully connects to the MongoDB Atlas database, and has a script to populate it with sample data.

Deliverables: A functional server that can be started locally. A new module/file (e.g., db.js) that handles the Mongoose connection. A seed.js script that uses our Exercise model to populate the database with 15-20 sample exercises.

Checklists:

[ ] Initialize the project (npm init -y).

[ ]  Install Express and Mongoose (npm install express mongoose).

[ ]  Create the database connection module (db.js).

[ ]  Use environment variables (.env file) to store the MONGO_URI securely.

[ ]  Create the Mongoose Exercise model file (e.g., models/Exercise.js).

[ ]  Write and run the seed.js script to add sample exercises to the live database.

[ ] Push the basic server structure to GitHub (make sure the .env file is in .gitignore).

Milestone 3 (Nov Week 3): Implement Core Generation Endpoint (DB Query)
What we'll do: We will build the primary feature: the GET /api/v1/generate-workout endpoint. This will involve writing a Mongoose query to fetch data from our exercises collection based on the user's parameters.

Deliverables: A functional GET /api/v1/generate-workout endpoint. The endpoint must correctly read the focus and equipment query parameters  and use them to query the MongoDB database.

Checklists:

[ ] Create the route for GET /api/v1/generate-workout.

[ ] Implement logic to read focus and equipment from req.query.

[ ]  Write the Mongoose query (e.g., Exercise.find({ focus_tag: focus, equipment_tag: equipment })).

[ ]  Implement the random selection logic (e.g., using Exercise.aggregate([{ $match: ... }, { $sample: { size: 5 } }])).

[ ] Test the endpoint locally.

Milestone 4 (Nov Week 4): Format JSON Response & Finalize API

What we'll do: We will finalize the generate-workout endpoint by formatting the data from the database into the specific JSON response required by the proposal . This includes adding the default set/rep scheme.


Deliverables: The GET /api/v1/generate-workout endpoint will return a fully-formed JSON object that matches the sample output . The README.md will be updated with API usage instructions.

Checklists:

[ ] Create the final JSON response structure (e.g., routine_title, exercises array).

[ ] Add the logic to assign default sets (e.g., 3) and reps (e.g., "10-12") to each exercise returned from the database.

[ ] Handle edge cases (e.g., the database query returns 0 exercises).

[ ] Update the README.md with final API documentation.

Milestone 5 (Dec Week 1): Deployment & Final Submission
What we'll do: We will deploy the completed API to a free-tier hosting service (like Render). This now includes configuring the deployed app to connect to our MongoDB Atlas database.

Deliverables: A live, public URL for the Spontaneity Fit API.

Checklists:

[ ] Create a Procfile and ensure all dependencies are correctly listed.

[ ]m In MongoDB Atlas, change IP Whitelist from "my IP" to "Allow Access from Anywhere" (0.0.0.0/0) so Render can connect.

[ ] Deploy the application to Render.

[ ] (New) In the Render dashboard, add the MONGO_URI environment variable so the live API can connect to your database.

[ ] Test all live endpoints to confirm they work.

[ ] Add the live URL to the top of the README.md.
