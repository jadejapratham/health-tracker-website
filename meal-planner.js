// meal-planner.js
class MealPlanner {
  constructor(database) {
    this.database = database;
    this.generatedPlans = {}; // { userId: [mealId1, mealId2, ...] }
    this.nutritionStandards = {
      diabetic: {
        carbsRatio: 0.45,
        proteinRatio: 0.25,
        fatRatio: 0.3,
      },
      regular: {
        carbsRatio: 0.5,
        proteinRatio: 0.2,
        fatRatio: 0.3,
      },
    };
  }

  generateWeeklyPlan(userPreferences) {
    const {
      isDiabetic,
      dietType,
      region,
      calorieGoal,
      allergies,
      activityLevel,
      userId,
    } = userPreferences;
    const weeklyPlan = {};
    const diabeticStatus = isDiabetic ? "diabetic" : "regular";

    // Initialize user's meal history if not exists
    if (!this.generatedPlans[userId]) {
      this.generatedPlans[userId] = [];
    }

    // Generate for 7 days
    for (let day = 0; day < 7; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      // Calculate meal calorie targets
      const mealTargets = this.calculateMealCalories(
        calorieGoal,
        diabeticStatus
      );

      weeklyPlan[dayName] = {
        date: date.toISOString().split("T")[0],
        meals: {
          breakfast: this.generateMeal(
            "breakfast",
            diabeticStatus,
            dietType,
            region,
            mealTargets.breakfast,
            allergies,
            userId
          ),
          lunch: this.generateMeal(
            "lunch",
            diabeticStatus,
            dietType,
            region,
            mealTargets.lunch,
            allergies,
            userId
          ),
          dinner: this.generateMeal(
            "dinner",
            diabeticStatus,
            dietType,
            region,
            mealTargets.dinner,
            allergies,
            userId
          ),
          snack: this.generateMeal(
            "snack",
            diabeticStatus,
            dietType,
            region,
            mealTargets.snack,
            allergies,
            userId
          ),
        },
        nutrition: {
          totalCalories: 0,
          totalCarbs: 0,
          totalProtein: 0,
          totalFat: 0,
          totalFiber: 0,
        },
      };

      // Calculate daily nutrition totals
      for (const meal of Object.values(weeklyPlan[dayName].meals)) {
        weeklyPlan[dayName].nutrition.totalCalories += meal.nutrition.calories;
        weeklyPlan[dayName].nutrition.totalCarbs += meal.nutrition.carbs;
        weeklyPlan[dayName].nutrition.totalProtein += meal.nutrition.protein;
        weeklyPlan[dayName].nutrition.totalFat += meal.nutrition.fat;
        weeklyPlan[dayName].nutrition.totalFiber += meal.nutrition.fiber;
      }
    }

    return weeklyPlan;
  }

  calculateMealCalories(totalCalories, diabeticStatus) {
    // Adjust distribution based on diabetic status
    if (diabeticStatus === "diabetic") {
      return {
        breakfast: Math.round(totalCalories * 0.25),
        lunch: Math.round(totalCalories * 0.35),
        dinner: Math.round(totalCalories * 0.3),
        snack: Math.round(totalCalories * 0.1),
      };
    } else {
      return {
        breakfast: Math.round(totalCalories * 0.2),
        lunch: Math.round(totalCalories * 0.4),
        dinner: Math.round(totalCalories * 0.3),
        snack: Math.round(totalCalories * 0.1),
      };
    }
  }

  generateMeal(
    mealType,
    diabeticStatus,
    dietType,
    region,
    targetCalories,
    allergies,
    userId
  ) {
    // Get all possible meals that match criteria
    let candidates = this.getCandidateMeals(
      mealType,
      diabeticStatus,
      dietType,
      region,
      allergies
    );

    // Filter by calorie range (±20% of target)
    candidates = candidates.filter(
      (meal) =>
        meal.nutrition.calories >= targetCalories * 0.8 &&
        meal.nutrition.calories <= targetCalories * 1.2
    );

    // Filter out recently used meals (last 5 meals)
    const usedMeals = this.generatedPlans[userId].slice(-5);
    candidates = candidates.filter((meal) => !usedMeals.includes(meal.id));

    // If no candidates, expand calorie range
    if (candidates.length === 0) {
      candidates = this.getCandidateMeals(
        mealType,
        diabeticStatus,
        dietType,
        region,
        allergies
      ).filter((meal) => !usedMeals.includes(meal.id));
    }

    // If still no candidates, allow some repetition
    if (candidates.length === 0) {
      candidates = this.getCandidateMeals(
        mealType,
        diabeticStatus,
        dietType,
        region,
        allergies
      );
    }

    // Select meal based on frequency weight
    const selectedMeal = this.selectByFrequencyWeight(candidates);

    // Track generated meal
    this.generatedPlans[userId].push(selectedMeal.id);

    return selectedMeal;
  }

