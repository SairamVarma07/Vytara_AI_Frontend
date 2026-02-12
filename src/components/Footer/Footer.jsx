import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

// Floating particle component
const FooterParticle = ({ delay }) => (
  <div
    className={styles.particle}
    style={{
      left: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${20 + Math.random() * 10}s`,
    }}
  />
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [showPill, setShowPill] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const formRef = useRef(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (isSubscribing || showPill) return;
    setIsSubscribing(true);
    setShowPill(true);
    setEmail("");
    const t1 = setTimeout(() => {
      setShowPill(false);
      setIsSubscribing(false);
    }, 3800);
    return () => clearTimeout(t1);
  };

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Chat", path: "/chat" },
    { name: "Nutrition", path: "/nutrition" },
    { name: "Tasks", path: "/tasks" },
  ];

  const company = [
    { name: "About Us", path: "/" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Contact", path: "mailto:contact@vytara.com", external: true },
  ];

  const socialLinks = [
    { icon: "𝕏", name: "Twitter", url: "#", color: "#1DA1F2" },
    { icon: "in", name: "LinkedIn", url: "#", color: "#0077B5" },
    { icon: "▶", name: "YouTube", url: "#", color: "#FF0000" },
    { icon: "★", name: "GitHub", url: "#", color: "#333" },
  ];

  return (
    <footer className={styles.footer}>
      {/* Background Effects */}
      <div className={styles.backgroundEffects}>
        {[...Array(15)].map((_, i) => (
          <FooterParticle key={i} delay={i * 0.8} />
        ))}
        <div className={styles.gradientGlow} />
      </div>

      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.mainContent}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.logoWrapper}>
              <div className={styles.logo}>
                <span className={styles.logoIcon}>V</span>
                <div className={styles.logoGlow} />
              </div>
              <div className={styles.brandText}>
                <h3 className={styles.brandName}>VYTARA AI</h3>
                <p className={styles.brandTagline}>Your Wellness Companion</p>
              </div>
            </div>

            <p className={styles.brandDescription}>
              Empowering your journey to holistic wellness through cutting-edge
              AI technology. Track nutrition, manage tasks, and nurture your
              mental health—all in one intelligent platform.
            </p>

            {/* Social Links */}
            <div className={styles.socialLinks}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className={styles.socialLink}
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ "--social-color": social.color }}
                >
                  <span className={styles.socialIcon}>{social.icon}</span>
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className={styles.newsletter} ref={formRef}>
              <h4 className={styles.newsletterTitle}>Stay Updated</h4>
              <form
                className={styles.newsletterForm}
                onSubmit={handleSubscribe}
                noValidate
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={styles.newsletterInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubscribing}
                  aria-label="Email for newsletter"
                />
                <button
                  type="submit"
                  className={`${styles.newsletterBtn} ${showPill ? styles.newsletterBtnHidden : ""}`}
                  disabled={isSubscribing}
                  aria-label="Subscribe"
                >
                  <span>Subscribe</span>
                  <span className={styles.newsletterIcon}>→</span>
                </button>
              </form>
              {/* Success pill: appears above form, then fades out */}
              {showPill && (
                <div className={styles.subscribePill} role="status" aria-live="polite">
                  <span className={styles.subscribePillRow}>
                    <span className={styles.subscribePillCheck}>✓</span>
                    <span className={styles.subscribePillText}>Subscribed ✔️</span>
                  </span>
                  <span className={styles.subscribePillThanks}>Thanks for subscribing!</span>
                </div>
              )}
            </div>
          </div>

          {/* Links Section */}
          <div className={styles.linksSection}>
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Quick Links</h4>
              <ul className={styles.linkList}>
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path} className={styles.link}>
                      <span className={styles.linkArrow}>→</span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Company</h4>
              <ul className={styles.linkList}>
                {company.map((link, index) => (
                  <li key={index}>
                    {link.external ? (
                      <a href={link.path} className={styles.link} target="_blank" rel="noopener noreferrer">
                        <span className={styles.linkArrow}>→</span>
                        <span>{link.name}</span>
                      </a>
                    ) : (
                      <Link to={link.path} className={styles.link}>
                        <span className={styles.linkArrow}>→</span>
                        <span>{link.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <span className={styles.copyrightIcon}>©</span>
            <span>
              {currentYear} VYTARA AI. Crafted with{" "}
              <span className={styles.heart}>💜</span> for your wellness
            </span>
          </div>

          <div className={styles.badges}>
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>🔒</span>
              <span>Secure & Private</span>
            </div>
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>⚡</span>
              <span>AI-Powered</span>
            </div>
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>🌟</span>
              <span>v2.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
