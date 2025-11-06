import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  MessageSquare, 
  BarChart3, 
  ThumbsUp, 
  ThumbsDown,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Star,
  Users,
  PieChart,
  Calendar,
  MapPin
} from 'lucide-react';
import Groq from 'groq-sdk';

interface AnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  score: number;
  keyPoints: string[];
  suggestions: string[];
  categories: string[];
  summary: string;
}

interface CustomerReview {
  id: number;
  name: string;
  location: string;
  rating: number;
  date: string;
  review: string;
  destination: string;
}

// Dummy customer reviews data
const dummyReviews: CustomerReview[] = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Delhi",
    rating: 5,
    date: "2024-10-15",
    review: "Jharkhand exceeded all my expectations! The Hundru Falls were breathtaking, and the local tribal culture is so rich and authentic. The homestay experience was wonderful.",
    destination: "Ranchi"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Mumbai",
    rating: 4,
    date: "2024-10-20",
    review: "Amazing wildlife experience at Betla National Park. Saw elephants and deer. However, the roads to Netarhat need improvement. Overall, a great trip!",
    destination: "Palamu"
  },
  {
    id: 3,
    name: "Anita Das",
    location: "Kolkata",
    rating: 5,
    date: "2024-10-25",
    review: "The Santal tribal villages near Dumka are a must-visit! Learned so much about their traditions and handicrafts. The Massanjore Dam sunset was magical.",
    destination: "Dumka"
  },
  {
    id: 4,
    name: "Vikram Singh",
    location: "Bangalore",
    rating: 3,
    date: "2024-11-01",
    review: "Jamshedpur is a nice industrial city with good infrastructure. Jubilee Park and Dalma Wildlife Sanctuary were highlights. Need more tourist information centers.",
    destination: "Jamshedpur"
  },
  {
    id: 5,
    name: "Meera Patel",
    location: "Ahmedabad",
    rating: 5,
    date: "2024-11-03",
    review: "Spiritual journey to Baidyanath Dham was incredible. The temple architecture is stunning, and the local food was delicious. Very peaceful experience.",
    destination: "Deoghar"
  },
  {
    id: 6,
    name: "Amit Jha",
    location: "Patna",
    rating: 4,
    date: "2024-11-05",
    review: "Parasnath Hills trek was challenging but rewarding. The views from the top are spectacular. Need better trekking facilities and guides.",
    destination: "Hazaribagh"
  }
];

// Analytics summary data
const analyticsData = {
  totalReviews: 156,
  averageRating: 4.3,
  positivePercentage: 78,
  neutralPercentage: 15,
  negativePercentage: 7,
  topDestinations: [
    { name: "Ranchi", reviews: 45 },
    { name: "Jamshedpur", reviews: 32 },
    { name: "Deoghar", reviews: 28 },
    { name: "Palamu", reviews: 22 },
    { name: "Dumka", reviews: 18 }
  ],
  commonThemes: [
    { theme: "Natural Beauty", count: 89 },
    { theme: "Cultural Experience", count: 67 },
    { theme: "Wildlife", count: 45 },
    { theme: "Religious Sites", count: 38 },
    { theme: "Infrastructure", count: 31 }
  ]
};

