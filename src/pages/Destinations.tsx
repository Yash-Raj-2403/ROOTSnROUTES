import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DevelopmentNotice from "@/components/DevelopmentNotice";
import { NavigationButtons } from "@/components/NavigationButtons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, Clock, IndianRupee, Camera, Eye, EyeOff, Filter, Search, ArrowRight, Sparkles, Bed, Car } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { allDestinations } from "@/data/completeDestinations";
import FavoriteButton from "@/components/FavoriteButton";

const Destinations = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeDistrict, setActiveDistrict] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [showHidden, setShowHidden] = useState(false);

  // Check for district filter from URL params
  useEffect(() => {
    const districtParam = searchParams.get('district');
    if (districtParam) {
      setActiveDistrict(districtParam);
    }
  }, [searchParams]);

  // Calculate category counts dynamically
  const categories = useMemo(() => {
    const categoryCount = (category: string) => {
      if (category === "all") return allDestinations.length;
      return allDestinations.filter(dest => dest.category === category).length;
    };

    return [
      { name: "All Destinations", value: "all", count: categoryCount("all") },
      { name: "Waterfalls", value: "waterfalls", count: categoryCount("waterfalls") },
      { name: "Wildlife", value: "wildlife", count: categoryCount("wildlife") },
      { name: "Temples", value: "temples", count: categoryCount("temples") },
      { name: "Hills", value: "hills", count: categoryCount("hills") },
      { name: "Heritage", value: "heritage", count: categoryCount("heritage") },
      { name: "Lakes", value: "lakes", count: categoryCount("lakes") },
      { name: "Dams", value: "dams", count: categoryCount("dams") },
      { name: "Parks", value: "parks", count: categoryCount("parks") }
    ];
  }, []);

  // Get all unique districts from destinations data
  const districts = useMemo(() => {
    const uniqueDistricts = [...new Set(allDestinations.map(dest => dest.district))].sort();
    return ["all", ...uniqueDistricts];
  }, []);
  const types = ["all", "famous", "hidden"];

  // Filter destinations based on active filters
  const filteredDestinations = useMemo(() => {
    return allDestinations.filter(destination => {
      const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           destination.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           destination.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = activeCategory === "all" || destination.category === activeCategory;
      const matchesDistrict = activeDistrict === "all" || destination.district === activeDistrict;
      const matchesType = activeType === "all" || destination.type === activeType;
      const matchesVisibility = showHidden || destination.type === "famous";

      return matchesSearch && matchesCategory && matchesDistrict && matchesType && matchesVisibility;
    });
  }, [searchTerm, activeCategory, activeDistrict, activeType, showHidden]);

  return (
    <main>
      <DevelopmentNotice />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary/90 via-accent/80 to-secondary/90">
        <div className="container mx-auto px-6">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Jharkhand Destinations</h1>
            <p className="text-xl mb-8 max-w-4xl mx-auto">
              Explore over 200 destinations across all 24 districts - from hidden gems to famous landmarks
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <Input 
                  type="text"
                  placeholder="Search destinations, districts, or features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 pl-12 text-lg bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/70"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Filters */}
      <section className="py-6 bg-background border-b border-border">
        <div className="container mx-auto px-6">
          {/* Primary Filters Row */}
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={activeCategory === category.value ? "default" : "outline"}
                onClick={() => setActiveCategory(category.value)}
                className="gap-2"
              >
                {category.name}
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Secondary Filters Row */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filters:</span>
            </div>
            
            <Select value={activeDistrict} onValueChange={setActiveDistrict}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district === "all" ? "All Districts" : district}
                    {district !== "all" && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({allDestinations.filter(dest => dest.district === district).length})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={activeType} onValueChange={setActiveType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Places" : type === "famous" ? "Famous Places" : "Hidden Gems"}
                    {type !== "all" && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({allDestinations.filter(dest => dest.type === type).length})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showHidden ? "default" : "outline"}
              size="sm"
              onClick={() => setShowHidden(!showHidden)}
              className="gap-2"
            >
              {showHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              Include Hidden
            </Button>
          </div>
        </div>
      </section>

      {/* Results Header */}
      <section className="py-6 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                {filteredDestinations.length} Destinations Found
              </h2>
              <p className="text-muted-foreground mt-2">
                Showing results for{" "}
                {activeCategory !== "all" && `${categories.find(c => c.value === activeCategory)?.name}, `}
                {activeDistrict !== "all" && `${activeDistrict} district, `}
                {activeType !== "all" && `${activeType} places`}
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <Badge variant="outline" className="mr-2">
                Famous: {filteredDestinations.filter(d => d.type === 'famous').length}
              </Badge>
              <Badge variant="secondary">
                Hidden: {filteredDestinations.filter(d => d.type === 'hidden').length}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden bg-card border-border hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-medium">{destination.rating}</span>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant={destination.type === 'hidden' ? "destructive" : "secondary"} 
                      className={destination.type === 'hidden' ? "bg-orange-500" : "bg-primary text-white"}
                    >
                      {destination.type === 'hidden' ? "Hidden Gem" : "Famous"}
                    </Badge>
                  </div>

                  {/* Reviews Count */}
                  <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Camera className="w-4 h-4 text-white" />
                    <span className="text-white text-sm">{destination.reviews.length} reviews</span>
                  </div>
                  
                  {/* Favorite Button */}
                  <FavoriteButton
                    destinationId={destination.id.toString()}
                    destinationName={destination.name}
                    destinationType={destination.category}
                    destinationDistrict={destination.district}
                    destinationImageUrl={destination.image}
                    variant="floating"
                    size="sm"
                    className="top-4 left-1/2 transform -translate-x-1/2"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-foreground">
                      {destination.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {destination.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{destination.district} District</span>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                    {destination.description.substring(0, 120)}...
                  </p>

                  {/* Why Famous Section */}
                  <div className="mb-4 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <h4 className="text-sm font-semibold text-orange-800 mb-1">Why Visit:</h4>
                    <p className="text-xs text-orange-700">
                      {destination.whyFamous.substring(0, 100)}...
                    </p>
                  </div>

                  {/* Key Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {destination.keyFeatures.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {destination.keyFeatures.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{destination.keyFeatures.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <IndianRupee className="w-3 h-3" />
                        <span className="text-xs">Entry</span>
                      </div>
                      <div className="font-medium text-foreground text-xs">{destination.entryFee}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">Timing</span>
                      </div>
                      <div className="font-medium text-foreground text-xs">{destination.timing}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground mb-1 text-xs">Best Time</div>
                      <div className="font-medium text-primary text-xs">{destination.bestTime}</div>
                    </div>
                  </div>

                  {/* Reviews Preview */}
                  {destination.reviews.length > 0 && (
                    <div className="mb-4 p-3 bg-emerald-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-emerald-800">Latest Review</h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-emerald-700">{destination.reviews[0].rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-emerald-700 italic">
                        "{destination.reviews[0].comment.substring(0, 80)}..."
                      </p>
                      <p className="text-xs text-emerald-600 mt-1">- {destination.reviews[0].author}</p>
                    </div>
                  )}

                  <Link to={`/destination/${destination.id}`} className="w-full">
                    <Button variant="default" className="w-full group">
                      View Full Details
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("all");
                  setActiveDistrict("all");
                  setActiveType("all");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <NavigationButtons
        showBackButton={true}
        customBackPath="/explore"
        showRelatedActions={true}
        relatedActions={[
          { label: "Plan Your Trip", path: "/ai-trip-planner", icon: Sparkles },
          { label: "Find Hotels", path: "/stays", icon: Bed },
          { label: "Local Transport", path: "/transport", icon: Car }
        ]}
      />

      <Footer />
    </main>
  );
};

export default Destinations;