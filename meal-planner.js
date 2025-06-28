class MealPlanner {
  constructor(database) {
    this.database = database;
    this.generatedPlans = {}; 
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

    
    if (!this.generatedPlans[userId]) {
      this.generatedPlans[userId] = [];
    }

    
    for (let day = 0; day < 7; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      
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
    
    let candidates = this.getCandidateMeals(
      mealType,
      diabeticStatus,
      dietType,
      region,
      allergies
    );

    
    candidates = candidates.filter(
      (meal) =>
        meal.nutrition.calories >= targetCalories * 0.8 &&
        meal.nutrition.calories <= targetCalories * 1.2
    );

    
    const usedMeals = this.generatedPlans[userId].slice(-5);
    candidates = candidates.filter((meal) => !usedMeals.includes(meal.id));

    
    if (candidates.length === 0) {
      candidates = this.getCandidateMeals(
        mealType,
        diabeticStatus,
        dietType,
        region,
        allergies
      ).filter((meal) => !usedMeals.includes(meal.id));
    }

    
    if (candidates.length === 0) {
      candidates = this.getCandidateMeals(
        mealType,
        diabeticStatus,
        dietType,
        region,
        allergies
      );
    }

    
    const selectedMeal = this.selectByFrequencyWeight(candidates);

  
    this.generatedPlans[userId].push(selectedMeal.id);

    return selectedMeal;
  }

  getCandidateMeals(mealType, diabeticStatus, dietType, region, allergies) {
  
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

    
    meals = meals.filter((meal) => meal.suitableFor.diets.includes(dietType));

    
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

    
    const weightedArray = [];
    meals.forEach((meal) => {
      const weight = meal.frequencyWeight || 1;
      for (let i = 0; i < weight; i++) {
        weightedArray.push(meal);
      }
    });

    
    return weightedArray[Math.floor(Math.random() * weightedArray.length)];
  }

  generateGroceryList(weeklyPlan) {
    const groceryItems = {};

    
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
            groceryItems[name].meals.push(meal.name);
          }
        });
      }
    }

    const categorizedList = {
      vegetables: [],
      fruits: [],
      grains: [],
      lentils: [],
      spices: [],
      dairy: [],
      others: [],
    };


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
