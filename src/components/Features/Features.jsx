import { Link } from "react-router-dom";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import styles from "./Features.module.css";

const features = [
  {
    icon: "💬",
    title: "AI Mental Wellness",
    description:
      "Chat with our empathetic AI for mental health support, stress relief, and daily motivation.",
    gradient: "linear-gradient(135deg, #667eea, #764ba2)",
    to: "/chat",
  },
  {
    icon: "🍎",
    title: "Smart Nutrition",
    description:
      "Track meals with AI-powered calorie estimation and personalized macro recommendations.",
    gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
    to: "/nutrition",
  },
  {
    icon: "✓",
    title: "Habit Tracking",
    description:
      "Build productive habits with gamified task management and XP progression system.",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    to: "/tasks",
  },
  {
    icon: "🔒",
    title: "Private & Secure",
    description:
      "Your data is encrypted and private. We never share your personal information.",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    to: "/privacy",
  },
];

export default function Features() {
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2, triggerOnce: false });
  const [gridRef, gridVisible] = useScrollAnimation({ threshold: 0.1, triggerOnce: false });

  return (
    <section className={styles.features}>
      {/* Section Header */}
      <div 
        ref={headerRef}
        className={`${styles.header} ${headerVisible ? styles.visible : styles.hidden}`}
      >
        <div className={styles.badge}>
          <span className={styles.badgeDot}></span>
          <span>FEATURES</span>
        </div>
        <h2 className={styles.title}>
          Everything You Need to
          <span className={styles.gradient}> Thrive</span>
        </h2>
        <p className={styles.subtitle}>
          Powerful AI-driven tools designed to help you achieve holistic
          wellness
        </p>
      </div>

      {/* Features Grid */}
      <div 
        ref={gridRef}
        className={`${styles.grid} ${gridVisible ? styles.gridVisible : styles.gridHidden}`}
      >
        {features.map((feature, index) => {
          const cardContent = (
            <>
              {/* Icon */}
              <div
                className={styles.iconWrapper}
                style={{ background: feature.gradient }}
              >
                <span className={styles.icon}>{feature.icon}</span>
                <div className={styles.iconGlow} />
              </div>

              {/* Content */}
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>

              {/* Hover Arrow */}
              <div className={styles.arrow}>→</div>

              {/* Card Shine Effect */}
              <div className={styles.cardShine} />
            </>
          );
          return (
            <Link
              key={index}
              to={feature.to}
              className={`${styles.card} ${styles.cardLink} ${gridVisible ? styles.cardVisible : ''}`}
              style={{ 
                transitionDelay: gridVisible ? `${index * 0.1}s` : '0s'
              }}
            >
              {cardContent}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
