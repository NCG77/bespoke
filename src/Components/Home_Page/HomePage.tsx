import React, { useState, useRef, useEffect } from "react";
import "./Homepage.css";
import { ReactComponent as PlayIcon } from "../../Assets/play-button-svgrepo-com.svg";
import { ReactComponent as PauseIcon } from "../../Assets/stop-button-svgrepo-com.svg";
import { ReactComponent as SunIcon } from "../../Assets/light-svgrepo-com.svg";
import { ReactComponent as MoonIcon } from "../../Assets/moon-svgrepo-com.svg";
import { ReactComponent as BellIcon } from "../../Assets/bell-svgrepo-com.svg";
import { ReactComponent as CrossBellIcon } from "../../Assets/bell-slash-svgrepo-com.svg";
import { ReactComponent as SettingsIcon } from "../../Assets/setting-5-svgrepo-com.svg";
import TranscriptionPage from "../Transcription_Page/TranscriptionPage.tsx";

const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(30 * 60);
  const timerIntervalRef = useRef(null);
  const timerTimeoutRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showNotification, setShowNotification] = useState(true);
  const [audioSourceError, setAudioSourceError] = useState("");
  const [language, setLanguage] = useState("en");
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState("");
  const [showTranscription, setShowTranscription] = useState(false);

  const discRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null as MediaRecorder | null);
  const audioChunksRef = useRef([]);
  const mediaStreamRef = useRef(null as MediaStream | null);

  const languageOptions = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
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
    discRef.current?.classList.add("spin");
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      mediaStreamRef.current = stream;

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Recording failed:", error);
      setAudioSourceError(
        "System audio access failed. Refresh and allow access."
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    discRef.current?.classList.remove("spin");
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setShowLanguagePopup(true);
    setTimeout(() => setShowLanguagePopup(false), 2000);
    setIsSettingsOpen(false);
  };

  const handleTranscribe = async () => {
    if (!audioUrl) return;

    setIsTranscribing(true);
    setTranscriptionResult("");

    try {
      const apiKey = process.env.REACT_APP_ASSEMBLYAI_API_KEY;

      if (!apiKey) {
        alert(
          "Please add your AssemblyAI API key to the .env file:\nREACT_APP_ASSEMBLYAI_API_KEY=your_api_key_here"
        );
        setIsTranscribing(false);
        return;
      }

      console.log("Starting transcription...");
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();

      console.log("Audio blob size:", audioBlob.size, "bytes");
      const uploadResponse = await fetch(
        "https://api.assemblyai.com/v2/upload",
        {
          method: "POST",
          headers: {
            authorization: apiKey,
            "content-type": "application/octet-stream",
          },
          body: audioBlob,
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(
          `Upload failed: ${uploadResponse.status} - ${errorText}`
        );
      }

      const uploadData = await uploadResponse.json();
      console.log("Audio uploaded successfully");

      const transcriptResponse = await fetch(
        "https://api.assemblyai.com/v2/transcript",
        {
          method: "POST",
          headers: {
            authorization: apiKey,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            audio_url: uploadData.upload_url,
            language_code: language,
            punctuate: true,
            format_text: true,
          }),
        }
      );

      if (!transcriptResponse.ok) {
        const errorText = await transcriptResponse.text();
        throw new Error(
          `Transcription request failed: ${transcriptResponse.status} - ${errorText}`
        );
      }

      const transcriptData = await transcriptResponse.json();
      const transcriptId = transcriptData.id;

      console.log("Transcription started with ID:", transcriptId);
      const pollTranscription = async (): Promise<void> => {
        const statusResponse = await fetch(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          {
            headers: {
              authorization: apiKey,
            },
          }
        );

        const statusData = await statusResponse.json();
        console.log("Transcription status:", statusData.status);

        if (statusData.status === "completed") {
          setTranscriptionResult(statusData.text);
          setShowTranscription(true);
          setIsTranscribing(false);
          console.log("Transcription completed:", statusData.text);
        } else if (statusData.status === "error") {
          throw new Error(statusData.error);
        } else {
          setTimeout(() => pollTranscription(), 3000);
        }
      };
      pollTranscription();
    } catch (error: any) {
      console.error("Transcription failed:", error);
      alert(`Transcription failed: ${error.message}`);
      setIsTranscribing(false);
    }
  };

  return (
    <div>
      {showTranscription && transcriptionResult ? (
        <TranscriptionPage
          transcriptionText={transcriptionResult}
          language={language}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onGoBack={() => {
            setShowTranscription(false);
            setTranscriptionResult("");
          }}
        />
      ) : (
        <div className="recorder-container">
          <div
            className="top-left-text clickable"
            onClick={() => window.location.reload()}
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
              <div className="audio-preview">
                <audio controls src={audioUrl} />
                <div className="audio-preview-label">
                  Playback of last recording
                </div>
              </div>
            )}
            {isRecording && (
              <div className="recording-timer">
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

            {audioUrl && !isRecording && (
              <button
                className="submit-button"
                onClick={handleTranscribe}
                disabled={isTranscribing}
              >
                {isTranscribing ? "Transcribing..." : "Transcribe Recording"}
              </button>
            )}
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
      )}
    </div>
  );
};

export default Recorder;
