import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NavigationButtons } from "@/components/NavigationButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Heart, Phone, Clock, ArrowLeft, CheckCircle, XCircle, Camera, Shield, Award, ExternalLink, Navigation, IndianRupee, Users } from "lucide-react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { findRestaurantById, type Restaurant } from "@/data/restaurantData";
import { generateGoogleMapsUrl, generateDirectionsUrl, formatLocationString, getDistrictCoordinates } from "@/utils/googleMaps";

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      const foundRestaurant = findRestaurantById(id);
      setRestaurant(foundRestaurant || null);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return <Navigate to="/404" replace />;
  }

  const images = [restaurant.image, restaurant.image, restaurant.image]; // Mock multiple images
  
  const pros = [
    "Authentic traditional cuisine",
    "Fresh locally sourced ingredients", 
    "Cultural dining experience",
    "Reasonable pricing",
    "Friendly local staff",
    "Supports local community"
  ];

  const cons = [
    "Limited English menu available",
    "Some dishes may be spicy for non-locals", 
    "Vegetarian options may be limited",
    "Parking might be challenging during peak hours"
  ];

  const reviews = [
    {
      author: "Anita Sharma",
      rating: 5,
      comment: "Amazing authentic flavors! The tribal thali was incredible and the staff explained each dish beautifully.",
      date: "1 week ago",
      verified: true
    },
    {
      author: "Rohan Kumar", 
      rating: 4,
      comment: "Great experience trying local cuisine. The atmosphere is very welcoming and the food quality is excellent.",
      date: "2 weeks ago",
      verified: true
    },
    {
      author: "Priyanka Gupta",
      rating: 5,
      comment: "Must visit for anyone wanting to experience real Jharkhand food culture. Highly recommended!",
      date: "1 month ago",
      verified: false
    }
  ];

  const menuItems = [
    { name: "Traditional Tribal Thali", price: "₹350", description: "Complete meal with rice, dal, vegetables, and meat curry" },
    { name: "Dhuska with Curry", price: "₹180", description: "Deep-fried bread made from rice and lentil batter served with spicy curry" },
    { name: "Bamboo Shoot Curry", price: "₹220", description: "Traditional curry made with fresh bamboo shoots and local spices" },
    { name: "Mutton Jhol", price: "₹420", description: "Traditional goat meat curry cooked in local style" },
    { name: "Handia", price: "₹80", description: "Traditional rice beer (non-alcoholic version available)" },
    { name: "Forest Honey Dessert", price: "₹150", description: "Local honey-based sweet dessert with seasonal fruits" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 pt-20 pb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/restaurants" className="hover:text-primary">Restaurants</Link>
          <span>/</span>
          <span>{restaurant.cuisine}</span>
          <span>/</span>
          <span className="text-foreground">{restaurant.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={images[selectedImage]}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Restaurant Info Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{restaurant.cuisine}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{restaurant.rating}</span>
                  <span className="text-muted-foreground">({reviews.length} reviews)</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <a
                    href={generateGoogleMapsUrl(formatLocationString(restaurant.name, restaurant.district))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {restaurant.location}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  <span className="text-muted-foreground">{restaurant.price}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">About</h3>
              <p className="text-muted-foreground leading-relaxed">{restaurant.specialty}</p>
            </div>

            {/* Contact & Hours */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-semibold">Contact</p>
                      <a href={`tel:${restaurant.phone}`} className="text-sm text-green-600 hover:underline">
                        {restaurant.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-semibold">Hours</p>
                      <p className="text-sm text-muted-foreground">{restaurant.timings}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Directions */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Location</h4>
                      <p className="text-sm text-muted-foreground">{restaurant.district}, Jharkhand</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={generateGoogleMapsUrl(formatLocationString(restaurant.name, restaurant.district))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      View on Map
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={generateDirectionsUrl(formatLocationString(restaurant.name, restaurant.district))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      <Navigation className="w-3 h-3" />
                      Directions
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full">
                <Phone className="w-5 h-5 mr-2" />
                Make Reservation
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                <Users className="w-5 h-5 mr-2" />
                Order Online
              </Button>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Specialties Menu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {menuItems.map((item, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{item.name}</h4>
                    <span className="font-bold text-primary">{item.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pros and Cons Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Why Choose This Restaurant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{pro}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <XCircle className="w-5 h-5" />
                Things to Consider
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{con}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Customer Reviews ({reviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold">{review.author}</h5>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified Visit
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Actions */}
        <div className="mt-8">
          <NavigationButtons 
            showBackButton
            customBackPath="/restaurants"
            showRelatedActions
            relatedActions={[
              { label: "Find Stays", path: "/stays", icon: Heart },
              { label: "Plan Trip", path: "/ai-trip-planner", icon: Camera },
              { label: "Explore Area", path: "/destinations", icon: MapPin },
              { label: "Local Guides", path: "/local-guides", icon: Users },
              { label: "Transport", path: "/transport", icon: Navigation },
              { label: "My Bookings", path: "/my-bookings", icon: CheckCircle },
            ]}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RestaurantDetail;