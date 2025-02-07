import React, { useState } from 'react';
import './homepage.css';
import Logo from './../../Assets/Logo.png';
import MicIcon from './../../Assets/Mic-Image.png';

const Mainpage: React.FC = () => {
    const [activePage, setActivePage] = useState('home');
    const [isRecording, setIsRecording] = useState(false); // State for recording status

    const handleNavigation = (page: string) => {
        setActivePage(page);
    };

    const handleRecordClick = () => {
        setIsRecording(!isRecording); // Toggle recording state
        // Add your recording logic here (start/stop recording, etc.)
        if (isRecording) {
            console.log("Stopping recording...");
            // Stop recording
        } else {
            console.log("Starting recording...");
            // Start recording
        }
    };

    return (
        <div>
            <header className="header">
                <div className="logo">
                    <img src={Logo} alt="Your Logo" />
                </div>
                <div className="cta">
                    <button className="demo-button">Request a demo</button>
                    <button className="login-button">Log in</button>
                </div>
            </header>

            <section className="hero">
                <div className="hero-content">
                    <h1>Bespoke: Your AI-Powered Healthcare Companion</h1>
                    <p>Revolutionizing healthcare with intelligent voice analysis and prescription management.</p>
                    <button className="cta-button">Get Started</button>
                </div>
                <div className="hero-buttons"> {/* Container for the hero buttons */}
                    <button className="hero-action-button">Voice Analysis</button>
                    <button className="hero-action-button">Prescription Management</button>
                    <button className="hero-action-button">AI Insights</button>
                    <button className="mic-button" onClick={handleRecordClick}>
                        <img src={MicIcon} alt="Microphone" className="mic-icon" />
                    </button>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Bespoke. All rights reserved.</p>
                    <ul className="footer-legal">
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
};

export default Mainpage;