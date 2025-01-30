import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
/* import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "api key",
    authDomain: "projectid.firebaseapp.com",
    databaseURL: "https://projectid.firebaseio.com",
    projectId: "projectid",
    storageBucket: "projectid.appspot.com",
    messagingSenderId: "sender-id",
    appId: "app-id",
    measurementId: "G-measurement-id",
}; */

/* const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
 */
const theme = {
    colors: {
        primary: "#2E7D32",
        secondary: "#1B5E20",
        backgroundOverlay: "#75a674",
        cardBackground: "#FFFFFF",
    },
};

const LoginScreen = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState({ value: "", error: "" });
    const [password, setPassword] = useState({ value: "", error: "" });
    const [loading, setLoading] = useState(false);

    const onLoginPressed = async () => {
        /* if (!email.value) {
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

            // Fetch user's displayName
            const userName = user.displayName || "User"; // Fallback to 'User' if displayName is null
            alert(`Login Successful! Welcome back, ${userName}!`);
            navigate("/nature-meditate");
        } catch (error) {
            const errorMessage = (error as Error).message;
            alert(`Login Failed: ${errorMessage}`);
        } finally {
            setLoading(false);
        } */
    };

    return (
        <div style={styles.background}>
            <div style={styles.overlay}>
                <div style={styles.card}>
                    <img
                        //src={require("../assets/images/Logo.png")}
                        style={styles.logo}
                        alt="Logo"
                    />

                    <h1 style={styles.header}>Welcome Back!</h1>
                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email.value}
                        onChange={(e) => setEmail({ value: e.target.value, error: "" })}
                    />
                    {email.error && <p style={styles.errorText}>{email.error}</p>}

                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Password"
                        value={password.value}
                        onChange={(e) => setPassword({ value: e.target.value, error: "" })}
                    />
                    {password.error && <p style={styles.errorText}>{password.error}</p>}

                    <div style={styles.forgotPassword}>
                        <button
                            onClick={() => navigate("/reset-password")}
                            style={styles.forgot}
                        >
                            Forgot your password?
                        </button>
                    </div>

                    <button
                        onClick={onLoginPressed}
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading ? "Logging In..." : "Next"}
                    </button>

                    <div style={styles.row}>
                        <p>You do not have an account yet? </p>
                        <button onClick={() => navigate("/signup")} style={styles.link}>
                            Create!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    background: {
        //backgroundImage: `url(${require("../assets/images/Background2.jpg")})`,
        backgroundImage: "linear-gradient(to right bottom, #4CAF50, #3F51B5)",
        backgroundSize: "cover",
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    overlay: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    card: {
        backgroundColor: theme.colors.cardBackground,
        padding: "20px",
        borderRadius: "12px",
        width: "80%",
        maxWidth: "400px",
        textAlign: "center",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    logo: {
        width: "200px",
        height: "150px",
        marginBottom: "16px",
    },
    header: {
        fontSize: "24px",
        color: theme.colors.primary,
        fontWeight: "bold",
        marginBottom: "16px",
    },
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        backgroundColor: theme.colors.backgroundOverlay,
    },
    forgotPassword: {
        width: "100%",
        textAlign: "right",
        marginBottom: "10px",
    },
    row: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10px",
    },
    forgot: {
        fontSize: "13px",
        color: theme.colors.primary,
        background: "none",
        border: "none",
        cursor: "pointer",
    },
    link: {
        fontWeight: "bold",
        color: theme.colors.primary,
        background: "none",
        border: "none",
        cursor: "pointer",
    },
    button: {
        marginTop: "10px",
        width: "100%",
        padding: "10px",
        backgroundColor: theme.colors.primary,
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    errorText: {
        color: "red",
        fontSize: "12px",
        marginBottom: "5px",
    },
};

export default LoginScreen;