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

## ✨ Complete Feature Set

### **Core Features**

| Feature | Implementation Details | Technologies Used |
|---------|----------------------|-------------------|
| 🏠 **Accommodation System** | 75+ authentic stays across 24 districts with advanced filtering by type, price, rating, and amenities. Interactive booking interface with detailed property information. | React, TypeScript, Supabase, Leaflet Maps |
| 🎨 **Cultural Marketplace** | 110+ handicrafts from local artisans with direct purchase options. Category filters (Dokra, Paitkar, Tribal Jewelry, etc.), price ranges, and artisan profiles. | React, Supabase, Image optimization |
| 🗺️ **Destination Discovery** | 100+ iconic sites organized by 9 categories (Waterfalls, Wildlife, Heritage, Religious, Hill Stations, Adventure, Tribal Culture, Urban, Natural Wonders). District-wise filtering and detailed information. | React Router, Leaflet, Image carousels |
| 🍽️ **Dining Guide** | Restaurant explorer with local cuisine recommendations, pricing, ratings, and location mapping. | Leaflet Maps, React components |
| 🌦️ **Smart Weather Dashboard** | Real-time weather updates for all 24 districts with safety indicators, temperature, humidity, wind speed, and UV index. | Weather API integration, Recharts |

### **AI-Powered Features** (All using Groq API)

| Feature | Implementation Details | Model Used |
|---------|----------------------|------------|
| 🤖 **AI Trip Planner** | Two modes: 1) **Form-based**: Select preferences (duration, budget, interests, areas) and get structured itinerary. 2) **Text-based**: Natural language input like "First visit Hundru Falls, then Ranchi, staying 3 days" generates custom itinerary respecting user's stated order. | llama-3.3-70b-versatile |
| 💬 **Floating Chatbot** | Real-time tourism assistance in multiple languages. Answers questions about destinations, accommodation, dining, culture, and emergencies. Context-aware responses. | llama-3.1-8b-instant |
| 📊 **Feedback Analysis** | AI-powered sentiment analysis of user reviews and feedback. Generates insights, trends, and recommendations for tourism improvements. | llama-3.3-70b-versatile |
| 🗣️ **Multilingual Chat** | Language-aware chatbot supporting 7 languages with automatic translation and culturally appropriate responses. | llama-3.1-8b-instant |

### **Immersive Technologies**

| Feature | Implementation Details | Technologies Used |
|---------|----------------------|-------------------|
| 🥽 **VR 360° Preview** | Immersive 360-degree virtual tours of destinations, hotels, restaurants, and marketplace items. Category-specific panoramas (Hundru Falls waterfall view, Tribal Heritage homestay rooms, bazaar scenes). A-Frame scenes with info points and interactive elements. | A-Frame 1.6.0, A-Frame Extras, WebVR |
| 📱 **AR Model Viewer** | Augmented reality preview of handicrafts and 3D models. Users can view products in their space using mobile AR. Category-themed 3D models from KhronosGroup glTF samples. | Model Viewer 3.3.0, AR.js, glTF/GLB |
| 🎯 **Dynamic AR/VR Content** | Content changes based on selected category: wildlife shows animals, marketplace shows crafts, hotels show room interiors. Jharkhand-specific theming and cultural elements. | Dynamic asset loading, CDN fallback |

### **User Experience Features**

| Feature | Implementation Details | Technologies Used |
|---------|----------------------|-------------------|
| 🌐 **Multi-language Support** | 7 languages: English, Hindi, Santali, Ho, Mundari, Kurukh, Kharia. Modular translation system with context-based switching. UI and content fully translated. | React Context API, localStorage, modular i18n files |
| 📄 **Itinerary Export** | Download trip plans as PDF with full details (activities, costs, meals, accommodation). Share via WhatsApp, email, or copy link. QR codes for easy sharing. | jsPDF, qrcode.react, Web Share API |
| 🔍 **Global Search** | Unified search across destinations, accommodation, marketplace, and restaurants. Fuzzy matching and category filtering. | React, custom search algorithms |
| 📍 **Interactive Maps** | Real-time maps for all locations with clustering, markers, and popups. Click to view details or get directions. | Leaflet, React Leaflet, custom map controls |
| 🎨 **Theme Toggle** | Dark/light mode with persistent preference. Smooth transitions and accessible color schemes. | TailwindCSS, React Context, localStorage |
| ⚡ **Quick Access Toolbar** | Floating toolbar with shortcuts to weather, emergency services, chatbot, and favorites. Always accessible. | Radix UI, Framer Motion |

