import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { useToast } from './ui/use-toast';
import { Calendar, Clock, MapPin, Users, Sparkles, Download, Share, Loader2, Cloud, CloudRain, Sun, Wind, Umbrella, AlertTriangle, Droplets } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import Groq from 'groq-sdk';
import { weatherService } from '@/services/weatherService';
import { sanitizeInput, validateApiKey, apiRateLimiter } from '@/utils/security';
import { useBookingProtection } from '@/hooks/useBookingProtection';
import type { WeatherData, WeatherForecast, WeatherSafety } from '@/services/weatherService';

interface TripPreferences {
  duration: string;
  budget: string;
  interests: string[];
  groupSize: string;
  travelStyle: string;
  accommodation: string;
  specialRequests: string;
  targetAreas: string[];
  areaFocus: 'single' | 'multiple' | 'circuit';
  travelRadius: string;
  startDate?: string; // New: For weather-based planning
}

interface ItineraryDay {
  day: number;
  title: string;
  activities: Array<{
    time: string;
    activity: string;
    location: string;
    description: string;
    duration?: string;
    cost: string;
    type: string;
    weatherNote?: string; // New: Weather-based reasoning for this activity
    travelToNext?: {
      mode: string;
      duration: string;
      distance: string;
      route: string;
      cost: string;
    };
  }>;
  meals: Array<{
    time: string;
    type?: string;
    restaurant: string;
    cuisine: string;
    specialties?: string[];
    cost: string;
  }>;
  accommodation: {
    name: string;
    type: string;
    location: string;
    checkIn?: string;
    checkOut?: string;
    amenities?: string[];
    cost: string;
  };
  totalDayCost: string;
  dayStartLocation?: string;
  dayEndLocation?: string;
  totalTravelTime?: string;
  totalDistance?: string;
}

interface GeneratedItinerary {
  title: string;
  description: string;
  totalCost: string;
  days: ItineraryDay[];
  recommendations: string[];
  weatherTips: string[];
  culturalTips: string[];
  weatherBasedRecommendations?: string[]; // New: Weather-specific recommendations
  weatherForecast?: WeatherForecast; // New: Include weather forecast
  safetyAnalysis?: WeatherSafety; // New: Safety analysis
}

