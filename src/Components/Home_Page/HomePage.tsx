import React, { useState } from 'react';
import './homepage.css';
import Logo from './../../Assets/Logo.png'; // Replace with your logo path

const Mainpage: React.FC = () => {
    const [activePage, setActivePage] = useState('home'); // Track active page (optional)

    const handleNavigation = (page: string) => {
        setActivePage(page); // Update active page (optional)
    };

    return (
        <div className="main-container">
            <header className="header">
                <div className="logo">
                    <img src={Logo} alt="Logo" />
                </div>
                <nav className="navigation">
                    <ul>
                        <li onClick={() => handleNavigation('product')}><a href="#">Product</a></li> {/* Example */}
                        <li onClick={() => handleNavigation('teams')}><a href="#">Teams</a></li> {/* Example */}
                        <li onClick={() => handleNavigation('individuals')}><a href="#">Individuals</a></li> {/* Example */}
                    </ul>
                </nav>
                <div className="action-buttons"> {/* Container for action buttons */}
                    <button className="action-button">Voice Record</button>
                    <button className="action-button">Upload Image</button>
                    <button className="action-button">Check Records</button>
                </div>
            </header>

            <main className="main-content">
                {/* Conditionally render content (if needed) */}
                {activePage === 'home' && <HomeContent />}
                {activePage === 'product' && <ProductPage />}
                {/* ... other pages */}
            </main>

            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Product</h3>
                        <ul>
                            <li><a href="#">Features</a></li>
                            <li><a href="#">Pricing</a></li>
                            <li><a href="#">Integrations</a></li>
                            <li><a href="#">API</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Company</h3>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Resources</h3>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Guides</a></li>
                            <li><a href="#">Templates</a></li>
                            <li><a href="#">Community</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                    <ul className="footer-legal">
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Security</a></li> {/* Example */}
                    </ul>
                </div>
            </footer>
        </div>
    );
};

// Example page components (replace with your actual components)
const HomeContent = () => (
    <section className="home-content">
        {/* Your homepage content here */}
        <h1>Welcome to Bespoke</h1>
        <p>Your AI-Powered Healthcare Companion</p>
        {/* ... */}
    </section>
);

const ProductPage = () => (
    <section className="product-page">
        <h2>Product Features</h2>
        {/* ... product features, screenshots, etc. */}
    </section>
);

export default Mainpage;