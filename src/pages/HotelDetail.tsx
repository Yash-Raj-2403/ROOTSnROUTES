import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Heart, Phone, Clock, ArrowLeft, CheckCircle, XCircle, Camera, Shield, Award, ExternalLink, Navigation, IndianRupee, Users, Wifi, Car, Coffee, Utensils } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { generateGoogleMapsUrl, generateDirectionsUrl, formatLocationString, getDistrictCoordinates } from "@/utils/googleMaps";
import { authenticStays, findStayById, Stay } from "@/data/stayData";
import { useBookingProtection } from "@/hooks/useBookingProtection";
import { useToast } from "@/components/ui/use-toast";

const HotelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Stay | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { toast } = useToast();
  const { handleProtectedBooking } = useBookingProtection({
    customAuthMessage: {
      title: "Sign In to Book Your Stay",
      description: "Please sign in to book this accommodation. You'll be able to continue your booking after signing in."
    }
  });

  useEffect(() => {
    if (id) {
      const foundHotel = findStayById(id);
      setHotel(foundHotel || null);
    }
    setLoading(false);
  }, [id]);

  // Handle booking with authentication protection
  const handleBookNow = () => {
    handleProtectedBooking(() => {
      // Proceed with booking logic here
      toast({
        title: "Booking Initiated",
        description: `Starting booking process for ${hotel?.name}`,
        duration: 3000
      });
      // Add actual booking logic here
    });
  };

  const handleCheckAvailability = () => {
    handleProtectedBooking(() => {
      // Proceed with availability check
      toast({
        title: "Checking Availability",
        description: `Checking availability for ${hotel?.name}`,
        duration: 3000
      });
      // Add actual availability check logic here
    });
  };

  const handleSelectRoom = (roomType: any) => {
    handleProtectedBooking(() => {
      // Proceed with room selection
      toast({
        title: "Room Selected",
        description: `Selected ${roomType.name} for ${roomType.price}/night`,
        duration: 3000
      });
      // Add actual room selection logic here
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading accommodation details...</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-6">Accommodation Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Sorry, we couldn't find the accommodation you're looking for.
          </p>
          <Link to="/stays">
            <Button size="lg">
              Browse Accommodations
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = [hotel.image, hotel.image, hotel.image]; // Mock multiple images
  
  const pros = [
    "Authentic cultural experience",
    "Locally owned and operated",
    "Supports community development",
    "Unique traditional accommodation",
    "Immersive local activities",
    "Eco-friendly practices"
  ];

  const cons = [
    "Limited modern amenities",
    "May require cultural adaptation",
    "Remote location access",
    "Language barriers possible",
    "Limited dining options",
    "Basic room facilities"
  ];

  const reviews = [
    {
      author: "Sarah Johnson",
      rating: 5,
      comment: "Incredible authentic experience! The family was so welcoming and the cultural activities were fascinating.",
      date: "2 weeks ago",
      verified: true
    },
    {
      author: "Amit Patel",
      rating: 4,
      comment: "Great way to experience local culture. The food was amazing and the hosts were very knowledgeable.",
      date: "1 month ago",
      verified: true
    },
    {
      author: "Lisa Chen",
      rating: 5,
      comment: "Life-changing experience! Learned so much about tribal traditions and made wonderful memories.",
      date: "3 weeks ago",
      verified: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 pt-20 pb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/stays" className="hover:text-primary">Accommodations</Link>
          <span>/</span>
          <span>{hotel.type}</span>
          <span>/</span>
          <span className="text-foreground">{hotel.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={images[selectedImage]}
                alt={hotel.name}
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

          {/* Hotel Info Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{hotel.type}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{hotel.rating}</span>
                  <span className="text-muted-foreground">({reviews.length} reviews)</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{hotel.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <a
                    href={generateGoogleMapsUrl(formatLocationString(hotel.name, hotel.district))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {hotel.location}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  <span className="text-muted-foreground">{hotel.priceRange}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">About</h3>
              <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
            </div>

            {/* Check-in/Check-out */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-semibold">Check-in</p>
                      <p className="text-sm text-muted-foreground">{hotel.checkIn}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-semibold">Check-out</p>
                      <p className="text-sm text-muted-foreground">{hotel.checkOut}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center gap-3">
                  <Phone className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="font-semibold">Contact</p>
                    <a href={`tel:${hotel.phone}`} className="text-sm text-orange-600 hover:underline">
                      {hotel.phone}
                    </a>
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
                      <p className="text-sm text-muted-foreground">{hotel.district}, Jharkhand</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={generateGoogleMapsUrl(formatLocationString(hotel.name, hotel.district))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      View on Map
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={generateDirectionsUrl(formatLocationString(hotel.name, hotel.district))}
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
              <Button size="lg" className="w-full" onClick={handleBookNow}>
                <Phone className="w-5 h-5 mr-2" />
                Book Now
              </Button>
              <Button variant="outline" size="lg" className="w-full" onClick={handleCheckAvailability}>
                <Users className="w-5 h-5 mr-2" />
                Check Availability
              </Button>
            </div>
          </div>
        </div>

        {/* Room Types */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Room Types & Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotel.roomTypes.map((room, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{room.name}</h4>
                    <span className="font-bold text-primary">{room.price}/night</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{room.description}</p>
                  <Button 
                    variant="outline" 
                    className="w-full mt-3" 
                    size="sm"
                    onClick={() => handleSelectRoom(room)}
                  >
                    Select Room
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="w-5 h-5" />
              Amenities & Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {hotel.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{amenity}</span>
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
                What We Love
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
                Good to Know
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
              Guest Reviews ({reviews.length})
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
                          Verified Stay
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

        {/* Back Button */}
        <div className="mt-8">
          <Link to="/stays">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Accommodations
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HotelDetail;