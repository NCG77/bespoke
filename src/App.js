import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./Components/Home_Page/HomePage.tsx"
import LoginScreen from "./Components/Login_Page.tsx";
import SignupScreen from "./Components/Signup_Page.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Login" element={<LoginScreen />} />
      <Route path="/Signup" element={<SignupScreen />} />
    </Routes>
  );
}

export default App;