const FeedbackAnalysisPage: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    location: '',
    destination: '',
    rating: 5,
    review: ''
  });
  const { toast } = useToast();

  const handleSubmitReview = () => {
    if (!newReview.name || !newReview.location || !newReview.destination || !newReview.review) {
      toast({
        title: 'Incomplete Information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    // Simulate adding review (in real app, this would save to database)
    toast({
      title: 'Review Submitted! ✨',
      description: 'Thank you for sharing your experience with us!',
      duration: 5000,
    });

    // Reset form
    setNewReview({
      name: '',
      location: '',
      destination: '',
      rating: 5,
      review: ''
    });
    setShowReviewForm(false);
  };

  const analyzeFeedback = async () => {
    if (!feedback.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter feedback to analyze',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const prompt = `You are an expert tourism feedback analyst for Jharkhand, India. Analyze the following visitor feedback and provide detailed insights.

Feedback: "${feedback}"

Provide a comprehensive analysis in the following JSON format:
{
  "sentiment": "positive/negative/neutral/mixed",
  "score": <number between 0-100>,
  "keyPoints": [<array of 3-5 key points extracted from feedback>],
  "suggestions": [<array of 3-5 actionable suggestions to improve based on feedback>],
  "categories": [<array of relevant categories like "accommodation", "food", "transport", "attractions", "service", "cleanliness", "safety", "value">],
  "summary": "<2-3 sentence summary of the feedback>"
}

Be specific, actionable, and focus on Jharkhand tourism context. Return ONLY valid JSON, no additional text.`;

      const response = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }

      const result: AnalysisResult = JSON.parse(jsonMatch[0]);
      setAnalysis(result);
      
      toast({
        title: 'Analysis Complete',
        description: 'Feedback has been analyzed successfully',
      });
    } catch (error) {
      console.error('Error analyzing feedback:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Failed to analyze feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="w-6 h-6 text-emerald-600" />;
      case 'negative':
        return <ThumbsDown className="w-6 h-6 text-red-600" />;
      case 'mixed':
        return <AlertCircle className="w-6 h-6 text-amber-600" />;
      default:
        return <MessageSquare className="w-6 h-6 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'mixed':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-50 dark:from-emerald-950/30 dark:via-amber-950/20 dark:to-orange-950/30 py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-full mb-6">
              <BarChart3 className="w-5 h-5" />
              <span className="font-semibold">Customer Feedback Analytics</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              What Our Visitors Say
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real feedback from tourists who explored Jharkhand's beauty
            </p>
          </div>

          {/* Analytics Dashboard */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="shadow-lg border-emerald-200 dark:border-emerald-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Reviews</p>
                    <p className="text-3xl font-bold text-emerald-600">{analyticsData.totalReviews}</p>
                  </div>
                  <Users className="w-12 h-12 text-emerald-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-amber-200 dark:border-amber-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Average Rating</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-amber-600">{analyticsData.averageRating}</p>
                      <Star className="w-6 h-6 text-amber-600 fill-amber-600" />
                    </div>
                  </div>
                  <Star className="w-12 h-12 text-amber-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Positive Feedback</p>
                    <p className="text-3xl font-bold text-green-600">{analyticsData.positivePercentage}%</p>
                  </div>
                  <ThumbsUp className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-teal-200 dark:border-teal-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Top Destination</p>
                    <p className="text-2xl font-bold text-teal-600">{analyticsData.topDestinations[0].name}</p>
                  </div>
                  <MapPin className="w-12 h-12 text-teal-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sentiment Breakdown */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-emerald-600" />
                  Feedback Sentiment Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-green-600" />
                      Positive
                    </span>
                    <span className="text-sm font-bold text-green-600">{analyticsData.positivePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{ width: `${analyticsData.positivePercentage}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Neutral
                    </span>
                    <span className="text-sm font-bold text-amber-600">{analyticsData.neutralPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-amber-600 h-3 rounded-full" style={{ width: `${analyticsData.neutralPercentage}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <ThumbsDown className="w-4 h-4 text-red-600" />
                      Negative
                    </span>
                    <span className="text-sm font-bold text-red-600">{analyticsData.negativePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-red-600 h-3 rounded-full" style={{ width: `${analyticsData.negativePercentage}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  Common Themes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyticsData.commonThemes.map((theme, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{theme.theme}</span>
                    <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-300 dark:bg-teal-900/20 dark:text-teal-400">
                      {theme.count} mentions
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Customer Reviews Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-foreground">Recent Customer Reviews</h2>
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {showReviewForm ? 'Hide Form' : 'Give Your Review'}
              </Button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <Card className="shadow-lg mb-8 border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    Share Your Experience
                  </CardTitle>
                  <CardDescription>
                    Help future travelers by sharing your Jharkhand experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Name</label>
                      <Input
                        value={newReview.name}
                        onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your City</label>
                      <Input
                        value={newReview.location}
                        onChange={(e) => setNewReview({...newReview, location: e.target.value})}
                        placeholder="Mumbai"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Destination Visited</label>
                    <Input
                      value={newReview.destination}
                      onChange={(e) => setNewReview({...newReview, destination: e.target.value})}
                      placeholder="Ranchi, Jamshedpur, etc."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewReview({...newReview, rating: star})}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${star <= newReview.rating ? 'text-amber-600 fill-amber-600' : 'text-gray-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Review</label>
                    <Textarea
                      value={newReview.review}
                      onChange={(e) => setNewReview({...newReview, review: e.target.value})}
                      placeholder="Share your experience, favorite places, food, people you met..."
                      className="min-h-[120px]"
                    />
                  </div>

                  <Button
                    onClick={handleSubmitReview}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    size="lg"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Submit Review
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Reviews Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {dummyReviews.map((review) => (
                <Card key={review.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{review.name}</h3>
                        <p className="text-sm text-muted-foreground">{review.location}</p>
                      </div>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-400">
                        {review.destination}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-amber-600 fill-amber-600' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(review.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <p className="text-sm text-foreground leading-relaxed">
                      "{review.review}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Analysis Tool (Optional Advanced Feature) */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                AI Feedback Analyzer (Advanced Tool)
              </CardTitle>
              <CardDescription>
                Analyze any feedback text using AI to extract insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Paste visitor feedback here for detailed AI analysis..."
                className="min-h-[150px]"
                disabled={isAnalyzing}
              />
              
              <Button
                onClick={analyzeFeedback}
                disabled={isAnalyzing || !feedback.trim()}
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* AI Analysis Results */}
          {analysis && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">AI Analysis Results</h2>
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Sentiment Card */}
                <>
                  {/* Sentiment Card */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getSentimentIcon(analysis.sentiment)}
                        Sentiment Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={getSentimentColor(analysis.sentiment)} variant="secondary">
                          {analysis.sentiment.toUpperCase()}
                        </Badge>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-foreground">{analysis.score}%</div>
                          <div className="text-sm text-muted-foreground">Satisfaction Score</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            analysis.score >= 70 ? 'bg-emerald-600' :
                            analysis.score >= 40 ? 'bg-amber-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${analysis.score}%` }}
                        />
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {analysis.summary}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Categories */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-amber-600" />
                        Feedback Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.categories.map((category, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Points */}
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        Key Points
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.keyPoints.map((point, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </span>
                            <span className="text-sm text-foreground">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Suggestions */}
                  <Card className="shadow-lg border-teal-200 dark:border-teal-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-teal-600" />
                        Actionable Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="flex-shrink-0 mt-1">
                              <TrendingUp className="w-5 h-5 text-teal-600" />
                            </span>
                            <span className="text-sm text-foreground">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FeedbackAnalysisPage;