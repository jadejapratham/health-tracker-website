document.addEventListener("DOMContentLoaded", function() {
    // DOM Elements
    const macroForm = document.getElementById("macroForm");
    const foodTable = document.getElementById("foodTable").querySelector("tbody");
    
    // Data
    let foods = JSON.parse(localStorage.getItem("macroTrackerFoods")) || [];
    let macroGoals = {
        protein: localStorage.getItem("macroGoalProtein") || 150,
        carbs: localStorage.getItem("macroGoalCarbs") || 200,
        fat: localStorage.getItem("macroGoalFat") || 65
    };
    let macroTrendChart = null;
    let macroDistributionChart = null;
    
    // Initialize
    renderFoodTable();
    updateMacroSummary();
    renderCharts();
    
    // Form Submission
    macroForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const food = {
            id: Date.now(),
            name: document.getElementById("foodName").value,
            quantity: parseInt(document.getElementById("foodQuantity").value),
            protein: parseFloat(document.getElementById("foodProtein").value),
            carbs: parseFloat(document.getElementById("foodCarbs").value),
            fat: parseFloat(document.getElementById("foodFat").value),
            time: document.getElementById("foodTime").value,
            date: new Date().toISOString().split("T")[0]
        };
        
        foods.push(food);
        saveFoods();
        renderFoodTable();
        updateMacroSummary();
        renderCharts();
        macroForm.reset();
        document.getElementById("foodQuantity").value = 100;
    });
    
    // Render Functions
    function renderFoodTable() {
        foodTable.innerHTML = foods.map(food => `
            <tr data-id="${food.id}">
                <td>${food.name}</td>
                <td>${food.protein}g</td>
                <td>${food.carbs}g</td>
                <td>${food.fat}g</td>
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
    
    // Edit/Delete Functions
    window.editFood = function(id) {
        const food = foods.find(f => f.id == id);
        if (food) {
            document.getElementById("foodName").value = food.name;
            document.getElementById("foodQuantity").value = food.quantity;
            document.getElementById("foodProtein").value = food.protein;
            document.getElementById("foodCarbs").value = food.carbs;
            document.getElementById("foodFat").value = food.fat;
            document.getElementById("foodTime").value = food.time;
            
            foods = foods.filter(f => f.id != id);
            saveFoods();
            renderFoodTable();
            updateMacroSummary();
            renderCharts();
        }
    };
    
    window.deleteFood = function(id) {
        if (confirm("Are you sure you want to delete this food entry?")) {
            foods = foods.filter(f => f.id != id);
            saveFoods();
            renderFoodTable();
            updateMacroSummary();
            renderCharts();
        }
    };
    
    // Update Summary
    function updateMacroSummary() {
        const today = new Date().toISOString().split("T")[0];
        
        const totals = foods
            .filter(f => f.date === today)
            .reduce((acc, food) => {
                acc.protein += food.protein;
                acc.carbs += food.carbs;
                acc.fat += food.fat;
                return acc;
            }, { protein: 0, carbs: 0, fat: 0 });
        
        // Update values
        document.getElementById("proteinConsumed").textContent = totals.protein.toFixed(1) + "g";
        document.getElementById("carbsConsumed").textContent = totals.carbs.toFixed(1) + "g";
        document.getElementById("fatConsumed").textContent = totals.fat.toFixed(1) + "g";
        
        // Update progress bars
        const proteinPercent = Math.min(100, (totals.protein / macroGoals.protein) * 100);
        const carbsPercent = Math.min(100, (totals.carbs / macroGoals.carbs) * 100);
        const fatPercent = Math.min(100, (totals.fat / macroGoals.fat) * 100);
        
        document.getElementById("proteinProgress").style.width = proteinPercent + "%";
        document.getElementById("carbsProgress").style.width = carbsPercent + "%";
        document.getElementById("fatProgress").style.width = fatPercent + "%";
        
        // Update goal text
        document.getElementById("proteinGoal").textContent = `${totals.protein.toFixed(1)}/${macroGoals.protein}g`;
        document.getElementById("carbsGoal").textContent = `${totals.carbs.toFixed(1)}/${macroGoals.carbs}g`;
        document.getElementById("fatGoal").textContent = `${totals.fat.toFixed(1)}/${macroGoals.fat}g`;
    }
    
    // Render Charts
    function renderCharts() {
        renderMacroTrendChart();
        renderMacroDistributionChart();
    }
    
    function renderMacroTrendChart() {
        const ctx = document.getElementById("macroTrendChart").getContext("2d");
        
        // Group by date (last 7 days)
        const dates = [];
        const proteinData = [];
        const carbsData = [];
        const fatData = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];
            
            dates.push(dateStr);
            
            const dayTotals = foods
                .filter(f => f.date === dateStr)
                .reduce((acc, food) => {
                    acc.protein += food.protein;
                    acc.carbs += food.carbs;
                    acc.fat += food.fat;
                    return acc;
                }, { protein: 0, carbs: 0, fat: 0 });
                
            proteinData.push(dayTotals.protein);
            carbsData.push(dayTotals.carbs);
            fatData.push(dayTotals.fat);
        }
        
        if (macroTrendChart) {
            macroTrendChart.destroy();
        }
        
        macroTrendChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: dates.map(d => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })),
                datasets: [
                    {
                        label: "Protein (g)",
                        data: proteinData,
                        borderColor: "#4CAF50",
                        backgroundColor: "rgba(76, 175, 80, 0.1)",
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: "Carbs (g)",
                        data: carbsData,
                        borderColor: "#2196F3",
                        backgroundColor: "rgba(33, 150, 243, 0.1)",
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: "Fat (g)",
                        data: fatData,
                        borderColor: "#FFC107",
                        backgroundColor: "rgba(255, 193, 7, 0.1)",
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
                            text: "Grams"
                        }
                    }
                }
            }
        });
    }
    
    function renderMacroDistributionChart() {
        const ctx = document.getElementById("macroDistributionChart").getContext("2d");
        
        const today = new Date().toISOString().split("T")[0];
        
        const totals = foods
            .filter(f => f.date === today)
            .reduce((acc, food) => {
                acc.protein += food.protein;
                acc.carbs += food.carbs;
                acc.fat += food.fat;
                return acc;
            }, { protein: 0, carbs: 0, fat: 0 });
        
        const totalMacros = totals.protein + totals.carbs + totals.fat;
        
        if (macroDistributionChart) {
            macroDistributionChart.destroy();
        }
        
        macroDistributionChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Protein", "Carbs", "Fat"],
                datasets: [{
                    data: [totals.protein, totals.carbs, totals.fat],
                    backgroundColor: [
                        "rgba(76, 175, 80, 0.7)",
                        "rgba(33, 150, 243, 0.7)",
                        "rgba(255, 193, 7, 0.7)"
                    ],
                    borderColor: [
                        "rgba(76, 175, 80, 1)",
                        "rgba(33, 150, 243, 1)",
                        "rgba(255, 193, 7, 1)"
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
                            label: function(context) {
                                const value = context.raw;
                                const percent = totalMacros > 0 ? Math.round((value / totalMacros) * 100) : 0;
                                return `${context.label}: ${value}g (${percent}%)`;
                            }
                        }
                    },
                    legend: {
                        position: "right"
                    }
                }
            }
        });
    }
    
    // Local Storage Functions
    function saveFoods() {
        localStorage.setItem("macroTrackerFoods", JSON.stringify(foods));
    }
    
    // Modal handling
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