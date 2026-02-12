import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { setAuthTokens } from "../../services/api";
import { STORAGE_KEYS } from "../../utils/constants";

export default function OAuth2Redirect() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Get tokens from URL parameters
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refreshToken");
        const errorParam = searchParams.get("error");

        if (errorParam) {
          setError(decodeURIComponent(errorParam));
          setProcessing(false);
          return;
        }

        if (!token) {
          setError("No authentication token received");
          setProcessing(false);
          return;
        }

        // Store tokens
        setAuthTokens(token, refreshToken, true); // Remember me = true for OAuth

        // Decode the JWT to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Fetch user profile from backend
        const response = await fetch("http://localhost:3000/api/user/profile", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const result = await response.json();
        const userData = result.data || result;

        // Store user data
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

        // Login with the auth context
        login({
          accessToken: token,
          refreshToken: refreshToken,
          user: userData
        }, true);

        // Redirect to app
        navigate("/nutrition", { replace: true });

      } catch (err) {
        console.error("OAuth callback error:", err);
        setError(err.message || "Authentication failed");
        setProcessing(false);
      }
    };

    processOAuthCallback();
  }, [searchParams, navigate, login]);

  const handleRetry = () => {
    window.location.href = "http://localhost:3000/api/oauth2/authorization/google";
  };

  if (error) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1729 100%)",
        color: "#fff",
        padding: "20px"
      }}>
        <div style={{
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "12px",
          padding: "30px",
          textAlign: "center",
          maxWidth: "400px"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
          <h2 style={{ marginBottom: "12px", color: "#ef4444" }}>Authentication Failed</h2>
          <p style={{ color: "#8b92b0", marginBottom: "24px" }}>{error}</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              onClick={handleRetry}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Retry
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "12px 24px",
                background: "transparent",
                color: "#8b92b0",
                border: "1px solid #8b92b0",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1729 100%)",
      color: "#fff"
    }}>
      <div style={{
        width: "60px",
        height: "60px",
        border: "4px solid rgba(102, 126, 234, 0.3)",
        borderTop: "4px solid #667eea",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "24px"
      }} />
      <h2 style={{ marginBottom: "8px" }}>Completing Sign In...</h2>
      <p style={{ color: "#8b92b0" }}>Please wait while we set up your account</p>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

