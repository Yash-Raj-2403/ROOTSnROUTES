import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Sun, Cloud, CloudRain, Wind, Thermometer, Droplets, Eye, Zap,
  Mountain, Camera, Umbrella, Backpack, TreePine, MapPin, Clock,
  AlertTriangle, CheckCircle, XCircle, Calendar
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  uvIndex: number;
  precipitation: number;
  icon: string;
  airQuality: string;
  sunrise: string;
  sunset: string;
}

interface ActivityRecommendation {
  activity: string;
  suitability: 'excellent' | 'good' | 'fair' | 'poor' | 'dangerous';
  reason: string;
  tips: string[];
  locations: string[];
  bestTime: string;
  equipment: string[];
  cost: string;
  icon: string;
  category: 'outdoor' | 'indoor' | 'cultural' | 'adventure' | 'photography';
}

interface SmartRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: 'activity' | 'safety' | 'planning' | 'equipment';
  action?: string;
}

const SmartWeatherRecommendations = () => {
  const { t } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState('Ranchi');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<ActivityRecommendation[]>([]);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartRecommendation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const locations = [
    'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 
    'Giridih', 'Ramgarh', 'Palamu', 'West Singhbhum', 'Netarhat', 'Hundru Falls'
  ];

  // Location-specific attractions and activities
  const locationSpecificData: Record<string, {
    waterfalls: string[];
    wildlife: string[];
    hills: string[];
    photography: string[];
    cultural: string[];
    museums: string[];
  }> = {
    'Ranchi': {
      waterfalls: ['Hundru Falls', 'Jonha Falls', 'Dassam Falls'],
      wildlife: ['Birsa Zoological Park', 'Ranchi Lake Birds'],
      hills: ['Rock Garden', 'Tagore Hill', 'Ranchi Hills'],
      photography: ['Rock Garden Ranchi', 'Jagannath Temple', 'Patratu Valley'],
      cultural: ['Santal Villages in Khunti', 'Munda Villages near Ranchi', 'Oraon Villages in Gumla'],
      museums: ['Ranchi State Museum', 'Tribal Research Institute', 'Local Handicraft Centers']
    },
    'Jamshedpur': {
      waterfalls: ['Dimna Lake Waterfall', 'Dalma Hills Streams'],
      wildlife: ['Dalma Wildlife Sanctuary', 'Dimna Lake Wildlife'],
      hills: ['Dalma Hills', 'Tata Steel Zoological Park'],
      photography: ['Jubilee Park', 'Tata Steel Works', 'Dalma Hills Viewpoint'],
      cultural: ['Ho Tribal Villages', 'Saraikela Chhau Dance Centers'],
      museums: ['Science City', 'Tribal Heritage Museum', 'Steel Plant Museum']
    },
    'Dhanbad': {
      waterfalls: ['Maithon Dam Falls', 'Topchanchi Streams'],
      wildlife: ['Topchanchi Wildlife Sanctuary'],
      hills: ['Parasnath Hills', 'Topchanchi Hills'],
      photography: ['Maithon Dam', 'Coal Mine Landscapes', 'Parasnath Temple'],
      cultural: ['Coal Mining Heritage Sites', 'Local Tribal Communities'],
      museums: ['Coal Mining Museum', 'ISM Heritage Building', 'Geological Museum']
    },
    'Bokaro': {
      waterfalls: ['Bokaro River Falls', 'Tenughat Dam'],
      wildlife: ['Jawaharlal Nehru Biological Park'],
      hills: ['Bokaro Hills', 'Tenughat Hills'],
      photography: ['Bokaro Steel Plant', 'City Park', 'Tenughat Dam'],
      cultural: ['Steel Township Heritage', 'Local Tribal Villages'],
      museums: ['Steel Plant Museum', 'Industrial Heritage Center']
    },
    'Deoghar': {
      waterfalls: ['Nandan Pahar Falls', 'Mayurbhanj Falls'],
      wildlife: ['Nandan Pahar Wildlife'],
      hills: ['Nandan Pahar', 'Trikut Hills'],
      photography: ['Baba Baidyanath Temple', 'Nandan Pahar', 'Trikut Ropeway'],
      cultural: ['Baidyanath Jyotirlinga', 'Sivan Ganga', 'Local Ashrams'],
      museums: ['Temple Museum', 'Spiritual Heritage Center']
    },
    'Hazaribagh': {
      waterfalls: ['Canary Hill Falls', 'Konar Dam'],
      wildlife: ['Hazaribagh Wildlife Sanctuary', 'Canary Hill Wildlife'],
      hills: ['Canary Hill', 'Hazaribagh Hills'],
      photography: ['Hazaribagh Lake', 'Canary Hill Viewpoint', 'Konar Dam'],
      cultural: ['Hazaribagh School of Art', 'Local Tribal Art Centers'],
      museums: ['Shaheed Nirmal Mahto Park', 'Art Gallery', 'Tribal Art Museum']
    },
    'Giridih': {
      waterfalls: ['Khandoli Dam', 'Usri Falls'],
      wildlife: ['Parasnath Wildlife Sanctuary'],
      hills: ['Parasnath Hills', 'Giridih Hills'],
      photography: ['Parasnath Temple', 'Usri Falls', 'Khandoli Dam'],
      cultural: ['Jain Pilgrimage Sites', 'Local Mining Communities'],
      museums: ['Jain Heritage Center', 'Mining Museum']
    },
    'Ramgarh': {
      waterfalls: ['Patratu Valley Falls', 'Ramgarh Hills Streams'],
      wildlife: ['Patratu Valley Wildlife'],
      hills: ['Ramgarh Hills', 'Patratu Valley Hills'],
      photography: ['Patratu Valley', 'Ramgarh Cantonment', 'Hill Station Views'],
      cultural: ['Cantonment Heritage', 'Hill Station Culture'],
      museums: ['Ramgarh Heritage Museum', 'Military Museum']
    },
    'Palamu': {
      waterfalls: ['Lodh Falls', 'Auranga River Falls'],
      wildlife: ['Betla National Park', 'Palamau Tiger Reserve'],
      hills: ['Netarhat Hills', 'Palamu Hills'],
      photography: ['Betla National Park', 'Lodh Falls', 'Netarhat Sunset Point'],
      cultural: ['Palamu Fort', 'Tribal Villages in Latehar'],
      museums: ['Palamu Fort Museum', 'Tiger Reserve Interpretation Center']
    },
    'West Singhbhum': {
      waterfalls: ['Hundru Falls Extension', 'Saranda Forest Streams'],
      wildlife: ['Saranda Forest', 'Chaibasa Wildlife'],
      hills: ['Saranda Hills', 'Chaibasa Hills'],
      photography: ['Saranda Forest', 'Iron Ore Mines', 'Chaibasa Town'],
      cultural: ['Ho Tribal Villages', 'Munda Heritage Sites'],
      museums: ['Tribal Heritage Museum', 'Mining Heritage Center']
    },
    'Netarhat': {
      waterfalls: ['Lower Ghaghri Falls', 'Upper Ghaghri Falls'],
      wildlife: ['Netarhat Wildlife Sanctuary'],
      hills: ['Netarhat Hills', 'Sunrise Point Hills'],
      photography: ['Netarhat Sunrise Point', 'Sunset Point', 'Pine Forest'],
      cultural: ['Hill Station Heritage', 'Colonial Architecture'],
      museums: ['Netarhat Residential School Museum', 'Hill Station Heritage Center']
    },
    'Hundru Falls': {
      waterfalls: ['Hundru Falls Main', 'Jonha Falls', 'Nearby Cascades'],
      wildlife: ['Falls Area Wildlife', 'Forest Birds'],
      hills: ['Falls Surrounding Hills', 'Ranchi Hills Extension'],
      photography: ['Hundru Falls', 'Rainbow at Falls', 'Forest Trails'],
      cultural: ['Local Tribal Settlements', 'Falls Legend Stories'],
      museums: ['Falls Interpretation Center', 'Local Cultural Center']
    }
  };

  const categories = [
    { value: 'all', label: 'All Activities' },
    { value: 'outdoor', label: 'Outdoor Adventures' },
    { value: 'cultural', label: 'Cultural Experiences' },
    { value: 'photography', label: 'Photography' },
    { value: 'indoor', label: 'Indoor Activities' },
    { value: 'adventure', label: 'Adventure Sports' }
  ];

  // Mock weather data (in production, use actual weather API)
  const fetchWeatherData = async (location: string): Promise<WeatherData> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockWeatherData: WeatherData = {
      location,
      temperature: Math.floor(Math.random() * 15) + 18, // 18-33°C
      condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'][Math.floor(Math.random() * 5)],
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      visibility: Math.floor(Math.random() * 5) + 5, // 5-10 km
      uvIndex: Math.floor(Math.random() * 8) + 2, // 2-10
      precipitation: Math.random() < 0.3 ? Math.floor(Math.random() * 10) + 1 : 0, // 0-10mm
      icon: '☀️',
      airQuality: ['Good', 'Moderate', 'Poor'][Math.floor(Math.random() * 3)],
      sunrise: '06:15',
      sunset: '17:45'
    };
    
    setIsLoading(false);
    return mockWeatherData;
  };

  // AI-powered activity recommendations based on weather and location
  const generateWeatherBasedRecommendations = (weather: WeatherData): ActivityRecommendation[] => {
    const activities: ActivityRecommendation[] = [];
    const locationData = locationSpecificData[weather.location] || locationSpecificData['Ranchi'];

    // Waterfall Activities
    if (weather.temperature >= 20 && weather.temperature <= 30 && weather.condition !== 'Heavy Rain') {
      activities.push({
        activity: `${weather.location} Waterfall Experience`,
        suitability: weather.precipitation > 0 ? 'excellent' : 'good',
        reason: weather.precipitation > 0 ? 'Recent rains make waterfalls spectacular!' : 'Perfect weather for waterfall trekking',
        tips: [
          'Wear non-slip footwear',
          'Carry waterproof camera cover',
          'Start early to avoid afternoon heat',
          'Check local water levels before visiting'
        ],
        locations: locationData.waterfalls,
        bestTime: '07:00 - 11:00 AM',
        equipment: ['Trekking shoes', 'Waterproof bag', 'First aid kit'],
        cost: '₹200-500',
        icon: '💧',
        category: 'outdoor'
      });
    }

    // Wildlife Safari
    if (weather.temperature >= 15 && weather.temperature <= 32 && weather.condition !== 'Heavy Rain') {
      activities.push({
        activity: `${weather.location} Wildlife Safari`,
        suitability: weather.temperature <= 28 ? 'excellent' : 'good',
        reason: `${weather.temperature}°C is ideal for wildlife spotting. Animals are more active in this weather.`,
        tips: [
          'Book safari in advance',
          'Carry binoculars',
          'Maintain silence during safari',
          'Early morning safaris are best',
          'Follow park guidelines strictly'
        ],
        locations: locationData.wildlife,
        bestTime: weather.temperature <= 25 ? 'All day' : '06:00-10:00, 15:00-18:00',
        equipment: ['Binoculars', 'Camera with telephoto lens', 'Hat', 'Sunscreen'],
        cost: '₹1,500-3,000',
        icon: '🦁',
        category: 'outdoor'
      });
    }

    // Hill Station Visit
    if (weather.temperature >= 12 && weather.temperature <= 28) {
      activities.push({
        activity: `${weather.location} Hill Exploration`,
        suitability: weather.temperature <= 25 ? 'excellent' : 'good',
        reason: `Perfect ${weather.temperature}°C weather for hill exploration and scenic viewing.`,
        tips: [
          'Carry warm clothes for early morning/evening',
          'Book accommodation in advance',
          'Don\'t miss the sunrise/sunset points',
          'Try local tea and snacks',
          'Wear comfortable walking shoes'
        ],
        locations: locationData.hills,
        bestTime: 'All day, sunrise at 06:15',
        equipment: ['Warm jacket', 'Camera', 'Comfortable walking shoes'],
        cost: '₹2,000-4,000',
        icon: '⛰️',
        category: 'outdoor'
      });
    }

    // Photography Activities
    if (weather.visibility >= 8 && weather.condition !== 'Heavy Rain') {
      activities.push({
        activity: `${weather.location} Photography Tour`,
        suitability: weather.condition === 'Partly Cloudy' ? 'excellent' : 'good',
        reason: `${weather.visibility}km visibility and ${weather.condition} conditions are perfect for photography.`,
        tips: [
          'Golden hour is best (06:00-08:00, 16:00-18:00)',
          'Carry extra batteries in cold weather',
          'Use polarizing filter for landscapes',
          'Respect local customs when photographing people',
          'Ask permission before photographing tribal areas'
        ],
        locations: locationData.photography,
        bestTime: `Golden hours: ${weather.sunrise}-08:00, 16:00-${weather.sunset}`,
        equipment: ['DSLR/Mirrorless camera', 'Tripod', 'Filters', 'Extra batteries'],
        cost: '₹500-1,500',
        icon: '📸',
        category: 'photography'
      });
    }

    // Cultural Activities (Indoor/Outdoor based on weather)
    if (weather.temperature >= 18) {
      activities.push({
        activity: `${weather.location} Cultural Experience`,
        suitability: weather.precipitation <= 5 ? 'good' : 'fair',
        reason: weather.precipitation > 5 ? 'Light rain may affect outdoor cultural programs' : 'Good weather for cultural visits and experiences',
        tips: [
          'Respect local customs and traditions',
          'Ask permission before photographing',
          'Participate in traditional activities',
          'Try authentic local cuisine',
          'Learn about local history and culture'
        ],
        locations: locationData.cultural,
        bestTime: '09:00-17:00',
        equipment: ['Respectful clothing', 'Small gifts for children', 'Camera (with permission)'],
        cost: '₹1,000-2,500',
        icon: '🎭',
        category: 'cultural'
      });
    }

    // Indoor Activities for bad weather
    if (weather.precipitation > 10 || weather.temperature < 15 || weather.temperature > 35) {
      activities.push({
        activity: 'Handicraft Workshop & Museum Visit',
        suitability: 'excellent',
        reason: 'Indoor cultural activities are perfect when outdoor conditions are challenging.',
        tips: [
          'Learn traditional Dokra metal craft',
          'Visit State Museum in Ranchi',
          'Shop for authentic handicrafts',
          'Attend cultural performances'
        ],
        locations: ['Ranchi State Museum', 'Tribal Research Institute', 'Local Handicraft Centers'],
        bestTime: '10:00-17:00',
        equipment: ['Comfortable clothing', 'Notebook for learning', 'Shopping bag'],
        cost: '₹300-1,000',
        icon: '🏛️',
        category: 'indoor'
      });
    }

    // Adventure Activities
    if (weather.temperature >= 18 && weather.temperature <= 30 && weather.windSpeed <= 15 && weather.precipitation === 0) {
      activities.push({
        activity: 'Rock Climbing & Trekking',
        suitability: 'excellent',
        reason: 'Perfect weather conditions with low wind and no precipitation for adventure activities.',
        tips: [
          'Start early to avoid afternoon heat',
          'Carry plenty of water',
          'Inform someone about your trekking plan',
          'Follow safety guidelines'
        ],
        locations: ['McCluskieganj Rock Climbing', 'Parasnath Trekking', 'Rajrappa Hills'],
        bestTime: '06:00-11:00, 15:00-18:00',
        equipment: ['Trekking gear', 'Safety equipment', 'First aid kit', 'GPS device'],
        cost: '₹1,500-4,000',
        icon: '🧗',
        category: 'adventure'
      });
    }

    // Indoor Activities for Poor Weather
    if (weather.condition === 'Heavy Rain' || weather.temperature < 15 || weather.temperature > 35) {
      activities.push({
        activity: `${weather.location} Indoor Cultural Sites`,
        suitability: 'excellent',
        reason: weather.condition === 'Heavy Rain' ? 'Perfect indoor alternative during heavy rain' : 
                weather.temperature < 15 ? 'Warm indoor spaces ideal for cold weather' :
                'Air-conditioned comfort during hot weather',
        tips: [
          'Check opening hours in advance',
          'Allow 2-3 hours for museum visits',
          'Take guided tours for better experience',
          'Respect photography restrictions',
          'Support local artisans by purchasing crafts'
        ],
        locations: locationData.museums,
        bestTime: '10:00-17:00',
        equipment: ['Comfortable indoor shoes', 'Camera (where allowed)', 'Notebook for information'],
        cost: '₹50-300',
        icon: '🏛️',
        category: 'indoor'
      });
    }

    return activities;
  };

  // Generate smart suggestions based on weather and activities
  const generateSmartSuggestions = (weather: WeatherData, activities: ActivityRecommendation[]): SmartRecommendation[] => {
    const suggestions: SmartRecommendation[] = [];

    // Essential items based on temperature
    if (weather.temperature < 15) {
      suggestions.push({
        title: '🧥 Cold Weather Essentials',
        description: `Temperature is ${weather.temperature}°C. Pack warm clothing and layers.`,
        priority: 'high',
        type: 'equipment',
        action: 'Carry: Warm jacket, sweater, thermal wear, gloves, warm socks, and cap'
      });
    } else if (weather.temperature > 32) {
      suggestions.push({
        title: '☀️ Hot Weather Essentials',
        description: `Temperature is ${weather.temperature}°C. Stay cool and hydrated.`,
        priority: 'high',
        type: 'equipment',
        action: 'Carry: Water bottle (2L), light cotton clothes, hat/cap, cooling towel, electrolyte drinks'
      });
    } else {
      suggestions.push({
        title: '🎒 Pleasant Weather Pack',
        description: `Perfect ${weather.temperature}°C weather. Light packing recommended.`,
        priority: 'medium',
        type: 'equipment',
        action: 'Carry: Comfortable clothes, water bottle, light jacket for evening'
      });
    }

    // Weather-based safety suggestions
    if (weather.uvIndex >= 7) {
      suggestions.push({
        title: '🌞 High UV Index Alert',
        description: `UV Index is ${weather.uvIndex}. Strong sun protection needed.`,
        priority: 'high',
        type: 'safety',
        action: 'Pack: Sunscreen SPF 50+, UV protection sunglasses, wide-brim hat, long-sleeve shirt'
      });
    } else if (weather.uvIndex >= 4) {
      suggestions.push({
        title: '☀️ Moderate Sun Protection',
        description: `UV Index is ${weather.uvIndex}. Basic sun protection recommended.`,
        priority: 'medium',
        type: 'safety',
        action: 'Pack: Sunscreen SPF 30+, sunglasses, hat'
      });
    }

    if (weather.precipitation > 0) {
      suggestions.push({
        title: '☔ Rain Gear Required',
        description: `${weather.precipitation}mm precipitation expected. Stay dry!`,
        priority: 'high',
        type: 'equipment',
        action: 'Carry: Umbrella, waterproof rain jacket, waterproof bag covers, extra pair of socks, sealed plastic bags for electronics'
      });
    }

    // Humidity-based suggestions
    if (weather.humidity > 70) {
      suggestions.push({
        title: '💧 High Humidity Advisory',
        description: `${weather.humidity}% humidity. Stay comfortable and fresh.`,
        priority: 'medium',
        type: 'equipment',
        action: 'Carry: Extra towels, moisture-wicking clothes, deodorant, face wipes, powder'
      });
    }

    // Air quality suggestions
    if (weather.airQuality === 'Poor') {
      suggestions.push({
        title: '😷 Air Quality Advisory',
        description: 'Air quality is poor. Respiratory protection recommended.',
        priority: 'high',
        type: 'safety',
        action: 'Carry: N95 mask, avoid heavy outdoor exercise, stay hydrated, consider indoor activities'
      });
    }

    // Wind-based suggestions
    if (weather.windSpeed > 20) {
      suggestions.push({
        title: '💨 Windy Conditions',
        description: `${weather.windSpeed}km/h winds. Secure your belongings.`,
        priority: 'medium',
        type: 'safety',
        action: 'Carry: Windproof jacket, secure hat with strap, avoid loose items, be careful near edges'
      });
    }

    // Activity timing suggestions
    if (weather.temperature > 30) {
      suggestions.push({
        title: '⏰ Heat Advisory - Timing',
        description: `Temperature is ${weather.temperature}°C. Plan strategically.`,
        priority: 'high',
        type: 'planning',
        action: 'Schedule outdoor activities before 11 AM or after 4 PM. Take breaks in shade. Drink water every 20 minutes.'
      });
    }

    // Photography suggestions
    if (weather.condition === 'Partly Cloudy') {
      suggestions.push({
        title: '📸 Excellent Photography Conditions',
        description: 'Partly cloudy skies create perfect dramatic lighting.',
        priority: 'low',
        type: 'activity',
        action: 'Bring: Camera gear, extra batteries, polarizing filter, tripod for low-light shots'
      });
    }

    // General health and safety
    suggestions.push({
      title: '🏥 Essential Safety Items',
      description: 'Always travel prepared for emergencies.',
      priority: 'high',
      type: 'safety',
      action: 'Carry: First-aid kit, personal medications, emergency contact numbers, ID proof, travel insurance, phone charger/power bank'
    });

    // Food and hydration
    suggestions.push({
      title: '🥤 Hydration & Snacks',
      description: 'Stay energized throughout your trip.',
      priority: 'medium',
      type: 'equipment',
      action: 'Carry: 2L water bottle, energy bars, dry fruits, glucose tablets, reusable water bottle'
    });

    return suggestions;
  };

  useEffect(() => {
    const loadWeatherAndRecommendations = async () => {
      const weather = await fetchWeatherData(selectedLocation);
      setWeatherData(weather);
      
      const activityRecs = generateWeatherBasedRecommendations(weather);
      setRecommendations(activityRecs);
      
      const smartSuggs = generateSmartSuggestions(weather, activityRecs);
      setSmartSuggestions(smartSuggs);
    };

    loadWeatherAndRecommendations();
  }, [selectedLocation]);

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-orange-600 bg-orange-100';
      case 'dangerous': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSuitabilityIcon = (suitability: string) => {
    switch (suitability) {
      case 'excellent': return <CheckCircle className="h-4 w-4" />;
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'fair': return <AlertTriangle className="h-4 w-4" />;
      case 'poor': return <AlertTriangle className="h-4 w-4" />;
      case 'dangerous': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-300 bg-red-50 text-red-900';
      case 'medium': return 'border-yellow-300 bg-yellow-50 text-yellow-900';
      case 'low': return 'border-green-300 bg-green-50 text-green-900';
      default: return 'border-gray-300 bg-gray-50 text-gray-900';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === selectedCategory);

  if (isLoading || !weatherData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading weather data and generating recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Smart Weather Recommendations</h1>
        <p className="text-muted-foreground text-lg">
          AI-powered activity suggestions based on real-time weather conditions
        </p>
      </div>

      {/* Location Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <MapPin className="h-5 w-5 text-primary" />
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Current Weather */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="text-2xl">☀️</span>
            Current Weather in {weatherData.location}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <Thermometer className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
              <p className="text-sm text-muted-foreground">Temperature</p>
            </div>
            <div className="text-center">
              <Cloud className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="font-semibold">{weatherData.condition}</p>
              <p className="text-sm text-muted-foreground">Condition</p>
            </div>
            <div className="text-center">
              <Droplets className="h-6 w-6 mx-auto mb-2 text-blue-400" />
              <p className="font-semibold">{weatherData.humidity}%</p>
              <p className="text-sm text-muted-foreground">Humidity</p>
            </div>
            <div className="text-center">
              <Wind className="h-6 w-6 mx-auto mb-2 text-gray-500" />
              <p className="font-semibold">{weatherData.windSpeed} km/h</p>
              <p className="text-sm text-muted-foreground">Wind Speed</p>
            </div>
            <div className="text-center">
              <Eye className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <p className="font-semibold">{weatherData.visibility} km</p>
              <p className="text-sm text-muted-foreground">Visibility</p>
            </div>
            <div className="text-center">
              <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <p className="font-semibold">UV {weatherData.uvIndex}</p>
              <p className="text-sm text-muted-foreground">UV Index</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Suggestions */}
      {smartSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Smart Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {smartSuggestions.map((suggestion, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-2 ${getPriorityColor(suggestion.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1 text-inherit">{suggestion.title}</h4>
                      <p className="text-sm mb-2 opacity-80">{suggestion.description}</p>
                      {suggestion.action && (
                        <p className="text-sm font-medium bg-white/50 p-2 rounded border-l-4 border-current">
                          💡 {suggestion.action}
                        </p>
                      )}
                    </div>
                    <Badge className={`ml-2 ${getPriorityBadgeColor(suggestion.priority)}`}>
                      {suggestion.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <span className="font-medium">Filter Activities:</span>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Recommendations */}
      <div className="grid gap-6">
        <h2 className="text-2xl font-bold text-center">
          Recommended Activities ({filteredRecommendations.length})
        </h2>
        
        {filteredRecommendations.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No activities match your selected category for current weather conditions.</p>
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory('all')}
                className="mt-4"
              >
                View All Activities
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredRecommendations.map((rec, idx) => (
              <Card key={idx} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{rec.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{rec.activity}</CardTitle>
                        <Badge className={`${getSuitabilityColor(rec.suitability)} mt-1`}>
                          {getSuitabilityIcon(rec.suitability)}
                          <span className="ml-1 capitalize">{rec.suitability}</span>
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="outline">{rec.category}</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{rec.reason}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">Best Time</span>
                      </div>
                      <p className="text-muted-foreground">{rec.bestTime}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">💰</span>
                        <span className="font-medium">Cost</span>
                      </div>
                      <p className="text-muted-foreground">{rec.cost}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Locations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.locations.map((location, locIdx) => (
                        <Badge key={locIdx} variant="secondary" className="text-xs">
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Backpack className="h-4 w-4" />
                      Equipment Needed
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.equipment.map((item, eqIdx) => (
                        <Badge key={eqIdx} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">💡 Tips</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {rec.tips.map((tip, tipIdx) => (
                        <li key={tipIdx} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full">
                    Book This Activity
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartWeatherRecommendations;