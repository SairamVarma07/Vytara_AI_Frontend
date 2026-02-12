import { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./PrivacyPolicy.module.css";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "January 30, 2026";
  const effectiveDate = "January 30, 2026";

  return (
    <div className={styles.wrapper}>
      {/* Background Effects */}
      <div className={styles.backgroundEffects}>
        <div className={styles.glowOrb1} />
        <div className={styles.glowOrb2} />
        <div className={styles.gridPattern} />
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.badge}>
          <span className={styles.badgeDot}></span>
          <span>LEGAL</span>
        </div>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.subtitle}>
          Your privacy is important to us. This policy explains how we collect, use, and protect your data.
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

      {/* Table of Contents */}
      <nav className={styles.toc}>
        <h2 className={styles.tocTitle}>Table of Contents</h2>
        <ol className={styles.tocList}>
          <li><a href="#introduction">Introduction</a></li>
          <li><a href="#information-we-collect">Information We Collect</a></li>
          <li><a href="#how-we-use-information">How We Use Your Information</a></li>
          <li><a href="#data-sharing">Data Sharing and Disclosure</a></li>
          <li><a href="#data-security">Data Security</a></li>
          <li><a href="#data-retention">Data Retention</a></li>
          <li><a href="#your-rights">Your Rights and Choices</a></li>
          <li><a href="#cookies">Cookies and Tracking Technologies</a></li>
          <li><a href="#third-party">Third-Party Services</a></li>
          <li><a href="#childrens-privacy">Children's Privacy</a></li>
          <li><a href="#international">International Data Transfers</a></li>
          <li><a href="#changes">Changes to This Policy</a></li>
          <li><a href="#contact">Contact Us</a></li>
        </ol>
      </nav>

      {/* Content */}
      <main className={styles.content}>
        {/* Section 1: Introduction */}
        <section id="introduction" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>1.</span>
            Introduction
          </h2>
          <p>
            Welcome to Vytara Wellbeing ("Vytara," "we," "us," or "our"). We are committed to protecting your 
            personal information and your right to privacy. This Privacy Policy describes how we collect, use, 
            store, and share your information when you use our AI-powered wellness platform, including our 
            website, mobile applications, and related services (collectively, the "Services").
          </p>
          <p>
            By accessing or using our Services, you agree to this Privacy Policy. If you do not agree with 
            our policies and practices, please do not use our Services. We encourage you to read this policy 
            carefully to understand our practices regarding your personal data.
          </p>
          <div className={styles.highlight}>
            <span className={styles.highlightIcon}>💡</span>
            <div>
              <strong>Key Principle:</strong> We believe in data minimization—we only collect information 
              that is necessary to provide you with an exceptional wellness experience.
            </div>
          </div>
        </section>

        {/* Section 2: Information We Collect */}
        <section id="information-we-collect" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>2.</span>
            Information We Collect
          </h2>
          
          <h3 className={styles.subsectionTitle}>2.1 Information You Provide Directly</h3>
          <p>We collect information that you voluntarily provide when using our Services:</p>
          <ul className={styles.list}>
            <li>
              <strong>Account Information:</strong> Name, email address, password, and profile picture 
              when you create an account.
            </li>
            <li>
              <strong>Profile Data:</strong> Date of birth, gender, height, weight, and other physical 
              metrics you choose to share for personalized wellness recommendations.
            </li>
            <li>
              <strong>Health & Nutrition Data:</strong> Meal logs, calorie intake, macronutrient tracking, 
              water consumption, and dietary preferences.
            </li>
            <li>
              <strong>Task & Productivity Data:</strong> Tasks, goals, to-do lists, and productivity 
              metrics you create and track.
            </li>
            <li>
              <strong>Chat Conversations:</strong> Messages exchanged with our AI wellness assistant, 
              including mental health discussions and wellness queries.
            </li>
            <li>
              <strong>Communication Data:</strong> Feedback, support requests, and correspondence with 
              our team.
            </li>
          </ul>

          <h3 className={styles.subsectionTitle}>2.2 Information Collected Automatically</h3>
          <p>When you use our Services, we automatically collect certain information:</p>
          <ul className={styles.list}>
            <li>
              <strong>Device Information:</strong> Device type, operating system, browser type, unique 
              device identifiers, and mobile network information.
            </li>
            <li>
              <strong>Usage Data:</strong> Pages visited, features used, time spent on the platform, 
              click patterns, and interaction data.
            </li>
            <li>
              <strong>Log Data:</strong> IP address, access times, referring URLs, and system activity.
            </li>
            <li>
              <strong>Location Data:</strong> General location based on IP address (we do not collect 
              precise GPS location).
            </li>
          </ul>

          <h3 className={styles.subsectionTitle}>2.3 Information from Third Parties</h3>
          <p>We may receive information from third-party sources:</p>
          <ul className={styles.list}>
            <li>
              <strong>Social Login Providers:</strong> If you sign in using Google or other OAuth providers, 
              we receive your name, email, and profile picture.
            </li>
            <li>
              <strong>Analytics Partners:</strong> Aggregated usage statistics and performance metrics.
            </li>
          </ul>
        </section>

        {/* Section 3: How We Use Your Information */}
        <section id="how-we-use-information" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>3.</span>
            How We Use Your Information
          </h2>
          <p>We use the information we collect for the following purposes:</p>
          
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🎯</span>
              <h4>Service Delivery</h4>
              <p>To provide, maintain, and improve our AI wellness features, nutrition tracking, and task management.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🤖</span>
              <h4>AI Personalization</h4>
              <p>To train and improve our AI models to provide personalized wellness recommendations.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>📊</span>
              <h4>Analytics & Insights</h4>
              <p>To generate your personal wellness reports, progress tracking, and health insights.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>🔒</span>
              <h4>Security</h4>
              <p>To detect, prevent, and address fraud, abuse, and security issues.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>📧</span>
              <h4>Communication</h4>
              <p>To send service updates, security alerts, and support messages.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.cardIcon}>⚖️</span>
              <h4>Legal Compliance</h4>
              <p>To comply with legal obligations and enforce our terms of service.</p>
            </div>
          </div>

          <div className={styles.highlight}>
            <span className={styles.highlightIcon}>🛡️</span>
            <div>
              <strong>AI & Chat Data:</strong> Conversations with our AI wellness assistant are processed 
              to provide responses. We may use anonymized conversation patterns to improve our AI, but we 
              never share identifiable chat content with third parties.
            </div>
          </div>
        </section>

        {/* Section 4: Data Sharing */}
        <section id="data-sharing" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>4.</span>
            Data Sharing and Disclosure
          </h2>
          <p>
            We take your privacy seriously and do not sell your personal information. We may share your 
            information only in the following circumstances:
          </p>
          
          <h3 className={styles.subsectionTitle}>4.1 Service Providers</h3>
          <p>
            We share data with trusted third-party service providers who assist us in operating our 
            platform, including:
          </p>
          <ul className={styles.list}>
            <li>Cloud hosting and infrastructure providers (e.g., AWS, Google Cloud)</li>
            <li>AI and machine learning service providers for natural language processing</li>
            <li>Analytics and monitoring services</li>
            <li>Email and communication service providers</li>
            <li>Payment processors (if applicable)</li>
          </ul>
          <p>
            All service providers are bound by contractual obligations to protect your data and use it 
            only for the purposes we specify.
          </p>

          <h3 className={styles.subsectionTitle}>4.2 Legal Requirements</h3>
          <p>We may disclose your information if required to do so by law or in response to:</p>
          <ul className={styles.list}>
            <li>Valid legal processes (subpoenas, court orders)</li>
            <li>Government requests from law enforcement</li>
            <li>Protection of our rights, property, or safety</li>
            <li>Prevention of fraud or illegal activities</li>
          </ul>

          <h3 className={styles.subsectionTitle}>4.3 Business Transfers</h3>
          <p>
            In the event of a merger, acquisition, or sale of assets, your information may be transferred 
            as part of that transaction. We will notify you of any such change in ownership.
          </p>

          <h3 className={styles.subsectionTitle}>4.4 With Your Consent</h3>
          <p>
            We may share your information for other purposes with your explicit consent.
          </p>

          <div className={styles.warning}>
            <span className={styles.warningIcon}>⚠️</span>
            <div>
              <strong>What We Never Do:</strong> We never sell your personal data to advertisers, data 
              brokers, or any third parties for marketing purposes.
            </div>
          </div>
        </section>

        {/* Section 5: Data Security */}
        <section id="data-security" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>5.</span>
            Data Security
          </h2>
          <p>
            We implement industry-standard security measures to protect your personal information:
          </p>
          <ul className={styles.list}>
            <li>
              <strong>Encryption:</strong> All data is encrypted in transit using TLS 1.3 and at rest 
              using AES-256 encryption.
            </li>
            <li>
              <strong>Access Controls:</strong> Strict role-based access controls limit who can access 
              your data within our organization.
            </li>
            <li>
              <strong>Authentication:</strong> Secure password hashing (BCrypt), optional two-factor 
              authentication, and OAuth 2.0 integration.
            </li>
            <li>
              <strong>Infrastructure:</strong> Our servers are hosted in SOC 2 Type II compliant data 
              centers with 24/7 monitoring.
            </li>
            <li>
              <strong>Regular Audits:</strong> We conduct regular security assessments and penetration testing.
            </li>
            <li>
              <strong>Incident Response:</strong> We maintain a comprehensive incident response plan to 
              address any security breaches promptly.
            </li>
          </ul>
          <p>
            While we strive to protect your data, no method of transmission over the Internet is 100% 
            secure. We cannot guarantee absolute security but commit to promptly notifying you of any 
            breach affecting your data.
          </p>
        </section>

        {/* Section 6: Data Retention */}
        <section id="data-retention" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>6.</span>
            Data Retention
          </h2>
          <p>We retain your personal information for as long as necessary to:</p>
          <ul className={styles.list}>
            <li>Provide you with our Services and fulfill the purposes described in this policy</li>
            <li>Comply with legal obligations (e.g., tax, accounting requirements)</li>
            <li>Resolve disputes and enforce our agreements</li>
          </ul>
          
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Data Type</span>
              <span>Retention Period</span>
            </div>
            <div className={styles.tableRow}>
              <span>Account Information</span>
              <span>Until account deletion + 30 days</span>
            </div>
            <div className={styles.tableRow}>
              <span>Health & Nutrition Data</span>
              <span>Until account deletion</span>
            </div>
            <div className={styles.tableRow}>
              <span>Chat Conversations</span>
              <span>90 days (auto-deleted) or until manual deletion</span>
            </div>
            <div className={styles.tableRow}>
              <span>Task Data</span>
              <span>Until account deletion</span>
            </div>
            <div className={styles.tableRow}>
              <span>Log Data</span>
              <span>12 months</span>
            </div>
            <div className={styles.tableRow}>
              <span>Analytics Data</span>
              <span>24 months (anonymized)</span>
            </div>
          </div>
        </section>

        {/* Section 7: Your Rights */}
        <section id="your-rights" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>7.</span>
            Your Rights and Choices
          </h2>
          <p>
            Depending on your location, you may have the following rights regarding your personal data:
          </p>

          <div className={styles.rightsGrid}>
            <div className={styles.rightItem}>
              <span className={styles.rightIcon}>👁️</span>
              <div>
                <h4>Right to Access</h4>
                <p>Request a copy of the personal data we hold about you.</p>
              </div>
            </div>
            <div className={styles.rightItem}>
              <span className={styles.rightIcon}>✏️</span>
              <div>
                <h4>Right to Rectification</h4>
                <p>Request correction of inaccurate or incomplete data.</p>
              </div>
            </div>
            <div className={styles.rightItem}>
              <span className={styles.rightIcon}>🗑️</span>
              <div>
                <h4>Right to Erasure</h4>
                <p>Request deletion of your personal data ("right to be forgotten").</p>
              </div>
            </div>
            <div className={styles.rightItem}>
              <span className={styles.rightIcon}>⏸️</span>
              <div>
                <h4>Right to Restrict Processing</h4>
                <p>Request limitation of how we process your data.</p>
              </div>
            </div>
            <div className={styles.rightItem}>
              <span className={styles.rightIcon}>📤</span>
              <div>
                <h4>Right to Data Portability</h4>
                <p>Receive your data in a structured, machine-readable format.</p>
              </div>
            </div>
            <div className={styles.rightItem}>
              <span className={styles.rightIcon}>🚫</span>
              <div>
                <h4>Right to Object</h4>
                <p>Object to processing based on legitimate interests.</p>
              </div>
            </div>
          </div>

          <p>
            To exercise any of these rights, please contact us at{" "}
            <a href="mailto:privacy@vytara.com" className={styles.link}>privacy@vytara.com</a>. 
            We will respond to your request within 30 days.
          </p>

          <h3 className={styles.subsectionTitle}>Account Controls</h3>
          <p>You can also manage your data directly through your account:</p>
          <ul className={styles.list}>
            <li>Update your profile information in Settings</li>
            <li>Delete individual meals, tasks, or chat conversations</li>
            <li>Export your data from the Profile page</li>
            <li>Delete your account entirely (Settings → Delete Account)</li>
          </ul>
        </section>

        {/* Section 8: Cookies */}
        <section id="cookies" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>8.</span>
            Cookies and Tracking Technologies
          </h2>
          <p>We use cookies and similar technologies to enhance your experience:</p>

          <h3 className={styles.subsectionTitle}>Types of Cookies We Use</h3>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Cookie Type</span>
              <span>Purpose</span>
            </div>
            <div className={styles.tableRow}>
              <span>Essential Cookies</span>
              <span>Required for authentication and core functionality</span>
            </div>
            <div className={styles.tableRow}>
              <span>Preference Cookies</span>
              <span>Remember your settings and preferences</span>
            </div>
            <div className={styles.tableRow}>
              <span>Analytics Cookies</span>
              <span>Understand how users interact with our platform</span>
            </div>
            <div className={styles.tableRow}>
              <span>Security Cookies</span>
              <span>Protect against fraud and unauthorized access</span>
            </div>
          </div>

          <h3 className={styles.subsectionTitle}>Managing Cookies</h3>
          <p>
            You can control cookies through your browser settings. Note that disabling certain cookies 
            may affect the functionality of our Services. Most browsers allow you to:
          </p>
          <ul className={styles.list}>
            <li>View what cookies are stored and delete them individually</li>
            <li>Block third-party cookies</li>
            <li>Block cookies from specific sites</li>
            <li>Block all cookies</li>
            <li>Delete all cookies when you close your browser</li>
          </ul>
        </section>

        {/* Section 9: Third-Party Services */}
        <section id="third-party" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>9.</span>
            Third-Party Services
          </h2>
          <p>Our Services may integrate with or link to third-party services:</p>
          <ul className={styles.list}>
            <li>
              <strong>AI Language Models:</strong> We use third-party AI providers to power our wellness 
              assistant. Conversations are processed through these services but are not stored by them 
              beyond what's necessary for response generation.
            </li>
            <li>
              <strong>Authentication Providers:</strong> Google OAuth for social login functionality.
            </li>
            <li>
              <strong>Analytics:</strong> We use privacy-focused analytics to understand usage patterns.
            </li>
          </ul>
          <p>
            These third parties have their own privacy policies. We encourage you to review their 
            policies before using their services through our platform.
          </p>
        </section>

        {/* Section 10: Children's Privacy */}
        <section id="childrens-privacy" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>10.</span>
            Children's Privacy
          </h2>
          <p>
            Our Services are not intended for children under 13 years of age (or 16 in certain 
            jurisdictions). We do not knowingly collect personal information from children. If you 
            are a parent or guardian and believe your child has provided us with personal information, 
            please contact us immediately at{" "}
            <a href="mailto:privacy@vytara.com" className={styles.link}>privacy@vytara.com</a>.
          </p>
          <p>
            If we discover that we have collected personal information from a child without parental 
            consent, we will delete that information promptly.
          </p>
        </section>

        {/* Section 11: International Transfers */}
        <section id="international" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>11.</span>
            International Data Transfers
          </h2>
          <p>
            Your information may be transferred to and processed in countries other than your country 
            of residence. These countries may have different data protection laws. When we transfer 
            data internationally, we ensure appropriate safeguards are in place:
          </p>
          <ul className={styles.list}>
            <li>Standard Contractual Clauses (SCCs) approved by relevant authorities</li>
            <li>Data processing agreements with all service providers</li>
            <li>Compliance with applicable data transfer regulations (GDPR, CCPA, etc.)</li>
          </ul>
        </section>

        {/* Section 12: Changes */}
        <section id="changes" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>12.</span>
            Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices 
            or for legal, operational, or regulatory reasons. When we make material changes:
          </p>
          <ul className={styles.list}>
            <li>We will update the "Last Updated" date at the top of this policy</li>
            <li>We will notify you via email or in-app notification for significant changes</li>
            <li>We may require you to re-acknowledge the updated policy</li>
          </ul>
          <p>
            We encourage you to review this policy periodically to stay informed about how we 
            protect your information.
          </p>
        </section>

        {/* Section 13: Contact */}
        <section id="contact" className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNumber}>13.</span>
            Contact Us
          </h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our 
            data practices, please contact us:
          </p>
          
          <div className={styles.contactCard}>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📧</span>
              <div>
                <strong>Email</strong>
                <a href="mailto:privacy@vytara.com">privacy@vytara.com</a>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>🏢</span>
              <div>
                <strong>Data Protection Officer</strong>
                <a href="mailto:dpo@vytara.com">dpo@vytara.com</a>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>📍</span>
              <div>
                <strong>Mailing Address</strong>
                <span>Vytara AI Inc.<br />123 Wellness Street<br />San Francisco, CA 94102<br />United States</span>
              </div>
            </div>
          </div>

          <p>
            For EU residents, you also have the right to lodge a complaint with your local data 
            protection authority if you believe we have not adequately addressed your concerns.
          </p>
        </section>

        {/* Back to Top & Home */}
        <div className={styles.actions}>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className={styles.backToTop}
          >
            <span>↑</span>
            <span>Back to Top</span>
          </button>
          <Link to="/" className={styles.backHome}>
            <span>←</span>
            <span>Return to Home</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
