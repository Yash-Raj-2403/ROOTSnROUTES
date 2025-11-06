import Groq from "groq-sdk";
import { allDestinations, Destination } from "@/data/completeDestinations.ts";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface UserPreferences {
  interests: string[];
  duration: number; // days
  budget: 'low' | 'medium' | 'high';
  travelStyle: 'adventure' | 'cultural' | 'relaxation' | 'family' | 'solo';
  startDate?: string;
  groupSize: number;
  accessibility?: boolean;
  transportation?: 'car' | 'public' | 'mixed';
}

export interface ItineraryItem {
  day: number;
  destination: Destination;
  activities: string[];
  timeSlots: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  estimatedCost: number;
  travelTime: string;
  tips: string[];
}

export interface GeneratedItinerary {
  id: string;
  title: string;
  totalDays: number;
  totalEstimatedCost: number;
  itinerary: ItineraryItem[];
  generalTips: string[];
  bestRouteMap: string;
  weatherConsiderations: string;
}

export interface AIItineraryItem {
  destination: string;
  day: number;
  activities: string[];
  timeSlots: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  estimatedCost: number;
  travelTime: string;
  tips: string[];
}

export interface SavedItinerary extends GeneratedItinerary {
  userId: string;
  createdAt: string;
}

class AIItineraryService {
  private filterDestinationsByPreferences(preferences: UserPreferences): Destination[] {
    let filtered = allDestinations.filter(dest => {
      // Filter by interests (map to categories)
      const interestCategories: { [key: string]: string[] } = {
        'nature': ['waterfalls', 'hills', 'parks', 'forests', 'lakes'],
        'heritage': ['temples', 'forts', 'museums', 'cultural'],
        'adventure': ['trekking', 'wildlife', 'sports'],
        'spiritual': ['temples', 'religious'],
        'wildlife': ['parks', 'sanctuaries', 'forests']
      };

      const relevantCategories = preferences.interests.flatMap(
        interest => interestCategories[interest] || [interest]
      );

      return relevantCategories.some(category => 
        dest.category.toLowerCase().includes(category.toLowerCase())
      );
    });

    // Filter by budget (using entry fee as proxy)
    if (preferences.budget === 'low') {
      filtered = filtered.filter(dest => 
        dest.entryFee.toLowerCase().includes('free') || 
        parseInt(dest.entryFee.replace(/[^0-9]/g, '')) < 100
      );
    } else if (preferences.budget === 'medium') {
      filtered = filtered.filter(dest => 
        dest.entryFee.toLowerCase().includes('free') ||
        parseInt(dest.entryFee.replace(/[^0-9]/g, '')) < 500
      );
    }

    // Prioritize highly rated destinations
    filtered.sort((a, b) => b.rating - a.rating);
    
    return filtered.slice(0, Math.min(filtered.length, preferences.duration * 2));
  }

  private async generateAIItinerary(
    destinations: Destination[], 
    preferences: UserPreferences
  ): Promise<GeneratedItinerary> {
    const prompt = `Create a detailed ${preferences.duration}-day travel itinerary for Jharkhand, India based on these preferences:
    
    User Preferences:
    - Interests: ${preferences.interests.join(', ')}
    - Budget: ${preferences.budget}
    - Travel Style: ${preferences.travelStyle}
    - Group Size: ${preferences.groupSize}
    - Duration: ${preferences.duration} days
    ${preferences.transportation ? `- Transportation: ${preferences.transportation}` : ''}
    ${preferences.accessibility ? '- Accessibility requirements needed' : ''}
    
    Available Destinations:
    ${destinations.map(dest => `
    - ${dest.name} (${dest.district}): ${dest.description}
      Category: ${dest.category}, Rating: ${dest.rating}
      Entry Fee: ${dest.entryFee}, Best Time: ${dest.bestTime}
      Key Features: ${dest.keyFeatures.join(', ')}
    `).join('')}
    
    Please create a JSON response with this structure:
    {
      "title": "Memorable trip title",
      "itinerary": [
        {
          "day": 1,
          "destination": "destination name from the list",
          "activities": ["morning activity", "afternoon activity", "evening activity"],
          "timeSlots": {
            "morning": "9:00 AM - Activity description",
            "afternoon": "2:00 PM - Activity description", 
            "evening": "6:00 PM - Activity description"
          },
          "estimatedCost": 1500,
          "travelTime": "2 hours from previous location",
          "tips": ["helpful tip 1", "helpful tip 2"]
        }
      ],
      "totalEstimatedCost": 15000,
      "generalTips": ["general travel tip 1", "general travel tip 2"],
      "bestRouteMap": "Route description with directions",
      "weatherConsiderations": "Weather advice for the planned dates"
    }
    
    Make sure to:
    1. Optimize travel routes to minimize travel time
    2. Consider local culture and customs
    3. Include realistic costs in Indian Rupees
    4. Suggest authentic local experiences
    5. Account for rest time and meals
    6. Include emergency contact information in tips`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert travel planner specializing in Jharkhand tourism. Create detailed, practical itineraries that showcase the best of local culture, nature, and experiences while being mindful of budget and time constraints."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama-3.1-70b-versatile",
        temperature: 0.7,
        max_tokens: 4000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from AI service');
      }

