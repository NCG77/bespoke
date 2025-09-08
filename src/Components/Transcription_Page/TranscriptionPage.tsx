import React from "react";
import "./TranscriptionPage.css";

interface TranscriptionPageProps {
  transcriptionText: string;
  language: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onGoBack: () => void;
}

const TranscriptionPage = ({
  transcriptionText,
  language,
  isDarkMode,
  onToggleDarkMode,
  onGoBack,
}: TranscriptionPageProps) => {
  const languageNames: { [key: string]: string } = {
    en: "English",
    hi: "Hindi",
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcriptionText);
  };

  return (
    <div className="transcription-page">
      <div className="transcription-container">
        <div className="transcription-header">
          <button className="back-button" onClick={onGoBack}>
            <span>← Back to Recorder</span>
          </button>

          <div className="header-center">
            <h1>Bespoke</h1>
            <p className="subtitle">Transcription</p>
          </div>

          <button className="dark-mode-toggle" onClick={onToggleDarkMode}>
            {isDarkMode ? (
              <img src="../assets/sun.svg" alt="Light mode" />
            ) : (
              <img src="../assets/moon.svg" alt="Dark mode" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="transcription-content">
          <div className="transcription-info">
            <span className="language-badge">
              {languageNames[language] || language}
            </span>
            <span className="word-count">
              {transcriptionText.split(" ").length} words
            </span>
          </div>

          <div className="transcription-text-container">
            <div className="transcription-text">{transcriptionText}</div>
          </div>

          <div className="transcription-actions">
            <button className="copy-button" onClick={copyToClipboard}>
              Copy Text
            </button>
            <button
              className="download-button"
              onClick={() => {
                const element = document.createElement("a");
                const file = new Blob([transcriptionText], {
                  type: "text/plain",
                });
                element.href = URL.createObjectURL(file);
                element.download = `transcription-${new Date().getTime()}.txt`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
            >
              Download as TXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionPage;
