import React, { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NavigationButtons } from "@/components/NavigationButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Star, 
  Clock, 
  IndianRupee, 
  Camera, 
  Search,
  Filter,
  Eye,
  EyeOff,
  Calendar,
  Users,
  ThumbsUp
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { districtsData, getDestinationsByDistrict, getDestinationsByType, getDestinationsByCategory, type Destination } from "@/data/newDistrictsData";

const DistrictDestinations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const districts = ["all", "Khunti", "Kodarma", "Latehar", "Lohardaga"];
  const categories = ["all", "waterfalls", "wildlife", "temples", "hills", "heritage", "lakes", "parks"];
  const types = ["all", "famous", "hidden"];

  const filteredDestinations = districtsData.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dest.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistrict === "all" || dest.district === selectedDistrict;
    const matchesType = selectedType === "all" || dest.type === selectedType;
    const matchesCategory = selectedCategory === "all" || dest.category === selectedCategory;
    
    return matchesSearch && matchesDistrict && matchesType && matchesCategory;
  });

  const DestinationCard = ({ destination }: { destination: Destination }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="relative overflow-hidden">
        <img 
          src={destination.image} 
          alt={destination.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            // Fallback to a placeholder image if the Google image fails to load
            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center`;
          }}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={destination.type === 'famous' ? 'default' : 'secondary'} className="bg-white/90 text-gray-800">
            {destination.type === 'famous' ? (
              <><Eye className="w-3 h-3 mr-1" /> Famous</>
            ) : (
              <><EyeOff className="w-3 h-3 mr-1" /> Hidden Gem</>
            )}
          </Badge>
          <Badge variant="outline" className="bg-white/90 text-gray-800 capitalize">
            {destination.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 px-2 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {destination.rating}
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{destination.district} District</span>
        </div>

        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
          {destination.name}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {destination.description}
        </p>

        {/* Why Famous Section */}
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4" />
            Why it's Special
          </h4>
          <p className="text-sm text-emerald-700 dark:text-emerald-200">
            {destination.whyFamous}
          </p>
        </div>

        {/* Key Features */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Key Features:</h4>
          <div className="flex flex-wrap gap-1">
            {destination.keyFeatures.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {destination.keyFeatures.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{destination.keyFeatures.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Visit Information */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-green-600" />
            <div>
              <div className="font-medium">Entry Fee</div>
              <div className="text-gray-600 dark:text-gray-400">{destination.entryFee}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <div>
              <div className="font-medium">Timing</div>
              <div className="text-gray-600 dark:text-gray-400">{destination.timing}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            <div>
              <div className="font-medium">Best Time to Visit</div>
              <div className="text-gray-600 dark:text-gray-400">{destination.bestTime}</div>
            </div>
          </div>
        </div>

        {/* Latest Review */}
        {destination.reviews && destination.reviews.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-sm">Latest Review</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs">{destination.reviews[0].rating}/5</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              "{destination.reviews[0].comment}"
            </p>
            <p className="text-xs text-gray-500 mt-1">
              - {destination.reviews[0].author}
            </p>
          </div>
        )}

        <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
          <Camera className="w-4 h-4 mr-2" />
          Explore Location
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Explore Hidden Gems of Jharkhand
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover the breathtaking beauty of Khunti, Kodarma, Latehar, and Lohardaga districts. 
              From majestic waterfalls to serene temples, uncover the treasures that await your exploration.
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{districtsData.length}</div>
                <div className="text-sm text-gray-600">Total Places</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">4</div>
                <div className="text-sm text-gray-600">Districts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {districtsData.filter(d => d.type === 'hidden').length}
                </div>
                <div className="text-sm text-gray-600">Hidden Gems</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {districtsData.filter(d => d.type === 'famous').length}
                </div>
                <div className="text-sm text-gray-600">Famous Places</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map(district => (
                    <SelectItem key={district} value={district}>
                      {district === "all" ? "All Districts" : district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Types" : type === "famous" ? "Famous Places" : "Hidden Gems"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredDestinations.length} of {districtsData.length} destinations
            </div>
          </div>

          {/* Results */}
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No destinations found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Plan Your Jharkhand Adventure</h2>
            <p className="mb-6 opacity-90">
              Ready to explore these incredible destinations? Let our AI assistant help you plan the perfect itinerary.
            </p>
            <Button variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
              Start Planning with AI
            </Button>
          </div>
        </div>
      </main>
      
      <NavigationButtons
        showBackButton={true}
        customBackPath="/districts"
        showRelatedActions={true}
        relatedActions={[
          { label: "All Destinations", path: "/destinations", icon: MapPin },
          { label: "Plan Trip", path: "/ai-trip-planner", icon: Calendar },
          { label: "Find Nearby Hotels", path: "/stays", icon: Users }
        ]}
      />
      
      <Footer />
    </>
  );
};

export default DistrictDestinations;