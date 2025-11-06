import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  Lightbulb
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

const FeedbackAnalysisPage: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

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
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">AI-Powered Analysis</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Tourism Feedback Analysis
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Analyze visitor feedback using advanced AI to extract insights and improve tourism experiences in Jharkhand
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  Enter Visitor Feedback
                </CardTitle>
                <CardDescription>
                  Paste visitor reviews, comments, or feedback for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Example: I visited Ranchi last week and had an amazing experience. The Tagore Hill was beautiful, but the roads leading to it need maintenance. The local food at Main Road was delicious. Overall, I loved the natural beauty and warm hospitality of Jharkhand people..."
                  className="min-h-[300px] text-base"
                  disabled={isAnalyzing}
                />
                
                <div className="flex items-center gap-3">
                  <Button
                    onClick={analyzeFeedback}
                    disabled={isAnalyzing || !feedback.trim()}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex-1"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Analyze Feedback
                      </>
                    )}
                  </Button>
                  
                  {analysis && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFeedback('');
                        setAnalysis(null);
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  Powered by Groq AI • Fast & Accurate Analysis
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <div className="space-y-6">
              {!analysis && !isAnalyzing && (
                <Card className="shadow-lg border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No Analysis Yet
                    </h3>
                    <p className="text-muted-foreground max-w-sm">
                      Enter visitor feedback and click "Analyze Feedback" to see AI-powered insights
                    </p>
                  </CardContent>
                </Card>
              )}

              {isAnalyzing && (
                <Card className="shadow-lg">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Analyzing Feedback...
                    </h3>
                    <p className="text-muted-foreground">
                      Our AI is processing the feedback
                    </p>
                  </CardContent>
                </Card>
              )}

              {analysis && (
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
                </>
              )}
            </div>
          </div>

          {/* Info Banner */}
          <Card className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0">
            <CardContent className="py-8">
              <div className="text-center max-w-3xl mx-auto">
                <Sparkles className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-3">AI-Powered Tourism Insights</h3>
                <p className="text-white/90 text-lg">
                  Our advanced AI analyzes visitor feedback to help improve tourism experiences across Jharkhand. 
                  Get sentiment analysis, key insights, and actionable recommendations instantly.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FeedbackAnalysisPage;