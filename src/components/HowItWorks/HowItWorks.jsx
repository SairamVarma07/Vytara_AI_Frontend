import { Link } from "react-router-dom";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import styles from "./HowItWorks.module.css";

const steps = [
  {
    number: "1",
    title: "Sign up",
    description: "Create your free account in seconds.",
  },
  {
    number: "2",
    title: "Set your goals",
    description: "Choose what matters: wellness, nutrition, or habits.",
  },
  {
    number: "3",
    title: "Use Chat, Nutrition & Tasks daily",
    description: "One place to stay on track—no app switching.",
  },
];

export default function HowItWorks() {
  const [sectionRef, sectionVisible] = useScrollAnimation({ threshold: 0.15, triggerOnce: true });

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={`${styles.inner} ${sectionVisible ? styles.visible : styles.hidden}`}>
        <div className={styles.badge}>
          <span className={styles.badgeDot}></span>
          <span>HOW IT WORKS</span>
        </div>
        <h2 className={styles.title}>
          Get started in three steps
        </h2>

        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={step.number} className={styles.step}>
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={styles.arrow} aria-hidden="true">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <Link to="/chat" className={styles.cta}>
          Get started free
        </Link>
      </div>
    </section>
  );
}
