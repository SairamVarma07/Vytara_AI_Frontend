import { useState, useEffect, useCallback } from "react";
import styles from "./ChatModal.module.css";

// Particle component
const Particle = ({ delay }) => (
  <div
    className={styles.particle}
    style={{
      left: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${15 + Math.random() * 10}s`,
    }}
  />
);

// Assistant Avatar
const AssistantAvatar = ({ isTyping }) => (
  <div className={styles.avatarWrapper}>
    <div
      className={`${styles.avatar} ${isTyping ? styles.typing : styles.idle}`}
    >
      <div className={styles.core}>
        <div className={styles.innerRing}></div>
        <div className={styles.middleRing}></div>
        <div className={styles.outerRing}></div>
        <div className={styles.aiSymbol}>V</div>
      </div>

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

// Message Bubble
const MessageBubble = ({ sender, text, timestamp }) => {
  const isUser = sender === "user";
  const userAvatars = ["😊", "🙂", "😎", "😄", "🤗"];
  const randomAvatar =
    userAvatars[Math.floor(Math.random() * userAvatars.length)];

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
      className={`${styles.messageContainer} ${
        isUser ? styles.userMessage : styles.assistantMessage
      }`}
    >
      {!isUser && <AssistantAvatar isTyping={false} />}

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

      {isUser && <div className={styles.userAvatar}>{randomAvatar}</div>}
    </div>
  );
};

export default function ChatModal({ isOpen, onClose }) {
  const storedChats = JSON.parse(localStorage.getItem("chats")) || [];

  const [chats, setChats] = useState(
    storedChats.length
      ? storedChats
      : [
          {
            id: Date.now(),
            title: "Daily Check-in",
            messages: [
              {
                sender: "assistant",
                text: "Hi, I'm VYTARA 💙 How can I support your wellness today?",
                timestamp: new Date().toISOString(),
              },
            ],
          },
        ]
  );

  const [activeChatId, setActiveChatId] = useState(chats[0].id);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const sendMessage = useCallback(
    (text) => {
      if (!text?.trim()) return;

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== activeChatId) return chat;

          const isFirstUserMessage =
            chat.messages.filter((m) => m.sender === "user").length === 0;

          return {
            ...chat,
            title: isFirstUserMessage ? text.slice(0, 30) : chat.title,
            messages: [
              ...chat.messages,
              {
                sender: "user",
                text,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        })
      );

      setInputValue("");

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id !== activeChatId) return chat;
            return {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  sender: "assistant",
                  text: "I'm here with you 💙 Tell me more about what's on your mind.",
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          })
        );
      }, 1500);
    },
    [activeChatId]
  );

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Conversation",
      messages: [
        {
          sender: "assistant",
          text: "Hi, I'm VYTARA 💙 How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const deleteChat = (chatId) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* Particles */}
      {[...Array(15)].map((_, i) => (
        <Particle key={i} delay={i * 0.5} />
      ))}

      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              className={styles.menuBtn}
              onClick={() => setShowSidebar(!showSidebar)}
            >
              ☰
            </button>
            <div className={styles.headerInfo}>
              <h3 className={styles.headerTitle}>VYTARA AI</h3>
              <p className={styles.headerStatus}>
                {isTyping ? "Typing..." : "Online • Ready to help"}
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Sidebar */}
          {showSidebar && (
            <div className={styles.sidebar}>
              <button onClick={createNewChat} className={styles.newChatBtn}>
                <span className={styles.newChatIcon}>✨</span>
                <span>New Chat</span>
              </button>

              <div className={styles.chatList}>
                <div className={styles.chatListHeader}>
                  <span>Recent Chats</span>
                  <span className={styles.chatCount}>{chats.length}</span>
                </div>

                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`${styles.chatItem} ${
                      activeChatId === chat.id ? styles.active : ""
                    }`}
                    onClick={() => setActiveChatId(chat.id)}
                  >
                    <div className={styles.chatIcon}>💬</div>
                    <div className={styles.chatInfo}>
                      <div className={styles.chatTitle}>{chat.title}</div>
                      <div className={styles.chatPreview}>
                        {chat.messages[chat.messages.length - 1]?.text?.slice(
                          0,
                          40
                        )}
                        ...
                      </div>
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Delete this conversation?")) {
                          deleteChat(chat.id);
                        }
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Window */}
          <div className={styles.chatWindow}>
            <div className={styles.messages}>
              {activeChat?.messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  sender={msg.sender}
                  text={msg.text}
                  timestamp={msg.timestamp}
                />
              ))}

              {isTyping && (
                <div className={styles.messageContainer}>
                  <AssistantAvatar isTyping={true} />
                  <div className={styles.typingBubble}>
                    <div className={styles.typingDots}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className={styles.inputArea}>
              <input
                type="text"
                className={styles.input}
                placeholder="Share what's on your mind..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className={styles.sendBtn}
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim()}
              >
                <span className={styles.sendIcon}>➤</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
