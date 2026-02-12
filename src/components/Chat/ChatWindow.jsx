import { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import AssistantAvatar from "./AssistantAvatar";
import UserAvatar from "./UserAvatar";
import styles from "./ChatWindow.module.css";

export default function ChatWindow({
  messages,
  onSendMessage,
  isTyping,
  chatTitle,
  onNewChat,
}) {
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <main className={styles.window}>
      {/* Messages Area */}
      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h1 className={styles.emptyTitle}>VYTARA</h1>
            <p className={styles.emptySubtitle}>Your AI Wellness Companion</p>
            <div className={styles.suggestions}>
              <button className={styles.suggestionBtn} onClick={() => onSendMessage({ text: "How can I improve my mental wellbeing?" })}>
                How can I improve my mental wellbeing?
              </button>
              <button className={styles.suggestionBtn} onClick={() => onSendMessage({ text: "Help me track my nutrition goals" })}>
                Help me track my nutrition goals
              </button>
              <button className={styles.suggestionBtn} onClick={() => onSendMessage({ text: "I'm feeling stressed today" })}>
                I'm feeling stressed today
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.messagesContainer}>
            {messages.map((msg, i) => (
              <div key={i} className={styles.messageGroup}>
                <div className={`${styles.messageRow} ${msg.sender === "user" ? styles.userRow : styles.assistantRow}`}>
                  {msg.sender === "assistant" && (
                    <div className={styles.avatar}>
                      <AssistantAvatar isTyping={false} />
                    </div>
                  )}
                  <MessageBubble
                    sender={msg.sender}
                    text={msg.text}
                    timestamp={msg.timestamp}
                  />
                  {msg.sender === "user" && (
                    <div className={styles.userAvatar}>
                      <UserAvatar user={user} />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className={styles.messageGroup}>
                <div className={styles.messageRow}>
                  <div className={styles.avatar}>
                    <AssistantAvatar isTyping={true} />
                  </div>
                  <div className={styles.typingBubble}>
                    <div className={styles.typingDots}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput onSend={onSendMessage} />
    </main>
  );
}
