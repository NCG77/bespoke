import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import app from "../Others/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import "./Login_Signup.css";

function validateEmail(email: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}
function validatePassword(password: string) {
  return (
    password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password)
  );
}
function validateName(name: string) {
  return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
}

const SignupScreen = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);

  const onSignupPressed = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;
    if (!validateName(name.value)) {
      setName({
        ...name,
        error: "Enter a valid name (letters only, min 2 chars)",
      });
      valid = false;
    }
    if (!validateEmail(email.value)) {
      setEmail({ ...email, error: "Enter a valid email address" });
      valid = false;
    }
    if (!validatePassword(password.value)) {
      setPassword({
        ...password,
        error:
          "Password must be 6+ chars, include a number and uppercase letter",
      });
      valid = false;
    }
    if (!valid) return;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      const user = userCredential.user;
      window.alert(`Signup Successful! Welcome, ${user.email}`);
      navigate("/login");
    } catch (error) {
      setEmail({ ...email, error: "Email already in use" });
      window.alert(
        "Signup Failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignup = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      window.alert(`Signup Successful! Welcome, ${user.email}`);
      navigate("/login");
    } catch (error) {
      window.alert(
        "Google Signup Failed: " +
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
        <h2>Create an account</h2>
        <p className="subtext">
          A Bespoke account allows you to receive notes directly mailed to you.
        </p>
        <form className="signup-form" onSubmit={onSignupPressed}>
          <input
            type="text"
            placeholder="Name"
            value={name.value}
            onChange={(e) => setName({ value: e.target.value, error: "" })}
          />
          <p className="error-text">{name.error}</p>

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
            {loading ? "Signing Up..." : "Next"}
          </button>
        </form>
        <button
          type="button"
          className="google-signup-button"
          onClick={onGoogleSignup}
          disabled={loading}
        >
          Sign up with Google
        </button>
        <p className="login-prompt">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default SignupScreen;