### **Administrative Features**

| Feature | Implementation Details | Technologies Used |
|---------|----------------------|-------------------|
| 📊 **Analytics Dashboard** | Tourism officials can view visitor statistics, popular destinations, revenue insights, booking trends, and seasonal patterns. | Recharts, Supabase queries, React |
| 🏛️ **Official Dashboard** | Manage destinations, approve listings, respond to feedback, and track performance metrics. | React, Supabase, role-based access |
| 🔐 **Authentication** | Secure login/signup with email, Google OAuth, and role-based permissions. Session management. | Supabase Auth, OAuth 2.0 |

### **Performance & PWA**

| Feature | Implementation Details | Technologies Used |
|---------|----------------------|-------------------|
| ⚡ **Optimized Build** | Code splitting with manual chunks (React, Radix UI, A-Frame, Maps). Tree-shaking and minification. Build size: ~800KB gzipped. | Vite, Rollup, Terser |
| 📱 **Progressive Web App** | Full PWA with advanced service worker, offline support, install prompt, background sync, push notifications ready. Installable on all devices. Works offline with cached content. | Service Worker API, Web App Manifest, Cache API |
| 🚀 **Performance Metrics** | Lazy loading images, route-based code splitting, optimized re-renders with React.memo, debounced search. | React optimization, Vite HMR |

---

## 📱 Progressive Web App (PWA)

ROOTSnROUTES is a **fully functional Progressive Web App** that can be installed on any device!

### **PWA Features**

| Feature | Description |
|---------|-------------|
| 🔧 **Advanced Service Worker** | Intelligent caching strategies: Static cache (app shell), Dynamic cache (pages), Image cache, API cache with offline fallback |
| 📴 **Offline Support** | Works offline! Browse previously loaded destinations, itineraries, and marketplace. Custom offline page with connection status. |
| ⬇️ **Install Prompt** | Smart install banner appears after 30 seconds. One-click installation on home screen. |
| 🔔 **Push Notifications** | Infrastructure ready for trip reminders and booking updates (can be enabled). |
| 🔄 **Background Sync** | Syncs offline actions (bookings, itineraries) when connection is restored. |
| 🎨 **App Shortcuts** | Quick access to Explore, AI Planner, Marketplace, and Chatbot from home screen icon. |
| 🌐 **Offline Indicator** | Real-time connection status with beautiful alerts when going online/offline. |
| 📤 **Web Share API** | Share itineraries and destinations directly from the app. |

### **How to Install**

**On Mobile (Android/iOS)**:
1. Visit the website in your browser
2. Look for "Add to Home Screen" or "Install App"
3. Tap Install
4. App appears on your home screen!

**On Desktop (Chrome/Edge)**:
1. Visit the website
2. Click the install icon (⊕) in address bar
3. Click Install
4. App opens in its own window!

For detailed PWA setup and testing, see [PWA_GUIDE.md](PWA_GUIDE.md)

---

## 🛠 Complete Tech Stack

### **Frontend Framework**
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | Core UI framework with hooks |
| TypeScript | 5.6.2 | Type-safe development |
| Vite | 5.4.21 | Build tool with HMR |

### **UI & Styling**
| Technology | Version | Purpose |
|------------|---------|---------|
| TailwindCSS | 3.4.17 | Utility-first CSS framework |
| shadcn/ui | Latest | Pre-built accessible components |
| Radix UI | Latest | Headless UI primitives |
| Framer Motion | 11.15.0 | Animations & transitions |
| Lucide React | 0.468.0 | Icon library |

### **AI & Machine Learning**
| Technology | Version | Purpose |
|------------|---------|---------|
| Groq SDK | 0.8.2 | AI chat completions |
| Models Used | - | llama-3.3-70b-versatile, llama-3.1-8b-instant |
| Implementation | - | Trip planning, chatbot, feedback analysis |

