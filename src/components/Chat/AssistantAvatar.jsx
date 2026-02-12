import styles from "./AssistantAvatar.module.css";

export default function AssistantAvatar({ isTyping }) {
  return (
    <div className={styles.avatarWrapper}>
      <div
        className={`${styles.avatar} ${isTyping ? styles.typing : styles.idle}`}
      >
        {/* Holographic AI Core */}
        <div className={styles.core}>
          <div className={styles.innerRing}></div>
          <div className={styles.middleRing}></div>
          <div className={styles.outerRing}></div>
          <div className={styles.aiSymbol}>V</div>
        </div>

        {/* Particle Effects */}
        <div className={styles.particles}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{
                animationDelay: `${i * 0.2}s`,
                transform: `rotate(${i * 45}deg) translateX(30px)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
