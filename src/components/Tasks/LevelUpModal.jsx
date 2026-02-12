import styles from "./LevelUpModal.module.css";

export default function LevelUpModal({ level, onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.levelBadge}>{level}</div>
        <h2>LEVEL UP!</h2>
        <p>You've reached level {level}</p>
        <button onClick={onClose} className={styles.modalBtn}>
          CONTINUE
        </button>
      </div>
    </div>
  );
}
