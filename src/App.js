import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
/* import HomePage from "./Components/Home_Page/Homepage.tsx"; */
import LandingPage from "./Components/Landing_Page/LandingPage.tsx";
import LoginScreen from "./Components/Login_and_Signup/Login_Page.tsx";
import SignupScreen from "./Components/Login_and_Signup/Signup_Page.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/Login" element={<LoginScreen />} />
      <Route path="/Signup" element={<SignupScreen />} />
    </Routes>
  );
}
/* 
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
} */

export default App;
