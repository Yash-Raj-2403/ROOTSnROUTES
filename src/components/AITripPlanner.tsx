import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { useToast } from './ui/use-toast';
import { Calendar, Clock, MapPin, Users, Sparkles, Download, Share, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import Groq from 'groq-sdk';

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
}

const AITripPlanner = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
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
    travelRadius: 'flexible'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<GeneratedItinerary | null>(null);
  const [step, setStep] = useState(1);

  // Cache for API responses
  const itineraryCache = useMemo(() => new Map<string, GeneratedItinerary>(), []);

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
    
    // Create cache key from preferences
    const cacheKey = JSON.stringify({
      duration: preferences.duration,
      budget: preferences.budget,
      interests: preferences.interests.sort(),
      groupSize: preferences.groupSize,
      targetAreas: preferences.targetAreas.sort()
    });
    
    // Check cache first
    const cachedResult = itineraryCache.get(cacheKey);
    if (cachedResult) {
      console.log('Using cached itinerary');
      setGeneratedItinerary(cachedResult);
      setIsGenerating(false);
      setStep(3);
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

      // Create detailed prompt for AI
      const prompt = `You are an expert travel planner specializing in Jharkhand tourism. Create a detailed, realistic ${preferences.duration}-day itinerary with proper time management and travel directions.

**Trip Details:**
- Duration: ${preferences.duration} days
- Budget: ${preferences.budget} (${preferences.budget === 'budget' ? '₹2,000-5,000/day' : preferences.budget === 'mid-range' ? '₹5,000-10,000/day' : '₹10,000+/day'})
- Group Size: ${preferences.groupSize}
- Travel Style: ${preferences.travelStyle}
- Accommodation Preference: ${preferences.accommodation}
- Target Areas: ${preferences.targetAreas.join(', ') || 'All of Jharkhand'}
- Interests: ${preferences.interests.join(', ') || 'General sightseeing'}
- Special Requests: ${preferences.specialRequests || 'None'}

**CRITICAL REQUIREMENTS:**
1. Plan activities in SEQUENTIAL ORDER with realistic timing
2. For each activity, include:
   - Exact time (e.g., "08:30 AM")
   - Duration of activity
   - Travel time to next location
   - Best route/transportation mode (e.g., "20 min drive via NH33", "45 min local bus")
3. Account for:
   - Morning: Start around 7-8 AM (after breakfast)
   - Lunch break: 12:30-2:00 PM
   - Evening: Activities until 6-7 PM
   - Travel time between locations (be realistic!)
4. Include specific directions like:
   - "From Ranchi, take NH33 towards Hundru Falls (45km, 1 hour drive)"
   - "Local auto-rickshaw from hotel (15 min, ₹50)"
5. Real places in Jharkhand: Hundru Falls, Dassam Falls, Tagore Hill, Betla National Park, Netarhat, etc.
6. Calculate costs realistically (entry fees, transport, meals)

**Format your response as valid JSON:**
{
  "title": "Captivating trip title",
  "description": "Engaging 2-3 sentence description",
  "totalCost": "₹XX,XXX",
  "days": [
    {
      "day": 1,
      "title": "Day title with main focus",
      "activities": [
        {
          "time": "08:30 AM",
          "activity": "Activity name",
          "location": "Specific location with district",
          "description": "What you'll experience",
          "duration": "2 hours",
          "cost": "₹XXX",
          "type": "Cultural/Nature/Adventure",
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
    "Best time to visit each location",
    "What to carry (weather-specific)",
    "Safety tips for the region"
  ],
  "weatherTips": [
    "Current season weather details",
    "What to pack",
    "Best time for outdoor activities"
  ],
  "culturalTips": [
    "Tribal etiquette and customs",
    "Local festivals during visit",
    "Photography permissions",
    "Language tips (local greetings)"
  ]
}

BE REALISTIC: Use actual places, real travel times, proper costs, and sequential timing!`;

      // Call Groq API with active model
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert Jharkhand travel planner with deep knowledge of routes, timings, and logistics. Create realistic, sequential itineraries with proper time management and travel directions. Always respond with valid JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.3-70b-versatile', // Updated to active model
        temperature: 0.8,
        max_tokens: 8000,
        response_format: { type: 'json_object' }
      });

      const responseContent = chatCompletion.choices[0]?.message?.content || '';
      
      // Parse AI response
      const aiItinerary = JSON.parse(responseContent);
      
      // Cache the result
      itineraryCache.set(cacheKey, aiItinerary as GeneratedItinerary);
      
      setGeneratedItinerary(aiItinerary as GeneratedItinerary);
      setStep(3);
      
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
  }, [preferences, itineraryCache]);

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
            step >= num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {num}
          </div>
          {num < 3 && (
            <div className={`w-16 h-1 ${step > num ? 'bg-primary' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {renderStepIndicator()}
        
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              AI Trip Planner
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              Tell us your preferences, and our AI will create the perfect Jharkhand itinerary
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Trip Duration</label>
                <Select value={preferences.duration} onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, duration: value }))
                }>
                  <SelectTrigger>
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
                <label className="text-sm font-medium mb-2 block">Budget Range</label>
                <Select value={preferences.budget} onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, budget: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget (₹2,000-5,000/day)</SelectItem>
                    <SelectItem value="mid-range">Mid-range (₹5,000-10,000/day)</SelectItem>
                    <SelectItem value="luxury">Luxury (₹10,000+/day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Group Size</label>
                <Select value={preferences.groupSize} onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, groupSize: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group size" />
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
                    <SelectValue placeholder="Select style" />
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
              <label className="text-sm font-medium mb-2 block">Accommodation Preference</label>
              <Select value={preferences.accommodation} onValueChange={(value) => 
                setPreferences(prev => ({ ...prev, accommodation: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select accommodation" />
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
              <label className="text-sm font-medium mb-3 block">Interests & Activities</label>
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
              <label className="text-sm font-medium mb-2 block">Special Requests</label>
              <Textarea
                placeholder="Any special requirements, dietary restrictions, mobility needs, or specific places you want to visit..."
                value={preferences.specialRequests}
                onChange={(e) => setPreferences(prev => ({ ...prev, specialRequests: e.target.value }))}
                rows={3}
              />
            </div>

            <Button 
              onClick={() => setStep(2)}
              className="w-full py-3 text-lg"
              disabled={!preferences.duration || !preferences.budget || !preferences.groupSize}
            >
              Next: Review Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {renderStepIndicator()}
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Review Your Preferences</CardTitle>
            <p className="text-center text-muted-foreground">
              Confirm your details before we generate your personalized itinerary
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-muted-foreground">{preferences.duration} Days</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Group Size</p>
                    <p className="text-muted-foreground">{preferences.groupSize}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5 text-primary">💰</span>
                  <div>
                    <p className="font-medium">Budget</p>
                    <p className="text-muted-foreground">{preferences.budget}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Travel Style</p>
                    <p className="text-muted-foreground">{preferences.travelStyle}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="font-medium mb-2">Selected Interests:</p>
              <div className="flex flex-wrap gap-2">
                {preferences.interests.map((interest) => (
                  <Badge key={interest} variant="secondary">{interest}</Badge>
                ))}
              </div>
            </div>

            {preferences.specialRequests && (
              <div>
                <p className="font-medium mb-2">Special Requests:</p>
                <p className="text-muted-foreground bg-muted p-3 rounded-md">
                  {preferences.specialRequests}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
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
      <div className="max-w-6xl mx-auto p-6">
        {renderStepIndicator()}
        
        <div className="space-y-6">
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
            {generatedItinerary.days.map((day) => (
              <Card key={day.day} className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                      {day.day}
                    </span>
                    {day.title}
                  </CardTitle>
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
            ))}
          </div>

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

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  🌦️ Weather Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedItinerary.weatherTips.map((tip, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
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

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              Plan Another Trip
            </Button>
            <Button>
              Book Selected Accommodations
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AITripPlanner;