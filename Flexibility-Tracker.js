document.addEventListener("DOMContentLoaded", function () {
    
    const flexibilityForm = document.getElementById("flexibilityForm");
    const sessionTable = document.getElementById("sessionTable").querySelector("tbody");
    const exportBtn = document.getElementById("exportData");
    const exerciseContainer = document.getElementById("exerciseContainer");
    const addExerciseBtn = document.getElementById("addExercise");

    let sessions = JSON.parse(localStorage.getItem("flexibilitySessions")) || [];
    let sessionChart = null;
    let currentSort = { column: "date", direction: "desc" };

    renderSessionTable();
    updateStats();
    renderChart();
    setupSorting();

    document.getElementById("workoutDate").value = new Date().toISOString().split("T")[0];

    addExerciseBtn.addEventListener("click", addExercise);

    function addExercise() {
        const exerciseId = Date.now();
        const exerciseHtml = `
            <div class="exercise-item" data-id="${exerciseId}">
                <span class="remove-exercise" onclick="removeExercise(${exerciseId})"><i class="fas fa-times"></i></span>
                <div class="form-group">
                    <label for="exerciseName-${exerciseId}"><i class="fas fa-spa"></i> Exercise</label>
                    <input type="text" id="exerciseName-${exerciseId}" required placeholder="e.g. Downward Dog">
                </div>
                <div class="form-group">
                    <label for="holdTime-${exerciseId}"><i class="far fa-clock"></i> Hold Time (sec)</label>
                    <input type="number" id="holdTime-${exerciseId}" min="5" value="30">
                </div>
                <div class="form-group">
                    <label for="side-${exerciseId}"><i class="fas fa-arrows-alt-h"></i> Side</label>
                    <select id="side-${exerciseId}">
                        <option value="both">Both</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                    </select>
                </div>
            </div>
        `;
        exerciseContainer.insertAdjacentHTML("beforeend", exerciseHtml);
    }

    window.removeExercise = function(id) {
        document.querySelector(`.exercise-item[data-id="${id}"]`).remove();
    };

    flexibilityForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const exerciseItems = exerciseContainer.querySelectorAll(".exercise-item");
        const exercises = Array.from(exerciseItems).map(item => {
            const id = item.dataset.id;
            return {
                name: document.getElementById(`exerciseName-${id}`).value,
                holdTime: parseInt(document.getElementById(`holdTime-${id}`).value),
                side: document.getElementById(`side-${id}`).value
            };
        });

        const session = {
            id: Date.now(),
            date: document.getElementById("workoutDate").value,
            type: document.getElementById("workoutType").value,
            duration: parseInt(document.getElementById("duration").value),
            difficulty: document.getElementById("difficulty").value,
            calories: parseInt(document.getElementById("calories").value) || 0,
            exercises: exercises,
            notes: document.getElementById("notes").value
        };

        const editId = flexibilityForm.dataset.editId;
        if (editId) {
            const index = sessions.findIndex(s => s.id == editId);
            if (index !== -1) {
                sessions[index] = session;
            }
            delete flexibilityForm.dataset.editId;
        } else {
            sessions.unshift(session);
        }

        saveSessions();
        renderSessionTable();
        updateStats();
        renderChart();
        flexibilityForm.reset();
        exerciseContainer.innerHTML = "";
        document.getElementById("workoutDate").value = new Date().toISOString().split("T")[0];
    });

    function renderSessionTable() {
        sessionTable.innerHTML = sessions.map(session => `
            <tr data-id="${session.id}">
                <td>${session.date}</td>
                <td>${session.type.charAt(0).toUpperCase() + session.type.slice(1)}</td>
                <td>${session.duration} min</td>
                <td>${session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1)}</td>
                <td>${session.calories} cal</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="editSession(${session.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteSession(${session.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join("");
    }

    window.editSession = function(id) {
        const session = sessions.find(s => s.id == id);
        if (session) {
            document.getElementById("workoutType").value = session.type;
            document.getElementById("workoutDate").value = session.date;
            document.getElementById("duration").value = session.duration;
            document.getElementById("difficulty").value = session.difficulty;
            document.getElementById("calories").value = session.calories;
            document.getElementById("notes").value = session.notes || "";
            
            exerciseContainer.innerHTML = "";
            session.exercises.forEach(ex => {
                addExercise();
                const lastExercise = exerciseContainer.lastElementChild;
                document.getElementById(`exerciseName-${lastExercise.dataset.id}`).value = ex.name;
                document.getElementById(`holdTime-${lastExercise.dataset.id}`).value = ex.holdTime;
                document.getElementById(`side-${lastExercise.dataset.id}`).value = ex.side;
            });

            flexibilityForm.dataset.editId = id;
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    window.deleteSession = function(id) {
        if (confirm("Are you sure you want to delete this session?")) {
            sessions = sessions.filter(s => s.id != id);
            saveSessions();
            renderSessionTable();
            updateStats();
            renderChart();
        }
    };

    function updateStats() {
        document.getElementById("totalSessions").textContent = sessions.length;

        const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
        document.getElementById("totalDuration").textContent = totalDuration;

        const avgDuration = sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0;
        document.getElementById("avgDuration").textContent = avgDuration;

        const totalCalories = sessions.reduce((sum, s) => sum + s.calories, 0);
        document.getElementById("totalCalories").textContent = totalCalories;
    }

    function renderChart() {
        const ctx = document.getElementById("sessionChart").getContext("2d");

        const typeData = sessions.reduce((acc, session) => {
            if (!acc[session.type]) {
                acc[session.type] = { duration: 0, count: 0 };
            }
            acc[session.type].duration += session.duration;
            acc[session.type].count++;
            return acc;
        }, {});

        const labels = Object.keys(typeData);
        const data = labels.map(type => typeData[type].duration);
        const counts = labels.map(type => typeData[type].count);

        if (sessionChart) {
            sessionChart.destroy();
        }

        sessionChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
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
                plugins: {
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const index = context.dataIndex;
                                return `Sessions: ${counts[index]}\nAvg. Duration: ${Math.round(data[index]/counts[index])} min`;
                            }
                        }
                    },
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
    }

    function setupSorting() {
        document.querySelectorAll("#sessionTable th[data-sort]").forEach(th => {
            th.addEventListener("click", function() {
                const column = this.dataset.sort;
                if (currentSort.column === column) {
                    currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
                } else {
                    currentSort.column = column;
                    currentSort.direction = "asc";
                }

                sortSessions();
                renderSessionTable();
                updateSortIcons();
            });
        });
    }

    function sortSessions() {
        sessions.sort((a, b) => {
            let valueA = a[currentSort.column];
            let valueB = b[currentSort.column];

            if (currentSort.column === "date") {
                valueA = new Date(valueA);
                valueB = new Date(valueB);
            } else if (currentSort.column === "duration" || currentSort.column === "calories") {
                valueA = Number(valueA);
                valueB = Number(valueB);
            } else if (currentSort.column === "difficulty") {
                const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
                valueA = difficultyOrder[valueA];
                valueB = difficultyOrder[valueB];
            }

            if (valueA < valueB) return currentSort.direction === "asc" ? -1 : 1;
            if (valueA > valueB) return currentSort.direction === "asc" ? 1 : -1;
            return 0;
        });
    }

    function updateSortIcons() {
        document.querySelectorAll("#sessionTable th[data-sort] i").forEach(icon => {
            icon.className = "fas fa-sort";
        });

        const currentTh = document.querySelector(`#sessionTable th[data-sort="${currentSort.column}"]`);
        if (currentTh) {
            const icon = currentTh.querySelector("i");
            if (icon) {
                icon.className = currentSort.direction === "asc" ? "fas fa-sort-up" : "fas fa-sort-down";
            }
        }
    }

    exportBtn.addEventListener("click", function() {
        let csv = "Date,Type,Duration (min),Difficulty,Calories,Exercises,Notes\n";

        sessions.forEach(session => {
            const exerciseList = session.exercises.map(ex => 
                `${ex.name} (${ex.holdTime}s${ex.side !== "both" ? ` ${ex.side}` : ""})`
            ).join("; ");

            csv += `"${session.date}","${session.type}","${session.duration}","${session.difficulty}","${session.calories}","${exerciseList}","${session.notes || ""}"\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `flexibility-sessions-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    function saveSessions() {
        localStorage.setItem("flexibilitySessions", JSON.stringify(sessions));
    }

    const modal = document.getElementById("loginModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const closeModal = document.querySelector(".close");

    openModalBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });
});
