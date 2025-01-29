import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const App = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const { listening, startListening, stopListening } = useSpeechRecognition({
    onResult: (result) => setTranscript(result),
  });

  const handleFileUpload = (event) => {
    setAudioFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!audioFile) return;

    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setTranscript(response.data.transcript);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Doctor-Patient Conversation App</h1>

      <div>
        <h2>Record Conversation</h2>
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <button onClick={startListening} disabled={listening}>
          Start Recording
        </button>
        <button onClick={stopListening} disabled={!listening}>
          Stop Recording
        </button>
        <p>Transcript: {transcript}</p>
      </div>

      <div>
        <h2>Upload Audio File</h2>
        <input type="file" accept="audio/*" onChange={handleFileUpload} />
        <button onClick={handleUpload}>Upload and Transcribe</button>
      </div>

      <div>
        <h2>Transcript</h2>
        <p>{transcript}</p>
        <h2>Summary</h2>
        <p>{summary}</p>
      </div>
    </div>
  );
};

export default App;