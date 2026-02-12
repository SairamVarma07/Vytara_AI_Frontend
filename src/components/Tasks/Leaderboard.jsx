import { useState, useEffect } from "react";
import api, { getAvatarUrl } from "../../services/api";
import styles from "./Leaderboard.module.css";

export default function Leaderboard({ currentLevel, currentXP }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await api.tasks.getLeaderboard();
        // API service already extracts data
        setLeaderboardData(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        // Fallback to empty array on error
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className={styles.leaderboard}>
        <div className={styles.header}>
          <h3 className={styles.title}>🏆 Global Leaderboard</h3>
        </div>
        <div style={{ textAlign: "center", padding: "40px", color: "#8b92b0" }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.leaderboard}>
      <div className={styles.header}>
        <h3 className={styles.title}>🏆 Global Leaderboard</h3>
        <div className={styles.badge}>
          <span className={styles.live}></span>
          <span>LIVE</span>
        </div>
      </div>

      <div className={styles.list}>
        {leaderboardData.map((player, index) => (
          <div
            key={index}
            className={`${styles.player} ${
              player.isUser ? styles.currentUser : ""
            } ${index < 3 ? styles.topThree : ""}`}
          >
            <div className={styles.rankBadge}>
              {index === 0 && "🥇"}
              {index === 1 && "🥈"}
              {index === 2 && "🥉"}
              {index > 2 && `#${index + 1}`}
            </div>

            <div className={styles.avatar}>
              {player.avatar ? (
                <img
                  src={getAvatarUrl(player.avatar)}
                  alt=""
                  className={styles.avatarImage}
                />
              ) : (
                <span>👤</span>
              )}
            </div>

            <div className={styles.playerInfo}>
              <div className={styles.playerName}>{player.fullName || player.name}</div>
              <div className={styles.playerStats}>
                Lvl {player.level} • {player.xp} XP
              </div>
            </div>

            {player.isCurrentUser && <div className={styles.youBadge}>YOU</div>}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.viewAllBtn}>View Full Leaderboard →</button>
      </div>
    </div>
  );
}
