import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Send, Bot, User, MessageSquare, X, Minimize2, Maximize2, MapPin, Clock, Phone, Star } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  suggestions?: string[];
  quickActions?: QuickAction[];
}

interface QuickAction {
  label: string;
  action: string;
  icon?: string;
}

interface ChatbotState {
  isOpen: boolean;
  isMinimized: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  currentTopic: string;
}

const AIChatbot = () => {
  const { t } = useLanguage();
  const [chatState, setChatState] = useState<ChatbotState>({
    isOpen: false,
    isMinimized: false,
    messages: [],
    isTyping: false,
    currentTopic: 'general'
  });
  
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [shouldAutoScroll]);

  // Handle scroll events to detect if user is manually scrolling
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 50;
    setShouldAutoScroll(isNearBottom);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, scrollToBottom]);

  // Initialize with welcome message
  useEffect(() => {
    if (chatState.isOpen && chatState.messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        message: "hey traveller how can i help u",
        timestamp: new Date(),
        suggestions: [
          "Show me top destinations",
          "Check weather in Ranchi",
          "Find tribal homestays",
          "Plan a 3-day trip",
          "Local festivals & events"
        ]
      };
      setChatState(prev => ({
        ...prev,
        messages: [welcomeMessage]
      }));
    }
  }, [chatState.isOpen, chatState.messages.length]);

  const quickActionButtons: QuickAction[] = [
    { label: "Destinations", action: "destinations", icon: "🏔️" },
    { label: "Weather", action: "weather", icon: "🌦️" },
    { label: "Homestays", action: "homestays", icon: "🏠" },
    { label: "Food", action: "food", icon: "🍽️" },
    { label: "Culture", action: "culture", icon: "🎭" },
    { label: "Emergency", action: "emergency", icon: "🚨" }
  ];

  // AI Response Generation using Groq API
  const generateAIResponse = async (userMessage: string): Promise<ChatMessage> => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    
    // Set typing state
    setChatState(prev => ({ ...prev, isTyping: true }));

    try {
      // Check if API key is available
      if (!apiKey || apiKey === 'your_new_groq_api_key_here') {
        console.warn('⚠️ Groq API key not configured. Using fallback responses.');
        setChatState(prev => ({ ...prev, isTyping: false }));
        return generateFallbackResponse(userMessage);
      }

      // Call Groq API
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: `You are a helpful AI travel assistant specializing in Jharkhand tourism. Provide accurate, engaging information about:
- Tourist destinations (waterfalls, temples, wildlife, hill stations)
- Accommodation (hotels, homestays, eco-lodges)
- Local cuisine and restaurants
- Transportation and travel tips
- Cultural experiences and festivals
- Emergency services and safety
- Budget planning and costs

Keep responses concise, friendly, and actionable. Use emojis appropriately. Always provide 3-5 relevant follow-up suggestions.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';

      setChatState(prev => ({ ...prev, isTyping: false }));

      // Generate context-aware suggestions
      const suggestions = generateSmartSuggestions(userMessage, aiContent);

      return {
        id: Date.now().toString(),
        type: 'bot',
        message: aiContent,
        timestamp: new Date(),
        suggestions
      };

    } catch (error) {
      console.error('❌ Groq API Error:', error);
      setChatState(prev => ({ ...prev, isTyping: false }));
      
      // Fallback to rule-based responses
      return generateFallbackResponse(userMessage);
    }
  };

  // Smart suggestion generator based on context
  const generateSmartSuggestions = (userMessage: string, aiResponse: string): string[] => {
    const lowerMessage = userMessage.toLowerCase();
    const lowerResponse = aiResponse.toLowerCase();
    
    if (lowerMessage.includes('destination') || lowerResponse.includes('waterfall') || lowerResponse.includes('temple')) {
      return ["Show waterfall details", "Best time to visit", "Nearby attractions", "How to reach", "Accommodation options"];
    } else if (lowerMessage.includes('food') || lowerResponse.includes('cuisine')) {
      return ["Show restaurant locations", "Vegetarian options", "Street food guide", "Cooking experiences", "Food festivals"];
    } else if (lowerMessage.includes('stay') || lowerResponse.includes('hotel')) {
      return ["Tribal homestays", "Budget options", "Luxury resorts", "Eco-lodges", "Book accommodation"];
    } else if (lowerMessage.includes('culture') || lowerResponse.includes('festival')) {
      return ["Festival calendar", "Cultural events", "Art workshops", "Village tours", "Traditional performances"];
    } else if (lowerMessage.includes('plan') || lowerResponse.includes('itinerary')) {
      return ["2-day trip plan", "Weekend getaway", "Cultural tour", "Adventure activities", "AI trip planner"];
    } else {
      return ["Top destinations", "Local experiences", "Travel tips", "Plan my trip", "Emergency contacts"];
    }
  };

  // Fallback response generator (used when API is unavailable)
  const generateFallbackResponse = (userMessage: string): ChatMessage => {
    const lowerMessage = userMessage.toLowerCase();
    
    let response = "";
    let suggestions: string[] = [];
    let quickActions: QuickAction[] = [];

    // Add notice about fallback mode
    const fallbackNotice = "ℹ️ *Using offline mode* - For more personalized responses, please configure Groq API.\n\n";

    // Smart response based on keywords
    if (lowerMessage.includes('destination') || lowerMessage.includes('place') || lowerMessage.includes('visit')) {
      response = "🏔️ Jharkhand has amazing destinations! Here are my top recommendations:\n\n• **Hundru Falls** - 320-foot magnificent waterfall\n• **Betla National Park** - Wildlife & safari experiences\n• **Netarhat** - Queen of Chotanagal, hill station\n• **Baidyanath Dham** - Sacred Jyotirlinga temple\n• **Patratu Valley** - Scenic valley views\n\nWhich type of destination interests you most?";
      suggestions = ["Show waterfall details", "Wildlife experiences", "Temple tours", "Hill stations", "Adventure activities"];
    }
    else if (lowerMessage.includes('weather') || lowerMessage.includes('climate')) {
      response = "🌦️ Current weather information:\n\n• **Ranchi**: 24°C, Partly cloudy - Perfect for sightseeing\n• **Jamshedpur**: 27°C, Clear skies - Great for outdoor activities\n• **Dhanbad**: 26°C, Light showers - Carry umbrella\n\n**Travel Advisory**: This is the ideal season for visiting waterfalls and outdoor activities. Mornings are pleasant for trekking!";
      suggestions = ["Check specific city weather", "Best time to visit", "Packing recommendations", "Seasonal activities"];
    }
    else if (lowerMessage.includes('homestay') || lowerMessage.includes('stay') || lowerMessage.includes('accommodation')) {
      response = "🏠 I can help you find perfect authentic stays! We have:\n\n• **75+ Verified Homestays** across all districts\n• **Tribal Family Experiences** with cultural immersion\n• **Eco-Lodges** near national parks\n• **Heritage Hotels** in historic locations\n\n💡 **Popular Choice**: Santal Heritage Home in Dumka - Experience authentic tribal lifestyle with organic meals and cultural programs!\n\nWhat's your budget range and preferred district?";
      suggestions = ["Show tribal homestays", "Eco-lodge options", "Budget accommodations", "Luxury stays", "Book now"];
      quickActions = [
        { label: "View All Stays", action: "view_stays", icon: "🏠" },
        { label: "Filter by Budget", action: "filter_budget", icon: "💰" }
      ];
    }
    else if (lowerMessage.includes('food') || lowerMessage.includes('cuisine') || lowerMessage.includes('restaurant')) {
      response = "🍽️ Jharkhand's culinary delights await you!\n\n**Must-Try Dishes**:\n• **Handia** - Traditional rice beer\n• **Thekua** - Festival sweet treat\n• **Dhuska** - Tribal fried bread\n• **Rugra** - Wild mushroom curry\n• **Bamboo Shoot Curry** - Local specialty\n\n**Recommended Restaurants**:\n• Tribal Kitchen, Ranchi - Authentic tribal cuisine\n• Forest View Restaurant, Betla - Local specialties\n• Heritage Dhaba, Netarhat - Traditional flavors";
      suggestions = ["Show restaurant locations", "Tribal cuisine details", "Vegetarian options", "Festival foods", "Cooking classes"];
    }
    else if (lowerMessage.includes('culture') || lowerMessage.includes('festival') || lowerMessage.includes('tribal')) {
      response = "🎭 Jharkhand's rich cultural heritage:\n\n**Major Festivals**:\n• **Sarhul** (March-April) - Worship of nature\n• **Karma** (August-September) - Harvest celebration\n• **Sohrai** (November) - Cattle festival\n\n**Tribal Communities**:\n• **Santal** - Largest tribal group\n• **Munda** - Known for their art\n• **Oraon** - Rich folklore traditions\n\n**Cultural Experiences**:\n• Traditional dance performances\n• Handicraft workshops\n• Village storytelling sessions";
      suggestions = ["Festival calendar", "Cultural events", "Art workshops", "Village tours", "Traditional music"];
    }
    else if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('hospital')) {
      response = "🚨 **Emergency Assistance**:\n\n**Emergency Numbers**:\n• Police: 100\n• Fire: 101\n• Ambulance: 108\n• Tourist Helpline: +91-651-2446441\n\n**Medical Facilities**:\n• RIMS Hospital, Ranchi\n• Tata Main Hospital, Jamshedpur\n• SNMMCH, Dhanbad\n\n**Tourist Police Stations**:\n• Ranchi Main Chowk\n• Jamshedpur Sakchi\n\nStay safe and don't hesitate to contact local authorities if needed!";
      suggestions = ["Show nearest hospital", "Tourist police contacts", "Embassy contacts", "Travel insurance"];
    }
    else if (lowerMessage.includes('plan') || lowerMessage.includes('itinerary') || lowerMessage.includes('trip')) {
      response = "📅 I'd love to help plan your trip! Our AI Trip Planner can create personalized itineraries based on:\n\n• Your interests and preferences\n• Budget range\n• Duration of stay\n• Group size\n• Travel style\n\n🎯 **Quick Planning Options**:\n• 2-Day Ranchi & Surroundings\n• 3-Day Waterfall Circuit\n• 5-Day Cultural Experience\n• 7-Day Complete Jharkhand\n\nWould you like me to start the AI Trip Planner for you?";
      suggestions = ["Start trip planner", "2-day quick trip", "Cultural tour plan", "Adventure activities", "Family-friendly itinerary"];
      quickActions = [
        { label: "AI Trip Planner", action: "trip_planner", icon: "✨" },
        { label: "Quick Itineraries", action: "quick_plans", icon: "📅" }
      ];
    }
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
      response = "💰 **Budget Guidelines for Jharkhand**:\n\n**Budget Travel** (₹2,000-3,000/day):\n• Homestays: ₹800-1,500/night\n• Meals: ₹500-800/day\n• Transport: ₹300-500/day\n\n**Mid-Range** (₹4,000-6,000/day):\n• Eco-lodges: ₹2,000-3,500/night\n• Restaurant meals: ₹800-1,200/day\n• Private transport: ₹800-1,000/day\n\n**Luxury** (₹8,000+/day):\n• Heritage hotels: ₹4,000+/night\n• Fine dining: ₹1,500+/day\n• Guided tours: ₹2,000+/day";
      suggestions = ["Budget trip plan", "Mid-range options", "Luxury experiences", "Group discounts", "Seasonal pricing"];
    }
    else if (lowerMessage.includes('transport') || lowerMessage.includes('travel') || lowerMessage.includes('reach')) {
      response = "🚗 **Transportation Options**:\n\n**By Air**:\n• Ranchi Airport (IXR) - Well connected\n• Regular flights from Delhi, Mumbai, Kolkata\n\n**By Train**:\n• Ranchi Junction - Major railway station\n• Tatanagar Junction (Jamshedpur)\n• Dhanbad Junction\n\n**Local Transport**:\n• App-based cabs (Ola, Uber)\n• State transport buses\n• Private taxi services\n• Auto-rickshaws in cities\n\n**Road Conditions**: Generally good on main routes, some hilly areas may have winding roads.";
      suggestions = ["Flight bookings", "Train schedules", "Local cab booking", "Bus routes", "Driving routes"];
    }
    else {
      response = "I understand you're looking for information about Jharkhand tourism. I can help with:\n\n• **Destinations & Attractions**\n• **Accommodation & Homestays**\n• **Weather & Best Time to Visit**\n• **Local Food & Restaurants**\n• **Cultural Events & Festivals**\n• **Transportation & Travel Planning**\n• **Emergency Assistance**\n\nWhat specific aspect would you like to explore?";
      suggestions = ["Show destinations", "Find accommodation", "Check weather", "Plan a trip", "Cultural experiences"];
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      message: fallbackNotice + response,
      timestamp: new Date(),
      suggestions,
      quickActions
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));

    setInputMessage('');

    const botResponse = await generateAIResponse(inputMessage);
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, botResponse]
    }));
  };

  const handleSuggestionClick = async (suggestion: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: suggestion,
      timestamp: new Date()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));

    const botResponse = await generateAIResponse(suggestion);
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, botResponse]
    }));
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'destinations':
        handleSuggestionClick('Show me top destinations in Jharkhand');
        break;
      case 'weather':
        handleSuggestionClick('Check current weather conditions');
        break;
      case 'homestays':
        handleSuggestionClick('Find authentic homestays');
        break;
      case 'food':
        handleSuggestionClick('Tell me about local cuisine');
        break;
      case 'culture':
        handleSuggestionClick('What are the cultural experiences available?');
        break;
      case 'emergency':
        handleSuggestionClick('Show emergency contacts and help');
        break;
      case 'trip_planner':
        // In production, this would navigate to the trip planner
        handleSuggestionClick('I want to plan a trip to Jharkhand');
        break;
    }
  };

  const toggleChat = () => {
    setChatState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const toggleMinimize = () => {
    setChatState(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  const closeChat = () => {
    setChatState(prev => ({ ...prev, isOpen: false }));
  };

  // Floating Chat Button
  if (!chatState.isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className="w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 chatbot-float-btn"
          size="lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
        
        {/* Notification dot for new features */}
        <div className="absolute -top-2 -left-2">
          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">!</span>
          </div>
        </div>
      </div>
    );
  }

  // Chat Interface
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-2xl transition-all duration-300 chatbot-container ${chatState.isMinimized ? 'h-16' : 'h-[600px]'}`}>
        {/* Header */}
        <CardHeader className="p-4 border-b bg-primary text-white rounded-t-lg chatbot-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Jharkhand AI Assistant</CardTitle>
                <p className="text-sm text-white/80">Always here to help</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMinimize}
                className="text-white hover:bg-white/20"
              >
                {chatState.isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeChat}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!chatState.isMinimized && (
          <CardContent className="p-0 flex flex-col h-[536px] chatbot-messages">
            {/* Quick Actions */}
            <div className="p-4 border-b bg-muted/30 chatbot-quick-actions">
              <div className="flex flex-wrap gap-2">
                {quickActionButtons.map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="text-xs chatbot-quick-action-btn"
                  >
                    <span className="mr-1">{action.icon}</span>
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4 chatbot-scroll"
              ref={messagesContainerRef}
              onScroll={handleScroll}
              style={{ 
                maxHeight: '400px'
              }}
            >
              {chatState.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-primary text-white chatbot-user-message' 
                        : 'bg-muted text-foreground chatbot-bot-message'
                    }`}>
                      <div className="flex items-start gap-2">
                        {message.type === 'bot' && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                        {message.type === 'user' && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-line">{message.message}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs mr-2 mb-1 chatbot-suggestion"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Quick Actions */}
                    {message.quickActions && message.quickActions.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {message.quickActions.map((action, idx) => (
                          <Button
                            key={idx}
                            variant="default"
                            size="sm"
                            onClick={() => handleQuickAction(action.action)}
                            className="text-xs chatbot-quick-action-message"
                          >
                            <span className="mr-1">{action.icon}</span>
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {chatState.isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg max-w-[80%] chatbot-typing">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce typing-dot"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce typing-dot" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce typing-dot" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t chatbot-input-area">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything about Jharkhand..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 chatbot-input"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputMessage.trim()}
                  className="chatbot-send-btn"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AIChatbot;