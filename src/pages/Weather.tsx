import React, { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DevelopmentNotice from "@/components/DevelopmentNotice";
import WeatherSafetyWidget from "@/components/WeatherSafetyWidget";
import { NavigationButtons } from "@/components/NavigationButtons";
import { useLanguage } from "@/hooks/useLanguage";
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  RefreshCw,
  Filter,
  Grid,
  List,
  Cloud,
  MapPin,
  Calendar,
  Car,
  Phone,
  Users
} from 'lucide-react';

// All 24 districts of Jharkhand with their major cities/towns
const jharkhandDistricts = [
  { name: 'Ranchi', city: 'Ranchi', region: 'Central' },
  { name: 'Jamshedpur (East Singhbhum)', city: 'Jamshedpur', region: 'Eastern' },
  { name: 'Dhanbad', city: 'Dhanbad', region: 'Eastern' },
  { name: 'Bokaro', city: 'Bokaro Steel City', region: 'Eastern' },
  { name: 'Deoghar', city: 'Deoghar', region: 'Eastern' },
  { name: 'Hazaribagh', city: 'Hazaribagh', region: 'Central' },
  { name: 'Giridih', city: 'Giridih', region: 'Central' },
  { name: 'Ramgarh', city: 'Ramgarh', region: 'Central' },
  { name: 'West Singhbhum', city: 'Chaibasa', region: 'Western' },
  { name: 'Seraikela Kharsawan', city: 'Seraikela', region: 'Eastern' },
  { name: 'Palamu', city: 'Daltonganj', region: 'Western' },
  { name: 'Latehar', city: 'Latehar', region: 'Western' },
  { name: 'Garhwa', city: 'Garhwa', region: 'Western' },
  { name: 'Chatra', city: 'Chatra', region: 'Central' },
  { name: 'Koderma', city: 'Koderma', region: 'Central' },
  { name: 'Jamtara', city: 'Jamtara', region: 'Eastern' },
  { name: 'Dumka', city: 'Dumka', region: 'Eastern' },
  { name: 'Pakur', city: 'Pakur', region: 'Eastern' },
  { name: 'Godda', city: 'Godda', region: 'Eastern' },
  { name: 'Sahebganj', city: 'Sahebganj', region: 'Eastern' },
  { name: 'Lohardaga', city: 'Lohardaga', region: 'Western' },
  { name: 'Gumla', city: 'Gumla', region: 'Western' },
  { name: 'Simdega', city: 'Simdega', region: 'Western' },
  { name: 'Khunti', city: 'Khunti', region: 'Central' }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      ease: "easeOut"
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
} as const;

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
} as const;

