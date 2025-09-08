import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./Components/Home_Page/HomePage.tsx";
import TranscriptionPage from "./Components/Transcription_Page/TranscriptionPage.tsx";
/* import LoginScreen from "./Components/Login_and_Signup/Login_Page.tsx";
import SignupScreen from "./Components/Login_and_Signup/Signup_Page.tsx"; */

function App() {
  return (

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/transcription" element={<TranscriptionPage />} />
    </Routes>
  );

  /* return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/Signup" element={<SignupScreen />} />
      <Route path="/Home" element={<HomePage />} />
      <Route path="/transcription" element={<TranscriptionPage />} />
    </Routes>
  ); */
}

export default App;
