import React, { useState } from 'react';
import './homepage.css';
import Logo from './../../Assets/Logo.png';
import MicIcon from './../../Assets/Mic-Image.png';

const Mainpage: React.FC = () => {
    const [activePage, setActivePage] = useState('home');
    const [isRecording, setIsRecording] = useState(false);

    const handleNavigation = (page: string) => {
        setActivePage(page);
    };

    const handleRecordClick = () => {
        setIsRecording(!isRecording);
        if (isRecording) {
            console.log("Stopping recording...");
        } else {
            console.log("Starting recording...");
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
                </div>
                <div className="hero-buttons">
                    <button className="hero-action-button-left">Voice Analysis</button>
                    <button className="mic-button" onClick={handleRecordClick}>
                        <img src={MicIcon} alt="Microphone" className="mic-icon" />
                    </button>
                    <button className="hero-action-button-right">Prescription Management</button>
                </div>
            </section >

            <footer className="footer">
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Bespoke. All rights reserved.</p>
                    <ul className="footer-legal">
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                    </ul>
                </div>
            </footer>
        </div >
    );
};

export default Mainpage;