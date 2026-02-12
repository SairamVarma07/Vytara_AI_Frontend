import styles from "./FloatingChatButton.module.css";

export default function FloatingChatButton() {
  return (
    <a href="/chat" className={styles.button}>
      <span className={styles.icon}>🤖</span>
      <div className={styles.statusDot} />
    </a>
  );
}
