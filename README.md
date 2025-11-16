# itcc14-api-project-Spontaneous-Workout


This repository contains the backend API for **Spontaneity Fit**, an instant workout generator. This service is designed to eliminate workout decision fatigue by providing instant, customized workout plans via a simple RESTful API[cite: 3, 5, 15].

## Team Members
Jerome Sareno
Johann Nocete
Mine Galve

* [Mine Galve - Group Leader]
* *(Other team members will add their names here via Pull Request)*

## Project Details

### 1. Problem Statement

Many individuals, especially students, struggle with workout monotony or lack the time and knowledge to create varied, effective fitness plans[cite: 4, 11]. [cite_start]This leads to decision fatigue and inconsistent training[cite: 3].

### 2. Solution

We are building a "headless" RESTful API that acts as the brain for any fitness application[cite: 13, 15]. [cite_start]It will accept a user's desired **focus** (e.g., `legs`, `full_body`) and available **equipment** (e.g., `bodyweight`, `dumbbells_only`) as parameters[cite: 27, 28]. [cite_start]In response, it will instantly generate a simple, effective workout routine by filtering a local JSON database of exercises, randomly selecting 3-5, and returning them in a clean JSON format[cite: 31, 32, 36].

### 3. Technology Stack

Language/Framework:** Node.js (with Express) or Python (with Flask) [cite: 18]
* **Data Storage:** A single, local `exercises.json` file. [cite_start]No external database is required[cite: 19, 20].
* [cite_start]**Deployment:** Render or Heroku (free tier) [cite: 21]

---

## My Project Milestones

### Milestone 1 (Nov Week 1): Project Setup & API Design

* **What we'll do:** This week, our team will finalize the "Spontaneity Fit" topic, define the data models for our `exercises.json` file, and create the initial API documentation outline.
Deliverables:** This `README.md` file will be updated with the "Problem Statement," "Solution," and "Technology Stack"[cite: 16, 17, 19]. We will also create and commit the initial `exercises.json` file that defines the data structure for our exercises.
* **Checklists:**
    * [cite_start]`[ ]` Hold team meeting to finalize the technology stack (e.g., Node.js vs. Python)[cite: 18].
    * `[ ]` Define the exact fields for the `exercises.json` file (e.g., `name`, `focus_tag`, `equipment_tag`).
    * `[ ]` Populate `exercises.json` with at least 15 sample exercises.
    * `[ ]` Commit all changes and push to the main GitHub repository.

### Milestone 2 (Nov Week 2): Basic API Server & Data Loading

* **What we'll do:** We will set up the basic project scaffolding for our chosen framework (Express or Flask). The primary goal is to create a server that runs, loads the `exercises.json` file into memory, and responds to a simple health-check endpoint.
* **Deliverables:** A functional server that can be started locally. [cite_start]A new module/file (e.g., `data_service.js` or `data_loader.py`) that handles reading and parsing the `exercises.json` file[cite: 19, 31]. A single `GET /` endpoint that returns a "Welcome" message.
* **Checklists:**
    * `[ ]` Initialize the project (`npm init` or `pipenv install`).
    * `[ ]` Install the base server framework (e.g., Express).
    * `[ ]` Create the main server file (`index.js` or `app.py`).
    * `[ ]` Implement the function to read and parse `exercises.json` on server start[cite: 31].
    * `[ ]` Create a `GET /` (health check) endpoint.
    * `[ ]` Push the basic server structure to GitHub.

### Milestone 3 (Nov Week 3): Implement Core Generation Endpoint

* **What we'll do:** We will build the primary feature: the `GET /api/v1/generate-workout` endpoint[cite: 24]. This includes all the core logic: reading the URL parameters, filtering the exercise list, and randomly selecting the exercises.
* **Deliverables:** A functional `GET /api/v1/generate-workout` endpoint. [cite_start]The endpoint must correctly read the `focus` and `equipment` query parameters [cite: 26] [cite_start]and use them to filter the list of exercises[cite: 31].
* **Checklists:**
    * `[ ]` Create the route for `GET /api/v1/generate-workout`[cite: 24].
    * `[ ]` Implement logic to read `focus` [cite: 27] [cite_start]and `equipment` [cite: 28] from `req.query`.
    * `[ ]` Write the filtering function that matches parameters to the exercise data[cite: 31].
    * `[ ]` Implement the random selection logic to pick 3-5 exercises from the filtered list[cite: 32].
    * `[ ]` Test the endpoint locally to ensure the filtering works as expected.

### Milestone 4 (Nov Week 4): Format JSON Response & Finalize API

* **What we'll do:** We will finalize the `generate-workout` endpoint by formatting the output to match the specification in the project proposal[cite: 36]. [cite_start]This includes adding the `routine_title` [cite: 40] [cite_start]and the default set/rep scheme (e.g., 3x10) to each exercise[cite: 33].
* **Deliverables:** The `GET /api/v1/generate-workout` endpoint will return a fully-formed JSON object that matches the sample output[cite: 38, 80]. The `README.md` will be updated with API usage instructions (showing the parameters and sample response).
* **Checklists:**
    * `[ ]` Create the final JSON response structure[cite: 36].
    * `[ ]` Add the logic to assign default sets (e.g., 3) [cite: 48] [cite_start]and reps (e.g., "10-12") [cite: 50] to each selected exercise.
    * `[ ]` Add a `routine_title` to the response[cite: 40].
    * `[ ]` Handle edge cases (e.g., no exercises match the filter).
    * `[ ]` Update the `README.md` with final API documentation.

### Milestone 5 (Dec Week 1): Deployment & Final Submission

* **What we'll do:** We will deploy the completed API to a free-tier hosting service (like Render) [cite: 21] to make it publicly accessible. We will perform final testing on the live URL and clean up the code for submission.
* **Deliverables:** A live, public URL for the Spontaneity Fit API. The final `README.md` will be updated with the live API link.
* **Checklists:**
    * `[ ]` Create a `Procfile` and ensure all dependencies are correctly listed.
    * [cite_start]`[ ]` Deploy the application to Render (or a similar service)[cite: 21].
    * `[ ]` Test all live endpoints (health check and generate-workout) to confirm they work.
    * `[ ]` Add the live URL to the top of the `README.md`.
