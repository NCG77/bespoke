import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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

const SignupScreen = () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const navigate = useNavigate();
    const [name, setName] = useState({ value: "", error: "" });
    const [email, setEmail] = useState({ value: "", error: "" });
    const [password, setPassword] = useState({ value: "", error: "" });
    const [loading, setLoading] = useState(false);

    const onSignupPressed = async (e) => {
        e.preventDefault();
        if (!name.value) {
            setName({ ...name, error: "Name is required" });
            return;
        }
        if (!email.value) {
            setEmail({ ...email, error: "Email is required" });
            return;
        }
        if (!password.value || password.value.length < 6) {
            setPassword({ ...password, error: "Password must be at least 6 characters" });
            return;
        }
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
            const user = userCredential.user;
            window.alert(`Signup Successful! Welcome, ${user.email}`);
            navigate("/login");
        } catch (error) {
            setEmail({ ...email, error: "Email already in use" });
            window.alert("Signup Failed: " + error.message);
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
                <p className="login-prompt">
                    Already have an account? <a href="/login">Sign in</a>
                </p>
            </div>
        </div>
    );
};

export default SignupScreen;
