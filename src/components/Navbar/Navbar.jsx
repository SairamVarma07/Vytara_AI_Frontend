import { Link, useLocation } from "react-router-dom";
import ProfileDropdown from "../Profile/ProfileDropdown";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/chat", label: "Chat", icon: "💬" },
    { path: "/nutrition", label: "Nutrition", icon: "🍎" },
    { path: "/tasks", label: "Tasks", icon: "✓" },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.navBackground} />
      <div className={styles.glowEffect} />

      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <span className={styles.logoIconInner}>V</span>
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoName}>VYTARA</span>
            <span className={styles.logoSubtext}>AI</span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <ul className={styles.menu}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`${styles.menuItem} ${
                    isActive ? styles.active : ""
                  }`}
                >
                  <span className={styles.menuIcon}>{item.icon}</span>
                  <span className={styles.menuLabel}>{item.label}</span>
                  {isActive && <div className={styles.activeIndicator} />}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Profile Dropdown */}
        <div className={styles.actions}>
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
}
