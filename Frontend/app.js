const generateBtn = document.getElementById('generateBtn');
const routineTitle = document.getElementById('routine-title');
const exerciseList = document.getElementById('exercise-list');
const resultArea = document.getElementById('result-area');

// This is your live Render URL
const API_URL = "https://spontaneity-fit-api.onrender.com/api/v1/generate-workout";

generateBtn.addEventListener('click', async () => {
    // 1. Get values from dropdowns
    const focus = document.getElementById('focus').value;
    const equipment = document.getElementById('equipment').value;

    // 2. Change button text to show loading
    generateBtn.innerText = "Generating...";
    
    try {
        // 3. Call your Live API
        const response = await fetch(`${API_URL}?focus=${focus}&equipment=${equipment}`);
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        // 4. Update the UI
        routineTitle.innerText = data.routine_title;
        
        // Clear previous list
        exerciseList.innerHTML = '';

        // Add each exercise to the list
        data.exercises.forEach(exercise => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${exercise.name}</strong> <br>
                <small>${exercise.sets} sets x ${exercise.reps} reps</small>
            `;
            exerciseList.appendChild(li);
        });

        // Show the result area
        resultArea.classList.remove('hidden');

    } catch (error) {
        console.error("Error:", error);
        alert("Could not get workout. Is your Render server awake?");
    } finally {
        generateBtn.innerText = "Generate Workout";
    }
});