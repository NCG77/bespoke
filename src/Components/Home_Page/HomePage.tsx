import React, { useState } from 'react';
import './Homepage.css';
import Logo from '../../Assets/Logo.png'; // Make sure the path is correct
/* 
import HeroImage from './hero_image.jpg'; // Import your hero image
import Feature1Image from './feature1.jpg'; // Example feature image
import Feature2Image from './feature2.jpg'; // Example feature image
import Feature3Image from './feature3.jpg'; // Example feature image
 */

const Homepage = () => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    return (
        <div>
            <header className="header">
                {/* ... (Header code remains the same) ... */}
            </header>

            <section className="hero">
                <div className="hero-content">
                    <h1>Bespoke: Your AI-Powered Healthcare Companion</h1>
                    <p>Revolutionizing healthcare with intelligent voice analysis and prescription management.</p>
                    <button className="cta-button">Get Started</button> {/* Call to action button */}
                </div>
                <div className="hero-image">
                    <img src={HeroImage} alt="Healthcare Hero" /> {/* Hero image */}
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
                <button className="cta-button">Request a Demo</button>
            </section>


            <footer className="footer">
                {/* ... (Footer code remains the same) ... */}
            </footer>
        </div>
    );
};

export default Homepage;