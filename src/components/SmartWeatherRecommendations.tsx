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
    if (weather.temperature >= 20 && weather.temperature <= 30 && weather.condition !== 'Heavy Rain' && locationData.waterfalls.length > 0) {
      const mainWaterfall = locationData.waterfalls[0];
      activities.push({
        activity: `Visit ${mainWaterfall}`,
        suitability: weather.precipitation > 0 ? 'excellent' : 'good',
        reason: weather.precipitation > 0 ? 
          `Recent rains have made ${mainWaterfall} absolutely spectacular with maximum water flow! Perfect time for stunning photos.` : 
          `Perfect ${weather.temperature}°C weather for exploring ${mainWaterfall} and nearby cascades.`,
        tips: [
          `${mainWaterfall} is best visited in morning for fewer crowds`,
          'Wear non-slip footwear - rocks can be slippery',
          'Carry waterproof camera cover for splash protection',
          weather.precipitation > 0 ? 'Water flow is strong - maintain safe distance' : 'Water flow is moderate - great for closer views',
          `Nearby attractions: ${locationData.waterfalls.slice(1).join(', ') || 'Local viewpoints'}`
        ],
        locations: locationData.waterfalls,
        bestTime: weather.precipitation > 0 ? '08:00 - 10:00 AM (avoid afternoon flash floods)' : '07:00 - 11:00 AM',
        equipment: ['Trekking shoes', 'Waterproof bag', 'Swimming clothes (if applicable)', 'First aid kit'],
        cost: '₹200-500',
        icon: '💧',
        category: 'outdoor'
      });
    }

    // Wildlife Safari
    if (weather.temperature >= 15 && weather.temperature <= 32 && weather.condition !== 'Heavy Rain' && locationData.wildlife.length > 0) {
      const mainWildlifePark = locationData.wildlife[0];
      const wildlifeType = mainWildlifePark.includes('Betla') || mainWildlifePark.includes('Tiger') ? 'tigers, elephants, and leopards' :
                           mainWildlifePark.includes('Dalma') ? 'elephants and deer' :
                           mainWildlifePark.includes('Saranda') ? 'elephants and diverse bird species' :
                           'local wildlife and birds';
      
      activities.push({
        activity: `${mainWildlifePark} Safari`,
        suitability: weather.temperature <= 28 ? 'excellent' : 'good',
        reason: weather.temperature <= 25 ? 
          `Perfect ${weather.temperature}°C temperature! Animals are highly active and visible. Best chances to spot ${wildlifeType}.` :
          `At ${weather.temperature}°C, animals will be active during early morning and evening. Plan your safari accordingly.`,
        tips: [
          `${mainWildlifePark} requires advance booking - reserve 2-3 days ahead`,
          `Best for spotting: ${wildlifeType}`,
          'Carry binoculars and zoom camera for distant wildlife',
          'Maintain complete silence during safari',
          weather.temperature > 28 ? 'Prefer morning safari (06:00-09:00) as animals rest in afternoon heat' : 'Animals are active throughout the day in this weather',
          `Other nearby wildlife spots: ${locationData.wildlife.slice(1).join(', ') || 'Local forest trails'}`
        ],
        locations: locationData.wildlife,
        bestTime: weather.temperature <= 25 ? '06:00-10:00 AM & 14:00-17:00 PM' : '06:00-09:00 AM (morning safari only)',
        equipment: ['Binoculars', 'Camera with 200mm+ telephoto lens', 'Hat', 'Sunscreen', 'Water bottle'],
        cost: mainWildlifePark.includes('Betla') || mainWildlifePark.includes('Tiger') ? '₹2,500-4,500' : '₹1,500-3,000',
        icon: '🦁',
        category: 'outdoor'
      });
    }

    // Hill Station Visit
    if (weather.temperature >= 12 && weather.temperature <= 28 && locationData.hills.length > 0) {
      const mainHill = locationData.hills[0];
      const hillSpecialty = mainHill.includes('Parasnath') ? 'highest peak in Jharkhand (1,350m) and sacred Jain pilgrimage site' :
                           mainHill.includes('Netarhat') ? 'Queen of Chotanagpur - famous for mesmerizing sunrise/sunset views' :
                           mainHill.includes('Tagore') ? 'historical hilltop with panoramic city views' :
                           mainHill.includes('Dalma') ? 'wildlife sanctuary with elephant migration routes' :
                           mainHill.includes('Trikut') ? 'temple town with Asia\'s highest vertical ropeway' :
                           mainHill.includes('Nandan Pahar') ? 'amusement park with scenic hilltop views' :
                           'scenic hilltop viewpoints';
      
      const recommendedStay = mainHill.includes('Netarhat') || mainHill.includes('Parasnath');
      
      activities.push({
        activity: `Explore ${mainHill}`,
        suitability: weather.temperature <= 25 ? 'excellent' : 'good',
        reason: `Perfect ${weather.temperature}°C for hillside exploration! ${mainHill} is known as the ${hillSpecialty}. ${weather.temperature <= 20 ? 'Crisp mountain air and clear views expected!' : 'Comfortable weather for sightseeing.'}`,
        tips: [
          weather.temperature <= 20 ? 'Carry warm jacket/sweater - temperature drops at higher altitude' : 'Light jacket recommended for evening breeze',
          recommendedStay ? `Consider overnight stay to experience ${mainHill.includes('Netarhat') ? 'magical sunrise/sunset' : 'sunrise from summit'}` : 'Perfect for day trip',
          mainHill.includes('Parasnath') ? 'Sacred site - dress modestly, maintain silence near temples, no leather items' :
          mainHill.includes('Trikut') ? 'Take the cable car ride - breathtaking 360° views' :
          mainHill.includes('Netarhat') ? 'Visit Magnolia Sunset Point and Lower Ghaghri Falls nearby' :
          `Don't miss the panoramic viewpoints at ${mainHill}`,
          'Try local specialties like litti chokha and local tea at hilltop stalls',
          'Best photography spots are marked at the summit',
          `Other nearby hills: ${locationData.hills.slice(1).join(', ') || 'Local viewpoints'}`
        ],
        locations: locationData.hills,
        bestTime: `All day${mainHill.includes('Netarhat') || mainHill.includes('Parasnath') ? ', sunrise at ' + weather.sunrise + ' (highly recommended)' : ''}`,
        equipment: ['Warm jacket', 'Camera with wide-angle lens', 'Comfortable walking shoes', recommendedStay ? 'Overnight bag' : 'Daypack'],
        cost: recommendedStay ? '₹2,000-4,000 (with stay)' : '₹500-1,500',
        icon: '⛰️',
        category: 'outdoor'
      });
    }

    // Photography Activities
    if (weather.visibility >= 8 && weather.condition !== 'Heavy Rain' && locationData.photography.length > 0) {
      const topPhotoSpot = locationData.photography[0];
      const photoTheme = topPhotoSpot.includes('Hundru') || topPhotoSpot.includes('Falls') || topPhotoSpot.includes('Waterfall') ? 'cascading waterfalls and misty gorges' :
                        topPhotoSpot.includes('Betla') || topPhotoSpot.includes('Wildlife') || topPhotoSpot.includes('Safari') ? 'wildlife and forest landscapes' :
                        topPhotoSpot.includes('Dam') || topPhotoSpot.includes('Lake') || topPhotoSpot.includes('Reservoir') ? 'serene water reflections and dam architecture' :
                        topPhotoSpot.includes('Hill') || topPhotoSpot.includes('Rock') ? 'hilltop vistas and rock formations' :
                        topPhotoSpot.includes('Temple') || topPhotoSpot.includes('Fort') ? 'heritage architecture and cultural sites' :
                        topPhotoSpot.includes('Tribal') || topPhotoSpot.includes('Village') ? 'tribal culture and traditional life' :
                        'scenic landscapes and local culture';
      
      const lightingTips = weather.condition === 'Partly Cloudy' ? 'Perfect! Clouds add dramatic effect to photos - diffused light reduces harsh shadows' :
                          weather.condition === 'Clear' ? 'Clear skies - shoot during golden hours to avoid harsh midday sun' :
                          'Current conditions create unique atmospheric shots';
      
      activities.push({
        activity: `Photography at ${topPhotoSpot}`,
        suitability: weather.condition === 'Partly Cloudy' ? 'excellent' : 'good',
        reason: `Exceptional ${weather.visibility}km visibility! ${topPhotoSpot} is perfect for capturing ${photoTheme}. ${lightingTips}`,
        tips: [
          `Prime time: Golden hours (${weather.sunrise}-08:00 AM, 16:00-${weather.sunset})`,
          `Specialty shots at ${topPhotoSpot}: ${photoTheme}`,
          weather.temperature < 15 ? 'Carry spare batteries - cold drains battery 30% faster' : 'Keep extra memory cards',
          topPhotoSpot.includes('Waterfall') || topPhotoSpot.includes('Falls') ? 'Use ND filter + tripod for silky water effect (1-2 sec exposure)' :
          topPhotoSpot.includes('Wildlife') || topPhotoSpot.includes('Safari') ? 'Telephoto lens (200-400mm) essential, shoot from vehicle' :
          topPhotoSpot.includes('Dam') || topPhotoSpot.includes('Lake') ? 'Polarizing filter to reduce water glare and enhance colors' :
          'Polarizing filter recommended for landscape shots',
          'Respect local customs - ALWAYS ask permission before photographing people or tribal areas',
          topPhotoSpot.includes('Tribal') || topPhotoSpot.includes('Village') ? 'Offer small gifts/tips when photographing villagers' :
          'Interact respectfully with locals',
          `Other photo spots nearby: ${locationData.photography.slice(1, 3).join(', ') || 'Various viewpoints'}`
        ],
        locations: locationData.photography,
        bestTime: `Golden hours: ${weather.sunrise}-08:00 AM, 16:00-${weather.sunset} PM${weather.condition === 'Partly Cloudy' ? ' (all-day shoot possible with clouds)' : ''}`,
        equipment: ['DSLR/Mirrorless camera', 'Tripod (essential)', 'ND + Polarizing filters', 'Extra batteries', '64GB+ memory cards', 'Lens cleaning kit'],
        cost: topPhotoSpot.includes('Wildlife') || topPhotoSpot.includes('Safari') ? '₹1,500-3,000 (safari included)' : '₹300-1,000',
        icon: '📸',
        category: 'photography'
      });
    }

    // Cultural Activities (Indoor/Outdoor based on weather)
    if (weather.temperature >= 18 && locationData.cultural.length > 0) {
      const mainCulturalSite = locationData.cultural[0];
      const culturalType = mainCulturalSite.includes('Tribal') || mainCulturalSite.includes('Village') ? 'authentic tribal villages and indigenous traditions' :
                          mainCulturalSite.includes('Temple') || mainCulturalSite.includes('Mandir') ? 'ancient temples and religious heritage' :
                          mainCulturalSite.includes('Fort') || mainCulturalSite.includes('Palace') ? 'historical monuments and royal architecture' :
                          mainCulturalSite.includes('Museum') || mainCulturalSite.includes('Institute') ? 'museums showcasing tribal art and history' :
                          mainCulturalSite.includes('Handicraft') || mainCulturalSite.includes('Market') ? 'traditional handicraft centers and artisan workshops' :
                          'rich cultural heritage and local traditions';
      
      const specialActivity = mainCulturalSite.includes('Tribal') || mainCulturalSite.includes('Village') ? 'Witness traditional dance performances, learn about indigenous practices' :
                             mainCulturalSite.includes('Handicraft') ? 'Watch artisans create Dokra metal craft, Paitkar paintings, bamboo art' :
                             mainCulturalSite.includes('Temple') ? 'Attend morning/evening aarti, explore temple architecture' :
                             'Explore local heritage and traditions';
      
      activities.push({
        activity: `Visit ${mainCulturalSite}`,
        suitability: weather.precipitation <= 5 ? 'good' : 'fair',
        reason: weather.precipitation > 5 ? 
          `Light rain expected. ${mainCulturalSite.includes('Museum') || mainCulturalSite.includes('Temple') ? 'Good - mostly indoor/covered activities available' : 'Outdoor cultural programs may be limited'}` : 
          `Perfect weather for cultural immersion! ${mainCulturalSite} showcases ${culturalType}.`,
        tips: [
          `Experience: ${specialActivity}`,
          mainCulturalSite.includes('Tribal') || mainCulturalSite.includes('Village') ? 'Carry small gifts (notebooks, pens, biscuits) for children' :
          mainCulturalSite.includes('Temple') ? 'Remove shoes, dress modestly (covered shoulders & legs), no leather items' :
          'Dress respectfully (avoid shorts, sleeveless tops)',
          'ALWAYS ask permission before photographing people or sacred sites',
          mainCulturalSite.includes('Handicraft') || mainCulturalSite.includes('Market') ? 'Support local artisans - buy authentic handmade crafts' :
          mainCulturalSite.includes('Tribal') || mainCulturalSite.includes('Village') ? 'Learn basic Mundari/Santali phrases - locals appreciate the effort' :
          'Interact respectfully with locals',
          'Try authentic Jharkhandi cuisine: litti chokha, dhuska, thekua, handia (rice beer)',
          mainCulturalSite.includes('Museum') || mainCulturalSite.includes('Institute') ? 'Audio guides available - enhances understanding of tribal history' :
          'Hire local guide for deeper cultural insights (₹300-500)',
          `Other cultural sites: ${locationData.cultural.slice(1, 3).join(', ') || 'Local markets'}`
        ],
        locations: locationData.cultural,
        bestTime: mainCulturalSite.includes('Temple') ? '06:00-12:00 (morning aarti), 17:00-20:00 (evening aarti)' : '09:00-17:00',
        equipment: [
          mainCulturalSite.includes('Temple') ? 'Modest clothing (scarf for women)' : 'Respectful clothing',
          mainCulturalSite.includes('Tribal') || mainCulturalSite.includes('Village') ? 'Small gifts for villagers' : 'Small notebook for notes',
          'Camera (ask permission first)',
          'Reusable bag for handicraft purchases'
        ],
        cost: mainCulturalSite.includes('Temple') ? '₹50-200 (donations)' :
              mainCulturalSite.includes('Museum') ? '₹50-150 (entry)' :
              mainCulturalSite.includes('Handicraft') ? '₹500-3,000 (shopping budget)' :
              '₹1,000-2,500',
        icon: '🎭',
        category: 'cultural'
      });
    }

    // Indoor Activities for bad weather
    if (weather.precipitation > 10 || weather.temperature < 15 || weather.temperature > 35) {
      const mainIndoorVenue = locationData.museums.length > 0 ? locationData.museums[0] : 'Ranchi State Museum';
      
      const weatherReason = weather.precipitation > 10 ? `Heavy rain (${weather.precipitation}mm) - stay dry indoors!` :
                           weather.temperature < 15 ? `Cold weather (${weather.temperature}°C) - warm indoor activities recommended` :
                           `Extreme heat (${weather.temperature}°C) - cool AC comfort indoors`;
      
      const venueType = mainIndoorVenue.includes('Museum') ? 'museum showcasing tribal artifacts, history, and heritage' :
                       mainIndoorVenue.includes('Institute') || mainIndoorVenue.includes('Research') ? 'research center with tribal culture exhibits' :
                       mainIndoorVenue.includes('Handicraft') || mainIndoorVenue.includes('Center') ? 'artisan workshop where you can learn traditional crafts' :
                       mainIndoorVenue.includes('Mall') || mainIndoorVenue.includes('Market') ? 'shopping complex with local handicrafts' :
                       'cultural center';
      
      activities.push({
        activity: `Indoor Culture: ${mainIndoorVenue}`,
        suitability: 'excellent',
        reason: `${weatherReason} Perfect time to explore ${mainIndoorVenue} - ${venueType}.`,
        tips: [
          `Visit ${mainIndoorVenue} - ${venueType}`,
          mainIndoorVenue.includes('Museum') || mainIndoorVenue.includes('Institute') ? 'Audio guides available for detailed tribal history' :
          mainIndoorVenue.includes('Handicraft') || mainIndoorVenue.includes('Center') ? 'Participate in hands-on Dokra metal craft workshop (₹500-1,000)' :
          'Interactive exhibits showcase Jharkhand heritage',
          'Learn traditional crafts: Dokra metal work, Paitkar scroll paintings, Sohrai/Khovar art, bamboo crafts',
          mainIndoorVenue.includes('Museum') ? 'See ancient tribal artifacts, traditional costumes, musical instruments' :
          'Watch artisans demonstrate traditional techniques',
          'Shop authentic handicrafts: Dokra figurines (₹300-5,000), Sohrai paintings (₹500-3,000), bamboo products (₹100-1,500)',
          weather.precipitation > 10 ? 'Many venues have cafes - enjoy chai and local snacks while it rains' :
          'Take breaks at museum cafe',
          `Other indoor options: ${locationData.museums.slice(1).join(', ') || 'Local handicraft centers, tribal cultural shows'}`
        ],
        locations: locationData.museums.length > 0 ? locationData.museums : ['Ranchi State Museum', 'Tribal Research Institute', 'Local Handicraft Centers', 'Science Centers'],
        bestTime: mainIndoorVenue.includes('Museum') || mainIndoorVenue.includes('Institute') ? '10:00-17:00 (closed Mondays)' : '10:00-19:00',
        equipment: ['Comfortable clothing', 'Notebook for workshop notes', 'Reusable shopping bag', weather.precipitation > 10 ? 'Umbrella/raincoat' : 'Light bag'],
        cost: mainIndoorVenue.includes('Museum') || mainIndoorVenue.includes('Institute') ? '₹50-200 (entry) + ₹500-2,000 (shopping)' : '₹300-1,500',
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