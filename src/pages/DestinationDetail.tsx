import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BackToDestinations } from "@/components/NavigationButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Calendar, Clock, Phone, Camera, Navigation, Users, Car, Home, ExternalLink } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { allDestinations, type Destination } from "@/data/completeDestinations";
import { useEffect, useState } from "react";
import { generateGoogleMapsUrl, generateDirectionsUrl, formatLocationString, getDistrictCoordinates } from "@/utils/googleMaps";

const DestinationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const found = allDestinations.find(dest => dest.id === parseInt(id));
      setDestination(found || null);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-6">Destination Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Sorry, we couldn't find the destination you're looking for.
          </p>
          <Link to="/destinations">
            <Button size="lg">
              Browse All Destinations
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Image */}
      <section className="relative h-96 mt-16 overflow-hidden">
        <img
          src={`https://picsum.photos/1200/400?random=${destination.id}`}
          alt={destination.name}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = `https://source.unsplash.com/1200x400/?nature,travel,${destination.category}&sig=${destination.id}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {destination.district} District
              </Badge>
              <Badge variant="secondary" className={`${
                destination.type === 'hidden' ? 'bg-orange-500' : 'bg-primary'
              } text-white`}>
                {destination.type === 'hidden' ? 'Hidden Gem' : 'Famous'}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{destination.name}</h1>
            <div className="flex items-center gap-4 text-lg">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">{destination.rating}</span>
                <span className="text-white/80">({destination.reviews.length} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-5 h-5" />
                <a
                  href={generateGoogleMapsUrl(formatLocationString(destination.name, destination.district), destination.coordinates)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/80 transition-colors flex items-center gap-1"
                >
                  {destination.district} District, Jharkhand
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {destination.description}
                </p>
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Why This Place is Special</h4>
                  <p className="text-orange-700">{destination.whyFamous}</p>
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {destination.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Why Famous */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Why Visit This Place
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-orange-700 dark:text-orange-300 leading-relaxed">
                    {destination.whyFamous}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Visit Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Visit Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold mb-2">Best Time to Visit:</h5>
                    <p className="text-muted-foreground">{destination.bestTime}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Timings:</h5>
                    <p className="text-muted-foreground">{destination.timing}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Entry Fee:</h5>
                    <p className="text-muted-foreground">{destination.entryFee}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Visitor Reviews ({destination.reviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {destination.reviews.slice(0, 3).map((review, index) => (
                    <div key={index} className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold">{review.author}</h5>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  ))}
                  {destination.reviews.length > 3 && (
                    <p className="text-center text-muted-foreground">
                      +{destination.reviews.length - 3} more reviews
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Entry Fee</span>
                  <span className="font-semibold text-primary">{destination.entryFee}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Best Time</span>
                  <span className="font-semibold">{destination.bestTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="secondary">{destination.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">District</span>
                  <span className="font-semibold">{destination.district}</span>
                </div>
              </CardContent>
            </Card>

            {/* Location Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location & Directions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold">District:</span>
                    <p className="text-muted-foreground">{destination.district}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Category:</span>
                    <p className="text-muted-foreground">{destination.category}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Coordinates:</span>
                    <p className="text-muted-foreground">
                      {destination.coordinates.lat}, {destination.coordinates.lng}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-3 border-t">
                    <a
                      href={generateGoogleMapsUrl(formatLocationString(destination.name, destination.district), destination.coordinates)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
                    >
                      <MapPin className="w-4 h-4" />
                      View on Google Maps
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={generateDirectionsUrl(formatLocationString(destination.name, destination.district), destination.coordinates)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                    >
                      <Navigation className="w-4 h-4" />
                      Get Directions
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Explore More */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Explore More
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link to={`/districts/${destination.district.toLowerCase()}`} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="w-4 h-4 mr-2" />
                      More places in {destination.district}
                    </Button>
                  </Link>
                  <Link to="/community-chat" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Join Community Chat
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link to="/marketplace" className="block">
                <Button className="w-full" size="lg">
                  Book Tour Package
                </Button>
              </Link>
              <Link to="/transport" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Plan Transport
                </Button>
              </Link>
              <Link to="/chatbot" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Ask AI Assistant
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="mt-12">
          <BackToDestinations />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DestinationDetail;