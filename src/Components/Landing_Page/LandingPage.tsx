import React, { useState } from 'react';
import './Landingpage.css';
import { useNavigate } from "react-router-dom";

import Logo from '../../Assets/Logo.png';
import HeroImage from '../../Assets/Main.png';
import Feature1Image from '../../Assets/Analysis.png';
import Feature2Image from '../../Assets/Manage.png';
import Feature3Image from '../../Assets/Main.png';

const Landingpage = () => {
    const navigate = useNavigate();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    return (
        <div>
            <header className="header">
                <div className="logo">
                    <img src={Logo} alt="Your Logo" />
                </div>
                <div className="cta">
                    <button className="demo-button" onClick={() => navigate("/Signup")}>Request a demo</button>
                    <button className="login-button" onClick={() => navigate("/Login")}>Log in</button>
                </div>
            </header>

            <section className="hero">
                <div className="hero-content">
                    <h1>Bespoke: Your AI-Powered Healthcare Companion</h1>
                    <p>Revolutionizing healthcare with intelligent voice analysis and prescription management.</p>
                    <button className="cta-button">Get Started</button>
                </div>
                <div className="hero-image">
                    <img src={HeroImage} alt="Healthcare Hero" />
                </div>
            </section>

            <section className="features">
                <div className="feature">
                    <img src={Feature1Image} alt="Voice Analysis" />
                    <h2>Intelligent Voice Analysis</h2>
                    <p>Capture and analyze doctor-patient conversations in real-time. Extract key medical insights and streamline your workflow.</p>
                </div>
                <div className="feature">
                    <img src={Feature2Image} alt="Prescription Management" />
                    <h2>Effortless Prescription Management</h2>
                    <p>Store and organize patient prescriptions securely. Access and manage them anytime, anywhere.</p>
                </div>
                <div className="feature">
                    <img src={Feature3Image} alt="AI-Powered Insights" />
                    <h2>AI-Powered Insights</h2>
                    <p>Gain valuable insights from voice data and prescriptions. Improve patient care and make data-driven decisions.</p>
                </div>
            </section>

            <section className="testimonials">
                <h2>What Our Users Say</h2>
                <div className="testimonial">
                    <p>"Bespoke has transformed the way I manage patient information. The voice analysis feature is incredibly helpful!" - Dr. Smith</p>
                </div>
                <div className="testimonial">
                    <p>"I love the convenience of having all my prescriptions stored in one place. Bespoke is a game-changer!" - John Doe</p>
                </div>
            </section>


            <section className="cta-section">
                <h2>Ready to experience the future of healthcare?</h2>
                <button className="cta-button" onClick={() => navigate("/Signup")}>Request a Demo</button>
            </section>


            <footer className="footer">
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                    <ul className="footer-legal">
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
};

export default Landingpage;