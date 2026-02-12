import { useState, useRef, useEffect } from "react";
import ChatAttachment from "./ChatAttachment";
import styles from "./ChatInput.module.css";

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState("");
  const [attachment, setAttachment] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleSend = () => {
    if (!value.trim() && !attachment) return;

    onSend({
      text: value,
      attachment,
    });

    setValue("");
    setAttachment(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Attachment preview */}
      {attachment && (
        <div className={styles.attachmentPreview}>
          <span>📎 {attachment.name}</span>
          <button onClick={() => setAttachment(null)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className={styles.inputContainer}>
        <ChatAttachment onAttach={setAttachment} />
        
        <textarea
          ref={textareaRef}
          className={styles.input}
          placeholder="Hi, tell me how you're feeling today..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />

        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={!value.trim() && !attachment}
          aria-label="Send message"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
