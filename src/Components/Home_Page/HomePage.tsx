import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";
import { ReactComponent as PlayIcon } from './play-button-svgrepo-com.svg';
import { ReactComponent as PauseIcon } from './stop-button-svgrepo-com.svg';
import { ReactComponent as SunIcon } from './light-svgrepo-com.svg'; // Import Sun icon
import { ReactComponent as MoonIcon } from './moon-svgrepo-com.svg'; // Import Moon icon
import { ReactComponent as BellIcon } from './bell-svgrepo-com.svg'; // Import Bell icon
import { ReactComponent as SettingsIcon } from './setting-5-svgrepo-com.svg'; // Import Settings icon

const Recorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const discRef = useRef(null);
    const audioRef = useRef(new Audio());
    const analyserRef = useRef(null);
    const canvasRef = useRef(null);
    const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
    const [showNotification, setShowNotification] = useState(false); // State for notification

    useEffect(() => {
        // Apply dark mode class to body
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    useEffect(() => {
        if (isRecording) {
            discRef.current.classList.add("spin");
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
            discRef.current.classList.remove("spin");
            if (audioRef.current.srcObject) {
                const tracks = audioRef.current.srcObject.getAudioTracks();
                tracks.forEach(track => track.stop());
                audioRef.current.srcObject = null;
            }
            if (analyserRef.current) {
                analyserRef.current.disconnect();
                analyserRef.current = null;
            }
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, [isRecording]);

    const visualize = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            analyserRef.current.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] * 0.5;

                ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }

            requestAnimationFrame(draw);
        };

        draw();
    };

    const handleRecordClick = () => {
        setIsRecording(!isRecording);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleNotification = () => {
        setShowNotification(!showNotification);
    };

    return (
        <div className="recorder-container">
            <div className="top-right-buttons"> {/* Container for top right buttons */}
                <button className="dark-mode-button" onClick={toggleDarkMode}>
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
                    onClick={handleRecordClick}
                >
                    {isRecording ? <PauseIcon /> : <PlayIcon />}
                </button>
            </div>

            <div className="bottom-right-buttons"> {/* Container for bottom right buttons */}
                <button className="notification-button" onClick={toggleNotification}>
                    <BellIcon />
                </button>
            </div>

            <div className="bottom-left-buttons"> {/* Container for bottom left buttons */}
                <button className="settings-button" onClick={() => { /* Add your settings logic here */ }}>
                    <SettingsIcon />
                </button>
            </div>
        </div>
    );
};

export default Recorder;