document.addEventListener("DOMContentLoaded", function () {
  
  const cardioForm = document.getElementById("cardioForm");
  const workoutTable = document
    .getElementById("workoutTable")
    .querySelector("tbody");
  const exportBtn = document.getElementById("exportData");

  
  let workouts = JSON.parse(localStorage.getItem("cardioWorkouts")) || [];
  let workoutChart = null;
  let currentSort = { column: "date", direction: "desc" };

  
  renderWorkoutTable();
  updateStats();
  renderChart();
  setupSorting();


  document.getElementById("workoutDate").value = new Date()
    .toISOString()
    .split("T")[0];

  
  cardioForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const workout = {
      id: Date.now(),
      date: document.getElementById("workoutDate").value,
      type: document.getElementById("workoutType").value,
      duration: parseInt(document.getElementById("duration").value),
      distance: parseFloat(document.getElementById("distance").value) || 0,
      calories:
        parseInt(document.getElementById("calories").value) ||
        calculateCalories(),
      notes: document.getElementById("notes").value,
    };

  
    const editId = cardioForm.dataset.editId;
    if (editId) {
      const index = workouts.findIndex((w) => w.id == editId);
      if (index !== -1) {
        workouts[index] = workout;
      }
      delete cardioForm.dataset.editId;
    } else {
      workouts.unshift(workout);
    }

    saveWorkouts();
    renderWorkoutTable();
    updateStats();
    renderChart();
    cardioForm.reset();
    document.getElementById("workoutDate").value = new Date()
      .toISOString()
      .split("T")[0];
  });

  

  function calculateCalories() {
    const type = document.getElementById("workoutType").value;
    const duration = parseInt(document.getElementById("duration").value) || 0;

  
    const metValues = {
      running: 8,
      cycling: 6,
      swimming: 7,
    };

  
    const calories = Math.round(metValues[type] * 70 * (duration / 60));
    document.getElementById("calories").value = calories;
    return calories;
  }

  
  function renderWorkoutTable() {
    workoutTable.innerHTML = workouts
      .map(
        (workout) => `
            <tr data-id="${workout.id}">
                <td>${workout.date}</td>
                <td>${
                  workout.type.charAt(0).toUpperCase() + workout.type.slice(1)
                }</td>
                <td>${workout.duration} min</td>
                <td>${
                  workout.distance ? workout.distance.toFixed(1) + " km" : "-"
                }</td>
                <td>${workout.calories} cal</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="editWorkout(${
                      workout.id
                    })">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteWorkout(${
                      workout.id
                    })">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `
      )
      .join("");
  }

  
  window.editWorkout = function (id) {
    const workout = workouts.find((w) => w.id == id);
    if (workout) {
      document.getElementById("workoutType").value = workout.type;
      document.getElementById("workoutDate").value = workout.date;
      document.getElementById("duration").value = workout.duration;
      document.getElementById("distance").value = workout.distance;
      document.getElementById("calories").value = workout.calories;
      document.getElementById("notes").value = workout.notes || "";

      cardioForm.dataset.editId = id;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  
  window.deleteWorkout = function (id) {
    if (confirm("Are you sure you want to delete this workout?")) {
      workouts = workouts.filter((w) => w.id != id);
      saveWorkouts();
      renderWorkoutTable();
      updateStats();
      renderChart();
    }
  };

  
  function updateStats() {
    document.getElementById("totalWorkouts").textContent = workouts.length;

    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    document.getElementById("totalDuration").textContent = totalDuration;

    const totalDistance = workouts.reduce((sum, w) => sum + w.distance, 0);
    document.getElementById("totalDistance").textContent = totalDistance.toFixed(1);

    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
    document.getElementById("totalCalories").textContent = totalCalories;
  }

  
  function renderChart() {
    const ctx = document.getElementById("workoutChart").getContext("2d");

  
    const activityData = workouts.reduce((acc, workout) => {
      if (!acc[workout.type]) {
        acc[workout.type] = { duration: 0, count: 0 };
      }
      acc[workout.type].duration += workout.duration;
      acc[workout.type].count++;
      return acc;
    }, {});

    const labels = Object.keys(activityData);
    const data = labels.map((type) => activityData[type].duration);
    const counts = labels.map((type) => activityData[type].count);

    if (workoutChart) {
      workoutChart.destroy();
    }

    workoutChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels.map((l) => l.charAt(0).toUpperCase() + l.slice(1)),
        datasets: [
          {
            label: "Total Duration (minutes)",
            data: data,
            backgroundColor: [
              "rgba(76, 175, 80, 0.7)",
              "rgba(54, 162, 235, 0.7)",
              "rgba(255, 206, 86, 0.7)",
            ],
            borderColor: [
              "rgba(76, 175, 80, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Minutes",
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              afterLabel: function (context) {
                const index = context.dataIndex;
                return `Workouts: ${counts[index]}`;
              },
            },
          },
        },
      },
    });
  }

  
  function setupSorting() {
    document.querySelectorAll("#workoutTable th[data-sort]").forEach((th) => {
      th.addEventListener("click", function () {
        const column = this.dataset.sort;
        if (currentSort.column === column) {
          currentSort.direction =
            currentSort.direction === "asc" ? "desc" : "asc";
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
      } else if (
        currentSort.column === "duration" ||
        currentSort.column === "distance" ||
        currentSort.column === "calories"
      ) {
        valueA = Number(valueA);
        valueB = Number(valueB);
      }

      if (valueA < valueB) return currentSort.direction === "asc" ? -1 : 1;
      if (valueA > valueB) return currentSort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  function updateSortIcons() {
    document
      .querySelectorAll("#workoutTable th[data-sort] i")
      .forEach((icon) => {
        icon.className = "fas fa-sort";
      });

    const currentTh = document.querySelector(
      `#workoutTable th[data-sort="${currentSort.column}"]`
    );
    if (currentTh) {
      const icon = currentTh.querySelector("i");
      if (icon) {
        icon.className =
          currentSort.direction === "asc"
            ? "fas fa-sort-up"
            : "fas fa-sort-down";
      }
    }
  }

  
  exportBtn.addEventListener("click", function () {
    let csv = "Date,Activity,Duration (min),Distance (km),Calories,Notes\n";

    workouts.forEach((workout) => {
      csv += `"${workout.date}","${workout.type}","${workout.duration}","${
        workout.distance || ""
      }","${workout.calories}","${workout.notes || ""}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cardio-workouts-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  
  function saveWorkouts() {
    localStorage.setItem("cardioWorkouts", JSON.stringify(workouts));
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
