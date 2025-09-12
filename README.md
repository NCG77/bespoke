# Bespoke

**Bespoke** is an intelligent voice recording and note-taking application that automatically transcribes your audio recordings and creates Textual form of the audio for further processing. Perfect for meetings, lectures or interviews. I made it as usually while discussing ideas and thoughts with friends or colleagues, I miss out on some important points or people miss out on joining the meetings or are late. With Bespoke, i can focus on the conversation while it captures everything for me and i can share the transcribe after the meeting in groups, make notes, give contexts to ai agents for further processing.

## Features

- **Voice Recording**: High-quality audio recording with visual feedback
- **AI Transcription**: Powered by AssemblyAI for accurate speech-to-text conversion
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

## Browser Requirements & Limitations

- For system audio recording, use **Google Chrome** or **Microsoft Edge**.
- On Chrome/Edge, you must select a tab or entire screen and check "Share audio" in the browser dialog.
- **Firefox and Safari do NOT support system audio recording via getDisplayMedia.**
- On macOS, system audio capture is not supported by browsers due to OS restrictions.
- If you do not see the "Share audio" option, switch to Chrome/Edge and try again.

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
- **Routing**: React Router DOM
- **Icons**: Custom SVG components
- **Animations**: CSS animations and transitions

## 📋 How It Works

1. **Sign Up/Login**: Create an account or log in with existing credentials
2. **Record Audio**: Click the record button to start capturing audio
3. **Automatic Processing**: Audio is automatically uploaded to AssemblyAI for transcription
4. **Language Support**: Choose between English and Hindi for transcription

## Configuration

### Language Settings
- Access language settings via the settings button
- Currently supports English and Hindi
- Language preference is applied to transcription

### Theme Toggle
- Use the sun/moon icon to switch between light and dark modes
- Theme preference persists across sessions

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
