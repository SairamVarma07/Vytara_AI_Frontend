import styles from "./ChatSidebar.module.css";

export default function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onClose,
}) {
  return (
    <div className={styles.sidebar}>
      {/* New Chat Button */}
      <button onClick={onNewChat} className={styles.newChatBtn}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>New chat</span>
      </button>

      {/* Chat List */}
      <div className={styles.chatList}>
        <div className={styles.chatListHeader}>
          <span className={styles.chatListTitle}>Recent Chats</span>
          <span className={styles.chatCount}>{chats.length}</span>
        </div>

        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`${styles.chatItem} ${
              activeChatId === chat.id ? styles.active : ""
            }`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className={styles.chatIcon}>💬</div>
            <div className={styles.chatInfo}>
              <div className={styles.chatTitle}>{chat.title}</div>
              <div className={styles.chatPreview}>
                {chat.messages[chat.messages.length - 1]?.text?.slice(0, 40) ||
                  "No messages yet"}
                ...
              </div>
            </div>
            {activeChatId === chat.id && (
              <div className={styles.activeIndicator} />
            )}
            <button
              className={styles.deleteBtn}
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Delete this conversation?")) {
                  onDeleteChat(chat.id);
                }
              }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className={styles.sidebarFooter}>
        <div className={styles.footerCard}>
          <div className={styles.footerIcon}>🎯</div>
          <div className={styles.footerText}>
            <div className={styles.footerTitle}>AI-Powered Support</div>
            <div className={styles.footerSubtext}>
              Available 24/7 for your wellness
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
