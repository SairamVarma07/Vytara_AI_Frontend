import styles from "./MealList.module.css";

export default function MealList({ meals }) {
  if (meals.length === 0) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>Today's Meals</h3>
        <p className={styles.empty}>No meals logged yet. Start tracking! 🍽️</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Today's Meals</h3>
      <div className={styles.list}>
        {meals.map((meal) => (
          <div key={meal.id} className={styles.mealItem}>
            <div className={styles.mealInfo}>
              <div className={styles.mealMeta}>
                {meal.time} • {meal.type}
              </div>
              <div className={styles.mealName}>{meal.name}</div>
              <div className={styles.macros}>
                P: {meal.macros.protein}g • C: {meal.macros.carbs}g • F:{" "}
                {meal.macros.fats}g
              </div>
            </div>
            <div className={styles.calories}>🔥 {meal.calories}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
