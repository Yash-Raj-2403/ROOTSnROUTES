import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, X, Minimize2, MessageSquare, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [lastHelpMessageTime, setLastHelpMessageTime] = useState<number>(Date.now());
  const [showNotification, setShowNotification] = useState(false);
  const [notificationIndex, setNotificationIndex] = useState(0);

  const helpNotifications = [
    { emoji: "🌟", text: "Discover amazing places in Jharkhand! ✨" },
    { emoji: "🏔️", text: "Need travel tips? I'm here to help! 🗺️" },
    { emoji: "🎒", text: "Planning your adventure? Let's explore! �" },
    { emoji: "�", text: "Got questions about tourism? Ask away! 🚀" },
    { emoji: "🌺", text: "Explore hidden gems with me! 🏞️" },
    { emoji: "�", text: "Looking for the perfect destination? �" }
  ];

  // Periodic help notifications
  useEffect(() => {
    // Show first notification when user opens site
    const firstTimeout = setTimeout(() => {
      if (!isOpen) {
        setShowNotification(true);
        setNotificationIndex(0);
        setLastHelpMessageTime(Date.now());
        setTimeout(() => setShowNotification(false), 5000);
      }
    }, 2000);

    const interval = setInterval(() => {
      const now = Date.now();
      // Show notification every 30 seconds regardless of user activity
      if (!isOpen && (now - lastHelpMessageTime) >= 30000) {
        setShowNotification(true);
        setNotificationIndex((prev) => (prev + 1) % helpNotifications.length);
        setLastHelpMessageTime(now);
        setTimeout(() => setShowNotification(false), 5000);
      }
    }, 30000);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, [isOpen, lastHelpMessageTime, helpNotifications]);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatbot-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: Omit<Message, 'timestamp'> & { timestamp: string }) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error parsing saved messages:', error);
        // Initialize with welcome message if parsing fails
        initializeWelcomeMessage();
      }
    } else {
      // Initialize with welcome message
      initializeWelcomeMessage();
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatbot-messages', JSON.stringify(messages));
    }
  }, [messages]);

  const initializeWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: '🌟 Welcome to Jharkhand! I\'m your AI travel guide 🗺️\n\nI can help you with:\n🏔️ Tourist destinations\n🏨 Hotels & accommodations\n🍽️ Local cuisine\n🚗 Transportation\n🌤️ Weather updates\n\nWhat would you like to explore today? ✨',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const clearChat = () => {
    localStorage.removeItem('chatbot-messages');
    initializeWelcomeMessage();
  };

  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  const testAPIConnection = useCallback(async () => {
    // Only test if we have a valid API key
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      console.log('⚠️ API key not configured properly');
      return;
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      
      console.log('🧪 API test response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API connection successful! Available models:', data.data?.length || 0);
      } else {
        const errorText = await response.text();
        console.log('❌ API test failed:', response.status, errorText);
      }
    } catch (error) {
      console.log('❌ API test error:', error);
    }
  }, [apiKey]);

  useEffect(() => {
    // Debug API key
    console.log('🔑 FloatingChatbot - API Key loaded:', apiKey ? 'Yes' : 'No');
    console.log('🔑 API Key length:', apiKey ? apiKey.length : 0);
    console.log('🔑 API Key starts with gsk_:', apiKey ? apiKey.startsWith('gsk_') : false);
    
    // Test API connection only if we have a valid key
    if (apiKey && apiKey !== 'your_groq_api_key_here') {
      console.log('🧪 Testing API connection...');
      testAPIConnection();
    } else {
      console.log('⚠️ Skipping API test - invalid or missing API key');
    }
  }, [apiKey, testAPIConnection]);

  useEffect(() => {
    if (scrollAreaRef.current && shouldAutoScroll) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, shouldAutoScroll]);

  // Handle scroll events to detect if user is manually scrolling
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 50;
    setShouldAutoScroll(isNearBottom);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      console.error('❌ No valid API key found');
      
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '⚠️ **API Configuration Required**\n\nTo use the AI chatbot, please:\n\n1. Get your Groq API key from [console.groq.com](https://console.groq.com/)\n2. Add it to your `.env` file:\n   `VITE_GROQ_API_KEY=your_actual_key_here`\n3. Restart the development server\n\nFor now, I can still help with basic information about Jharkhand tourism! 🏔️',
        timestamp: new Date()
      };
      
      const userMessage: Message = {
        id: (Date.now() - 1).toString(),
        role: 'user',
        content: input,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage, errorMessage]);
      setInput('');
      return;
    }

    console.log('🚀 FloatingChatbot - Starting API call...');
    console.log('📝 User input:', input);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const requestBody = {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful travel assistant specializing in Jharkhand tourism. Provide helpful, accurate information about destinations, transportation, culture, and travel tips for Jharkhand, India. Keep responses concise but informative.'
          },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          {
            role: 'user',
            content: currentInput
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      };

      console.log('📦 Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Response data:', data);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t generate a response.',
        timestamp: new Date()
      };

      console.log('💬 Assistant response:', assistantMessage.content);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('💥 Detailed error:', error);
      
      let errorMsg = 'Sorry, I encountered an error. Please try again later.';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMsg = 'Network error: Unable to connect. Please check your internet connection.';
        } else if (error.message.includes('401')) {
          errorMsg = 'Authentication error: Invalid API key.';
        } else if (error.message.includes('429')) {
          errorMsg = 'Rate limit exceeded: Please try again in a moment.';
        } else {
          errorMsg = `Error: ${error.message}`;
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMsg,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={() => {
            setIsOpen(true);
            setShowNotification(false);
          }}
          className="bg-transparent border-0 p-0 transition-all duration-300 hover:scale-110 group animate-bounce hover:animate-none"
          aria-label="Open Jharkhand Travel Assistant"
          style={{ animationDuration: '2s' }}
        >
          <div className="relative">
            {/* Custom Robot SVG Icon */}
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-2xl group-hover:scale-110 transition-transform duration-200"
            >
              {/* Robot Body */}
              <rect x="14" y="24" width="36" height="32" rx="8" fill="#10B981" stroke="#059669" strokeWidth="2"/>
              
              {/* Robot Head */}
              <rect x="20" y="8" width="24" height="20" rx="6" fill="#34D399" stroke="#10B981" strokeWidth="2"/>
              
              {/* Robot Eyes */}
              <circle cx="28" cy="16" r="3" fill="#065F46"/>
              <circle cx="36" cy="16" r="3" fill="#065F46"/>
              <circle cx="28" cy="16" r="1.5" fill="#10B981"/>
              <circle cx="36" cy="16" r="1.5" fill="#10B981"/>
              
              {/* Robot Antenna */}
              <line x1="32" y1="8" x2="32" y2="4" stroke="#059669" strokeWidth="2"/>
              <circle cx="32" cy="4" r="2" fill="#F59E0B"/>
              
              {/* Robot Arms */}
              <rect x="6" y="28" width="8" height="16" rx="4" fill="#34D399" stroke="#10B981" strokeWidth="2"/>
              <rect x="50" y="28" width="8" height="16" rx="4" fill="#34D399" stroke="#10B981" strokeWidth="2"/>
              
              {/* Robot Legs */}
              <rect x="20" y="56" width="6" height="6" rx="2" fill="#059669"/>
              <rect x="38" y="56" width="6" height="6" rx="2" fill="#059669"/>
              
              {/* Robot Chest Panel */}
              <rect x="26" y="32" width="12" height="8" rx="2" fill="#065F46"/>
              <circle cx="32" cy="36" r="2" fill="#10B981"/>
              
              {/* Robot Mouth */}
              <rect x="28" y="20" width="8" height="2" rx="1" fill="#065F46"/>
            </svg>
            
            {/* Online indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Help Notification */}
      {showNotification && !isOpen && (
        <div className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 z-[10000]">
          <div className="animate-bounce">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-4 rounded-2xl shadow-2xl border-2 border-white/20 relative cursor-pointer hover:scale-105 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              onClick={() => {
                setIsOpen(true);
                setShowNotification(false);
              }}
              style={{ minWidth: '280px', maxWidth: '320px' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-pulse">{helpNotifications[notificationIndex].emoji}</span>
                <span className="text-sm font-semibold text-white drop-shadow-sm">{helpNotifications[notificationIndex].text}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotification(false);
                }}
                className="absolute -top-2 -right-2 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-sm transition-all duration-200 font-bold backdrop-blur-sm"
                aria-label="Close notification"
              >
                ×
              </button>
              <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-500"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Chatbot Container */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end">
      {/* Modern chat container with theme-aware outer background */}
      <div className="bg-black/90 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl p-1 shadow-2xl chatbot-container">
        <Card className={`w-[380px] max-w-[calc(100vw-2rem)] shadow-none border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm transition-all duration-300 rounded-xl ${
          isMinimized ? 'h-14' : 'h-[500px] max-h-[calc(100vh-8rem)]'
        }`}>
          <CardHeader className="p-3 border-b bg-gradient-to-r from-blue-500 to-purple-600 dark:from-emerald-600 dark:to-green-600 text-white rounded-t-xl shadow-lg chatbot-header">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Bot className="w-5 h-5 animate-pulse" />
                🤖 Routey
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-all duration-200"
                  aria-label="Clear chat"
                  title="Clear chat history"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-all duration-200"
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  <Minimize2 className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-all duration-200"
                  aria-label="Close chat"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="flex flex-col h-[440px] max-h-[calc(100vh-12rem)] p-0 bg-gray-50/50 dark:bg-slate-800/30 chatbot-messages">
            <ScrollArea 
              className="flex-1 p-4 chatbot-scroll" 
              ref={scrollAreaRef}
              onScrollCapture={handleScroll}
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 items-start animate-fadeIn ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <Avatar className={`w-8 h-8 flex-shrink-0 mt-1 ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 dark:from-emerald-500 dark:to-green-500 text-white' 
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-green-600 dark:to-emerald-600 text-white'
                    }`}>
                      <AvatarFallback className={`text-xs ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 dark:from-emerald-500 dark:to-green-500 text-white' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-green-600 dark:to-emerald-600 text-white'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div
                      className={`max-w-[75%] p-4 text-sm leading-relaxed whitespace-pre-wrap shadow-md transition-all duration-200 hover:shadow-lg ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 dark:from-emerald-500 dark:to-green-500 text-white rounded-2xl rounded-br-md chatbot-user-message'
                          : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-2xl rounded-bl-md chatbot-bot-message'
                      }`}
                    >
                      <p className="break-words font-medium">{message.content}</p>
                      <p className={`text-xs mt-3 opacity-70 font-normal ${
                        message.role === 'user' ? 'text-blue-100 dark:text-green-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex gap-3 items-start animate-fadeIn">
                    <Avatar className="w-8 h-8 mt-1 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-green-600 dark:to-emerald-600 text-white">
                      <AvatarFallback className="text-xs bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-green-600 dark:to-emerald-600 text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl rounded-bl-md border border-gray-300 dark:border-slate-600 shadow-md chatbot-typing">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-green-500 dark:to-emerald-500 rounded-full animate-bounce typing-dot"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-green-500 dark:to-emerald-500 rounded-full animate-bounce [animation-delay:0.1s] typing-dot"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-green-500 dark:to-emerald-500 rounded-full animate-bounce [animation-delay:0.2s] typing-dot"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Scroll to bottom button */}
            {!shouldAutoScroll && (
              <div className="absolute bottom-20 right-4">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full shadow-lg bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200"
                  onClick={() => {
                    setShouldAutoScroll(true);
                    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
                    if (scrollElement) {
                      scrollElement.scrollTop = scrollElement.scrollHeight;
                    }
                  }}
                >
                  <span className="text-xs">↓</span>
                </Button>
              </div>
            )}
            
            {/* Modern input area */}
            <div className="border-t bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-b-xl chatbot-input-area">
              <div className="flex gap-3 items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about Jharkhand tourism..."
                  disabled={loading}
                  className="flex-1 h-12 text-sm px-4 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 chatbot-input"
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  size="sm"
                  className="h-12 w-12 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:from-emerald-500 dark:to-green-500 dark:hover:from-emerald-600 dark:hover:to-green-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed chatbot-send-btn"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      </div>
      </div>
    </>
  );
};

export default FloatingChatbot;