document.addEventListener("DOMContentLoaded", function() {
    const foodForm = document.getElementById("foodForm");
    const activityForm = document.getElementById("activityForm");
    const foodTable = document.getElementById("foodTable").querySelector("tbody");
    const activityTable = document.getElementById("activityTable").querySelector("tbody");
    
    let foods = JSON.parse(localStorage.getItem("calorieTrackerFoods")) || [];
    let activities = JSON.parse(localStorage.getItem("calorieTrackerActivities")) || [];
    let calorieGoal = localStorage.getItem("calorieTrackerGoal") || 2000;
    let calorieTrendChart = null;
    let mealDistributionChart = null;
    
    renderFoodTable();
    renderActivityTable();
    updateSummary();
    renderCharts();
    
    foodForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const food = {
            id: Date.now(),
            name: document.getElementById("foodName").value,
            calories: parseInt(document.getElementById("foodCalories").value),
            quantity: parseInt(document.getElementById("foodQuantity").value),
            time: document.getElementById("foodTime").value,
            date: new Date().toISOString().split("T")[0]
        };
        
        foods.push(food);
        saveFoods();
        renderFoodTable();
        updateSummary();
        renderCharts();
        foodForm.reset();
    });
    
    activityForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const activity = {
            id: Date.now(),
            name: document.getElementById("activityName").value,
            calories: parseInt(document.getElementById("activityCalories").value),
            duration: parseInt(document.getElementById("activityDuration").value || 0),
            date: new Date().toISOString().split("T")[0]
        };
        
        activities.push(activity);
        saveActivities();
        renderActivityTable();
        updateSummary();
        renderCharts();
        activityForm.reset();
    });
    
    function renderFoodTable() {
        foodTable.innerHTML = foods.map(food => `
            <tr data-id="${food.id}">
                <td>${food.name}</td>
                <td>${food.calories}</td>
                <td>${food.quantity}g</td>
                <td>${food.time.charAt(0).toUpperCase() + food.time.slice(1)}</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="editFood(${food.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteFood(${food.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join("");
    }
    
    function renderActivityTable() {
        activityTable.innerHTML = activities.map(activity => `
            <tr data-id="${activity.id}">
                <td>${activity.name}</td>
                <td>${activity.calories}</td>
                <td>${activity.duration} min</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="editActivity(${activity.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteActivity(${activity.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join("");
    }
    
    window.editFood = function(id) {
        const food = foods.find(f => f.id == id);
        if (food) {
            document.getElementById("foodName").value = food.name;
            document.getElementById("foodCalories").value = food.calories;
            document.getElementById("foodQuantity").value = food.quantity;
            document.getElementById("foodTime").value = food.time;
            
            foods = foods.filter(f => f.id != id);
            saveFoods();
            renderFoodTable();
            updateSummary();
            renderCharts();
        }
    };
    
    window.deleteFood = function(id) {
        if (confirm("Are you sure you want to delete this food entry?")) {
            foods = foods.filter(f => f.id != id);
            saveFoods();
            renderFoodTable();
            updateSummary();
            renderCharts();
        }
    };
    
    window.editActivity = function(id) {
        const activity = activities.find(a => a.id == id);
        if (activity) {
            document.getElementById("activityName").value = activity.name;
            document.getElementById("activityCalories").value = activity.calories;
            document.getElementById("activityDuration").value = activity.duration;
            
            activities = activities.filter(a => a.id != id);
            saveActivities();
            renderActivityTable();
            updateSummary();
            renderCharts();
        }
    };
    
    window.deleteActivity = function(id) {
        if (confirm("Are you sure you want to delete this activity entry?")) {
            activities = activities.filter(a => a.id != id);
            saveActivities();
            renderActivityTable();
            updateSummary();
            renderCharts();
        }
    };
    
    function updateSummary() {
        const today = new Date().toISOString().split("T")[0];
        
        const consumed = foods
            .filter(f => f.date === today)
            .reduce((sum, f) => sum + f.calories, 0);
        
        const burned = activities
            .filter(a => a.date === today)
            .reduce((sum, a) => sum + a.calories, 0);
        
        const net = consumed - burned;
        const remaining = calorieGoal - net;
        
        document.getElementById("caloriesConsumed").textContent = consumed;
        document.getElementById("caloriesBurned").textContent = burned;
        document.getElementById("netCalories").textContent = net;
        document.getElementById("caloriesRemaining").textContent = remaining;
        
        const remainingElement = document.getElementById("caloriesRemaining");
        remainingElement.style.color = remaining >= 0 ? "#4CAF50" : "#f44336";
    }
    
    function renderCharts() {
        renderCalorieTrendChart();
        renderMealDistributionChart();
    }
    
    function renderCalorieTrendChart() {
        const ctx = document.getElementById("calorieTrendChart").getContext("2d");
        
        
        const dates = [];
        const consumedData = [];
        const burnedData = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];
            
            dates.push(dateStr);
            
            const consumed = foods
                .filter(f => f.date === dateStr)
                .reduce((sum, f) => sum + f.calories, 0);
            
            const burned = activities
                .filter(a => a.date === dateStr)
                .reduce((sum, a) => sum + a.calories, 0);
                
            consumedData.push(consumed);
            burnedData.push(burned);
        }
        
        if (calorieTrendChart) {
            calorieTrendChart.destroy();
        }
        
        calorieTrendChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: dates.map(d => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })),
                datasets: [
                    {
                        label: "Calories Consumed",
                        data: consumedData,
                        borderColor: "#4CAF50",
                        backgroundColor: "rgba(76, 175, 80, 0.1)",
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: "Calories Burned",
                        data: burnedData,
                        borderColor: "#f44336",
                        backgroundColor: "rgba(244, 67, 54, 0.1)",
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Calories"
                        }
                    }
                }
            }
        });
    }
    
    function renderMealDistributionChart() {
        const ctx = document.getElementById("mealDistributionChart").getContext("2d");
        
        const mealTimes = ["breakfast", "lunch", "dinner", "snack"];
        const today = new Date().toISOString().split("T")[0];
        
        const mealData = mealTimes.map(time => {
            return foods
                .filter(f => f.date === today && f.time === time)
                .reduce((sum, f) => sum + f.calories, 0);
        });
        
        if (mealDistributionChart) {
            mealDistributionChart.destroy();
        }
        
        mealDistributionChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: mealTimes.map(t => t.charAt(0).toUpperCase() + t.slice(1)),
                datasets: [{
                    data: mealData,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.7)",
                        "rgba(54, 162, 235, 0.7)",
                        "rgba(255, 206, 86, 0.7)",
                        "rgba(75, 192, 192, 0.7)"
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)"
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "right"
                    }
                }
            }
        });
    }
    
    
    function saveFoods() {
        localStorage.setItem("calorieTrackerFoods", JSON.stringify(foods));
    }
    
    function saveActivities() {
        localStorage.setItem("calorieTrackerActivities", JSON.stringify(activities));
    }
    
});
