import { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./PrivacyPolicy.module.css";

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "February 7, 2026";
  const effectiveDate = "February 7, 2026";

  return (
    <div className={styles.wrapper}>
      <div className={styles.backgroundEffects}>
        <div className={styles.glowOrb1} />
        <div className={styles.glowOrb2} />
        <div className={styles.gridPattern} />
      </div>

      <header className={styles.header}>
        <div className={styles.badge}>
          <span className={styles.badgeDot}></span>
          <span>LEGAL</span>
        </div>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.subtitle}>
          Please read these terms carefully before using Vytara Wellbeing.
        </p>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>📅</span>
            Last Updated: {lastUpdated}
          </span>
          <span className={styles.metaDivider}>|</span>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>✓</span>
            Effective: {effectiveDate}
          </span>
        </div>
      </header>

      <nav className={styles.toc}>
        <h2 className={styles.tocTitle}>Table of Contents</h2>
        <ol className={styles.tocList}>
          <li><a href="#acceptance">Acceptance of Terms</a></li>
          <li><a href="#services">Description of Services</a></li>
          <li><a href="#account">Account and Registration</a></li>
          <li><a href="#conduct">Acceptable Use</a></li>
          <li><a href="#ip">Intellectual Property</a></li>
          <li><a href="#disclaimers">Disclaimers</a></li>
          <li><a href="#limitation">Limitation of Liability</a></li>
          <li><a href="#termination">Termination</a></li>
          <li><a href="#changes">Changes to Terms</a></li>
          <li><a href="#contact">Contact</a></li>
        </ol>
      </nav>

      <main className={styles.content}>
        <section id="acceptance" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>1.</span>
            Acceptance of Terms
          </h2>
          <p>
            By accessing or using Vytara Wellbeing ("Service," "we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service. We may update these terms from time to time; continued use after changes constitutes acceptance.
          </p>
        </section>

        <section id="services" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>2.</span>
            Description of Services
          </h2>
          <p>
            Vytara provides a wellness platform including nutrition tracking, task management, AI-assisted chat, and related features. We reserve the right to modify, suspend, or discontinue any part of the Service with or without notice.
          </p>
        </section>

        <section id="account" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>3.</span>
            Account and Registration
          </h2>
          <p>
            You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. Notify us immediately of any unauthorized use.
          </p>
        </section>

        <section id="conduct" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>4.</span>
            Acceptable Use
          </h2>
          <p>
            You agree not to use the Service to violate any law, infringe others' rights, distribute malware, or attempt to gain unauthorized access to our or others' systems. We may suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section id="ip" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>5.</span>
            Intellectual Property
          </h2>
          <p>
            The Service and its content (including software, design, text, and graphics) are owned by us or our licensors. You may not copy, modify, or create derivative works without our written permission. You retain rights to content you submit; you grant us a license to use it to operate the Service.
          </p>
        </section>

        <section id="disclaimers" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>6.</span>
            Disclaimers
          </h2>
          <p>
            The Service is provided "as is" and "as available." We do not guarantee that it will be uninterrupted or error-free. Wellness and nutrition information is for general guidance only and is not a substitute for professional medical, dietary, or mental health advice.
          </p>
        </section>

        <section id="limitation" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>7.</span>
            Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, we and our affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or data, arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the twelve months preceding the claim, or one hundred dollars, whichever is greater.
          </p>
        </section>

        <section id="termination" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>8.</span>
            Termination
          </h2>
          <p>
            We may terminate or suspend your access at any time for breach of these terms or for any other reason. You may stop using the Service at any time. Provisions that by their nature should survive (including disclaimers and limitation of liability) will survive termination.
          </p>
        </section>

        <section id="changes" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>9.</span>
            Changes to Terms
          </h2>
          <p>
            We may update these Terms of Service from time to time. We will post the updated terms and update the "Last Updated" date. Your continued use after changes constitutes acceptance. If you do not agree, you must stop using the Service.
          </p>
        </section>

        <section id="contact" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>10.</span>
            Contact
          </h2>
          <p>
            For questions about these Terms of Service, contact us at{" "}
            <a href="mailto:legal@vytara.com" className={styles.link}>legal@vytara.com</a>.
          </p>
          <p>
            <Link to="/" className={styles.link}>← Back to Home</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
