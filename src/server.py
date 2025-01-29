from flask import Flask, request, jsonify
import speech_recognition as sr
from nltk.tokenize import sent_tokenize
from nltk.probability import FreqDist
from nltk.corpus import stopwords
import nltk
import os

app = Flask(__name__)

nltk.download('punkt')
nltk.download('stopwords')

def transcribe_audio(audio_file_path):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file_path) as source:
        audio = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio)
            return text
        except sr.UnknownValueError:
            return "Could not understand audio"
        except sr.RequestError:
            return "API unavailable"

def summarize_text(text, num_sentences=3):
    sentences = sent_tokenize(text)
    words = nltk.word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    words = [word for word in words if word.isalnum() and word not in stop_words]
    freq_dist = FreqDist(words)
    ranked_sentences = sorted(sentences, key=lambda x: sum(freq_dist[word] for word in nltk.word_tokenize(x)), reverse=True)
    return ' '.join(ranked_sentences[:num_sentences])

@app.route('/upload', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    audio_file_path = os.path.join('uploads', audio_file.filename)
    audio_file.save(audio_file_path)

    transcript = transcribe_audio(audio_file_path)
    summary = summarize_text(transcript)

    return jsonify({'transcript': transcript, 'summary': summary})

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True)