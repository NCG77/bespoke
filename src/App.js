import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import routing components
import "./App.css";
import LoginScreen from "./Login_Page.tsx";
import SignupScreen from "./Signup_Page.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Define routes for Login and Signup screens */}
        <Route path="/" element={<LoginScreen />} /> {/* Default route (Login) */}
        <Route path="/signup" element={<SignupScreen />} /> {/* Signup route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;