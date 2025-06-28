document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("bodyfatForm");
    const methodSelect = document.getElementById("calculationMethod");
    const resultsDiv = document.getElementById("results");
    const bodyfatPercentage = document.getElementById("bodyfatPercentage");
    const bodyfatCategory = document.getElementById("bodyfatCategory");
    

    methodSelect.addEventListener("change", function () {
        const method = this.value;
        document.querySelectorAll('.navy-method').forEach(el => el.style.display = method === 'navy' ? 'block' : 'none');
        document.querySelectorAll('.ymca-method').forEach(el => el.style.display = method === 'ymca' ? 'block' : 'none');
        document.querySelectorAll('.bmi-method').forEach(el => el.style.display = method === 'bmi' ? 'block' : 'none');
    });

    

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const method = methodSelect.value;
        const gender = document.getElementById("gender").value;
        const height = parseFloat(document.getElementById("height").value);
        const weight = parseFloat(document.getElementById("weight").value);
        const age = parseInt(document.getElementById("age")?.value || 25);

        let bfp = 0;

        if (method === "navy") {
            const neck = parseFloat(document.getElementById("neck").value);
            const waist = parseFloat(document.getElementById("waist").value);
            if (gender === "male") {
                bfp = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
            } else {
                const hip = parseFloat(document.getElementById("hip").value);
                bfp = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
            }
        } else if (method === "bmi") {
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);
            bfp = (1.20 * bmi) + (0.23 * age) - (gender === "male" ? 16.2 : 5.4);
        } else if (method === "ymca") {
            const waist = parseFloat(document.getElementById("waist").value);
            if (gender === "male") {
                bfp = (waist * 1.082 + 94.42 - weight * 2.20462) * 100 / (weight * 2.20462);
            } else {
                bfp = (waist * 0.732 + 8.987 + (weight * 2.20462) * 0.157 - 7.524) * 100 / (weight * 2.20462);
            }
        }

        bodyfatPercentage.textContent = bfp.toFixed(1) + "%";
        bodyfatCategory.textContent = getBodyFatCategory(gender, bfp);
        resultsDiv.style.display = "block";
    });

    function getBodyFatCategory(gender, percentage) {
        const categories = {
            male: [
                { max: 5, name: "Essential fat" },
                { max: 13, name: "Athletic" },
                { max: 17, name: "Fitness" },
                { max: 24, name: "Average" },
                { max: 100, name: "Obese" }
            ],
            female: [
                { max: 13, name: "Essential fat" },
                { max: 20, name: "Athletic" },
                { max: 24, name: "Fitness" },
                { max: 31, name: "Average" },
                { max: 100, name: "Obese" }
            ]
        };

        return categories[gender].find(c => percentage <= c.max).name;
    }
});
