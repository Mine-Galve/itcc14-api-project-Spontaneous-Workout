const generateBtn = document.getElementById('generateBtn');
const routineTitle = document.getElementById('routine-title');
const exerciseList = document.getElementById('exercise-list');
const resultArea = document.getElementById('result-area');

// Progress Bar Elements (Make sure you added these to index.html)
const progressBar = document.getElementById('progress-bar-fill');
const progressText = document.getElementById('progress-text');
const progressContainer = document.getElementById('progress-container');

const API_URL = "https://spontaneity-fit-api.onrender.com/api/v1/generate-workout";

generateBtn.addEventListener('click', async () => {
    const focus = document.getElementById('focus').value;
    const equipment = document.getElementById('equipment').value;

    generateBtn.innerText = "Generating...";
    generateBtn.disabled = true;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        
        const response = await fetch(`${API_URL}?focus=${focus}&equipment=${equipment}`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        routineTitle.innerText = data.routine_title;
        exerciseList.innerHTML = '';

        // --- NEW: Reset Progress Bar ---
        if (progressContainer) {
            progressBar.style.width = '0%';
            progressText.innerText = '0%';
            progressContainer.classList.remove('hidden');
        }

        data.exercises.forEach((exercise, index) => {
            const li = document.createElement('li');

            // --- NEW: Check for GIF/Image ---
            const imageHTML = exercise.gifUrl 
                ? `<div class="exercise-image">
                     <img src="${exercise.gifUrl}" alt="${exercise.name}" loading="lazy">
                   </div>` 
                : '';

            li.innerHTML = `
                <div class="exercise-header">
                    <strong>${index + 1}. ${exercise.name}</strong>
                    ${exercise.difficulty ? `<span class="difficulty ${exercise.difficulty}">${exercise.difficulty}</span>` : ''}
                </div>
                
                ${imageHTML}  <div class="exercise-details">
                    <small><strong>${exercise.sets} sets × ${exercise.reps} reps</strong></small>
                    ${exercise.musclesWorked ? `<small class="muscles">💪 ${exercise.musclesWorked.join(', ')}</small>` : ''}
                </div>
                
                ${exercise.instructions ? `
                    <details class="instructions">
                        <summary>📋 View Instructions</summary>
                        <p>${exercise.instructions}</p>
                    </details>
                ` : ''}

                <label class="completion-checkbox">
                    <input type="checkbox" class="exercise-check"> Mark as Done
                </label>
            `;
            exerciseList.appendChild(li);
        });

        // --- NEW: Progress Logic ---
        const checkboxes = document.querySelectorAll('.exercise-check');
        const totalExercises = checkboxes.length;

        checkboxes.forEach(box => {
            box.addEventListener('change', (e) => {
                // 1. Toggle visual style (fade out item)
                const listItem = e.target.closest('li');
                if (e.target.checked) {
                    listItem.classList.add('completed');
                } else {
                    listItem.classList.remove('completed');
                }

                // 2. Calculate Progress
                const checkedCount = document.querySelectorAll('.exercise-check:checked').length;
                const percentage = Math.round((checkedCount / totalExercises) * 100);

                // 3. Update Bar
                if (progressBar) {
                    progressBar.style.width = `${percentage}%`;
                    progressText.innerText = `${percentage}%`;
                }

                // 4. Celebration
                if (percentage === 100) {
                    setTimeout(() => alert("🎉 Workout Complete! Great job!"), 200);
                }
            });
        });

        resultArea.classList.remove('hidden');

    } catch (error) {
        console.error("Error:", error);
        if (error.name === 'AbortError') {
            alert("Server is taking too long to wake up. Please wait 30 seconds and try again.");
        } else {
            alert("Could not get workout. The server might be starting up. Please try again in a moment.");
        }
    } finally {
        generateBtn.innerText = "Generate Workout";
        generateBtn.disabled = false;
    }
});