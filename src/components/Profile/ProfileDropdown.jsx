import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAvatarUrl } from "../../services/api";
import styles from "./ProfileDropdown.module.css";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const handleLoginClick = () => {
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      {/* Profile Button */}
      <button
        className={styles.profileBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Profile menu"
      >
        <div className={styles.avatar}>
          {isAuthenticated ? (
            user?.avatar ? (
              <img
                src={getAvatarUrl(user.avatar)}
                alt="Profile"
                className={styles.avatarImage}
              />
            ) : (
              <span className={styles.avatarText}>
                {user?.fullName?.charAt(0).toUpperCase() ||
                  user?.email?.charAt(0).toUpperCase() ||
                  "U"}
              </span>
            )
          ) : (
            <span className={styles.avatarIcon}>👤</span>
          )}
        </div>
        {isAuthenticated && <div className={styles.statusDot} />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={styles.dropdown}>
          {isAuthenticated ? (
            <>
              {/* User Info */}
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  {user?.avatar ? (
                    <img
                      src={getAvatarUrl(user.avatar)}
                      alt="Profile"
                      className={styles.userAvatarImage}
                    />
                  ) : (
                    <span>
                      {user?.fullName?.charAt(0).toUpperCase() ||
                        user?.email?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className={styles.userDetails}>
                  <div className={styles.userName}>
                    {user?.fullName || "User"}
                  </div>
                  <div className={styles.userEmail}>{user?.email}</div>
                </div>
              </div>

              <div className={styles.divider} />

              {/* Menu Items */}
              <Link
                to="/profile"
                className={styles.menuItem}
                onClick={() => setIsOpen(false)}
              >
                <span className={styles.menuIcon}>👤</span>
                <span>My Profile</span>
              </Link>

              <Link
                to="/tasks"
                className={styles.menuItem}
                onClick={() => setIsOpen(false)}
              >
                <span className={styles.menuIcon}>✓</span>
                <span>My Tasks</span>
              </Link>

              <Link
                to="/nutrition"
                className={styles.menuItem}
                onClick={() => setIsOpen(false)}
              >
                <span className={styles.menuIcon}>🍎</span>
                <span>Nutrition</span>
              </Link>

              <Link
                to="/chat"
                className={styles.menuItem}
                onClick={() => setIsOpen(false)}
              >
                <span className={styles.menuIcon}>💬</span>
                <span>AI Assistant</span>
              </Link>

              <div className={styles.divider} />

              <button
                className={styles.menuItem}
                onClick={() => setIsOpen(false)}
              >
                <span className={styles.menuIcon}>⚙️</span>
                <span>Settings</span>
              </button>

              <button
                className={styles.menuItem}
                onClick={() => setIsOpen(false)}
              >
                <span className={styles.menuIcon}>❓</span>
                <span>Help & Support</span>
              </button>

              <div className={styles.divider} />

              {/* Logout */}
              <button
                className={`${styles.menuItem} ${styles.logoutItem}`}
                onClick={handleLogout}
              >
                <span className={styles.menuIcon}>🚪</span>
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <>
              {/* Not Logged In */}
              <div className={styles.authPrompt}>
                <div className={styles.authIcon}>🔐</div>
                <h3 className={styles.authTitle}>Welcome to VYTARA</h3>
                <p className={styles.authText}>
                  Sign in to access your personalized wellness dashboard
                </p>
              </div>

              <div className={styles.divider} />

              <button className={styles.authButton} onClick={handleLoginClick}>
                <span className={styles.authButtonIcon}>🚀</span>
                <span>Log In</span>
              </button>

              <button
                className={styles.authButtonSecondary}
                onClick={handleLoginClick}
              >
                <span className={styles.authButtonIcon}>✨</span>
                <span>Sign Up</span>
              </button>

              <div className={styles.divider} />

              <div className={styles.guestLinks}>
                <Link
                  to="/"
                  className={styles.guestLink}
                  onClick={() => setIsOpen(false)}
                >
                  Explore Features
                </Link>
                <Link
                  to="/"
                  className={styles.guestLink}
                  onClick={() => setIsOpen(false)}
                >
                  About Us
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