const Weather = () => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique regions
  const regions = ['All', ...Array.from(new Set(jharkhandDistricts.map(d => d.region)))];

  // Filter districts based on search and region
  const filteredDistricts = jharkhandDistricts.filter(district => {
    const matchesSearch = district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         district.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || district.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-900 dark:from-emerald-950 dark:to-teal-950">
      <DevelopmentNotice />
      <Header />
      <motion.main 
        className="container mx-auto px-6 py-24"
        initial="hidden"
        animate="visible"
        variants={shouldReduceMotion ? {} : containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-8"
            variants={shouldReduceMotion ? {} : itemVariants}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
              variants={shouldReduceMotion ? {} : itemVariants}
            >
              🌤️ Jharkhand Weather Dashboard
            </motion.h1>
            <motion.p 
              className="text-lg text-muted-foreground max-w-3xl mx-auto"
              variants={shouldReduceMotion ? {} : itemVariants}
            >
              Live weather conditions and travel safety information for all 24 districts of Jharkhand. 
              Plan your journey with real-time weather intelligence.
            </motion.p>
          </motion.div>

          {/* Controls */}
          <motion.div
            variants={shouldReduceMotion ? {} : itemVariants}
          >
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search districts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Region Filter */}
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-2">
                      {regions.map((region) => (
                        <Button
                          key={region}
                          variant={selectedRegion === region ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedRegion(region)}
                        >
                          {region}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-1 border rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="h-8 w-8 p-0"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="h-8 w-8 p-0"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Summary */}
          <motion.div 
            className="mb-6 flex items-center justify-between"
            variants={shouldReduceMotion ? {} : itemVariants}
          >
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredDistricts.length} of {jharkhandDistricts.length} districts
              </p>
              <Badge variant="outline" className="text-xs">
                Last updated: {new Date().toLocaleTimeString()}
              </Badge>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-3 w-3 mr-2" />
              Refresh All
            </Button>
          </motion.div>

          {/* Weather Grid */}
          {filteredDistricts.length > 0 && (
            <motion.div 
              className={`grid gap-4 mb-12 ${
                viewMode === 'grid' 
                  ? 'md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}
              variants={shouldReduceMotion ? {} : containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {filteredDistricts.map((district, index) => (
                <motion.div
                  key={district.name}
                  variants={shouldReduceMotion ? {} : cardVariants}
                  whileHover={shouldReduceMotion ? {} : "hover"}
                  custom={index}
                >
                  <Card className="overflow-hidden h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3 text-primary" />
                          <div>
                            <CardTitle className="text-sm">{district.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">
                              {district.city}, Jharkhand
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {district.region}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <WeatherSafetyWidget 
                        location={`${district.city}, Jharkhand`}
                        showDetails={viewMode === 'list'}
                        className="w-full"
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* No Results */}
          {filteredDistricts.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Cloud className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No districts found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or region filter
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedRegion('All');
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Additional Information Sections */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weather Safety Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• Check weather conditions before traveling to remote areas</p>
                  <p>• Monsoon season (June-September) may affect road conditions</p>
                  <p>• Winter temperatures can drop significantly in hilly regions</p>
                  <p>• Carry appropriate clothing based on seasonal weather</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Best Time to Visit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p><strong>Winter (Nov-Feb):</strong> Pleasant weather, ideal for sightseeing</p>
                  <p><strong>Summer (Mar-May):</strong> Hot weather, good for indoor attractions</p>
                  <p><strong>Monsoon (Jun-Sep):</strong> Heavy rains, lush greenery</p>
                  <p><strong>Post-Monsoon (Oct):</strong> Clear skies, moderate temperatures</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Regional Climate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p><strong>Eastern Region:</strong> Moderate climate, industrial areas</p>
                  <p><strong>Central Region:</strong> Plateau climate, cooler in winter</p>
                  <p><strong>Western Region:</strong> Hilly terrain, varies with altitude</p>
                  <p><strong>Northern Region:</strong> Continental climate, seasonal variations</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Weather Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Emergency Weather Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Emergency Services</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Emergency: 108</p>
                    <p>Police: 100</p>
                    <p>Fire: 101</p>
                    <p>Tourist Helpline: 1363</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Weather Services</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>India Meteorological Department</p>
                    <p>Weather Forecast: 1800-180-1717</p>
                    <p>Disaster Management: 011-26701700</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather-Based Activity Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Plan Your Activities Based on Weather
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Sunny Days</h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">Perfect for outdoor exploration</p>
                  <Link to="/natural-wonders">
                    <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                      Visit Waterfalls
                    </Button>
                  </Link>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Rainy Days</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">Great for indoor cultural experiences</p>
                  <Link to="/cultural-heritage">
                    <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                      Explore Museums
                    </Button>
                  </Link>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Cool Weather</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">Ideal for trekking and hiking</p>
                  <Link to="/destinations">
                    <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                      Find Trails
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="text-center">
                <Link to="/ai-trip-planner">
                  <Button className="bg-gradient-to-r from-primary to-accent">
                    Plan Trip Based on Weather Forecast
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Actions */}
          <NavigationButtons 
            showBackButton
            showRelatedActions
            relatedActions={[
              { label: "Smart Weather", path: "/smart-weather", icon: Cloud },
              { label: "Plan Trip", path: "/ai-trip-planner", icon: Calendar },
              { label: "Find Activities", path: "/destinations", icon: MapPin },
              { label: "Book Transport", path: "/transport", icon: Car },
              { label: "Emergency Help", path: "/support", icon: Phone },
              { label: "Join Community", path: "/community", icon: Users },
            ]}
          />
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Weather;