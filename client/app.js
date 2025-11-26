const generateBtn = document.getElementById('generateBtn');
const routineTitle = document.getElementById('routine-title');
const exerciseList = document.getElementById('exercise-list');
const resultArea = document.getElementById('result-area');

const API_URL = "https://spontaneity-fit-api.onrender.com/api/v1/generate-workout";

generateBtn.addEventListener('click', async () => {
    const focus = document.getElementById('focus').value;
    const equipment = document.getElementById('equipment').value;

    generateBtn.innerText = "Waking up server...";
    generateBtn.disabled = true;
    
    try {
        // Longer timeout for cold starts
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
        
        const response = await fetch(`${API_URL}?focus=${focus}&equipment=${equipment}`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        // Update UI
        routineTitle.innerText = data.routine_title;
        exerciseList.innerHTML = '';

        data.exercises.forEach(exercise => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${exercise.name}</strong> <br>
                <small>${exercise.sets} sets x ${exercise.reps} reps</small>
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