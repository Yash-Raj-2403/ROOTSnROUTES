import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UtensilsCrossed, 
  MapPin, 
  Star, 
  Clock, 
  Phone,
  Heart,
  ChefHat,
  Search,
  Filter
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { allRestaurants, generateRestaurantId } from "@/data/restaurantData";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Restaurants = () => {
  const { t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [includeHidden, setIncludeHidden] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // All 24 Districts of Jharkhand for filtering
  const districts = [
    { id: "all", name: "All Districts", count: 63 },
    { id: "ranchi", name: "Ranchi", count: 8 },
    { id: "jamshedpur", name: "Jamshedpur", count: 6 },
    { id: "dhanbad", name: "Dhanbad", count: 5 },
    { id: "bokaro", name: "Bokaro", count: 2 },
    { id: "dumka", name: "Dumka", count: 4 },
    { id: "deoghar", name: "Deoghar", count: 3 },
    { id: "palamu", name: "Palamu", count: 4 },
    { id: "hazaribagh", name: "Hazaribagh", count: 4 },
    { id: "giridih", name: "Giridih", count: 2 },
    { id: "ramgarh", name: "Ramgarh", count: 3 },
    { id: "west-singhbhum", name: "West Singhbhum", count: 2 },
    { id: "seraikela-kharsawan", name: "Seraikela-Kharsawan", count: 2 },
    { id: "latehar", name: "Latehar", count: 1 },
    { id: "garhwa", name: "Garhwa", count: 2 },
    { id: "chatra", name: "Chatra", count: 2 },
    { id: "koderma", name: "Koderma", count: 2 },
    { id: "jamtara", name: "Jamtara", count: 2 },
    { id: "pakur", name: "Pakur", count: 3 },
    { id: "godda", name: "Godda", count: 2 },
    { id: "sahebganj", name: "Sahebganj", count: 1 },
    { id: "lohardaga", name: "Lohardaga", count: 1 },
    { id: "gumla", name: "Gumla", count: 2 },
    { id: "simdega", name: "Simdega", count: 1 },
    { id: "khunti", name: "Khunti", count: 3 }
  ];

  // Cuisine types (Secondary)
  const cuisineTypes = [
    { id: "all", name: "All Cuisines", count: 63 },
    { id: "tribal", name: "Tribal Cuisine", count: 12 },
    { id: "traditional", name: "Traditional", count: 10 },
    { id: "north-indian", name: "North Indian", count: 15 },
    { id: "multi-cuisine", name: "Multi-Cuisine", count: 8 },
    { id: "fast-food", name: "Fast Food", count: 6 },
    { id: "eco-friendly", name: "Eco-Friendly", count: 4 },
    { id: "others", name: "Other Cuisines", count: 8 }
  ];

  // Rating filters
  const ratingFilters = [
    { id: "all", name: "All Ratings", count: 63 },
    { id: "4.5", name: "4.5+ Stars", count: 15 },
    { id: "4.0", name: "4.0+ Stars", count: 28 },
    { id: "3.5", name: "3.5+ Stars", count: 45 },
    { id: "3.0", name: "3.0+ Stars", count: 58 }
  ];

  // Price range filters  
  const priceFilters = [
    { id: "all", name: "All Prices", count: 63 },
    { id: "₹", name: "Budget (₹)", count: 18 },
    { id: "₹₹", name: "Mid-range (₹₹)", count: 25 },
    { id: "₹₹₹", name: "Premium (₹₹₹)", count: 15 },
    { id: "₹₹₹₹", name: "Luxury (₹₹₹₹)", count: 5 }
  ];

  // All restaurants from across Jharkhand districts
  const allRestaurants = [
    {
      id: 1,
      name: "Santhal Tribal Kitchen",
      location: "Dumka",
      district: "Dumka",
      cuisine: "Tribal Cuisine",
      type: "restaurant",
      category: "family",
      rating: 4.8,
      price: "₹₹",
      specialty: "Authentic Santhal dishes with organic ingredients",
      image: "https://picsum.photos/400/300?random=1",
      timings: "11:00 AM - 10:00 PM",
      phone: "+91 9876543210",
      dishes: ["Handia Rice", "Pitha", "Mahua Flowers", "Wild Honey"]
    },
    {
      id: 2,
      name: "Jharkhand Thali House",
      location: "Ranchi",
      district: "Ranchi",
      cuisine: "Traditional",
      type: "restaurant",
      category: "family",
      rating: 4.6,
      price: "₹₹",
      specialty: "Complete Jharkhand thali with 15+ items",
      image: "https://picsum.photos/400/300?random=2",
      timings: "12:00 PM - 11:00 PM",
      phone: "+91 9876543211",
      dishes: ["Dhuska", "Aloo Chokha", "Rugra", "Bamboo Shoot Curry"]
    },
    {
      id: 3,
      name: "Munda Heritage Restaurant",
      location: "Khunti",
      cuisine: "Munda Cuisine",
      rating: 4.7,
      price: "₹₹₹",
      specialty: "Traditional Munda recipes passed down generations",
      image: "https://picsum.photos/400/300?random=3",
      timings: "10:00 AM - 9:00 PM",
      phone: "+91 9876543212",
      dishes: ["Chilka Roti", "Kurthi Dal", "Wild Mushrooms", "Forest Greens"]
    },
    {
      id: 4,
      name: "Forest Flavors",
      location: "Netarhat",
      cuisine: "Eco-Friendly",
      rating: 4.9,
      price: "₹₹₹",
      specialty: "Farm-to-table dining with mountain views",
      image: "https://picsum.photos/400/300?random=4",
      timings: "7:00 AM - 9:00 PM",
      phone: "+91 9876543213",
      dishes: ["Organic Rice", "Hill Vegetables", "Fresh Fish", "Local Fruits"]
    },
    // PAKUR DISTRICT
    {
      id: 5,
      name: "Ruchi Restaurant",
      location: "Pakur",
      cuisine: "Multi-Cuisine",
      rating: 4.2,
      price: "₹₹",
      specialty: "Family restaurant with diverse menu options",
      image: "https://picsum.photos/400/300?random=5",
      timings: "9:00 AM - 10:00 PM",
      phone: "+91 9876543214",
      dishes: ["North Indian", "Chinese", "Local Favorites"]
    },
    {
      id: 6,
      name: "Pahari Dhaba",
      location: "Pakur",
      cuisine: "North Indian",
      rating: 4.0,
      price: "₹",
      specialty: "Traditional dhaba-style cooking with authentic flavors",
      image: "https://picsum.photos/400/300?random=6",
      timings: "6:00 AM - 11:00 PM",
      phone: "+91 9876543215",
      dishes: ["Dal Tadka", "Roti", "Sabzi", "Lassi"]
    },
    {
      id: 7,
      name: "The Pizza Paddler",
      location: "Pakur",
      cuisine: "Fast Food",
      rating: 4.1,
      price: "₹₹",
      specialty: "Fresh pizzas and fast food favorites",
      image: "https://picsum.photos/400/300?random=7",
      timings: "11:00 AM - 11:00 PM",
      phone: "+91 9876543216",
      dishes: ["Pizza", "Burgers", "Sandwiches", "Cold Drinks"]
    },
    // PALAMU DISTRICT
    {
      id: 8,
      name: "La-Zeez Restaurants",
      location: "Palamu",
      cuisine: "North Indian",
      rating: 4.5,
      price: "₹₹₹",
      specialty: "Fine dining with premium North Indian cuisine",
      image: "https://picsum.photos/400/300?random=8",
      timings: "12:00 PM - 11:00 PM",
      phone: "+91 9876543217",
      dishes: ["Biryani", "Kebabs", "Curries", "Naan"]
    },
    {
      id: 9,
      name: "Tandoor Palace",
      location: "Palamu",
      cuisine: "North Indian",
      rating: 4.3,
      price: "₹₹",
      specialty: "Authentic tandoor specialties and grilled items",
      image: "https://picsum.photos/400/300?random=9",
      timings: "6:00 PM - 11:00 PM",
      phone: "+91 9876543218",
      dishes: ["Tandoori Chicken", "Naan", "Kebabs", "Dal Makhani"]
    },
    {
      id: 10,
      name: "Biryani Global",
      location: "Palamu",
      cuisine: "North Indian",
      rating: 4.2,
      price: "₹₹",
      specialty: "Premium biryani varieties and rice dishes",
      image: "https://picsum.photos/400/300?random=10",
      timings: "11:00 AM - 10:00 PM",
      phone: "+91 9876543219",
      dishes: ["Chicken Biryani", "Mutton Biryani", "Vegetable Biryani", "Raita"]
    },
    // RAMGARH DISTRICT
    {
      id: 11,
      name: "Spice Garden",
      location: "Ramgarh",
      cuisine: "Multi-Cuisine",
      rating: 4.4,
      price: "₹₹₹",
      specialty: "Garden dining with aromatic spices and flavors",
      image: "https://picsum.photos/400/300?random=11",
      timings: "11:00 AM - 10:30 PM",
      phone: "+91 9876543220",
      dishes: ["Continental", "Indian", "Chinese", "Desserts"]
    },
    {
      id: 12,
      name: "Royal Tadka",
      location: "Ramgarh",
      cuisine: "North Indian",
      rating: 4.3,
      price: "₹₹₹",
      specialty: "Royal recipes with traditional cooking methods",
      image: "https://picsum.photos/400/300?random=12",
      timings: "7:00 PM - 11:00 PM",
      phone: "+91 9876543221",
      dishes: ["Royal Thali", "Rich Curries", "Breads", "Sweets"]
    },
    // RANCHI DISTRICT  
    {
      id: 13,
      name: "Yellow Sapphire",
      location: "Ranchi",
      cuisine: "Multi-Cuisine",
      rating: 4.6,
      price: "₹₹₹₹",
      specialty: "Luxury dining with premium multi-cuisine options",
      image: "https://picsum.photos/400/300?random=13",
      timings: "12:00 PM - 12:00 AM",
      phone: "+91 9876543222",
      dishes: ["Continental", "Asian", "Indian", "Wine Selection"]
    },
    {
      id: 14,
      name: "The Reef Rooftop Restaurant",
      location: "Ranchi",
      cuisine: "Multi-Cuisine",
      rating: 4.5,
      price: "₹₹₹",
      specialty: "Rooftop dining with panoramic city views",
      image: "https://picsum.photos/400/300?random=14",
      timings: "6:00 PM - 12:00 AM",
      phone: "+91 9876543223",
      dishes: ["Grilled Items", "Mocktails", "Live BBQ", "Desserts"]
    },
    {
      id: 15,
      name: "Moti Mahal Delux Tandoori Trail",
      location: "Ranchi",
      cuisine: "North Indian",
      rating: 4.7,
      price: "₹₹₹",
      specialty: "Famous chain known for tandoori and Mughlai cuisine",
      image: "https://picsum.photos/400/300?random=15",
      timings: "11:00 AM - 11:00 PM",
      phone: "+91 9876543224",
      dishes: ["Butter Chicken", "Dal Makhani", "Naan", "Kulfi"]
    },
    {
      id: 16,
      name: "Backyard Cafe",
      location: "Ranchi",
      cuisine: "Continental",
      rating: 4.4,
      price: "₹₹",
      specialty: "Cozy cafe atmosphere with continental favorites",
      image: "https://picsum.photos/400/300?random=16",
      timings: "9:00 AM - 10:00 PM",
      phone: "+91 9876543225",
      dishes: ["Pasta", "Sandwiches", "Coffee", "Cakes"]
    },
    {
      id: 17,
      name: "KAREEM'S",
      location: "Ranchi",
      cuisine: "North Indian",
      rating: 4.8,
      price: "₹₹₹",
      specialty: "Historic Mughlai restaurant with authentic recipes",
      image: "https://picsum.photos/400/300?random=17",
      timings: "12:00 PM - 12:00 AM",
      phone: "+91 9876543226",
      dishes: ["Mutton Korma", "Chicken Jahangiri", "Seekh Kebab", "Roomali Roti"]
    },
    // DEOGHAR DISTRICT
    {
      id: 18,
      name: "Moti Mahal Delux",
      location: "Deoghar",
      cuisine: "North Indian",
      rating: 4.5,
      price: "₹₹₹",
      specialty: "Premium North Indian and Chinese cuisine",
      image: "https://picsum.photos/400/300?random=18",
      timings: "11:00 AM - 11:00 PM",
      phone: "+91 9876543227",
      dishes: ["Tandoori", "Chinese", "Biryani", "Sweets"]
    },
    {
      id: 19,
      name: "Cafe Spices",
      location: "Deoghar",
      cuisine: "Multi-Cuisine",
      rating: 4.2,
      price: "₹₹",
      specialty: "Casual cafe with spiced delicacies and beverages",
      image: "https://picsum.photos/400/300?random=19",
      timings: "9:00 AM - 9:00 PM",
      phone: "+91 9876543228",
      dishes: ["Spiced Tea", "Snacks", "Light Meals", "Desserts"]
    },
    {
      id: 20,
      name: "Baba Baidyanath Pera Bhandar",
      location: "Deoghar",
      cuisine: "Sweets",
      rating: 4.6,
      price: "₹",
      specialty: "Famous for traditional sweets and local desserts",
      image: "https://picsum.photos/400/300?random=20",
      timings: "6:00 AM - 10:00 PM",
      phone: "+91 9876543229",
      dishes: ["Pera", "Rasgulla", "Sandesh", "Kheer"]
    },
    // DHANBAD DISTRICT
    {
      id: 21,
      name: "KFC",
      location: "Dhanbad - Ozone Plaza",
      cuisine: "Fast Food",
      rating: 4.1,
      price: "₹₹",
      specialty: "International fast food chain with fried chicken",
      image: "https://picsum.photos/400/300?random=21",
      timings: "11:00 AM - 11:00 PM",
      phone: "+91 9876543230",
      dishes: ["Fried Chicken", "Burgers", "Wraps", "Sides"]
    },
    {
      id: 22,
      name: "Domino's",
      location: "Dhanbad",
      cuisine: "Fast Food", 
      rating: 4.0,
      price: "₹₹",
      specialty: "Pizza delivery and dine-in with Italian favorites",
      image: "https://picsum.photos/400/300?random=22",
      timings: "11:00 AM - 12:00 AM",
      phone: "+91 9876543231",
      dishes: ["Pizza", "Garlic Bread", "Pasta", "Beverages"]
    },
    // DUMKA DISTRICT
    {
      id: 23,
      name: "Dumka Palace Restaurant",
      location: "Dumka",
      cuisine: "Multi-Cuisine",
      rating: 4.1,
      price: "₹₹",
      specialty: "Local and international dishes in elegant setting",
      image: "https://picsum.photos/400/300?random=23",
      timings: "9:00 AM - 10:00 PM",
      phone: "+91 9876543232",
      dishes: ["Indian", "Chinese", "Continental", "Local Specials"]
    },
    {
      id: 24,
      name: "Royal Treat Restaurant",
      location: "Dumka",
      cuisine: "North Indian",
      rating: 4.2,
      price: "₹₹",
      specialty: "Royal ambiance with traditional North Indian cuisine",
      image: "https://picsum.photos/400/300?random=24",
      timings: "11:00 AM - 10:00 PM",
      phone: "+91 9876543233",
      dishes: ["Dal Makhani", "Paneer", "Tandoori", "Biryani"]
    },
    {
      id: 25,
      name: "Shree Mahavir Restaurant",
      location: "Dumka",
      cuisine: "Vegetarian",
      rating: 4.0,
      price: "₹",
      specialty: "Pure vegetarian meals with Jain food options",
      image: "https://picsum.photos/400/300?random=25",
      timings: "7:00 AM - 10:00 PM",
      phone: "+91 9876543234",
      dishes: ["Thali", "South Indian", "Gujarati", "Jain Food"]
    },
    // EAST SINGHBHUM DISTRICT
    {
      id: 26,
      name: "The Yellow Chilli",
      location: "Jamshedpur",
      cuisine: "North Indian",
      rating: 4.7,
      price: "₹₹₹₹",
      specialty: "Celebrity chef restaurant with modern Indian cuisine",
      image: "https://picsum.photos/400/300?random=26",
      timings: "12:00 PM - 11:30 PM",
      phone: "+91 9876543235",
      dishes: ["Signature Curries", "Modern Indian", "Fusion", "Desserts"]
    },
    {
      id: 27,
      name: "Barbeque Nation",
      location: "Jamshedpur",
      cuisine: "Multi-Cuisine",
      rating: 4.5,
      price: "₹₹₹",
      specialty: "Live grills and unlimited buffet experience",
      image: "https://picsum.photos/400/300?random=27",
      timings: "12:00 PM - 3:00 PM, 7:00 PM - 11:00 PM",
      phone: "+91 9876543236",
      dishes: ["BBQ", "Grills", "Buffet", "Desserts"]
    },
    {
      id: 28,
      name: "Pizza Hut",
      location: "Jamshedpur",
      cuisine: "Fast Food",
      rating: 4.2,
      price: "₹₹",
      specialty: "International pizza chain with variety of toppings",
      image: "https://picsum.photos/400/300?random=28",
      timings: "11:00 AM - 11:00 PM",
      phone: "+91 9876543237",
      dishes: ["Pizza", "Pasta", "Garlic Bread", "Beverages"]
    },
    {
      id: 29,
      name: "Mainland China",
      location: "Jamshedpur",
      cuisine: "Chinese",
      rating: 4.4,
      price: "₹₹₹",
      specialty: "Premium Chinese cuisine with authentic flavors",
      image: "https://picsum.photos/400/300?random=29",
      timings: "12:00 PM - 11:00 PM",
      phone: "+91 9876543238",
      dishes: ["Dim Sum", "Noodles", "Hot Pot", "Chinese Desserts"]
    },
    {
      id: 30,
      name: "KFC",
      location: "Jamshedpur",
      cuisine: "Fast Food",
      rating: 4.1,
      price: "₹₹",
      specialty: "Crispy fried chicken and fast food favorites",
      image: "https://picsum.photos/400/300?random=30",
      timings: "11:00 AM - 11:00 PM",
      phone: "+91 9876543239",
      dishes: ["Fried Chicken", "Burgers", "Wraps", "Sides"]
    },
    // GARHWA DISTRICT
    {
      id: 31,
      name: "Arya Restaurant",
      location: "Garhwa",
      cuisine: "North Indian",
      rating: 4.0,
      price: "₹₹",
      specialty: "Family restaurant with home-style cooking",
      image: "https://picsum.photos/400/300?random=31",
      timings: "8:00 AM - 10:00 PM",
      phone: "+91 9876543240",
      dishes: ["Dal", "Sabzi", "Roti", "Rice"]
    },
    {
      id: 32,
      name: "Ganga Restaurant",
      location: "Garhwa",
      cuisine: "Multi-Cuisine",
      rating: 3.9,
      price: "₹₹",
      specialty: "Local and North Indian dishes with river views",
      image: "https://picsum.photos/400/300?random=32",
      timings: "7:00 AM - 9:00 PM",
      phone: "+91 9876543241",
      dishes: ["Local Fish", "Vegetarian", "Chinese", "Snacks"]
    },
    // GIRIDIH DISTRICT
    {
      id: 33,
      name: "Hotel Raj Palace Restaurant",
      location: "Giridih",
      cuisine: "Multi-Cuisine",
      rating: 4.1,
      price: "₹₹",
      specialty: "Hotel restaurant with diverse menu options",
      image: "https://picsum.photos/400/300?random=33",
      timings: "6:00 AM - 11:00 PM",
      phone: "+91 9876543242",
      dishes: ["Continental", "Indian", "Chinese", "Breakfast"]
    },
    {
      id: 34,
      name: "Pushpa Restaurant",
      location: "Giridih",
      cuisine: "North Indian",
      rating: 4.0,
      price: "₹",
      specialty: "Budget-friendly family restaurant with homely food",
      image: "https://picsum.photos/400/300?random=34",
      timings: "7:00 AM - 10:00 PM",
      phone: "+91 9876543243",
      dishes: ["Thali", "Dal-Chawal", "Sabzi", "Lassi"]
    },
    {
      id: 35,
      name: "Ananda Restaurant",
      location: "Giridih",
      cuisine: "Vegetarian",
      rating: 4.2,
      price: "₹",
      specialty: "Pure vegetarian with temple-style food",
      image: "https://picsum.photos/400/300?random=35",
      timings: "6:00 AM - 9:00 PM",
      phone: "+91 9876543244",
      dishes: ["South Indian", "Gujarati Thali", "Sweets", "Snacks"]
    },
    // GODDA DISTRICT
    {
      id: 36,
      name: "Hotel Godda Restaurant",
      location: "Godda",
      cuisine: "Multi-Cuisine",
      rating: 3.8,
      price: "₹₹",
      specialty: "Local hotel restaurant with regional specialties",
      image: "https://picsum.photos/400/300?random=36",
      timings: "6:00 AM - 10:00 PM",
      phone: "+91 9876543245",
      dishes: ["Local Fish", "Chicken Curry", "Vegetarian", "Rice"]
    },
    {
      id: 37,
      name: "Maa Durga Restaurant",
      location: "Godda",
      cuisine: "North Indian",
      rating: 4.0,
      price: "₹",
      specialty: "Traditional cooking with devotional ambiance",
      image: "https://picsum.photos/400/300?random=37",
      timings: "5:00 AM - 10:00 PM",
      phone: "+91 9876543246",
      dishes: ["Prasadam", "Thali", "Sweets", "Chai"]
    },
    // GUMLA DISTRICT
    {
      id: 38,
      name: "Hotel Sagar Restaurant",
      location: "Gumla",
      cuisine: "Multi-Cuisine",
      rating: 3.9,
      price: "₹₹",
      specialty: "Multi-cuisine with focus on local tribal dishes",
      image: "https://picsum.photos/400/300?random=38",
      timings: "7:00 AM - 10:00 PM",
      phone: "+91 9876543247",
      dishes: ["Tribal Cuisine", "Chinese", "North Indian", "Breakfast"]
    },
    {
      id: 39,
      name: "Tribal Delight",
      location: "Gumla",
      cuisine: "Tribal Cuisine",
      rating: 4.3,
      price: "₹₹",
      specialty: "Authentic tribal food with traditional cooking methods",
      image: "https://picsum.photos/400/300?random=39",
      timings: "8:00 AM - 9:00 PM",
      phone: "+91 9876543248",
      dishes: ["Handia", "Bamboo Chicken", "Forest Vegetables", "Tribal Rice"]
    },
    // HAZARIBAGH DISTRICT
    {
      id: 40,
      name: "Hotel Yuvraj Palace",
      location: "Hazaribagh",
      cuisine: "Multi-Cuisine",
      rating: 4.2,
      price: "₹₹₹",
      specialty: "Luxury hotel dining with palace-like ambiance",
      image: "https://picsum.photos/400/300?random=40",
      timings: "7:00 AM - 11:00 PM",
      phone: "+91 9876543249",
      dishes: ["Royal Thali", "Continental", "Chinese", "Indian"]
    },
    {
      id: 41,
      name: "Pind Balluchi",
      location: "Hazaribagh",
      cuisine: "North Indian",
      rating: 4.4,
      price: "₹₹₹",
      specialty: "Punjabi dhaba-style restaurant with live music",
      image: "https://picsum.photos/400/300?random=41",
      timings: "11:00 AM - 11:00 PM",
      phone: "+91 9876543250",
      dishes: ["Butter Chicken", "Dal Makhani", "Naan", "Lassi"]
    },
    {
      id: 42,
      name: "Forest View Restaurant",
      location: "Hazaribagh",
      cuisine: "Multi-Cuisine",
      rating: 4.1,
      price: "₹₹",
      specialty: "Scenic restaurant with forest views and local cuisine",
      image: "https://picsum.photos/400/300?random=42",
      timings: "8:00 AM - 10:00 PM",
      phone: "+91 9876543251",
      dishes: ["Local Fish", "Forest Vegetables", "Continental", "Snacks"]
    },
    // JAMTARA DISTRICT
    {
      id: 43,
      name: "New Jamtara Restaurant",
      location: "Jamtara",
      cuisine: "North Indian",
      rating: 3.8,
      price: "₹",
      specialty: "Simple family restaurant with affordable pricing",
      image: "https://picsum.photos/400/300?random=43",
      timings: "6:00 AM - 10:00 PM",
      phone: "+91 9876543252",
      dishes: ["Dal-Chawal", "Roti-Sabzi", "Chicken Curry", "Tea"]
    },
    {
      id: 44,
      name: "Shanti Restaurant",
      location: "Jamtara",
      cuisine: "Vegetarian",
      rating: 4.0,
      price: "₹",
      specialty: "Peaceful vegetarian dining with homely atmosphere",
      image: "https://picsum.photos/400/300?random=44",
      timings: "7:00 AM - 9:00 PM",
      phone: "+91 9876543253",
      dishes: ["Pure Vegetarian", "South Indian", "Sweets", "Juice"]
    },
    // KHUNTI DISTRICT
    {
      id: 45,
      name: "Birsa Restaurant",
      location: "Khunti",
      cuisine: "Tribal Cuisine",
      rating: 4.2,
      price: "₹₹",
      specialty: "Named after Birsa Munda, serves authentic tribal food",
      image: "https://picsum.photos/400/300?random=45",
      timings: "8:00 AM - 9:00 PM",
      phone: "+91 9876543254",
      dishes: ["Tribal Delicacies", "Forest Honey", "Organic Vegetables", "Local Fish"]
    },
    {
      id: 46,
      name: "Munda Heritage Restaurant",
      location: "Khunti",
      cuisine: "Traditional",
      rating: 4.3,
      price: "₹₹",
      specialty: "Cultural dining experience with Munda tribal heritage",
      image: "https://picsum.photos/400/300?random=46",
      timings: "9:00 AM - 10:00 PM",
      phone: "+91 9876543255",
      dishes: ["Traditional Rice", "Wild Vegetables", "Herbal Tea", "Tribal Sweets"]
    },
    // KODERMA DISTRICT
    {
      id: 47,
      name: "Highway Restaurant",
      location: "Koderma",
      cuisine: "Multi-Cuisine",
      rating: 3.9,
      price: "₹₹",
      specialty: "Convenient highway stop with diverse menu options",
      image: "https://picsum.photos/400/300?random=47",
      timings: "24 Hours",
      phone: "+91 9876543256",
      dishes: ["North Indian", "Chinese", "South Indian", "Snacks"]
    },
    {
      id: 48,
      name: "Mica Restaurant",
      location: "Koderma",
      cuisine: "North Indian",
      rating: 4.0,
      price: "₹₹",
      specialty: "Local restaurant named after the region's famous mica mines",
      image: "https://picsum.photos/400/300?random=48",
      timings: "7:00 AM - 11:00 PM",
      phone: "+91 9876543257",
      dishes: ["Biryani", "Curry", "Tandoori", "Breads"]
    },
    // LATEHAR DISTRICT
    {
      id: 49,
      name: "Netarhat Restaurant",
      location: "Latehar",
      cuisine: "Multi-Cuisine",
      rating: 4.1,
      price: "₹₹",
      specialty: "Mountain restaurant with panoramic hill station views",
      image: "https://picsum.photos/400/300?random=49",
      timings: "7:00 AM - 10:00 PM",
      phone: "+91 9876543258",
      dishes: ["Hill Station Specials", "Continental", "Indian", "Hot Beverages"]
    },
    {
      id: 50,
      name: "Sunrise Cafe",
      location: "Latehar",
      cuisine: "Continental",
      rating: 4.2,
      price: "₹₹",
      specialty: "Perfect for watching sunrise with continental breakfast",
      image: "https://picsum.photos/400/300?random=50",
      timings: "5:30 AM - 10:00 PM",
      phone: "+91 9876543259",
      dishes: ["Continental Breakfast", "Coffee", "Sandwiches", "Pastries"]
    },
    // LOHARDAGA DISTRICT
    {
      id: 51,
      name: "Forest Lodge Restaurant",
      location: "Lohardaga",
      cuisine: "Multi-Cuisine",
      rating: 4.0,
      price: "₹₹",
      specialty: "Forest lodge dining with eco-friendly practices",
      image: "https://picsum.photos/400/300?random=51",
      timings: "6:00 AM - 10:00 PM",
      phone: "+91 9876543260",
      dishes: ["Organic Food", "Local Cuisine", "Forest Fruits", "Herbal Drinks"]
    },
    {
      id: 52,
      name: "Tribal Kitchen",
      location: "Lohardaga",
      cuisine: "Tribal Cuisine",
      rating: 4.3,
      price: "₹₹",
      specialty: "Authentic tribal cooking with traditional recipes",
      image: "https://picsum.photos/400/300?random=52",
      timings: "8:00 AM - 9:00 PM",
      phone: "+91 9876543261",
      dishes: ["Tribal Rice Dishes", "Wild Game", "Forest Vegetables", "Traditional Drinks"]
    },
    // SAHEBGANJ DISTRICT
    {
      id: 53,
      name: "Ganga View Restaurant",
      location: "Sahebganj",
      cuisine: "Multi-Cuisine",
      rating: 4.1,
      price: "₹₹",
      specialty: "Riverside dining with views of the Ganges",
      image: "https://picsum.photos/400/300?random=53",
      timings: "6:00 AM - 11:00 PM",
      phone: "+91 9876543262",
      dishes: ["River Fish", "Bengali Cuisine", "North Indian", "Sweets"]
    },
    {
      id: 54,
      name: "Rajmahal Restaurant",
      location: "Sahebganj",
      cuisine: "North Indian",
      rating: 4.0,
      price: "₹₹",
      specialty: "Royal dining experience with Mughlai cuisine",
      image: "https://picsum.photos/400/300?random=54",
      timings: "11:00 AM - 10:00 PM",
      phone: "+91 9876543263",
      dishes: ["Mughlai", "Biryani", "Kebabs", "Breads"]
    },
    {
      id: 55,
      name: "River Side Dhaba",
      location: "Sahebganj",
      cuisine: "North Indian",
      rating: 3.9,
      price: "₹",
      specialty: "Authentic dhaba experience by the river",
      image: "https://picsum.photos/400/300?random=55",
      timings: "5:00 AM - 11:00 PM",
      phone: "+91 9876543264",
      dishes: ["Dal Tadka", "Aloo Gobi", "Roti", "Chai"]
    },
    // SERAIKELA-KHARSAWAN DISTRICT
    {
      id: 56,
      name: "Royal Heritage Restaurant",
      location: "Seraikela",
      cuisine: "Multi-Cuisine",
      rating: 4.2,
      price: "₹₹₹",
      specialty: "Royal palace-themed restaurant with heritage ambiance",
      image: "https://picsum.photos/400/300?random=56",
      timings: "11:00 AM - 11:00 PM",
      phone: "+91 9876543265",
      dishes: ["Royal Thali", "Continental", "Indian", "Traditional Sweets"]
    },
    {
      id: 57,
      name: "Chhau Dance Restaurant",
      location: "Seraikela",
      cuisine: "Traditional",
      rating: 4.4,
      price: "₹₹₹",
      specialty: "Cultural dining with live Chhau dance performances",
      image: "https://picsum.photos/400/300?random=57",
      timings: "7:00 PM - 11:00 PM",
      phone: "+91 9876543266",
      dishes: ["Traditional Thali", "Local Delicacies", "Cultural Experience", "Folk Music"]
    },
    {
      id: 58,
      name: "Palace View Restaurant", 
      location: "Seraikela",
      cuisine: "North Indian",
      rating: 4.1,
      price: "₹₹",
      specialty: "Dining with views of the historic Seraikela Palace",
      image: "https://picsum.photos/400/300?random=58",
      timings: "8:00 AM - 10:00 PM",
      phone: "+91 9876543267",
      dishes: ["Mughlai", "Tandoori", "Biryani", "Lassi"]
    },
    // SIMDEGA DISTRICT
    {
      id: 59,
      name: "Hill View Restaurant",
      location: "Simdega",
      cuisine: "Multi-Cuisine",
      rating: 4.0,
      price: "₹₹",
      specialty: "Mountain restaurant with scenic hill views",
      image: "https://picsum.photos/400/300?random=59",
      timings: "7:00 AM - 10:00 PM",
      phone: "+91 9876543268",
      dishes: ["Hill Cuisine", "Continental", "Indian", "Local Vegetables"]
    },
    {
      id: 60,
      name: "Tribal Heritage Cafe",
      location: "Simdega",
      cuisine: "Tribal Cuisine",
      rating: 4.3,
      price: "₹₹",
      specialty: "Authentic tribal cafe celebrating local heritage",
      image: "https://picsum.photos/400/300?random=60",
      timings: "8:00 AM - 9:00 PM",
      phone: "+91 9876543269",
      dishes: ["Tribal Coffee", "Forest Honey", "Traditional Snacks", "Herbal Tea"]
    },
    // WEST SINGHBHUM DISTRICT
    {
      id: 61,
      name: "Chaibasa Palace Restaurant",
      location: "Chaibasa",
      cuisine: "Multi-Cuisine",
      rating: 4.1,
      price: "₹₹₹",
      specialty: "Palace-themed fine dining with royal atmosphere",
      image: "https://picsum.photos/400/300?random=61",
      timings: "12:00 PM - 11:00 PM",
      phone: "+91 9876543270",
      dishes: ["Royal Cuisine", "Continental", "Chinese", "Indian"]
    },
    {
      id: 62,
      name: "Forest Retreat Restaurant",
      location: "Chaibasa",
      cuisine: "Eco-Friendly",
      rating: 4.2,
      price: "₹₹",
      specialty: "Eco-conscious dining with organic forest produce",
      image: "https://picsum.photos/400/300?random=62",
      timings: "7:00 AM - 9:00 PM",
      phone: "+91 9876543271",
      dishes: ["Organic Food", "Forest Vegetables", "Natural Juices", "Herbal Teas"]
    },
    {
      id: 63,
      name: "Munda Cultural Restaurant",
      location: "Chaibasa",
      cuisine: "Traditional",
      rating: 4.4,
      price: "₹₹",
      specialty: "Cultural restaurant showcasing Munda tribal traditions",
      image: "https://picsum.photos/400/300?random=63",
      timings: "9:00 AM - 10:00 PM",
      phone: "+91 9876543272",
      dishes: ["Traditional Tribal Food", "Cultural Programs", "Folk Music", "Heritage Experience"]
    }
  ];

  // Filter restaurants based on district, cuisine, rating, price, and search term
  const filteredRestaurants = allRestaurants.filter(restaurant => {
    const matchesDistrict = selectedDistrict === "all" || 
      (selectedDistrict === "west-singhbhum" ? 
        (restaurant.location.toLowerCase().includes("west singhbhum") || restaurant.location.toLowerCase().includes("chaibasa")) :
        selectedDistrict === "seraikela-kharsawan" ?
        restaurant.location.toLowerCase().includes("seraikela") :
        restaurant.location.toLowerCase().includes(selectedDistrict)
      );
    
    const matchesCuisine = selectedCuisine === "all" || 
      restaurant.cuisine.toLowerCase().replace(/[^a-z]/g, '').includes(selectedCuisine.replace('-', '').toLowerCase());
    
    const matchesRating = selectedRating === "all" || 
      restaurant.rating >= parseFloat(selectedRating);
      
    const matchesPrice = selectedPrice === "all" || 
      restaurant.price === selectedPrice;
    
    const matchesSearch = searchTerm === "" || 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.specialty.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDistrict && matchesCuisine && matchesRating && matchesPrice && matchesSearch;
  });

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
        {/* Decorative food emojis */}
        <div className="absolute top-10 left-10 text-4xl animate-bounce">🍽️</div>
        <div className="absolute top-20 right-16 text-3xl animate-pulse">🥘</div>
        <div className="absolute bottom-16 left-20 text-3xl animate-bounce delay-500">🌶️</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-pulse delay-700">🍛</div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-6 shadow-lg border border-orange-200">
              <UtensilsCrossed className="w-5 h-5 text-orange-600" />
              <span className="text-orange-700 font-semibold">Taste the Tradition</span>
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Authentic Restaurants 🍴
            </h1>
            <p className="text-xl mb-8 max-w-4xl mx-auto text-gray-700 font-medium">
              Savor the authentic flavors of Jharkhand with traditional tribal cuisines! 🌶️ 
              Discover organic ingredients and recipes passed down through generations! ✨
            </p>
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
                placeholder="Search restaurants by name, location, or cuisine..."
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

            {/* Cuisine Filter Dropdown */}
            <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
              <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="All Cuisines" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Cuisines</SelectItem>
                {cuisineTypes.filter(c => c.id !== "all").map((cuisine) => (
                  <SelectItem key={cuisine.id} value={cuisine.id}>
                    {cuisine.name} ({cuisine.count})
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
            Showing {filteredRestaurants.length} restaurants
            {selectedDistrict !== "all" && ` in ${districts.find(d => d.id === selectedDistrict)?.name}`}
            {selectedCuisine !== "all" && ` • ${cuisineTypes.find(c => c.id === selectedCuisine)?.name}`}
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
              variant={selectedCuisine === "all" ? "default" : "outline"}
              onClick={() => setSelectedCuisine("all")}
              className="bg-green-600 hover:bg-green-700 text-white border-0 rounded-full px-6"
            >
              All Restaurants <Badge variant="secondary" className="ml-2">{allRestaurants.length}</Badge>
            </Button>
            <Button
              variant={selectedCuisine === "tribal" ? "default" : "outline"}
              onClick={() => setSelectedCuisine("tribal")}
              className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 rounded-full px-6"
            >
              Tribal Cuisine <Badge variant="secondary" className="ml-2">{cuisineTypes.find(c => c.id === "tribal")?.count || 0}</Badge>
            </Button>
            <Button
              variant={selectedCuisine === "traditional" ? "default" : "outline"}
              onClick={() => setSelectedCuisine("traditional")}
              className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 rounded-full px-6"
            >
              Traditional <Badge variant="secondary" className="ml-2">{cuisineTypes.find(c => c.id === "traditional")?.count || 0}</Badge>
            </Button>
            <Button
              variant={selectedCuisine === "north-indian" ? "default" : "outline"}
              onClick={() => setSelectedCuisine("north-indian")}
              className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 rounded-full px-6"
            >
              North Indian <Badge variant="secondary" className="ml-2">{cuisineTypes.find(c => c.id === "north-indian")?.count || 0}</Badge>
            </Button>
            <Button
              variant={selectedCuisine === "multi-cuisine" ? "default" : "outline"}
              onClick={() => setSelectedCuisine("multi-cuisine")}
              className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 rounded-full px-6"
            >
              Multi-Cuisine <Badge variant="secondary" className="ml-2">{cuisineTypes.find(c => c.id === "multi-cuisine")?.count || 0}</Badge>
            </Button>
            <Button
              variant={selectedCuisine === "fast-food" ? "default" : "outline"}
              onClick={() => setSelectedCuisine("fast-food")}
              className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 rounded-full px-6"
            >
              Fast Food <Badge variant="secondary" className="ml-2">{cuisineTypes.find(c => c.id === "fast-food")?.count || 0}</Badge>
            </Button>
          </div>
        </div>
      </section>

      {/* Restaurants Grid */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {filteredRestaurants.map((restaurant) => {
              const restaurantId = generateRestaurantId(restaurant.name);
              return (
                <Link key={restaurant.id} to={`/restaurants/${restaurantId}`} className="block">
                  <Card className="overflow-hidden bg-card border-border hover:shadow-xl transition-all duration-300 group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                        >
                          <Heart className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-white/90 text-black">
                          {restaurant.cuisine}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {restaurant.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{restaurant.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{restaurant.location}</span>
                        <span className="mx-2">•</span>
                        <span className="text-sm font-semibold text-primary">{restaurant.price}</span>
                      </div>

                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        {restaurant.specialty}
                      </p>

                      {/* Popular Dishes */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-2">Popular Dishes:</h4>
                        <div className="flex flex-wrap gap-1">
                          {restaurant.dishes.slice(0, 3).map((dish, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {dish}
                            </Badge>
                          ))}
                          {restaurant.dishes.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{restaurant.dishes.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{restaurant.timings}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{restaurant.phone}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Call Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {filteredRestaurants.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your district or cuisine filters</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedDistrict("all");
                  setSelectedCuisine("all");
                  setSearchTerm("");
                }}
              >
                View All Restaurants
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Jharkhand Cuisine?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the rich culinary heritage of Jharkhand's tribal communities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Traditional Recipes</h3>
              <p className="text-sm text-muted-foreground">
                Authentic dishes passed down through generations of tribal communities
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Organic Ingredients</h3>
              <p className="text-sm text-muted-foreground">
                Fresh, locally-sourced ingredients from forests and farms
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Cultural Experience</h3>
              <p className="text-sm text-muted-foreground">
                Every meal tells a story of Jharkhand's rich cultural heritage
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Restaurants;