import { useState } from "react";
import styles from "./DailyGoalModal.module.css";

export default function DailyGoalModal({ onSave }) {
  const [goal, setGoal] = useState("");

  function handleSave() {
    if (!goal || goal <= 0) return;
    onSave(Number(goal));
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Set your daily calorie goal</h2>
        <p>This helps us keep you on track.</p>

        <input
          type="number"
          placeholder="e.g. 1800 kcal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <button onClick={handleSave}>Save Goal</button>
      </div>
    </div>
  );
}
