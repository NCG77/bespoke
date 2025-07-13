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
    const discRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const mediaStreamRef = useRef<MediaStream | null>(null);

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
            mediaRecorderRef.current.ondataavailable = event => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                console.log("Audio Blob:", audioBlob);
                console.log("Blob size:", audioBlob.size);
                const audioUrl = URL.createObjectURL(audioBlob);
                const transcription = await transcribeWithAssemblyAI(audioBlob);

                if (!transcription || transcription === "Transcription failed." || transcription === "") {
                    console.log("No valid transcription received.");
                    if (showNotification) await sendEmailWithNotes("No transcript was recorded.");
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
            setAudioSourceError("Microphone access failed. Refresh and allow access.");
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        discRef.current?.classList.remove("spin");
        mediaRecorderRef.current?.stop();
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
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

            const transcriptRes = await fetch("https://api.assemblyai.com/v2/transcript", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: apiKey,
                },
                body: JSON.stringify({ audio_url: upload_url }),
            });
            const { id } = await transcriptRes.json();

            let completed = false;
            let transcriptText = "";
            while (!completed) {
                const pollingRes = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
                    headers: { Authorization: apiKey },
                });
                const data = await pollingRes.json();
                if (data.status === "completed") {
                    completed = true;
                    transcriptText = data.text;
                } else if (data.status === "error") {
                    throw new Error(data.error);
                } else {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            }

            console.log("Transcription result:", transcriptText);
            return transcriptText;
        } catch (error) {
            console.error("AssemblyAI error:", error);
            return "Transcription failed.";
        }
    };

    const summarizeText = async (text: string): Promise<string> => {
        const api = process.env.REACT_APP_API_KEY;
        try {
            const context = "You are an expert note-taker. Summarize the following transcript into concise and coherent notes:";
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${api}`,
                },
                body: JSON.stringify({
                    model: "llama3-8b-8192",
                    messages: [
                        { role: "system", content: context },
                        { role: "user", content: text },
                    ],
                    temperature: 0.7,
                }),
            });

            const data = await response.json();
            return data.choices[0]?.message?.content || "No response from AI.";
        } catch (error) {
            console.error("Summarization error:", error);
            return "Summarization failed.";
        }
    };

    const sendEmailWithNotes = async (notes: string): Promise<void> => {
        const email = localStorage.emailID;
        if (!email) {
            console.error("Email not found in localStorage.");
            return;
        }

        
        console.log("Sending email with notes:", notes);
    };

    return (
        <div className="recorder-container">
            <div className="top-left-text"><h2>Bespoke</h2></div>

            <div className="top-centre">
                {audioSourceError && <div className="audio-error-text">{audioSourceError}</div>}
            </div>

            <div className="top-right-buttons">
                <button className="dark-mode-button" onClick={() => setIsDarkMode(!isDarkMode)}>
                    {isDarkMode ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>

            <div className="recorder">
                <div className="cassette">
                    <canvas className="visualizer" ref={canvasRef} width={150} height={100} />
                </div>
                <div className="disc" ref={discRef}><div className="disc-inner"></div></div>
                <button
                    className={`record-button ${isRecording ? "recording" : ""}`}
                    onClick={() => setIsRecording(!isRecording)}
                    disabled={!!audioSourceError}
                >
                    {isRecording ? <PauseIcon /> : <PlayIcon />}
                </button>
            </div>

            <div className="bottom-right-buttons">
                <button className="notification-button" onClick={() => setShowNotification(!showNotification)}>
                    {showNotification ? <BellIcon /> : <CrossBellIcon />}
                </button>
            </div>
            <div className="bottom-left-buttons">
                <button className="settings-button" onClick={() => console.log("Woopdi")}> <SettingsIcon /> </button>
            </div>
        </div>
    );
};

export default Recorder;
