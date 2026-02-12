import styles from "./MessageBubble.module.css";

export default function MessageBubble({ sender, text, timestamp }) {
  const isUser = sender === "user" || sender === "USER";

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`${styles.bubbleContainer} ${
        isUser ? styles.userContainer : styles.assistantContainer
      }`}
    >
      <div
        className={`${styles.bubble} ${
          isUser ? styles.userBubble : styles.assistantBubble
        }`}
      >
        <div className={styles.bubbleContent}>{text}</div>
        {timestamp && (
          <div className={styles.timestamp}>{formatTime(timestamp)}</div>
        )}
      </div>
    </div>
  );
}
