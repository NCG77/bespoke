import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./Components/Home_Page/Homepage.tsx";
import TranscriptionPage from "./Components/Transcription_Page/TranscriptionPage.tsx";
import LoginScreen from "./Components/Login_and_Signup/Login_Page.tsx";
import SignupScreen from "./Components/Login_and_Signup/Signup_Page.tsx";
import NotFoundPage from "./Components/Others/404_Page.tsx";
import RequireAuth from "./Components/Others/RequireAuth.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/Signup" element={<SignupScreen />} />
      <Route path="/HomePage" element={
        <RequireAuth>
          <HomePage />
        </RequireAuth>
      } />
      <Route path="/transcription" element={
        <RequireAuth>
          <TranscriptionPage />
        </RequireAuth>
      } />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
