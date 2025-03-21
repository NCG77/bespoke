import React from 'react'; /* { useState } */
import './Landingpage.css';
import { useNavigate } from "react-router-dom";
import HeroImage from '../../Assets/Main.png';
import Feature1Image from '../../Assets/Analysis.png';
import Feature2Image from '../../Assets/Manage.png';
import Feature3Image from '../../Assets/Main.png';

const Landingpage = () => {
    const navigate = useNavigate();

    return (
        <div className="Body">
            <header className="header">
                <div className="top-left-text">
                    <h2>Bespoke</h2>
                </div>
                <div className="cta">
                    <button className="demo-button" onClick={() => navigate("/Signup")}>Request a demo</button>
                    <button className="login-button" onClick={() => navigate("/Login")}>Log in</button>
                </div>
            </header>

            <section className="hero">
                <div className="hero-content">
                    <h1>Bespoke: Your AI-Powered Notes Companion</h1>
                    <h2>Revolutionizing Note-taking with intelligent voice analysis.</h2>
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
                    <p>Capture and analyze conversations in real-time. Extract key insights and streamline your workflow.</p>
                </div>
                <div className="feature">
                    <img src={Feature2Image} alt="Prescription Management" />
                    <h2>Effortless Notes Management</h2>
                    <p>Store and organize patient prescriptions securely on mail. Access and manage them anytime, anywhere.</p>
                </div>
                <div className="feature">
                    <img src={Feature3Image} alt="AI-Powered Insights" />
                    <h2>AI-Powered Insights</h2>
                    <p>Gain valuable insights from voice data and notification. Improve your efficiency and make data-driven decisions.</p>
                </div>
            </section>

            <section className="testimonials">
                <h2>What Our Users Say</h2>
                <div className="testimonial">
                    <p>"Bespoke has transformed the way I manage Notes and information. The voice analysis feature is incredibly helpful!" - Rohan</p>
                </div>
                <div className="testimonial">
                    <p>"I love the convenience of having all my Notes stored in one place. Bespoke is a game-changer!" - abhisheak</p>
                </div>
            </section>


            <section className="cta-section">
                <h2>Ready to experience the future of Notes Taking</h2>
                <button className="cta-button" onClick={() => navigate("/Signup")}>Request a Demo</button>
            </section>


            <footer className="footer">
                <div className="footer-bottom">
                    <h3>&copy; {new Date().getFullYear()} Bespoke.</h3>
                    <br />
                    <br />
                    <h3>All rights reserved.</h3>
                </div>
            </footer >
        </div >
    );
};

export default Landingpage;