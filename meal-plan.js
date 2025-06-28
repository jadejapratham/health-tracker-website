document.addEventListener('DOMContentLoaded', function() {
    
    const generateBtn = document.getElementById('generate-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const printGroceryBtn = document.getElementById('print-grocery');
    const emailGroceryBtn = document.getElementById('email-grocery');
    const clearGroceryBtn = document.getElementById('clear-grocery');
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    const weekDisplay = document.getElementById('week-display');
    const closeModalBtn = document.querySelector('.close-btn');
    const modalRecipeContent = document.getElementById('modal-recipe-content');
    
    
    let currentWeekOffset = 0;
    let calorieGoal = 2000;
    
    
    const mealDB = {
        breakfast: {
            diabetic: {
                north: [
                    {
                        id: 'b1',
                        name: "Besan Chilla with Mint Chutney",
                        description: "Protein-packed pancakes made with gram flour and vegetables.",
                        calories: 280,
                        carbs: 30,
                        protein: 12,
                        fat: 8,
                        fiber: 6,
                        prepTime: "10 mins",
                        cookTime: "15 mins",
                        servings: 2,
                        tags: ["high-protein", "diabetic-friendly"],
                        ingredients: ["Besan (gram flour)", "Onion", "Tomato", "Spinach"],
                        instructions: ["Mix ingredients", "Cook on tawa", "Serve with chutney"],
                        image: 'https://source.unsplash.com/random/300x200/?besan+chilla',
                        tips: ["Add grated vegetables for extra nutrition", "Use non-stick pan for less oil"],
                        gi: 35
                    }
                ],
                south: [
                    {
                        id: 'b2',
                        name: "Ragi Dosa with Coconut Chutney",
                        description: "Healthy dosa made with finger millet flour.",
                        calories: 250,
                        carbs: 40,
                        protein: 6,
                        fat: 5,
                        fiber: 8,
                        prepTime: "5 mins",
                        cookTime: "10 mins",
                        servings: 2,
                        tags: ["gluten-free", "high-fiber"],
                        ingredients: ["Ragi flour", "Rice flour", "Curd"],
                        instructions: ["Mix batter", "Spread on tawa", "Cook until crisp"],
                        image: 'https://source.unsplash.com/random/300x200/?ragi+dosa',
                        tips: ["Let batter ferment overnight for better taste"],
                        gi: 40
                    }
                ]
            },
            regular: {
                north: [
                    {
                        id: 'b3',
                        name: "Aloo Paratha with Curd",
                        description: "Whole wheat flatbread stuffed with spiced potatoes.",
                        calories: 350,
                        carbs: 55,
                        protein: 10,
                        fat: 12,
                        fiber: 7,
                        prepTime: "15 mins",
                        cookTime: "20 mins",
                        servings: 2,
                        tags: ["comfort-food"],
                        ingredients: ["Whole wheat flour", "Potatoes", "Spices"],
                        instructions: ["Make dough", "Prepare stuffing", "Cook paratha"],
                        image: 'https://source.unsplash.com/random/300x200/?aloo+paratha',
                        tips: ["Use ghee for better flavor"],
                        gi: 65
                    }
                ],
                south: [
                    {
                        id: 'b4',
                        name: "Idli with Sambar",
                        description: "Steamed rice cakes with lentil stew.",
                        calories: 300,
                        carbs: 50,
                        protein: 12,
                        fat: 8,
                        fiber: 10,
                        prepTime: "10 mins",
                        cookTime: "15 mins",
                        servings: 2,
                        tags: ["fermented", "light"],
                        ingredients: ["Idli batter", "Toor dal", "Vegetables"],
                        instructions: ["Steam idlis", "Prepare sambar", "Serve hot"],
                        image: 'https://source.unsplash.com/random/300x200/?idli+sambar',
                        tips: ["Ferment batter for at least 8 hours"],
                        gi: 60
                    }
                ]
            }
        },
        lunch: {
            diabetic: {
                north: [
                    {
                        id: 'l1',
                        name: "Bajra Roti with Lauki Chana Dal",
                        description: "Pearl millet flatbread with bottle gourd and chickpea curry.",
                        calories: 380,
                        carbs: 45,
                        protein: 18,
                        fat: 12,
                        fiber: 15,
                        prepTime: "15 mins",
                        cookTime: "25 mins",
                        servings: 2,
                        tags: ["high-fiber"],
                        ingredients: ["Bajra flour", "Chana dal", "Bottle gourd"],
                        instructions: ["Cook dal", "Make roti", "Serve together"],
                        image: 'https://source.unsplash.com/random/300x200/?bajra+roti',
                        tips: ["Soak dal for 30 minutes before cooking"],
                        gi: 45
                    }
                ],
                south: [
                    {
                        id: 'l2',
                        name: "Brown Rice with Sambar",
                        description: "Nutritious brown rice with lentil stew.",
                        calories: 400,
                        carbs: 60,
                        protein: 15,
                        fat: 10,
                        fiber: 12,
                        prepTime: "10 mins",
                        cookTime: "30 mins",
                        servings: 2,
                        tags: ["whole-grain"],
                        ingredients: ["Brown rice", "Toor dal", "Vegetables"],
                        instructions: ["Cook rice", "Prepare sambar", "Serve"],
                        image: 'https://source.unsplash.com/random/300x200/?brown+rice+sambar',
                        tips: ["Add more vegetables for extra nutrition"],
                        gi: 50
                    }
                ]
            },
            regular: {
                north: [
                    {
                        id: 'l3',
                        name: "Rajma Chawal",
                        description: "Kidney beans curry with steamed rice.",
                        calories: 450,
                        carbs: 70,
                        protein: 20,
                        fat: 15,
                        fiber: 18,
                        prepTime: "15 mins",
                        cookTime: "30 mins",
                        servings: 2,
                        tags: ["protein-rich"],
                        ingredients: ["Rajma", "Rice", "Spices"],
                        instructions: ["Cook rajma", "Prepare rice", "Serve"],
                        image: 'https://source.unsplash.com/random/300x200/?rajma+chawal',
                        tips: ["Soak rajma overnight for better texture"],
                        gi: 55
                    }
                ],
                south: [
                    {
                        id: 'l4',
                        name: "Meals Plate",
                        description: "Traditional South Indian thali with rice, sambar, and curries.",
                        calories: 500,
                        carbs: 75,
                        protein: 15,
                        fat: 18,
                        fiber: 15,
                        prepTime: "20 mins",
                        cookTime: "30 mins",
                        servings: 2,
                        tags: ["balanced"],
                        ingredients: ["Rice", "Dal", "Vegetables"],
                        instructions: ["Prepare all items", "Serve on plate"],
                        image: 'https://source.unsplash.com/random/300x200/?south+indian+thali',
                        tips: ["Serve with pickle and papad for complete experience"],
                        gi: 60
                    }
                ]
            }
        },
        dinner: {
            diabetic: {
                north: [
                    {
                        id: 'd1',
                        name: "Jowar Roti with Methi Dal",
                        description: "Sorghum flatbread with fenugreek lentil curry.",
                        calories: 350,
                        carbs: 40,
                        protein: 16,
                        fat: 10,
                        fiber: 12,
                        prepTime: "15 mins",
                        cookTime: "20 mins",
                        servings: 2,
                        tags: ["low-gi"],
                        ingredients: ["Jowar flour", "Moong dal", "Fenugreek"],
                        instructions: ["Cook dal", "Make roti", "Serve"],
                        image: 'https://source.unsplash.com/random/300x200/?jowar+roti',
                        tips: ["Add garlic for extra flavor"],
                        gi: 40
                    }
                ],
                south: [
                    {
                        id: 'd2',
                        name: "Quinoa Pongal",
                        description: "Healthy version of traditional rice pongal made with quinoa.",
                        calories: 320,
                        carbs: 45,
                        protein: 14,
                        fat: 8,
                        fiber: 10,
                        prepTime: "10 mins",
                        cookTime: "20 mins",
                        servings: 2,
                        tags: ["protein-rich"],
                        ingredients: ["Quinoa", "Moong dal", "Pepper"],
                        instructions: ["Cook quinoa and dal", "Season", "Serve"],
                        image: 'https://source.unsplash.com/random/300x200/?quinoa+pongal',
                        tips: ["Add cashews for crunch"],
                        gi: 45
                    }
                ]
            },
            regular: {
                north: [
                    {
                        id: 'd3',
                        name: "Chapati with Mix Veg",
                        description: "Whole wheat flatbread with mixed vegetable curry.",
                        calories: 380,
                        carbs: 55,
                        protein: 12,
                        fat: 12,
                        fiber: 10,
                        prepTime: "15 mins",
                        cookTime: "20 mins",
                        servings: 2,
                        tags: ["balanced"],
                        ingredients: ["Wheat flour", "Vegetables", "Spices"],
                        instructions: ["Make chapatis", "Cook vegetables", "Serve"],
                        image: 'https://source.unsplash.com/random/300x200/?chapati+vegetables',
                        tips: ["Use seasonal vegetables for best taste"],
                        gi: 55
                    }
                ],
                south: [
                    {
                        id: 'd4',
                        name: "Dosa with Potato Curry",
                        description: "Fermented crepe with spiced potato filling.",
                        calories: 400,
                        carbs: 60,
                        protein: 10,
                        fat: 15,
                        fiber: 8,
                        prepTime: "10 mins",
                        cookTime: "15 mins",
                        servings: 2,
                        tags: ["comfort-food"],
                        ingredients: ["Dosa batter", "Potatoes", "Spices"],
                        instructions: ["Prepare potato filling", "Make dosa", "Serve"],
                        image: 'https://source.unsplash.com/random/300x200/?dosa+potato',
                        tips: ["Make thin dosa for crispiness"],
                        gi: 60
                    }
                ]
            }
        },
        snack: {
            diabetic: {
                north: [
                    {
                        id: 's1',
                        name: "Sprouts Chaat",
                        description: "Healthy snack with sprouted legumes and spices.",
                        calories: 150,
                        carbs: 20,
                        protein: 8,
                        fat: 5,
                        fiber: 6,
                        prepTime: "5 mins",
                        cookTime: "0 mins",
                        servings: 1,
                        tags: ["high-protein"],
                        ingredients: ["Moong sprouts", "Onion", "Tomato", "Spices"],
                        instructions: ["Mix all ingredients", "Serve fresh"],
                        image: 'https://source.unsplash.com/random/300x200/?sprouts+chaat',
                        tips: ["Add lemon juice for tangy flavor"],
                        gi: 30
                    }
                ],
                south: [
                    {
                        id: 's2',
                        name: "Ragi Malt",
                        description: "Nutritious drink made with finger millet flour.",
                        calories: 120,
                        carbs: 20,
                        protein: 4,
                        fat: 3,
                        fiber: 5,
                        prepTime: "5 mins",
                        cookTime: "5 mins",
                        servings: 1,
                        tags: ["calcium-rich"],
                        ingredients: ["Ragi flour", "Milk", "Jaggery"],
                        instructions: ["Mix ingredients", "Cook", "Serve warm"],
                        image: 'https://source.unsplash.com/random/300x200/?ragi+malt',
                        tips: ["Use jaggery instead of sugar for better nutrition"],
                        gi: 35
                    }
                ]
            },
            regular: {
                north: [
                    {
                        id: 's3',
                        name: "Fruit Chaat",
                        description: "Seasonal fruits with spices and lemon.",
                        calories: 120,
                        carbs: 25,
                        protein: 2,
                        fat: 1,
                        fiber: 4,
                        prepTime: "10 mins",
                        cookTime: "0 mins",
                        servings: 1,
                        tags: ["vitamin-rich"],
                        ingredients: ["Seasonal fruits", "Chaat masala", "Lemon"],
                        instructions: ["Chop fruits", "Add spices", "Serve"],
                        image: 'https://source.unsplash.com/random/300x200/?fruit+chaat',
                        tips: ["Use ripe but firm fruits"],
                        gi: 40
                    }
                ],
                south: [
                    {
                        id: 's4',
                        name: "Upma",
                        description: "Semolina cooked with vegetables and spices.",
                        calories: 200,
                        carbs: 30,
                        protein: 6,
                        fat: 7,
                        fiber: 4,
                        prepTime: "5 mins",
                        cookTime: "10 mins",
                        servings: 1,
                        tags: ["quick"],
                        ingredients: ["Semolina", "Vegetables", "Mustard seeds"],
                        instructions: ["Roast semolina", "Cook with vegetables", "Serve"],
                        image: 'https://source.unsplash.com/random/300x200/?upma',
                        tips: ["Add peanuts for crunch"],
                        gi: 50
                    }
                ]
            }
        }
    };

    const groceryCategories = {
        vegetables: ["Spinach", "Tomatoes", "Cucumber", "Carrots", "Bell Peppers", "Onions", "Garlic", "Ginger", "Bottle Gourd", "Drumsticks"],
        fruits: ["Apples", "Bananas", "Oranges", "Guava", "Papaya", "Pomegranate"],
        grains: ["Brown rice", "Whole wheat flour", "Quinoa", "Oats", "Bajra flour", "Ragi flour"],
        lentils: ["Toor dal", "Chana dal", "Moong dal", "Urad dal", "Rajma", "Black chickpeas"],
        spices: ["Turmeric powder", "Cumin seeds", "Coriander powder", "Red chili powder", "Garam masala", "Mustard seeds"],
        dairy: ["Low-fat milk", "Curd", "Paneer", "Ghee"],
        others: ["Olive oil", "Honey", "Nuts (almonds, walnuts)", "Seeds (flax, chia)", "Green tea"]
    };

    setupTabs();
    loadFavorites();
    setupWeekNavigation();
    setupModal();


    generateBtn.addEventListener('click', generateMealPlan);
    printGroceryBtn.addEventListener('click', printGroceryList);
    emailGroceryBtn.addEventListener('click', emailGroceryList);
    clearGroceryBtn.addEventListener('click', clearGroceryList);
    closeModalBtn.addEventListener('click', closeModal);

    function setupTabs() {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                

                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                

                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById(tabId).classList.add('active');
            });
        });
    }


    function setupWeekNavigation() {
        prevWeekBtn.addEventListener('click', () => {
            currentWeekOffset--;
            updateWeekDisplay();
            generateWeeklyPlan();
        });
        
        nextWeekBtn.addEventListener('click', () => {
            currentWeekOffset++;
            updateWeekDisplay();
            generateWeeklyPlan();
        });
        
        updateWeekDisplay();
    }
    
    function updateWeekDisplay() {
        const now = new Date();
        const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (currentWeekOffset * 7));
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const options = { month: 'short', day: 'numeric' };
        weekDisplay.textContent = `${weekStart.toLocaleDateString('en-US', options)} - ${weekEnd.toLocaleDateString('en-US', options)}`;
    }


    function setupModal() {
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('recipe-modal')) {
                closeModal();
            }
        });
    }
    
    function openModal(recipe) {
        modalRecipeContent.innerHTML = createModalContent(recipe);
        document.getElementById('recipe-modal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        document.getElementById('recipe-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function createModalContent(recipe) {
        // Ensure optional properties exist
        recipe.image = recipe.image || 'https://source.unsplash.com/random/800x600/?indian+food';
        recipe.tips = recipe.tips || ["No specific tips available for this recipe."];
        recipe.gi = recipe.gi || 50; // Default GI value
        
        return `
            <div class="modal-recipe-header">
                <h2 class="modal-recipe-title">${recipe.name}</h2>
                <div class="modal-recipe-meta">
                    <span><i class="fas fa-clock"></i> Prep: ${recipe.prepTime}</span>
                    <span><i class="fas fa-fire"></i> Cook: ${recipe.cookTime}</span>
                    <span><i class="fas fa-utensils"></i> Servings: ${recipe.servings}</span>
                </div>
            </div>
            
            <div class="modal-recipe-image" style="background-image: url('${recipe.image}')">
                <div class="recipe-tags">
                    ${recipe.tags.map(tag => `<span class="recipe-tag">${tag}</span>`).join('')}
                </div>
            </div>
            
            <div class="modal-recipe-content">
                <div class="modal-recipe-section modal-recipe-description">
                    <p>${recipe.description}</p>
                </div>
                
                <div class="modal-recipe-section modal-recipe-ingredients">
                    <h3><i class="fas fa-carrot"></i> Ingredients</h3>
                    <ul>
                        ${recipe.ingredients.map(ing => `
                            <li>${ing}</li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="modal-recipe-section modal-recipe-steps">
                    <h3><i class="fas fa-list-ol"></i> Instructions</h3>
                    <ol>
                        ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
                
                <div class="modal-recipe-section modal-recipe-tips">
                    <h3><i class="fas fa-lightbulb"></i> Tips</h3>
                    <ul>
                        ${recipe.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="modal-recipe-section modal-recipe-nutrition">
                    <h3><i class="fas fa-chart-pie"></i> Nutrition Facts (per serving)</h3>
                    <div class="nutrition-facts">
                        <div class="nutrition-fact">
                            <div class="nutrition-fact-value">${recipe.calories}</div>
                            <div class="nutrition-fact-label">Calories</div>
                        </div>
                        <div class="nutrition-fact">
                            <div class="nutrition-fact-value">${recipe.carbs}g</div>
                            <div class="nutrition-fact-label">Carbs</div>
                        </div>
                        <div class="nutrition-fact">
                            <div class="nutrition-fact-value">${recipe.protein}g</div>
                            <div class="nutrition-fact-label">Protein</div>
                        </div>
                        <div class="nutrition-fact">
                            <div class="nutrition-fact-value">${recipe.fat}g</div>
                            <div class="nutrition-fact-label">Fat</div>
                        </div>
                        <div class="nutrition-fact">
                            <div class="nutrition-fact-value">${recipe.fiber}g</div>
                            <div class="nutrition-fact-label">Fiber</div>
                        </div>
                        <div class="nutrition-fact">
                            <div class="nutrition-fact-value">${recipe.gi}</div>
                            <div class="nutrition-fact-label">Glycemic Index</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }


    function generateMealPlan() {
        const isDiabetic = document.getElementById('diabetic').value !== 'no';
        const dietType = document.getElementById('diet').value;
        calorieGoal = parseInt(document.getElementById('calories').value);
        const region = document.getElementById('region').value;
        const allergies = Array.from(document.getElementById('allergies').selectedOptions).map(o => o.value);
        const activityLevel = document.getElementById('activity').value;
        

        const adjustedCalorieGoal = adjustCaloriesForActivity(calorieGoal, activityLevel);
        showDiabetesTips(document.getElementById('diabetic').value);
        generateWeeklyPlan(isDiabetic, dietType, region, adjustedCalorieGoal, allergies);
        generateNutritionInfo(adjustedCalorieGoal);
        generateGroceryList(allergies);
        
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        document.querySelector('.tab-btn[data-tab="weekly-plan"]').classList.add('active');
        document.getElementById('weekly-plan').classList.add('active');
    }

  
    function adjustCaloriesForActivity(baseCalories, activityLevel) {
        const multipliers = {
            'sedentary': 1.0,
            'light': 1.1,
            'moderate': 1.25,
            'active': 1.4,
            'athlete': 1.6
        };
        return Math.round(baseCalories * multipliers[activityLevel]);
    }
    
    function generateWeeklyPlan(isDiabetic, dietType, region, calorieGoal, allergies) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        let html = '';
        const usedMealIds = new Set();

        const dailyCalories = Math.round(calorieGoal * 0.9);
        const mealCalorieDistribution = {
            breakfast: 0.25,
            lunch: 0.35,
            dinner: 0.3,
            snack: 0.1
        };

        days.forEach(day => {
            const dayMeals = generateDayMeals(isDiabetic, dietType, region, dailyCalories, mealCalorieDistribution, allergies, usedMealIds);
            html += `
                <div class="day-plan">
                    <h3>${day} <span class="day-calories">${Math.round(dailyCalories)} calories</span></h3>
                    ${dayMeals}
                </div>
            `;
        });

        document.getElementById('weekly-plan-container').innerHTML = html;

        document.querySelectorAll('.view-recipe').forEach(btn => {
            btn.addEventListener('click', function () {
                const recipeId = this.getAttribute('data-recipe-id');
                const recipe = findRecipeById(recipeId);
                if (recipe) openModal(recipe);
            });
        });

        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const mealId = this.getAttribute('data-meal-id');
                const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                const index = favorites.indexOf(mealId);

                if (index === -1) {
                    favorites.push(mealId);
                    this.classList.add('active');
                    this.querySelector('i').classList.remove('far');
                    this.querySelector('i').classList.add('fas');
                } else {
                    favorites.splice(index, 1);
                    this.classList.remove('active');
                    this.querySelector('i').classList.remove('fas');
                    this.querySelector('i').classList.add('far');
                }

                localStorage.setItem('favorites', JSON.stringify(favorites));
                loadFavorites();
            });
        });
    }

    const dayMeals = generateDayMeals(
        isDiabetic, dietType, region, dailyCalories, mealCalorieDistribution, allergies, usedMealIds
    );
    
    
    function generateDayMeals(isDiabetic, dietType, region, dailyCalories, distribution, allergies, usedMealIds) {
        const meals = [
            { type: 'breakfast', time: '8:00 AM', targetCalories: Math.round(dailyCalories * distribution.breakfast) },
            { type: 'snack', time: '11:00 AM', targetCalories: Math.round(dailyCalories * distribution.snack) },
            { type: 'lunch', time: '1:30 PM', targetCalories: Math.round(dailyCalories * distribution.lunch) },
            { type: 'snack', time: '4:30 PM', targetCalories: Math.round(dailyCalories * distribution.snack) },
            { type: 'dinner', time: '7:30 PM', targetCalories: Math.round(dailyCalories * distribution.dinner) }
        ];
        let html = '';

        meals.forEach(meal => {
            const mealData = getMealWithinCalorieRange(meal.type, isDiabetic, dietType, region, meal.targetCalories * 0.8, meal.targetCalories * 1.2, allergies, usedMealIds);
            if (mealData) {
                usedMealIds.add(mealData.id);
                html += createMealCard(mealData, meal.type, meal.time);
            }
        });

        return html;
    }
    

    function getMealWithinCalorieRange(mealType, isDiabetic, dietType, region, minCal, maxCal, allergies, usedMealIds) {
        const diabeticStatus = isDiabetic ? 'diabetic' : 'regular';
        const regions = region === 'all' ? ['north', 'south'] : [region];

        let availableMeals = [];
        regions.forEach(reg => {
            if (mealDB[mealType] && mealDB[mealType][diabeticStatus] && mealDB[mealType][diabeticStatus][reg]) {
                availableMeals = availableMeals.concat(mealDB[mealType][diabeticStatus][reg]);
            }
        });

        availableMeals = availableMeals.filter(meal =>
            meal.calories >= minCal &&
            meal.calories <= maxCal &&
            !usedMealIds.has(meal.id)
        );
        
  
        if (allergies.length > 0 && !allergies.includes('none')) {
            availableMeals = availableMeals.filter(meal =>
                !meal.ingredients.some(ingredient =>
                    allergies.some(allergy =>
                        ingredient.toLowerCase().includes(allergy.toLowerCase())
                    )
                )
            );
        }
        
        availableMeals = availableMeals.filter(meal =>
            meal.calories >= minCal && meal.calories <= maxCal && !usedMealIds.has(meal.id)
        );
        
        if (availableMeals.length === 0) {
        
            availableMeals = regions.flatMap(reg => 
                mealDB[mealType]?.[diabeticStatus]?.[reg] || []
            ).filter(meal => 
                !allergies.some(allergy => 
                    meal.ingredients.some(ingredient => 
                        ingredient.toLowerCase().includes(allergy.toLowerCase())
                    )
                )
            );
            
            if (availableMeals.length > 0) {
                availableMeals.sort((a, b) => 
                    Math.abs(a.calories - (minCal + maxCal)/2) - Math.abs(b.calories - (minCal + maxCal)/2)
                );
                return availableMeals[0];
            }
            
            return {
                id: 'default',
                name: 'Custom Balanced Meal',
                description: 'A meal tailored to your calorie needs and restrictions.',
                calories: Math.round((minCal + maxCal)/2),
                carbs: Math.round((minCal + maxCal)/2 * 0.5 / 4),
                protein: Math.round((minCal + maxCal)/2 * 0.3 / 4),
                fat: Math.round((minCal + maxCal)/2 * 0.2 / 9),
                prepTime: '20 mins',
                cookTime: '20 mins',
                servings: 2,
                tags: ['balanced', 'custom'],
                image: 'https://source.unsplash.com/random/800x600/?indian+food',
                tips: ["Adjust portions based on your needs"],
                gi: 50,
                ingredients: ["Custom ingredients based on your preferences"],
                instructions: ["Prepare according to your dietary needs"]
            };
        }
        
        
        return availableMeals[Math.floor(Math.random() * availableMeals.length)];
    }
    
    function createMealCard(meal, mealType, time) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const isFav = favorites.includes(meal.id);
        return `
            <div class="meal-card">
                <h4>
                    ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} (${time})
                    <button class="favorite-btn ${isFav ? 'active' : ''}" data-meal-id="${meal.id}">
                        <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </h4>
                <h5>${meal.name}</h5>
                <p class="meal-description">${meal.description}</p>
                <div class="meal-details">
                    <div><i class="fas fa-clock"></i> ${meal.prepTime} prep</div>
                    <div><i class="fas fa-fire"></i> ${meal.cookTime} cook</div>
                    <div><i class="fas fa-utensils"></i> ${meal.servings} servings</div>
                </div>
                <div class="meal-macros">
                    <div class="macro">
                        <div class="macro-value">${meal.calories}</div>
                        <div class="macro-label">Calories</div>
                    </div>
                    <div class="macro">
                        <div class="macro-value">${meal.carbs}g</div>
                        <div class="macro-label">Carbs</div>
                    </div>
                    <div class="macro">
                        <div class="macro-value">${meal.protein}g</div>
                        <div class="macro-label">Protein</div>
                    </div>
                    <div class="macro">
                        <div class="macro-value">${meal.fat}g</div>
                        <div class="macro-label">Fat</div>
                    </div>
                </div>
                <button class="view-recipe" data-recipe-id="${meal.id}">
                    <i class="fas fa-book-open"></i> View Recipe
                </button>
            </div>
        `;
    }
    
    function findRecipeById(id) {
        for (const category in mealDB) {
            for (const diabeticStatus in mealDB[category]) {
                for (const region in mealDB[category][diabeticStatus]) {
                    const found = mealDB[category][diabeticStatus][region].find(recipe => recipe.id === id);
                    if (found) return found;
                }
            }
        }
        return null;
    }

    function showDiabetesTips(isDiabetic) {
        const tipsSection = document.getElementById('diabetes-tips');
        const tipsContent = tipsSection.querySelector('.tips-content');
        
        if (isDiabetic !== 'no') {
            tipsSection.classList.remove('hidden');
            
            let tips = [];
            if (isDiabetic === 'type1') {
                tips = [
                    "Monitor your blood sugar levels regularly and adjust insulin accordingly",
                    "Count carbohydrates carefully to match your insulin doses",
                    "Have a consistent meal schedule to maintain stable blood sugar levels",
                    "Always carry fast-acting carbohydrates to treat low blood sugar",
                    "Stay hydrated and watch for signs of high blood sugar"
                ];
            } else if (isDiabetic === 'type2') {
                tips = [
                    "Focus on portion control and balanced meals with complex carbohydrates",
                    "Include protein with every meal to help stabilize blood sugar",
                    "Choose high-fiber foods like whole grains, vegetables and legumes",
                    "Limit intake of processed foods, sugary drinks and refined carbohydrates",
                    "Combine physical activity with your meal plan for better glucose control"
                ];
            } else if (isDiabetic === 'prediabetic') {
                tips = [
                    "Focus on weight management if overweight - even 5-7% weight loss can help",
                    "Increase physical activity to at least 150 minutes per week",
                    "Choose high-fiber foods to improve insulin sensitivity",
                    "Reduce intake of sugary beverages and processed foods",
                    "Get regular health check-ups to monitor your status"
                ];
            } else if (isDiabetic === 'gestational') {
                tips = [
                    "Monitor blood sugar levels as recommended by your doctor",
                    "Eat small, frequent meals to maintain stable blood sugar",
                    "Include protein with each meal and snack",
                    "Limit sweets and choose complex carbohydrates",
                    "Continue moderate exercise as approved by your healthcare provider"
                ];
            }
            
            tipsContent.innerHTML = `<ul>${tips.map(tip => `<li>${tip}</li>`).join('')}</ul>`;
        } else {
            tipsSection.classList.add('hidden');
        }
    }
    
    function generateNutritionInfo(calorieGoal) {
        const nutritionInfo = {
            calories: { value: Math.round(calorieGoal * 0.9), goal: calorieGoal },
            carbs: { value: Math.round(calorieGoal * 0.9 * 0.5 / 4), goal: Math.round(calorieGoal * 0.5 / 4), percent: 50 },
            protein: { value: Math.round(calorieGoal * 0.9 * 0.3 / 4), goal: Math.round(calorieGoal * 0.3 / 4), percent: 30 },
            fat: { value: Math.round(calorieGoal * 0.9 * 0.2 / 9), goal: Math.round(calorieGoal * 0.2 / 9), percent: 20 },
            fiber: { value: 25, goal: 30 },
            sugar: { value: 35, goal: 50 }
        };
        
        let html = '';
        for (const [nutrient, data] of Object.entries(nutritionInfo)) {
            const percentage = Math.min(100, Math.round((data.value / data.goal) * 100));
            
            html += `
                <div class="nutrition-card">
                    <h4>
                        <i class="fas fa-${getNutritionIcon(nutrient)}"></i>
                        ${capitalizeFirstLetter(nutrient)}
                    </h4>
                    <div class="nutrition-value">${data.value}${nutrient !== 'calories' ? 'g' : ''}</div>
                    <div class="nutrition-label">${data.goal}${nutrient !== 'calories' ? 'g' : ''} daily goal</div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${percentage}%"></div>
                    </div>
                    <div class="nutrition-percent">${percentage}%</div>
                    ${data.percent ? `<div class="nutrition-percent">${data.percent}% of calories</div>` : ''}
                </div>
            `;
        }
        
        document.getElementById('nutrition-info').innerHTML = html;
    }
    
    function getNutritionIcon(nutrient) {
        const icons = {
            calories: 'fire',
            carbs: 'bread-slice',
            protein: 'dumbbell',
            fat: 'bacon',
            fiber: 'leaf',
            sugar: 'candy-cane'
        };
        return icons[nutrient] || 'chart-pie';
    }
    
    function generateGroceryList(allergies) {
        let html = '';
        
        for (const [category, items] of Object.entries(groceryCategories)) {
            const safeItems = items.filter(item => 
                !allergies.some(allergy => 
                    item.toLowerCase().includes(allergy.toLowerCase())
                )
            );
        
            if (safeItems.length > 0) {
                html += `
                    <div class="grocery-category">
                        <h3>
                            <i class="fas fa-${getGroceryIcon(category)}"></i>
                            ${capitalizeFirstLetter(category)}
                        </h3>
                        <div class="grocery-items">
                            ${safeItems.map(item => `
                                <div class="grocery-item">
                                    <div class="grocery-item-name">
                                        <input type="checkbox" class="grocery-item-checkbox" id="grocery-${item.toLowerCase().replace(/\s+/g, '-')}">
                                        <label for="grocery-${item.toLowerCase().replace(/\s+/g, '-')}">${item}</label>
                                    </div>
                                    <div class="grocery-item-quantity">${getRandomQuantity()}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        }
        
        if (html === '' && allergies.length > 0) {
            html = `<p class="no-items">No grocery items found that match your allergy restrictions. Please adjust your filters.</p>`;
        }
        
        document.getElementById('grocery-list').innerHTML = html;
    }
    
    function getGroceryIcon(category) {
        const icons = {
            vegetables: 'carrot',
            fruits: 'apple-alt',
            grains: 'wheat-awn',
            lentils: 'jar',
            spices: 'mortar-pestle',
            dairy: 'cheese',
            others: 'shopping-basket'
        };
        return icons[category] || 'shopping-basket';
    }
    
    function getRandomQuantity() {
        const quantities = ['100g', '200g', '1 packet', '250g', '500g', '1kg', '5-6 pieces', '1 bunch'];
        return quantities[Math.floor(Math.random() * quantities.length)];
    }
    
    function printGroceryList() {
        const printContent = document.getElementById('grocery-list').innerHTML;
        const originalContent = document.body.innerHTML;
        
        document.body.innerHTML = `
            <h1>Grocery List</h1>
            ${printContent}
            <button onclick="window.print();window.close()">Print</button>
        `;
        
        window.print();
        document.body.innerHTML = originalContent;
    }
    
    function emailGroceryList() {
        alert('In a real app, this would email your grocery list');
    }
    
    function clearGroceryList() {
        if (confirm('Are you sure you want to clear your grocery list?')) {
            document.getElementById('grocery-list').innerHTML = '<p>Your grocery list is empty.</p>';
        }
    }
    
    function loadFavorites() {
        const favoritesList = document.getElementById('favorites-list');
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

        if (favorites.length === 0) {
            favoritesList.innerHTML = `<p>No favorites yet. Click the heart icon on meals to add them to favorites.</p>`;
            return;
        }

        let html = '';
        favorites.forEach(id => {
            const recipe = findRecipeById(id);
            if (recipe) {
                html += createMealCard(recipe, '', '');
            }
        });

        favoritesList.innerHTML = html;

        document.querySelectorAll('.view-recipe').forEach(btn => {
            btn.addEventListener('click', function () {
                const recipeId = this.getAttribute('data-recipe-id');
                const recipe = findRecipeById(recipeId);
                if (recipe) openModal(recipe);
            });
        });
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});
