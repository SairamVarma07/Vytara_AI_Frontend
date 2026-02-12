import styles from "./TaskItem.module.css";

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div
      className={`${styles.taskItem} ${task.completed ? styles.completed : ""}`}
    >
      <div
        className={`${styles.taskCheckbox} ${
          task.completed ? styles.checked : ""
        }`}
        onClick={() => onToggle(task.id)}
      />
      <span
        className={`${styles.taskText} ${
          task.completed ? styles.completed : ""
        }`}
      >
        {task.text}
      </span>
      <span
        className={`${styles.priorityBadge} ${
          styles[task.priority.toLowerCase()]
        }`}
      >
        {task.priority}
      </span>
      <div className={styles.taskActions}>
        <button className={styles.btnIcon} onClick={() => onDelete(task.id)}>
          🗑️
        </button>
      </div>
    </div>
  );
}
