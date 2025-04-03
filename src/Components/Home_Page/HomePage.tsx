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
    const [transcript, setTranscript] = useState("");
    const discRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef(new Audio());
    const analyserRef = useRef<AnalyserNode | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showNotification, setShowNotification] = useState(true);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        document.body.classList.toggle("dark-mode", isDarkMode);
    }, [isDarkMode]);

    useEffect(() => {
        if (isRecording) {
            discRef.current?.classList.add("spin");
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    audioRef.current.srcObject = stream;
                    audioRef.current.play();

                    const audioCtx = new AudioContext();
                    analyserRef.current = audioCtx.createAnalyser();
                    const source = audioCtx.createMediaStreamSource(stream);
                    source.connect(analyserRef.current);
                    visualize();

                    mediaRecorderRef.current = new MediaRecorder(stream);
                    mediaRecorderRef.current.ondataavailable = event => {
                        audioChunksRef.current.push(event.data);
                    };
                    mediaRecorderRef.current.onstop = async () => {
                        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                        console.log("Recorded Transcript:", transcript); // Log the transcript to the console
                        const generatedNotes = await generateNotes(transcript);
                        await sendEmailWithNotes(generatedNotes);
                    };
                    mediaRecorderRef.current.start();

                    // Initialize Speech Recognition
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    if (SpeechRecognition) {
                        recognitionRef.current = new SpeechRecognition();
                        recognitionRef.current.continuous = true;
                        recognitionRef.current.interimResults = true;
                        recognitionRef.current.lang = 'en-US';

                        recognitionRef.current.onresult = (event: any) => {
                            let interimTranscript = '';
                            for (let i = event.resultIndex; i < event.results.length; i++) {
                                const transcript = event.results[i][0].transcript;
                                if (event.results[i].isFinal) {
                                    setTranscript(prevTranscript => prevTranscript + transcript);
                                    console.log("Final Transcript:", transcript);
                                } else {
                                    interimTranscript += transcript;
                                    console.log("Interim Transcript:", interimTranscript);
                                }
                            }
                        };

                        recognitionRef.current.onerror = (event: any) => {
                            console.error("Speech recognition error:", event.error);
                        };

                        recognitionRef.current.onend = () => {
                            console.log("Speech recognition ended.");
                            if (recognitionRef.current.state !== 'stopped' && isRecording) {
                                recognitionRef.current.start();
                            }
                        };

                        recognitionRef.current.start();
                        console.log("Speech recognition started.");
                    } else {
                        console.error("Speech Recognition API not supported in this browser.");
                    }
                })
                .catch(err => console.error("Error accessing microphone:", err));
        } else {
            discRef.current?.classList.remove("spin");
            const tracks = audioRef.current.srcObject?.getAudioTracks();
            tracks?.forEach(track => track.stop());
            audioRef.current.srcObject = null;
            analyserRef.current?.disconnect();
            analyserRef.current = null;
            mediaRecorderRef.current?.stop();

            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }

            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext("2d");
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, [isRecording]);

    const visualize = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!analyserRef.current || !canvas || !ctx) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            analyserRef.current?.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.strokeStyle = "rgba(255, 50, 50, 0.3)";
            ctx.lineWidth = 2;
            ctx.stroke();

            const barWidth = canvas.width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * (canvas.height / 2);
                const gradient = ctx.createLinearGradient(x, canvas.height / 2 - barHeight, x, canvas.height / 2 + barHeight);
                gradient.addColorStop(0, "rgba(255, 50, 50, 0)");
                gradient.addColorStop(0.5, "rgba(255, 50, 50, 0.8)");
                gradient.addColorStop(1, "rgba(255, 50, 50, 0)");

                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height / 2 - barHeight, barWidth, barHeight * 2);
                x += barWidth;
            }

            requestAnimationFrame(draw);
        };
        draw();
    };

    // Notes Generation Function
    const generateNotes = async (transcript: string): Promise<string> => {
        const api = process.env.REACT_APP_API_KEY;

        if (api) {
            try {
                console.log("HI from AI: " + transcript);
                const context = "You are an expert note-taker. Summarize the following transcript into concise and coherent notes:";

                const messages = [
                    { role: "system", content: context },
                    { role: "user", content: transcript }
                ];

                const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${api}`,
                    },
                    body: JSON.stringify({
                        model: "llama3-8b-8192",
                        messages: messages,
                        temperature: 0.7,
                    }),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error?.message || "Unknown error occurred");

                return data.choices[0]?.message?.content || "No response from AI.";
            } catch (error) {
                console.error("Fetch Error:", error);
                return "Sorry, something went wrong. Please try again.";
            }
        } else {
            console.log("API Key not found");
            return "API Key not found. Please check your environment variables.";
        }
    };

    const sendEmailWithNotes = async (notes: string): Promise<void> => {
        // Implement the email sending logic here
        // You can use a service like SendGrid, Mailgun, or any other email API
        // This is a placeholder implementation
        console.log("Sending email with notes:", notes);
    };

    return (
        <div className="recorder-container">
            <div className="top-left-text">
                <h2>Bespoke</h2>
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
                <div className="disc" ref={discRef}>
                    <div className="disc-inner"></div>
                </div>
                <button
                    className={`record-button ${isRecording ? "recording" : ""}`}
                    onClick={() => setIsRecording(!isRecording)}
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
                <button className="settings-button" onClick={() => console.log("Woopdi")}>
                    <SettingsIcon />
                </button>
            </div>
        </div>
    );
};

export default Recorder;
