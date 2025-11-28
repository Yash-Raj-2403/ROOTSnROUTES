import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NavigationButtons } from "@/components/NavigationButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ArrowRight, Users, Calendar, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import santhaliHome from "@/assets/santhali-home.jpg";
import dokraElephant from "@/assets/dokra-elephant.jpg";
import baidyanathTemple from "@/assets/baidyanath-temple.jpg";

const CulturalHeritage = () => {
  const { t } = useLanguage();

  const culturalSites = [
    {
      id: 1,
      name: "Santhal Heritage Village",
      location: "Dumka, Santhal Pargana",
      description: "Experience authentic Santhal tribal culture with traditional architecture, folk dances, and artisan workshops.",
      image: santhaliHome,
      type: "Living Heritage",
      duration: "Half Day",
      bestTime: "October to March",
      activities: ["Cultural Performance", "Traditional Crafts", "Folk Music", "Village Tour"],
      highlights: ["Traditional Dance", "Handicraft Workshop", "Local Cuisine", "Storytelling"]
    },
    {
      id: 2,
      name: "Dokra Metal Craft Centers",
      location: "Khunti & Ranchi",
      description: "Witness the ancient art of Dokra metal casting, a 4000-year-old technique practiced by local artisans.",
      image: dokraElephant,
      type: "Artisan Craft",
      duration: "3-4 hours",
      bestTime: "Year Round",
      activities: ["Workshop Visit", "Craft Learning", "Artisan Interaction", "Shopping"],
      highlights: ["Live Demonstrations", "Hands-on Experience", "Master Artisans", "Authentic Products"]
    },
    {
      id: 3,
      name: "Baidyanath Dham",
      location: "Deoghar",
      description: "One of the twelve Jyotirlingas, this sacred temple complex showcases centuries of spiritual heritage and architecture.",
      image: baidyanathTemple,
      type: "Religious Heritage",
      duration: "Full Day",
      bestTime: "November to February",
      activities: ["Temple Visit", "Spiritual Tour", "Architecture Study", "Festival Participation"],
      highlights: ["Sacred Jyotirlinga", "Temple Architecture", "Spiritual Atmosphere", "Cultural Festivals"]
    },
    {
      id: 4,
      name: "Tribal Museum & Cultural Center",
      location: "Ranchi",
      description: "Comprehensive collection of tribal artifacts, traditional costumes, and cultural exhibits from various Jharkhand tribes.",
      image: santhaliHome,
      type: "Museum",
      duration: "2-3 hours",
      bestTime: "Year Round",
      activities: ["Museum Tour", "Cultural Exhibition", "Educational Programs", "Souvenir Shopping"],
      highlights: ["Tribal Artifacts", "Traditional Costumes", "Interactive Displays", "Cultural Programs"]
    }
  ];

  const heritageTypes = [
    { name: "All Heritage", count: culturalSites.length },
    { name: "Living Heritage", count: culturalSites.filter(s => s.type === "Living Heritage").length },
    { name: "Artisan Crafts", count: culturalSites.filter(s => s.type === "Artisan Craft").length },
    { name: "Religious Sites", count: culturalSites.filter(s => s.type === "Religious Heritage").length },
    { name: "Museums", count: culturalSites.filter(s => s.type === "Museum").length }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
              Cultural Heritage
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Immerse yourself in Jharkhand's rich tribal traditions, ancient crafts, and spiritual heritage
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace">
                <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-white/90">
                  Shop Authentic Crafts
                </Button>
              </Link>
              <Button variant="hero-outline" size="lg" className="border-white text-white hover:bg-white/10">
                Book Cultural Tour
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Types Filter */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {heritageTypes.map((type, index) => (
              <Button
                key={index}
                variant="outline"
                className="flex items-center gap-2 px-6 py-3"
              >
                {type.name}
                <Badge variant="secondary" className="ml-2">
                  {type.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Sites Grid */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {culturalSites.map((site) => (
              <Card key={site.id} className="group overflow-hidden hover:shadow-organic-lg transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={site.image}
                    alt={site.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-autumn-500 text-white">
                      {site.type}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white/90 text-forest-900">
                      <Heart className="w-3 h-3 mr-1" />
                      Cultural Site
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {site.name}
                      </h3>
                      <div className="flex items-center text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        {site.location}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {site.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-forest-500" />
                      <span className="text-muted-foreground">Duration: {site.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-autumn-500" />
                      <span className="text-muted-foreground">Best: {site.bestTime}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-foreground mb-2">Highlights:</h4>
                    <div className="flex flex-wrap gap-2">
                      {site.highlights.map((highlight, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-foreground mb-2">Activities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {site.activities.map((activity, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button className="flex-1 group">
                      Explore Heritage
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="outline">
                      Book Tour
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Heritage Programs */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Heritage Experience Programs
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Curated cultural immersion programs designed to connect you with authentic traditions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-organic-lg transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-forest-600" />
                </div>
                <CardTitle>Tribal Immersion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Live with tribal families and experience their daily life, traditions, and wisdom.
                </p>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-organic-lg transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-autumn-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-autumn-600" />
                </div>
                <CardTitle>Artisan Workshops</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Learn traditional crafts directly from master artisans in their workshops.
                </p>
                <Button variant="outline" className="w-full">
                  Book Workshop
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-organic-lg transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-golden-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-golden-600" />
                </div>
                <CardTitle>Festival Tours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Join local festivals and celebrations to witness culture in its full vibrancy.
                </p>
                <Button variant="outline" className="w-full">
                  View Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <Card className="bg-gradient-hero p-12 text-center border-0 shadow-2xl">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Preserve & Experience
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Join us in preserving Jharkhand's rich cultural heritage while creating meaningful connections
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/marketplace">
                  <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-white/90">
                    Support Local Artisans
                  </Button>
                </Link>
                <Link to="/support">
                  <Button variant="hero-outline" size="lg" className="border-white text-white hover:bg-white/10">
                    Plan Cultural Tour
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <NavigationButtons
        showBackButton={true}
        customBackPath="/explore"
        showRelatedActions={true}
        relatedActions={[
          { label: "View Handicrafts", path: "/handicrafts", icon: Heart },
          { label: "Find Authentic Stays", path: "/stays", icon: MapPin },
          { label: "Plan Cultural Tour", path: "/ai-trip-planner", icon: Calendar }
        ]}
      />

      <Footer />
    </main>
  );
};

export default CulturalHeritage;