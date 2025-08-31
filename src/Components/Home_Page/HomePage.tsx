import React, { useState, useRef, useEffect } from "react";
import "./homepage.css";
import { ReactComponent as PlayIcon } from "../../Assets/play-button-svgrepo-com.svg";
import { ReactComponent as PauseIcon } from "../../Assets/stop-button-svgrepo-com.svg";
import { ReactComponent as SunIcon } from "../../Assets/light-svgrepo-com.svg";
import { ReactComponent as MoonIcon } from "../../Assets/moon-svgrepo-com.svg";
import { ReactComponent as BellIcon } from "../../Assets/bell-svgrepo-com.svg";
import { ReactComponent as CrossBellIcon } from "../../Assets/bell-slash-svgrepo-com.svg";
import { ReactComponent as SettingsIcon } from "../../Assets/setting-5-svgrepo-com.svg";

const Recorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showNotification, setShowNotification] = useState(true);
  const [audioSourceError, setAudioSourceError] = useState("");
  const [language, setLanguage] = useState("en-in");
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const discRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const languageOptions = [
    { code: "en-US", name: "English" },
    { code: "hi-IN", name: "Hindi" },
  ];

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }

    return () => {
      stopRecording();
    };
  }, [isRecording]);

  const startRecording = async () => {
    discRef.current?.classList.add("spin");
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const transcription = await transcribeWithAssemblyAI(audioBlob);

        if (
          !transcription ||
          transcription === "Transcription failed." ||
          transcription === ""
        ) {
          console.log("No valid transcription received.");
          if (showNotification)
            await sendEmailWithNotes("No transcript was recorded.");
          return;
        }

        const summary = await summarizeText(transcription);
        if (showNotification) {
          await sendEmailWithNotes(summary);
        }
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Recording failed:", error);
      setAudioSourceError(
        "Microphone access failed. Refresh and allow access."
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    discRef.current?.classList.remove("spin");
    mediaRecorderRef.current?.stop();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
  };

  const transcribeWithAssemblyAI = async (audioBlob: Blob): Promise<string> => {
    const apiKey = process.env.REACT_APP_ASSEMBLYAI_API_KEY;
    if (!apiKey) return "AssemblyAI API key missing.";

    try {
      const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
        method: "POST",
        headers: { Authorization: apiKey },
        body: audioBlob,
      });
      const { upload_url } = await uploadRes.json();

      const transcriptRes = await fetch(
        "https://api.assemblyai.com/v2/transcript",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: apiKey,
          },
          body: JSON.stringify({
            audio_url: upload_url,
            language_code: language,
          }),
        }
      );

      const { id } = await transcriptRes.json();
      let transcriptText = "";
      let completed = false;

      while (!completed) {
        const pollingRes = await fetch(
          `https://api.assemblyai.com/v2/transcript/${id}`,
          {
            headers: { Authorization: apiKey },
          }
        );
        const data = await pollingRes.json();

        if (data.status === "completed") {
          completed = true;
          transcriptText = data.text;
        } else if (data.status === "error") {
          throw new Error(data.error);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }

      return transcriptText;
    } catch (error) {
      console.error("AssemblyAI error:", error);
      return "Transcription failed.";
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setShowLanguagePopup(true);
    setTimeout(() => setShowLanguagePopup(false), 2000);
    setIsSettingsOpen(false);
  };

  return (
    <div className="recorder-container">
      <div className="top-left-text" onClick={() => window.location.reload()}>
        <h2>Bespoke</h2>
      </div>

      <div className="top-centre">
        {audioSourceError && (
          <div className="audio-error-text">{audioSourceError}</div>
        )}
        {showLanguagePopup && (
          <div className="language-popup">
            Language set to:{" "}
            {languageOptions.find((lang) => lang.code === language)?.name}
          </div>
        )}
      </div>

      <div className="top-right-buttons">
        <button
          className="dark-mode-button"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      <div className="recorder">
        <div className="cassette">
          <canvas
            className="visualizer"
            ref={canvasRef}
            width={150}
            height={100}
          />
        </div>
        <div className="disc" ref={discRef}>
          <div className="disc-inner"></div>
        </div>
        <button
          className={`record-button ${isRecording ? "recording" : ""}`}
          onClick={() => setIsRecording(!isRecording)}
          disabled={!!audioSourceError}
        >
          {isRecording ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <div className="bottom-right-buttons">
        <button
          className="notification-button"
          onClick={() => setShowNotification(!showNotification)}
        >
          {showNotification ? <BellIcon /> : <CrossBellIcon />}
        </button>
      </div>

      <div className="bottom-left-buttons">
        <div className="settings-container">
          <button
            className="settings-button"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <SettingsIcon />
          </button>

          {isSettingsOpen && (
            <div className="settings-dropdown">
              <h4>Language Settings</h4>
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  className={`language-option ${
                    language === lang.code ? "active" : ""
                  }`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recorder;
