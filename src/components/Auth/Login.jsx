import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import SignupModal from "./SignupModal";
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const leftSideRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call the actual backend API
      const response = await api.auth.login({ email, password });
      
      // API service already extracts the data, so response = { accessToken, refreshToken, user }
      // Login with the response directly
      if (response && response.accessToken && response.user) {
        login(response, rememberMe);
        
        // Navigate to nutrition page
        navigate("/nutrition");
      } else {
        throw new Error('Invalid response from server - missing required fields');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = "http://localhost:3000/api/oauth2/authorization/google";
  };

  return (
    <>
      <div className={styles.container}>
        {/* Background Effects */}
        <div className={styles.backgroundEffects}>
          {[...Array(30)].map((_, i) => (
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
          <div className={styles.gradientGlow} />
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {/* Left Side - Futuristic Animation */}
          <div className={styles.leftSide} ref={leftSideRef}>
            {/* 3D Hologram Effect */}
            <div className={styles.hologramContainer}>
              {/* Rotating rings */}
              <div className={styles.ring} style={{ animationDelay: "0s" }} />
              <div className={styles.ring} style={{ animationDelay: "0.5s" }} />
              <div className={styles.ring} style={{ animationDelay: "1s" }} />

              {/* Central orb */}
              <div className={styles.centralOrb}>
                <div className={styles.orbCore} />
                <div className={styles.orbGlow} />
              </div>

              {/* Data streams */}
              <div className={styles.dataStreams}>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={styles.dataStream}
                    style={{
                      transform: `rotate(${i * 45}deg)`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>

              {/* Floating particles */}
              <div className={styles.floatingParticles}>
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={styles.floatingParticle}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: `${3 + Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Brand Info */}
            <div className={styles.brandInfo}>
              <div className={styles.logoWrapper}>
                <div className={styles.logo}>V</div>
              </div>
              <h1 className={styles.brandName}>VYTARA AI</h1>
              <p className={styles.brandTagline}>Your Wellness Companion</p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className={styles.rightSide}>
            <div className={styles.formCard}>
              {/* Sparkle Icon */}
              <div className={styles.sparkleIcon}>✨</div>

              {/* Header */}
              <h2 className={styles.formTitle}>Welcome back!</h2>
              <p className={styles.formSubtitle}>Please enter your details</p>

              {/* Form */}
              <form onSubmit={handleLogin} className={styles.form}>
                {/* Email Input */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Password</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={styles.input}
                      placeholder="Enter your password"
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

                {/* Remember Me & Forgot Password */}
                <div className={styles.formOptions}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className={styles.checkbox}
                    />
                    <span>Remember for 30 days</span>
                  </label>
                  <a href="#" className={styles.forgotLink}>
                    Forgot password?
                  </a>
                </div>

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

                {/* Login Button */}
                <button 
                  type="submit" 
                  className={styles.loginBtn}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>

                {/* Google Login */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className={styles.googleBtn}
                >
                  <svg className={styles.googleIcon} viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Log in with Google</span>
                </button>
              </form>

              {/* Sign Up Link */}
              <div className={styles.signupPrompt}>
                <span>Don't have an account?</span>
                <button
                  onClick={() => setShowSignup(true)}
                  className={styles.signupLink}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
    </>
  );
}
