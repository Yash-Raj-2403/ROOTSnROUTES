import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NavigationButtons } from "@/components/NavigationButtons";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Star, MapPin, Phone, Mail, MessageCircle, Award, Camera,
  Clock, Users, Globe, Search, Filter, MessageSquare, Calendar,
  Shield, TrendingUp, Heart, Mountain, TreePine, Building, Car, X, IndianRupee
} from "lucide-react";
import { useState, useMemo } from "react";

interface Guide {
  id: number;
  name: string;
  location: string;
  district: string;
  specialties: string[];
  rating: number;
  reviews: number;
  languages: string[];
  experience: string;
  image: string;
  phone: string;
  email: string;
  whatsapp: string;
  priceRange: string;
  availability: string;
  certifications: string[];
  expertise: string[];
  description: string;
  totalTours: number;
  successRate: number;
  preferredAreas: string[];
  groupSizeLimit: string;
  vehicleAvailable: boolean;
  emergencyTrained: boolean;
  photographySkills: boolean;
  testimonials: Array<{
    client: string;
    review: string;
    rating: number;
    date: string;
  }>;
}

const LocalGuides = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const guides: Guide[] = [
    {
      id: 1,
      name: "Rajesh Kumar Mahto",
      location: "Ranchi",
      district: "Jharkhand",
      specialties: ["Tribal Culture", "Waterfalls", "Adventure Tourism", "Photography Tours"],
      rating: 4.9,
      reviews: 267,
      languages: ["Hindi", "English", "Mundari", "Ho"],
      experience: "12 years",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      phone: "+91 9431847262",
      email: "rajesh.guide@gmail.com",
      whatsapp: "+91 9431847262",
      priceRange: "₹1,500-3,000/day",
      availability: "Available",
      certifications: ["Licensed Tour Guide", "First Aid Certified", "Wildlife Guide Certified"],
      expertise: ["Hundru Falls", "Rock Garden", "Tagore Hill", "Tribal Villages", "Local Cuisine"],
      description: "Born and raised in Ranchi, I've been exploring Jharkhand's hidden treasures for over a decade. My passion lies in sharing the rich tribal heritage and natural wonders with travelers from around the world.",
      totalTours: 1240,
      successRate: 98,
      preferredAreas: ["Ranchi", "Khunti", "Gumla"],
      groupSizeLimit: "1-15 people",
      vehicleAvailable: true,
      emergencyTrained: true,
      photographySkills: true,
      testimonials: [
        {
          client: "Sarah Johnson (USA)",
          review: "Rajesh made our Jharkhand trip unforgettable! His knowledge of tribal culture is incredible.",
          rating: 5,
          date: "2024-08-15"
        },
        {
          client: "Kumar Families (Delhi)",
          review: "Best guide we've had in India. Very professional and caring.",
          rating: 5,
          date: "2024-09-02"
        }
      ]
    },
    {
      id: 2,
      name: "Priya Devi Sinha",
      location: "Jamshedpur",
      district: "East Singhbhum",
      specialties: ["Industrial Heritage", "Urban Tours", "Food Tours", "Shopping Guide"],
      rating: 4.8,
      reviews: 189,
      languages: ["Hindi", "English", "Bengali", "Odia"],
      experience: "8 years",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      phone: "+91 9835627184",
      email: "priya.jamshedpur@gmail.com",
      whatsapp: "+91 9835627184",
      priceRange: "₹1,200-2,500/day",
      availability: "Available",
      certifications: ["City Tour Guide License", "Food Safety Certified", "Cultural Heritage Guide"],
      expertise: ["Tata Steel Plant", "Jubilee Park", "Dalma Wildlife Sanctuary", "Local Markets", "Street Food"],
      description: "Jamshedpur local with deep knowledge of industrial heritage and modern development. I love showing visitors how tradition and modernity coexist in our steel city.",
      totalTours: 856,
      successRate: 96,
      preferredAreas: ["Jamshedpur", "Dalma", "Ghatsila"],
      groupSizeLimit: "1-12 people",
      vehicleAvailable: true,
      emergencyTrained: true,
      photographySkills: false,
      testimonials: [
        {
          client: "Business Delegation (Japan)",
          review: "Excellent understanding of industrial processes and local culture.",
          rating: 5,
          date: "2024-07-20"
        }
      ]
    },
    {
      id: 3,
      name: "Santosh Oraon",
      location: "Chaibasa",
      district: "West Singhbhum",
      specialties: ["Tribal Culture", "Forest Trekking", "Traditional Arts", "Wildlife Safari"],
      rating: 4.9,
      reviews: 145,
      languages: ["Hindi", "Kurukh", "Ho", "Santali", "English"],
      experience: "15 years",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      phone: "+91 9934728561",
      email: "santosh.tribal@gmail.com",
      whatsapp: "+91 9934728561",
      priceRange: "₹1,800-3,500/day",
      availability: "Available",
      certifications: ["Tribal Culture Expert", "Forest Guide License", "Wildlife Conservation Certified"],
      expertise: ["Saranda Forest", "Tribal Villages", "Traditional Dance", "Handicrafts", "Sacred Groves"],
      description: "Indigenous guide from the Oraon community with extensive knowledge of tribal traditions, forest ecology, and wildlife. I offer authentic cultural experiences and nature immersion.",
      totalTours: 678,
      successRate: 99,
      preferredAreas: ["Chaibasa", "Saranda", "Noamundi", "Kiriburu"],
      groupSizeLimit: "1-8 people",
      vehicleAvailable: false,
      emergencyTrained: true,
      photographySkills: true,
      testimonials: [
        {
          client: "Nature Photographers (Mumbai)",
          review: "Santosh's knowledge of forest and wildlife is unmatched. Highly recommended!",
          rating: 5,
          date: "2024-08-30"
        }
      ]
    },
    {
      id: 4,
      name: "Anita Singh Verma",
      location: "Deoghar",
      district: "Jharkhand",
      specialties: ["Religious Tourism", "Pilgrimage Tours", "Temple Architecture", "Spiritual Guidance"],
      rating: 4.7,
      reviews: 298,
      languages: ["Hindi", "English", "Sanskrit", "Bengali"],
      experience: "10 years",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      phone: "+91 9431256789",
      email: "anita.deoghar@gmail.com",
      whatsapp: "+91 9431256789",
      priceRange: "₹1,000-2,000/day",
      availability: "Available",
      certifications: ["Religious Tour Guide", "Temple Architecture Expert", "Sanskrit Scholar"],
      expertise: ["Baidyanath Temple", "Satsang Ashram", "Naulakha Mandir", "Spiritual Practices", "Temple Rituals"],
      description: "Spiritual guide with deep knowledge of Hindu traditions and temple architecture. I help pilgrims and tourists understand the religious significance of Deoghar's sacred sites.",
      totalTours: 1456,
      successRate: 97,
      preferredAreas: ["Deoghar", "Jasidih", "Madhupur"],
      groupSizeLimit: "1-20 people",
      vehicleAvailable: true,
      emergencyTrained: false,
      photographySkills: false,
      testimonials: [
        {
          client: "Pilgrimage Group (Kolkata)",
          review: "Very knowledgeable about religious practices and temple history.",
          rating: 5,
          date: "2024-07-15"
        }
      ]
    },
    {
      id: 5,
      name: "Manoj Kumar Singh",
      location: "Hazaribagh",
      district: "Jharkhand",
      specialties: ["National Park Safari", "Wildlife Photography", "Nature Walks", "Bird Watching"],
      rating: 4.8,
      reviews: 156,
      languages: ["Hindi", "English", "Magahi"],
      experience: "9 years",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      phone: "+91 9835471923",
      email: "manoj.wildlife@gmail.com",
      whatsapp: "+91 9835471923",
      priceRange: "₹2,000-4,000/day",
      availability: "Available",
      certifications: ["Wildlife Guide Licensed", "Photography Certified", "Nature Conservation Expert"],
      expertise: ["Hazaribagh National Park", "Wildlife Tracking", "Bird Species", "Photography Spots", "Night Safari"],
      description: "Wildlife enthusiast and certified naturalist specializing in Hazaribagh's diverse ecosystem. Perfect for wildlife photographers and nature lovers seeking authentic jungle experiences.",
      totalTours: 543,
      successRate: 98,
      preferredAreas: ["Hazaribagh", "Koderma", "Giridih"],
      groupSizeLimit: "1-6 people",
      vehicleAvailable: true,
      emergencyTrained: true,
      photographySkills: true,
      testimonials: [
        {
          client: "Wildlife Photographers (Bangalore)",
          review: "Amazing wildlife knowledge and patience during photography sessions.",
          rating: 5,
          date: "2024-09-10"
        }
      ]
    },
    {
      id: 6,
      name: "Sunita Kumari Mahato",
      location: "Dhanbad",
      district: "Jharkhand",
      specialties: ["Coal Mining Heritage", "Industrial Tours", "Local Markets", "Cultural Events"],
      rating: 4.6,
      reviews: 112,
      languages: ["Hindi", "English", "Bengali"],
      experience: "6 years",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      phone: "+91 9932847261",
      email: "sunita.dhanbad@gmail.com",
      whatsapp: "+91 9932847261",
      priceRange: "₹1,300-2,200/day",
      availability: "Available",
      certifications: ["Industrial Heritage Guide", "Safety Certified", "Local History Expert"],
      expertise: ["Coal Mines", "Railway Heritage", "Maithon Dam", "Local Festivals", "Shopping Areas"],
      description: "Local expert in Dhanbad's coal mining heritage and industrial development. I provide insights into the region's economic importance and cultural adaptation.",
      totalTours: 387,
      successRate: 95,
      preferredAreas: ["Dhanbad", "Jharia", "Bokaro"],
      groupSizeLimit: "1-10 people",
      vehicleAvailable: false,
      emergencyTrained: true,
      photographySkills: false,
      testimonials: [
        {
          client: "Engineering Students (IIT Delhi)",
          review: "Great insights into mining operations and local development.",
          rating: 4,
          date: "2024-08-05"
        }
      ]
    },
    {
      id: 7,
      name: "Ravi Prasad Soren",
      location: "Dumka",
      district: "Jharkhand",
      specialties: ["Santali Culture", "Folk Music", "Traditional Dance", "Handicraft Villages"],
      rating: 4.9,
      reviews: 87,
      languages: ["Hindi", "Santali", "Bengali", "English"],
      experience: "11 years",
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      phone: "+91 9434628172",
      email: "ravi.santali@gmail.com",
      whatsapp: "+91 9434628172",
      priceRange: "₹1,600-3,000/day",
      availability: "Available",
      certifications: ["Cultural Heritage Expert", "Folk Art Specialist", "Community Tourism Certified"],
      expertise: ["Santali Traditions", "Folk Music", "Handicrafts", "Village Tourism", "Cultural Festivals"],
      description: "Indigenous Santali guide passionate about preserving and sharing our rich cultural heritage. I offer authentic village experiences and traditional art workshops.",
      totalTours: 329,
      successRate: 99,
      preferredAreas: ["Dumka", "Godda", "Sahebganj"],
      groupSizeLimit: "1-12 people",
      vehicleAvailable: false,
      emergencyTrained: false,
      photographySkills: true,
      testimonials: [
        {
          client: "Cultural Researchers (Germany)",
          review: "Incredible cultural knowledge and authentic village experiences.",
          rating: 5,
          date: "2024-09-01"
        }
      ]
    },
    {
      id: 8,
      name: "Deepak Kumar Tiwari",
      location: "Palamu",
      district: "Jharkhand",
      specialties: ["Betla National Park", "Tiger Safari", "Eco-Tourism", "Adventure Sports"],
      rating: 4.8,
      reviews: 203,
      languages: ["Hindi", "English", "Bhojpuri"],
      experience: "13 years",
      image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop&crop=face",
      phone: "+91 9852637492",
      email: "deepak.betla@gmail.com",
      whatsapp: "+91 9852637492",
      priceRange: "₹2,500-5,000/day",
      availability: "Available",
      certifications: ["Tiger Reserve Guide", "Eco-Tourism Certified", "Adventure Sports Licensed"],
      expertise: ["Tiger Tracking", "Betla National Park", "Wildlife Safari", "Rock Climbing", "Camping"],
      description: "Expert safari guide with specialization in tiger behavior and forest ecology. I provide thrilling wildlife experiences while ensuring safety and conservation awareness.",
      totalTours: 892,
      successRate: 98,
      preferredAreas: ["Betla", "Palamu", "Latehar"],
      groupSizeLimit: "1-8 people",
      vehicleAvailable: true,
      emergencyTrained: true,
      photographySkills: true,
      testimonials: [
        {
          client: "Wildlife Enthusiasts (UK)",
          review: "Best tiger safari experience! Deepak's knowledge is exceptional.",
          rating: 5,
          date: "2024-08-25"
        }
      ]
    }
  ];

  // Filter guides based on search and filters
  const filteredGuides = useMemo(() => {
    return guides.filter(guide => {
      const matchesSearch = guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          guide.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          guide.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesDistrict = selectedDistrict === "all" || guide.district === selectedDistrict;
      const matchesSpecialty = selectedSpecialty === "all" || guide.specialties.some(s => s.includes(selectedSpecialty));
      const matchesLanguage = selectedLanguage === "all" || guide.languages.includes(selectedLanguage);
      
      return matchesSearch && matchesDistrict && matchesSpecialty && matchesLanguage;
    });
  }, [guides, searchQuery, selectedDistrict, selectedSpecialty, selectedLanguage]);

  const districts = Array.from(new Set(guides.map(g => g.district))).sort();
  const specialties = Array.from(new Set(guides.flatMap(g => g.specialties))).sort();
  const languages = Array.from(new Set(guides.flatMap(g => g.languages))).sort();

  const handleWhatsAppContact = (phone: string, guideName: string) => {
    const message = `Hello ${guideName}, I found your profile on ROOTSnROUTES and would like to inquire about your guide services for Jharkhand tourism.`;
    window.open(`https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePhoneCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden bg-gradient-to-br from-forest-500/90 via-autumn-500/80 to-forest-600/90">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Meet Your Local Guides
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Connect with certified local experts who know Jharkhand like the back of their hand
            </p>            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search guides, locations, specialties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger>
                    <SelectValue placeholder="District" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {districts.map(district => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {specialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    {languages.map(language => (
                      <SelectItem key={language} value={language}>{language}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Results Counter */}
              <p className="text-gray-600 mb-8">
                Found {filteredGuides.length} certified local guides
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide) => (
              <Card key={guide.id} className="hover:shadow-organic-lg transition-all duration-300 bg-card border border-border shadow-organic hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-forest-200 dark:ring-forest-700">
                    <AvatarImage src={guide.image} alt={guide.name} className="object-cover" />
                    <AvatarFallback className="text-xl font-bold bg-gradient-to-r from-forest-500 to-autumn-500 text-white">
                      {guide.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl font-bold text-foreground">{guide.name}</CardTitle>
                  <div className="flex items-center justify-center text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4 mr-1 text-autumn-600 dark:text-autumn-400" />
                    <span>{guide.location}, {guide.district}</span>
                  </div>
                  
                  {/* Rating and Stats */}
                  <div className="flex items-center justify-center space-x-4 text-sm text-foreground">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold">{guide.rating}</span>
                      <span className="text-muted-foreground ml-1">({guide.reviews})</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1 text-forest-600 dark:text-forest-400" />
                      <span>{guide.totalTours} tours</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1 text-autumn-600 dark:text-autumn-400" />
                      <span>{guide.successRate}%</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Experience and Price */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2 text-forest-600 dark:text-forest-400" />
                      <span className="font-medium">{guide.experience}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-forest-600 dark:text-forest-400">{guide.priceRange}</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <div className="flex flex-wrap gap-1">
                      {guide.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-forest-100 dark:bg-forest-900 text-forest-800 dark:text-forest-200 border-0">
                          {specialty}
                        </Badge>
                      ))}
                      {guide.specialties.length > 3 && (
                        <Badge variant="secondary" className="text-xs border-0">+{guide.specialties.length - 3}</Badge>
                      )}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="flex items-center space-x-2 text-sm">
                    <Globe className="w-4 h-4 text-forest-600 dark:text-forest-400" />
                    <span className="text-muted-foreground">{guide.languages.join(', ')}</span>
                  </div>

                  {/* Key Features */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {guide.vehicleAvailable && (
                      <Badge variant="outline" className="text-forest-600 dark:text-forest-400 border-forest-300 dark:border-forest-700">
                        <Car className="w-3 h-3 mr-1" />
                        Vehicle Available
                      </Badge>
                    )}
                    {guide.emergencyTrained && (
                      <Badge variant="outline" className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700">
                        <Shield className="w-3 h-3 mr-1" />
                        First Aid
                      </Badge>
                    )}
                    {guide.photographySkills && (
                      <Badge variant="outline" className="text-golden-600 dark:text-golden-400 border-golden-300 dark:border-golden-700">
                        <Camera className="w-3 h-3 mr-1" />
                        Photography
                      </Badge>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        guide.availability === 'Available' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium text-foreground">{guide.availability}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{guide.groupSizeLimit}</div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-4">
                    <Button 
                      onClick={() => handleWhatsAppContact(guide.whatsapp, guide.name)}
                      className="bg-forest-600 hover:bg-forest-700 dark:bg-forest-500 dark:hover:bg-forest-600 text-white"
                      size="sm"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button 
                      onClick={() => handlePhoneCall(guide.phone)}
                      variant="outline" 
                      className="border-forest-600 dark:border-forest-500 text-forest-600 dark:text-forest-400 hover:bg-forest-50 dark:hover:bg-forest-950"
                      size="sm"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </div>

                  {/* View Details Button */}
                  <Button 
                    variant="ghost" 
                    className="w-full text-muted-foreground hover:text-autumn-600 dark:hover:text-autumn-400 hover:bg-autumn-50 dark:hover:bg-autumn-950"
                    size="sm"
                    onClick={() => {
                      setSelectedGuide(guide);
                      setIsDialogOpen(true);
                    }}
                  >
                    View Full Profile & Reviews
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results Message */}
          {filteredGuides.length === 0 && (
            <div className="text-center py-16">
              <div className="text-muted-foreground mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No guides found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search criteria or filters</p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDistrict("all");
                  setSelectedSpecialty("all");
                  setSelectedLanguage("all");
                }}
                variant="outline"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 bg-forest-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">Why Choose Our Local Guides?</h2>
              <p className="text-lg text-muted-foreground">Experience authentic Jharkhand through the eyes of local experts</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-forest-600 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Verified & Certified</h3>
                <p className="text-muted-foreground">All our guides are verified, licensed, and have undergone safety training</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-forest-500 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Local Expertise</h3>
                <p className="text-muted-foreground">Deep knowledge of local culture, hidden gems, and authentic experiences</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-forest-700 rounded-full flex items-center justify-center">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Multi-lingual</h3>
                <p className="text-muted-foreground">Communicate in your preferred language for better understanding</p>
              </div>
            </div>

            {/* How It Works */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="text-2xl text-center">How to Book Your Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-forest-100 dark:bg-forest-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-forest-600 dark:text-forest-300">1</span>
                    </div>
                    <h3 className="font-semibold mb-2 text-foreground">Choose Your Guide</h3>
                    <p className="text-sm text-muted-foreground">
                      Browse profiles and select based on specialties, location, and reviews
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-forest-100 dark:bg-forest-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-forest-600 dark:text-forest-300">2</span>
                    </div>
                    <h3 className="font-semibold mb-2 text-foreground">Contact Directly</h3>
                    <p className="text-sm text-muted-foreground">
                      WhatsApp or call directly to discuss your requirements and customize your tour
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-forest-100 dark:bg-forest-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-forest-600 dark:text-forest-300">3</span>
                    </div>
                    <h3 className="font-semibold mb-2 text-foreground">Enjoy Your Experience</h3>
                    <p className="text-sm text-muted-foreground">
                      Discover authentic Jharkhand with personalized insights and local stories
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Included */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">What's Included with Our Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-forest-600 dark:text-forest-400">✓ Standard Services</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Local area expertise and navigation</li>
                      <li>• Cultural interpretation and storytelling</li>
                      <li>• Hidden gems and off-beaten path locations</li>
                      <li>• Local cuisine recommendations</li>
                      <li>• Shopping assistance and negotiation</li>
                      <li>• Basic safety and emergency assistance</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-autumn-600 dark:text-autumn-400">+ Additional Services</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Transportation (where available)</li>
                      <li>• Photography assistance and tips</li>
                      <li>• First aid and emergency training</li>
                      <li>• Special interest tours (wildlife, culture, etc.)</li>
                      <li>• Multi-day trek planning</li>
                      <li>• Festival and event coordination</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-forest-50 dark:bg-forest-800 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-forest-600 dark:text-forest-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-forest-800 dark:text-forest-200 mb-1">Need Help Choosing?</h4>
                      <p className="text-sm text-forest-700 dark:text-forest-300 mb-2">
                        Our team can help match you with the perfect guide based on your interests and requirements.
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-2" />
                          <span>+91 987654321 (ROOTSnROUTES Support)</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-2" />
                          <span>rootsnroutesofficial@gmail.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Guide Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedGuide && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-20 h-20 ring-4 ring-forest-200 dark:ring-forest-700">
                    <AvatarImage src={selectedGuide.image} alt={selectedGuide.name} />
                    <AvatarFallback className="text-xl font-bold bg-gradient-to-r from-forest-500 to-autumn-500 text-white">
                      {selectedGuide.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl mb-2">{selectedGuide.name}</DialogTitle>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 mr-1 text-autumn-600 dark:text-autumn-400" />
                      <span>{selectedGuide.location}, {selectedGuide.district}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400 fill-current mr-1" />
                        <span className="font-semibold">{selectedGuide.rating}</span>
                        <span className="text-muted-foreground ml-1">({selectedGuide.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-forest-600 dark:text-forest-400" />
                        <span>{selectedGuide.totalTours} tours</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-autumn-600 dark:text-autumn-400" />
                        <span>{selectedGuide.successRate}% success</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <Separator className="my-4" />

              <div className="space-y-6">
                {/* About */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">About {selectedGuide.name.split(' ')[0]}</h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedGuide.description}</p>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-forest-50 dark:bg-forest-950/50 p-4 rounded-lg">
                    <Clock className="w-5 h-5 text-forest-600 dark:text-forest-400 mb-2" />
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-semibold text-foreground">{selectedGuide.experience}</p>
                  </div>
                  <div className="bg-autumn-50 dark:bg-autumn-950/50 p-4 rounded-lg">
                    <IndianRupee className="w-5 h-5 text-autumn-600 dark:text-autumn-400 mb-2" />
                    <p className="text-sm text-muted-foreground">Price Range</p>
                    <p className="font-semibold text-foreground">{selectedGuide.priceRange}</p>
                  </div>
                  <div className="bg-forest-50 dark:bg-forest-950/50 p-4 rounded-lg">
                    <Users className="w-5 h-5 text-forest-600 dark:text-forest-400 mb-2" />
                    <p className="text-sm text-muted-foreground">Group Size</p>
                    <p className="font-semibold text-foreground">{selectedGuide.groupSizeLimit}</p>
                  </div>
                  <div className="bg-autumn-50 dark:bg-autumn-950/50 p-4 rounded-lg">
                    <div className={`w-3 h-3 rounded-full mb-2 ${
                      selectedGuide.availability === 'Available' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold text-foreground">{selectedGuide.availability}</p>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedGuide.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="bg-forest-100 dark:bg-forest-900 text-forest-800 dark:text-forest-200 border-0">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Areas of Expertise */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Areas of Expertise</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedGuide.expertise.map((item, index) => (
                      <div key={index} className="flex items-center text-sm text-muted-foreground">
                        <Award className="w-4 h-4 mr-2 text-autumn-600 dark:text-autumn-400" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Languages Spoken</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedGuide.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="border-forest-300 dark:border-forest-700">
                        <Globe className="w-3 h-3 mr-1" />
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Certifications & Training</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedGuide.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center text-sm text-muted-foreground">
                        <Shield className="w-4 h-4 mr-2 text-forest-600 dark:text-forest-400" />
                        {cert}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Features */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Service Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedGuide.vehicleAvailable && (
                      <Badge variant="outline" className="text-forest-600 dark:text-forest-400 border-forest-300 dark:border-forest-700">
                        <Car className="w-3 h-3 mr-1" />
                        Vehicle Available
                      </Badge>
                    )}
                    {selectedGuide.emergencyTrained && (
                      <Badge variant="outline" className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700">
                        <Shield className="w-3 h-3 mr-1" />
                        First Aid Certified
                      </Badge>
                    )}
                    {selectedGuide.photographySkills && (
                      <Badge variant="outline" className="text-golden-600 dark:text-golden-400 border-golden-300 dark:border-golden-700">
                        <Camera className="w-3 h-3 mr-1" />
                        Photography Guide
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Preferred Areas */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Preferred Service Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedGuide.preferredAreas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="bg-autumn-100 dark:bg-autumn-900 text-autumn-800 dark:text-autumn-200 border-0">
                        <MapPin className="w-3 h-3 mr-1" />
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Testimonials */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Client Reviews & Testimonials</h3>
                  <div className="space-y-4">
                    {selectedGuide.testimonials.map((testimonial, index) => (
                      <Card key={index} className="bg-card border-border">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-semibold text-foreground">{testimonial.client}</p>
                              <p className="text-xs text-muted-foreground">{new Date(testimonial.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < testimonial.rating
                                      ? 'text-yellow-500 dark:text-yellow-400 fill-current'
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground italic">"{testimonial.review}"</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="sticky bottom-0 bg-background pt-4 pb-2 border-t border-border">
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={() => handleWhatsAppContact(selectedGuide.whatsapp, selectedGuide.name)}
                      className="bg-forest-600 hover:bg-forest-700 dark:bg-forest-500 dark:hover:bg-forest-600 text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      WhatsApp Now
                    </Button>
                    <Button 
                      onClick={() => handlePhoneCall(selectedGuide.phone)}
                      variant="outline"
                      className="border-forest-600 dark:border-forest-500 text-forest-600 dark:text-forest-400 hover:bg-forest-50 dark:hover:bg-forest-950"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                  <div className="mt-3 text-center">
                    <Button 
                      variant="link" 
                      size="sm"
                      onClick={() => window.open(`mailto:${selectedGuide.email}`, '_blank')}
                      className="text-muted-foreground hover:text-autumn-600 dark:hover:text-autumn-400"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Email: {selectedGuide.email}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <NavigationButtons
        showBackButton={true}
        customBackPath="/services"
        showRelatedActions={true}
        relatedActions={[
          { label: "Book Tour Guide", path: "/ai-trip-planner", icon: Calendar },
          { label: "Find Destinations", path: "/destinations", icon: MapPin },
          { label: "Contact Support", path: "/support", icon: MessageSquare }
        ]}
      />

      <Footer />
    </main>
  );
};

export default LocalGuides;