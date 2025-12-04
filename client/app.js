

// ==========================================
// 1. VARIABLE DECLARATIONS (MUST BE FIRST)
// ==========================================

// Views (The two main screens)
const authView = document.getElementById('auth-view');
const appView = document.getElementById('app-view');

// Auth Forms
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Auth Buttons
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');

// App Controls
const generateBtn = document.getElementById('generateBtn');
const routineTitle = document.getElementById('routine-title');
const exerciseList = document.getElementById('exercise-list');
const resultArea = document.getElementById('result-area');
const saveWorkoutBtn = document.getElementById('saveWorkoutBtn');

// Progress Bar
const progressBar = document.getElementById('progress-bar-fill');
const progressText = document.getElementById('progress-text');
const progressContainer = document.getElementById('progress-container');

// Saved Workouts
const savedList = document.getElementById('saved-list');
const savedCount = document.getElementById('saved-count');

// State Variables
let currentExercises = [];
let authToken = localStorage.getItem('token');
let isWorkoutSaved = false;
let currentWorkoutId = null;

const API_URL = "https://spontaneity-fit-api.onrender.com";
// Use "http://localhost:3000" if running locally

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

function checkLoginState() {
    if (authToken) {
        authView.classList.add('hidden');
        appView.classList.remove('hidden');
        
        if (currentExercises.length === 0) {
            resultArea.classList.add('hidden');
        }
        
        // Load saved workouts when app loads
        loadSavedWorkouts();
    } else {
        authView.classList.remove('hidden');
        appView.classList.add('hidden');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    }
}

function renderExerciseList(exercises) {
    exerciseList.innerHTML = '';
    
    console.log(`Rendering ${exercises.length} exercises`); // Debug log
    
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

    attachProgressLogic();
    
    // Log checkbox count after rendering
    const checkboxCount = document.querySelectorAll('.exercise-check').length;
    console.log(`Total checkboxes rendered: ${checkboxCount}`); // Debug log
}

function resetProgressBar() {
    progressBar.style.width = '0%';
    progressText.innerText = '0%';
    progressContainer.classList.remove('hidden');
    
    document.querySelectorAll('.exercise-check').forEach(box => {
        box.checked = false;
        box.closest('li').classList.remove('completed');
    });
}

function attachProgressLogic() {
    const checkboxes = document.querySelectorAll('.exercise-check');
    
    console.log(`Attaching progress logic to ${checkboxes.length} checkboxes`); // Debug
    
    checkboxes.forEach(box => {
        box.addEventListener('change', (e) => {
            const li = e.target.closest('li');
            if (e.target.checked) {
                li.classList.add('completed');
            } else {
                li.classList.remove('completed');
            }

            const total = checkboxes.length;
            const checked = document.querySelectorAll('.exercise-check:checked').length;
            const pct = Math.round((checked / total) * 100);
            
            console.log(`Progress: ${checked}/${total} = ${pct}%`); // Debug
            
            progressBar.style.width = `${pct}%`;
            progressText.innerText = `${pct}%`;
            
            if (isWorkoutSaved && currentWorkoutId) {
                saveWorkoutBtn.innerText = "💾 Update Progress";
                saveWorkoutBtn.disabled = false;
            }
            
            if (pct === 100) {
                setTimeout(() => {
                    alert("🎉 Workout Complete! Great job!");
                }, 200);
            }
        });
    });
}

