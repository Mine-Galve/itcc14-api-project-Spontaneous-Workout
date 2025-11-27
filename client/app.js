const generateBtn = document.getElementById('generateBtn');
const routineTitle = document.getElementById('routine-title');
const exerciseList = document.getElementById('exercise-list');
const resultArea = document.getElementById('result-area');

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

        data.exercises.forEach((exercise, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="exercise-header">
                    <strong>${index + 1}. ${exercise.name}</strong>
                    ${exercise.difficulty ? `<span class="difficulty ${exercise.difficulty}">${exercise.difficulty}</span>` : ''}
                </div>
                <div class="exercise-details">
                    <small><strong>${exercise.sets} sets × ${exercise.reps} reps</strong></small>
                    ${exercise.musclesWorked ? `<small class="muscles">💪 ${exercise.musclesWorked.join(', ')}</small>` : ''}
                </div>
                ${exercise.instructions ? `
                    <details class="instructions">
                        <summary>📋 View Instructions</summary>
                        <p>${exercise.instructions}</p>
                    </details>
                ` : ''}
            `;
            exerciseList.appendChild(li);
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