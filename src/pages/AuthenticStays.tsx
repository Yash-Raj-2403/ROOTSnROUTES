import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, ArrowRight, Users, Wifi, UtensilsCrossed, TreePine, Mountain, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { authenticStays, generateStayId } from "@/data/stayData";
import santhaliHome from "@/assets/santhali-home.jpg";
import ecoLodge from "@/assets/eco-lodge.jpg";

const AuthenticStays = () => {
  const { t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [includeHidden, setIncludeHidden] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const authenticStays = [
    {
      id: 1,
      name: "Santhal Heritage Homestay",
      location: "Dumka, Santhal Pargana",
      description: "Experience traditional Santhal tribal lifestyle in an authentic mud house with organic farming and cultural activities.",
      image: santhaliHome,
      type: "Tribal Homestay",
      price: "₹1,800",
      rating: 4.9,
      reviews: 127,
      amenities: ["Traditional Meals", "Cultural Shows", "Handicraft Workshop", "Village Tour", "Organic Garden"],
      features: ["Eco-Friendly", "Cultural Immersion", "Family Run", "Farm-to-Table"],
      capacity: "2-6 guests",
      host: "Sita Devi & Family"
    },
    {
      id: 2,
      name: "Forest Canopy Eco Lodge",
      location: "Betla National Park, Palamu",
      description: "Sustainable tree-house style accommodation within the national park, offering wildlife viewing and nature experiences.",
      image: ecoLodge,
      type: "Eco Lodge",
      price: "₹3,500",
      rating: 4.8,
      reviews: 89,
      amenities: ["Wildlife Safari", "Bird Watching", "Guided Nature Walks", "Organic Meals", "Solar Power"],
      features: ["Carbon Neutral", "Wildlife Viewing", "Sustainable", "Adventure"],
      capacity: "2-4 guests",
      host: "Green Valley Resort"
    },
    {
      id: 3,
      name: "Munda Village Stay",
      location: "Khunti",
      description: "Stay with a traditional Munda family and learn about their sustainable farming practices and rich cultural traditions.",
      image: santhaliHome,
      type: "Village Homestay",
      price: "₹1,500",
      rating: 4.7,
      reviews: 94,
      amenities: ["Home Cooked Meals", "Farm Activities", "Traditional Crafts", "Local Festivals", "Nature Walks"],
      features: ["Community Based", "Agricultural", "Authentic", "Educational"],
      capacity: "2-8 guests",
      host: "Raman Munda Family"
    },
    {
      id: 4,
      name: "Tribal Heritage Resort",
      location: "Ranchi Hills",
      description: "Modern comfort meets traditional architecture in this sustainably built resort showcasing local materials and craftsmanship.",
      image: ecoLodge,
      type: "Heritage Resort",
      price: "₹4,200",
      rating: 4.6,
      reviews: 156,
      amenities: ["Spa & Wellness", "Yoga Sessions", "Cultural Performances", "Library", "Organic Restaurant"],
      features: ["Luxury Comfort", "Cultural Design", "Wellness Focus", "Premium Service"],
      capacity: "2-4 guests",
      host: "Heritage Hospitality"
    },
    {
      id: 5,
      name: "Dokra Artisan Home",
      location: "Khunti District",
      description: "Learn the ancient art of Dokra metal casting while staying with master artisan families in their traditional workshops.",
      image: santhaliHome,
      type: "Artisan Homestay",
      price: "₹2,000",
      rating: 4.8,
      reviews: 73,
      amenities: ["Craft Workshops", "Master Classes", "Traditional Meals", "Artisan Tools", "Product Shopping"],
      features: ["Skill Learning", "Artisan Family", "Workshop Access", "Cultural"],
      capacity: "2-6 guests",
      host: "Dokra Craft Collective"
    },
    {
      id: 6,
      name: "Waterfall Valley Camp",
      location: "Near Hundru Falls, Ranchi",
      description: "Glamping experience near Jharkhand's famous waterfalls with sustainable amenities and adventure activities.",
      image: ecoLodge,
      type: "Glamping",
      price: "₹2,800",
      rating: 4.5,
      reviews: 112,
      amenities: ["Luxury Tents", "Adventure Sports", "Waterfall Access", "Campfire", "Guided Treks"],
      features: ["Adventure", "Scenic Location", "Comfort Camping", "Nature Access"],
      capacity: "2-4 guests",
      host: "Adventure Camps Jharkhand"
    },
    // PAKUR DISTRICT
    {
      id: 7,
      name: "Hotel Crystal Palace",
      location: "Pakur",
      description: "Modern hotel with comfortable amenities and excellent service for business and leisure travelers.",
      image: ecoLodge,
      type: "Business Hotel",
      price: "₹2,200",
      rating: 4.2,
      reviews: 85,
      amenities: ["AC Rooms", "Restaurant", "Room Service", "Parking", "WiFi"],
      features: ["Modern Comfort", "Central Location", "Business Friendly", "Value for Money"],
      capacity: "2-4 guests",
      host: "Crystal Hospitality"
    },
    {
      id: 8,
      name: "Pakur Guest House",
      location: "Pakur",
      description: "Budget-friendly accommodation with clean rooms and basic amenities for comfortable stay.",
      image: santhaliHome,
      type: "Guest House",
      price: "₹1,200",
      rating: 3.8,
      reviews: 42,
      amenities: ["Clean Rooms", "Attached Bath", "Room Service", "Parking"],
      features: ["Budget Friendly", "Clean", "Basic Comfort", "Local Hospitality"],
      capacity: "2-6 guests",
      host: "Local Management"
    },
    {
      id: 9,
      name: "The Green Valley Resort",
      location: "Pakur",
      description: "Resort surrounded by greenery offering peaceful stay with nature views and recreational facilities.",
      image: ecoLodge,
      type: "Resort",
      price: "₹3,200",
      rating: 4.1,
      reviews: 67,
      amenities: ["Garden View", "Swimming Pool", "Restaurant", "Recreational Activities", "Conference Hall"],
      features: ["Nature Setting", "Recreational", "Family Friendly", "Peaceful"],
      capacity: "2-8 guests",
      host: "Green Valley Hospitality"
    },
    // PALAMU DISTRICT
    {
      id: 10,
      name: "Van Vihar",
      location: "Palamu",
      description: "Forest lodge providing comfortable accommodation for wildlife enthusiasts and nature lovers.",
      image: ecoLodge,
      type: "Forest Lodge",
      price: "₹2,800",
      rating: 4.3,
      reviews: 94,
      amenities: ["Forest Views", "Wildlife Safari", "Nature Walks", "Traditional Meals", "Campfire"],
      features: ["Wildlife Access", "Nature Immersion", "Eco-Friendly", "Adventure"],
      capacity: "2-6 guests",
      host: "Forest Department"
    },
    {
      id: 11,
      name: "Hotel Panchayat",
      location: "Palamu",
      description: "Heritage hotel showcasing local architecture and providing modern amenities with cultural touch.",
      image: santhaliHome,
      type: "Heritage Hotel",
      price: "₹2,500",
      rating: 4.0,
      reviews: 78,
      amenities: ["Heritage Architecture", "Cultural Decor", "Restaurant", "Room Service", "WiFi"],
      features: ["Heritage Style", "Cultural", "Modern Amenities", "Local Architecture"],
      capacity: "2-4 guests",
      host: "Heritage Hotels"
    },
    {
      id: 12,
      name: "Betla National Park Guest House",
      location: "Palamu",
      description: "Government guest house inside the national park for wildlife enthusiasts and researchers.",
      image: ecoLodge,
      type: "Government Guest House",
      price: "₹1,800",
      rating: 3.9,
      reviews: 56,
      amenities: ["Park Access", "Wildlife Viewing", "Basic Amenities", "Guided Tours", "Canteen"],
      features: ["Wildlife Park", "Government Run", "Research Friendly", "Budget Option"],
      capacity: "2-8 guests",
      host: "Forest Department"
    },
    // RAMGARH DISTRICT
    {
      id: 13,
      name: "The Ramgarh Residency",
      location: "Ramgarh",
      description: "Elegant hotel with modern facilities offering comfortable stay with personalized service.",
      image: ecoLodge,
      type: "Residency Hotel",
      price: "₹3,000",
      rating: 4.2,
      reviews: 89,
      amenities: ["Luxury Rooms", "Multi-cuisine Restaurant", "Conference Facilities", "Room Service", "Parking"],
      features: ["Elegant Design", "Premium Service", "Business Facilities", "Comfortable"],
      capacity: "2-4 guests",
      host: "Ramgarh Hospitality"
    },
    {
      id: 14,
      name: "Hotel Raj Palace",
      location: "Ramgarh",
      description: "Royal-themed hotel with traditional hospitality and modern comfort for discerning guests.",
      image: santhaliHome,
      type: "Palace Hotel",
      price: "₹4,500",
      rating: 4.4,
      reviews: 112,
      amenities: ["Royal Decor", "Fine Dining", "Spa Services", "Cultural Programs", "Premium Rooms"],
      features: ["Royal Theme", "Luxury", "Cultural Experience", "Premium Service"],
      capacity: "2-6 guests",
      host: "Palace Hotels Group"
    },
    // RANCHI DISTRICT
    {
      id: 15,
      name: "Radisson Blu Hotel Ranchi",
      location: "Ranchi",
      description: "International 5-star hotel with world-class amenities and services in the heart of Ranchi.",
      image: ecoLodge,
      type: "5-Star Hotel",
      price: "₹8,500",
      rating: 4.7,
      reviews: 324,
      amenities: ["Luxury Suites", "Multiple Restaurants", "Spa & Fitness", "Business Center", "Pool"],
      features: ["International Standard", "Luxury", "Business Hub", "Premium Location"],
      capacity: "2-4 guests",
      host: "Radisson Hotel Group"
    },
    {
      id: 16,
      name: "Hotel Capitol Hill",
      location: "Ranchi",
      description: "Premium business hotel located at the heart of the city with excellent connectivity.",
      image: ecoLodge,
      type: "Business Hotel",
      price: "₹4,200",
      rating: 4.3,
      reviews: 156,
      amenities: ["Business Center", "Conference Rooms", "Restaurant", "Room Service", "WiFi"],
      features: ["Business Friendly", "Central Location", "Professional Service", "Modern"],
      capacity: "2-4 guests",
      host: "Capitol Hotels"
    },
    {
      id: 17,
      name: "Hotel Yuvraj Palace",
      location: "Ranchi",
      description: "Luxury palace-themed hotel offering royal experience with modern amenities and services.",
      image: santhaliHome,
      type: "Palace Hotel",
      price: "₹5,200",
      rating: 4.5,
      reviews: 198,
      amenities: ["Royal Suites", "Heritage Dining", "Banquet Halls", "Spa", "Garden"],
      features: ["Royal Experience", "Luxury", "Heritage Design", "Premium"],
      capacity: "2-6 guests",
      host: "Yuvraj Palace Group"
    },
    {
      id: 18,
      name: "Hotel Landmark",
      location: "Ranchi",
      description: "Contemporary hotel with modern facilities catering to business and leisure travelers.",
      image: ecoLodge,
      type: "Contemporary Hotel",
      price: "₹3,800",
      rating: 4.1,
      reviews: 134,
      amenities: ["Modern Rooms", "Restaurant", "Meeting Rooms", "Gym", "WiFi"],
      features: ["Contemporary Design", "Modern Facilities", "Professional", "Convenient"],
      capacity: "2-4 guests",
      host: "Landmark Hotels"
    },
    {
      id: 19,
      name: "The Fern Residency",
      location: "Ranchi",
      description: "Eco-friendly luxury hotel committed to sustainable hospitality and environmental conservation.",
      image: ecoLodge,
      type: "Eco-Luxury Hotel",
      price: "₹6,200",
      rating: 4.6,
      reviews: 201,
      amenities: ["Eco Luxury", "Organic Restaurant", "Green Practices", "Spa", "Business Center"],
      features: ["Sustainable Luxury", "Eco-Friendly", "Environmental Focus", "Premium"],
      capacity: "2-4 guests",
      host: "The Fern Hotels"
    },
    // DEOGHAR DISTRICT
    {
      id: 20,
      name: "Hotel Shivam Inn",
      location: "Deoghar",
      description: "Comfortable hotel near Baidyanath Temple offering convenient stay for pilgrims and tourists.",
      image: santhaliHome,
      type: "Pilgrim Hotel",
      price: "₹2,800",
      rating: 4.2,
      reviews: 167,
      amenities: ["Temple Proximity", "Vegetarian Restaurant", "Prayer Room", "Room Service", "Parking"],
      features: ["Religious Tourism", "Temple Access", "Vegetarian", "Pilgrim Friendly"],
      capacity: "2-6 guests",
      host: "Shivam Hospitality"
    },
    {
      id: 21,
      name: "Hotel Mahadev",
      location: "Deoghar",
      description: "Traditional hotel with spiritual ambiance catering to devotees visiting the holy shrine.",
      image: santhaliHome,
      type: "Spiritual Hotel",
      price: "₹2,200",
      rating: 4.0,
      reviews: 143,
      amenities: ["Spiritual Ambiance", "Temple Views", "Vegetarian Food", "Prayer Facilities", "AC Rooms"],
      features: ["Spiritual Focus", "Temple Tourism", "Traditional", "Devotee Friendly"],
      capacity: "2-8 guests",
      host: "Mahadev Hotels"
    },
    {
      id: 22,
      name: "Toshali Sands",
      location: "Deoghar",
      description: "Resort-style accommodation with recreational facilities and comfortable rooms for families.",
      image: ecoLodge,
      type: "Resort",
      price: "₹4,500",
      rating: 4.3,
      reviews: 118,
      amenities: ["Resort Facilities", "Swimming Pool", "Family Rooms", "Restaurant", "Recreation"],
      features: ["Family Resort", "Recreational", "Comfortable", "Entertainment"],
      capacity: "2-8 guests",
      host: "Toshali Hotels"
    },
    // DHANBAD DISTRICT
    {
      id: 23,
      name: "Hotel Singh International",
      location: "Dhanbad",
      description: "International standard hotel with modern amenities catering to business and leisure travelers.",
      image: ecoLodge,
      type: "International Hotel",
      price: "₹4,800",
      rating: 4.4,
      reviews: 187,
      amenities: ["International Standard", "Business Center", "Multi-cuisine Restaurant", "Conference Halls", "Spa"],
      features: ["International", "Business Hub", "Modern", "Professional Service"],
      capacity: "2-4 guests",
      host: "Singh Hotels International"
    },
    {
      id: 24,
      name: "Hotel Diamond",
      location: "Dhanbad",
      description: "Contemporary hotel offering comfortable accommodation with personalized service and modern facilities.",
      image: ecoLodge,
      type: "Contemporary Hotel",
      price: "₹3,200",
      rating: 4.1,
      reviews: 134,
      amenities: ["Contemporary Rooms", "Restaurant", "Room Service", "Business Facilities", "Parking"],
      features: ["Contemporary", "Comfortable", "Good Service", "Value for Money"],
      capacity: "2-4 guests",
      host: "Diamond Hotels"
    },
    {
      id: 25,
      name: "OYO Hotels",
      location: "Dhanbad",
      description: "Budget-friendly standardized rooms with essential amenities and reliable service across multiple locations.",
      image: santhaliHome,
      type: "Budget Hotel",
      price: "₹1,800",
      rating: 3.9,
      reviews: 256,
      amenities: ["Standardized Rooms", "WiFi", "AC", "Clean Bathrooms", "Mobile Check-in"],
      features: ["Budget Friendly", "Standardized", "Technology Enabled", "Multiple Locations"],
      capacity: "2-4 guests",
      host: "OYO Hotels & Homes"
    },
    // DUMKA DISTRICT
    {
      id: 26,
      name: "Hotel Dumka International",
      location: "Dumka",
      description: "Premium hotel with international standards offering comfortable stay with modern amenities.",
      image: ecoLodge,
      type: "International Hotel",
      price: "₹3,500",
      rating: 4.2,
      reviews: 98,
      amenities: ["Premium Rooms", "Multi-cuisine Restaurant", "Conference Room", "Room Service", "WiFi"],
      features: ["International Standard", "Premium", "Business Friendly", "Modern"],
      capacity: "2-4 guests",
      host: "Dumka International Group"
    },
    {
      id: 27,
      name: "Hotel Santhal",
      location: "Dumka",
      description: "Cultural hotel celebrating Santhal heritage with traditional decor and local hospitality.",
      image: santhaliHome,
      type: "Cultural Hotel",
      price: "₹2,800",
      rating: 4.3,
      reviews: 76,
      amenities: ["Cultural Decor", "Traditional Restaurant", "Cultural Programs", "Local Guides", "Handicraft Shop"],
      features: ["Cultural Heritage", "Traditional", "Local Experience", "Authentic"],
      capacity: "2-6 guests",
      host: "Santhal Heritage Group"
    },
    {
      id: 28,
      name: "Forest View Lodge",
      location: "Dumka",
      description: "Eco-friendly lodge with forest views offering peaceful stay close to nature and tribal culture.",
      image: ecoLodge,
      type: "Eco Lodge",
      price: "₹2,400",
      rating: 4.0,
      reviews: 63,
      amenities: ["Forest Views", "Eco-friendly Practices", "Nature Walks", "Organic Food", "Bird Watching"],
      features: ["Eco-Friendly", "Nature Access", "Peaceful", "Sustainable"],
      capacity: "2-6 guests",
      host: "Forest View Hospitality"
    },
    // EAST SINGHBHUM DISTRICT
    {
      id: 29,
      name: "The Presidency Hotel",
      location: "Jamshedpur",
      description: "Luxury business hotel with premium facilities and services in the industrial capital of Jharkhand.",
      image: ecoLodge,
      type: "Luxury Business Hotel",
      price: "₹7,200",
      rating: 4.6,
      reviews: 298,
      amenities: ["Luxury Suites", "Executive Lounge", "Fine Dining", "Business Center", "Spa & Wellness"],
      features: ["Luxury", "Business Hub", "Premium Service", "Executive Focus"],
      capacity: "2-4 guests",
      host: "Presidency Hotels"
    },
    {
      id: 30,
      name: "Hotel Centre Point",
      location: "Jamshedpur",
      description: "Centrally located hotel offering convenient access to business districts and shopping areas.",
      image: ecoLodge,
      type: "Business Hotel",
      price: "₹4,200",
      rating: 4.2,
      reviews: 167,
      amenities: ["Central Location", "Business Facilities", "Restaurant", "Meeting Rooms", "WiFi"],
      features: ["Central", "Business Friendly", "Convenient", "Professional"],
      capacity: "2-4 guests",
      host: "Centre Point Hotels"
    },
    {
      id: 31,
      name: "Alcor Spa Resort",
      location: "Jamshedpur",
      description: "Wellness resort with spa facilities and recreational amenities for relaxation and rejuvenation.",
      image: ecoLodge,
      type: "Spa Resort",
      price: "₹6,800",
      rating: 4.5,
      reviews: 189,
      amenities: ["Full-service Spa", "Wellness Programs", "Swimming Pool", "Yoga Studio", "Healthy Cuisine"],
      features: ["Wellness Focus", "Spa Resort", "Relaxation", "Health & Fitness"],
      capacity: "2-4 guests",
      host: "Alcor Resorts"
    },
    {
      id: 32,
      name: "Ginger Jamshedpur",
      location: "Jamshedpur",
      description: "Smart business hotel with efficient service and modern amenities for corporate travelers.",
      image: ecoLodge,
      type: "Smart Business Hotel",
      price: "₹3,800",
      rating: 4.1,
      reviews: 234,
      amenities: ["Smart Rooms", "Business Center", "Lean Cuisine Restaurant", "Gym", "Efficient Service"],
      features: ["Smart Hotel", "Efficient", "Business Focus", "Value Driven"],
      capacity: "2-4 guests",
      host: "Ginger Hotels"
    },
    {
      id: 33,
      name: "Hotel Oasis",
      location: "Jamshedpur",
      description: "Comfortable mid-range hotel offering good amenities and service at reasonable rates.",
      image: santhaliHome,
      type: "Mid-Range Hotel",
      price: "₹2,800",
      rating: 4.0,
      reviews: 142,
      amenities: ["Comfortable Rooms", "Restaurant", "Room Service", "Parking", "WiFi"],
      features: ["Mid-Range", "Comfortable", "Good Value", "Reliable Service"],
      capacity: "2-4 guests",
      host: "Oasis Hotels"
    },
    // GARHWA DISTRICT
    {
      id: 34,
      name: "Forest Rest House",
      location: "Garhwa",
      description: "Government rest house providing basic accommodation for visitors to forest areas and wildlife sanctuaries.",
      image: ecoLodge,
      type: "Forest Rest House",
      price: "₹1,200",
      rating: 3.6,
      reviews: 34,
      amenities: ["Basic Rooms", "Forest Access", "Caretaker Service", "Simple Meals", "Nature Views"],
      features: ["Government Run", "Forest Access", "Basic Comfort", "Budget Option"],
      capacity: "2-6 guests",
      host: "Forest Department"
    },
    {
      id: 35,
      name: "Garhwa Lodge",
      location: "Garhwa",
      description: "Simple lodge offering clean accommodation with basic amenities for budget-conscious travelers.",
      image: santhaliHome,
      type: "Budget Lodge",
      price: "₹1,000",
      rating: 3.5,
      reviews: 28,
      amenities: ["Clean Rooms", "Basic Amenities", "Local Food", "Parking", "Caretaker"],
      features: ["Budget Friendly", "Clean", "Simple", "Local Hospitality"],
      capacity: "2-4 guests",
      host: "Local Management"
    },
    // GIRIDIH DISTRICT
    {
      id: 36,
      name: "Hotel Giridih Palace",
      location: "Giridih",
      description: "Heritage-style hotel with traditional architecture and modern amenities for comfortable stay.",
      image: santhaliHome,
      type: "Heritage Hotel",
      price: "₹2,500",
      rating: 4.0,
      reviews: 67,
      amenities: ["Heritage Architecture", "Traditional Decor", "Restaurant", "Room Service", "Garden"],
      features: ["Heritage Style", "Traditional", "Cultural", "Comfortable"],
      capacity: "2-4 guests",
      host: "Giridih Palace Group"
    },
    {
      id: 37,
      name: "Tourist Lodge",
      location: "Giridih",
      description: "Government tourist lodge providing affordable accommodation with basic facilities for tourists.",
      image: santhaliHome,
      type: "Tourist Lodge",
      price: "₹1,500",
      rating: 3.7,
      reviews: 45,
      amenities: ["Government Run", "Basic Facilities", "Tourist Information", "Simple Meals", "Parking"],
      features: ["Government", "Tourist Friendly", "Affordable", "Basic Comfort"],
      capacity: "2-6 guests",
      host: "Tourism Department"
    },
    // GODDA DISTRICT
    {
      id: 38,
      name: "Hotel Godda Residency",
      location: "Godda",
      description: "Comfortable hotel with modern amenities serving business and leisure travelers visiting Godda.",
      image: ecoLodge,
      type: "Residency Hotel",
      price: "₹2,200",
      rating: 3.9,
      reviews: 52,
      amenities: ["AC Rooms", "Restaurant", "Room Service", "WiFi", "Parking"],
      features: ["Modern Amenities", "Comfortable", "Local Service", "Good Value"],
      capacity: "2-4 guests",
      host: "Godda Hospitality"
    },
    {
      id: 39,
      name: "River View Lodge",
      location: "Godda",
      description: "Simple lodge with river views offering peaceful accommodation close to nature.",
      image: santhaliHome,
      type: "River Lodge",
      price: "₹1,800",
      rating: 3.8,
      reviews: 38,
      amenities: ["River Views", "Simple Rooms", "Local Food", "Fishing Access", "Nature Walks"],
      features: ["River Location", "Peaceful", "Nature Access", "Simple Comfort"],
      capacity: "2-6 guests",
      host: "River View Management"
    },
    // GUMLA DISTRICT
    {
      id: 40,
      name: "Tribal Heritage Resort",
      location: "Gumla",
      description: "Resort showcasing tribal culture and heritage with authentic experiences and comfortable accommodation.",
      image: santhaliHome,
      type: "Tribal Resort",
      price: "₹3,500",
      rating: 4.2,
      reviews: 78,
      amenities: ["Tribal Decor", "Cultural Programs", "Traditional Food", "Handicraft Shop", "Village Tours"],
      features: ["Tribal Culture", "Authentic Experience", "Cultural Immersion", "Heritage"],
      capacity: "2-8 guests",
      host: "Tribal Heritage Group"
    },
    {
      id: 41,
      name: "Forest Guest House",
      location: "Gumla",
      description: "Government guest house in forest area providing basic accommodation for nature enthusiasts.",
      image: ecoLodge,
      type: "Forest Guest House",
      price: "₹1,400",
      rating: 3.6,
      reviews: 42,
      amenities: ["Forest Location", "Basic Facilities", "Nature Access", "Simple Meals", "Trekking Guides"],
      features: ["Forest Access", "Government Run", "Nature Tourism", "Budget Option"],
      capacity: "2-8 guests",
      host: "Forest Department"
    },
    // HAZARIBAGH DISTRICT
    {
      id: 42,
      name: "Hotel Meghdoot",
      location: "Hazaribagh",
      description: "Well-established hotel offering comfortable accommodation with good service and amenities.",
      image: ecoLodge,
      type: "Established Hotel",
      price: "₹3,200",
      rating: 4.1,
      reviews: 134,
      amenities: ["Comfortable Rooms", "Multi-cuisine Restaurant", "Conference Facilities", "Room Service", "Parking"],
      features: ["Established", "Good Service", "Comfortable", "Business Friendly"],
      capacity: "2-4 guests",
      host: "Meghdoot Hotels"
    },
    {
      id: 43,
      name: "Canary Hill Resort",
      location: "Hazaribagh",
      description: "Hill resort with scenic views and recreational facilities perfect for weekend getaways.",
      image: ecoLodge,
      type: "Hill Resort",
      price: "₹4,200",
      rating: 4.3,
      reviews: 156,
      amenities: ["Hill Views", "Swimming Pool", "Adventure Sports", "Restaurant", "Recreational Activities"],
      features: ["Hill Station", "Scenic Views", "Adventure", "Weekend Getaway"],
      capacity: "2-6 guests",
      host: "Canary Hill Resorts"
    },
    {
      id: 44,
      name: "Wildlife Lodge",
      location: "Hazaribagh",
      description: "Eco-lodge near Hazaribagh National Park offering wildlife viewing and nature experiences.",
      image: ecoLodge,
      type: "Wildlife Lodge",
      price: "₹2,800",
      rating: 4.0,
      reviews: 89,
      amenities: ["Wildlife Access", "Nature Walks", "Bird Watching", "Organic Meals", "Safari Arrangements"],
      features: ["Wildlife Tourism", "Eco-Lodge", "Nature Focus", "Adventure"],
      capacity: "2-6 guests",
      host: "Wildlife Tourism Board"
    },
    // JAMTARA DISTRICT
    {
      id: 45,
      name: "Hotel Jamtara Inn",
      location: "Jamtara",
      description: "Simple hotel providing clean accommodation with basic amenities for travelers.",
      image: santhaliHome,
      type: "Inn",
      price: "₹1,600",
      rating: 3.7,
      reviews: 34,
      amenities: ["Clean Rooms", "Basic Amenities", "Local Restaurant", "Room Service", "Parking"],
      features: ["Simple", "Clean", "Basic Comfort", "Local Hospitality"],
      capacity: "2-4 guests",
      host: "Jamtara Inn Management"
    },
    {
      id: 46,
      name: "Travellers Lodge",
      location: "Jamtara",
      description: "Budget lodge catering to travelers looking for affordable and clean accommodation.",
      image: santhaliHome,
      type: "Budget Lodge",
      price: "₹1,200",
      rating: 3.5,
      reviews: 28,
      amenities: ["Budget Rooms", "Clean Bathrooms", "Simple Meals", "WiFi", "Local Guides"],
      features: ["Budget Friendly", "Traveller Focus", "Clean", "Affordable"],
      capacity: "2-6 guests",
      host: "Travellers Lodge"
    },
    // KHUNTI DISTRICT
    {
      id: 47,
      name: "Birsa Eco Resort",
      location: "Khunti",
      description: "Eco-resort named after tribal leader Birsa Munda, focusing on sustainable tourism and tribal culture.",
      image: santhaliHome,
      type: "Eco Resort",
      price: "₹3,800",
      rating: 4.4,
      reviews: 112,
      amenities: ["Eco-friendly Practices", "Tribal Cultural Programs", "Organic Food", "Nature Walks", "Handicraft Workshops"],
      features: ["Eco-Friendly", "Tribal Heritage", "Sustainable", "Cultural Experience"],
      capacity: "2-8 guests",
      host: "Birsa Eco Resorts"
    },
    {
      id: 48,
      name: "Tribal Village Homestay",
      location: "Khunti",
      description: "Authentic tribal homestay experience with local families showcasing traditional lifestyle.",
      image: santhaliHome,
      type: "Tribal Homestay",
      price: "₹2,200",
      rating: 4.5,
      reviews: 67,
      amenities: ["Family Stay", "Traditional Meals", "Cultural Activities", "Village Tours", "Handicraft Learning"],
      features: ["Authentic", "Family Experience", "Cultural Immersion", "Traditional"],
      capacity: "2-8 guests",
      host: "Tribal Community Collective"
    },
    // KODERMA DISTRICT
    {
      id: 49,
      name: "Highway Inn",
      location: "Koderma",
      description: "Convenient highway hotel providing comfortable rest for travelers on major routes.",
      image: ecoLodge,
      type: "Highway Hotel",
      price: "₹2,000",
      rating: 3.8,
      reviews: 89,
      amenities: ["Highway Location", "24-hour Service", "Restaurant", "Parking", "Fuel Station"],
      features: ["Highway Access", "Convenient", "24-hour Service", "Traveler Friendly"],
      capacity: "2-4 guests",
      host: "Highway Hospitality"
    },
    {
      id: 50,
      name: "Mica Palace Hotel",
      location: "Koderma",
      description: "Hotel themed around the region's famous mica industry with comfortable accommodation.",
      image: santhaliHome,
      type: "Theme Hotel",
      price: "₹2,500",
      rating: 4.0,
      reviews: 73,
      amenities: ["Themed Decor", "Restaurant", "Conference Room", "Room Service", "Local Tours"],
      features: ["Unique Theme", "Local Industry", "Comfortable", "Cultural"],
      capacity: "2-4 guests",
      host: "Mica Palace Group"
    },
    // LATEHAR DISTRICT
    {
      id: 51,
      name: "Netarhat Hill Resort",
      location: "Latehar",
      description: "Hill station resort with panoramic views and cool climate perfect for weekend getaways.",
      image: ecoLodge,
      type: "Hill Resort",
      price: "₹3,200",
      rating: 4.3,
      reviews: 89,
      amenities: ["Hill Views", "Cool Climate", "Trekking", "Nature Walks", "Bonfire"],
      features: ["Hill Station", "Scenic Views", "Weekend Getaway", "Nature Tourism"],
      capacity: "2-6 guests",
      host: "Netarhat Resorts"
    },
    {
      id: 52,
      name: "Sunrise Point Lodge",
      location: "Latehar",
      description: "Eco-lodge positioned perfectly to witness spectacular sunrise views over the hills.",
      image: ecoLodge,
      type: "Eco Lodge",
      price: "₹2,800",
      rating: 4.4,
      reviews: 112,
      amenities: ["Sunrise Views", "Eco-friendly", "Hiking Trails", "Photography Tours", "Organic Food"],
      features: ["Sunrise Views", "Eco-Tourism", "Photography", "Nature Access"],
      capacity: "2-4 guests",
      host: "Sunrise Eco Lodges"
    },
    {
      id: 53,
      name: "Forest Rest House",
      location: "Latehar",
      description: "Government forest rest house providing basic accommodation in pristine forest setting.",
      image: ecoLodge,
      type: "Forest Rest House",
      price: "₹1,600",
      rating: 3.8,
      reviews: 67,
      amenities: ["Forest Location", "Basic Facilities", "Wildlife Viewing", "Nature Walks", "Caretaker Service"],
      features: ["Government Run", "Forest Access", "Wildlife", "Budget Option"],
      capacity: "2-8 guests",
      host: "Forest Department"
    },
    // LOHARDAGA DISTRICT
    {
      id: 54,
      name: "Tribal Heritage Lodge",
      location: "Lohardaga",
      description: "Lodge showcasing tribal heritage and culture with authentic experiences and comfortable stay.",
      image: santhaliHome,
      type: "Heritage Lodge",
      price: "₹2,600",
      rating: 4.2,
      reviews: 78,
      amenities: ["Tribal Decor", "Cultural Programs", "Traditional Meals", "Village Tours", "Handicraft Workshops"],
      features: ["Tribal Heritage", "Cultural Experience", "Authentic", "Educational"],
      capacity: "2-8 guests",
      host: "Tribal Heritage Group"
    },
    {
      id: 55,
      name: "Koel River Lodge",
      location: "Lohardaga",
      description: "Riverside lodge offering peaceful accommodation with river views and fishing opportunities.",
      image: ecoLodge,
      type: "River Lodge",
      price: "₹2,200",
      rating: 4.0,
      reviews: 54,
      amenities: ["River Views", "Fishing", "Boating", "Nature Walks", "Peaceful Setting"],
      features: ["Riverside", "Fishing", "Peaceful", "Nature Access"],
      capacity: "2-6 guests",
      host: "Koel River Resorts"
    },
    // SAHEBGANJ DISTRICT
    {
      id: 56,
      name: "Ganges View Resort",
      location: "Sahebganj",
      description: "Luxury resort with stunning views of the Ganges river and premium amenities.",
      image: ecoLodge,
      type: "River Resort",
      price: "₹4,800",
      rating: 4.5,
      reviews: 134,
      amenities: ["Ganges Views", "Luxury Rooms", "River Activities", "Fine Dining", "Spa Services"],
      features: ["River Views", "Luxury", "Water Activities", "Premium Service"],
      capacity: "2-4 guests",
      host: "Ganges View Hospitality"
    },
    {
      id: 57,
      name: "Rajmahal Heritage Hotel",
      location: "Sahebganj",
      description: "Heritage hotel in historic Rajmahal with royal architecture and cultural significance.",
      image: santhaliHome,
      type: "Heritage Hotel",
      price: "₹3,600",
      rating: 4.3,
      reviews: 98,
      amenities: ["Heritage Architecture", "Royal Decor", "Cultural Tours", "Museum Access", "Traditional Dining"],
      features: ["Heritage", "Royal Architecture", "Cultural", "Historic"],
      capacity: "2-6 guests",
      host: "Rajmahal Heritage Group"
    },
    {
      id: 58,
      name: "Mango Orchard Homestay",
      location: "Sahebganj",
      description: "Unique homestay in mango orchards offering rural experience and fresh fruit seasons.",
      image: santhaliHome,
      type: "Orchard Homestay",
      price: "₹2,000",
      rating: 4.1,
      reviews: 76,
      amenities: ["Mango Orchards", "Farm Experience", "Fresh Fruits", "Rural Life", "Organic Food"],
      features: ["Orchard Experience", "Rural", "Seasonal Fruits", "Farm Life"],
      capacity: "2-8 guests",
      host: "Mango Orchard Family"
    },
    // SERAIKELA-KHARSAWAN DISTRICT
    {
      id: 59,
      name: "Palace Heritage Resort",
      location: "Seraikela",
      description: "Luxury resort inspired by the historic Seraikela Palace with royal ambiance and modern comfort.",
      image: santhaliHome,
      type: "Palace Resort",
      price: "₹5,500",
      rating: 4.6,
      reviews: 156,
      amenities: ["Palace Architecture", "Royal Suites", "Cultural Shows", "Fine Dining", "Heritage Tours"],
      features: ["Palace Theme", "Royal Experience", "Cultural", "Luxury"],
      capacity: "2-6 guests",
      host: "Palace Heritage Resorts"
    },
    {
      id: 60,
      name: "Chhau Dance Cultural Lodge",
      location: "Seraikela",
      description: "Cultural lodge celebrating the famous Chhau dance tradition with live performances and workshops.",
      image: santhaliHome,
      type: "Cultural Lodge",
      price: "₹3,200",
      rating: 4.4,
      reviews: 89,
      amenities: ["Chhau Performances", "Dance Workshops", "Cultural Programs", "Traditional Meals", "Artist Interactions"],
      features: ["Cultural Experience", "Dance Tradition", "Artist Interaction", "Educational"],
      capacity: "2-8 guests",
      host: "Chhau Cultural Foundation"
    },
    {
      id: 61,
      name: "Kharsawan Forest Lodge",
      location: "Seraikela-Kharsawan",
      description: "Forest lodge in Kharsawan area offering wildlife experiences and nature-based activities.",
      image: ecoLodge,
      type: "Forest Lodge",
      price: "₹2,800",
      rating: 4.1,
      reviews: 72,
      amenities: ["Forest Setting", "Wildlife Viewing", "Nature Walks", "Bird Watching", "Eco-friendly"],
      features: ["Forest Experience", "Wildlife", "Eco-Tourism", "Nature Focus"],
      capacity: "2-6 guests",
      host: "Forest Tourism Board"
    },
    // SIMDEGA DISTRICT
    {
      id: 62,
      name: "Tribal Hills Resort",
      location: "Simdega",
      description: "Hill resort celebrating tribal culture with authentic experiences in scenic mountain setting.",
      image: santhaliHome,
      type: "Tribal Hill Resort",
      price: "₹3,400",
      rating: 4.2,
      reviews: 94,
      amenities: ["Hill Views", "Tribal Culture", "Traditional Architecture", "Cultural Programs", "Local Cuisine"],
      features: ["Hill Resort", "Tribal Culture", "Scenic Views", "Cultural Experience"],
      capacity: "2-8 guests",
      host: "Tribal Hills Hospitality"
    },
    {
      id: 63,
      name: "Eco Valley Retreat",
      location: "Simdega",
      description: "Sustainable eco-retreat in valley setting focusing on environmental conservation and wellness.",
      image: ecoLodge,
      type: "Eco Retreat",
      price: "₹4,000",
      rating: 4.5,
      reviews: 123,
      amenities: ["Valley Views", "Eco-practices", "Wellness Programs", "Organic Food", "Conservation Activities"],
      features: ["Eco-Retreat", "Sustainability", "Wellness", "Conservation"],
      capacity: "2-6 guests",
      host: "Eco Valley Conservation"
    },
    // WEST SINGHBHUM DISTRICT
    {
      id: 64,
      name: "Chaibasa Grand Hotel",
      location: "Chaibasa",
      description: "Grand hotel in Chaibasa offering luxury accommodation with modern amenities and services.",
      image: ecoLodge,
      type: "Grand Hotel",
      price: "₹4,200",
      rating: 4.3,
      reviews: 167,
      amenities: ["Luxury Rooms", "Fine Dining", "Conference Facilities", "Spa Services", "Business Center"],
      features: ["Grand Hotel", "Luxury", "Business Facilities", "Premium Service"],
      capacity: "2-4 guests",
      host: "Chaibasa Grand Hospitality"
    },
    {
      id: 65,
      name: "Saranda Forest Resort",
      location: "West Singhbhum",
      description: "Exclusive resort in Saranda forests offering unique forest experiences and wildlife encounters.",
      image: ecoLodge,
      type: "Forest Resort",
      price: "₹5,200",
      rating: 4.6,
      reviews: 134,
      amenities: ["Saranda Forest", "Wildlife Safari", "Forest Walks", "Luxury Tents", "Gourmet Dining"],
      features: ["Forest Resort", "Wildlife", "Luxury", "Exclusive Experience"],
      capacity: "2-6 guests",
      host: "Saranda Forest Resorts"
    },
    {
      id: 66,
      name: "Munda Heritage Village Stay",
      location: "West Singhbhum",
      description: "Authentic village stay with Munda tribal families showcasing traditional lifestyle and culture.",
      image: santhaliHome,
      type: "Village Homestay",
      price: "₹2,400",
      rating: 4.4,
      reviews: 89,
      amenities: ["Village Life", "Munda Culture", "Traditional Meals", "Cultural Activities", "Family Interaction"],
      features: ["Authentic Village", "Tribal Culture", "Family Experience", "Traditional"],
      capacity: "2-10 guests",
      host: "Munda Village Community"
    },
    // ADDITIONAL HOTELS TO COMPLETE TARGET
    {
      id: 67,
      name: "Heritage Palace Resort",
      location: "Ranchi",
      description: "Luxury heritage resort combining royal architecture with modern amenities and spa services.",
      image: santhaliHome,
      type: "Heritage Palace Resort",
      price: "₹6,800",
      rating: 4.7,
      reviews: 198,
      amenities: ["Royal Architecture", "Luxury Spa", "Heritage Dining", "Cultural Shows", "Premium Suites"],
      features: ["Royal Heritage", "Luxury Resort", "Cultural Experience", "Premium Service"],
      capacity: "2-6 guests",
      host: "Heritage Palace Group"
    },
    {
      id: 68,
      name: "Birsa Tribal Resort",
      location: "Khunti",
      description: "Premier tribal resort celebrating Birsa Munda's legacy with authentic tribal experiences.",
      image: santhaliHome,
      type: "Tribal Resort",
      price: "₹4,500",
      rating: 4.6,
      reviews: 145,
      amenities: ["Tribal Architecture", "Cultural Immersion", "Traditional Performances", "Handicraft Workshops", "Organic Cuisine"],
      features: ["Tribal Heritage", "Cultural Resort", "Educational", "Authentic Experience"],
      capacity: "2-10 guests",
      host: "Birsa Heritage Foundation"
    },
    {
      id: 69,
      name: "Forest Canopy Resort",
      location: "Gumla",
      description: "Luxury tree-house resort in forest canopy offering unique wildlife viewing experiences.",
      image: ecoLodge,
      type: "Canopy Resort",
      price: "₹7,200",
      rating: 4.8,
      reviews: 167,
      amenities: ["Tree-house Accommodation", "Wildlife Safari", "Canopy Walks", "Luxury Amenities", "Gourmet Dining"],
      features: ["Unique Architecture", "Wildlife Access", "Luxury Experience", "Adventure"],
      capacity: "2-4 guests",
      host: "Canopy Resorts International"
    },
    {
      id: 70,
      name: "Dokra Art Village Stay",
      location: "Dhanbad",
      description: "Artisan village stay where guests can learn traditional Dokra metal casting techniques.",
      image: santhaliHome,
      type: "Artisan Village Stay",
      price: "₹2,800",
      rating: 4.5,
      reviews: 89,
      amenities: ["Dokra Workshops", "Master Artisan Classes", "Traditional Meals", "Art Gallery", "Hands-on Experience"],
      features: ["Skill Learning", "Artisan Experience", "Cultural Immersion", "Traditional Craft"],
      capacity: "2-8 guests",
      host: "Dokra Artisan Collective"
    },
    {
      id: 71,
      name: "Wellness Retreat Jharkhand",
      location: "Hazaribagh",
      description: "Holistic wellness retreat combining Ayurveda, yoga, and tribal healing practices.",
      image: ecoLodge,
      type: "Wellness Retreat",
      price: "₹5,500",
      rating: 4.7,
      reviews: 123,
      amenities: ["Ayurvedic Treatments", "Yoga Sessions", "Meditation", "Tribal Healing", "Organic Spa"],
      features: ["Wellness Focus", "Holistic Healing", "Traditional Medicine", "Spiritual Experience"],
      capacity: "2-6 guests",
      host: "Jharkhand Wellness Foundation"
    },
    {
      id: 72,
      name: "Adventure Base Camp",
      location: "Latehar",
      description: "Adventure sports base camp offering trekking, rock climbing, and outdoor adventure activities.",
      image: ecoLodge,
      type: "Adventure Camp",
      price: "₹3,800",
      rating: 4.4,
      reviews: 201,
      amenities: ["Adventure Sports", "Professional Guides", "Safety Equipment", "Group Activities", "Outdoor Camping"],
      features: ["Adventure Sports", "Professional Training", "Group Activities", "Outdoor Experience"],
      capacity: "4-12 guests",
      host: "Jharkhand Adventure Sports"
    },
    {
      id: 73,
      name: "Sustainable Eco Village",
      location: "Simdega",
      description: "Self-sufficient eco village demonstrating sustainable living and permaculture practices.",
      image: ecoLodge,
      type: "Eco Village",
      price: "₹3,200",
      rating: 4.6,
      reviews: 167,
      amenities: ["Sustainable Living", "Permaculture Tours", "Renewable Energy", "Organic Farming", "Environmental Education"],
      features: ["Sustainability", "Educational", "Eco-Friendly", "Self-Sufficient"],
      capacity: "2-8 guests",
      host: "Sustainable Living Foundation"
    },
    {
      id: 74,
      name: "Waterfalls Resort",
      location: "Ranchi",
      description: "Luxury resort near multiple waterfalls offering spectacular natural beauty and adventure.",
      image: ecoLodge,
      type: "Waterfall Resort",
      price: "₹6,500",
      rating: 4.7,
      reviews: 234,
      amenities: ["Waterfall Access", "Nature Walks", "Photography Tours", "Luxury Amenities", "Adventure Activities"],
      features: ["Natural Beauty", "Luxury Resort", "Adventure Access", "Photography"],
      capacity: "2-6 guests",
      host: "Waterfall Resorts Group"
    },
    {
      id: 75,
      name: "Cultural Heritage Lodge",
      location: "Dumka",
      description: "Lodge dedicated to preserving and showcasing Santhal cultural heritage and traditions.",
      image: santhaliHome,
      type: "Cultural Lodge",
      price: "₹3,600",
      rating: 4.5,
      reviews: 134,
      amenities: ["Cultural Programs", "Heritage Museum", "Traditional Crafts", "Folk Performances", "Cultural Guides"],
      features: ["Cultural Heritage", "Educational", "Traditional Experience", "Museum Access"],
      capacity: "2-8 guests",
      host: "Santhal Heritage Foundation"
    }
  ];

  // All 24 Districts of Jharkhand for filtering
  const districts = [
    { id: "all", name: "All Districts", count: authenticStays.length },
    { id: "ranchi", name: "Ranchi", count: authenticStays.filter(s => s.location.toLowerCase().includes("ranchi")).length },
    { id: "jamshedpur", name: "Jamshedpur", count: authenticStays.filter(s => s.location.toLowerCase().includes("jamshedpur")).length },
    { id: "dhanbad", name: "Dhanbad", count: authenticStays.filter(s => s.location.toLowerCase().includes("dhanbad")).length },
    { id: "bokaro", name: "Bokaro", count: authenticStays.filter(s => s.location.toLowerCase().includes("bokaro")).length },
    { id: "deoghar", name: "Deoghar", count: authenticStays.filter(s => s.location.toLowerCase().includes("deoghar")).length },
    { id: "hazaribagh", name: "Hazaribagh", count: authenticStays.filter(s => s.location.toLowerCase().includes("hazaribagh")).length },
    { id: "giridih", name: "Giridih", count: authenticStays.filter(s => s.location.toLowerCase().includes("giridih")).length },
    { id: "ramgarh", name: "Ramgarh", count: authenticStays.filter(s => s.location.toLowerCase().includes("ramgarh")).length },
    { id: "west-singhbhum", name: "West Singhbhum", count: authenticStays.filter(s => s.location.toLowerCase().includes("west singhbhum") || s.location.toLowerCase().includes("chaibasa")).length },
    { id: "seraikela-kharsawan", name: "Seraikela-Kharsawan", count: authenticStays.filter(s => s.location.toLowerCase().includes("seraikela")).length },
    { id: "palamu", name: "Palamu", count: authenticStays.filter(s => s.location.toLowerCase().includes("palamu")).length },
    { id: "latehar", name: "Latehar", count: authenticStays.filter(s => s.location.toLowerCase().includes("latehar")).length },
    { id: "garhwa", name: "Garhwa", count: authenticStays.filter(s => s.location.toLowerCase().includes("garhwa")).length },
    { id: "chatra", name: "Chatra", count: authenticStays.filter(s => s.location.toLowerCase().includes("chatra")).length },
    { id: "koderma", name: "Koderma", count: authenticStays.filter(s => s.location.toLowerCase().includes("koderma")).length },
    { id: "jamtara", name: "Jamtara", count: authenticStays.filter(s => s.location.toLowerCase().includes("jamtara")).length },
    { id: "dumka", name: "Dumka", count: authenticStays.filter(s => s.location.toLowerCase().includes("dumka")).length },
    { id: "pakur", name: "Pakur", count: authenticStays.filter(s => s.location.toLowerCase().includes("pakur")).length },
    { id: "godda", name: "Godda", count: authenticStays.filter(s => s.location.toLowerCase().includes("godda")).length },
    { id: "sahebganj", name: "Sahebganj", count: authenticStays.filter(s => s.location.toLowerCase().includes("sahebganj")).length },
    { id: "lohardaga", name: "Lohardaga", count: authenticStays.filter(s => s.location.toLowerCase().includes("lohardaga")).length },
    { id: "gumla", name: "Gumla", count: authenticStays.filter(s => s.location.toLowerCase().includes("gumla")).length },
    { id: "simdega", name: "Simdega", count: authenticStays.filter(s => s.location.toLowerCase().includes("simdega")).length },
    { id: "khunti", name: "Khunti", count: authenticStays.filter(s => s.location.toLowerCase().includes("khunti")).length }
  ];

  // Accommodation type filters (secondary)
  const accommodationTypes = [
    { id: "all", name: "All Types", count: authenticStays.length },
    { id: "homestay", name: "Homestays", count: authenticStays.filter(s => s.type.toLowerCase().includes("homestay")).length },
    { id: "resort", name: "Resorts", count: authenticStays.filter(s => s.type.toLowerCase().includes("resort")).length },
    { id: "hotel", name: "Hotels", count: authenticStays.filter(s => s.type.toLowerCase().includes("hotel")).length },
    { id: "lodge", name: "Lodges", count: authenticStays.filter(s => s.type.toLowerCase().includes("lodge")).length },
    { id: "eco", name: "Eco Stays", count: authenticStays.filter(s => s.type.toLowerCase().includes("eco")).length }
  ];

  // Rating filters
  const ratingFilters = [
    { id: "all", name: "All Ratings", count: authenticStays.length },
    { id: "4.5", name: "4.5+ Stars", count: authenticStays.filter(s => s.rating >= 4.5).length },
    { id: "4.0", name: "4.0+ Stars", count: authenticStays.filter(s => s.rating >= 4.0).length },
    { id: "3.5", name: "3.5+ Stars", count: authenticStays.filter(s => s.rating >= 3.5).length },
    { id: "3.0", name: "3.0+ Stars", count: authenticStays.filter(s => s.rating >= 3.0).length }
  ];

  // Price range filters
  const priceFilters = [
    { id: "all", name: "All Prices", count: authenticStays.length },
    { id: "budget", name: "Budget (₹1000-2500)", count: authenticStays.filter(s => {
      const price = parseInt(s.price.replace(/[^\d]/g, ''));
      return price >= 1000 && price <= 2500;
    }).length },
    { id: "mid", name: "Mid-range (₹2500-5000)", count: authenticStays.filter(s => {
      const price = parseInt(s.price.replace(/[^\d]/g, ''));
      return price >= 2500 && price <= 5000;
    }).length },
    { id: "premium", name: "Premium (₹5000-8000)", count: authenticStays.filter(s => {
      const price = parseInt(s.price.replace(/[^\d]/g, ''));
      return price >= 5000 && price <= 8000;
    }).length },
    { id: "luxury", name: "Luxury (₹8000+)", count: authenticStays.filter(s => {
      const price = parseInt(s.price.replace(/[^\d]/g, ''));
      return price >= 8000;
    }).length }
  ];

  // Filter stays based on selected district, type, rating, price, and search
  const filteredStays = authenticStays.filter(stay => {
    const matchesDistrict = selectedDistrict === "all" || 
      (selectedDistrict === "west-singhbhum" ? 
        (stay.location.toLowerCase().includes("west singhbhum") || stay.location.toLowerCase().includes("chaibasa")) :
        selectedDistrict === "seraikela-kharsawan" ?
        stay.location.toLowerCase().includes("seraikela") :
        stay.location.toLowerCase().includes(selectedDistrict)
      );
    
    const matchesType = selectedType === "all" || stay.type.toLowerCase().includes(selectedType);
    
    const matchesRating = selectedRating === "all" || stay.rating >= parseFloat(selectedRating);
    
    const matchesPrice = selectedPrice === "all" || (() => {
      const price = parseInt(stay.price.replace(/[^\d]/g, ''));
      switch (selectedPrice) {
        case "budget": return price >= 1000 && price <= 2500;
        case "mid": return price >= 2500 && price <= 5000;
        case "premium": return price >= 5000 && price <= 8000;
        case "luxury": return price >= 8000;
        default: return true;
      }
    })();
    
    const matchesSearch = searchTerm === "" || 
      stay.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stay.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stay.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDistrict && matchesType && matchesRating && matchesPrice && matchesSearch;
  });

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
              Authentic Stays
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Experience genuine hospitality in eco-friendly homestays, tribal villages, and sustainable lodges
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-white/90">
                Find Your Perfect Stay
              </Button>
              <Link to="/marketplace">
                <Button variant="hero-outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Browse Experiences
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Filtering Section */}
      <section className="py-8 bg-black border-b border-gray-800">
        <div className="container mx-auto px-6">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search stays by name, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg bg-gray-900 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Dropdown Filters Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            {/* Filters Label */}
            <div className="flex items-center gap-2 text-gray-400">
              <Filter className="h-5 w-5" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            {/* District Filter Dropdown */}
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Districts</SelectItem>
                {districts.filter(d => d.id !== "all").map((district) => (
                  <SelectItem key={district.id} value={district.id}>
                    {district.name} ({district.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Accommodation Type Filter Dropdown */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Types</SelectItem>
                {accommodationTypes.filter(t => t.id !== "all").map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name} ({type.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Rating Filter Dropdown */}
            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Ratings</SelectItem>
                {ratingFilters.filter(r => r.id !== "all").map((rating) => (
                  <SelectItem key={rating.id} value={rating.id}>
                    {rating.name} ({rating.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Filter Dropdown */}
            <Select value={selectedPrice} onValueChange={setSelectedPrice}>
              <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Prices</SelectItem>
                {priceFilters.filter(p => p.id !== "all").map((price) => (
                  <SelectItem key={price.id} value={price.id}>
                    {price.name} ({price.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Include Hidden Toggle */}
            <Button
              variant={includeHidden ? "default" : "outline"}
              onClick={() => setIncludeHidden(!includeHidden)}
              className="flex items-center gap-2 border-gray-700 text-white"
            >
              <Filter className="h-4 w-4" />
              Include Hidden
            </Button>
          </div>

          {/* Results Count */}
          <div className="text-center text-gray-400 text-sm">
            Showing {filteredStays.length} stays
            {selectedDistrict !== "all" && ` in ${districts.find(d => d.id === selectedDistrict)?.name}`}
            {selectedType !== "all" && ` • ${accommodationTypes.find(t => t.id === selectedType)?.name}`}
            {selectedRating !== "all" && ` • ${ratingFilters.find(r => r.id === selectedRating)?.name}`}
            {selectedPrice !== "all" && ` • ${priceFilters.find(p => p.id === selectedPrice)?.name}`}
            {includeHidden && ` • Including Hidden`}
          </div>
        </div>
      </section>

      {/* Category Filter Buttons Section */}
      <section className="py-6 bg-gray-900 border-b border-gray-700">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant={selectedType === "all" ? "default" : "outline"}
              onClick={() => setSelectedType("all")}
              className="bg-green-600 hover:bg-green-700 text-white border-0 rounded-full px-6"
            >
              All Destinations <Badge variant="secondary" className="ml-2">{authenticStays.length}</Badge>
            </Button>
            <Button
              variant={selectedType === "eco" ? "default" : "outline"}
              onClick={() => setSelectedType("eco")}
              className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 rounded-full px-6"
            >
              Eco Stays <Badge variant="secondary" className="ml-2">{accommodationTypes.find(t => t.id === "eco")?.count || 0}</Badge>
            </Button>
            <Button
              variant={selectedType === "homestay" ? "default" : "outline"}
              onClick={() => setSelectedType("homestay")}
              className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 rounded-full px-6"
            >
              Homestays <Badge variant="secondary" className="ml-2">{accommodationTypes.find(t => t.id === "homestay")?.count || 0}</Badge>
            </Button>
            <Button
              variant={selectedType === "resort" ? "default" : "outline"}
              onClick={() => setSelectedType("resort")}
              className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 rounded-full px-6"
            >
              Resorts <Badge variant="secondary" className="ml-2">{accommodationTypes.find(t => t.id === "resort")?.count || 0}</Badge>
            </Button>
            <Button
              variant={selectedType === "hotel" ? "default" : "outline"}
              onClick={() => setSelectedType("hotel")}
              className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 rounded-full px-6"
            >
              Hotels <Badge variant="secondary" className="ml-2">{accommodationTypes.find(t => t.id === "hotel")?.count || 0}</Badge>
            </Button>
            <Button
              variant={selectedType === "lodge" ? "default" : "outline"}
              onClick={() => setSelectedType("lodge")}
              className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 rounded-full px-6"
            >
              Lodges <Badge variant="secondary" className="ml-2">{accommodationTypes.find(t => t.id === "lodge")?.count || 0}</Badge>
            </Button>
          </div>
        </div>
      </section>

      {/* Authentic Stays Grid */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStays.map((stay) => {
              return (
                <Link key={stay.id} to={`/stays/${stay.id}`} className="block">
                  <Card className="group overflow-hidden hover:shadow-organic-lg transition-all duration-300">
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30">
                      {!imageErrors.has(stay.id) ? (
                        <img
                          src={stay.image}
                          alt={stay.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                          onError={() => {
                            setImageErrors(prev => new Set(prev).add(stay.id));
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {stay.type.toLowerCase().includes('homestay') ? (
                            <TreePine className="w-20 h-20 text-emerald-500/40" />
                          ) : stay.type.toLowerCase().includes('lodge') || stay.type.toLowerCase().includes('eco') ? (
                            <Mountain className="w-20 h-20 text-emerald-500/40" />
                          ) : (
                            <UtensilsCrossed className="w-20 h-20 text-emerald-500/40" />
                          )}
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-golden-500 text-white">
                          {stay.type}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className="bg-white/90 text-forest-900">
                          {stay.capacity}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="flex items-center text-white bg-black/60 px-2 py-1 rounded">
                          <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{stay.rating}</span>
                          <span className="text-xs ml-1">({stay.reviews})</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {stay.name}
                          </h3>
                          <div className="flex items-center text-muted-foreground text-sm mb-2">
                            <MapPin className="w-3 h-3 mr-1" />
                            {stay.location}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Host: {stay.host}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-forest-600">{stay.price}</div>
                          <div className="text-xs text-muted-foreground">per night</div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {stay.description}
                      </p>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-foreground text-sm mb-2">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {stay.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-foreground text-sm mb-2">Amenities:</h4>
                        <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                          {stay.amenities.slice(0, 4).map((amenity, idx) => (
                            <div key={idx} className="flex items-center">
                              <div className="w-1 h-1 bg-forest-500 rounded-full mr-2" />
                              {amenity}
                            </div>
                          ))}
                        </div>
                        {stay.amenities.length > 4 && (
                          <div className="text-xs text-primary mt-1">
                            +{stay.amenities.length - 4} more amenities
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="flex-1 group text-sm">
                          Book Now
                          <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Authentic Stays */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Choose Authentic Stays?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              More than accommodation - these are gateways to genuine cultural experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-organic-lg transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-forest-600" />
                </div>
                <CardTitle>Cultural Immersion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Live with local families and experience authentic traditions, meals, and daily life.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-organic-lg transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-autumn-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine className="w-8 h-8 text-autumn-600" />
                </div>
                <CardTitle>Sustainable Tourism</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Support eco-friendly practices and directly benefit local communities.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-organic-lg transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-golden-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mountain className="w-8 h-8 text-golden-600" />
                </div>
                <CardTitle>Unique Experiences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access exclusive activities, crafts workshops, and local knowledge.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Booking Guidelines */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Booking Guidelines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wifi className="w-5 h-5 mr-2 text-forest-500" />
                    What to Expect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-forest-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Basic amenities with focus on authentic experience
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-forest-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Traditional meals made with local ingredients
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-forest-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Cultural activities and local interactions
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UtensilsCrossed className="w-5 h-5 mr-2 text-autumn-500" />
                    Booking Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-autumn-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Book in advance, especially during festival seasons
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-autumn-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Communicate dietary preferences beforehand
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-autumn-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Respect local customs and traditions
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <Card className="bg-gradient-hero p-12 text-center border-0 shadow-2xl">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Ready for an Authentic Adventure?
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Choose your perfect stay and immerse yourself in Jharkhand's rich cultural tapestry
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-white/90">
                  Start Booking
                </Button>
                <Link to="/support">
                  <Button variant="hero-outline" size="lg" className="border-white text-white hover:bg-white/10">
                    Get Booking Help
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AuthenticStays;