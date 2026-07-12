# Offside AI ⚽️🧠

Offside AI is a premium, AI-powered football companion app built with React Native (Expo) and FastAPI. It offers live match statistics, tactical analysis, Fantasy Premier League (FPL) advice, the latest football news, and direct links to live streams. 

At the core of Offside AI is **Coach AI**, an elite intelligent assistant powered by Cohere's latest models (Command A+), capable of dissecting match data, explaining complex rules to a 10-year-old, predicting match outcomes, and offering deep tactical insights.

---

## 🌟 Features

- **Live Matches & Stats**: Get real-time scores, lineups, and deep statistical data powered by API-Football.
- **Coach AI**: A conversational AI assistant strictly trained on football. Ask about tactics, player stats, or FPL advice.
- **Automated Tactical Insights**: Instantly generate professional pundit-level bullet points explaining why a match is unfolding the way it is.
- **Live Streams**: Direct deep links to popular external football streaming platforms.
- **Latest News**: Stay updated with the latest headlines parsed directly from the BBC Football RSS feed.
- **Premium Dark UI**: A sleek, glassmorphism-inspired dark mode interface tailored for modern football fans.

---

## 🛠 Tech Stack

### Frontend (Mobile App)
- **Framework**: React Native with Expo (Expo Router for navigation)
- **Styling**: Vanilla StyleSheet with custom Glassmorphism components (`react-native-reanimated` for micro-animations)
- **Image Handling**: `expo-image` for highly performant, cached league and team logos

### Backend (API Proxy & AI)
- **Framework**: FastAPI (Python)
- **AI Engine**: Cohere (`command-a-plus-05-2026`) via `langchain-cohere`
- **External APIs**: API-Football, TheSportsDB, FPL API

---

## 🚀 Getting Started

### 1. Backend Setup

The backend handles API key security and constructs LangChain AI prompts.

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file based on the config
# Ensure you provide COHERE_API_KEY and API_FOOTBALL_KEY
touch .env

# Run the FastAPI server locally
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

The mobile app connects to the FastAPI backend.

```bash
# Return to the root directory
cd ..

# Install dependencies
npm install

# Start the Expo development server
npx expo start --clear
```
*Note: Ensure your local environment variables in the frontend point to `http://localhost:8000` if you are testing on a simulator.*

---

## 📦 Building for Production

Offside AI is configured to use EAS (Expo Application Services) for seamless Android APK and iOS production builds.

To build an Android APK (for direct install):
```bash
eas build -p android --profile preview
```

To build an Android App Bundle (AAB) for the Google Play Store:
```bash
eas build -p android --profile production
```

---

## 🛡 AI Guardrails

Coach AI is strictly bound by system-level guardrails. It will actively decline to answer any questions outside the scope of football (e.g., coding, politics, or general knowledge) to maintain its persona as an elite tactical analyst.
