

// Views (The two main screens)
const authView = document.getElementById('auth-view');
const appView = document.getElementById('app-view');

// Auth Forms (Inside the auth-view)
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Auth Buttons
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');

// App Controls (Inside the app-view)
const generateBtn = document.getElementById('generateBtn');
const routineTitle = document.getElementById('routine-title');
const exerciseList = document.getElementById('exercise-list');
const resultArea = document.getElementById('result-area');
const saveWorkoutBtn = document.getElementById('saveWorkoutBtn');
const viewSavedBtn = document.getElementById('viewSavedBtn');

// Progress Bar
const progressBar = document.getElementById('progress-bar-fill');
const progressText = document.getElementById('progress-text');
const progressContainer = document.getElementById('progress-container');

// Saved Workouts Modal
const savedWorkoutsArea = document.getElementById('saved-workouts-area');
const savedList = document.getElementById('saved-list');
const closeSavedBtn = document.getElementById('closeSavedBtn');

// State Variables
let currentExercises = []; // Stores the generated workout for saving
let authToken = localStorage.getItem('token'); // Gets token if user was already logged in

const API_URL = "https://spontaneity-fit-api.onrender.com"; 
// Use "http://localhost:3000" if running locally

// Run immediately on page load to decide which screen to show
checkLoginState();



function checkLoginState() {
    if (authToken) {
        // STATE: User IS Logged In
        // 1. Hide the Login Screen
        authView.classList.add('hidden');
        
        // 2. Show the Main App Screen
        appView.classList.remove('hidden');
        
        // 3. Reset the "Saved" button state just in case
        if (currentExercises.length === 0) {
            resultArea.classList.add('hidden');
        }
    } else {
        // STATE: User is NOT Logged In
        // 1. Show the Login Screen
        authView.classList.remove('hidden');
        
        // 2. Hide the Main App Screen completely
        appView.classList.add('hidden');
        
        // 3. Reset forms to default (show login, hide register)
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    }
}



// Toggle between Login and Register forms
document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// LOGIN Handler
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
            checkLoginState(); // This triggers the screen swap!
            // Optional: alert("Logged in successfully!");
        } else {
            alert(data.msg || "Login failed");
        }
    } catch (err) { console.error(err); alert("Error logging in"); }
});

// REGISTER Handler
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
            checkLoginState(); // This triggers the screen swap!
            alert("Account created! Welcome.");
        } else {
            alert(data.msg || "Registration failed");
        }
    } catch (err) { console.error(err); alert("Error registering"); }
});

// LOGOUT Handler
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    authToken = null;
    checkLoginState(); // Swaps back to login screen
    
    // Clean up current session data
    currentExercises = [];
    resultArea.classList.add('hidden');
    savedWorkoutsArea.classList.add('hidden');
});



generateBtn.addEventListener('click', async () => {
    const focus = document.getElementById('focus').value;
    const equipment = document.getElementById('equipment').value;

    generateBtn.innerText = "Generating...";
    generateBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_URL}/api/v1/generate-workout?focus=${focus}&equipment=${equipment}`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const data = await response.json();
        
        // Store data for saving later
        currentExercises = data.exercises;
        routineTitle.innerText = data.routine_title;
        
        // Render the list
        renderExerciseList(data.exercises);

        // UI Updates
        resultArea.classList.remove('hidden');
        
        // Reset Save Button
        saveWorkoutBtn.innerText = "⭐ Save This Workout";
        saveWorkoutBtn.disabled = false;

        // Reset Progress Bar
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

    // Re-attach progress listeners to the new checkboxes
    attachProgressLogic();
}

// Save Workout
saveWorkoutBtn.addEventListener('click', async () => {
    if (!authToken) return alert("Please login to save workouts");

    const title = routineTitle.innerText;
    
    try {
        const res = await fetch(`${API_URL}/api/workouts/save`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': authToken 
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

// View Saved Workouts
viewSavedBtn.addEventListener('click', async () => {
    try {
        const res = await fetch(`${API_URL}/api/workouts/my-workouts`, {
            headers: { 'x-auth-token': authToken }
        });
        const workouts = await res.json();
        
        savedList.innerHTML = '';
        if (workouts.length === 0) {
            savedList.innerHTML = '<p style="text-align:center; padding: 20px;">No saved workouts yet.</p>';
        }
        
        workouts.forEach(w => {
            const div = document.createElement('div');
            div.className = 'saved-card';
            // Styling for the saved card is done here or in CSS
            div.style.border = "1px solid #ddd";
            div.style.padding = "10px";
            div.style.marginBottom = "10px";
            div.style.borderRadius = "5px";
            div.style.backgroundColor = "#fff";

            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h4 style="margin:0;">${w.title}</h4>
                    <small>${new Date(w.savedAt).toLocaleDateString()}</small>
                </div>
                <p style="font-size: 0.9em; color: #666; margin: 5px 0;">${w.exercises.length} exercises</p>
                <button class="load-saved-btn" style="background-color:#28a745; margin-top:5px; padding: 5px 10px; font-size: 14px;">Load Workout</button>
            `;
            
            // Add click listener to the "Load" button inside this card
            div.querySelector('.load-saved-btn').addEventListener('click', () => {
                currentExercises = w.exercises;
                routineTitle.innerText = w.title;
                renderExerciseList(w.exercises);
                resultArea.classList.remove('hidden');
                savedWorkoutsArea.classList.add('hidden'); // Close modal
                
                // Hide save button since it's already saved
                saveWorkoutBtn.disabled = true;
                saveWorkoutBtn.innerText = "Loaded from Saves";
            });

            savedList.appendChild(div);
        });
        
        savedWorkoutsArea.classList.remove('hidden');
    } catch (err) { console.error(err); }
});

closeSavedBtn.addEventListener('click', () => {
    savedWorkoutsArea.classList.add('hidden');
});


// ==========================================
// 6. HELPER FUNCTIONS
// ==========================================

function attachProgressLogic() {
    const checkboxes = document.querySelectorAll('.exercise-check');
    checkboxes.forEach(box => {
        box.addEventListener('change', (e) => {
            // Visual strikethrough effect
            const li = e.target.closest('li');
            if (e.target.checked) li.classList.add('completed');
            else li.classList.remove('completed');

            // Calculate Math
            const total = checkboxes.length;
            const checked = document.querySelectorAll('.exercise-check:checked').length;
            const pct = Math.round((checked / total) * 100);
            
            // Update UI
            progressBar.style.width = `${pct}%`;
            progressText.innerText = `${pct}%`;
            
            if (pct === 100) setTimeout(() => alert("🎉 Workout Complete! Great job!"), 200);
        });
    });
}