document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const strengthForm = document.getElementById("strengthForm");
    const workoutTable = document.getElementById("workoutTable").querySelector("tbody");
    const exportBtn = document.getElementById("exportData");
    const exerciseContainer = document.getElementById("exerciseContainer");
    const addExerciseBtn = document.getElementById("addExercise");

    // Workout Data
    let workouts = JSON.parse(localStorage.getItem("strengthWorkouts")) || [];
    let workoutChart = null;
    let currentSort = { column: "date", direction: "desc" };

    // Initialize
    renderWorkoutTable();
    updateStats();
    renderChart();
    setupSorting();

    // Set default date to today
    document.getElementById("workoutDate").value = new Date().toISOString().split("T")[0];

    // Add Exercise
    addExerciseBtn.addEventListener("click", addExercise);

    function addExercise() {
        const exerciseId = Date.now();
        const exerciseHtml = `
            <div class="exercise-item" data-id="${exerciseId}">
                <span class="remove-exercise" onclick="removeExercise(${exerciseId})"><i class="fas fa-times"></i></span>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="exerciseName-${exerciseId}"><i class="fas fa-dumbbell"></i> Exercise</label>
                        <input type="text" id="exerciseName-${exerciseId}" required placeholder="e.g. Bench Press">
                    </div>
                    <div class="form-group">
                        <label for="sets-${exerciseId}"><i class="fas fa-layer-group"></i> Sets</label>
                        <input type="number" id="sets-${exerciseId}" min="1" required>
                    </div>
                    <div class="form-group">
                        <label for="reps-${exerciseId}"><i class="fas fa-redo"></i> Reps</label>
                        <input type="number" id="reps-${exerciseId}" min="1" required>
                    </div>
                    <div class="form-group">
                        <label for="weight-${exerciseId}"><i class="fas fa-weight-hanging"></i> Weight (kg)</label>
                        <input type="number" id="weight-${exerciseId}" step="0.5" min="0">
                    </div>
                </div>
            </div>
        `;
        exerciseContainer.insertAdjacentHTML("beforeend", exerciseHtml);
    }

    window.removeExercise = function(id) {
        document.querySelector(`.exercise-item[data-id="${id}"]`).remove();
    };

    // Form Submission
    strengthForm.addEventListener("submit", function(e) {
        e.preventDefault();

        // Collect exercises
        const exerciseItems = exerciseContainer.querySelectorAll(".exercise-item");
        const exercises = Array.from(exerciseItems).map(item => {
            const id = item.dataset.id;
            return {
                name: document.getElementById(`exerciseName-${id}`).value,
                sets: parseInt(document.getElementById(`sets-${id}`).value),
                reps: parseInt(document.getElementById(`reps-${id}`).value),
                weight: parseFloat(document.getElementById(`weight-${id}`).value) || 0
            };
        });

        const workout = {
            id: Date.now(),
            date: document.getElementById("workoutDate").value,
            type: document.getElementById("workoutType").value,
            duration: parseInt(document.getElementById("duration").value),
            calories: parseInt(document.getElementById("calories").value) || 0,
            exercises: exercises,
            notes: document.getElementById("notes").value
        };

        // Check if editing existing workout
        const editId = strengthForm.dataset.editId;
        if (editId) {
            const index = workouts.findIndex(w => w.id == editId);
            if (index !== -1) {
                workouts[index] = workout;
            }
            delete strengthForm.dataset.editId;
        } else {
            workouts.unshift(workout);
        }

        saveWorkouts();
        renderWorkoutTable();
        updateStats();
        renderChart();
        strengthForm.reset();
        exerciseContainer.innerHTML = "";
        document.getElementById("workoutDate").value = new Date().toISOString().split("T")[0];
    });

    // Render workout table
    function renderWorkoutTable() {
        workoutTable.innerHTML = workouts.map(workout => `
            <tr data-id="${workout.id}">
                <td>${workout.date}</td>
                <td>${workout.type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</td>
                <td>${workout.duration} min</td>
                <td>${workout.exercises.length}</td>
                <td>${workout.calories} cal</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="editWorkout(${workout.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteWorkout(${workout.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join("");
    }

    // Edit workout
    window.editWorkout = function(id) {
        const workout = workouts.find(w => w.id == id);
        if (workout) {
            document.getElementById("workoutType").value = workout.type;
            document.getElementById("workoutDate").value = workout.date;
            document.getElementById("duration").value = workout.duration;
            document.getElementById("calories").value = workout.calories;
            document.getElementById("notes").value = workout.notes || "";
            
            // Clear and re-add exercises
            exerciseContainer.innerHTML = "";
            workout.exercises.forEach(ex => {
                addExercise();
                const lastExercise = exerciseContainer.lastElementChild;
                document.getElementById(`exerciseName-${lastExercise.dataset.id}`).value = ex.name;
                document.getElementById(`sets-${lastExercise.dataset.id}`).value = ex.sets;
                document.getElementById(`reps-${lastExercise.dataset.id}`).value = ex.reps;
                document.getElementById(`weight-${lastExercise.dataset.id}`).value = ex.weight;
            });

            strengthForm.dataset.editId = id;
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Delete workout
    window.deleteWorkout = function(id) {
        if (confirm("Are you sure you want to delete this workout?")) {
            workouts = workouts.filter(w => w.id != id);
            saveWorkouts();
            renderWorkoutTable();
            updateStats();
            renderChart();
        }
    };

    // Update statistics
    function updateStats() {
        document.getElementById("totalWorkouts").textContent = workouts.length;

        const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
        document.getElementById("totalDuration").textContent = totalDuration;

        const totalExercises = workouts.reduce((sum, w) => sum + w.exercises.length, 0);
        document.getElementById("totalExercises").textContent = totalExercises;

        const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
        document.getElementById("totalCalories").textContent = totalCalories;
    }

    // Render chart
    function renderChart() {
        const ctx = document.getElementById("workoutChart").getContext("2d");

        // Group by workout type
        const typeData = workouts.reduce((acc, workout) => {
            if (!acc[workout.type]) {
                acc[workout.type] = { duration: 0, count: 0 };
            }
            acc[workout.type].duration += workout.duration;
            acc[workout.type].count++;
            return acc;
        }, {});

        const labels = Object.keys(typeData);
        const data = labels.map(type => typeData[type].duration);
        const counts = labels.map(type => typeData[type].count);

        if (workoutChart) {
            workoutChart.destroy();
        }

        workoutChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels.map(l => l.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")),
                datasets: [{
                    label: "Total Duration (minutes)",
                    data: data,
                    backgroundColor: [
                        "rgba(76, 175, 80, 0.7)",
                        "rgba(54, 162, 235, 0.7)",
                        "rgba(255, 206, 86, 0.7)",
                        "rgba(153, 102, 255, 0.7)"
                    ],
                    borderColor: [
                        "rgba(76, 175, 80, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(153, 102, 255, 1)"
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Minutes"
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const index = context.dataIndex;
                                return `Workouts: ${counts[index]}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Setup table sorting
    function setupSorting() {
        document.querySelectorAll("#workoutTable th[data-sort]").forEach(th => {
            th.addEventListener("click", function() {
                const column = this.dataset.sort;
                if (currentSort.column === column) {
                    currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
                } else {
                    currentSort.column = column;
                    currentSort.direction = "asc";
                }

                sortWorkouts();
                renderWorkoutTable();
                updateSortIcons();
            });
        });
    }

    function sortWorkouts() {
        workouts.sort((a, b) => {
            let valueA = a[currentSort.column];
            let valueB = b[currentSort.column];

            if (currentSort.column === "date") {
                valueA = new Date(valueA);
                valueB = new Date(valueB);
            } else if (currentSort.column === "duration" || currentSort.column === "calories") {
                valueA = Number(valueA);
                valueB = Number(valueB);
            } else if (currentSort.column === "exercises") {
                valueA = a.exercises.length;
                valueB = b.exercises.length;
            }

            if (valueA < valueB) return currentSort.direction === "asc" ? -1 : 1;
            if (valueA > valueB) return currentSort.direction === "asc" ? 1 : -1;
            return 0;
        });
    }

    function updateSortIcons() {
        document.querySelectorAll("#workoutTable th[data-sort] i").forEach(icon => {
            icon.className = "fas fa-sort";
        });

        const currentTh = document.querySelector(`#workoutTable th[data-sort="${currentSort.column}"]`);
        if (currentTh) {
            const icon = currentTh.querySelector("i");
            if (icon) {
                icon.className = currentSort.direction === "asc" ? "fas fa-sort-up" : "fas fa-sort-down";
            }
        }
    }

    // Export data
    exportBtn.addEventListener("click", function() {
        let csv = "Date,Type,Duration (min),Exercises,Calories,Notes\n";

        workouts.forEach(workout => {
            const exerciseList = workout.exercises.map(ex => 
                `${ex.name} (${ex.sets}x${ex.reps}${ex.weight ? ` @ ${ex.weight}kg` : ""})`
            ).join("; ");

            csv += `"${workout.date}","${workout.type}","${workout.duration}","${exerciseList}","${workout.calories}","${workout.notes || ""}"\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `strength-workouts-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Save to localStorage
    function saveWorkouts() {
        localStorage.setItem("strengthWorkouts", JSON.stringify(workouts));
    }

    

    // MET values for different activities
    const metValues = {
        'running': 11.5,
        'cycling': 8.0,
        'swimming': 9.8,
        'walking': 4.3,
        'weightlifting': 6.0,
        'calisthenics' : 8.7,
        'yoga': 2.5,
        'aerobics': 7.0,
        'basketball': 8.0,
        'tennis': 8.0,
        'soccer': 7.0
    };

    // Get modal elements
    const modal = document.getElementById('caloriesModal');
    const btn = document.getElementById('caloriesBtn');
    const closeBtn = document.querySelector('#caloriesModal .close');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultElement = document.getElementById('result');
    const modalDuration = document.querySelector('#caloriesModal #duration');
    const weightInput = document.getElementById('weight');
    const formDuration = document.querySelector('#strengthForm #duration');

    // Open the calculator modal
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        modal.style.display = 'block';
        
        // Pre-fill duration from form if available
        if (formDuration.value) {
            modalDuration.value = formDuration.value;
        }
    });

    // Close the calculator modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        resultElement.style.display = 'none';
    });

    // Calculate calories
    calculateBtn.addEventListener('click', function() {
        const activity = document.getElementById('activity').value;
        const duration = parseFloat(modalDuration.value);
        const weight = parseFloat(weightInput.value);
        
        // Validate inputs
        if (isNaN(duration) || duration <= 0) {
            alert('Please enter a valid duration (greater than 0 minutes)');
            return;
        }
        
        if (isNaN(weight) || weight <= 0) {
            alert('Please enter a valid weight (greater than 0 kg)');
            return;
        }
        
        // Calculate and display results
        const met = metValues[activity];
        const calories = met * weight * (duration / 60);
        
        resultElement.innerHTML = `
            <p>You burned approximately <strong>${calories.toFixed(1)} calories</strong> during ${duration} minutes of ${activity}.</p>
            <p>MET value used: ${met}</p>
        `;
        resultElement.style.display = 'block';
        
        // Update the calories field in the main form
        document.getElementById('calories').value = calories.toFixed(0);
    });

});

