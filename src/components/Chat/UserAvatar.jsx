import { useAuth } from "../../context/AuthContext";
import styles from "./UserAvatar.module.css";

export default function UserAvatar({ user: propUser }) {
  const { user: contextUser } = useAuth();
  const user = propUser || contextUser;

  // Get user initials
  const getInitials = () => {
    if (user?.fullName) {
      return user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  // Get user color based on name/email
  const getUserColor = () => {
    const name = user?.fullName || user?.email || "user";
    const colors = [
      "linear-gradient(135deg, #667eea, #764ba2)",
      "linear-gradient(135deg, #f093fb, #f5576c)",
      "linear-gradient(135deg, #4facfe, #00f2fe)",
      "linear-gradient(135deg, #43e97b, #38f9d7)",
      "linear-gradient(135deg, #fa709a, #fee140)",
      "linear-gradient(135deg, #30cfd0, #330867)",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className={styles.avatarWrapper}>
      <div
        className={styles.avatar}
        style={{ background: getUserColor() }}
      >
        <div className={styles.avatarContent}>
          <span className={styles.initials}>{getInitials()}</span>
        </div>
        <div className={styles.glow} />
        <div className={styles.ring} />
      </div>
    </div>
  );
}



