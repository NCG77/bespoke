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
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(30 * 60);
  const timerIntervalRef = useRef<number | null>(null);
  const timerTimeoutRef = useRef<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showNotification, setShowNotification] = useState(true);
  const [audioSourceError, setAudioSourceError] = useState("");
  const [language, setLanguage] = useState("en-in");
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const discRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null as MediaRecorder | null);
  const audioChunksRef = useRef([]);
  const mediaStreamRef = useRef(null as MediaStream | null);

  const languageOptions = [
    { code: "en-US", name: "English" },
    { code: "hi-IN", name: "Hindi" },
  ];

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (isRecording) {
      setRecordingTimeLeft(30 * 60);
      startRecording();
      timerIntervalRef.current = setInterval(() => {
        setRecordingTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRecording(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (timerTimeoutRef.current) {
        clearTimeout(timerTimeoutRef.current);
        timerTimeoutRef.current = null;
      }
      stopRecording();
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (timerTimeoutRef.current) {
        clearTimeout(timerTimeoutRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioChunksRef.current = [];
      };
      
      mediaRecorder.start();
      setAudioSourceError("");
    } catch (error) {
      setAudioSourceError("Could not access microphone");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
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
      <div
        className="top-left-text"
        onClick={() => window.location.reload()}
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        <h2>Bespoke</h2>
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
        {audioUrl && (
          <div
            style={{
              marginBottom: 20,
              padding: 16,
              background: isDarkMode ? 'rgba(38,38,38,0.85)' : '#f7f7f7',
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: isDarkMode ? '1px solid #444' : '1px solid #ddd',
              width: '100%',
              maxWidth: 350,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <audio controls src={audioUrl} style={{ width: '100%' }} />
            <div style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#333', fontWeight: 500 }}>
              Playback of last recording
            </div>
          </div>
        )}
          </div>
        )}
        {isRecording && (
          <div
            style={{
              marginBottom: 10,
              fontSize: "18px",
              fontWeight: 600 as React.CSSProperties["fontWeight"],
              color: isDarkMode ? "#fff" : "#333",
            }}
          >
            Time left:{" "}
            {Math.floor(recordingTimeLeft / 60)
              .toString()
              .padStart(2, "0")}
            :{(recordingTimeLeft % 60).toString().padStart(2, "0")}
          </div>
        )}
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
