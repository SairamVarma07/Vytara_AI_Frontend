import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from "recharts";
import api from "../../services/api";
import styles from "./AnalyticsDashboard.module.css";

// Mood emoji mapping
const MOOD_EMOJIS = {
  1: { emoji: "😢", label: "Very Bad", color: "#ef4444" },
  2: { emoji: "😔", label: "Bad", color: "#f97316" },
  3: { emoji: "😐", label: "Okay", color: "#eab308" },
  4: { emoji: "😊", label: "Good", color: "#22c55e" },
  5: { emoji: "😄", label: "Great", color: "#10b981" },
};

// Date range options
const DATE_RANGES = [
  { label: "7 Days", days: 7 },
  { label: "14 Days", days: 14 },
  { label: "30 Days", days: 30 },
  { label: "90 Days", days: 90 },
];

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState(30);
  const [dashboardData, setDashboardData] = useState(null);
  
  // Mood logging state
  const [showMoodLogger, setShowMoodLogger] = useState(false);
  const [todaysMood, setTodaysMood] = useState(null);
  
  // Weight logging state
  const [showWeightLogger, setShowWeightLogger] = useState(false);
  const [weightInput, setWeightInput] = useState("");

  useEffect(() => {
    fetchDashboardData();
    fetchTodaysMood();
  }, [dateRange]);

  const getDateRange = () => {
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    return { startDate, endDate };
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = getDateRange();
      const data = await api.analytics.getDashboard(startDate, endDate);
      setDashboardData(data);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError(err.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const fetchTodaysMood = async () => {
    try {
      const mood = await api.analytics.getTodaysMood();
      setTodaysMood(mood);
    } catch (err) {
      console.error("Error fetching today's mood:", err);
    }
  };

  const handleLogMood = async (score) => {
    try {
      await api.analytics.logMood({ moodScore: score });
      setTodaysMood({ moodScore: score });
      setShowMoodLogger(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Error logging mood:", err);
    }
  };

  const handleLogWeight = async () => {
    if (!weightInput || isNaN(parseFloat(weightInput))) return;
    try {
      await api.analytics.logWeight({ weightKg: parseFloat(weightInput) });
      setWeightInput("");
      setShowWeightLogger(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Error logging weight:", err);
    }
  };

  // Format data for charts
  const formatCalorieData = () => {
    if (!dashboardData?.nutritionAnalytics?.dailyCalories) return [];
    return dashboardData.nutritionAnalytics.dailyCalories.map((day) => ({
      date: new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      calories: day.totalCalories || 0,
      goal: dashboardData.nutritionAnalytics.calorieGoal,
    }));
  };

  const formatWeightData = () => {
    if (!dashboardData?.weightAnalytics?.weightHistory) return [];
    return dashboardData.weightAnalytics.weightHistory.map((entry) => ({
      date: new Date(entry.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      weight: entry.weightKg,
    }));
  };

  const formatMoodData = () => {
    if (!dashboardData?.moodAnalytics?.moodHistory) return [];
    return dashboardData.moodAnalytics.moodHistory.map((entry) => ({
      date: new Date(entry.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      mood: entry.moodScore,
      energy: entry.energyLevel || 0,
      stress: entry.stressLevel || 0,
    }));
  };

  const formatTaskData = () => {
    if (!dashboardData?.taskAnalytics?.dailyCompletions) return [];
    return dashboardData.taskAnalytics.dailyCompletions.map((day) => ({
      date: new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      completed: day.tasksCompleted,
      created: day.tasksCreated,
    }));
  };

  // Contribution calendar data
  const getContributionData = () => {
    if (!dashboardData?.streakData?.activityMap) return [];
    const activityMap = dashboardData.streakData.activityMap;
    return Object.entries(activityMap).map(([date, level]) => ({
      date,
      level,
    }));
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchDashboardData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>
            <span className={styles.icon}>📊</span>
            Analytics Dashboard
          </h2>
          <p className={styles.subtitle}>Track your wellness journey</p>
        </div>
        
        {/* Date Range Selector */}
        <div className={styles.dateRangeSelector}>
          {DATE_RANGES.map((range) => (
            <button
              key={range.days}
              className={`${styles.rangeBtn} ${dateRange === range.days ? styles.active : ""}`}
              onClick={() => setDateRange(range.days)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        {/* Mood Logger */}
        <div className={styles.quickAction}>
          <span className={styles.quickLabel}>Today's Mood</span>
          {todaysMood ? (
            <div className={styles.moodDisplay}>
              <span className={styles.moodEmoji}>
                {MOOD_EMOJIS[todaysMood.moodScore]?.emoji}
              </span>
              <span className={styles.moodText}>
                {MOOD_EMOJIS[todaysMood.moodScore]?.label}
              </span>
            </div>
          ) : (
            <button
              className={styles.logBtn}
              onClick={() => setShowMoodLogger(true)}
            >
              Log Mood
            </button>
          )}
        </div>

        {/* Weight Logger */}
        <div className={styles.quickAction}>
          <span className={styles.quickLabel}>Log Weight</span>
          <button
            className={styles.logBtn}
            onClick={() => setShowWeightLogger(true)}
          >
            {dashboardData?.weightAnalytics?.currentWeight
              ? `${dashboardData.weightAnalytics.currentWeight} kg`
              : "Add Weight"}
          </button>
        </div>

        {/* Streak Display */}
        <div className={styles.quickAction}>
          <span className={styles.quickLabel}>Current Streak</span>
          <div className={styles.streakDisplay}>
            <span className={styles.streakIcon}>🔥</span>
            <span className={styles.streakValue}>
              {dashboardData?.streakData?.currentStreak || 0}
            </span>
            <span className={styles.streakDays}>days</span>
          </div>
        </div>
      </div>

      {/* Mood Logger Modal */}
      {showMoodLogger && (
        <div className={styles.modal} onClick={() => setShowMoodLogger(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>How are you feeling today?</h3>
            <div className={styles.moodOptions}>
              {Object.entries(MOOD_EMOJIS).map(([score, { emoji, label, color }]) => (
                <button
                  key={score}
                  className={styles.moodOption}
                  onClick={() => handleLogMood(parseInt(score))}
                  style={{ "--mood-color": color }}
                >
                  <span className={styles.moodOptionEmoji}>{emoji}</span>
                  <span className={styles.moodOptionLabel}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Weight Logger Modal */}
      {showWeightLogger && (
        <div className={styles.modal} onClick={() => setShowWeightLogger(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Log Your Weight</h3>
            <div className={styles.weightInput}>
              <input
                type="number"
                step="0.1"
                placeholder="Enter weight in kg"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                autoFocus
              />
              <button onClick={handleLogWeight}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>🔥</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {Math.round(dashboardData?.nutritionAnalytics?.averageCalories || 0)}
            </span>
            <span className={styles.statLabel}>Avg. Calories</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>⚖️</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {dashboardData?.weightAnalytics?.weightChange 
                ? `${dashboardData.weightAnalytics.weightChange > 0 ? "+" : ""}${dashboardData.weightAnalytics.weightChange.toFixed(1)}`
                : "—"}
            </span>
            <span className={styles.statLabel}>Weight Change (kg)</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)" }}>😊</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {dashboardData?.moodAnalytics?.averageMood 
                ? dashboardData.moodAnalytics.averageMood.toFixed(1)
                : "—"}
            </span>
            <span className={styles.statLabel}>Avg. Mood Score</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>✅</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>
              {dashboardData?.taskAnalytics?.totalTasksCompleted || 0}
            </span>
            <span className={styles.statLabel}>Tasks Completed</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        {/* Calorie Trend Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            <span>🔥</span> Calorie Intake Trend
          </h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={formatCalorieData()}>
                <defs>
                  <linearGradient id="calorieGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#8b92b8" 
                  tick={{ fill: "#8b92b8", fontSize: 11 }}
                />
                <YAxis 
                  stroke="#8b92b8" 
                  tick={{ fill: "#8b92b8", fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: "rgba(15, 23, 42, 0.95)", 
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff"
                  }} 
                />
                <Area
                  type="monotone"
                  dataKey="calories"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#calorieGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="goal"
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight Trend Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            <span>⚖️</span> Weight Trend
          </h3>
          <div className={styles.chartContainer}>
            {formatWeightData().length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={formatWeightData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#8b92b8"
                    tick={{ fill: "#8b92b8", fontSize: 11 }}
                  />
                  <YAxis 
                    stroke="#8b92b8"
                    tick={{ fill: "#8b92b8", fontSize: 11 }}
                    domain={["dataMin - 1", "dataMax + 1"]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: "rgba(15, 23, 42, 0.95)", 
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#fff"
                    }} 
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.noData}>
                <p>No weight data yet</p>
                <button onClick={() => setShowWeightLogger(true)}>Log Weight</button>
              </div>
            )}
          </div>
        </div>

        {/* Mood Trend Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            <span>😊</span> Mood Trend
          </h3>
          <div className={styles.chartContainer}>
            {formatMoodData().length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={formatMoodData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#8b92b8"
                    tick={{ fill: "#8b92b8", fontSize: 11 }}
                  />
                  <YAxis 
                    stroke="#8b92b8"
                    tick={{ fill: "#8b92b8", fontSize: 11 }}
                    domain={[1, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: "rgba(15, 23, 42, 0.95)", 
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#fff"
                    }} 
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: "#8b5cf6", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.noData}>
                <p>No mood data yet</p>
                <button onClick={() => setShowMoodLogger(true)}>Log Mood</button>
              </div>
            )}
          </div>
        </div>

        {/* Task Completion Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            <span>✅</span> Task Completion
          </h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={formatTaskData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#8b92b8"
                  tick={{ fill: "#8b92b8", fontSize: 11 }}
                />
                <YAxis 
                  stroke="#8b92b8"
                  tick={{ fill: "#8b92b8", fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: "rgba(15, 23, 42, 0.95)", 
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff"
                  }} 
                />
                <Legend />
                <Bar dataKey="completed" fill="#22c55e" name="Completed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="created" fill="#3b82f6" name="Created" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Calendar (Streak Calendar) */}
      <div className={styles.calendarSection}>
        <h3 className={styles.chartTitle}>
          <span>📅</span> Activity Calendar
        </h3>
        <div className={styles.calendar}>
          <div className={styles.calendarGrid}>
            {getContributionData().map(({ date, level }) => (
              <div
                key={date}
                className={`${styles.calendarDay} ${styles[`level${level}`]}`}
                title={`${date}: Activity level ${level}`}
              />
            ))}
          </div>
          <div className={styles.calendarLegend}>
            <span>Less</span>
            <div className={`${styles.legendBox} ${styles.level0}`} />
            <div className={`${styles.legendBox} ${styles.level1}`} />
            <div className={`${styles.legendBox} ${styles.level2}`} />
            <div className={`${styles.legendBox} ${styles.level3}`} />
            <div className={`${styles.legendBox} ${styles.level4}`} />
            <span>More</span>
          </div>
        </div>
        
        {/* Streak Stats */}
        <div className={styles.streakStats}>
          <div className={styles.streakStat}>
            <span className={styles.streakStatValue}>
              {dashboardData?.streakData?.currentStreak || 0}
            </span>
            <span className={styles.streakStatLabel}>Current Streak</span>
          </div>
          <div className={styles.streakStat}>
            <span className={styles.streakStatValue}>
              {dashboardData?.streakData?.longestStreak || 0}
            </span>
            <span className={styles.streakStatLabel}>Longest Streak</span>
          </div>
          <div className={styles.streakStat}>
            <span className={styles.streakStatValue}>
              {dashboardData?.streakData?.totalActiveDays || 0}
            </span>
            <span className={styles.streakStatLabel}>Total Active Days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
