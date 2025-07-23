# Bespoke

**Bespoke** is an intelligent voice recording and note-taking application that automatically transcribes your audio recordings and creates summarized notes. Perfect for meetings, lectures, interviews, or personal voice memos.

## Features

- **Voice Recording**: High-quality audio recording with visual feedback
- **AI Transcription**: Powered by AssemblyAI for accurate speech-to-text conversion
- **Smart Summarization**: AI-powered note generation using Groq's LLaMA model
- **Multi-language Support**: Supports English and Hindi transcription
- **Dark/Light Mode**: Toggle between dark and light themes
- **Email Integration**: Automatically send notes to your registered email
- **Notification Control**: Toggle email notifications on/off

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- AssemblyAI API key
- AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NCG77/bespoke.git
   cd bespoke
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add:
   ```env
   # Firebase Configuration
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

   # API Keys
   REACT_APP_ASSEMBLYAI_API_KEY=your_assemblyai_api_key
   REACT_APP_API_KEY=your_ai_api_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Technologies Used

- **Frontend**: React 19, TypeScript, CSS3
- **Authentication**: Firebase Auth
- **Speech-to-Text**: AssemblyAI API
- **AI Summarization**: Groq API (LLaMA 3)
- **Routing**: React Router DOM
- **Icons**: Custom SVG components
- **Animations**: CSS animations and transitions

## 📋 How It Works

1. **Sign Up/Login**: Create an account or log in with existing credentials
2. **Record Audio**: Click the record button to start capturing audio
3. **Automatic Processing**: 
   - Audio is automatically uploaded to AssemblyAI for transcription
   - Transcript is sent to Groq's AI for intelligent summarization
4. **Receive Notes**: Summarized notes are sent to your registered email (if notifications are enabled)
5. **Language Support**: Choose between English and Hindi for transcription

## Configuration

### Language Settings
- Access language settings via the settings button
- Currently supports English and Hindi
- Language preference is applied to transcription

### Theme Toggle
- Use the sun/moon icon to switch between light and dark modes
- Theme preference persists across sessions

### Notifications
- Use the bell icon to toggle email notifications
- When enabled, summarized notes are automatically sent to your email

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Thank You