### **3D/AR/VR Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| A-Frame | 1.6.0 | WebVR framework for 360° experiences |
| A-Frame Extras | 7.7.0 | Enhanced VR controls |
| Model Viewer | 3.3.0 | AR model display component |
| AR.js | Latest | Augmented reality features |

### **Maps & Location**
| Technology | Version | Purpose |
|------------|---------|---------|
| Leaflet | 1.9.4 | Interactive maps |
| React Leaflet | 4.2.1 | React bindings for Leaflet |

### **Backend & Database**
| Technology | Version | Purpose |
|------------|---------|---------|
| Supabase | 2.49.2 | PostgreSQL database + auth |
| Supabase Auth UI | 0.4.7 | Pre-built auth components |

### **Routing & State**
| Technology | Version | Purpose |
|------------|---------|---------|
| React Router | 6.30.1 | Client-side routing |
| React Context API | - | Global state management |
| localStorage | - | Client-side persistence |

### **Data Visualization**
| Technology | Version | Purpose |
|------------|---------|---------|
| Recharts | 2.15.0 | Charts for analytics dashboard |

### **Utilities**
| Technology | Version | Purpose |
|------------|---------|---------|
| date-fns | 4.1.0 | Date formatting |
| qrcode.react | 4.1.0 | QR code generation |
| jsPDF | 2.5.2 | PDF export for itineraries |

### **Development Tools**
| Technology | Version | Purpose |
|------------|---------|---------|
| ESLint | 9.17.0 | Code linting |
| TypeScript ESLint | 8.18.2 | TS-specific linting |
| PostCSS | 8.4.49 | CSS processing |
| Autoprefixer | 10.4.20 | CSS vendor prefixes |

### **Build Optimization**
- **Code Splitting**: Manual chunks for vendor libraries (React, Radix, A-Frame)
- **Minification**: Terser for production builds
- **Service Worker**: PWA capabilities with offline support
- **Asset Optimization**: Image lazy loading, video optimization

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

## 🏗️ Architecture & Implementation

### **Project Structure**
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── explore/        # AR/VR components
│   ├── AITripPlanner.tsx      # Form-based & text-based trip planning
│   ├── FloatingChatbot.tsx    # AI-powered chat assistant
│   └── ...
├── pages/              # Route-level pages
│   ├── Accommodation.tsx
│   ├── Marketplace.tsx
│   ├── Destinations.tsx
│   ├── FeedbackAnalysis.tsx
│   └── ...
├── contexts/           # React Context providers
│   ├── AuthContext.tsx
│   ├── LanguageContext.tsx
│   └── ThemeContext.tsx
├── services/           # API integration services
│   ├── aiItineraryService.ts
│   ├── weatherService.ts
│   └── supabaseClient.ts
├── data/               # Static data & constants
│   ├── completeDestinations.ts
│   ├── jharkhandAreas.ts
│   └── translations/
└── utils/              # Helper functions
```

### **AI Integration Details**

**All AI features use Groq API exclusively - no hardcoded scripts or responses.**

1. **AI Trip Planner** (`AITripPlanner.tsx`):
   - **Form-based Mode**: 
     - User selects duration, budget, interests, areas
     - Generates structured prompt for Groq API
     - Returns day-by-day itinerary with activities, meals, accommodation
   - **Text-based Mode**: 
     - Natural language input: "First visit Hundru Falls for 2 days, then Ranchi city, budget ₹15,000"
     - AI parses location names, sequence, duration, budget from freeform text
     - Generates itinerary respecting user's stated order
   - Model: `llama-3.3-70b-versatile`
   - Max tokens: 4096
   - Temperature: 0.7

2. **Floating Chatbot** (`FloatingChatbot.tsx`):
   - Persistent chat interface with localStorage
   - Context-aware responses about Jharkhand tourism
   - Handles: destinations, accommodation, dining, culture, emergencies
   - Model: `llama-3.1-8b-instant`
   - Max tokens: 1000
   - Temperature: 0.7

3. **Feedback Analysis** (`FeedbackAnalysis.tsx`):
   - Analyzes user reviews and feedback
   - Generates sentiment scores and insights
   - Provides actionable recommendations
   - Model: `llama-3.3-70b-versatile`

### **AR/VR Implementation**

**A-Frame Integration** (`explore/ExploreARVRSimple.tsx`):
- CDN loading with package fallback for reliability
- Production fix: Removed A-Frame from Vite's `external` array to enable bundling
- Dynamic panorama loading based on category selection
- Category-specific 3D models (Fox.glb for wildlife, Lantern.glb for crafts)
- VR scene enhancements: info spheres, themed ground colors, description panels

**Model Viewer Setup** (`index.html`):
- Global script tag for model-viewer web component
- AR capability detection for mobile devices
- glTF/GLB model support from KhronosGroup samples

### **Database Schema** (Supabase)

Tables:
- `users` - User profiles and authentication
- `accommodations` - Hotels, homestays, eco-lodges
- `destinations` - Tourist attractions
- `marketplace_items` - Handicrafts and products
- `restaurants` - Dining options
- `bookings` - Reservation records
- `reviews` - User feedback
- `itineraries` - Saved trip plans

### **API Integration**

| Service | Purpose | Configuration |
|---------|---------|--------------|
| Groq API | AI chat completions | `VITE_GROQ_API_KEY` |
| Supabase | Database & Auth | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| Weather API | Real-time weather | `VITE_WEATHER_API_KEY` |
| Google OAuth | Social authentication | Configured in Supabase dashboard |

### **Build Configuration** (`vite.config.ts`)

**Key Optimizations**:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'ui-vendor': ['@radix-ui/react-*'],
        'aframe-vendor': ['aframe', 'aframe-extras'],
        'maps-vendor': ['leaflet', 'react-leaflet']
      }
    }
  },
  terser: {
    compress: {
      drop_console: false  // Keep console logs for AR/VR debugging
    }
  }
}
```