const AITripPlanner = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { handleProtectedBooking } = useBookingProtection({
    customAuthMessage: {
      title: "Sign In to Book Accommodations",
      description: "Please sign in to proceed with booking your selected accommodations from the itinerary."
    }
  });
  const [step, setStep] = useState(1);
  const [stepTransitioning, setStepTransitioning] = useState(false);
  const [plannerMode, setPlannerMode] = useState<'simple' | 'detailed'>('simple'); // New: Toggle between modes

  // Helper function to smoothly transition between steps
  const goToStep = (newStep: number) => {
    setStepTransitioning(true);
    
    // Short delay to show transition
    setTimeout(() => {
      setStep(newStep);
      setStepTransitioning(false);
      
      // Scroll to top of the trip planner section smoothly
      setTimeout(() => {
        const element = document.querySelector('.ai-trip-planner-container') || 
                       document.querySelector('main') || 
                       document.body;
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }, 150);
  };
  const [simpleTextInput, setSimpleTextInput] = useState(''); // New: For simple text-based planning
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]); // New: Selected districts
  const [travelOrder, setTravelOrder] = useState<'flexible' | 'specific'>('specific'); // New: Travel pattern (default to sequential)
  const [startingPoint, setStartingPoint] = useState(''); // New: Starting district
  
  const [preferences, setPreferences] = useState<TripPreferences>({
    duration: '',
    budget: '',
    interests: [],
    groupSize: '',
    travelStyle: '',
    accommodation: '',
    specialRequests: '',
    targetAreas: [],
    areaFocus: 'multiple',
    travelRadius: 'flexible',
    startDate: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<GeneratedItinerary | null>(null);
  
  // New: Weather-related state
  const [weatherData, setWeatherData] = useState<WeatherForecast | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string>('');

  // Cache for API responses
  const itineraryCache = useMemo(() => new Map<string, GeneratedItinerary>(), []);

  // Fetch weather data when start date and areas are selected
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!preferences.startDate || preferences.targetAreas.length === 0) {
        setWeatherData(null);
        return;
      }

      setIsLoadingWeather(true);
      setWeatherError('');

      try {
        // Get the primary destination (first selected area or district)
        const primaryLocation = selectedDistricts.length > 0 
          ? selectedDistricts[0] 
          : preferences.targetAreas[0].split(' ')[0]; // Extract district name from area

        const duration = parseInt(preferences.duration) || 5;
        const forecast = await weatherService.getWeatherForecast(primaryLocation, duration);

        if (forecast) {
          setWeatherData(forecast);
          
          // Analyze weather safety
          if (forecast.daily.length > 0) {
            const avgTemp = forecast.daily.reduce((sum, day) => sum + day.temperature, 0) / forecast.daily.length;
            const hasRain = forecast.daily.some(day => day.condition.toLowerCase().includes('rain'));
            
            if (hasRain) {
              toast({
                title: "Weather Alert",
                description: `Rain expected during your trip to ${primaryLocation}. Pack accordingly!`,
                duration: 5000
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
        setWeatherError('Could not fetch weather data. Continuing without weather information.');
      } finally {
        setIsLoadingWeather(false);
      }
    };

    fetchWeatherData();
  }, [preferences.startDate, preferences.targetAreas, selectedDistricts, toast]);

  const interestOptions = [
    'Tribal Culture', 'Waterfalls', 'Wildlife', 'Temples', 'Handicrafts', 
    'Adventure Sports', 'Nature Photography', 'Eco-Tourism', 'Heritage Sites', 
    'Local Cuisine', 'Festivals', 'Trekking', 'Village Life', 'Art & Crafts'
  ];

  const jharkhandAreas = [
    { 
      name: 'Ranchi Region', 
      districts: ['Ranchi', 'Ramgarh', 'Khunti'], 
      highlights: ['Rock Garden', 'Hundru Falls', 'Tagore Hill', 'Tribal Museums'],
      bestFor: ['Urban Experience', 'Waterfalls', 'Cultural Sites']
    },
    { 
      name: 'East Singhbhum Region', 
      districts: ['Jamshedpur', 'Seraikela-Kharsawan'], 
      highlights: ['Tata Steel Plant', 'Jubilee Park', 'Dalma Wildlife Sanctuary'],
      bestFor: ['Industrial Tourism', 'Wildlife', 'Modern Attractions']
    },
    { 
      name: 'Palamu Region', 
      districts: ['Palamu', 'Latehar'], 
      highlights: ['Betla National Park', 'Netarhat', 'Palamau Fort'],
      bestFor: ['Wildlife Safari', 'Hill Stations', 'Historical Sites']
    },
    { 
      name: 'Santhal Parganas Region', 
      districts: ['Dumka', 'Jamtara', 'Pakur', 'Godda', 'Sahebganj'], 
      highlights: ['Santal Tribal Villages', 'Massanjore Dam', 'Traditional Crafts'],
      bestFor: ['Tribal Culture', 'River Tourism', 'Authentic Villages']
    },
    { 
      name: 'Hazaribagh Region', 
      districts: ['Hazaribagh', 'Koderma', 'Chatra', 'Giridih'], 
      highlights: ['Hazaribagh National Park', 'Parasnath Hills', 'Tilaiya Dam'],
      bestFor: ['National Parks', 'Trekking', 'Religious Sites']
    },
    { 
      name: 'Dhanbad Region', 
      districts: ['Dhanbad', 'Bokaro'], 
      highlights: ['Maithon Dam', 'Parasnath Temple', 'Coal Mining Heritage'],
      bestFor: ['Dam Tourism', 'Religious Tourism', 'Industrial Heritage']
    },
    { 
      name: 'Deoghar Region', 
      districts: ['Deoghar'], 
      highlights: ['Baidyanath Dham', 'Nandan Pahar', 'Satsang Ashram'],
      bestFor: ['Religious Tourism', 'Pilgrimage', 'Spiritual Experience']
    },
    { 
      name: 'West Singhbhum Region', 
      districts: ['Chaibasa', 'West Singhbhum'], 
      highlights: ['Saranda Forest', 'Tribal Villages', 'Iron Ore Mines'],
      bestFor: ['Dense Forests', 'Tribal Culture', 'Adventure Activities']
    }
  ];

  const travelCircuits = [
    {
      name: 'Waterfall Circuit',
      areas: ['Ranchi Region', 'Hazaribagh Region'],
      duration: '3-5 days',
      highlights: ['Hundru Falls', 'Jonha Falls', 'Dassam Falls', 'Hirni Falls']
    },
    {
      name: 'Wildlife Circuit',
      areas: ['Palamu Region', 'Hazaribagh Region', 'East Singhbhum Region'],
      duration: '4-6 days',
      highlights: ['Betla National Park', 'Hazaribagh National Park', 'Dalma Wildlife Sanctuary']
    },
    {
      name: 'Tribal Heritage Circuit',
      areas: ['Santhal Parganas Region', 'West Singhbhum Region', 'Ranchi Region'],
      duration: '5-7 days',
      highlights: ['Santal Villages', 'Tribal Museums', 'Traditional Crafts', 'Cultural Programs']
    },
    {
      name: 'Religious Circuit',
      areas: ['Deoghar Region', 'Hazaribagh Region'],
      duration: '2-4 days',
      highlights: ['Baidyanath Dham', 'Parasnath Temple', 'Spiritual Retreats']
    },
    {
      name: 'Adventure Circuit',
      areas: ['Palamu Region', 'Hazaribagh Region', 'West Singhbhum Region'],
      duration: '4-6 days',
      highlights: ['Netarhat Hills', 'Parasnath Trekking', 'Forest Adventures', 'Rock Climbing']
    }
  ];

  const handleInterestToggle = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleAreaToggle = (area: string) => {
    setPreferences(prev => ({
      ...prev,
      targetAreas: prev.targetAreas.includes(area)
        ? prev.targetAreas.filter(a => a !== area)
        : [...prev.targetAreas, area]
    }));
  };

  const handleCircuitSelect = (circuit: typeof travelCircuits[0]) => {
    setPreferences(prev => ({
      ...prev,
      targetAreas: circuit.areas,
      areaFocus: 'circuit' as const
    }));
  };

  // AI Trip Generation Function using Groq API with caching
  const generateItinerary = useCallback(async () => {
    setIsGenerating(true);
    
    // Create cache key from preferences including district selections
    const cacheKey = JSON.stringify({
      duration: preferences.duration,
      budget: preferences.budget,
      interests: preferences.interests.sort(),
      groupSize: preferences.groupSize,
      targetAreas: preferences.targetAreas.sort(),
      selectedDistricts: selectedDistricts.sort(),
      travelOrder: travelOrder,
      startingPoint: startingPoint
    });
    
    // Check cache first
    const cachedResult = itineraryCache.get(cacheKey);
    if (cachedResult) {
      console.log('Using cached itinerary');
      setGeneratedItinerary(cachedResult);
      setIsGenerating(false);
      goToStep(3);
      return;
    }
    
    try {
      // Check if API key is configured
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      
      if (!apiKey || apiKey === 'your_groq_api_key_here' || apiKey.trim() === '') {
        toast({
          title: "Configuration Required",
          description: "Groq API key is not configured. Please add VITE_GROQ_API_KEY to your .env file. Visit https://console.groq.com/ to get your free API key.",
          variant: "destructive",
          duration: 8000
        });
        setIsGenerating(false);
        return;
      }
      
      // Initialize Groq client
      const groq = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      // Build weather context for AI with detailed metrics
      let weatherContext = '';
      if (weatherData && weatherData.daily.length > 0) {
        console.log('🌤️ Weather data available for AI:', weatherData.daily.length, 'days');
        
        // Notify user that weather-based planning is active
        toast({
          title: "Weather-Based Planning Active",
          description: `Analyzing ${weatherData.daily.length} days of weather data to optimize your itinerary...`,
          duration: 4000
        });
        
        weatherContext = `\n**WEATHER FORECAST (CRITICAL - PLAN AROUND THIS):**`;
        weatherData.daily.forEach((day, idx) => {
          weatherContext += `\n- Day ${idx + 1} (${day.date}): ${day.temperature}°C, ${day.condition} - ${day.description}`;
          weatherContext += `\n  📊 Conditions: Humidity ${day.humidity}%, Wind ${day.windSpeed} km/h, Visibility ${day.visibility} km`;
          if (day.uvIndex) weatherContext += `, UV Index ${day.uvIndex}`;
          if (day.precipitationChance && day.precipitationChance > 30) {
            weatherContext += `\n  ⚠️ Rain Chance: ${day.precipitationChance}%`;
          }
        });
        
        // Add comprehensive weather-based recommendations
        const hasRain = weatherData.daily.some(d => d.condition.toLowerCase().includes('rain'));
        const avgTemp = weatherData.daily.reduce((sum, d) => sum + d.temperature, 0) / weatherData.daily.length;
        const hasHeat = avgTemp > 35;
        const hasCold = avgTemp < 15;
        const lowVisibilityDays = weatherData.daily.filter(d => d.visibility < 5).length;
        const highUVDays = weatherData.daily.filter(d => (d.uvIndex || 0) > 7).length;
        const windyDays = weatherData.daily.filter(d => d.windSpeed > 20).length;
        
        weatherContext += `\n\n**WEATHER-BASED PLANNING REQUIREMENTS:**`;
        
        if (hasRain) {
          weatherContext += `\n- 🌧️ RAIN EXPECTED: Prioritize indoor activities, covered sites, and museums on rainy days`;
          weatherContext += `\n- Schedule outdoor activities (waterfalls, hiking, wildlife) ONLY on clear weather days`;
          weatherContext += `\n- Add rain gear recommendations and indoor backup plans`;
        }
        
        if (hasHeat) {
          weatherContext += `\n- 🌡️ HIGH TEMPERATURES: Schedule outdoor activities in early morning (6-9 AM) or evening (4-6 PM)`;
          weatherContext += `\n- Avoid midday outdoor activities (11 AM - 3 PM)`;
          weatherContext += `\n- Include hydration breaks, shaded rest areas, and air-conditioned venues`;
        }
        
        if (hasCold) {
          weatherContext += `\n- 🧥 COLD WEATHER: Morning activities may need to start later (8-9 AM)`;
          weatherContext += `\n- Recommend warm clothing layers and hot beverages`;
          weatherContext += `\n- Indoor activities and cultural sites are preferable`;
        }
        
        if (lowVisibilityDays > 0) {
          weatherContext += `\n- 👁️ LOW VISIBILITY ALERT (${lowVisibilityDays} days): Avoid scenic viewpoints, photography spots, and panoramic locations on low visibility days`;
          weatherContext += `\n- Focus on close-range activities: local markets, temples, museums, cultural centers`;
          weatherContext += `\n- Schedule viewpoint visits and landscape photography on high visibility days only`;
        }
        
        if (highUVDays > 0) {
          weatherContext += `\n- ☀️ HIGH UV INDEX (${highUVDays} days): Essential sun protection - sunscreen, hats, sunglasses`;
          weatherContext += `\n- Seek shade during peak UV hours (10 AM - 4 PM)`;
          weatherContext += `\n- Prefer shaded trails, covered areas, or indoor activities during intense UV periods`;
        }
        
        if (windyDays > 0) {
          weatherContext += `\n- 💨 WINDY CONDITIONS (${windyDays} days): Avoid exposed hilltops, open viewpoints, and adventure activities`;
          weatherContext += `\n- Choose sheltered locations, valleys, and indoor-outdoor mixed venues`;
        }
        
        weatherContext += `\n\n**IMPORTANT**: Match each day's activities to that specific day's weather conditions. Don't schedule outdoor activities on rainy/foggy days!`;
      }

      // Create detailed prompt for AI - WEATHER FIRST!
      const prompt = `You are an expert travel planner specializing in Jharkhand tourism.

🚨 CRITICAL: This is a WEATHER-DRIVEN itinerary. DO NOT use generic/template activities. EACH DAY must be customized to its SPECIFIC weather!
${weatherContext}

**Trip Preferences:**
- Duration: ${preferences.duration} days
${preferences.startDate ? `- Start Date: ${preferences.startDate}` : ''}
- Budget: ${preferences.budget} (${preferences.budget === 'budget' ? '₹2,000-5,000/day' : preferences.budget === 'mid-range' ? '₹5,000-10,000/day' : '₹10,000+/day'})
- Group Size: ${preferences.groupSize}
- Travel Style: ${preferences.travelStyle}
- Accommodation Preference: ${preferences.accommodation}
- Target Areas: ${preferences.targetAreas.join(', ') || 'All of Jharkhand'}
${selectedDistricts.length > 0 ? `- Specific Districts to Visit: ${selectedDistricts.join(' → ')}` : ''}
${selectedDistricts.length > 1 ? `- Travel Pattern: ${travelOrder === 'flexible' ? 'Optimize the best route for efficiency' : 'Visit districts in the exact order listed above'}` : ''}
${startingPoint ? `- Starting Point: Begin the trip from ${startingPoint}` : ''}
- Interests: ${preferences.interests.join(', ') || 'General sightseeing'}
- Special Requests: ${preferences.specialRequests || 'None'}

**CRITICAL REQUIREMENTS - WEATHER-ADAPTIVE PLANNING:**

⚠️ **MANDATORY**: You MUST customize activities based on the EXACT weather for each specific day. DO NOT use generic/fixed scripts!

1. **WEATHER-FIRST PLANNING** - Match activities to ACTUAL weather conditions:
   
   FOR RAINY DAYS (if weather shows rain):
   - ❌ NO waterfalls, trekking, wildlife safaris, outdoor viewpoints
   - ✅ YES to: State Museum, Tribal Research Institute, indoor temples, covered markets, shopping malls, cultural centers
   - Example: "Day 1 (Rainy, 25°C) → Jharkhand State Museum (9 AM), Tribal Craft Market (12 PM), Nakshatra Van covered botanical garden"
   
   FOR CLEAR/SUNNY DAYS (if weather shows clear):
   - ✅ YES to: Hundru Falls, Jonha Falls, Betla National Park, Rock Garden, hiking trails, panoramic viewpoints
   - ❌ NO to: Extended indoor activities
   - Example: "Day 2 (Clear, 28°C) → Hundru Falls trek (7 AM), Dasham Falls photography (11 AM), Ranchi Lake sunset"
   
   FOR HOT DAYS (>32°C):
   - Schedule outdoor activities ONLY 6-9 AM and 4-7 PM
   - Midday (10 AM-4 PM): Indoor museums, air-conditioned venues, lunch break
   - Example: "Day 3 (Hot, 35°C) → Early morning Tagore Hill (6:30 AM), midday Science Centre (11 AM-2 PM), evening Ranchi Lake (5 PM)"
   
   FOR LOW VISIBILITY DAYS (<5km):
   - ❌ NO scenic viewpoints, waterfalls, panoramic spots
   - ✅ YES to: Local temples, markets, cultural sites, indoor attractions
   
   FOR FOGGY/MISTY DAYS:
   - Delay morning start to 9-10 AM (wait for visibility)
   - Focus on nearby attractions, avoid long drives

2. **EACH DAY MUST BE DIFFERENT** based on its specific weather - no copy-paste!

3. For each activity, include:
   - Exact time (e.g., "08:30 AM")
   - Duration of activity
   - Specific weather reason in description (e.g., "Perfect for clear weather photography", "Indoor alternative for rainy day")
   - Travel time and route to next location
   - Transportation mode with cost

4. Account for:
   - Morning: Start 7-8 AM (clear days) or 9-10 AM (foggy/cold days)
   - Lunch break: 12:30-2:00 PM
   - Evening: Activities until 6-7 PM
   - Realistic travel times with weather delays
   - Weather-based route changes

5. Include specific directions like:
   - "From Ranchi, take NH33 towards Hundru Falls (45km, 1 hour drive)"
   - "Local auto-rickshaw from hotel (15 min, ₹50)"

6. Real places in Jharkhand: Hundru Falls, Dassam Falls, Tagore Hill, Betla National Park, Netarhat, Ranchi Lake, State Museum, Tribal Research Institute, etc.

7. Calculate costs realistically (entry fees, transport, meals)

**REMEMBER**: If Day 1 is rainy → museums. If Day 2 is clear → waterfalls. Make it OBVIOUS why you chose each activity!

**Format your response as valid JSON:**
{
  "title": "Captivating trip title",
  "description": "Engaging 2-3 sentence description",
  "totalCost": "₹XX,XXX",
  "days": [
    {
      "day": 1,
      "title": "Day title mentioning weather (e.g., 'Rainy Day Museum & Culture Tour' or 'Clear Weather Waterfall Adventure')",
      "activities": [
        {
          "time": "08:30 AM",
          "activity": "Activity name",
          "location": "Specific location with district",
          "description": "What you'll experience. INCLUDE weather-based reasoning here! (e.g., 'Perfect for clear weather with excellent visibility for photography' OR 'Indoor alternative due to expected rain')",
          "duration": "2 hours",
          "cost": "₹XXX",
          "type": "Cultural/Nature/Adventure",
          "weatherNote": "Why this activity fits today's weather (e.g., 'Clear weather ideal for waterfall visit', 'Indoor museum perfect for rainy day', 'Early timing to avoid 35°C heat')",
          "travelToNext": {
            "mode": "Car/Bus/Auto",
            "duration": "45 minutes",
            "distance": "25 km",
            "route": "Take NH33 towards...",
            "cost": "₹XXX"
          }
        }
      ],
      "meals": [
        {
          "time": "08:00 AM",
          "type": "Breakfast",
          "restaurant": "Hotel/Restaurant name",
          "cuisine": "Local Jharkhandi/North Indian",
          "specialties": ["Dish 1", "Dish 2"],
          "cost": "₹XXX"
        },
        {
          "time": "01:00 PM",
          "type": "Lunch",
          "restaurant": "Restaurant name",
          "cuisine": "Cuisine type",
          "specialties": ["Dish 1", "Dish 2"],
          "cost": "₹XXX"
        },
        {
          "time": "08:00 PM",
          "type": "Dinner",
          "restaurant": "Restaurant name",
          "cuisine": "Cuisine type",
          "specialties": ["Dish 1", "Dish 2"],
          "cost": "₹XXX"
        }
      ],
      "accommodation": {
        "name": "Realistic hotel name",
        "type": "Budget/Mid-range/Luxury",
        "location": "Area, District",
        "checkIn": "03:00 PM",
        "checkOut": "11:00 AM",
        "amenities": ["WiFi", "Parking", "Restaurant"],
        "cost": "₹X,XXX per night"
      },
      "totalDayCost": "₹X,XXX",
      "dayStartLocation": "Starting point",
      "dayEndLocation": "Ending point",
      "totalTravelTime": "X hours",
      "totalDistance": "XX km"
    }
  ],
  "recommendations": [
    "Book specific hotels/activities in advance",
    "Best time to visit each location based on weather",
    "Weather-specific gear and clothing",
    "Safety tips for the region"
  ],
  "weatherTips": [
    "Day-by-day weather summary and its impact on activities",
    "Essential items to pack for the forecasted conditions",
    "Best times for outdoor vs indoor activities",
    "Weather-related safety precautions",
    "Backup plans for poor weather days"
  ],
  "culturalTips": [
    "Tribal etiquette and customs",
    "Local festivals during visit",
    "Photography permissions",
    "Language tips (local greetings)"
  ],
  "weatherBasedRecommendations": [
    "Specific activity adjustments based on forecast",
    "Alternative indoor options for rainy days",
    "Optimal timing for weather-sensitive activities"
  ]
}

BE REALISTIC: Use actual places, real travel times, proper costs, and sequential timing! PRIORITIZE WEATHER-APPROPRIATE ACTIVITIES FOR EACH DAY!

**BEFORE YOU RESPOND - VERIFY THIS CHECKLIST:**
□ Did I check the weather for EACH specific day above?
□ If Day X shows "Rain" - did I avoid waterfalls/outdoor activities?
□ If Day X shows "Clear" - did I include outdoor attractions?
□ If Day X shows "Low Visibility" - did I avoid viewpoints?
□ Did I add a "weatherNote" for EVERY activity explaining why it fits the weather?
□ Are my activities DIFFERENT for different weather days (not copy-paste)?

If you answer NO to any of these, GO BACK and fix the itinerary!`;

      // Call Groq API with active model
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert Jharkhand travel planner with deep knowledge of routes, timings, logistics, and weather patterns. You MUST create weather-adaptive itineraries - different weather = different activities. NEVER use generic/template activities. If Day 1 is rainy, schedule museums NOT waterfalls. If Day 2 is clear, schedule waterfalls NOT museums. Weather dictates EVERYTHING. Every activity must have a weatherNote explaining why it fits that day\'s specific weather. Always respond with valid JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.3-70b-versatile', // Updated to active model
        temperature: 0.5, // Reduced from 0.8 for more consistent weather-based planning
        max_tokens: 8000,
        response_format: { type: 'json_object' }
      });

      const responseContent = chatCompletion.choices[0]?.message?.content || '';
      
      // Parse AI response
      const aiItinerary = JSON.parse(responseContent);
      
      // Cache the result
      itineraryCache.set(cacheKey, aiItinerary as GeneratedItinerary);
      
      setGeneratedItinerary(aiItinerary as GeneratedItinerary);
      goToStep(3);
      
    } catch (error) {
      console.error('Error generating itinerary:', error);
      
      // Show proper error message instead of mock data
      let errorMessage = 'Failed to generate itinerary. ';
      
      if (error instanceof Error) {
        if (error.message.includes('API key') || error.message.includes('apiKey')) {
          errorMessage += 'Groq API key is not configured. Please add VITE_GROQ_API_KEY to your .env file.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage += 'Network error. Please check your internet connection.';
        } else {
          errorMessage += error.message;
        }
      }
      
      toast({
        title: "AI Generation Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 6000
      });
      
      setIsGenerating(false);
      // Don't proceed to step 3, stay on step 2 so user can try again
    } finally {
      setIsGenerating(false);
    }
  }, [preferences, selectedDistricts, travelOrder, startingPoint, itineraryCache]);

  // AI Trip Generation from Simple Text Input
  // Function to validate if input text is meaningful
  const validateTripInput = (text: string): { isValid: boolean; reason?: string } => {
    const cleanText = sanitizeInput(text).toLowerCase();
    
    // Check minimum length
    if (cleanText.length < 10) {
      return { isValid: false, reason: "Please provide more details about your trip (at least 10 characters)" };
    }
    
    // Check if text contains only random characters or repeated patterns
    const randomPattern = /^[a-z]{6,}$/; // Only random letters
    const repeatedPattern = /(.)\1{4,}/; // Same character repeated 5+ times
    if (randomPattern.test(cleanText) || repeatedPattern.test(cleanText)) {
      return { isValid: false, reason: "Please provide a meaningful description of your trip requirements" };
    }
    
    // Check for travel-related keywords
    const travelKeywords = [
      'trip', 'visit', 'travel', 'tour', 'vacation', 'holiday', 'journey',
      'day', 'days', 'week', 'weekend', 'month',
      'budget', 'money', 'cost', 'price', 'expensive', 'cheap', 'affordable',
      'family', 'friends', 'couple', 'solo', 'group',
      'hotel', 'stay', 'accommodation', 'lodge', 'resort',
      'food', 'restaurant', 'eat', 'lunch', 'dinner',
      'nature', 'waterfall', 'temple', 'culture', 'adventure', 'wildlife',
      'ranchi', 'jamshedpur', 'deoghar', 'netarhat', 'jharkhand',
      'want', 'like', 'interested', 'plan', 'looking', 'need'
    ];
    
    const hasKeywords = travelKeywords.some(keyword => cleanText.includes(keyword));
    
    // Check if text has basic sentence structure (spaces between words)
    const wordCount = cleanText.split(/\s+/).length;
    const hasSpaces = cleanText.includes(' ');
    
    if (!hasKeywords && (!hasSpaces || wordCount < 3)) {
      return { 
        isValid: false, 
        reason: "Please describe your trip with details like duration, budget, interests, or places you want to visit" 
      };
    }
    
    return { isValid: true };
  };

  const generateFromSimpleText = useCallback(async () => {
    const sanitizedInput = sanitizeInput(simpleTextInput);
    
    if (!sanitizedInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please describe your trip requirements",
        variant: "destructive"
      });
      return;
    }

    // Validate input before processing
    const validation = validateTripInput(sanitizedInput);
    if (!validation.isValid) {
      toast({
        title: "Invalid Input",
        description: validation.reason,
        variant: "destructive"
      });
      return;
    }

    // Check rate limiting
    const clientId = 'trip-planner-' + (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
    if (!apiRateLimiter.isAllowed(clientId)) {
      toast({
        title: "Too Many Requests",
        description: "Please wait a moment before generating another trip plan.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    // Announce to screen readers via toast
    toast({
      title: "Generating Trip Plan", 
      description: "AI is creating your personalized Jharkhand itinerary...",
      duration: 2000
    });
    
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      
      const apiValidation = validateApiKey(apiKey);
      if (!apiValidation.isValid) {
        toast({
          title: "Configuration Required",
          description: "Groq API key is not configured properly. Please check your environment configuration.",
          variant: "destructive",
          duration: 8000
        });
        setIsGenerating(false);
        return;
      }
      
      const groq = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      const prompt = `You are an expert travel planner for Jharkhand tourism. A user has described their trip requirements as follows:

"${simpleTextInput}"

Based on this description, create a detailed, realistic itinerary for Jharkhand. Extract trip duration, budget level, interests, and other details from their text. If any details are missing, make reasonable assumptions.

**CRITICAL REQUIREMENTS:**
1. Plan activities in SEQUENTIAL ORDER with realistic timing
2. Include travel directions between locations (e.g., "20 min drive via NH33")
3. Account for breakfast, lunch, dinner, and accommodation
4. Use real places in Jharkhand: Hundru Falls, Dassam Falls, Tagore Hill, Betla National Park, Netarhat, etc.
5. Calculate costs realistically

**Format your response as valid JSON matching this structure:**
{
  "title": "Captivating trip title",
  "description": "2-3 sentence description",
  "totalCost": "₹XX,XXX",
  "days": [
    {
      "day": 1,
      "title": "Day 1 title",
      "activities": [
        {
          "time": "08:30 AM",
          "activity": "Activity name",
          "location": "Location name",
          "description": "Activity details",
          "duration": "2 hours",
          "cost": "₹XXX",
          "type": "Sightseeing/Adventure/Cultural/etc",
          "travelToNext": {
            "mode": "Car/Bus/Walk",
            "duration": "30 min",
            "distance": "15 km",
            "route": "Via NH33",
            "cost": "₹50"
          }
        }
      ],
      "meals": [
        {
          "time": "01:00 PM",
          "type": "Lunch",
          "restaurant": "Restaurant name",
          "cuisine": "Local/Multi-cuisine",
          "specialties": ["Dish 1", "Dish 2"],
          "cost": "₹XXX"
        }
      ],
      "accommodation": {
        "name": "Hotel/Homestay name",
        "type": "Hotel/Homestay/Resort",
        "location": "Location",
        "checkIn": "03:00 PM",
        "checkOut": "11:00 AM",
        "amenities": ["WiFi", "Parking"],
        "cost": "₹XXX"
      },
      "totalDayCost": "₹X,XXX"
    }
  ],
  "recommendations": ["Tip 1", "Tip 2", "Tip 3"],
  "weatherTips": ["Weather tip 1", "Weather tip 2"],
  "culturalTips": ["Cultural tip 1", "Cultural tip 2"]
}

IMPORTANT: Return ONLY valid JSON, no markdown or explanations.`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a Jharkhand tourism expert. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 8000,
        response_format: { type: 'json_object' }
      });

      const responseContent = chatCompletion.choices[0]?.message?.content || '';
      const aiItinerary = JSON.parse(responseContent);
      
      setGeneratedItinerary(aiItinerary as GeneratedItinerary);
      goToStep(3);
      
    } catch (error) {
      console.error('Error generating itinerary:', error);
      
      let errorMessage = 'Failed to generate itinerary. ';
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage += 'Groq API key is not configured.';
        } else if (error.message.includes('network')) {
          errorMessage += 'Network error. Please check your internet connection.';
        } else {
          errorMessage += error.message;
        }
      }
      
      toast({
        title: "AI Generation Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 6000
      });
    } finally {
      setIsGenerating(false);
    }
  }, [simpleTextInput]);

  const generateAreaBasedDays = (): ItineraryDay[] => {
    const days = parseInt(preferences.duration) || 3;
    const mockDays: ItineraryDay[] = [];
    const selectedAreas = preferences.targetAreas.length > 0 ? preferences.targetAreas : ['Ranchi Region'];

    for (let i = 1; i <= days; i++) {
      // Rotate through selected areas for multi-area trips
      const currentAreaIndex = preferences.targetAreas.length > 1 ? (i - 1) % selectedAreas.length : 0;
      const currentArea = selectedAreas[currentAreaIndex];
      const areaData = jharkhandAreas.find(area => area.name === currentArea);

      mockDays.push({
        day: i,
        title: `${currentArea} - ${i === 1 ? 'Arrival & Exploration' : i === days ? 'Final Adventures' : 'Deep Dive Experience'}`,
        activities: [
          {
            time: '09:00 AM',
            activity: areaData?.highlights[0] || 'Local Attraction Visit',
            location: areaData?.districts[0] || 'Central Location',
            description: `Explore the iconic ${areaData?.highlights[0] || 'attraction'} showcasing ${currentArea}'s unique character`,
            cost: '₹200',
            type: areaData?.bestFor[0] || 'Cultural'
          },
          {
            time: '02:00 PM',
            activity: areaData?.highlights[1] || 'Regional Experience',
            location: areaData?.districts[1] || areaData?.districts[0] || 'Regional Site',
            description: `Experience ${areaData?.highlights[1] || 'regional specialty'} - a highlight of ${currentArea}`,
            cost: '₹350',
            type: areaData?.bestFor[1] || 'Nature'
          },
          {
            time: '05:00 PM',
            activity: preferences.targetAreas.length > 1 && i < days ? `Travel to ${selectedAreas[(i) % selectedAreas.length]}` : 'Local Cultural Program',
            location: preferences.targetAreas.length > 1 && i < days ? 'En Route' : areaData?.districts[0] || 'Local Venue',
            description: preferences.targetAreas.length > 1 && i < days 
              ? `Scenic journey to next destination with stops at viewpoints`
              : 'Evening cultural program showcasing local traditions',
            cost: preferences.targetAreas.length > 1 && i < days ? '₹500' : '₹300',
            type: preferences.targetAreas.length > 1 && i < days ? 'Transport' : 'Cultural'
          }
        ],
        meals: [
          {
            time: '12:00 PM',
            restaurant: `${currentArea} Specialty Restaurant`,
            cuisine: `Regional ${currentArea} Cuisine`,
            cost: '₹400'
          },
          {
            time: '08:00 PM',
            restaurant: areaData?.districts[0] ? `${areaData.districts[0]} Local Dhaba` : 'Local Restaurant',
            cuisine: 'Traditional Jharkhand',
            cost: '₹500'
          }
        ],
        accommodation: {
          name: `${currentArea} ${preferences.accommodation === 'luxury' ? 'Resort' : preferences.accommodation === 'homestay' ? 'Heritage Homestay' : 'Eco Lodge'}`,
          type: preferences.accommodation === 'luxury' ? 'Luxury Resort' : preferences.accommodation === 'homestay' ? 'Tribal Homestay' : 'Eco Lodge',
          location: areaData?.districts[0] || 'Central Area',
          cost: preferences.budget === 'budget' ? '₹1,500' : preferences.budget === 'mid-range' ? '₹2,500' : '₹4,000'
        },
        totalDayCost: preferences.budget === 'budget' ? '₹2,700' : preferences.budget === 'mid-range' ? '₹3,750' : '₹5,150'
      });
    }

    return mockDays;
  };

  const downloadItinerary = () => {
    if (!generatedItinerary) return;
    
    // Create formatted text version
    let content = `${generatedItinerary.title}\n${'='.repeat(generatedItinerary.title.length)}\n\n`;
    content += `${generatedItinerary.description}\n\n`;
    content += `Total Cost: ${generatedItinerary.totalCost}\n\n`;
    content += `${'='.repeat(50)}\n\n`;
    
    // Add day-by-day itinerary
    generatedItinerary.days.forEach((day) => {
      content += `DAY ${day.day}: ${day.title}\n`;
      content += `${'-'.repeat(50)}\n\n`;
      
      content += `ACTIVITIES:\n`;
      day.activities.forEach((activity) => {
        content += `  ${activity.time} - ${activity.activity}\n`;
        content += `    Location: ${activity.location}\n`;
        content += `    ${activity.description}\n`;
        content += `    Cost: ${activity.cost} | Type: ${activity.type}\n\n`;
      });
      
      content += `MEALS:\n`;
      day.meals.forEach((meal) => {
        content += `  ${meal.time} - ${meal.restaurant}\n`;
        content += `    Cuisine: ${meal.cuisine} | Cost: ${meal.cost}\n\n`;
      });
      
      content += `ACCOMMODATION:\n`;
      content += `  ${day.accommodation.name} (${day.accommodation.type})\n`;
      content += `  Location: ${day.accommodation.location}\n`;
      content += `  Cost: ${day.accommodation.cost}\n\n`;
      
      content += `Day Total: ${day.totalDayCost}\n\n`;
      content += `${'='.repeat(50)}\n\n`;
    });
    
    // Add recommendations
    content += `RECOMMENDATIONS:\n`;
    generatedItinerary.recommendations.forEach((rec, i) => {
      content += `${i + 1}. ${rec}\n`;
    });
    content += `\n`;
    
    content += `WEATHER TIPS:\n`;
    generatedItinerary.weatherTips.forEach((tip, i) => {
      content += `${i + 1}. ${tip}\n`;
    });
    content += `\n`;
    
    content += `CULTURAL TIPS:\n`;
    generatedItinerary.culturalTips.forEach((tip, i) => {
      content += `${i + 1}. ${tip}\n`;
    });
    
    content += `\n${'='.repeat(50)}\n`;
    content += `Generated by ROOTSnROUTES AI Trip Planner\n`;
    content += `Visit: https://rootsnroutes.com\n`;
    
    // Create and download text file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Jharkhand-Trip-Itinerary-${preferences.duration}Days.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleBookAccommodations = () => {
    handleProtectedBooking(() => {
      // Proceed with accommodation booking
      toast({
        title: "Booking Accommodations",
        description: "Redirecting to accommodation booking for your selected itinerary...",
        duration: 3000
      });
      // Add actual booking logic here
    });
  };

  const shareItinerary = () => {
    if (!generatedItinerary) return;
    
    // Store itinerary in localStorage with unique ID
    const itineraryId = `itinerary_${Date.now()}`;
    localStorage.setItem(itineraryId, JSON.stringify({
      itinerary: generatedItinerary,
      preferences: preferences,
      createdAt: new Date().toISOString()
    }));
    
    // Create shareable URL
    const shareableUrl = `${window.location.origin}${window.location.pathname}?itinerary=${itineraryId}`;
    
    // Try native share API first
    if (navigator.share) {
      navigator.share({
        title: generatedItinerary.title,
        text: `Check out my ${preferences.duration}-day Jharkhand trip itinerary! ${generatedItinerary.description}`,
        url: shareableUrl
      }).catch((error) => {
        console.log('Error sharing:', error);
        copyToClipboard(shareableUrl);
      });
    } else {
      // Fallback: copy to clipboard
      copyToClipboard(shareableUrl);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`Shareable link copied to clipboard!\n\n${text}\n\nShare this link with friends and family!`);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(`Shareable link copied!\n\n${text}`);
    });
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((num) => (
        <React.Fragment key={num}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            step >= num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            {num}
          </div>
          {num < 3 && (
            <div className={`w-16 h-1 ${step > num ? 'bg-primary' : 'bg-muted'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  if (step === 1) {
    return (
      <div className="max-w-3xl mx-auto">
        {renderStepIndicator()}
        
        {stepTransitioning ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Preparing your trip planner...</p>
            </div>
          </div>
        ) : (
        <Card className="shadow-lg">{/* rest of step 1 content */}
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              AI Trip Planner
            </CardTitle>
            <p className="text-muted-foreground text-base">
              Tell us your preferences, and our AI will create the perfect Jharkhand itinerary
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Mode Selection */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <h3 className="text-base font-semibold mb-3 text-center">Choose Your Planning Style</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <button
                  onClick={() => setPlannerMode('simple')}
                  className={`p-4 rounded-lg border transition-all ${
                    plannerMode === 'simple'
                      ? 'border-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 shadow-md'
                      : 'border-muted-foreground/30 hover:border-emerald-400 dark:hover:border-emerald-700'
                  }`}
                >
                  <div className="text-2xl mb-2">✍️</div>
                  <h4 className="font-bold text-base mb-2">Quick Text Input</h4>
                  <p className="text-sm text-muted-foreground">
                    Just describe your trip in your own words. Our AI will understand and plan everything for you.
                  </p>
                  <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Example: "3 day trip with family, budget friendly, want to see waterfalls"
                  </div>
                </button>

                <button
                  onClick={() => setPlannerMode('detailed')}
                  className={`p-4 rounded-lg border transition-all ${
                    plannerMode === 'detailed'
                      ? 'border-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 shadow-md'
                      : 'border-muted-foreground/30 hover:border-emerald-400 dark:hover:border-emerald-700'
                  }`}
                >
                  <div className="text-2xl mb-2">📋</div>
                  <h4 className="font-bold text-base mb-2">Detailed Form</h4>
                  <p className="text-sm text-muted-foreground">
                    Fill out a comprehensive form with specific options for duration, budget, interests, and more.
                  </p>
                  <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    More control over every aspect of your trip
                  </div>
                </button>
              </div>
            </div>

            {/* Simple Text Input Mode */}
            {plannerMode === 'simple' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Describe Your Perfect Jharkhand Trip
                  </label>
                  <Textarea
                    placeholder="Example: I want to visit Jharkhand for 4 days with my family. We're interested in nature, waterfalls, and wildlife. Our budget is around ₹20,000 total. We'd like comfortable but not luxury accommodation. We want to visit Ranchi, Hundru Falls, and maybe Betla National Park..."
                    value={simpleTextInput}
                    onChange={(e) => setSimpleTextInput(e.target.value)}
                    rows={8}
                    className={`resize-none ${
                      simpleTextInput.trim() && !validateTripInput(simpleTextInput).isValid 
                        ? 'border-red-500 focus:border-red-500' 
                        : ''
                    }`}
                  />
                  {simpleTextInput.trim() && !validateTripInput(simpleTextInput).isValid && (
                    <p className="text-xs text-red-500 mt-1">
                      {validateTripInput(simpleTextInput).reason}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Tip: Include details like duration, budget, interests, places you want to visit, group size, and any special requirements
                  </p>
                </div>

                <Button 
                  onClick={generateFromSimpleText}
                  className="w-full py-6 text-lg"
                  disabled={isGenerating || !simpleTextInput.trim() || !validateTripInput(simpleTextInput).isValid}
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      AI is planning your perfect trip...
                    </span>
                  ) : !simpleTextInput.trim() ? (
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Please describe your trip above
                    </span>
                  ) : !validateTripInput(simpleTextInput).isValid ? (
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Please provide a meaningful trip description
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Generate My Trip Itinerary
                    </span>
                  )}
                </Button>
              </div>
            )}

            {/* Detailed Form Mode */}
            {plannerMode === 'detailed' && (
              <div className="space-y-6">
                <div className="bg-muted/30 border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
                    <span className="text-red-500">*</span>
                    <span>Required fields</span>
                    <span className="text-muted-foreground/60">|</span>
                    <span className="text-emerald-600">📍 Weather integration enabled</span>
                  </p>
                </div>

                {/* Basic Trip Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Trip Details
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        Trip Start Date
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <Input
                        type="date"
                        value={preferences.startDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setPreferences(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full bg-background text-foreground border-input focus:border-primary focus:ring-primary [&::-webkit-datetime-edit]:text-foreground [&::-webkit-datetime-edit]:bg-transparent [&::-webkit-datetime-edit-text]:text-foreground [&::-webkit-datetime-edit-month-field]:text-foreground [&::-webkit-datetime-edit-day-field]:text-foreground [&::-webkit-datetime-edit-year-field]:text-foreground [&::-webkit-datetime-edit-fields-wrapper]:text-foreground [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert dark:[&::-webkit-calendar-picker-indicator]:brightness-100 dark:[&::-webkit-calendar-picker-indicator]:invert-0"
                        required
                        placeholder="mm/dd/yyyy"
                        style={{ 
                          colorScheme: 'dark light',
                          WebkitAppearance: 'none',
                          MozAppearance: 'textfield'
                        }}
                      />
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span>📍</span> Required for weather-based planning
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Trip Duration
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <Select value={preferences.duration} onValueChange={(value) => 
                        setPreferences(prev => ({ ...prev, duration: value }))
                      }>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                    <SelectItem value="2">2 Days</SelectItem>
                    <SelectItem value="3">3 Days</SelectItem>
                    <SelectItem value="4">4 Days</SelectItem>
                    <SelectItem value="5">5 Days</SelectItem>
                    <SelectItem value="7">1 Week</SelectItem>
                    <SelectItem value="10">10 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Budget Range
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Select value={preferences.budget} onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, budget: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget *" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">💵 Budget (₹2,000-5,000/day)</SelectItem>
                    <SelectItem value="mid-range">💳 Mid-range (₹5,000-10,000/day)</SelectItem>
                    <SelectItem value="luxury">💎 Luxury (₹10,000+/day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Group Size
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Select value={preferences.groupSize} onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, groupSize: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group size *" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">Solo Traveler</SelectItem>
                    <SelectItem value="couple">Couple</SelectItem>
                    <SelectItem value="family">Family (3-5 people)</SelectItem>
                    <SelectItem value="group">Large Group (6+ people)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Travel Style</label>
                <Select value={preferences.travelStyle} onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, travelStyle: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relaxed">Relaxed & Cultural</SelectItem>
                    <SelectItem value="adventure">Adventure & Active</SelectItem>
                    <SelectItem value="mixed">Mixed Experience</SelectItem>
                    <SelectItem value="luxury">Luxury & Comfort</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Accommodation Preference
                <span className="text-xs text-muted-foreground ml-2">(optional)</span>
              </label>
              <Select value={preferences.accommodation} onValueChange={(value) => 
                setPreferences(prev => ({ ...prev, accommodation: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select accommodation (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homestay">Tribal Homestays</SelectItem>
                  <SelectItem value="eco-lodge">Eco Lodges</SelectItem>
                  <SelectItem value="heritage">Heritage Hotels</SelectItem>
                  <SelectItem value="luxury">Luxury Resorts</SelectItem>
                  <SelectItem value="mixed">Mixed Options</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">
                Interests & Activities
                <span className="text-xs text-muted-foreground ml-2">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <Badge
                    key={interest}
                    variant={preferences.interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80 px-3 py-2"
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Special Requests
                <span className="text-xs text-muted-foreground ml-2">(optional)</span>
              </label>
              <Textarea
                placeholder="Any special requirements, dietary restrictions, mobility needs, or specific places you want to visit... (optional)"
                value={preferences.specialRequests}
                onChange={(e) => setPreferences(prev => ({ ...prev, specialRequests: e.target.value }))}
                rows={3}
              />
            </div>

            {/* District Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <label className="text-base font-semibold">
                  Select Districts to Visit
                  <span className="text-sm text-muted-foreground ml-2 font-normal">(Click in order of visit)</span>
                </label>
              </div>
              
              <div className="border border-border rounded-lg p-6 bg-card shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh',
                    'Giridih', 'Dumka', 'Palamu', 'Ramgarh', 'Netarhat', 'Khunti',
                    'Chatra', 'Koderma', 'Garhwa', 'Latehar', 'Lohardaga', 'Simdega',
                    'Gumla', 'Sahebganj', 'Pakur', 'Godda', 'Jamtara', 'East Singhbhum'
                  ].map((district) => {
                    const selectedIndex = selectedDistricts.indexOf(district);
                    const isSelected = selectedIndex !== -1;
                    
                    return (
                      <button
                        key={district}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedDistricts(selectedDistricts.filter(d => d !== district));
                          } else {
                            setSelectedDistricts([...selectedDistricts, district]);
                          }
                        }}
                        className={`relative px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-center min-h-[60px] flex flex-col items-center justify-center shadow-sm border-2 ${isSelected 
                            ? 'bg-primary text-primary-foreground border-primary shadow-md transform scale-105' 
                            : 'bg-background hover:bg-muted/50 border-border hover:border-primary/30 hover:shadow-md'
                          }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md border-2 border-background">
                            {selectedIndex + 1}
                          </div>
                        )}
                        <span className="leading-tight">{district}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDistricts.length > 0 && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-2">
                    📍 Your Journey Route ({selectedDistricts.length} stops):
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedDistricts.map((district, idx) => (
                      <React.Fragment key={district}>
                        <div className="flex items-center gap-2 bg-background dark:bg-muted px-3 py-1.5 rounded-md border border-emerald-200 dark:border-emerald-700">
                          <span className="bg-emerald-600 text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-medium">{district}</span>
                        </div>
                        {idx < selectedDistricts.length - 1 && (
                          <span className="text-emerald-600 font-bold">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Click districts again to remove them from your route
                  </p>
                </div>
              )}
            </div>

            {/* Travel Order Preference - Simplified */}
            {selectedDistricts.length > 1 && (
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  How should we plan your route?
                </label>
                
                <div className="grid md:grid-cols-2 gap-3">
                  <button
                    onClick={() => setTravelOrder('specific')}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      travelOrder === 'specific'
                        ? 'border-primary bg-primary/10'
                        : 'border-input hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📍</span>
                      <div>
                        <div className="font-semibold text-sm">Follow My Order</div>
                        <div className="text-xs text-muted-foreground">Visit in the exact sequence I selected</div>
                      </div>
                    </div>
                  </button>


                  <button
                    onClick={() => setTravelOrder('flexible')}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      travelOrder === 'flexible'
                        ? 'border-primary bg-primary/10'
                        : 'border-input hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔄</span>
                      <div>
                        <div className="font-semibold text-sm">Let AI Optimize</div>
                        <div className="text-xs text-muted-foreground">AI finds the best route for efficiency</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
            </div>
            </div>
            )}

            {/* Next Step Button - Only show in detailed mode or simple mode without generate */}
            {plannerMode === 'detailed' && (
            <Button 
              onClick={() => setStep(2)}
              className="w-full py-3 text-lg"
              disabled={
                plannerMode === 'simple' 
                  ? !simpleTextInput.trim()
                  : (!preferences.duration || !preferences.budget || !preferences.groupSize || !preferences.startDate)
              }
            >
              {(plannerMode === 'simple' ? !simpleTextInput.trim() : (!preferences.duration || !preferences.budget || !preferences.groupSize || !preferences.startDate)) ? (
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {plannerMode === 'simple' ? 'Please describe your trip above' : 'Please fill all required fields (*)'}
                </span>
              ) : (
                'Next: Review Preferences'
              )}
            </Button>
            )}
          </CardContent>
        </Card>
        )}
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-5xl mx-auto">
        {renderStepIndicator()}
        
        <Card className="shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="text-center space-y-3 pb-8">
            <div className="text-5xl mb-2">✈️🗺️</div>
            <CardTitle className="text-3xl font-bold">Review Your Trip Plan</CardTitle>
            <p className="text-muted-foreground text-lg">
              Confirm your details before we create your perfect weather-optimized itinerary
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Trip Overview Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
                <CardContent className="pt-6 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <p className="text-sm text-muted-foreground mb-1">Duration</p>
                  <p className="text-2xl font-bold">{preferences.duration}</p>
                  <p className="text-xs text-muted-foreground">Days</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
                <CardContent className="pt-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <p className="text-sm text-muted-foreground mb-1">Group Size</p>
                  <p className="text-lg font-bold capitalize">{preferences.groupSize}</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
                <CardContent className="pt-6 text-center">
                  <span className="text-4xl mb-3 block">💰</span>
                  <p className="text-sm text-muted-foreground mb-1">Budget</p>
                  <p className="text-lg font-bold capitalize">{preferences.budget}</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all">
                <CardContent className="pt-6 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <p className="text-sm text-muted-foreground mb-1">Destinations</p>
                  <p className="text-lg font-bold">{selectedDistricts.length || preferences.targetAreas.length || 'Multiple'}</p>
                  <p className="text-xs text-muted-foreground">Location{(selectedDistricts.length > 1 || preferences.targetAreas.length > 1) ? 's' : ''}</p>
                </CardContent>
              </Card>
            </div>

            {/* Your Journey Route */}
            {selectedDistricts.length > 0 && (
              <Card className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <span className="text-2xl">🗺️</span>
                    Your Journey Route
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 flex-wrap">
                    {selectedDistricts.map((district, idx) => (
                      <React.Fragment key={district}>
                        <div className="flex items-center gap-2">
                          <div className="bg-emerald-600 text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                            {idx + 1}
                          </div>
                          <div className="bg-background dark:bg-muted px-4 py-2 rounded-lg shadow-sm border border-emerald-200 dark:border-emerald-700">
                            <p className="font-bold text-emerald-800 dark:text-emerald-200">{district}</p>
                            {idx === 0 && (
                              <p className="text-xs text-emerald-600 dark:text-emerald-400">Starting Point</p>
                            )}
                          </div>
                        </div>
                        {idx < selectedDistricts.length - 1 && (
                          <span className="text-2xl text-emerald-600">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm">
                      <strong>Travel Pattern:</strong> {
                        travelOrder === 'specific' ? '� Follow My Order - Visit districts in the exact sequence selected' :
                        '🔄 Let AI Optimize - AI will find the most efficient route'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trip Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    Your Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {preferences.interests.length > 0 ? (
                      preferences.interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="text-sm">
                          {interest}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">General sightseeing</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-xl">🏨</span>
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><strong>Travel Style:</strong> <span className="capitalize">{preferences.travelStyle}</span></p>
                  <p><strong>Accommodation:</strong> <span className="capitalize">{preferences.accommodation}</span></p>
                  {preferences.startDate && (
                    <p><strong>Start Date:</strong> {new Date(preferences.startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {preferences.specialRequests && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-xl">📝</span>
                    Special Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground bg-muted p-4 rounded-md italic">
                    "{preferences.specialRequests}"
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Weather Forecast Display */}
            {preferences.startDate && (
              <div className="space-y-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 mb-3">
                  <Cloud className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-semibold text-lg">Weather Forecast</h3>
                </div>
                
                {isLoadingWeather && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading weather data...</span>
                  </div>
                )}

                {weatherError && (
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">{weatherError}</span>
                  </div>
                )}

                {weatherData && weatherData.daily.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Forecast for {selectedDistricts[0] || preferences.targetAreas[0]?.split(' ')[0] || 'selected area'}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {weatherData.daily.slice(0, parseInt(preferences.duration) || 5).map((day, idx) => (
                        <div key={idx} className="bg-background dark:bg-muted p-3 rounded-lg shadow-sm">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Day {idx + 1}</p>
                          <div className="flex items-center gap-2 mb-2">
                            {day.condition.toLowerCase().includes('rain') ? (
                              <CloudRain className="h-5 w-5 text-blue-500" />
                            ) : day.condition.toLowerCase().includes('cloud') ? (
                              <Cloud className="h-5 w-5 text-gray-500" />
                            ) : (
                              <Sun className="h-5 w-5 text-yellow-500" />
                            )}
                            <span className="text-lg font-bold">{day.temperature}°C</span>
                          </div>
                          <p className="text-xs text-muted-foreground capitalize">{day.description}</p>
                          {day.precipitationChance && day.precipitationChance > 30 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Umbrella className="h-3 w-3 text-blue-500" />
                              <span className="text-xs text-blue-600 dark:text-blue-400">{day.precipitationChance}%</span>
                            </div>
                          )}
                          {day.windSpeed > 10 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Wind className="h-3 w-3 text-gray-500" />
                              <span className="text-xs text-gray-600 dark:text-gray-400">{day.windSpeed} m/s</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-md">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        ⚡ <strong>Smart Planning:</strong> Your itinerary will be optimized based on this weather forecast - 
                        outdoor activities on clear days, indoor experiences when it rains!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => goToStep(1)} className="flex-1">
                Refine choices
              </Button>
              <Button 
                onClick={generateItinerary}
                className="flex-1 py-3"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Generating AI Itinerary...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate My Trip
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 3: Generated Itinerary Display
  if (step === 3 && generatedItinerary) {
    return (
      <div className="max-w-6xl mx-auto">
        {renderStepIndicator()}
        
        <div className="space-y-8">
          {/* Header */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-bold text-primary mb-2">
                    {generatedItinerary.title}
                  </CardTitle>
                  <p className="text-lg text-muted-foreground mb-4">
                    {generatedItinerary.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      Total Cost: {generatedItinerary.totalCost}
                    </Badge>
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {generatedItinerary.days.length} Days
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={shareItinerary}>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button onClick={downloadItinerary}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Daily Itinerary */}
          <div className="grid gap-6">
            {generatedItinerary.days.map((day, dayIndex) => {
              const dayWeather = weatherData?.daily[dayIndex];
              return (
              <Card key={day.day} className="shadow-md border-l-4 border-l-primary">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm">
                        {day.day}
                      </span>
                      {day.title}
                    </CardTitle>
                  </div>

                  {/* Weather for this day */}
                  {dayWeather && (
                    <div className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/30 dark:to-blue-900/30 p-4 rounded-lg border border-sky-200 dark:border-sky-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            {dayWeather.condition.toLowerCase().includes('rain') ? (
                              <CloudRain className="h-10 w-10 text-blue-500 mx-auto mb-1" />
                            ) : dayWeather.condition.toLowerCase().includes('cloud') ? (
                              <Cloud className="h-10 w-10 text-gray-500 mx-auto mb-1" />
                            ) : (
                              <Sun className="h-10 w-10 text-yellow-500 mx-auto mb-1" />
                            )}
                            <p className="text-2xl font-bold">{dayWeather.temperature}°C</p>
                          </div>
                          <div>
                            <p className="font-semibold text-lg capitalize">{dayWeather.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Droplets className="h-4 w-4" />
                                {dayWeather.humidity}%
                              </span>
                              <span className="flex items-center gap-1">
                                <Wind className="h-4 w-4" />
                                {dayWeather.windSpeed} m/s
                              </span>
                              {dayWeather.precipitationChance && dayWeather.precipitationChance > 30 && (
                                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                  <Umbrella className="h-4 w-4" />
                                  {dayWeather.precipitationChance}% rain
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            dayWeather.condition.toLowerCase().includes('rain') ? 'destructive' :
                            dayWeather.condition.toLowerCase().includes('cloud') ? 'secondary' :
                            'default'
                          } className="text-xs mb-2">
                            {dayWeather.condition.toLowerCase().includes('rain') ? '☔ Indoor Focus' :
                             dayWeather.condition.toLowerCase().includes('cloud') ? '🌤️ Mixed Activities' :
                             '☀️ Outdoor Perfect'}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            Activities planned for this weather
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent>
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Activities */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Activities
                      </h4>
                      <div className="space-y-3">
                        {day.activities.map((activity, idx) => (
                          <div key={idx} className="bg-muted p-3 rounded-md">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium text-primary">{activity.time}</p>
                                {activity.duration && (
                                  <p className="text-xs text-muted-foreground">Duration: {activity.duration}</p>
                                )}
                              </div>
                              <Badge variant="outline">{activity.type}</Badge>
                            </div>
                            <p className="font-semibold">{activity.activity}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {activity.location}
                            </p>
                            <p className="text-sm mt-1">{activity.description}</p>
                            
                            {/* Weather-Based Reasoning */}
                            {activity.weatherNote && (
                              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border-l-2 border-blue-400">
                                <p className="text-xs flex items-start gap-1">
                                  <span className="font-semibold text-blue-700 dark:text-blue-300">🌤️ Weather Pick:</span>
                                  <span className="text-blue-600 dark:text-blue-400">{activity.weatherNote}</span>
                                </p>
                              </div>
                            )}
                            
                            <p className="text-sm font-medium mt-2">Cost: {activity.cost}</p>
                            
                            {/* Travel Info to Next Location */}
                            {activity.travelToNext && (
                              <div className="mt-3 pt-3 border-t border-border">
                                <p className="text-xs font-semibold text-muted-foreground mb-1">
                                  🚗 Travel to Next Stop
                                </p>
                                <div className="bg-background/50 p-2 rounded text-xs space-y-1">
                                  <p><strong>Mode:</strong> {activity.travelToNext.mode}</p>
                                  <p><strong>Time:</strong> {activity.travelToNext.duration} • <strong>Distance:</strong> {activity.travelToNext.distance}</p>
                                  <p className="text-muted-foreground italic">{activity.travelToNext.route}</p>
                                  <p><strong>Cost:</strong> {activity.travelToNext.cost}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Meals */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        🍽️ Meals
                      </h4>
                      <div className="space-y-3">
                        {day.meals.map((meal, idx) => (
                          <div key={idx} className="bg-muted p-3 rounded-md">
                            <div className="flex justify-between items-center mb-1">
                              <div>
                                <p className="font-medium text-primary">{meal.time}</p>
                                {meal.type && (
                                  <p className="text-xs text-muted-foreground">{meal.type}</p>
                                )}
                              </div>
                              <p className="text-sm font-medium">{meal.cost}</p>
                            </div>
                            <p className="font-semibold">{meal.restaurant}</p>
                            <p className="text-sm text-muted-foreground">{meal.cuisine}</p>
                            {meal.specialties && meal.specialties.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-semibold text-muted-foreground">Try:</p>
                                <p className="text-xs">{meal.specialties.join(', ')}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Accommodation */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        🏠 Stay
                      </h4>
                      <div className="bg-muted p-4 rounded-md">
                        <p className="font-semibold">{day.accommodation.name}</p>
                        <p className="text-sm text-muted-foreground mb-2">{day.accommodation.type}</p>
                        <p className="text-sm mb-2">{day.accommodation.location}</p>
                        {day.accommodation.checkIn && day.accommodation.checkOut && (
                          <p className="text-xs text-muted-foreground mb-2">
                            Check-in: {day.accommodation.checkIn} • Check-out: {day.accommodation.checkOut}
                          </p>
                        )}
                        {day.accommodation.amenities && day.accommodation.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {day.accommodation.amenities.map((amenity, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{amenity}</Badge>
                            ))}
                          </div>
                        )}
                        <p className="text-sm font-medium">Cost: {day.accommodation.cost}</p>
                      </div>
                      
                      {/* Day Summary */}
                      <div className="mt-4 space-y-2">
                        {(day.dayStartLocation || day.dayEndLocation) && (
                          <div className="p-3 bg-background rounded-md text-sm">
                            {day.dayStartLocation && (
                              <p><strong>Start:</strong> {day.dayStartLocation}</p>
                            )}
                            {day.dayEndLocation && (
                              <p><strong>End:</strong> {day.dayEndLocation}</p>
                            )}
                            {day.totalTravelTime && (
                              <p className="text-muted-foreground">
                                Travel: {day.totalTravelTime} • {day.totalDistance}
                              </p>
                            )}
                          </div>
                        )}
                        <div className="p-3 bg-primary/10 rounded-md">
                          <p className="font-semibold text-primary">Day Total: {day.totalDayCost}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            })}
          </div>

          {/* Why This Itinerary Section - Weather-Based Recommendations */}
          {weatherData && weatherData.daily.length > 0 && (
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span className="text-2xl">🎯</span>
                  Why We Recommend This Itinerary (Weather-Based)
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Our AI analyzed real-time weather data to optimize your experience. Here's why each day is planned this way:
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-1 gap-4">
                  {generatedItinerary.days.map((day, idx) => {
                    const dayWeather = weatherData.daily[idx];
                    if (!dayWeather) return null;
                    
                    // Weather analysis
                    const isRainy = dayWeather.condition.toLowerCase().includes('rain');
                    const isClear = !dayWeather.condition.toLowerCase().includes('rain') && !dayWeather.condition.toLowerCase().includes('cloud');
                    const isHot = dayWeather.temperature > 32;
                    const isCold = dayWeather.temperature < 15;
                    const lowVisibility = dayWeather.visibility < 5;
                    const goodVisibility = dayWeather.visibility >= 8;
                    const highHumidity = dayWeather.humidity > 75;
                    const windyDay = dayWeather.windSpeed > 20;
                    const highUV = (dayWeather.uvIndex || 0) > 7;
                    
                    return (
                      <div key={idx} className="bg-background/70 dark:bg-muted/70 p-5 rounded-lg border-2 border-emerald-200 dark:border-emerald-700 hover:shadow-lg transition-shadow">
                        {/* Day Header */}
                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-purple-200 dark:border-purple-700">
                          <div className="flex items-center gap-3">
                            <Badge variant="default" className="font-bold text-base px-3 py-1">Day {day.day}</Badge>
                            <span className="text-lg font-semibold">{day.title}</span>
                          </div>
                        </div>

                        {/* Weather Conditions Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">🌡️</span>
                            <div>
                              <div className="text-xs text-muted-foreground">Temperature</div>
                              <div className="font-semibold text-sm">{dayWeather.temperature}°C</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">👁️</span>
                            <div>
                              <div className="text-xs text-muted-foreground">Visibility</div>
                              <div className="font-semibold text-sm">{dayWeather.visibility} km</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">💧</span>
                            <div>
                              <div className="text-xs text-muted-foreground">Humidity</div>
                              <div className="font-semibold text-sm">{dayWeather.humidity}%</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">💨</span>
                            <div>
                              <div className="text-xs text-muted-foreground">Wind Speed</div>
                              <div className="font-semibold text-sm">{dayWeather.windSpeed} km/h</div>
                            </div>
                          </div>
                        </div>

                        {/* Weather-Based Recommendations */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm flex items-center gap-2 text-purple-700 dark:text-purple-300">
                            <span>💡</span> Why This Day Is Planned This Way:
                          </h4>
                          
                          <div className="space-y-2 text-sm">
                            {/* Primary Weather Condition */}
                            {isRainy && (
                              <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                                <span className="text-lg">☔</span>
                                <div>
                                  <strong className="text-blue-700 dark:text-blue-300">Rainy Day Strategy:</strong>
                                  <p className="text-muted-foreground mt-1">
                                    We've scheduled indoor activities like museums, cultural centers, and covered markets. 
                                    {day.activities.length > 0 && ` Starting with ${day.activities[0].activity} to keep you dry and comfortable.`}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {isClear && !isHot && (
                              <div className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                                <span className="text-lg">☀️</span>
                                <div>
                                  <strong className="text-yellow-700 dark:text-yellow-300">Perfect Weather Day:</strong>
                                  <p className="text-muted-foreground mt-1">
                                    Ideal conditions for outdoor adventures! We've planned waterfalls, trekking, and nature experiences. 
                                    {day.activities.length > 0 && ` Enjoy ${day.activities[0].activity} in optimal conditions.`}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {isHot && (
                              <div className="flex items-start gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                                <span className="text-lg">🌡️</span>
                                <div>
                                  <strong className="text-orange-700 dark:text-orange-300">Hot Day Planning:</strong>
                                  <p className="text-muted-foreground mt-1">
                                    Activities scheduled for cooler morning/evening hours. Midday includes shaded or air-conditioned locations to beat the heat.
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {isCold && (
                              <div className="flex items-start gap-2 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded">
                                <span className="text-lg">🧥</span>
                                <div>
                                  <strong className="text-indigo-700 dark:text-indigo-300">Cool Weather Adaptation:</strong>
                                  <p className="text-muted-foreground mt-1">
                                    Later morning start with warm indoor activities mixed with scenic outdoor viewing during warmest hours.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Visibility-Based Recommendations */}
                            {goodVisibility && (
                              <div className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                <span className="text-lg">👁️</span>
                                <div>
                                  <strong className="text-green-700 dark:text-green-300">Excellent Visibility ({dayWeather.visibility} km):</strong>
                                  <p className="text-muted-foreground mt-1">
                                    Perfect for scenic viewpoints, photography, and panoramic experiences. You'll get stunning views of landscapes and monuments.
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {lowVisibility && (
                              <div className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-900/20 rounded">
                                <span className="text-lg">🌫️</span>
                                <div>
                                  <strong className="text-gray-700 dark:text-gray-300">Low Visibility ({dayWeather.visibility} km):</strong>
                                  <p className="text-muted-foreground mt-1">
                                    Focus on close-range activities like exploring local markets, temples, and cultural experiences where distant views aren't essential.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Humidity Considerations */}
                            {highHumidity && !isRainy && (
                              <div className="flex items-start gap-2 p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded">
                                <span className="text-lg">💧</span>
                                <div>
                                  <strong className="text-cyan-700 dark:text-cyan-300">High Humidity ({dayWeather.humidity}%):</strong>
                                  <p className="text-muted-foreground mt-1">
                                    Activities paced with frequent breaks. Prioritizing water-related attractions and shaded locations for comfort.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Wind Considerations */}
                            {windyDay && (
                              <div className="flex items-start gap-2 p-2 bg-teal-50 dark:bg-teal-900/20 rounded">
                                <span className="text-lg">💨</span>
                                <div>
                                  <strong className="text-teal-700 dark:text-teal-300">Windy Conditions ({dayWeather.windSpeed} km/h):</strong>
                                  <p className="text-muted-foreground mt-1">
                                    Avoiding exposed hilltops and open areas. Selected sheltered locations and indoor-outdoor mixed activities.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* UV Index Warning */}
                            {highUV && (
                              <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                                <span className="text-lg">☀️</span>
                                <div>
                                  <strong className="text-red-700 dark:text-red-300">High UV Index ({dayWeather.uvIndex}):</strong>
                                  <p className="text-muted-foreground mt-1">
                                    Sun protection essential! Bring sunscreen, hat, and sunglasses. Outdoor activities during less intense UV hours.
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Default for moderate conditions */}
                            {!isRainy && !isClear && !isHot && !isCold && !lowVisibility && !windyDay && (
                              <div className="flex items-start gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                                <span className="text-lg">🌤️</span>
                                <div>
                                  <strong className="text-purple-700 dark:text-purple-300">Balanced Conditions:</strong>
                                  <p className="text-muted-foreground mt-1">
                                    Flexible activities that work in any weather, with both indoor and outdoor options optimized for your comfort.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations & Tips */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  💡 General Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedItinerary.recommendations.map((tip, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-blue-600" />
                  Weather-Based Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedItinerary.weatherTips.map((tip, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
                {generatedItinerary.weatherBasedRecommendations && generatedItinerary.weatherBasedRecommendations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      ⚡ Smart Adjustments
                    </p>
                    <ul className="space-y-2">
                      {generatedItinerary.weatherBasedRecommendations.map((rec, idx) => (
                        <li key={idx} className="text-xs flex items-start gap-2 text-blue-700 dark:text-blue-300">
                          <span>→</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  🎭 Cultural Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedItinerary.culturalTips.map((tip, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Weather Forecast Summary (if available) */}
          {weatherData && weatherData.daily.length > 0 && (
            <Card className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border-sky-200 dark:border-sky-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  Weather Forecast Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {weatherData.daily.slice(0, parseInt(preferences.duration) || 5).map((day, idx) => (
                    <div key={idx} className="bg-background dark:bg-muted p-3 rounded-lg shadow-sm text-center">
                      <p className="text-sm font-medium mb-2">Day {idx + 1}</p>
                      <div className="flex justify-center mb-2">
                        {day.condition.toLowerCase().includes('rain') ? (
                          <CloudRain className="h-8 w-8 text-blue-500" />
                        ) : day.condition.toLowerCase().includes('cloud') ? (
                          <Cloud className="h-8 w-8 text-gray-500" />
                        ) : (
                          <Sun className="h-8 w-8 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-2xl font-bold">{day.temperature}°C</p>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">{day.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="outline" size="lg" onClick={() => goToStep(1)}>
                  Plan Another Trip
                </Button>
                <Button size="lg" onClick={handleBookAccommodations}>
                  Book Selected Accommodations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default AITripPlanner;
