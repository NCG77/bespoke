import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen flex flex-col items-center justify-center text-white text-center p-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-5xl font-bold mb-4">Smart Medical Records & AI Insights</h1>
                <p className="text-lg max-w-2xl mb-6">
                    Record doctor-patient conversations, extract key insights, store images, and receive medicine reminders—all in one secure platform.
                </p>
                <div className="flex space-x-4">
                    <button
                        onClick={() => navigate("/Login")}
                    >
                        Get Started
                    </button>
                </div>
            </motion.div >
        </div >
    );
};

export default HomePage;