      // Parse the JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI service');
      }

      const aiItinerary = JSON.parse(jsonMatch[0]);
      
      // Map destinations to actual destination objects
      const mappedItinerary = aiItinerary.itinerary.map((item: AIItineraryItem, index: number) => {
        const destination = destinations.find(dest => 
          dest.name.toLowerCase().includes(item.destination.toLowerCase()) ||
          item.destination.toLowerCase().includes(dest.name.toLowerCase())
        ) || destinations[index % destinations.length];

        return {
          ...item,
          destination
        };
      });

      return {
        id: `itinerary_${Date.now()}`,
        title: aiItinerary.title,
        totalDays: preferences.duration,
        totalEstimatedCost: aiItinerary.totalEstimatedCost,
        itinerary: mappedItinerary,
        generalTips: aiItinerary.generalTips || [],
        bestRouteMap: aiItinerary.bestRouteMap || "Route information will be provided in the detailed view",
        weatherConsiderations: aiItinerary.weatherConsiderations || "Check weather conditions before traveling"
      };
    } catch (error) {
      console.error('AI Itinerary Generation Error:', error);
      
      // Fallback to rule-based itinerary
      return this.generateFallbackItinerary(destinations, preferences);
    }
  }

  private generateFallbackItinerary(destinations: Destination[], preferences: UserPreferences): GeneratedItinerary {
    const itinerary: ItineraryItem[] = destinations.slice(0, preferences.duration).map((dest, index) => ({
      day: index + 1,
      destination: dest,
      activities: [
        `Explore ${dest.name}`,
        `Photography and sightseeing`,
        `Local cultural experience`
      ],
      timeSlots: {
        morning: `9:00 AM - Arrival and initial exploration of ${dest.name}`,
        afternoon: `2:00 PM - ${dest.keyFeatures[0] || 'Main attraction visit'}`,
        evening: `6:00 PM - ${dest.keyFeatures[1] || 'Sunset viewing and local cuisine'}`
      },
      estimatedCost: preferences.budget === 'low' ? 1000 : preferences.budget === 'medium' ? 2500 : 4000,
      travelTime: index === 0 ? "Starting point" : "2-3 hours from previous location",
      tips: [
        `Best time to visit: ${dest.bestTime}`,
        `Entry fee: ${dest.entryFee}`,
        "Carry water and snacks"
      ]
    }));

    return {
      id: `fallback_itinerary_${Date.now()}`,
      title: `${preferences.duration}-Day Jharkhand Discovery Tour`,
      totalDays: preferences.duration,
      totalEstimatedCost: itinerary.reduce((sum, item) => sum + item.estimatedCost, 0),
      itinerary,
      generalTips: [
        "Book accommodations in advance",
        "Respect local customs and traditions",
        "Carry first aid kit for outdoor activities",
        "Learn basic Hindi phrases for better communication"
      ],
      bestRouteMap: "Optimized route connecting all destinations with minimal travel time",
      weatherConsiderations: "Check local weather conditions and pack accordingly"
    };
  }

  async generateItinerary(preferences: UserPreferences): Promise<GeneratedItinerary> {
    try {
      // Validate preferences
      if (!preferences.interests.length || preferences.duration < 1) {
        throw new Error('Invalid preferences provided');
      }

      // Filter destinations based on preferences
      const suitableDestinations = this.filterDestinationsByPreferences(preferences);
      
      if (suitableDestinations.length === 0) {
        throw new Error('No suitable destinations found for your preferences');
      }

      // Generate AI-powered itinerary
      return await this.generateAIItinerary(suitableDestinations, preferences);
    } catch (error) {
      console.error('Itinerary Generation Error:', error);
      throw error;
    }
  }

  async saveItinerary(itinerary: GeneratedItinerary, userId?: string): Promise<void> {
    try {
      // Save to localStorage for now, can be extended to use Supabase
      const savedItineraries = JSON.parse(localStorage.getItem('savedItineraries') || '[]');
      const itineraryToSave = {
        ...itinerary,
        userId: userId || 'anonymous',
        createdAt: new Date().toISOString()
      };
      
      savedItineraries.push(itineraryToSave);
      localStorage.setItem('savedItineraries', JSON.stringify(savedItineraries));
    } catch (error) {
      console.error('Error saving itinerary:', error);
      throw error;
    }
  }

  getSavedItineraries(userId?: string): GeneratedItinerary[] {
    try {
      const savedItineraries = JSON.parse(localStorage.getItem('savedItineraries') || '[]');
      return savedItineraries.filter((itinerary: SavedItinerary) => 
        !userId || itinerary.userId === userId || itinerary.userId === 'anonymous'
      );
    } catch (error) {
      console.error('Error loading saved itineraries:', error);
      return [];
    }
  }
}

export const aiItineraryService = new AIItineraryService();