// --- DOM ELEMENTS ---
const generateBtn = document.getElementById('generateBtn');
const routineTitle = document.getElementById('routine-title');
const exerciseList = document.getElementById('exercise-list');
const resultArea = document.getElementById('result-area');
const progressBar = document.getElementById('progress-bar-fill');
const progressText = document.getElementById('progress-text');
const progressContainer = document.getElementById('progress-container');

// Auth Elements
const authContainer = document.getElementById('auth-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const userInfo = document.getElementById('user-info');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const saveWorkoutBtn = document.getElementById('saveWorkoutBtn');
const viewSavedBtn = document.getElementById('viewSavedBtn');
const savedWorkoutsArea = document.getElementById('saved-workouts-area');
const savedList = document.getElementById('saved-list');
const closeSavedBtn = document.getElementById('closeSavedBtn');

// State
let currentExercises = []; // Store current workout to save it later
let authToken = localStorage.getItem('token'); // Check if user is already logged in

const API_URL = "https://spontaneity-fit-api.onrender.com"; 
// NOTE: If testing locally, use "http://localhost:3000"

// --- INITIALIZATION ---
checkLoginState();

// --- AUTHENTICATION LOGIC ---

// Toggle Forms
document.getElementById('show-register').addEventListener('click', () => {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});
document.getElementById('show-login').addEventListener('click', () => {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Login
loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (data.token) {
            localStorage.setItem('token', data.token);
            authToken = data.token;
            checkLoginState();
            alert("Logged in successfully!");
        } else {
            alert(data.msg || "Login failed");
        }
    } catch (err) { console.error(err); alert("Error logging in"); }
});

// Register
registerBtn.addEventListener('click', async () => {
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const res = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();

        if (data.token) {
            localStorage.setItem('token', data.token);
            authToken = data.token;
            checkLoginState();
            alert("Account created!");
        } else {
            alert(data.msg || "Registration failed");
        }
    } catch (err) { console.error(err); alert("Error registering"); }
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    authToken = null;
    checkLoginState();
    resultArea.classList.add('hidden');
});

function checkLoginState() {
    if (authToken) {
        loginForm.classList.add('hidden');
        registerForm.classList.add('hidden');
        userInfo.classList.remove('hidden');
        // Show save button if a workout is generated
        if (currentExercises.length > 0) saveWorkoutBtn.classList.remove('hidden');
    } else {
        loginForm.classList.remove('hidden');
        userInfo.classList.add('hidden');
        saveWorkoutBtn.classList.add('hidden');
    }
}

// --- WORKOUT GENERATOR LOGIC ---

generateBtn.addEventListener('click', async () => {
    const focus = document.getElementById('focus').value;
    const equipment = document.getElementById('equipment').value;

    generateBtn.innerText = "Generating...";
    generateBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_URL}/api/v1/generate-workout?focus=${focus}&equipment=${equipment}`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const data = await response.json();
        currentExercises = data.exercises; // STORE FOR SAVING
        routineTitle.innerText = data.routine_title;
        renderExerciseList(data.exercises);

        // UI Updates
        resultArea.classList.remove('hidden');
        if (authToken) saveWorkoutBtn.classList.remove('hidden');

        // Reset Progress
        progressBar.style.width = '0%';
        progressText.innerText = '0%';
        progressContainer.classList.remove('hidden');

    } catch (error) {
        console.error("Error:", error);
        alert("Could not get workout.");
    } finally {
        generateBtn.innerText = "Generate Workout";
        generateBtn.disabled = false;
    }
});

function renderExerciseList(exercises) {
    exerciseList.innerHTML = '';
    exercises.forEach((exercise, index) => {
        const li = document.createElement('li');
        // Same logic as before for rendering...
        const imageHTML = exercise.gifUrl 
            ? `<div class="exercise-image"><img src="${exercise.gifUrl}" alt="${exercise.name}" loading="lazy"></div>` 
            : '';

        li.innerHTML = `
            <div class="exercise-header">
                <strong>${index + 1}. ${exercise.name}</strong>
                ${exercise.difficulty ? `<span class="difficulty ${exercise.difficulty}">${exercise.difficulty}</span>` : ''}
            </div>
            ${imageHTML}
            <div class="exercise-details">
                <small><strong>${exercise.sets} sets × ${exercise.reps} reps</strong></small>
            </div>
            ${exercise.instructions ? `
                <details class="instructions"><summary>📋 View Instructions</summary><p>${exercise.instructions}</p></details>
            ` : ''}
            <label class="completion-checkbox"><input type="checkbox" class="exercise-check"> Mark as Done</label>
        `;
        exerciseList.appendChild(li);
    });

    // Re-attach progress logic
    attachProgressLogic();
}

// --- SAVE & VIEW FEATURES ---

// Save Workout
saveWorkoutBtn.addEventListener('click', async () => {
    if (!authToken) return alert("Please login to save workouts");

    const title = routineTitle.innerText;
    
    try {
        const res = await fetch(`${API_URL}/api/workouts/save`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': authToken // SEND TOKEN HERE
            },
            body: JSON.stringify({ title, exercises: currentExercises })
        });
        
        if (res.ok) {
            alert("Workout Saved Successfully! ⭐");
            saveWorkoutBtn.innerText = "Saved!";
            saveWorkoutBtn.disabled = true;
        }
    } catch (err) { console.error(err); alert("Error saving workout"); }
});

// View Saved
viewSavedBtn.addEventListener('click', async () => {
    try {
        const res = await fetch(`${API_URL}/api/workouts/my-workouts`, {
            headers: { 'x-auth-token': authToken }
        });
        const workouts = await res.json();
        
        savedList.innerHTML = '';
        if (workouts.length === 0) savedList.innerHTML = '<p>No saved workouts yet.</p>';
        
        workouts.forEach(w => {
            const div = document.createElement('div');
            div.className = 'saved-card';
            div.innerHTML = `
                <h4>${w.title}</h4>
                <p>Saved on: ${new Date(w.savedAt).toLocaleDateString()}</p>
                <button onclick="alert('Load this workout logic here!')">Load</button>
            `;
            savedList.appendChild(div);
        });
        
        savedWorkoutsArea.classList.remove('hidden');
    } catch (err) { console.error(err); }
});

closeSavedBtn.addEventListener('click', () => {
    savedWorkoutsArea.classList.add('hidden');
});

// Helper for Progress
function attachProgressLogic() {
    const checkboxes = document.querySelectorAll('.exercise-check');
    checkboxes.forEach(box => {
        box.addEventListener('change', () => {
            const total = checkboxes.length;
            const checked = document.querySelectorAll('.exercise-check:checked').length;
            const pct = Math.round((checked / total) * 100);
            progressBar.style.width = `${pct}%`;
            progressText.innerText = `${pct}%`;
            if (pct === 100) setTimeout(() => alert("🎉 Workout Complete!"), 200);
        });
    });
}