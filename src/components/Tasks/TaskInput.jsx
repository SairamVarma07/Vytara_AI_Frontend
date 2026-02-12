import { useState } from "react";
import styles from "./TaskInput.module.css";

export default function TaskInput({ onAdd, placeholder, mode }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    mode === "task" ? onAdd(text, priority, deadline) : onAdd(text);
    setText("");
    setDeadline("");
  };

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={styles.input}
      />

      {mode === "task" && (
        <>
          <div className={styles.controls}>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={styles.select}
              >
                <option value="High">🔥 High (+30 XP)</option>
                <option value="Medium">⚡ Medium (+20 XP)</option>
                <option value="Low">💡 Low (+10 XP)</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.label}>Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={styles.dateInput}
              />
            </div>
          </div>
        </>
      )}

      <button onClick={handleAdd} className={styles.addButton}>
        Add
      </button>
    </div>
  );
}
