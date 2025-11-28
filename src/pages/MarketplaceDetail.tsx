import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NavigationButtons } from "@/components/NavigationButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Heart, ShoppingBag, User, Clock, Truck, ArrowLeft, CheckCircle, XCircle, Camera, Shield, Award, ExternalLink, Navigation } from "lucide-react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { findItemById, type MarketplaceItem } from "@/data/marketplaceData";
import { generateGoogleMapsUrl, generateDirectionsUrl, formatLocationString, getDistrictCoordinates } from "@/utils/googleMaps";

const MarketplaceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      const foundItem = findItemById(id);
      setItem(foundItem || null);
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

  if (!item) {
    return <Navigate to="/404" replace />;
  }

  const images = [item.image, item.image, item.image]; // Mock multiple images
  
  const pros = [
    "Authentic handcrafted by verified artisans",
    "Traditional techniques preserved for generations",
    "Supports local tribal communities",
    "Eco-friendly and sustainable materials",
    "Unique cultural significance",
    "High-quality craftsmanship"
  ];

  const cons = [
    "Delivery time may vary based on location",
    "Each piece is unique - slight variations expected",
    "Requires careful handling and maintenance",
    "Limited quantity available"
  ];

  const reviews = [
    {
      author: "Priya Sharma",
      rating: 5,
      comment: "Absolutely beautiful craftsmanship! The detail work is incredible and it arrived safely packaged.",
      date: "2 weeks ago",
      verified: true
    },
    {
      author: "Rajesh Kumar",
      rating: 4,
      comment: "Great quality and authentic. The artisan's story card that came with it was a nice touch.",
      date: "1 month ago",
      verified: true
    },
    {
      author: "Maya Gupta",
      rating: 5,
      comment: "Supporting local artisans while getting a beautiful piece for my home. Highly recommended!",
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
          <Link to="/marketplace" className="hover:text-primary">Marketplace</Link>
          <span>/</span>
          <span>{item.category}</span>
          <span>/</span>
          <span className="text-foreground">{item.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={images[selectedImage]}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-card/80 hover:bg-card border border-border"
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

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{item.category}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{item.rating}</span>
                  <span className="text-muted-foreground">({reviews.length} reviews)</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-muted-foreground">by {item.artist}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <a
                    href={generateGoogleMapsUrl(formatLocationString(item.name, item.location!))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {item.location}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              
              <div className="text-3xl font-bold text-primary mb-6">
                {item.price}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>

            {/* Artisan Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.artisan}</h4>
                    <p className="text-sm text-muted-foreground">Specializing in {item.category}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Shield className="w-3 h-3 text-accent" />
                      <span className="text-xs text-accent">Verified Artisan</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Crafted in {item.location}</h4>
                      <p className="text-sm text-muted-foreground">{item.location}, Jharkhand, India</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={generateGoogleMapsUrl(formatLocationString(item.name, item.location!))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      View on Map
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={generateDirectionsUrl(formatLocationString(item.name, item.location!))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 font-medium"
                    >
                      <Navigation className="w-3 h-3" />
                      Directions
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="w-4 h-4" />
              <span>Delivery in {item.delivery}</span>
              <Clock className="w-4 h-4 ml-4" />
              <span>Free shipping on orders above ₹2000</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* Pros and Cons Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <CheckCircle className="w-5 h-5" />
                Pros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
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
                Considerations
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
                          Verified Purchase
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
            customBackPath="/marketplace"
            showRelatedActions
            relatedActions={[
              { label: "More Products", path: "/marketplace", icon: ShoppingBag },
              { label: "Local Crafts", path: "/handicrafts", icon: Award },
              { label: "Find Stays", path: "/stays", icon: Heart },
              { label: "Local Food", path: "/restaurants", icon: MapPin },
              { label: "Plan Trip", path: "/ai-trip-planner", icon: Camera },
              { label: "My Favorites", path: "/favorites", icon: Heart },
            ]}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MarketplaceDetail;