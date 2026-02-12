import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import styles from "./Testimonials.module.css";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Marketing Director",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review: "Like having a supportive friend available 24/7—genuinely helpful on stressful days.",
    feature: "Wellness Assistant",
    gradient: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Fitness Enthusiast",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review: "Describe your meal, AI does the rest. The only nutrition tracker I actually stick with.",
    feature: "Nutrition Tracking",
    gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "Product Manager",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    review: "Tasks with XP and streaks made building habits feel rewarding, not like a chore.",
    feature: "Tasks & Habits",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
  },
];

const StarRating = ({ rating }) => (
  <div className={styles.stars}>
    {[...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? styles.starFilled : styles.star}>
        ★
      </span>
    ))}
  </div>
);

/** Single testimonial card; animates in when it scrolls into view (right → left → right). */
function TestimonialItem({ testimonial, direction }) {
  const [ref, visible] = useScrollAnimation({ threshold: 0.15, triggerOnce: true, rootMargin: "0px 0px -40px 0px" });

  return (
    <div
      ref={ref}
      className={`${styles.card} ${styles[direction]} ${visible ? styles.cardVisible : styles.cardHidden}`}
    >
      <div
        className={styles.featureTag}
        style={{ background: testimonial.gradient }}
      >
        {testimonial.feature}
      </div>
      <div className={styles.quoteIcon}>"</div>
      <p className={styles.review}>{testimonial.review}</p>
      <StarRating rating={testimonial.rating} />
      <div className={styles.author}>
        <div className={styles.avatarWrapper}>
          <img src={testimonial.avatar} alt={testimonial.name} className={styles.avatar} />
          <div className={styles.avatarRing} style={{ background: testimonial.gradient }} />
        </div>
        <div className={styles.authorInfo}>
          <h4 className={styles.authorName}>{testimonial.name}</h4>
          <p className={styles.authorRole}>{testimonial.role}</p>
        </div>
      </div>
      <div className={styles.cardGlow} style={{ background: testimonial.gradient }} />
    </div>
  );
}

export default function Testimonials() {
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2, triggerOnce: false });
  const [trustRef, trustVisible] = useScrollAnimation({ threshold: 0.3, triggerOnce: false });

  // Alternating slide direction as you scroll: right → left → right
  const getDirection = (index) => (index % 2 === 0 ? "fromRight" : "fromLeft");

  return (
    <section className={styles.testimonials}>
      <div className={styles.backgroundEffects}>
        <div className={styles.glowOrb1} />
        <div className={styles.glowOrb2} />
        <div className={styles.gridPattern} />
      </div>

      <div ref={headerRef} className={styles.header}>
        <div className={`${styles.badge} ${headerVisible ? styles.badgeVisible : styles.badgeHidden}`}>
          <span className={styles.badgeDot}></span>
          <span>TESTIMONIALS</span>
        </div>
        <h2 className={styles.title}>
          <span className={`${styles.titleLeft} ${headerVisible ? styles.titleLeftVisible : ""}`}>
            From Intention to Impact
          </span>
          <span className={`${styles.divider} ${headerVisible ? styles.dividerVisible : ""}`}> | </span>
          <span className={`${styles.titleRight} ${headerVisible ? styles.titleRightVisible : ""}`}>
            User Success Stories
          </span>
        </h2>
        <p className={`${styles.subtitle} ${headerVisible ? styles.subtitleVisible : ""}`}>
          See how Vytara is transforming lives through AI-powered wellness
        </p>
      </div>

      <div className={styles.list}>
        {testimonials.map((testimonial, index) => (
          <TestimonialItem
            key={testimonial.id}
            testimonial={testimonial}
            direction={getDirection(index)}
          />
        ))}
      </div>

      {/* Trust Indicators */}
      <div 
        ref={trustRef}
        className={`${styles.trustSection} ${trustVisible ? styles.trustVisible : styles.trustHidden}`}
      >
        {[
          { icon: "⭐", text: "4.9/5 Average Rating" },
          { icon: "💬", text: "10,000+ Happy Users" },
          { icon: "🏆", text: "Top Wellness App 2025" },
        ].map((item, index) => (
          <div 
            key={index}
            className={styles.trustBadge}
            style={{ transitionDelay: trustVisible ? `${index * 0.135}s` : '0s' }}
          >
            <span className={styles.trustIcon}>{item.icon}</span>
            <span className={styles.trustText}>{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
