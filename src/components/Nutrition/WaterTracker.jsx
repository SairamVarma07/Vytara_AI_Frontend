import styles from "./WaterTracker.module.css";

export default function WaterTracker({ glasses, onAddGlass }) {
  const percentage = (glasses / 8) * 100;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Hydration</h3>

      <div className={styles.content}>
        <div className={styles.glassContainer}>
          <div
            className={styles.waterFill}
            style={{ height: `${percentage}%` }}
          >
            <div className={styles.wave} />
          </div>
          <div className={styles.glassBorder} />
        </div>

        <div className={styles.info}>
          <div className={styles.count}>{glasses} / 8</div>
          <div className={styles.label}>glasses today</div>
          <button onClick={onAddGlass} className={styles.addButton}>
            + Add Glass 💧
          </button>
        </div>
      </div>
    </div>
  );
}
