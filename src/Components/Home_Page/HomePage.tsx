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
      timerTimeoutRef.current = setTimeout(() => {
        setIsRecording(false);
      }, 30 * 60 * 1000);
    } else {
      stopRecording();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
    }

    return () => {
      stopRecording();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    discRef.current?.classList.add("spin");
    audioChunksRef.current = [];

    try {
      // Use getDisplayMedia to capture system audio (user must select a screen/tab and allow audio)
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

        // Create a URL for playback
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        console.log("Audio blob created:", audioBlob);
        console.log("Audio URL for playback:", url);

        const transcription = await transcribeWithAssemblyAI(audioBlob);
        console.log("Transcription result:", transcription);

        if (
          !transcription ||
          transcription === "Transcription failed." ||
          transcription === ""
        ) {
          console.log("No valid transcription received.");
          return;
        }

        console.log("Processing transcription:", transcription);
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
    mediaRecorderRef.current?.stop();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
  };

  const transcribeWithAssemblyAI = async (audioBlob: Blob): Promise<string> => {
    // @ts-ignore
    const apiKey = process.env.REACT_APP_ASSEMBLYAI_API_KEY;
    if (!apiKey) return "AssemblyAI API key missing.";

    try {
      const uploadRes = await fetch("wss://streaming.assemblyai.com/v3/ws", {
        method: "POST",
        headers: { Authorization: apiKey },
        body: audioBlob,
      });

      if (!uploadRes.ok) {
        throw new Error(
          `Upload failed: ${uploadRes.status} ${uploadRes.statusText}`
        );
      }

      const uploadData = await uploadRes.json();
      const { upload_url } = uploadData;

      if (!upload_url) {
        throw new Error("No upload URL received from AssemblyAI");
      }

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
    <div>
      <div className="recorder">
        {audioUrl && (
          <div style={{ marginBottom: 10 }}>
            <audio controls src={audioUrl} style={{ width: "100%" }} />
            <div style={{ fontSize: 12, color: isDarkMode ? "#fff" : "#333" }}>
              Playback of last recording
            </div>
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
