import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import app from "../Others/firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import "./Login_Signup.css";

function validateEmail(email: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}
function validatePassword(password: string) {
  return password.length >= 6;
}

const LoginScreen = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);

  const onLoginPressed = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;
    if (!validateEmail(email.value)) {
      setEmail({ ...email, error: "Enter a valid email address" });
      valid = false;
    }
    if (!validatePassword(password.value)) {
      setPassword({
        ...password,
        error: "Password must be at least 6 characters",
      });
      valid = false;
    }
    if (!valid) return;
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
      window.alert(
        "Login Failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
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
      window.alert(
        "Google Login Failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
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
