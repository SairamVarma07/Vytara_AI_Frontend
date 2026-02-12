import { useState, useEffect, useCallback } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import api from "../../services/api";
import styles from "./ChatLayout.module.css";

export default function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch chats on mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await api.chat.getChats();
        
        // API service already extracts data
        if (Array.isArray(response) && response.length > 0) {
          setChats(response);
          setActiveChatId(response[0].id);
        } else {
          // Create initial chat if none exist
          const newChat = await api.chat.createChat({ title: "Daily Check-in" });
          setChats([newChat]);
          setActiveChatId(newChat.id);
        }
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError(err.message || "Failed to load chats");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  // Fetch messages for active chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChatId) return;

      try {
        const response = await api.chat.getChat(activeChatId);
        
        // API service already extracts data
        setChats(prev => prev.map(chat => 
          chat.id === activeChatId 
            ? { ...chat, messages: Array.isArray(response.messages) ? response.messages : [] }
            : chat
        ));
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [activeChatId]);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const sendMessage = useCallback(
    async ({ text, attachment }) => {
      if (!text?.trim() && !attachment) return;

      try {
        setIsTyping(true);

        // Send message to backend (backend creates both user and AI message)
        await api.chat.sendMessage(activeChatId, {
          text,
          attachment
        });

        // Fetch updated messages (includes both user message and AI response)
        const chatResponse = await api.chat.getChat(activeChatId);
        
        // Update the chat with new messages
        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id !== activeChatId) return chat;

            const isFirstUserMessage = !chat.messages || chat.messages.length === 0;

            return {
              ...chat,
              title: isFirstUserMessage
                ? text?.slice(0, 30) || "Attachment"
                : chat.title,
              messages: Array.isArray(chatResponse.messages) ? chatResponse.messages : [],
            };
          })
        );
      } catch (err) {
        console.error("Error sending message:", err);
        setError(err.message || "Failed to send message");
      } finally {
        setIsTyping(false);
      }
    },
    [activeChatId]
  );

  const createNewChat = async () => {
    try {
      const response = await api.chat.createChat({ title: "New Conversation" });
      
      // API service already extracts data
      setChats((prev) => [response, ...prev]);
      setActiveChatId(response.id);
    } catch (err) {
      console.error("Error creating chat:", err);
      setError(err.message || "Failed to create chat");
    }
  };

  const deleteChat = async (chatId) => {
    try {
      await api.chat.deleteChat(chatId);
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
      
      // If deleted chat was active, select another
      if (chatId === activeChatId) {
        const remainingChats = chats.filter(c => c.id !== chatId);
        setActiveChatId(remainingChats[0]?.id || null);
      }
    } catch (err) {
      console.error("Error deleting chat:", err);
      setError(err.message || "Failed to delete chat");
    }
  };

  if (loading) {
    return (
      <div className={styles.wrapper} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center", color: "#fff" }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "4px solid rgba(102, 126, 234, 0.3)",
            borderTop: "4px solid #667eea",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }} />
          <p>Loading chats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center", color: "#fff", padding: "20px" }}>
          <p style={{ color: "#ef4444", marginBottom: "10px" }}>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: "10px 20px",
              background: "#667eea",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Particles Background */}
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className={styles.particle}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        />
      ))}

      {/* Sidebar Toggle Button */}
      <button
        className={styles.sidebarToggle}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={(id) => {
            setActiveChatId(id);
            setSidebarOpen(false);
          }}
          onNewChat={createNewChat}
          onDeleteChat={deleteChat}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Window */}
      <div className={styles.chatContainer}>
        <ChatWindow
          messages={activeChat?.messages || []}
          onSendMessage={sendMessage}
          isTyping={isTyping}
          chatTitle={activeChat?.title}
          onNewChat={createNewChat}
        />
      </div>
    </div>
  );
}