async function loadSavedWorkouts() {
    if (!authToken) return;
    
    try {
        const res = await fetch(`${API_URL}/api/workouts/my-workouts`, {
            headers: { 'x-auth-token': authToken }
        });
        const workouts = await res.json();
        
        savedCount.innerText = workouts.length;
        savedList.innerHTML = '';
        
        if (workouts.length === 0) {
            savedList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💪</div>
                    <p>No saved workouts yet.<br>Generate and save your first workout!</p>
                </div>
            `;
        } else {
            workouts.forEach(w => {
                const div = document.createElement('div');
                div.className = 'saved-card';
                
                const progress = w.progress || 0;
                
                // Add completed class if workout is 100% done
                if (progress === 100) {
                    div.classList.add('completed');
                }

                const completionBadge = progress === 100 
                    ? '<span class="completion-badge">COMPLETED</span>' 
                    : '';

                div.innerHTML = `
                    <div class="saved-card-header">
                        <div class="saved-card-title">
                            <h4>${w.title}${completionBadge}</h4>
                            <small>${new Date(w.savedAt).toLocaleDateString()}</small>
                        </div>
                        <button class="delete-btn" data-id="${w._id}" title="Delete workout">×</button>
                    </div>
                    <p class="saved-card-info">💪 ${w.exercises.length} exercises</p>
                    <div class="saved-progress">
                        <div class="saved-progress-text">Progress: ${progress}%</div>
                        <div class="saved-progress-bar-bg">
                            <div class="saved-progress-bar-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                    <button class="load-saved-btn" data-id="${w._id}">Load Workout</button>
                `;
                
                div.querySelector('.load-saved-btn').addEventListener('click', () => {
                    currentExercises = w.exercises;
                    currentWorkoutId = w._id;
                    routineTitle.innerText = w.title;
                    isWorkoutSaved = true;
                    
                    renderExerciseList(w.exercises);
                    resultArea.classList.remove('hidden');
                    
                    resetProgressBar();
                    
                    if (w.progress && w.completedExercises) {
                        restoreProgress(w.completedExercises);
                    }
                    
                    saveWorkoutBtn.disabled = false;
                    saveWorkoutBtn.innerText = "💾 Update Progress";
                    saveWorkoutBtn.style.opacity = "1";
                    
                    resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });

                div.querySelector('.delete-btn').addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this workout?')) {
                        await deleteWorkout(w._id);
                    }
                });

                savedList.appendChild(div);
            });
        }
    } catch (err) { 
        console.error(err);
        savedList.innerHTML = '<p class="empty-state">Error loading workouts</p>';
    }
}

async function deleteWorkout(workoutId) {
    try {
        const res = await fetch(`${API_URL}/api/workouts/${workoutId}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': authToken }
        });
        
        if (res.ok) {
            alert('✅ Workout deleted successfully!');
            
            if (currentWorkoutId === workoutId) {
                currentExercises = [];
                currentWorkoutId = null;
                isWorkoutSaved = false;
                resultArea.classList.add('hidden');
            }
            
            loadSavedWorkouts();
        } else {
            throw new Error('Failed to delete');
        }
    } catch (err) {
        console.error(err);
        alert('Error deleting workout');
    }
}

async function updateWorkoutProgress(workoutId) {
    const checkboxes = document.querySelectorAll('.exercise-check');
    const total = checkboxes.length;
    const checked = document.querySelectorAll('.exercise-check:checked').length;
    const progress = Math.round((checked / total) * 100);
    
    const completedExercises = [];
    checkboxes.forEach((box, index) => {
        if (box.checked) {
            completedExercises.push(index);
        }
    });
    
    try {
        const res = await fetch(`${API_URL}/api/workouts/${workoutId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': authToken 
            },
            body: JSON.stringify({ 
                progress,
                completedExercises 
            })
        });
        
        if (res.ok) {
            alert('✅ Progress updated!');
            loadSavedWorkouts();
        }
    } catch (err) {
        console.error(err);
        alert('Error updating progress');
    }
}

function restoreProgress(completedExercises) {
    if (!completedExercises || completedExercises.length === 0) return;
    
    const checkboxes = document.querySelectorAll('.exercise-check');
    completedExercises.forEach(index => {
        if (checkboxes[index]) {
            checkboxes[index].checked = true;
            checkboxes[index].closest('li').classList.add('completed');
        }
    });
    
    const total = checkboxes.length;
    const checked = completedExercises.length;
    const pct = Math.round((checked / total) * 100);
    progressBar.style.width = `${pct}%`;
    progressText.innerText = `${pct}%`;
}

// ==========================================
// 3. INITIALIZE ON PAGE LOAD
// ==========================================

checkLoginState();

// ==========================================
// 4. AUTH EVENT LISTENERS
// ==========================================

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
    
    currentExercises = [];
    isWorkoutSaved = false;
    currentWorkoutId = null;
    resultArea.classList.add('hidden');
});

// ==========================================
// 5. WORKOUT EVENT LISTENERS
// ==========================================

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
        
        currentExercises = data.exercises;
        routineTitle.innerText = data.routine_title;
        isWorkoutSaved = false;
        currentWorkoutId = null;
        
        renderExerciseList(data.exercises);

        resultArea.classList.remove('hidden');
        
        saveWorkoutBtn.innerText = "⭐ Save This Workout";
        saveWorkoutBtn.disabled = false;
        saveWorkoutBtn.style.opacity = "1";

        resetProgressBar();

    } catch (error) {
        console.error("Error:", error);
        alert("Could not get workout. Please try again.");
    } finally {
        generateBtn.innerText = "Generate Workout";
        generateBtn.disabled = false;
    }
});

// SAVE WORKOUT
saveWorkoutBtn.addEventListener('click', async () => {
    if (!authToken) {
        alert("Please login to save workouts");
        return;
    }

    if (isWorkoutSaved && currentWorkoutId) {
        await updateWorkoutProgress(currentWorkoutId);
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
            body: JSON.stringify({ 
                title, 
                exercises: currentExercises,
                progress: 0 
            })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            isWorkoutSaved = true;
            currentWorkoutId = data._id;
            alert("✅ Workout Saved Successfully!");
            saveWorkoutBtn.innerText = "💾 Update Progress";
            saveWorkoutBtn.style.opacity = "1";
            saveWorkoutBtn.disabled = false;
            
            loadSavedWorkouts();
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