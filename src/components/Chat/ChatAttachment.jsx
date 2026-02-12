import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ChatAttachment.module.css";

export default function ChatAttachment({ onAttach }) {
  const fileInputRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const openFilePicker = () => {
    setClicked(true);

    setTimeout(() => {
      fileInputRef.current.click();
      setClicked(false);
    }, 200);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    onAttach?.(file);
    e.target.value = "";
  };

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.button
        type="button"
        className={styles.attachBtn}
        onClick={openFilePicker}
        whileTap={{ scale: 0.9 }}
        animate={clicked ? { rotate: 15 } : { rotate: 0 }}
        aria-label="Attach file"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {hovered && (
          <motion.div
            className={styles.tooltip}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
          >
            Add photos & files
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
}
