

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
let isWorkoutSaved = false; // Track if current workout is saved

const API_URL = "https://spontaneity-fit-api.onrender.com"; 
// Use "http://localhost:3000" if running locally

// Run immediately on page load to decide which screen to show
checkLoginState();

function checkLoginState() {
    if (authToken) {
        authView.classList.add('hidden');
        appView.classList.remove('hidden');
        
        if (currentExercises.length === 0) {
            resultArea.classList.add('hidden');
        }
    } else {
        authView.classList.remove('hidden');
        appView.classList.add('hidden');
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
    
    if (!email || !password) {
        alert("Please fill in all fields");
        return;
    }
    
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
        } else {
            alert(data.msg || "Login failed");
        }
    } catch (err) { 
        console.error(err); 
        alert("Error logging in"); 
    }
});

// REGISTER Handler
registerBtn.addEventListener('click', async () => {
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    if (!username || !email || !password) {
        alert("Please fill in all fields");
        return;
    }

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
            alert("Account created! Welcome.");
        } else {
            alert(data.msg || "Registration failed");
        }
    } catch (err) { 
        console.error(err); 
        alert("Error registering"); 
    }
});

// LOGOUT Handler
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    authToken = null;
    checkLoginState();
    
    // Clean up current session data
    currentExercises = [];
    isWorkoutSaved = false;
    resultArea.classList.add('hidden');
    savedWorkoutsArea.classList.add('hidden');
});

// GENERATE WORKOUT
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
        isWorkoutSaved = false; // Reset saved state for new workout
        
        // Render the list
        renderExerciseList(data.exercises);

        // UI Updates
        resultArea.classList.remove('hidden');
        
        // Reset Save Button - FIX: Enable button for new workout
        saveWorkoutBtn.innerText = "⭐ Save This Workout";
        saveWorkoutBtn.disabled = false;
        saveWorkoutBtn.style.opacity = "1";

        // Reset Progress Bar
        resetProgressBar();

    } catch (error) {
        console.error("Error:", error);
        alert("Could not get workout. Please try again.");
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
                <details class="instructions">
                    <summary>📋 View Instructions</summary>
                    <p>${exercise.instructions}</p>
                </details>
            ` : ''}
            <label class="completion-checkbox">
                <input type="checkbox" class="exercise-check"> 
                <span>Mark as Done</span>
            </label>
        `;
        exerciseList.appendChild(li);
    });

    // Re-attach progress listeners to the new checkboxes
    attachProgressLogic();
}

// FIX: Reset progress bar function
function resetProgressBar() {
    progressBar.style.width = '0%';
    progressText.innerText = '0%';
    progressContainer.classList.remove('hidden');
    
    // Uncheck all checkboxes
    document.querySelectorAll('.exercise-check').forEach(box => {
        box.checked = false;
        box.closest('li').classList.remove('completed');
    });
}

// Save Workout
saveWorkoutBtn.addEventListener('click', async () => {
    if (!authToken) {
        alert("Please login to save workouts");
        return;
    }

    if (isWorkoutSaved) {
        alert("This workout is already saved!");
        return;
    }

    const title = routineTitle.innerText;
    
    saveWorkoutBtn.innerText = "Saving...";
    saveWorkoutBtn.disabled = true;
    
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
            isWorkoutSaved = true;
            alert("✅ Workout Saved Successfully!");
            saveWorkoutBtn.innerText = "✓ Saved";
            saveWorkoutBtn.style.opacity = "0.6";
        } else {
            throw new Error("Failed to save");
        }
    } catch (err) { 
        console.error(err); 
        alert("Error saving workout");
        saveWorkoutBtn.innerText = "⭐ Save This Workout";
        saveWorkoutBtn.disabled = false;
    }
});

// View Saved Workouts - FIX: Improved load functionality
viewSavedBtn.addEventListener('click', async () => {
    if (!authToken) {
        alert("Please login to view saved workouts");
        return;
    }
    
    try {
        const res = await fetch(`${API_URL}/api/workouts/my-workouts`, {
            headers: { 'x-auth-token': authToken }
        });
        const workouts = await res.json();
        
        savedList.innerHTML = '';
        
        if (workouts.length === 0) {
            savedList.innerHTML = '<p class="empty-state">📋 No saved workouts yet.<br>Generate and save your first workout!</p>';
        } else {
            workouts.forEach(w => {
                const div = document.createElement('div');
                div.className = 'saved-card';

                div.innerHTML = `
                    <div class="saved-card-header">
                        <h4>${w.title}</h4>
                        <small>${new Date(w.savedAt).toLocaleDateString()}</small>
                    </div>
                    <p class="saved-card-info">💪 ${w.exercises.length} exercises</p>
                    <button class="load-saved-btn">Load Workout</button>
                `;
                
                // FIX: Improved load button functionality
                div.querySelector('.load-saved-btn').addEventListener('click', () => {
                    currentExercises = w.exercises;
                    routineTitle.innerText = w.title;
                    isWorkoutSaved = true; // Mark as already saved
                    
                    renderExerciseList(w.exercises);
                    resultArea.classList.remove('hidden');
                    savedWorkoutsArea.classList.add('hidden');
                    
                    // Reset progress for loaded workout
                    resetProgressBar();
                    
                    // Update save button for loaded workout
                    saveWorkoutBtn.disabled = true;
                    saveWorkoutBtn.innerText = "✓ Already Saved";
                    saveWorkoutBtn.style.opacity = "0.6";
                });

                savedList.appendChild(div);
            });
        }
        
        savedWorkoutsArea.classList.remove('hidden');
    } catch (err) { 
        console.error(err);
        alert("Error loading saved workouts");
    }
});

closeSavedBtn.addEventListener('click', () => {
    savedWorkoutsArea.classList.add('hidden');
});

// Progress Logic
function attachProgressLogic() {
    const checkboxes = document.querySelectorAll('.exercise-check');
    checkboxes.forEach(box => {
        box.addEventListener('change', (e) => {
            // Visual strikethrough effect
            const li = e.target.closest('li');
            if (e.target.checked) {
                li.classList.add('completed');
            } else {
                li.classList.remove('completed');
            }

            // Calculate progress
            const total = checkboxes.length;
            const checked = document.querySelectorAll('.exercise-check:checked').length;
            const pct = Math.round((checked / total) * 100);
            
            // Update UI
            progressBar.style.width = `${pct}%`;
            progressText.innerText = `${pct}%`;
            
            if (pct === 100) {
                setTimeout(() => {
                    alert("🎉 Workout Complete! Great job!");
                }, 200);
            }
        });
    });
}