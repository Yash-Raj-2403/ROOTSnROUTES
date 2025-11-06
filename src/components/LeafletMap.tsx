import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from 'react-leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Route as RouteIcon, 
  Mountain,
  Phone,
  Zap,
  Star,
  Info,
  Users,
  Maximize2,
  Minimize2,
  Eye
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { allDestinations, Destination } from '@/data/completeDestinations';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different categories
const createCustomIcon = (color: string, icon: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid hsl(42, 35%, 97%);
        box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 20px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));">${icon}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

interface District {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  attractions: string[];
  speciality: string;
  description: string;
  icon: string;
  color: string;
  destinations: Destination[];
  categories: string[]; // Categories for filtering: spiritual, nature, adventure, heritage
}

interface DistanceInfo {
  distance: number; // in kilometers
  duration: number; // in minutes
}

const LeafletMap = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.6102, 85.2799]); // Center of Jharkhand
  const [distanceInfo, setDistanceInfo] = useState<DistanceInfo | null>(null);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };

  // Estimate travel time (assuming average speed of 50 km/h on Jharkhand roads)
  const calculateTravelTime = (distance: number): number => {
    const averageSpeed = 50; // km/h
    const hours = distance / averageSpeed;
    const minutes = Math.round(hours * 60);
    return minutes;
  };

  // Format time display
  const formatTravelTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

  // Group destinations by district
  const getDistrictDestinations = (districtName: string) => {
    return allDestinations.filter(dest => 
      dest.district.toLowerCase() === districtName.toLowerCase()
    );
  };

  const districts: District[] = [
    {
      id: 'ranchi',
      name: 'Ranchi',
      coordinates: { lat: 23.3441, lng: 85.3096 },
      attractions: ['Rock Garden', 'Tagore Hill', 'Kanke Dam'],
      speciality: 'Capital City & Hills',
      description: 'The capital city known for its scenic hills and urban attractions.',
      icon: '🏛️',
      color: 'hsl(var(--primary))',
      destinations: getDistrictDestinations('Ranchi'),
      categories: ['nature', 'heritage']
    },
    {
      id: 'dhanbad',
      name: 'Dhanbad',
      coordinates: { lat: 23.7957, lng: 86.4304 },
      attractions: ['Maithon Dam', 'Topchanchi Lake'],
      speciality: 'Coal Capital',
      description: 'Industrial hub famous for coal mining and beautiful lakes.',
      icon: '⚡',
      color: '#D97706',
      destinations: getDistrictDestinations('Dhanbad'),
      categories: ['nature']
    },
    {
      id: 'jamshedpur',
      name: 'Jamshedpur',
      coordinates: { lat: 22.8046, lng: 86.2029 },
      attractions: ['Jubilee Park', 'Tata Steel Zoological Park'],
      speciality: 'Steel City',
      description: 'Planned industrial city with modern amenities and parks.',
      icon: '🏭',
      color: '#7C3AED',
      destinations: getDistrictDestinations('Jamshedpur'),
      categories: ['nature', 'heritage']
    },
    {
      id: 'bokaro',
      name: 'Bokaro',
      coordinates: { lat: 23.6693, lng: 86.1511 },
      attractions: ['Bokaro Steel Plant', 'Garga Dam'],
      speciality: 'Steel & Nature',
      description: 'Steel city surrounded by natural beauty and water bodies.',
      icon: '🌊',
      color: '#0891B2',
      destinations: getDistrictDestinations('Bokaro'),
      categories: ['nature']
    },
    {
      id: 'deoghar',
      name: 'Deoghar',
      coordinates: { lat: 24.4854, lng: 86.6947 },
      attractions: ['Baidyanath Temple', 'Nandan Pahar'],
      speciality: 'Spiritual Center',
      description: 'Sacred city famous for the Baidyanath Jyotirlinga temple.',
      icon: '🕉️',
      color: '#F59E0B',
      destinations: getDistrictDestinations('Deoghar'),
      categories: ['spiritual', 'nature']
    },
    {
      id: 'hazaribag',
      name: 'Hazaribag',
      coordinates: { lat: 23.9929, lng: 85.3615 },
      attractions: ['Hazaribag National Park', 'Canary Hill'],
      speciality: 'Wildlife & Hills',
      description: 'Hill station known for wildlife sanctuary and scenic beauty.',
      icon: '🦌',
      color: '#059669',
      destinations: getDistrictDestinations('Hazaribag'),
      categories: ['nature', 'adventure']
    },
    {
      id: 'giridih',
      name: 'Giridih',
      coordinates: { lat: 24.1900, lng: 86.3023 },
      attractions: ['Parasnath Hill', 'Usri Falls'],
      speciality: 'Jain Pilgrimage',
      description: 'Sacred destination with highest peak of Jharkhand.',
      icon: '⛰️',
      color: '#DB2777',
      destinations: getDistrictDestinations('Giridih'),
      categories: ['spiritual', 'nature', 'adventure']
    },
    {
      id: 'palamu',
      name: 'Palamu',
      coordinates: { lat: 24.0366, lng: 84.0745 },
      attractions: ['Betla National Park', 'Palamu Fort'],
      speciality: 'Tiger Reserve',
      description: 'Famous for Betla National Park and wildlife conservation.',
      icon: '🐅',
      color: '#EA580C',
      destinations: getDistrictDestinations('Palamu'),
      categories: ['nature', 'adventure', 'heritage']
    },
    {
      id: 'khunti',
      name: 'Khunti',
      coordinates: { lat: 23.0813, lng: 85.2788 },
      attractions: ['Panchghagh Falls', 'Tribal Culture'],
      speciality: 'Waterfalls & Heritage',
      description: 'Rich in tribal culture and natural waterfalls.',
      icon: '💧',
      color: '#0D9488',
      destinations: getDistrictDestinations('Khunti'),
      categories: ['nature', 'heritage', 'adventure']
    },
    {
      id: 'gumla',
      name: 'Gumla',
      coordinates: { lat: 23.0438, lng: 84.5397 },
      attractions: ['Ghaghra Falls', 'Tribal Villages'],
      speciality: 'Natural Beauty',
      description: 'Known for beautiful waterfalls and tribal heritage.',
      icon: '🏔️',
      color: '#10b981',
      destinations: getDistrictDestinations('Gumla'),
      categories: ['nature', 'heritage']
    },
    {
      id: 'lohardaga',
      name: 'Lohardaga',
      coordinates: { lat: 23.4342, lng: 84.6811 },
      attractions: ['Netarhat', 'Budha Pahar'],
      speciality: 'Hill Station',
      description: 'Gateway to Netarhat, the Queen of Chotanagpur.',
      icon: '🏞️',
      color: '#16A34A',
      destinations: getDistrictDestinations('Lohardaga'),
      categories: ['nature', 'adventure']
    },
    {
      id: 'simdega',
      name: 'Simdega',
      coordinates: { lat: 22.6186, lng: 84.5025 },
      attractions: ['Tribal Heritage', 'Natural Beauty'],
      speciality: 'Tribal Culture',
      description: 'Known for rich tribal heritage and scenic landscapes.',
      icon: '🎭',
      color: '#CA8A04',
      destinations: getDistrictDestinations('Simdega'),
      categories: ['heritage', 'nature']
    },
    {
      id: 'west-singhbhum',
      name: 'West Singhbhum',
      coordinates: { lat: 22.5688, lng: 85.5291 },
      attractions: ['Saranda Forest', 'Tribal Culture'],
      speciality: 'Dense Forests',
      description: 'Home to Saranda forest and diverse tribal communities.',
      icon: '🌲',
      color: '#15803D',
      destinations: getDistrictDestinations('West Singhbhum'),
      categories: ['nature', 'heritage', 'adventure']
    },
    {
      id: 'east-singhbhum',
      name: 'East Singhbhum',
      coordinates: { lat: 22.5629, lng: 86.4709 },
      attractions: ['Dalma Wildlife Sanctuary', 'Dimna Lake'],
      speciality: 'Industrial & Wildlife',
      description: 'Combines industrial development with wildlife conservation.',
      icon: '🦅',
      color: '#7C2D12',
      destinations: getDistrictDestinations('East Singhbhum'),
      categories: ['nature', 'adventure']
    },
    {
      id: 'saraikela-kharsawan',
      name: 'Saraikela Kharsawan',
      coordinates: { lat: 22.6986, lng: 85.9308 },
      attractions: ['Rank Falls', 'Chhau Dance'],
      speciality: 'Cultural Heritage',
      description: 'Famous for traditional Chhau dance and natural beauty.',
      icon: '💃',
      color: '#BE123C',
      destinations: getDistrictDestinations('Saraikela Kharsawan'),
      categories: ['heritage', 'nature']
    },
    {
      id: 'ramgarh',
      name: 'Ramgarh',
      coordinates: { lat: 23.6306, lng: 85.5211 },
      attractions: ['Patratu Valley', 'Rajrappa Temple'],
      speciality: 'Industrial Hub',
      description: 'Known for thermal power plant and scenic valleys.',
      icon: '⚙️',
      color: '#DC2626',
      destinations: getDistrictDestinations('Ramgarh'),
      categories: ['spiritual', 'nature']
    },
    {
      id: 'chatra',
      name: 'Chatra',
      coordinates: { lat: 24.2069, lng: 84.8700 },
      attractions: ['Kauleshwari Temple', 'Tamor Pingla Wildlife Sanctuary'],
      speciality: 'Religious & Wildlife',
      description: 'Blend of religious sites and wildlife sanctuaries.',
      icon: '🛕',
      color: '#B45309',
      destinations: getDistrictDestinations('Chatra'),
      categories: ['spiritual', 'nature', 'adventure']
    },
    {
      id: 'koderma',
      name: 'Koderma',
      coordinates: { lat: 24.4672, lng: 85.5953 },
      attractions: ['Tilaiya Dam', 'Mica Mines'],
      speciality: 'Mica Production',
      description: 'Major mica production center with scenic dam.',
      icon: '💎',
      color: '#4338CA',
      destinations: getDistrictDestinations('Koderma'),
      categories: ['nature', 'heritage']
    },
    {
      id: 'jamtara',
      name: 'Jamtara',
      coordinates: { lat: 23.9631, lng: 86.8025 },
      attractions: ['Massanjore Dam', 'Rural Heritage'],
      speciality: 'Agricultural Hub',
      description: 'Agricultural district with beautiful dam and rural charm.',
      icon: '🌾',
      color: '#65A30D',
      destinations: getDistrictDestinations('Jamtara'),
      categories: ['nature', 'heritage']
    },
    {
      id: 'dumka',
      name: 'Dumka',
      coordinates: { lat: 24.2674, lng: 87.2497 },
      attractions: ['Massanjore Dam', 'Basukinath Temple'],
      speciality: 'Santhal Culture',
      description: 'Capital of Santhal Pargana with rich tribal heritage.',
      icon: '🏺',
      color: '#DC2626',
      destinations: getDistrictDestinations('Dumka'),
      categories: ['heritage', 'spiritual', 'nature']
    },
    {
      id: 'pakur',
      name: 'Pakur',
      coordinates: { lat: 24.6336, lng: 87.8312 },
      attractions: ['Sidhu Kanhu Park', 'Stone Quarries'],
      speciality: 'Stone Mining',
      description: 'Known for stone quarries and tribal freedom fighters.',
      icon: '🪨',
      color: '#78716C',
      destinations: getDistrictDestinations('Pakur'),
      categories: ['heritage', 'nature']
    },
    {
      id: 'godda',
      name: 'Godda',
      coordinates: { lat: 24.8333, lng: 87.2167 },
      attractions: ['Basant Rai Memorial', 'Thermal Power Plant'],
      speciality: 'Energy Hub',
      description: 'Emerging industrial district with thermal power plant.',
      icon: '🔥',
      color: '#EF4444',
      destinations: getDistrictDestinations('Godda'),
      categories: ['heritage']
    },
    {
      id: 'sahebganj',
      name: 'Sahebganj',
      coordinates: { lat: 25.2500, lng: 87.6333 },
      attractions: ['Rajmahal Hills', 'Udhwa Lake Bird Sanctuary'],
      speciality: 'River Port & Hills',
      description: 'Gateway to Jharkhand with Ganges river port.',
      icon: '⛴️',
      color: '#0EA5E9',
      destinations: getDistrictDestinations('Sahebganj'),
      categories: ['nature', 'heritage', 'adventure']
    },
    {
      id: 'latehar',
      name: 'Latehar',
      coordinates: { lat: 23.7445, lng: 84.5004 },
      attractions: ['Netarhat', 'Lodh Falls'],
      speciality: 'Hill Station & Waterfalls',
      description: 'Home to Netarhat and highest waterfall in Jharkhand.',
      icon: '🌄',
      color: '#8B5CF6',
      destinations: getDistrictDestinations('Latehar'),
      categories: ['nature', 'adventure']
    }
  ];

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location access denied');
        }
      );
    }
  }, []);

  // Map controller component to handle view changes
  const MapController = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
  };

  const handleDistrictClick = (district: District) => {
    setSelectedDistrict(district);
    setMapCenter([district.coordinates.lat, district.coordinates.lng]);
    
    // Calculate distance and time if user location is available
    if (userLocation) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        district.coordinates.lat,
        district.coordinates.lng
      );
      const duration = calculateTravelTime(distance);
      setDistanceInfo({ distance, duration });
    } else {
      setDistanceInfo(null);
    }
  };

  const handleLocateMe = () => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handlePlanTrip = () => {
    if (selectedDistrict) {
      // Navigate to AI Trip Planner with district pre-selected
      navigate('/ai-trip-planner', { state: { district: selectedDistrict.name } });
    } else {
      toast({
        title: "Select a District",
        description: "Please select a district from the map first.",
        variant: "destructive",
      });
    }
  };

  const handleEmergencyServices = () => {
    navigate('/support');
  };

  const handleViewDistrictDetails = (district: District) => {
    // Navigate to district destinations page
    navigate(`/destinations/district/${district.name.toLowerCase()}`);
  };

  const categories = [
    { id: 'all', name: 'All Locations', icon: MapPin },
    { id: 'spiritual', name: 'Spiritual', icon: Mountain },
    { id: 'nature', name: 'Nature', icon: Mountain },
    { id: 'adventure', name: 'Adventure', icon: Zap },
    { id: 'heritage', name: 'Heritage', icon: Users },
  ];

  const filteredDistricts = selectedCategory === 'all' 
    ? districts 
    : districts.filter(d => 
        d.categories.includes(selectedCategory)
      );

  return (
    <div className={`w-full ${isFullscreen ? 'fixed inset-0 z-[9999] bg-background' : 'relative'}`}>
      <div className={`${isFullscreen ? 'h-screen overflow-y-auto' : ''} ${isFullscreen ? 'container mx-auto px-4 py-8' : ''}`}>
        {/* Category Filter */}
        <div className="mb-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto bg-card/50 backdrop-blur-sm">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{cat.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className={`${isFullscreen ? 'col-span-3' : 'lg:col-span-2'} relative`}>
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Interactive Map</CardTitle>
                  <CardDescription>Click on markers to explore destinations</CardDescription>
                </div>
                <div className="flex gap-2">
                  {userLocation && (
                    <Button variant="outline" size="sm" onClick={handleLocateMe}>
                      <Navigation className="w-4 h-4 mr-2" />
                      My Location
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className={`${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[600px]'} w-full`}>
                  <MapContainer
                    center={mapCenter}
                    zoom={8}
                    className="h-full w-full z-0"
                    style={{ background: '#f0f0f0' }}
                  >
                    <MapController center={mapCenter} />
                    
                    {/* OpenStreetMap Tiles */}
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* District Markers */}
                    {filteredDistricts.map((district) => (
                      <Marker
                        key={district.id}
                        position={[district.coordinates.lat, district.coordinates.lng]}
                        icon={createCustomIcon(district.color, district.icon)}
                        eventHandlers={{
                          click: () => handleDistrictClick(district),
                        }}
                      >
                        <Popup>
                          <div className="p-2 min-w-[200px]">
                            <h3 className="font-bold text-lg mb-2 text-primary">{district.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2 font-semibold">{district.speciality}</p>
                            <p className="text-sm mb-3 text-foreground/80">{district.description}</p>
                            
                            {/* Distance and Time Info */}
                            {userLocation && (() => {
                              const distance = calculateDistance(
                                userLocation.lat,
                                userLocation.lng,
                                district.coordinates.lat,
                                district.coordinates.lng
                              );
                              const duration = calculateTravelTime(distance);
                              return (
                                <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                  <div className="flex items-center gap-2 text-xs">
                                    <Navigation className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                    <span className="font-semibold text-amber-700 dark:text-amber-300">
                                      {distance} km away
                                    </span>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-amber-600 dark:text-amber-400">
                                      ~{formatTravelTime(duration)} drive
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                            
                            <div className="space-y-2 mb-3">
                              <p className="text-xs font-semibold text-foreground">Top Attractions:</p>
                              <div className="flex flex-wrap gap-1">
                                {district.attractions.slice(0, 3).map((attr, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {attr}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                                onClick={() => handleDistrictClick(district)}
                              >
                                <MapPin className="w-3 h-3 mr-1" />
                                View on Map
                              </Button>
                              <Link 
                                to={`/destinations?district=${district.name.toLowerCase()}`}
                                className="flex-1"
                              >
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="w-full"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </Popup>

                        {/* Circle to show district area */}
                        <Circle
                          center={[district.coordinates.lat, district.coordinates.lng]}
                          radius={20000}
                          pathOptions={{
                            color: district.color,
                            fillColor: district.color,
                            fillOpacity: 0.1,
                            weight: 2,
                          }}
                        />
                      </Marker>
                    ))}

                    {/* User Location Marker */}
                    {userLocation && (
                      <Marker
                        position={[userLocation.lat, userLocation.lng]}
                        icon={L.divIcon({
                          className: 'user-location-marker',
                          html: `
                            <div style="
                              background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%);
                              width: 24px;
                              height: 24px;
                              border-radius: 50%;
                              border: 3px solid hsl(42, 35%, 97%);
                              box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.2), 0 4px 12px rgba(217, 119, 6, 0.4);
                              animation: pulse 2s infinite;
                            "></div>
                          `,
                          iconSize: [24, 24],
                          iconAnchor: [12, 12],
                        })}
                      >
                        <Popup>
                          <div className="p-2">
                            <p className="font-semibold">📍 Your Location</p>
                          </div>
                        </Popup>
                      </Marker>
                    )}

                    {/* Route line if user location and selected district */}
                    {userLocation && selectedDistrict && (
                      <Polyline
                        positions={[
                          [userLocation.lat, userLocation.lng],
                          [selectedDistrict.coordinates.lat, selectedDistrict.coordinates.lng],
                        ]}
                        pathOptions={{
                          color: '#D97706',
                          weight: 3,
                          opacity: 0.8,
                          dashArray: '10, 10',
                        }}
                      />
                    )}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* District Details Panel */}
          {!isFullscreen && (
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {selectedDistrict ? selectedDistrict.name : 'Select a District'}
                  </CardTitle>
                  <CardDescription>
                    {selectedDistrict ? selectedDistrict.speciality : 'Click on a marker to view details'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDistrict ? (
                    <div className="space-y-4">
                      {/* Distance and Travel Time Card */}
                      {distanceInfo ? (
                        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border-2 border-amber-200 dark:border-amber-800">
                          <h4 className="font-semibold mb-3 flex items-center gap-2 text-amber-900 dark:text-amber-100">
                            <Navigation className="w-4 h-4" />
                            Travel Information
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-2 bg-white dark:bg-gray-900 rounded-md">
                              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{distanceInfo.distance}</p>
                              <p className="text-xs text-muted-foreground">Kilometers</p>
                            </div>
                            <div className="text-center p-2 bg-white dark:bg-gray-900 rounded-md">
                              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{formatTravelTime(distanceInfo.duration)}</p>
                              <p className="text-xs text-muted-foreground">Est. Travel Time</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 text-center">
                            Based on average speed of 50 km/h
                          </p>
                        </div>
                      ) : !userLocation ? (
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                          <p className="text-xs text-center text-emerald-700 dark:text-emerald-300">
                            <Navigation className="w-4 h-4 inline mr-1" />
                            Enable location to see distance & travel time
                          </p>
                        </div>
                      ) : null}
                      
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          About
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedDistrict.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Top Attractions
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedDistrict.attractions.map((attr, idx) => (
                            <Badge key={idx} variant="secondary">
                              {attr}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Mountain className="w-4 h-4" />
                          Destinations ({selectedDistrict.destinations.length})
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {selectedDistrict.destinations.slice(0, 5).map((dest, idx) => (
                            <div key={idx} className="p-2 border rounded-lg hover:bg-accent transition-colors">
                              <p className="font-medium text-sm">{dest.name}</p>
                              <p className="text-xs text-muted-foreground">{dest.category}</p>
                            </div>
                          ))}
                          {selectedDistrict.destinations.length > 5 && (
                            <p className="text-xs text-muted-foreground text-center">
                              +{selectedDistrict.destinations.length - 5} more destinations
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 pt-4 border-t">
                        <Button 
                          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700" 
                          onClick={handlePlanTrip}
                        >
                          <RouteIcon className="w-4 h-4 mr-2" />
                          Plan Trip
                        </Button>
                        <Link to={`/destinations?district=${selectedDistrict.name.toLowerCase()}`} className="block">
                          <Button 
                            className="w-full" 
                            variant="outline"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View All Destinations
                          </Button>
                        </Link>
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={handleEmergencyServices}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Emergency Services
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Select a district from the map to view details and plan your trip
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-amber-600 dark:text-amber-500" />
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{districts.length}</p>
              <p className="text-sm text-amber-700 dark:text-amber-400">Districts</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6 text-center">
              <Mountain className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-500" />
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{allDestinations.length}+</p>
              <p className="text-sm text-green-700 dark:text-green-400">Destinations</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-emerald-600 dark:text-emerald-500" />
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">50K+</p>
              <p className="text-sm text-emerald-700 dark:text-emerald-400">Travelers</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-amber-600 dark:text-amber-500" />
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">4.8</p>
              <p className="text-sm text-amber-700 dark:text-amber-400">Rating</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeafletMap;
