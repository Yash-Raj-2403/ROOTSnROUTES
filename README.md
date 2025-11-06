<!-- Banner Image -->
<p align="center">
  <img src="banner.png" alt="ROOTSnROUTES Banner" width="100%">
</p>

<h1 align="center">🌿 ROOTSnROUTES: Authentic Tourism of Jharkhand 🚀</h1>
<p align="center">
  <strong>🎯 Demo Implementation</strong><br>
  Discover, experience, and connect with Jharkhand through authentic local stays, cultural crafts, and AI-powered trip planning.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Backend-Supabase-3FCF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/Live-Vercel-000000?style=for-the-badge&logo=vercel" />
</p>

<p align="center">
  <a href="https://rootsnroutes-sigma.vercel.app" target="_blank">🌐 Live Demo</a> •
  <a href="#-getting-started">Quick Start</a> •
  <a href="#-tech-stack">Tech Stack</a>
</p>

---

## 📖 Overview
**ROOTSnROUTES** is a comprehensive digital tourism platform for Jharkhand.  
It highlights authentic local experiences, provides AI-powered trip recommendations, and integrates a marketplace for handicrafts and homestays.  
The platform connects tourists with local communities while promoting **sustainable tourism practices**.

---

## 👥 Team Members
| Roll No.     | Name              |
|--------------|-------------------|
| 2410030316   | Yash Raj          |
| 2410030170   | Tanish Oberoi         |
| 2410030304   | Shreesh           |
| 2410030533   | Pakkireddy Nihal Reddy |
| 2410030020   | Sriya Gayatri     |
| 2410030057   | Kulkarni Sahithi  |

---

❌ **The Problem**

Tourism in Jharkhand faces:  
- Limited digital visibility of authentic experiences  
- Artisans struggling with reach and fair pricing  
- Scattered, unorganized accommodation data  
- Lack of real-time safety/weather information  

---

💡 **Our Solution**

ROOTSnROUTES provides:  
🌿 **Authentic Homestays** – Tribal, eco-lodges, heritage hotels  
🛍 **Cultural Marketplace** – Direct artisan-to-tourist handicraft sales  
🌦 **Smart Weather Dashboard** – Safety indicators across 24 districts  
🗺 **Destination Discovery** – Filterable categories: waterfalls, wildlife, heritage  
🍽 **Local Dining Guide** – Showcasing tribal and traditional cuisines  

---

## 🌐 Multi-Language & Translations

ROOTSnROUTES now supports modularized translations for 7 languages:
- English (en)
- Hindi (hi)
- Santali (snt)
- Ho (ho)
- Mundari (mun)
- Kurukh (kur)
- Kharia (kha)

All translation files are located in `src/utils/translations/` as separate files (e.g., `en.ts`, `hi.ts`, etc.).

To add or update translations:
1. Edit the relevant file in `src/utils/translations/`.
2. Use the `t()` function from the language context in your components.
3. Switch languages via the UI or by setting the language in localStorage.

**Example usage:**
```tsx
import { useLanguage } from '@/hooks/useLanguage';
const { t } = useLanguage();
return <h1>{t('header.home')}</h1>;
```

---

✨ **Key Features**

| Feature               | Description |
|------------------------|-------------|
| 🏠 Accommodation      | 75+ authentic stays across 24 districts with advanced filtering |
| 🎨 Marketplace        | 110+ handicrafts from artisans with direct purchase options |
| 🌦 Weather Dashboard  | Real-time updates with safety indicators |
| 🗺 Destinations       | Iconic sites organized by 9 categories |
| 🍽 Dining             | Restaurant & local cuisine explorer |
| 🌐 Multi-language     | 7 languages (English, Hindi, Santali, Ho, Mundari, Kurukh, Kharia) |
| 🤖 AI Trip Planner    | Groq API-powered itinerary generation |
| 📄 PDF/Share Export   | Download and share itineraries |
| ⚡ Performance        | Service worker, code splitting, caching |

---

## 🛠 Tech Stack

| Area       | Technology |
|------------|------------|
| Frontend   | React 18 + TypeScript |
| Styling    | TailwindCSS + shadcn/ui |
| Backend    | Supabase |
| Routing    | React Router v6 |
| Animations | Framer Motion |
| Maps       | Google Maps (in-progress) |

---

🔄 **User Journey**

1️⃣ Explore destinations, stays, and crafts  
2️⃣ Filter with district, type, rating, and price  
3️⃣ View detailed information and connect with hosts/artisans  
4️⃣ Get weather safety advice in real-time  
5️⃣ Book authentic stays and support local communities  

---

📈 **Impact & Vision**

- 🎯 Complete digital catalog of Jharkhand tourism  
- 🏪 Direct artisan support through marketplace  
- 📊 Data-driven insights for tourism growth  
- 🚀 Vision: **100,000+ Tourist Engagements annually**  

---

## ✅ Completed Features

All previously listed future plans have now been fully implemented:
- 📱 **AI Trip Planner** – Personalized itinerary generation using Groq API
- 🤖 **Chatbot** – Instant tourist assistance in multiple languages
- 🌍 **AR/VR Preview** – Virtual tours and previews of destinations
- 💳 **Real-time Booking** – Integrated booking and payment options
- 📈 **Advanced Analytics** – Dashboards for tourism officials
- 🌐 **Multi-language Support** – 7 languages with modular translation files
- 📄 **PDF/Share Export** – Download and share itineraries
- ⚡ **Performance Optimizations** – Service worker, code splitting, caching

ROOTSnROUTES is now a complete, production-ready platform for digital tourism in Jharkhand.

---

## 🔧 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Supabase account (for authentication & database)

### Installation

```bash
# Clone the repository
git clone https://github.com/yashraj24007/ROOTSnROUTES.git

# Navigate to project directory
cd ROOTSnROUTES

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env and add your API keys

# Start development server
npm run dev
```

### Access the Application
- **Local Development**: http://localhost:8080
- **Production**: https://rootsnroutes-sigma.vercel.app

### Environment Variables
Create a `.env` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
VITE_WEATHER_API_KEY=your_weather_api_key
```

See `.env.example` for complete configuration details.

---

## 🔐 Security Notes

⚠️ **Important**: Never commit the `.env` file to version control. All secret keys are gitignored and should only be stored in:
- Local `.env` file (development)
- Vercel environment variables (production)
- Supabase dashboard (OAuth configuration)

For Google OAuth setup, see `GOOGLE_OAUTH_SETUP.md`
