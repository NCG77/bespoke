import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSSProperties } from "react";
import Logo from "../../Assets/Logo.png";

const theme = {
    colors: {
        primary: "#347ed5",
        secondary: "#0e3ac8",
        backgroundOverlay: "#3f6ad8",
        cardBackground: "#FFFFFF",
    },
};

const LoginScreen = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState({ value: "", error: "" });
    const [password, setPassword] = useState({ value: "", error: "" });
    //const [loading, setLoading] = useState(false);

    const onLoginPressed = async () => {
        // Your login logic here
    };

    return (
        <div style={styles.background}>
            <div style={styles.overlay}>
                <div style={styles.card}>
                    <img
                        src={Logo}
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
                        /* disabled={loading} */
                        style={styles.button}
                    >
                        {/*  {loading ? "Logging In..." : "Next"} */}
                    </button>

                    <div style={styles.row}>
                        <p>You do not have an account yet? </p>
                        <button onClick={() => navigate("/Signup")} style={styles.link}>
                            Create!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: CSSProperties } = {
    background: {
        backgroundImage: "linear-gradient(to right bottom, #6a11cb, #2575fc)",
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
        width: "100%",
        maxWidth: "400px",
        textAlign: "center",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    logo: {
        width: "350px",
        height: "110px",
        marginBottom: "16px",
    },
    header: {
        fontSize: "24px",
        color: theme.colors.primary,
        fontWeight: "bold",
        marginBottom: "16px",
    },
    input: {
        width: "95%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        backgroundColor: theme.colors.cardBackground,
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