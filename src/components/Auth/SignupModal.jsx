import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import styles from "./SignupModal.module.css";

export default function SignupModal({ onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      // Call the actual backend API
      const response = await api.auth.signup({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        agreeToTerms: agreeTerms,
      });

      console.log('Signup API response:', response);

      // API service already extracts the data, so response = { accessToken, refreshToken, user }
      // Login with the response directly
      if (response && response.accessToken && response.user) {
        login(response, false);
        
        // Close modal and redirect
        onClose();
        navigate("/nutrition");
      } else {
        throw new Error('Invalid response from server - missing required fields');
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log("Google signup");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className={styles.particle}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        />
      ))}

      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <div className={styles.icon}>🚀</div>
          </div>
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>
            Join VYTARA AI and start your wellness journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Full Name */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.input}
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Terms */}
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className={styles.checkbox}
            />
            <span>
              I agree to the{" "}
              <a href="#" className={styles.link}>
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#" className={styles.link}>
                Privacy Policy
              </a>
            </span>
          </label>

          {/* Error Message */}
          {error && (
            <div style={{ 
              color: '#ff4444', 
              fontSize: '14px', 
              textAlign: 'center',
              padding: '10px',
              backgroundColor: 'rgba(255, 68, 68, 0.1)',
              borderRadius: '8px',
              marginTop: '10px'
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button 
            type="submit" 
            className={styles.signupBtn}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Divider */}
          <div className={styles.divider}>
            <span>OR</span>
          </div>

          {/* Google Signup */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className={styles.googleBtn}
          >
            <span>Sign up with Google</span>
          </button>
        </form>

        {/* Login Link */}
        <div className={styles.loginPrompt}>
          <span>Already have an account?</span>
          <button onClick={onClose} className={styles.loginLink}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
