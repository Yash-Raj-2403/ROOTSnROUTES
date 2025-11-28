import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Search, 
  MapPin, 
  RefreshCw,
  Filter,
  Grid,
  List
} from 'lucide-react';
import WeatherSafetyWidget from '@/components/WeatherSafetyWidget';
import { useLanguage } from '@/hooks/useLanguage';

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

const WeatherDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [refreshing, setRefreshing] = useState(false);

  const regions = ['All', 'Central', 'Eastern', 'Western'];

  const filteredDistricts = jharkhandDistricts.filter(district => {
    const matchesSearch = district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         district.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || district.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleRefreshAll = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-green-800 dark:from-emerald-700 dark:via-teal-700 dark:to-green-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            🌤️ Jharkhand Weather Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Live weather conditions and travel safety information for all 24 districts of Jharkhand. 
            Plan your journey with real-time weather intelligence.
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search districts or cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Region Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div className="flex space-x-1">
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

              {/* View Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshAll}
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-lg font-medium">
              Showing {filteredDistricts.length} of {jharkhandDistricts.length} districts
            </span>
            {selectedRegion !== 'All' && (
              <Badge variant="secondary">{selectedRegion} Region</Badge>
            )}
          </div>
        </div>

        {/* Weather Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {filteredDistricts.map((district, index) => (
              <div key={index} className="group">
                <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-sm">
                      <div>
                        <h3 className="font-bold text-sm">{district.name}</h3>
                        <p className="text-xs text-muted-foreground font-normal">
                          {district.city}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {district.region}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <WeatherSafetyWidget 
                      location={`${district.city}, Jharkhand`}
                      showDetails={false}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDistricts.map((district, index) => (
              <Card key={index} className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{district.name}</h3>
                        <Badge variant="outline">{district.region}</Badge>
                      </div>
                      <p className="text-muted-foreground flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {district.city}, Jharkhand
                      </p>
                    </div>
                    <div className="lg:col-span-2">
                      <WeatherSafetyWidget 
                        location={`${district.city}, Jharkhand`}
                        showDetails={true}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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

        {/* Footer Info */}
        <Card className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-primary-foreground">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">🎯 Smart Travel Planning</h3>
            <p className="text-emerald-100">
              Make informed decisions with real-time weather data, safety recommendations, 
              and activity suggestions for every district in Jharkhand.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeatherDashboard;