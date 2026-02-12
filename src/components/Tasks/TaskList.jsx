import styles from "./TaskList.module.css";

const priorityOrder = {
  // Support both frontend (High/Medium/Low) and backend (HIGH/MEDIUM/LOW) formats
  High: 1,
  Medium: 2,
  Low: 3,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

// Helper to format priority for display (capitalize first letter)
const formatPriority = (priority) => {
  if (!priority) return 'Medium';
  return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
};

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
  onUpdate,
  editingTaskId,
  setEditingTaskId,
}) {
  if (!tasks.length) {
    return (
      <div className={styles.emptyTasks}>
        <p>No tasks yet. Add one above ⬆️</p>
      </div>
    );
  }

  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const formatDeadline = (deadline) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Overdue", className: styles.overdue };
    if (diffDays === 0) return { text: "Today", className: styles.today };
    if (diffDays === 1) return { text: "Tomorrow", className: styles.tomorrow };
    return { text: `${diffDays} days`, className: styles.upcoming };
  };

  return (
    <div className={styles.taskList}>
      {sorted.map((task) => {
        const deadlineInfo = formatDeadline(task.deadline);

        return (
          <div
            key={task.id}
            className={`${styles.taskItem} ${
              task.completed ? styles.completed : ""
            }`}
          >
            <div
              className={`${styles.taskCheckbox} ${
                task.completed ? styles.checked : ""
              }`}
              onClick={() => onToggle(task.id)}
            />

            <div className={styles.taskContent}>
              {editingTaskId === task.id ? (
                <input
                  type="text"
                  defaultValue={task.text}
                  className={styles.editInput}
                  onBlur={(e) => onUpdate(task.id, { text: e.target.value })}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      onUpdate(task.id, { text: e.target.value });
                    }
                  }}
                  autoFocus
                />
              ) : (
                <>
                  <span
                    className={`${styles.taskText} ${
                      task.completed ? styles.completed : ""
                    }`}
                  >
                    {task.text}
                  </span>
                  {deadlineInfo && (
                    <span
                      className={`${styles.deadline} ${deadlineInfo.className}`}
                    >
                      📅 {deadlineInfo.text}
                    </span>
                  )}
                </>
              )}
            </div>

            <span
              className={`${styles.priorityBadge} ${
                styles[task.priority?.toLowerCase() || 'medium']
              }`}
            >
              {formatPriority(task.priority)}
            </span>

            <div className={styles.taskActions}>
              <button
                className={styles.btnIcon}
                onClick={() => setEditingTaskId(task.id)}
                title="Edit task"
              >
                ✏️
              </button>
              <button
                className={styles.btnIcon}
                onClick={() => onDelete(task.id)}
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