  getCandidateMeals(mealType, diabeticStatus, dietType, region, allergies) {
    // Get base meals for the category
    let meals = [];
    const regions = region === "all" ? this.database.regions : [region];

    regions.forEach((reg) => {
      if (
        this.database.categories[mealType] &&
        this.database.categories[mealType][diabeticStatus] &&
        this.database.categories[mealType][diabeticStatus][reg]
      ) {
        meals = meals.concat(
          this.database.categories[mealType][diabeticStatus][reg]
        );
      }
    });

    // Filter by diet type
    meals = meals.filter((meal) => meal.suitableFor.diets.includes(dietType));

    // Filter by allergies
    if (allergies && allergies.length > 0 && !allergies.includes("none")) {
      meals = meals.filter((meal) =>
        allergies.every(
          (allergy) => !meal.suitableFor.allergies.includes(allergy)
        )
      );
    }

    return meals;
  }

  selectByFrequencyWeight(meals) {
    if (meals.length === 0) {
      return {
        id: "fallback",
        name: "Custom Balanced Meal",
        description: "A meal tailored to your dietary needs",
        nutrition: {
          calories: 300,
          carbs: 40,
          protein: 15,
          fat: 10,
          fiber: 8,
          gi: 50,
        },
        ingredients: [],
        instructions: ["Prepare according to your dietary needs"],
      };
    }

    // Create weighted array based on frequencyWeight
    const weightedArray = [];
    meals.forEach((meal) => {
      const weight = meal.frequencyWeight || 1;
      for (let i = 0; i < weight; i++) {
        weightedArray.push(meal);
      }
    });

    // Random selection from weighted array
    return weightedArray[Math.floor(Math.random() * weightedArray.length)];
  }

  generateGroceryList(weeklyPlan) {
    const groceryItems = {};

    // Aggregate ingredients from all meals
    for (const day of Object.values(weeklyPlan)) {
      for (const meal of Object.values(day.meals)) {
        meal.ingredients.forEach((ingredient) => {
          const name = ingredient.name;
          if (!groceryItems[name]) {
            groceryItems[name] = {
              quantity: ingredient.quantity,
              meals: [meal.name],
            };
          } else {
            // Combine quantities (simplified logic - in real app would convert units)
            groceryItems[name].meals.push(meal.name);
          }
        });
      }
    }

    // Categorize items
    const categorizedList = {
      vegetables: [],
      fruits: [],
      grains: [],
      lentils: [],
      spices: [],
      dairy: [],
      others: [],
    };

    // Simple categorization (in real app would use more sophisticated matching)
    for (const [item, details] of Object.entries(groceryItems)) {
      const lowerItem = item.toLowerCase();

      if (
        lowerItem.includes("flour") ||
        lowerItem.includes("rice") ||
        lowerItem.includes("quinoa")
      ) {
        categorizedList.grains.push({ name: item, ...details });
      } else if (
        lowerItem.includes("dal") ||
        lowerItem.includes("lentil") ||
        lowerItem.includes("bean")
      ) {
        categorizedList.lentils.push({ name: item, ...details });
      } else if (
        lowerItem.includes("milk") ||
        lowerItem.includes("curd") ||
        lowerItem.includes("ghee")
      ) {
        categorizedList.dairy.push({ name: item, ...details });
      } else if (
        lowerItem.includes("chili") ||
        lowerItem.includes("masala") ||
        lowerItem.includes("spice")
      ) {
        categorizedList.spices.push({ name: item, ...details });
      } else if (
        lowerItem.includes("onion") ||
        lowerItem.includes("spinach") ||
        lowerItem.includes("vegetable")
      ) {
        categorizedList.vegetables.push({ name: item, ...details });
      } else if (lowerItem.includes("fruit")) {
        categorizedList.fruits.push({ name: item, ...details });
      } else {
        categorizedList.others.push({ name: item, ...details });
      }
    }

    return categorizedList;
  }
}
