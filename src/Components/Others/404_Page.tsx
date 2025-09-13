import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-600 mb-6">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-500 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={handleGoHome}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Go to Home Page
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
