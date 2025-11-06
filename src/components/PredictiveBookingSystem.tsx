import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { 
  TrendingUp, Star, Users, Calendar, MapPin, Clock, Heart, 
  Zap, Target, Brain, Sparkles, ThumbsUp, Award, DollarSign,
  ChevronRight, BookOpen, Camera, Mountain, Home
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from './ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  interests: string[];
  budget: string;
  travelStyle: string;
  previousBookings: string[];
  preferences: {
    accommodation: string;
    activities: string[];
    groupSize: string;
  };
}

interface PredictiveRecommendation {
  id: string;
  type: 'accommodation' | 'activity' | 'package' | 'restaurant';
  name: string;
  location: string;
  description: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  confidence: number;
  reasons: string[];
  similarUsers: number;
  bookingTrend: 'rising' | 'stable' | 'declining';
  availability: 'high' | 'medium' | 'low';
  discountAvailable: boolean;
  tags: string[];
  bestTime: string;
  category: string;
}

interface BookingAnalytics {
  totalPredictions: number;
  accuracyRate: number;
  personalizedScore: number;
  trendingDestinations: string[];
  seasonalInsights: string[];
  priceOptimization: string[];
}

const PredictiveBookingSystem = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    interests: ['Nature', 'Culture', 'Photography'],
    budget: 'mid-range',
    travelStyle: 'explorer',
    previousBookings: ['Hundru Falls', 'Tribal Homestay Dumka', 'Betla Safari'],
    preferences: {
      accommodation: 'eco-lodge',
      activities: ['Trekking', 'Wildlife', 'Cultural Tours'],
      groupSize: 'couple'
    }
  });

  const [recommendations, setRecommendations] = useState<PredictiveRecommendation[]>([]);
  const [analytics, setAnalytics] = useState<BookingAnalytics | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [bookingHistory, setBookingHistory] = useState<string[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<PredictiveRecommendation | null>(null);

  // Mock ML prediction algorithm
  const generatePredictiveRecommendations = async (): Promise<PredictiveRecommendation[]> => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockRecommendations: PredictiveRecommendation[] = [
      {
        id: '1',
        type: 'accommodation',
        name: 'Santal Heritage Eco-Lodge',
        location: 'Dumka District',
        description: 'Authentic tribal homestay experience with organic farming and cultural immersion programs.',
        price: '₹2,500/night',
        rating: 4.8,
        reviews: 247,
        image: '/api/placeholder/300/200',
        confidence: 94,
        reasons: [
          'Matches your previous tribal homestay booking',
          'Highly rated by users with similar interests',
          '85% of photographers love this location',
          'Perfect for couples seeking authentic experiences'
        ],
        similarUsers: 342,
        bookingTrend: 'rising',
        availability: 'medium',
        discountAvailable: true,
        tags: ['Eco-Friendly', 'Cultural', 'Photography', 'Organic Food'],
        bestTime: 'October - March',
        category: 'Trending'
      },
      {
        id: '2',
        type: 'activity',
        name: 'Parasnath Sunrise Trek & Photography Tour',
        location: 'Giridih District',
        description: 'Guided sunrise trek to Jharkhand\'s highest peak with professional photography workshop.',
        price: '₹1,800/person',
        rating: 4.9,
        reviews: 189,
        image: '/api/placeholder/300/200',
        confidence: 91,
        reasons: [
          'Combines trekking and photography interests',
          'Perfect for your mid-range budget',
          'Rated #1 activity by adventure couples',
          'Best season for clear mountain views'
        ],
        similarUsers: 298,
        bookingTrend: 'rising',
        availability: 'high',
        discountAvailable: false,
        tags: ['Adventure', 'Photography', 'Sunrise', 'Mountain'],
        bestTime: 'November - February',
        category: 'Perfect Match'
      },
      {
        id: '3',
        type: 'package',
        name: '3-Day Tribal Culture & Wildlife Package',
        location: 'Ranchi - Betla - Dumka Circuit',
        description: 'Complete cultural and wildlife experience with tribal village stays and national park safari.',
        price: '₹12,500/person',
        rating: 4.7,
        reviews: 156,
        image: '/api/placeholder/300/200',
        confidence: 88,
        reasons: [
          'Combines all your interests: culture, nature, wildlife',
          'Includes accommodation type you prefer',
          '78% success rate with similar travelers',
          'Seasonal wildlife viewing at its peak'
        ],
        similarUsers: 167,
        bookingTrend: 'stable',
        availability: 'low',
        discountAvailable: true,
        tags: ['Complete Package', 'Wildlife', 'Culture', 'Eco-Lodge'],
        bestTime: 'December - March',
        category: 'Recommended'
      },
      {
        id: '4',
        type: 'restaurant',
        name: 'Forest Tribal Kitchen Experience',
        location: 'Near Betla National Park',
        description: 'Authentic tribal cooking class and dining experience in forest setting with local families.',
        price: '₹850/person',
        rating: 4.6,
        reviews: 234,
        image: '/api/placeholder/300/200',
        confidence: 85,
        reasons: [
          'Cultural food experience aligns with interests',
          'Highly rated by photography enthusiasts',
          'Perfect add-on to your eco-lodge stays',
          'Supports local tribal communities'
        ],
        similarUsers: 189,
        bookingTrend: 'rising',
        availability: 'high',
        discountAvailable: false,
        tags: ['Authentic Cuisine', 'Cultural', 'Community-Based', 'Cooking Class'],
        bestTime: 'Year-round',
        category: 'Popular Choice'
      },
      {
        id: '5',
        type: 'accommodation',
        name: 'Netarhat Sunrise View Resort',
        location: 'Latehar District',
        description: 'Premium hill station resort with panoramic valley views and wellness spa facilities.',
        price: '₹4,200/night',
        rating: 4.5,
        reviews: 312,
        image: '/api/placeholder/300/200',
        confidence: 82,
        reasons: [
          'Slight upgrade from your usual budget',
          'Perfect for romantic couple getaways',
          'Exceptional sunrise photography opportunities',
          'Spa facilities for relaxation after treks'
        ],
        similarUsers: 145,
        bookingTrend: 'stable',
        availability: 'medium',
        discountAvailable: true,
        tags: ['Hill Station', 'Luxury', 'Photography', 'Spa'],
        bestTime: 'October - April',
        category: 'Upgrade Suggestion'
      },
      {
        id: '6',
        type: 'activity',
        name: 'Dokra Metal Craft Workshop & Village Tour',
        location: 'Dhokra Village, West Singhbhum',
        description: 'Learn ancient metal casting techniques from master craftsmen in authentic tribal setting.',
        price: '₹1,200/person',
        rating: 4.8,
        reviews: 98,
        image: '/api/placeholder/300/200',
        confidence: 90,
        reasons: [
          'Perfect cultural immersion experience',
          'Unique photography opportunities',
          'Aligns with your tribal culture interests',
          'Take home handmade souvenirs'
        ],
        similarUsers: 76,
        bookingTrend: 'rising',
        availability: 'high',
        discountAvailable: false,
        tags: ['Handicrafts', 'Cultural', 'Workshop', 'Authentic'],
        bestTime: 'October - March',
        category: 'Hidden Gem'
      }
    ];

    setIsGenerating(false);
    return mockRecommendations;
  };

  // Generate analytics based on user behavior
  const generateAnalytics = (): BookingAnalytics => {
    return {
      totalPredictions: 847,
      accuracyRate: 87.3,
      personalizedScore: 94,
      trendingDestinations: ['Netarhat', 'Parasnath', 'Hundru Falls', 'Betla National Park'],
      seasonalInsights: [
        'Peak season (Dec-Feb) bookings up 156%',
        'Cultural experiences trending 78% higher',
        'Eco-lodges showing 92% occupancy rate',
        'Photography tours booked 3 weeks in advance'
      ],
      priceOptimization: [
        'Book tribal homestays 2 weeks ahead for 15% savings',
        'Mid-week bookings offer 20-30% discounts',
        'Package deals save average ₹2,400 per trip',
        'Early bird offers available for next season'
      ]
    };
  };

  useEffect(() => {
    const loadRecommendations = async () => {
      const recs = await generatePredictiveRecommendations();
      setRecommendations(recs);
      setAnalytics(generateAnalytics());
    };

    loadRecommendations();
  }, [userProfile]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 80) return 'text-blue-600 bg-blue-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'stable': return <Target className="h-4 w-4 text-blue-500" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Handle booking
  const handleBooking = (recommendation: PredictiveRecommendation) => {
    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to make a booking",
        variant: "destructive",
        duration: 4000
      });
      navigate('/login', { state: { from: '/predictive-booking' } });
      return;
    }
    
    setSelectedBooking(recommendation);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (selectedBooking && user) {
      // Get booking details from modal
      const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
      const guestsSelect = document.querySelector('select') as HTMLSelectElement;
      
      const newBooking = {
        id: `BK${Date.now()}`,
        type: selectedBooking.type,
        name: selectedBooking.name,
        location: selectedBooking.location,
        date: dateInput?.value || new Date().toISOString().split('T')[0],
        guests: parseInt(guestsSelect?.value || '2'),
        price: selectedBooking.price,
        status: 'confirmed' as const,
        bookingDate: new Date().toISOString(),
        confirmationCode: `RR${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        image: selectedBooking.image,
        contactPhone: '+91-1234567890',
        contactEmail: 'support@rootsnroutes.com'
      };

      // Save to localStorage
      const existingBookings = JSON.parse(localStorage.getItem(`bookings_${user.id}`) || '[]');
      existingBookings.push(newBooking);
      localStorage.setItem(`bookings_${user.id}`, JSON.stringify(existingBookings));

      // Add to booking history
      setBookingHistory([...bookingHistory, selectedBooking.name]);
      
      toast({
        title: "Booking Confirmed! 🎉",
        description: `${selectedBooking.name} has been booked successfully. Confirmation code: ${newBooking.confirmationCode}`,
        duration: 5000
      });

      // Close modal
      setShowBookingModal(false);
      
      // Redirect to My Bookings
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    }
  };

  const categories = [
    { value: 'all', label: 'All Recommendations' },
    { value: 'accommodation', label: 'Accommodations' },
    { value: 'activity', label: 'Activities' },
    { value: 'package', label: 'Packages' },
    { value: 'restaurant', label: 'Restaurants' }
  ];

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.type === selectedCategory);

  if (isGenerating) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Analyzing your preferences and generating personalized recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          Predictive Booking System
        </h1>
        <p className="text-muted-foreground text-lg">
          AI-powered recommendations tailored to your travel preferences and behavior
        </p>
      </div>

      {/* Analytics Dashboard */}
      {analytics && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Personalized Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{analytics.personalizedScore}%</div>
                <p className="text-sm text-muted-foreground">Personalization Score</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{analytics.accuracyRate}%</div>
                <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{analytics.totalPredictions}</div>
                <p className="text-sm text-muted-foreground">Total Predictions</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{recommendations.length}</div>
                <p className="text-sm text-muted-foreground">Active Recommendations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Insights */}
      {analytics && (
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Trending Destinations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.trendingDestinations.map((dest, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm">{dest}</span>
                    <Badge variant="secondary" className="text-xs">Hot</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Seasonal Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.seasonalInsights.map((insight, idx) => (
                  <p key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    {insight}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Price Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.priceOptimization.map((tip, idx) => (
                  <p key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-green-500">💡</span>
                    {tip}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <span className="font-medium">Filter by Category:</span>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">
          AI-Powered Recommendations ({filteredRecommendations.length})
        </h2>

        <div className="grid gap-6">
          {filteredRecommendations.map((rec) => (
            <Card key={rec.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="grid md:grid-cols-3 gap-0">
                {/* Image */}
                <div className="relative">
                  <div className="aspect-video md:aspect-square bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                    <div className="text-6xl opacity-50">
                      {rec.type === 'accommodation' && '🏠'}
                      {rec.type === 'activity' && '🎯'}
                      {rec.type === 'package' && '📦'}
                      {rec.type === 'restaurant' && '🍽️'}
                    </div>
                  </div>
                  
                  {/* Overlays */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`${getConfidenceColor(rec.confidence)} font-semibold`}>
                      {rec.confidence}% Match
                    </Badge>
                  </div>
                  
                  <div className="absolute top-3 right-3 flex gap-2">
                    {rec.discountAvailable && (
                      <Badge className="bg-red-500 text-white">
                        Discount!
                      </Badge>
                    )}
                    <Badge variant="secondary" className="capitalize">
                      {rec.category}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(rec.bookingTrend)}
                        <span className="text-sm font-medium capitalize">{rec.bookingTrend}</span>
                      </div>
                      <span className={`text-sm font-medium ${getAvailabilityColor(rec.availability)}`}>
                        {rec.availability} availability
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{rec.name}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {rec.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Best: {rec.bestTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{rec.rating}</span>
                            <span className="text-sm text-muted-foreground">({rec.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{rec.similarUsers} similar users</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{rec.price}</div>
                        <Badge variant="outline" className="mt-1 capitalize">
                          {rec.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{rec.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {rec.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* AI Reasons */}
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" />
                        Why We Recommend This
                      </h4>
                      <ul className="space-y-1">
                        {rec.reasons.map((reason, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <Zap className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button className="flex-1" onClick={() => handleBooking(rec)}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                      <Button variant="outline" onClick={() => {
                        toast({
                          title: "Saved to Favorites",
                          description: `${rec.name} has been added to your favorites!`
                        });
                      }}>
                        <Heart className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => navigate('/destinations')}>
                        <Camera className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Ready to Book Your Perfect Trip?</h3>
            <p className="mb-4 opacity-90">Our AI has analyzed thousands of bookings to find your ideal matches</p>
            <div className="flex gap-4 justify-center">
              <Button variant="secondary" size="lg">
                <Target className="h-5 w-5 mr-2" />
                Refine Preferences
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                <Award className="h-5 w-5 mr-2" />
                View All Bookings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Confirmation Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Confirm Your Booking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg">
                <h3 className="font-bold text-lg mb-2">{selectedBooking.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedBooking.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {selectedBooking.rating}
                  </span>
                </div>
                <p className="text-sm mb-3">{selectedBooking.description}</p>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-sm text-muted-foreground">Price:</span>
                  <span className="text-xl font-bold text-primary">{selectedBooking.price}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Date</label>
                  <Input type="date" min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Number of Guests</label>
                  <Select defaultValue="2">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                      <SelectItem value="5">5+ Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={confirmBooking}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Proceed to Book
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PredictiveBookingSystem;