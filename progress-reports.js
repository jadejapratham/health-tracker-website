document.addEventListener("DOMContentLoaded", function() {

    const timePeriodSelect = document.getElementById("timePeriod");
    const exportBtn = document.getElementById("exportReport");
    

    let weightChart = null;
    let calorieChart = null;
    let macroChart = null;
    let workoutChart = null;
    

    loadData();
    renderCharts();
    generateInsights();
    

    timePeriodSelect.addEventListener("change", function() {
        loadData();
        renderCharts();
        generateInsights();
    });
    
    exportBtn.addEventListener("click", exportReport);
    

    function loadData() {
        console.log(`Loading data for ${timePeriodSelect.value} days`);
    }
    
    function renderCharts() {
        renderWeightChart();
        renderCalorieChart();
        renderMacroChart();
        renderWorkoutChart();
    }
    
    function renderWeightChart() {
        const ctx = document.getElementById("weightChart").getContext("2d");
        const days = generateDateLabels(parseInt(timePeriodSelect.value));
        const weights = generateRandomData(150, 170, days.length, 0.5);
        
        if (weightChart) {
            weightChart.destroy();
        }
        
        weightChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: days,
                datasets: [{
                    label: "Weight (lbs)",
                    data: weights,
                    borderColor: "#4CAF50",
                    backgroundColor: "rgba(76, 175, 80, 0.1)",
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: "Weight (lbs)"
                        }
                    }
                }
            }
        });
        
        if (weights.length > 1) {
            const change = weights[weights.length - 1] - weights[0];
            const changeText = change > 0 ? `+${change.toFixed(1)}` : change.toFixed(1);
            document.getElementById("weightChange").textContent = `${changeText} lbs`;
            document.getElementById("weightChange").style.color = change > 0 ? "#f44336" : "#4CAF50";
        }
    }
    
    function renderCalorieChart() {
        const ctx = document.getElementById("calorieChart").getContext("2d");
        
        // Mock data
        const days = generateDateLabels(parseInt(timePeriodSelect.value));
        const consumed = generateRandomData(1800, 2500, days.length, 100);
        const burned = generateRandomData(2000, 3000, days.length, 100);
        
        if (calorieChart) {
            calorieChart.destroy();
        }
        
        calorieChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: days,
                datasets: [
                    {
                        label: "Calories Consumed",
                        data: consumed,
                        backgroundColor: "rgba(76, 175, 80, 0.7)",
                        borderColor: "rgba(76, 175, 80, 1)",
                        borderWidth: 1
                    },
                    {
                        label: "Calories Burned",
                        data: burned,
                        backgroundColor: "rgba(244, 67, 54, 0.7)",
                        borderColor: "rgba(244, 67, 54, 1)",
                        borderWidth: 1
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
        
        if (consumed.length > 0) {
            const avg = Math.round(consumed.reduce((a, b) => a + b, 0) / consumed.length);
            document.getElementById("avgCalories").textContent = avg;
        }
    }
    
    function renderMacroChart() {
        const ctx = document.getElementById("macroChart").getContext("2d");
        
        // Mock data
        const macroData = {
            protein: generateRandomData(80, 120, 1, 0)[0],
            carbs: generateRandomData(150, 250, 1, 0)[0],
            fat: generateRandomData(40, 80, 1, 0)[0]
        };
        
        if (macroChart) {
            macroChart.destroy();
        }
        
        macroChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Protein", "Carbs", "Fat"],
                datasets: [{
                    data: [macroData.protein, macroData.carbs, macroData.fat],
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
                    legend: {
                        position: "right"
                    }
                }
            }
        });
    }
    
    function renderWorkoutChart() {
        const ctx = document.getElementById("workoutChart").getContext("2d");
        
        // Mock data
        const workoutTypes = ["Cardio", "Strength", "Flexibility", "Other"];
        const workoutData = workoutTypes.map(() => Math.floor(Math.random() * 15) + 5);
        
        if (workoutChart) {
            workoutChart.destroy();
        }
        
        workoutChart = new Chart(ctx, {
            type: "polarArea",
            data: {
                labels: workoutTypes,
                datasets: [{
                    data: workoutData,
                    backgroundColor: [
                        "rgba(76, 175, 80, 0.7)",
                        "rgba(33, 150, 243, 0.7)",
                        "rgba(255, 193, 7, 0.7)",
                        "rgba(153, 102, 255, 0.7)"
                    ],
                    borderColor: [
                        "rgba(76, 175, 80, 1)",
                        "rgba(33, 150, 243, 1)",
                        "rgba(255, 193, 7, 1)",
                        "rgba(153, 102, 255, 1)"
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
        
        
        document.getElementById("workoutsCompleted").textContent = workoutData.reduce((a, b) => a + b, 0);
        document.getElementById("avgSteps").textContent = Math.floor(Math.random() * 3000) + 7000;
    }
    
    
    function generateInsights() {
        const insights = [
            {
                title: "Weight Trend",
                content: "Your weight has shown a consistent downward trend over the selected period, indicating effective progress toward your goals."
            },
            {
                title: "Calorie Balance",
                content: "On average, you're maintaining a slight calorie deficit, which aligns with your weight loss objectives."
            },
            {
                title: "Workout Consistency",
                content: "You've been consistent with your workouts, completing an average of 4 sessions per week."
            },
            {
                title: "Nutrition",
                content: "Your protein intake is slightly below the recommended levels for your activity level. Consider increasing protein-rich foods."
            }
        ];
        
        const insightsHTML = insights.map(insight => `
            <div class="insight-item">
                <div class="insight-title">${insight.title}</div>
                <div class="insight-text">${insight.content}</div>
            </div>
        `).join("");
        
        document.getElementById("insightsContent").innerHTML = insightsHTML;
    }
    
    function exportReport() {
        const exportBtn = document.getElementById("exportReport");
        const originalText = exportBtn.innerHTML;
        exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Report...';
        exportBtn.disabled = true;
    
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'pt', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 40; // Consistent margin on all sides
        const date = new Date().toLocaleDateString();
    
        doc.setFont('helvetica');
        doc.setFontSize(28);
        doc.setTextColor(76, 175, 80);
        doc.text('NutrifitTech Progress Report', pageWidth/2, 80, { align: 'center' });
        doc.setFontSize(16);
        doc.setTextColor(100, 100, 100);
        doc.text('Your Comprehensive Health Analysis', pageWidth/2, 120, { align: 'center' });
        doc.setDrawColor(76, 175, 80);
        doc.setLineWidth(2);
        doc.line(margin, 140, pageWidth - margin, 140);
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Generated on: ${date}`, pageWidth/2, 180, { align: 'center' });
        doc.text(`Time Period: ${timePeriodSelect.options[timePeriodSelect.selectedIndex].text}`, pageWidth/2, 210, { align: 'center' });
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(1);
        doc.line(margin, 700, pageWidth - margin, 700);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Confidential Health Report - For Personal Use Only', pageWidth/2, 720, { align: 'center' });
        doc.addPage();
        let yPosition = margin;
        doc.setFontSize(20);
        doc.setTextColor(76, 175, 80);
        doc.text('Key Metrics Summary', margin, yPosition);
        yPosition += 40;
        const cardHeight = 80;
        const cardWidth = (pageWidth - (margin * 3)) / 2;
        const summaries = [
            { 
                label: 'Weight Change', 
                value: document.getElementById("weightChange").textContent,
                icon: 'fas fa-weight'
            },
            { 
                label: 'Avg. Daily Calories', 
                value: document.getElementById("avgCalories").textContent,
                icon: 'fas fa-fire'
            },
            { 
                label: 'Workouts Completed', 
                value: document.getElementById("workoutsCompleted").textContent,
                icon: 'fas fa-dumbbell'
            },
            { 
                label: 'Avg. Daily Steps', 
                value: document.getElementById("avgSteps").textContent,
                icon: 'fas fa-walking'
            }
        ];
        
        
        summaries.forEach((summary, i) => {
            const x = margin + (i % 2) * (cardWidth + margin);
            const y = yPosition + Math.floor(i / 2) * (cardHeight + margin/2);
            
        
            doc.setFillColor(245, 245, 245);
            doc.roundedRect(x, y, cardWidth, cardHeight, 5, 5, 'F');
            doc.setDrawColor(200, 200, 200);
            doc.roundedRect(x, y, cardWidth, cardHeight, 5, 5, 'S');
            doc.setFontSize(14);
            doc.setTextColor(76, 175, 80);
            doc.text(summary.label, x + 60, y + 25);
            doc.setFontSize(24);
            doc.setTextColor(0, 0, 0);
            doc.text(summary.value, x + 60, y + 55);
            doc.setFillColor(76, 175, 80);
            doc.circle(x + 30, y + 40, 15, 'F');
        });
        
        yPosition += (cardHeight * 2) + margin;
    
        const capturePromises = [];
        const chartConfigs = [
            { id: 'weightChart', title: 'Weight Trend Analysis', cols: 1 },
            { id: 'calorieChart', title: 'Caloric Balance Overview', cols: 1 },
            { id: 'macroChart', title: 'Macronutrient Distribution', cols: 1 },
            { id: 'workoutChart', title: 'Workout Activity Breakdown', cols: 1 }
        ];
        
    
        chartConfigs.forEach(config => {
            capturePromises.push(
                html2canvas(document.getElementById(config.id), {
                    scale: 2,
                    logging: false,
                    useCORS: true
                }).then(canvas => {
                    return {
                        id: config.id,
                        title: config.title,
                        cols: config.cols,
                        image: canvas.toDataURL('image/png', 1.0)
                    };
                })
            );
        });
    

        Promise.all(capturePromises).then(results => {

            results.forEach((result, index) => {

                if (index > 0) {
                    doc.addPage();
                    yPosition = margin;
                }
                

                doc.setFontSize(18);
                doc.setTextColor(76, 175, 80);
                doc.text(result.title, margin, yPosition);
                yPosition += 30;
                

                doc.setFontSize(12);
                doc.setTextColor(100, 100, 100);
                const description = getChartDescription(result.id);
                const splitDesc = doc.splitTextToSize(description, pageWidth - (margin * 2));
                doc.text(splitDesc, margin, yPosition);
                yPosition += splitDesc.length * 15 + 20;
                

                const imgWidth = pageWidth - (margin * 2);
                const imgHeight = (result.id === 'weightChart' || result.id === 'calorieChart') ? 300 : 250;
        
                doc.addImage(result.image, 'PNG', margin, yPosition, imgWidth, imgHeight);
                yPosition += imgHeight + 20;
                doc.setFontSize(14);
                doc.setTextColor(76, 175, 80);
                doc.text('Key Observations:', margin, yPosition);
                yPosition += 20;                
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                const insights = getChartInsights(result.id);
                const splitInsights = doc.splitTextToSize(insights, pageWidth - (margin * 2));
                doc.text(splitInsights, margin, yPosition);
            });
    

            doc.addPage();
            yPosition = margin;
            
            doc.setFontSize(20);
            doc.setTextColor(76, 175, 80);
            doc.text('Comprehensive Insights', margin, yPosition);
            yPosition += 40;
            
            const insights = document.querySelectorAll('.insight-item');
            
            insights.forEach((insight, i) => {
                const title = insight.querySelector('.insight-title').textContent;
                const text = insight.querySelector('.insight-text').textContent;
                
        
                doc.setFontSize(16);
                doc.setTextColor(76, 175, 80);
                doc.text(`${i + 1}. ${title}`, margin, yPosition);
                yPosition += 25;
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                
                const splitText = doc.splitTextToSize(text, pageWidth - (margin * 2));
                doc.text(splitText, margin, yPosition);
                yPosition += splitText.length * 15 + 20;
                
                if (i < insights.length - 1) {
                    doc.setDrawColor(220, 220, 220);
                    doc.line(margin, yPosition, pageWidth - margin, yPosition);
                    yPosition += 20;
                }
                
            
                if (yPosition > 650) {
                    doc.addPage();
                    yPosition = margin;
                }
            });
    
            
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setDrawColor(200, 200, 200);
                doc.line(margin, 800, pageWidth - margin, 800);
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(`Page ${i} of ${pageCount}`, margin, 810);
                doc.text('© 2023 NutrifitTech - Confidential Health Report', pageWidth - margin, 810, { align: 'right' });
            }
    
            doc.save(`NutrifitTech_Report_${date.replace(/\//g, '-')}.pdf`);
            
            exportBtn.innerHTML = originalText;
            exportBtn.disabled = false;
        }).catch(error => {
            console.error("PDF Generation Error:", error);
            alert("There was an error generating the PDF report. Please try again.");
            exportBtn.innerHTML = originalText;
            exportBtn.disabled = false;
        });
    

        function getChartDescription(chartId) {
            const descriptions = {
                'weightChart': 'This chart shows your daily weight fluctuations over the selected period. Consistent downward trends indicate effective progress, while plateaus may suggest the need for adjustments.',
                'calorieChart': 'Visualization of your daily caloric intake versus expenditure. Maintaining a consistent deficit (intake below expenditure) typically leads to weight loss over time.',
                'macroChart': 'Breakdown of your macronutrient consumption. Optimal ratios vary by individual goals, but generally aim for balanced protein, carbohydrates, and healthy fats.',
                'workoutChart': 'Distribution of your workout types. A balanced approach incorporating cardio, strength, and flexibility training typically yields best results.'
            };
            return descriptions[chartId] || '';
        }
    
        function getChartInsights(chartId) {
            const insights = {
                'weightChart': 'Your weight shows a consistent downward trend of approximately 0.5kg per week, which is considered a healthy, sustainable rate of weight loss. The minor fluctuations are normal and often related to hydration levels.',
                'calorieChart': 'You maintain an average daily deficit of 300 calories, which aligns well with your weight loss goals. The consistency in your eating patterns is excellent, with only occasional days exceeding your targets.',
                'macroChart': 'Your protein intake could be increased by 10-15% to better support muscle maintenance during weight loss. The carbohydrate-to-fat ratio is well balanced for your activity level.',
                'workoutChart': 'You have a good balance between cardio and strength training. Consider adding one additional flexibility session per week to improve recovery and mobility.'
            };
            return insights[chartId] || '';
        }
    }
    

    function generateDateLabels(days) {
        const labels = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
        }
        return labels;
    }
    
    function generateRandomData(min, max, count, variance) {
        const data = [];
        let current = min + Math.random() * (max - min);
        
        for (let i = 0; i < count; i++) {
            data.push(current);
            current += (Math.random() * 2 - 1) * variance;
            current = Math.max(min, Math.min(max, current));
        }
        
        return data;    
});
