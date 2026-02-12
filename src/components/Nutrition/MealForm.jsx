import { useState } from "react";
import styles from "./MealForm.module.css";

export default function MealForm({ onAddMeal }) {
  const [mealType, setMealType] = useState("Breakfast");
  const [mealName, setMealName] = useState("");

  const handleSubmit = () => {
    if (!mealName.trim()) return;
    onAddMeal(mealType, mealName);
    setMealName("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Log Meal</h3>
      <div className={styles.form}>
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className={styles.select}
        >
          <option value="Breakfast">🌅 Breakfast</option>
          <option value="Lunch">🌞 Lunch</option>
          <option value="Dinner">🌙 Dinner</option>
          <option value="Snack">🍎 Snack</option>
        </select>
        <input
          type="text"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What did you eat?"
          className={styles.input}
        />
        <button onClick={handleSubmit} className={styles.button}>
          AI meal log
        </button>
      </div>
    </div>
  );
}
