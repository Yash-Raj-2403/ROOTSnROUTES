import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Zap, Users, Mountain, Trees, Phone } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { allDestinations } from '@/data/completeDestinations';

interface District {
  id: string;
  name: string;
  coordinates: { x: number; y: number };
  attractions: string[];
  speciality: string;
  description: string;
  icon: string;
  destinations: typeof allDestinations;
}

const InteractiveMap = () => {
  const { t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const mapRef = useRef<SVGSVGElement>(null);
  const [mapScale, setMapScale] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });

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
      coordinates: { x: 280, y: 300 },
      attractions: ['Rock Garden', 'Tagore Hill', 'Kanke Dam'],
      speciality: 'Capital City & Hills',
      description: 'The capital city known for its scenic hills and urban attractions.',
      icon: '🏛️',
      destinations: getDistrictDestinations('Ranchi')
    },
    {
      id: 'dhanbad',
      name: 'Dhanbad',
      coordinates: { x: 420, y: 180 },
      attractions: ['Maithon Dam', 'Topchanchi Lake'],
      speciality: 'Coal Capital',
      description: 'Industrial hub famous for coal mining and beautiful lakes.',
      icon: '⚡',
      destinations: getDistrictDestinations('Dhanbad')
    },
    {
      id: 'jamshedpur',
      name: 'Jamshedpur',
      coordinates: { x: 450, y: 380 },
      attractions: ['Jubilee Park', 'Tata Steel Zoological Park'],
      speciality: 'Steel City',
      description: 'Planned industrial city with modern amenities and parks.',
      icon: '🏭',
      destinations: getDistrictDestinations('Jamshedpur')
    },
    {
      id: 'bokaro',
      name: 'Bokaro',
      coordinates: { x: 360, y: 220 },
      attractions: ['Bokaro Steel Plant', 'Garga Dam'],
      speciality: 'Steel & Nature',
      description: 'Steel city surrounded by natural beauty and water bodies.',
      icon: '🌊',
      destinations: getDistrictDestinations('Bokaro')
    },
    {
      id: 'deoghar',
      name: 'Deoghar',
      coordinates: { x: 380, y: 120 },
      attractions: ['Baidyanath Temple', 'Nandan Pahar'],
      speciality: 'Spiritual Center',
      description: 'Sacred city famous for the Baidyanath Jyotirlinga temple.',
      icon: '🕉️',
      destinations: getDistrictDestinations('Deoghar')
    },
    {
      id: 'hazaribag',
      name: 'Hazaribag',
      coordinates: { x: 280, y: 200 },
      attractions: ['Hazaribag National Park', 'Canary Hill'],
      speciality: 'Wildlife & Hills',
      description: 'Hill station known for wildlife sanctuary and scenic beauty.',
      icon: '🦌',
      destinations: getDistrictDestinations('Hazaribag')
    },
    {
      id: 'giridih',
      name: 'Giridih',
      coordinates: { x: 320, y: 160 },
      attractions: ['Parasnath Hill', 'Usri Falls'],
      speciality: 'Jain Pilgrimage',
      description: 'Sacred destination with highest peak of Jharkhand.',
      icon: '⛰️',
      destinations: getDistrictDestinations('Giridih')
    },
    {
      id: 'palamu',
      name: 'Palamu',
      coordinates: { x: 180, y: 240 },
      attractions: ['Betla National Park', 'Palamu Fort'],
      speciality: 'Tiger Reserve',
      description: 'Famous for Betla National Park and wildlife conservation.',
      icon: '🐅',
      destinations: getDistrictDestinations('Palamu')
    },
    {
      id: 'khunti',
      name: 'Khunti',
      coordinates: { x: 240, y: 320 },
      attractions: ['Panchghagh Falls', 'Tribal Culture'],
      speciality: 'Waterfalls & Heritage',
      description: 'Rich in tribal culture and natural waterfalls.',
      icon: '💧',
      destinations: getDistrictDestinations('Khunti')
    },
    {
      id: 'gumla',
      name: 'Gumla',
      coordinates: { x: 200, y: 320 },
      attractions: ['Ghaghra Falls', 'Tribal Villages'],
      speciality: 'Natural Beauty',
      description: 'Known for beautiful waterfalls and tribal heritage.',
      icon: '🏔️',
      destinations: getDistrictDestinations('Gumla')
    }
  ];

  const handleDistrictClick = (district: District) => {
    setSelectedDistrict(district);
  };

  const handleZoomIn = () => {
    setMapScale(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setMapScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const resetView = () => {
    setMapScale(1);
    setMapOffset({ x: 0, y: 0 });
    setSelectedDistrict(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-gradient mb-4">
          Explore Jharkhand Districts
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover the diverse regions of Jharkhand, each with unique attractions and cultural heritage.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <Card className="card-enhanced p-6 relative overflow-hidden">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="text-primary" />
                Interactive District Map
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleZoomIn}
                  className="hover-lift"
                >
                  +
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleZoomOut}
                  className="hover-lift"
                >
                  -
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetView}
                  className="hover-lift"
                >
                  <Navigation size={16} />
                </Button>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl overflow-hidden">
              <svg
                ref={mapRef}
                viewBox="0 0 600 400"
                className="w-full h-96 cursor-grab"
                style={{
                  transform: `scale(${mapScale}) translate(${mapOffset.x}px, ${mapOffset.y}px)`,
                  transition: 'transform 0.3s ease'
                }}
              >
                {/* Map Background */}
                <defs>
                  <pattern id="mapPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="rgba(34, 197, 94, 0.1)" />
                  </pattern>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/> 
                    </feMerge>
                  </filter>
                </defs>

                {/* State Outline */}
                <path
                  d="M100 150 L150 100 L250 80 L350 90 L450 120 L500 150 L520 200 L480 280 L420 350 L350 380 L280 370 L200 340 L150 300 L120 250 Z"
                  fill="url(#mapPattern)"
                  stroke="rgba(34, 197, 94, 0.3)"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />

                {/* Rivers */}
                <path
                  d="M200 120 Q300 140 400 180 Q350 220 300 250 Q250 280 200 320"
                  stroke="rgba(20, 184, 166, 0.4)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Mountains */}
                <g opacity="0.3">
                  <path d="M180 160 L200 140 L220 160 Z" fill="rgba(124, 58, 237, 0.5)" />
                  <path d="M300 120 L330 90 L360 120 Z" fill="rgba(124, 58, 237, 0.5)" />
                  <path d="M400 200 L420 180 L440 200 Z" fill="rgba(124, 58, 237, 0.5)" />
                </g>

                {/* District Points */}
                {districts.map((district) => (
                  <g key={district.id}>
                    {/* District Circle */}
                    <circle
                      cx={district.coordinates.x}
                      cy={district.coordinates.y}
                      r={hoveredDistrict === district.id ? 25 : 20}
                      fill={selectedDistrict?.id === district.id ? 
                        "rgba(16, 185, 129, 0.9)" : 
                        hoveredDistrict === district.id ?
                        "rgba(34, 197, 94, 0.8)" :
                        "rgba(34, 197, 94, 0.6)"
                      }
                      stroke="white"
                      strokeWidth="3"
                      className="cursor-pointer transition-all duration-300 hover-glow"
                      filter={selectedDistrict?.id === district.id ? "url(#glow)" : "none"}
                      onClick={() => handleDistrictClick(district)}
                      onMouseEnter={() => setHoveredDistrict(district.id)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                    />
                    
                    {/* District Icon */}
                    <text
                      x={district.coordinates.x}
                      y={district.coordinates.y + 5}
                      textAnchor="middle"
                      className="text-sm pointer-events-none select-none"
                      fill="white"
                    >
                      {district.icon}
                    </text>

                    {/* District Label */}
                    <text
                      x={district.coordinates.x}
                      y={district.coordinates.y + 40}
                      textAnchor="middle"
                      className="text-xs font-semibold pointer-events-none select-none"
                      fill="currentColor"
                    >
                      {district.name}
                    </text>

                    {/* Pulse Animation for Selected */}
                    {selectedDistrict?.id === district.id && (
                      <circle
                        cx={district.coordinates.x}
                        cy={district.coordinates.y}
                        r="30"
                        fill="none"
                        stroke="rgba(16, 185, 129, 0.5)"
                        strokeWidth="2"
                        className="animate-ping"
                      />
                    )}
                  </g>
                ))}
              </svg>
            </div>
          </Card>
        </div>

        {/* District Information Panel */}
        <div className="space-y-6">
          {selectedDistrict ? (
            <Card className="card-enhanced p-6 stagger-item">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{selectedDistrict.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gradient">{selectedDistrict.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedDistrict.speciality}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{selectedDistrict.description}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Mountain size={16} className="text-primary" />
                    Top Attractions
                  </h4>
                  <ul className="space-y-1">
                    {selectedDistrict.attractions.map((attraction, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        {attraction}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full btn-premium">
                  <MapPin size={16} className="mr-2" />
                  Explore {selectedDistrict.name}
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="card-enhanced p-6 text-center">
              <div className="mb-4">
                <MapPin size={48} className="mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-semibold">{t('map.selectDistrict')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('map.selectDistrictDescription')}
                </p>
              </div>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="card-enhanced p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="text-primary" />
              {t('map.quickFacts')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Districts</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">National Parks</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Wildlife Sanctuaries</span>
                <span className="font-semibold">11</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Languages</span>
                <span className="font-semibold">32+</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;