import { useState, useEffect } from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import LevelUpModal from "./LevelUpModal";
import Leaderboard from "./Leaderboard";
import api from "../../services/api";
import styles from "./TasksLayout.module.css";

const XP_BY_PRIORITY = {
  // Support both frontend (High/Medium/Low) and backend (HIGH/MEDIUM/LOW) formats
  High: 30,
  Medium: 20,
  Low: 10,
  HIGH: 30,
  MEDIUM: 20,
  LOW: 10,
};

const XP_PER_LEVEL = 100;

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

// XP Popup
const XPPopup = ({ amount, id }) => (
  <div key={id} className={styles.xpPopup}>
    +{amount} XP
  </div>
);

export default function TasksLayout() {
  const [taskLists, setTaskLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [xpPopups, setXpPopups] = useState([]);
  const [editingListId, setEditingListId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch task lists and user stats on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch task lists and user stats
        const [listsRes, statsRes] = await Promise.all([
          api.tasks.getTaskLists(),
          api.tasks.getUserStats()
        ]);

        // API service already extracts data
        setTaskLists(Array.isArray(listsRes) ? listsRes : []);
        
        if (statsRes) {
          setXp(statsRes.xp || 0);
          setLevel(statsRes.level || 1);
        }
        
        // Set first list as active if exists
        if (Array.isArray(listsRes) && listsRes.length > 0) {
          setActiveListId(listsRes[0].id);
        }
        
      } catch (err) {
        console.error("Error fetching tasks data:", err);
        setError(err.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch tasks when active list changes
  useEffect(() => {
    const fetchTasks = async () => {
      if (!activeListId) return;

      try {
        const response = await api.tasks.getTasks(activeListId);
        
        // API service already extracts data
        setTaskLists(prev => prev.map(list => 
          list.id === activeListId 
            ? { ...list, tasks: Array.isArray(response) ? response : [] }
            : list
        ));
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, [activeListId]);

  /* ───────── XP SYSTEM ───────── */
  const gainXP = (amount) => {
    setXpPopups((prev) => [...prev, { id: Date.now(), amount }]);
    setTimeout(() => {
      setXpPopups((prev) => prev.slice(1));
    }, 1200);

    setXp((prevXP) => {
      const nextXP = prevXP + amount;
      const nextLevel = Math.floor(nextXP / XP_PER_LEVEL) + 1;

      if (nextLevel > level) {
        setLevel(nextLevel);
        setShowLevelUp(true);
      }

      return nextXP;
    });
  };

  /* ───────── TASK LIST CRUD ───────── */
  const createTaskList = async (name) => {
    if (!name.trim()) return;

    try {
      const response = await api.tasks.createTaskList(name);
      const newList = { ...response, tasks: [] };
      
      setTaskLists([newList, ...taskLists]);
      setActiveListId(newList.id);
    } catch (err) {
      console.error("Error creating task list:", err);
      setError(err.message || "Failed to create task list");
    }
  };

  const deleteTaskList = async (id) => {
    try {
      await api.tasks.deleteTaskList(id);
      setTaskLists(taskLists.filter((l) => l.id !== id));
      if (id === activeListId) setActiveListId(null);
    } catch (err) {
      console.error("Error deleting task list:", err);
      setError(err.message || "Failed to delete task list");
    }
  };

  const updateTaskList = async (id, newName) => {
    if (!newName.trim()) return;
    
    try {
      await api.tasks.updateTaskList(id, newName);
      setTaskLists(
        taskLists.map((list) =>
          list.id === id ? { ...list, name: newName } : list
        )
      );
      setEditingListId(null);
    } catch (err) {
      console.error("Error updating task list:", err);
      setError(err.message || "Failed to update task list");
    }
  };

  /* ───────── TASK CRUD ───────── */
  const addTask = async (text, priority, deadline) => {
    if (!text.trim()) return;

    try {
      // Convert priority to uppercase for backend enum (HIGH, MEDIUM, LOW)
      const backendPriority = priority ? priority.toUpperCase() : 'MEDIUM';
      // Send null instead of empty string for deadline
      const backendDeadline = deadline && deadline.trim() !== '' ? deadline : null;
      
      const response = await api.tasks.addTask(activeListId, {
        text,
        priority: backendPriority,
        deadline: backendDeadline,
        completed: false
      });

      setTaskLists(
        taskLists.map((list) =>
          list.id === activeListId
            ? {
                ...list,
                tasks: [...(list.tasks || []), response],
              }
            : list
        )
      );
    } catch (err) {
      console.error("Error adding task:", err);
      setError(err.message || "Failed to add task");
    }
  };

  const toggleTask = async (taskId) => {
    const activeList = taskLists.find(l => l.id === activeListId);
    const task = activeList?.tasks?.find(t => t.id === taskId);
    
    if (!task) return;

    // Check if we're completing the task (not uncompleting)
    const isCompleting = !task.completed;

    try {
      // Ensure priority is uppercase for backend enum
      const backendPriority = task.priority ? task.priority.toUpperCase() : 'MEDIUM';
      
      const updatedTask = {
        ...task,
        priority: backendPriority,
        completed: !task.completed
      };

      const response = await api.tasks.updateTask(activeListId, taskId, updatedTask);

      // If task was just completed, award XP locally based on priority
      if (isCompleting) {
        // Get XP amount based on priority (supports both HIGH and High formats)
        const priorityKey = task.priority?.toUpperCase() || 'MEDIUM';
        const xpAmount = XP_BY_PRIORITY[priorityKey] || XP_BY_PRIORITY.MEDIUM;
        gainXP(xpAmount);
      }

      setTaskLists(
        taskLists.map((list) =>
          list.id === activeListId
            ? {
                ...list,
                tasks: list.tasks.map((t) =>
                  t.id === taskId ? response : t
                ),
              }
            : list
        )
      );
    } catch (err) {
      console.error("Error toggling task:", err);
      setError(err.message || "Failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.tasks.deleteTask(activeListId, taskId);
      
      setTaskLists(
        taskLists.map((list) =>
          list.id === activeListId
            ? {
                ...list,
                tasks: list.tasks.filter((t) => t.id !== taskId),
              }
            : list
        )
      );
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(err.message || "Failed to delete task");
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const response = await api.tasks.updateTask(activeListId, taskId, updates);
      
      setTaskLists(
        taskLists.map((list) =>
          list.id === activeListId
            ? {
                ...list,
                tasks: list.tasks.map((t) =>
                  t.id === taskId ? response : t
                ),
              }
            : list
        )
      );
      setEditingTaskId(null);
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err.message || "Failed to update task");
    }
  };

  const activeList = taskLists.find((l) => l.id === activeListId);

  const progress =
    activeList && activeList.tasks.length
      ? Math.round(
          (activeList.tasks.filter((t) => t.completed).length /
            activeList.tasks.length) *
            100
        )
      : 0;

  const xpProgress = ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;

  if (loading) {
    return (
      <div className={styles.wrapper} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center", color: "#fff" }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "4px solid rgba(102, 126, 234, 0.3)",
            borderTop: "4px solid #667eea",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }} />
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center", color: "#fff", padding: "20px" }}>
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
    <div className={styles.wrapper}>
      {/* Particles */}
      {[...Array(30)].map((_, i) => (
        <Particle key={i} delay={i * 0.5} />
      ))}

      {/* Header */}
      <div className={styles.header}>
        <h1>TASK COMMAND</h1>
        <p>Level Up Your Productivity</p>
      </div>

      {/* XP Bar */}
      <div className={styles.xpContainer}>
        <div className={styles.xpHeader}>
          <div className={styles.levelBadgeSmall}>LEVEL {level}</div>
          <div className={styles.xpText}>
            {xp} / {level * XP_PER_LEVEL} XP
          </div>
        </div>
        <div className={styles.xpBarOuter}>
          <div
            className={styles.xpBarInner}
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      {/* Layout */}
      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h3>Task Lists</h3>
          <TaskInput
            mode="list"
            onAdd={createTaskList}
            placeholder="Create a task list..."
          />

          <div className={styles.listGrid}>
            {taskLists.map((list) => (
              <div
                key={list.id}
                className={`${styles.listCard} ${
                  activeListId === list.id ? styles.active : ""
                }`}
              >
                {editingListId === list.id ? (
                  <input
                    type="text"
                    defaultValue={list.name}
                    className={styles.editInput}
                    onBlur={(e) => updateTaskList(list.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        updateTaskList(list.id, e.target.value);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <div
                    className={styles.listCardContent}
                    onClick={() => setActiveListId(list.id)}
                  >
                    <div className={styles.listIcon} />
                    <span className={styles.listName}>{list.name}</span>
                  </div>
                )}
                <div className={styles.listActions}>
                  <button
                    className={styles.btnEdit}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingListId(list.id);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.btnDelete}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTaskList(list.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Leaderboard */}
          <Leaderboard currentLevel={level} currentXP={xp} />
        </aside>

        {/* Main Content */}
        <section className={styles.mainPanel}>
          {activeList ? (
            <>
              <h2>{activeList.name}</h2>

              {/* Progress */}
              {activeList.tasks.length > 0 && (
                <div className={styles.progressSection}>
                  <div className={styles.progressHeader}>
                    <span className={styles.progressLabel}>Progress</span>
                    <span className={styles.progressPercent}>{progress}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Task Input */}
              <TaskInput
                mode="task"
                onAdd={addTask}
                placeholder="Add a task..."
              />

              {/* Task List */}
              <TaskList
                tasks={activeList.tasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onUpdate={updateTask}
                editingTaskId={editingTaskId}
                setEditingTaskId={setEditingTaskId}
              />
            </>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <h3>Capture now, plan later</h3>
              <p>Create or select a task list to begin.</p>
            </div>
          )}
        </section>
      </div>

      {/* XP Popups */}
      <div className={styles.xpPopupContainer}>
        {xpPopups.map((popup) => (
          <XPPopup key={popup.id} amount={popup.amount} id={popup.id} />
        ))}
      </div>

      {/* Level Up Modal */}
      {showLevelUp && (
        <LevelUpModal level={level} onClose={() => setShowLevelUp(false)} />
      )}
    </div>
  );
}