**Dependency Pre-bundling**:
- A-Frame and AR libraries included (not externalized)
- Optimized for production deployment on Vercel

## ✅ Production-Ready Status

ROOTSnROUTES is a **complete, fully-functional platform** with:
- ✅ All core features implemented
- ✅ AI integration via Groq (no hardcoded responses)
- ✅ AR/VR working in production (Vercel)
- ✅ Multi-language support (7 languages)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ PWA capabilities
- ✅ Optimized build (~800KB gzipped)
- ✅ Comprehensive error handling
- ✅ Accessible UI (WCAG compliant)

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

Create a `.env` file in the root directory:

```env
# Groq API (Required for AI features)
# Get your key from: https://console.groq.com/
VITE_GROQ_API_KEY=gsk_your_actual_groq_api_key_here

# Supabase (Required for database & auth)
# Get credentials from: https://supabase.com/dashboard
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Weather API (Optional - for weather dashboard)
# Get key from: https://openweathermap.org/api
VITE_WEATHER_API_KEY=your_weather_api_key_here

# Google OAuth (Optional - configured in Supabase)
# Setup guide in GOOGLE_OAUTH_SETUP.md
```

**Getting API Keys**:

1. **Groq API** (Free tier available):
   - Sign up at https://console.groq.com/
   - Navigate to API Keys section
   - Create new key and copy it
   - Used for: AI Trip Planner, Chatbot, Feedback Analysis

2. **Supabase** (Free tier available):
   - Create project at https://supabase.com/dashboard
   - Go to Project Settings > API
   - Copy Project URL and anon/public key
   - Used for: Database, Authentication, File Storage

3. **Weather API** (Free tier available):
   - Sign up at https://openweathermap.org/api
   - Get API key from your account
   - Used for: Real-time weather dashboard

See `.env.example` for complete configuration details.

---

## 🤖 AI Implementation - Groq API (No Hardcoded Scripts)

**Important**: All AI features use **Groq API dynamically** - there are no hardcoded scripts or fallback responses for production use.

### **Why Groq?**
- **Fast inference**: LLaMA models with sub-second response times
- **Cost-effective**: Free tier with generous limits
- **Reliable**: 99.9% uptime SLA
- **Latest models**: llama-3.3-70b-versatile and llama-3.1-8b-instant

### **AI Services Using Groq**

