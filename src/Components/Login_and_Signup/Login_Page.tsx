import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import "./Login_Signup.css";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const LoginScreen = () => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);

  const onLoginPressed = async (e) => {
    e.preventDefault();
    if (!email.value) {
      setEmail({ ...email, error: "Email is required" });
      return;
    }
    if (!password.value) {
      setPassword({ ...password, error: "Password is required" });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      const user = userCredential.user;
      window.alert(`Login Successful! Welcome, ${user.email}`);
      navigate("/home");
    } catch (error) {
      setEmail({ ...email, error: "Invalid credentials" });
      window.alert("Login Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      window.alert(`Login Successful! Welcome, ${user.email}`);
      navigate("/home");
    } catch (error) {
      window.alert("Google Login Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Bespoke</h1>
        <h2>Sign in to your account</h2>
        <form className="signup-form" onSubmit={onLoginPressed}>
          <input
            type="email"
            placeholder="Email"
            value={email.value}
            onChange={(e) => setEmail({ value: e.target.value, error: "" })}
          />
          <p className="error-text">{email.error}</p>

          <input
            type="password"
            placeholder="Password"
            value={password.value}
            onChange={(e) => setPassword({ value: e.target.value, error: "" })}
          />
          <p className="error-text">{password.error}</p>

          <button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <button
          type="button"
          className="google-signup-button"
          onClick={onGoogleLogin}
          disabled={loading}
          style={{
            marginTop: 12,
            background: "#fff",
            color: "#333",
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "5px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Sign in with Google
        </button>
        <p className="login-prompt">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
