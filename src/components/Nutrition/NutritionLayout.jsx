import { useState, useEffect } from "react";
import CircularProgress from "./CircularProgress";
import WaterTracker from "./WaterTracker";
import WeeklyStats from "./WeeklyStats";
import MealForm from "./MealForm";
import MealList from "./MealList";
import AnalyticsDashboard from "./AnalyticsDashboard";
import { estimateCalories, estimateMacros } from "../../utils/nutritionUtils";
import api from "../../services/api";
import styles from "./NutritionLayout.module.css";

// Particle component
const Particle = ({ delay }) => (
  <div
    className={styles.particle}
    style={{
      left: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${15 + Math.random() * 10}s`,
    }}
  />
);

export default function NutritionLayout() {
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [meals, setMeals] = useState([]);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Daily macro goals (in grams)
  const [macroGoals, setMacroGoals] = useState({
    protein: 150, // 150g protein goal
    carbs: 200, // 200g carbs goal
    fats: 65, // 65g fats goal
  });

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch meals, goals, and water intake for today
        const [mealsRes, goalRes, waterRes] = await Promise.all([
          api.nutrition.getMeals(today),
          api.nutrition.getDailyGoal(),
          api.nutrition.getWaterIntake(today)
        ]);

        // API service already extracts data, so responses are the data directly
        // Convert backend format to frontend format (backend has protein, carbs, fats as separate fields)
        const mealsWithMacros = Array.isArray(mealsRes) ? mealsRes.map(meal => ({
          ...meal,
          macros: {
            protein: meal.protein || 0,
            carbs: meal.carbs || 0,
            fats: meal.fats || 0
          }
        })) : [];
        setMeals(mealsWithMacros);
        
        // Set goals from API
        if (goalRes) {
          setDailyGoal(goalRes.dailyCalorieGoal || 2000);
          setMacroGoals({
            protein: goalRes.proteinGoal || 150,
            carbs: goalRes.carbsGoal || 200,
            fats: goalRes.fatsGoal || 65
          });
        }
        
        // Set water intake from API
        setWaterGlasses(waterRes?.glasses || 0);
        
      } catch (err) {
        console.error("Error fetching nutrition data:", err);
        setError(err.message || "Failed to load nutrition data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [today]);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalMacros = meals.reduce(
    (acc, meal) => ({
      protein: acc.protein + meal.macros.protein,
      carbs: acc.carbs + meal.macros.carbs,
      fats: acc.fats + meal.macros.fats,
    }),
    { protein: 0, carbs: 0, fats: 0 }
  );

  const remaining = Math.max(dailyGoal - totalCalories, 0);
  const caloriePercentage = Math.min((totalCalories / dailyGoal) * 100, 100);

  // Calculate macro percentages based on goals
  const proteinPercentage = Math.min(
    (totalMacros.protein / macroGoals.protein) * 100,
    100
  );
  const carbsPercentage = Math.min(
    (totalMacros.carbs / macroGoals.carbs) * 100,
    100
  );
  const fatsPercentage = Math.min(
    (totalMacros.fats / macroGoals.fats) * 100,
    100
  );

  const handleAddMeal = async (mealType, mealName) => {
    if (!mealName.trim()) return;

    try {
      let calories, protein, carbs, fats;
      try {
        const estimate = await api.nutrition.estimate(mealName, mealType);
        calories = estimate.calories;
        protein = estimate.protein;
        carbs = estimate.carbs;
        fats = estimate.fats;
      } catch {
        // Fallback to local heuristic if backend estimate fails (e.g. estimator service down)
        calories = estimateCalories(mealType, mealName);
        const macros = estimateMacros(calories);
        protein = macros.protein;
        carbs = macros.carbs;
        fats = macros.fats;
      }

      // Backend expects: { type, name, calories, protein, carbs, fats, time, date }
      const mealData = {
        type: mealType.toUpperCase(), // Backend expects BREAKFAST, LUNCH, DINNER, SNACK
        name: mealName,
        calories,
        protein,
        carbs,
        fats,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: today
      };

      // Add meal to backend
      const response = await api.nutrition.addMeal(mealData);
      
      // Convert backend format to frontend format (with macros object)
      const mealWithMacros = {
        ...response,
        macros: {
          protein: response.protein,
          carbs: response.carbs,
          fats: response.fats
        }
      };
      
      // API service already extracts data
      setMeals([...meals, mealWithMacros]);
    } catch (err) {
      console.error("Error adding meal:", err);
      setError(err.message || "Failed to add meal");
    }
  };

  const handleAddWater = async () => {
    try {
      const newGlasses = Math.min(waterGlasses + 1, 8);
      
      // Update water intake in backend (backend expects: { glasses, date })
      const response = await api.nutrition.updateWaterIntake({ 
        glasses: newGlasses, 
        date: today 
      });
      
      // Update local state
      setWaterGlasses(response?.glasses || newGlasses);
    } catch (err) {
      console.error("Error updating water:", err);
      setError(err.message || "Failed to update water intake");
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1729 100%)",
        color: "#fff"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "4px solid rgba(102, 126, 234, 0.3)",
            borderTop: "4px solid #667eea",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }} />
          <p>Loading nutrition data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1729 100%)",
        color: "#fff"
      }}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ color: "#ef4444", marginBottom: "10px" }}>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: "10px 20px",
              background: "#667eea",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background:
          "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1729 100%)",
        position: "relative",
      }}
    >
      {/* Particles */}
      {[...Array(25)].map((_, i) => (
        <Particle key={i} delay={i * 0.4} />
      ))}

      {/* Header */}
      <div className={styles.header}>
        <h1>NUTRITION AI</h1>
        <p>Smart Meal Tracking System</p>
      </div>

      {/* Main Grid - Stats Cards */}
      <div className={styles.statsGrid}>
        {/* Calorie Ring */}
        <div className={styles.calorieCard}>
          <CircularProgress
            percentage={caloriePercentage}
            color="#22c55e"
            label="Calories"
            value={totalCalories}
            size={180}
          />
          <div className={styles.calorieInfo}>
            <div className={styles.goalText}>Goal: {dailyGoal} kcal</div>
            <div className={styles.remainingText}>
              Remaining: {remaining} kcal
            </div>
          </div>
        </div>

        {/* Macros Card */}
        <div className={styles.macrosCard}>
          <h3 className={styles.cardTitle}>Macros</h3>
          <div className={styles.macrosGrid}>
            <CircularProgress
              percentage={proteinPercentage}
              color="#ef4444"
              label="Protein"
              value={`${totalMacros.protein}g`}
              size={110}
            />
            <CircularProgress
              percentage={carbsPercentage}
              color="#f59e0b"
              label="Carbs"
              value={`${totalMacros.carbs}g`}
              size={110}
            />
            <CircularProgress
              percentage={fatsPercentage}
              color="#8b5cf6"
              label="Fats"
              value={`${totalMacros.fats}g`}
              size={110}
            />
          </div>
          <div className={styles.macroGoals}>
            <div className={styles.macroGoalItem}>
              <span className={styles.macroGoalLabel}>Protein Goal:</span>
              <span className={styles.macroGoalValue}>
                {macroGoals.protein}g
              </span>
            </div>
            <div className={styles.macroGoalItem}>
              <span className={styles.macroGoalLabel}>Carbs Goal:</span>
              <span className={styles.macroGoalValue}>{macroGoals.carbs}g</span>
            </div>
            <div className={styles.macroGoalItem}>
              <span className={styles.macroGoalLabel}>Fats Goal:</span>
              <span className={styles.macroGoalValue}>{macroGoals.fats}g</span>
            </div>
          </div>
        </div>

        {/* Water Tracker */}
        <WaterTracker
          glasses={waterGlasses}
          onAddGlass={handleAddWater}
        />
      </div>

      {/* Meal Form */}
      <MealForm onAddMeal={handleAddMeal} />

      {/* Weekly Stats */}
      <WeeklyStats totalCalories={totalCalories} />

      {/* Meal List */}
      <MealList meals={meals} />

      {/* Analytics Dashboard */}
      <AnalyticsDashboard />

    </div>
  );
}