| Component | File | Model | Purpose |
|-----------|------|-------|---------|
| AI Trip Planner (Form) | `AITripPlanner.tsx` | llama-3.3-70b-versatile | Generate structured itineraries from preferences |
| AI Trip Planner (Text) | `AITripPlanner.tsx` | llama-3.3-70b-versatile | Parse natural language trip descriptions |
| Floating Chatbot | `FloatingChatbot.tsx` | llama-3.1-8b-instant | Real-time tourism assistance |
| AI Chatbot | `AIChatbot.tsx` | llama-3.1-8b-instant | Context-aware travel recommendations |
| Feedback Analysis | `FeedbackAnalysis.tsx` | llama-3.3-70b-versatile | Sentiment analysis and insights |
| Itinerary Service | `aiItineraryService.ts` | llama-3.3-70b-versatile | Backend itinerary generation |

### **Implementation Pattern**

All AI services follow this pattern:

```typescript
import Groq from 'groq-sdk';

const generateResponse = async () => {
  // 1. Get API key from environment
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  // 2. Initialize Groq client
  const groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true  // Client-side usage
  });
  
  // 3. Create chat completion
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are an expert travel assistant for Jharkhand tourism...'
      },
      {
        role: 'user',
        content: userInput
      }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 4096
  });
  
  // 4. Parse and use response
  const response = chatCompletion.choices[0]?.message?.content;
  return JSON.parse(response);
};
```

### **No Fallback Scripts**

- **Development**: If API key is missing, user is prompted to configure it
- **Production**: Requires valid Groq API key in Vercel environment variables
- **No hardcoded data**: All responses are generated in real-time by AI
- **No mock responses**: System gracefully handles API errors with user feedback

### **API Usage Monitoring**

Track your Groq API usage at: https://console.groq.com/usage

---

## 🔐 Security Notes

⚠️ **Important**: Never commit the `.env` file to version control. All secret keys are gitignored and should only be stored in:
- Local `.env` file (development)
- Vercel environment variables (production)
- Supabase dashboard (OAuth configuration)

For Google OAuth setup, see `GOOGLE_OAUTH_SETUP.md`

---

## 🚀 Deployment Guide

### **Vercel Deployment** (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/
   - Import your GitHub repository
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables** in Vercel:
   - Go to Project Settings > Environment Variables
   - Add all variables from your `.env` file:
     - `VITE_GROQ_API_KEY`
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_WEATHER_API_KEY`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy
   - Your site will be live at `https://your-project.vercel.app`

### **Vercel Configuration** (`vercel.json`)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### **Build Scripts**

```json
{
  "scripts": {
    "dev": "vite --port 8080",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

### **Production Checklist**

- ✅ All environment variables set in Vercel
- ✅ Supabase production database configured
- ✅ Google OAuth redirect URLs updated
- ✅ API keys have sufficient rate limits
- ✅ Analytics tracking enabled (if applicable)
- ✅ Error monitoring setup (Sentry, LogRocket, etc.)
- ✅ Domain configured (optional)

---

## 📊 Performance Metrics

### **Build Size** (Production)
- Total Bundle: ~800KB gzipped
- Initial Load: ~250KB
- React Vendor: ~140KB
- UI Vendor: ~180KB
- A-Frame Vendor: ~120KB
- Maps Vendor: ~80KB

### **Lighthouse Scores** (Target)
- 🟢 Performance: 90+
- 🟢 Accessibility: 95+
- 🟢 Best Practices: 95+
- 🟢 SEO: 100

### **Load Times**
- First Contentful Paint: <1.5s
- Time to Interactive: <3.5s
- Largest Contentful Paint: <2.5s

---

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type check
npm run type-check

# Build for production (tests build process)
npm run build

# Preview production build locally
npm run preview
```

---

## 📝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

This project is intended for educational and demonstration purposes, showcasing digital tourism solutions for Jharkhand.

---

## 🙏 Acknowledgments

- **Jharkhand Tourism Department** for inspiration and data
- **Groq** for providing fast AI inference
- **Supabase** for backend infrastructure
- **A-Frame** community for VR/AR resources
- **shadcn/ui** for beautiful component library
- **Vercel** for seamless deployment

---

## 📞 Support & Contact

- **Live Demo**: https://rootsnroutes-sigma.vercel.app
- **GitHub Issues**: Report bugs or request features
- **Team Lead**: Yash Raj

---

<p align="center">Made with ❤️ for Jharkhand Tourism</p>
