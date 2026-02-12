import { Link } from "react-router-dom";
import styles from "./Hero.module.css";

// Floating orb component
const FloatingOrb = ({ delay, duration, size, color }) => (
  <div
    className={styles.orb}
    style={{
      left: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      width: `${size}px`,
      height: `${size}px`,
      background: color,
    }}
  />
);

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Animated Background */}
      <div className={styles.backgroundEffects}>
        {/* Grid Pattern */}
        <div className={styles.gridPattern} />

        {/* Floating Orbs */}
        <FloatingOrb
          delay={0}
          duration={20}
          size={300}
          color="radial-gradient(circle, rgba(102, 126, 234, 0.15), transparent)"
        />
        <FloatingOrb
          delay={5}
          duration={25}
          size={400}
          color="radial-gradient(circle, rgba(118, 75, 162, 0.1), transparent)"
        />
        <FloatingOrb
          delay={10}
          duration={30}
          size={250}
          color="radial-gradient(circle, rgba(34, 197, 94, 0.1), transparent)"
        />

        {/* Gradient Glow */}
        <div className={styles.gradientGlow} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Badge */}
        <div className={styles.badge}>
          <span className={styles.badgeDot}></span>
          <span className={styles.badgeText}>AI-Powered Wellness Platform</span>
        </div>

        {/* Main Heading */}
        <h1 className={styles.heading}>
          Your Personal AI for
          <span className={styles.gradient}> Mind, Body </span>&{" "}
          <span className={styles.gradientAlt}>Productivity</span>
        </h1>

        {/* Subheading */}
        <p className={styles.subheading}>
          Chat for mental wellness, track nutrition with AI, and build daily
          habits —
          <br />
          all powered by cutting-edge artificial intelligence in one beautiful
          platform.
        </p>

        {/* One-line differentiation */}
        <p className={styles.differentiator}>
          One place for mental wellness, nutrition, and habits—no switching apps.
        </p>

        {/* CTA Buttons */}
        <div className={styles.ctaGroup}>
          <Link to="/chat" className={styles.ctaPrimary}>
            <span className={styles.ctaIcon}>🚀</span>
            <span>Get Started Free</span>
            <div className={styles.ctaShine} />
          </Link>

          <button className={styles.ctaSecondary}>
            <span className={styles.playIcon}>▶</span>
            <span>Watch Demo</span>
          </button>
        </div>

        {/* Trust above the fold */}
        <p className={styles.trustLine}>Your data stays private. No ads.</p>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>10K+</div>
            <div className={styles.statLabel}>Active Users</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statNumber}>50M+</div>
            <div className={styles.statLabel}>Meals Tracked</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statNumber}>98%</div>
            <div className={styles.statLabel}>Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.mouse}>
          <div className={styles.wheel}></div>
        </div>
        <div className={styles.scrollText}>Scroll to explore</div>
      </div>
    </section>
  );
}
