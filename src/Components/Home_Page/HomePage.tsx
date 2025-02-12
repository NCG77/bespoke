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
    const discRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef(new Audio());
    const analyserRef = useRef<AnalyserNode | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showNotification, setShowNotification] = useState(false);

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
                })
                .catch(err => console.error("Error accessing microphone:", err));
        } else {
            discRef.current?.classList.remove("spin");
            const tracks = audioRef.current.srcObject?.getAudioTracks();
            tracks?.forEach(track => track.stop());
            audioRef.current.srcObject = null;
            analyserRef.current?.disconnect();
            analyserRef.current = null;

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

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] * 0.5;
                ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
            requestAnimationFrame(draw);
        };
        draw();
    };

    return (
        <div className="recorder-container">
            <div className="top-left-text">
                <h1>Bespoke</h1>
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
                <button className="settings-button">
                    <SettingsIcon />
                </button>
            </div>
        </div>
    );
};

export default Recorder;
