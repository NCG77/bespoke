// TranscriptionPage.js
import React, { useState } from "react";
import {
  Sun,
  Moon,
  ArrowLeft,
  Copy,
  Download,
  Check,
  FileText,
  Clock,
  Globe,
} from "lucide-react";
import "./TranscriptionPage.css";

const TranscriptionPage = ({
  transcriptionText = "",
  language = "en",
  isDarkMode = false,
  onToggleDarkMode = () => {},
  onGoBack = () => {},
}) => {
  const [copied, setCopied] = useState(false);

  const languageNames = {
    en: "English",
    hi: "Hindi",
    es: "Spanish",
    fr: "French",
    de: "German",
  };

  const safeText =
    typeof transcriptionText === "string" ? transcriptionText : "";
  const wordCount = safeText
    ? safeText.split(/\s+/).filter((word) => word.length > 0).length
    : 0;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(safeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const downloadTranscription = () => {
    const element = document.createElement("a");
    const file = new Blob([safeText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `transcription-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const themeClass = isDarkMode ? "dark" : "light";

  return (
    <div className={`transcription-page ${themeClass}`}>
      {/* Header */}
      <div className={`transcription-header ${themeClass}`}>
        <div className="header-container">
          <div className="header-content">
            <button onClick={onGoBack} className={`back-button ${themeClass}`}>
              <ArrowLeft size={16} />
              Back
            </button>

            <div className="title-section">
              <div className="title-container">
                <h1 className={`main-title ${themeClass}`}>Bespoke</h1>
                <p className={`subtitle ${themeClass}`}>Transcription</p>
              </div>
            </div>

            <button
              onClick={onToggleDarkMode}
              className={`dark-mode-toggle ${themeClass}`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Stats Bar */}
        <div className={`stats-bar ${themeClass}`}>
          <div className="stats-content">
            <div className="stats-left">
              <div className="stat-item">
                <Globe size={16} className={`icon-blue ${themeClass}`} />
                <span className={`language-badge ${themeClass}`}>
                  {languageNames[language] || language}
                </span>
              </div>

              <div className="stat-item">
                <FileText size={16} className={`icon-green ${themeClass}`} />
                <span className={`stat-text ${themeClass}`}>
                  {wordCount.toLocaleString()} words
                </span>
              </div>

              <div className="stat-item">
                <Clock size={16} className={`icon-purple ${themeClass}`} />
                <span className={`stat-text ${themeClass}`}>
                  {Math.ceil(wordCount / 200)} min read
                </span>
              </div>
            </div>

            <div className="action-buttons">
              <button
                onClick={copyToClipboard}
                disabled={!safeText}
                className={`action-button copy-button ${themeClass} ${
                  copied ? "copied" : ""
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </button>

              <button
                onClick={downloadTranscription}
                disabled={!safeText}
                className={`action-button download-button ${themeClass}`}
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Transcription Content */}
        <div className={`content-card ${themeClass}`}>
          <div className={`content-header ${themeClass}`}>
            <h2 className={`content-title ${themeClass}`}>Transcription</h2>
          </div>

          <div className="content-body">
            {safeText ? (
              <p className={`transcription-text ${themeClass}`}>{safeText}</p>
            ) : (
              <div className="empty-state">
                <div className={`empty-state-icon ${themeClass}`}>
                  <FileText size={24} />
                </div>
                <h3 className={`empty-state-title ${themeClass}`}>
                  No transcription available
                </h3>
                <p className={`empty-state-description ${themeClass}`}>
                  Upload an audio file to see the transcription here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionPage;
