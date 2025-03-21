import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
            const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
            const user = userCredential.user;
            window.alert(`Login Successful! Welcome back, ${user.email}`);
            navigate("../Home");
        } catch (error) {
            setPassword({ ...password, error: "Invalid credentials" });
            window.alert("Login Failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h1>Bespoke</h1>
                <h2>Sign in to account</h2>
                <p className="subtext">
                    A Bespoke account allows you to receive notes directly mailed to you.
                </p>
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
                        {loading ? "Logging In..." : "Next"}
                    </button>
                </form>
                <p className="login-prompt">
                    Don't have an account? <a href="/Signup">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;
