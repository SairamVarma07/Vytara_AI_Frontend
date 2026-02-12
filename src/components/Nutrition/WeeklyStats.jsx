import { useState, useEffect } from "react";
import api from "../../services/api";
import styles from "./WeeklyStats.module.css";

export default function WeeklyStats({ totalCalories }) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);

  // Get current day of week (0 = Sunday, 6 = Saturday)
  const today = new Date().getDay();

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      try {
        setLoading(true);
        
        // Calculate date range for the current week (Sunday to Saturday)
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Go to Sunday
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Go to Saturday
        
        const startDate = startOfWeek.toISOString().split('T')[0];
        const endDate = endOfWeek.toISOString().split('T')[0];
        
        const response = await api.nutrition.getNutritionStats(startDate, endDate);
        
        // Backend returns dailyStats array with { date, totalCalories, ... }
        if (response && response.dailyStats) {
          const newWeeklyData = [0, 0, 0, 0, 0, 0, 0];
          
          response.dailyStats.forEach(day => {
            // Parse date string "YYYY-MM-DD" to avoid timezone issues
            const [year, month, dayOfMonth] = day.date.split('-').map(Number);
            const dayDate = new Date(year, month - 1, dayOfMonth);
            const dayIndex = dayDate.getDay();
            newWeeklyData[dayIndex] = day.totalCalories || 0;
          });
          
          // Override today's data with the prop (more accurate/current)
          newWeeklyData[today] = totalCalories;
          
          setWeeklyData(newWeeklyData);
        }
      } catch (err) {
        console.error("Error fetching weekly stats:", err);
        // Fallback: just show today's calories
        const fallbackData = [0, 0, 0, 0, 0, 0, 0];
        fallbackData[today] = totalCalories;
        setWeeklyData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyStats();
  }, [today, totalCalories]);

  const maxCalories = Math.max(...weeklyData, 2500); // Ensure minimum scale

  if (loading) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>Weekly Overview</h3>
        <div style={{ textAlign: "center", padding: "40px", color: "#8b92b0" }}>
          Loading weekly data...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Weekly Overview</h3>

      <div className={styles.chartContainer}>
        {weeklyData.map((calories, index) => {
          const height = (calories / maxCalories) * 100;
          const isToday = index === today;

          return (
            <div key={index} className={styles.barWrapper}>
              <div
                className={`${styles.bar} ${isToday ? styles.active : ""}`}
                style={{ height: `${height}px` }}
              >
                {isToday && (
                  <div className={styles.calorieLabel}>{calories}</div>
                )}
              </div>
              <div
                className={`${styles.dayLabel} ${
                  isToday ? styles.activeDay : ""
                }`}
              >
                {days[index]}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.weekInfo}>
        <div className={styles.weekInfoItem}>
          <span className={styles.weekInfoLabel}>Weekly Avg:</span>
          <span className={styles.weekInfoValue}>
            {Math.round(weeklyData.reduce((a, b) => a + b, 0) / 7)} kcal
          </span>
        </div>
        <div className={styles.weekInfoDot}>•</div>
        <div className={styles.weekInfoItem}>
          <span className={styles.weekInfoLabel}>Today:</span>
          <span className={styles.weekInfoValue} style={{ color: "#22c55e" }}>
            {days[today]}
          </span>
        </div>
      </div>
    </div>
  );
}
