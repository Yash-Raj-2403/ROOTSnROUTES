import completeDestinations from '@/data/completeDestinations';
import { districtsData } from '@/data/districtsData';

interface TripPreferences {
  duration: string;
  budget: string;
  groupSize: string;
  interests: string[];
  travelStyle: string;
  accommodation: string;
  selectedDistricts: string[];
}

interface TripPlan {
  itinerary: DayPlan[];
  totalCost: number;
  recommendations: string[];
  weatherTips: string[];
}

interface DayPlan {
  day: number;
  location: string;
  activities: Activity[];
  accommodation: string;
  meals: string[];
  estimatedCost: number;
}

interface Activity {
  name: string;
  type: string;
  duration: string;
  cost: number;
  description: string;
}

class SmartTripPlannerService {
  private getBudgetRange(budget: string): { min: number; max: number } {
    const ranges: Record<string, { min: number; max: number }> = {
      'budget': { min: 1000, max: 3000 },
      'moderate': { min: 3000, max: 8000 },
      'luxury': { min: 8000, max: 20000 },
      'premium': { min: 20000, max: 50000 }
    };
    return ranges[budget] || ranges['moderate'];
  }

  private getDestinationsByInterests(districts: string[], interests: string[]) {
    return completeDestinations.filter(dest => {
      if (districts.length > 0 && !districts.includes(dest.district)) return false;
      
      return interests.some(interest => {
        const lowerInterest = interest.toLowerCase();
        return dest.category.toLowerCase().includes(lowerInterest) ||
               dest.keyFeatures.some(feature => feature.toLowerCase().includes(lowerInterest)) ||
               dest.whyFamous.toLowerCase().includes(lowerInterest);
      });
    });
  }

  private calculateOptimalRoute(destinations: any[], startDistrict: string) {
    // Simple distance-based routing (can be enhanced with actual distance calculation)
    const sorted = [...destinations].sort((a, b) => {
      const aDistance = this.getDistrictDistance(startDistrict, a.district);
      const bDistance = this.getDistrictDistance(startDistrict, b.district);
      return aDistance - bDistance;
    });
    return sorted;
  }

  private getDistrictDistance(from: string, to: string): number {
    // Simplified distance calculation - in real app, use actual coordinates
    const distances: Record<string, Record<string, number>> = {
      'Ranchi': { 'Jamshedpur': 130, 'Dhanbad': 160, 'Deoghar': 250, 'Hazaribagh': 90 },
      'Jamshedpur': { 'Ranchi': 130, 'Dhanbad': 170, 'Deoghar': 280, 'Hazaribagh': 200 },
      // Add more distance data
    };
    return distances[from]?.[to] || Math.random() * 300; // Fallback to random for demo
  }

  private generateAccommodationSuggestion(district: string, budget: string, style: string) {
    const accommodationTypes: Record<string, string[]> = {
      'budget': ['Homestay', 'Guest House', 'Budget Hotel'],
      'moderate': ['3-Star Hotel', 'Heritage Homestay', 'Eco Lodge'],
      'luxury': ['4-Star Resort', 'Heritage Hotel', 'Luxury Lodge'],
      'premium': ['5-Star Resort', 'Palace Hotel', 'Premium Eco Resort']
    };
    
    const types = accommodationTypes[budget] || accommodationTypes['moderate'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private generateMealSuggestions(district: string, day: number) {
    const localCuisines: Record<string, string[]> = {
      'Ranchi': ['Tribal Thali', 'Litti Chokha', 'Handia', 'Bamboo Shoot Curry'],
      'Jamshedpur': ['Bengali Fish Curry', 'Tribal Cuisine', 'Street Food'],
      'Deoghar': ['Temple Prasad', 'Local Sweets', 'Vegetarian Thali'],
      'Dhanbad': ['Coal Mine Workers Special', 'Bengali Cuisine', 'Local Dhabas']
    };
    
    const meals = localCuisines[district] || ['Local Cuisine', 'Traditional Thali', 'Regional Specialties'];
    return meals.slice(0, 3); // Breakfast, Lunch, Dinner
  }

  public async generateTripPlan(preferences: TripPreferences): Promise<TripPlan> {
    const budgetRange = this.getBudgetRange(preferences.budget);
    const duration = parseInt(preferences.duration);
    
    // Get relevant destinations based on interests and selected districts
    let relevantDestinations = this.getDestinationsByInterests(
      preferences.selectedDistricts, 
      preferences.interests
    );
    
    // If no specific interests, get top destinations from selected districts
    if (relevantDestinations.length === 0 && preferences.selectedDistricts.length > 0) {
      relevantDestinations = completeDestinations.filter(dest => 
        preferences.selectedDistricts.includes(dest.district)
      ).slice(0, duration * 2); // 2 destinations per day max
    }

    // Calculate optimal route
    const startDistrict = preferences.selectedDistricts[0] || 'Ranchi';
    const routedDestinations = this.calculateOptimalRoute(relevantDestinations, startDistrict);
    
    // Generate day-wise itinerary
    const itinerary: DayPlan[] = [];
    const destinationsPerDay = Math.ceil(routedDestinations.length / duration);
    
    for (let day = 1; day <= duration; day++) {
      const dayDestinations = routedDestinations.slice(
        (day - 1) * destinationsPerDay, 
        day * destinationsPerDay
      );
      
      const currentDistrict = dayDestinations[0]?.district || startDistrict;
      
      const activities: Activity[] = dayDestinations.map(dest => ({
        name: dest.name,
        type: dest.category,
        duration: '2-3 hours',
        cost: budgetRange.min / duration * 0.4, // 40% of daily budget for activities
        description: dest.description
      }));

      const dayPlan: DayPlan = {
        day,
        location: currentDistrict,
        activities,
        accommodation: this.generateAccommodationSuggestion(currentDistrict, preferences.budget, preferences.travelStyle),
        meals: this.generateMealSuggestions(currentDistrict, day),
        estimatedCost: budgetRange.min / duration
      };
      
      itinerary.push(dayPlan);
    }

    // Generate recommendations based on preferences
    const recommendations = this.generateRecommendations(preferences, itinerary);
    const weatherTips = this.generateWeatherTips(preferences.selectedDistricts);

    return {
      itinerary,
      totalCost: budgetRange.min,
      recommendations,
      weatherTips
    };
  }

  private generateRecommendations(preferences: TripPreferences, itinerary: DayPlan[]): string[] {
    const recommendations: string[] = [];
    
    // Budget-based recommendations
    if (preferences.budget === 'budget') {
      recommendations.push('Consider staying in tribal homestays for authentic experience and cost savings');
      recommendations.push('Use local transportation and shared jeeps to reduce costs');
    }
    
    // Group size recommendations
    if (parseInt(preferences.groupSize) > 4) {
      recommendations.push('Book group accommodations and transportation in advance');
      recommendations.push('Consider hiring a local guide for better group management');
    }
    
    // Interest-based recommendations
    if (preferences.interests.includes('Adventure')) {
      recommendations.push('Pack appropriate gear for trekking and outdoor activities');
      recommendations.push('Check weather conditions before adventure activities');
    }
    
    return recommendations;
  }

  private generateWeatherTips(districts: string[]): string[] {
    return [
      'Best time to visit Jharkhand is October to March',
      'Carry light woolens during winter months',
      'Monsoon season (July-September) can make some areas inaccessible',
      'Summer months can be quite hot, plan indoor activities during peak hours'
    ];
  }
}

export const tripPlannerService = new SmartTripPlannerService();