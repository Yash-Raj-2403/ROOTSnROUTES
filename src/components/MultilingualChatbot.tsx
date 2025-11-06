import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Bot, User, X, Minimize2, MessageSquare, Globe, Languages } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language: string;
}

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const supportedLanguages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'snt', name: 'Santhali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', flag: '🏛️' },
  { code: 'ho', name: 'Ho', nativeName: 'Ho', flag: '🏛️' },
  { code: 'mun', name: 'Mundari', nativeName: 'Mundari', flag: '🏛️' },
  { code: 'kru', name: 'Kurukh', nativeName: 'कुड़ुख़', flag: '🏛️' },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी', flag: '🇮🇳' },
  { code: 'mag', name: 'Magahi', nativeName: 'मगही', flag: '🇮🇳' }
];

const greetingMessages = {
  en: 'Hello! I\'m your Jharkhand travel assistant. How can I help you explore the beautiful state of Jharkhand today?',
  hi: 'नमस्ते! मैं आपका झारखंड यात्रा सहायक हूँ। आज मैं झारखंड के सुंदर राज्य को देखने में आपकी कैसे मदद कर सकता हूँ?',
  snt: 'ᱡᱚᱦᱟᱨ! ᱟᱢᱟᱜ ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱦᱚᱨ ᱜᱚᱲᱚᱭᱤᱡ ᱠᱟᱱᱟᱢ| ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱱᱟᱜ ᱪᱚᱨᱚᱠ ᱞᱟ.ᱜᱤᱱ ᱪᱮᱫ ᱜᱚᱲᱚ ᱮᱢᱚᱜ-ᱟ?',
  ho: 'Johar! Añ jharkhand yatra sahayak kana. Jharkhand re ki rupa gada khali dekhau kana? Ki gorop emoga?',
  mun: 'Johar! Añ jharkhand yatra madad kana. Jharkhand sundar rajya dekhabon ki madad emoga?',
  kru: 'नमस्कार! मैं झारखंड यात्रा सहायक हूँ। झारखंड राज्य देखने में कैसे मदद करूँ?',
  bho: 'प्रणाम! हमरा झारखंड घूमे के सहायक हईं। झारखंड के सुंदर जगह देखे में केतना मदद करीं?',
  mag: 'प्रणाम! हमरा झारखंड यात्रा सहायक छियै। झारखंड के सुंदर राज्य देखे में कतेक मदद करबै?'
};

const MultilingualChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Load messages and language preference from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('multilingual-chatbot-messages');
    const savedLanguage = localStorage.getItem('multilingual-chatbot-language');
    
    if (savedLanguage && supportedLanguages.some(lang => lang.code === savedLanguage)) {
      setSelectedLanguage(savedLanguage);
    }
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error parsing saved messages:', error);
        initializeWelcomeMessage(savedLanguage || 'en');
      }
    } else {
      initializeWelcomeMessage(savedLanguage || 'en');
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('multilingual-chatbot-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('multilingual-chatbot-language', selectedLanguage);
  }, [selectedLanguage]);

  const initializeWelcomeMessage = (language: string) => {
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: greetingMessages[language as keyof typeof greetingMessages] || greetingMessages.en,
      timestamp: new Date(),
      language: language
    };
    setMessages([welcomeMessage]);
  };

  // Auto-scroll to bottom with smooth animation
  useEffect(() => {
    if (shouldAutoScroll && scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
      if (scrollElement) {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [messages, shouldAutoScroll]);

  // Handle scroll events to detect if user is manually scrolling
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 50;
    setShouldAutoScroll(isNearBottom);
  };

  const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    // Mock translation for now - in production, integrate with translation API
    const translations: { [key: string]: { [key: string]: string } } = {
      en: {
        'What are the top destinations in Jharkhand?': 'What are the top destinations in Jharkhand?',
        'Tell me about Ranchi': 'Tell me about Ranchi',
        'How is the weather?': 'How is the weather?'
      },
      hi: {
        'What are the top destinations in Jharkhand?': 'झारखंड में शीर्ष गंतव्य कौन से हैं?',
        'Tell me about Ranchi': 'रांची के बारे में बताएं',
        'How is the weather?': 'मौसम कैसा है?'
      },
      snt: {
        'What are the top destinations in Jharkhand?': 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮ ᱪᱮᱫ ᱪᱮᱫ ᱥᱚᱨᱮᱥ ᱡᱟᱭᱜᱟ ᱢᱮᱱᱟᱜ-ᱟ?',
        'Tell me about Ranchi': 'ᱨᱟᱸᱪᱤ ᱵᱟᱵᱚᱛ ᱢᱮ ᱢᱮᱱᱟᱢ',
        'How is the weather?': 'ᱦᱚᱭ ᱫᱟᱜ ᱪᱮᱫ ᱞᱮᱠᱟᱱᱟ?'
      }
    };

    return translations[targetLanguage]?.[text] || text;
  };

  const generateResponse = async (userMessage: string, language: string): Promise<string> => {
    // Mock AI responses in different languages
    const responses: { [key: string]: string[] } = {
      en: [
        `Great question! Jharkhand has amazing destinations like Hundru Falls, Betla National Park, Netarhat Hill Station, and Baidyanath Temple. Each offers unique experiences - from natural beauty to spiritual significance.`,
        `I'd be happy to help you explore Jharkhand! The state is known for its tribal culture, stunning waterfalls, wildlife sanctuaries, and religious sites. What specific aspect interests you?`,
        `Jharkhand is a treasure trove of natural wonders and cultural heritage. Popular attractions include Dassam Falls, Jonha Falls, Tagore Hill, and various tribal villages where you can experience authentic local culture.`
      ],
      hi: [
        `बहुत अच्छा सवाल! झारखंड में हुंद्रू फॉल्स, बेतला राष्ट्रीय उद्यान, नेतरहाट हिल स्टेशन और बैद्यनाथ मंदिर जैसे अद्भुत स्थल हैं। प्रत्येक प्राकृतिक सुंदरता से लेकर आध्यात्मिक महत्व तक अनूठे अनुभव प्रदान करता है।`,
        `झारखंड की खोज में आपकी मदद करके मुझे खुशी होगी! यह राज्य अपनी आदिवासी संस्कृति, शानदार झरनों, वन्यजीव अभयारण्यों और धार्मिक स्थलों के लिए प्रसिद्ध है। आपको कौन सा विशिष्ट पहलू दिलचस्प लगता है?`,
        `झारखंड प्राकृतिक आश्चर्यों और सांस्कृतिक विरासत का खजाना है। लोकप्रिय आकर्षणों में दसम फॉल्स, जोन्हा फॉल्स, टैगोर हिल और विभिन्न आदिवासी गांव शामिल हैं जहां आप प्रामाणिक स्थानीय संस्कृति का अनुभव कर सकते हैं।`
      ],
      snt: [
        `ᱱᱚᱶᱟ ᱟ.ᱰᱤ ᱥᱚᱨᱮᱥ ᱠᱩᱞᱤ ᱠᱟᱱᱟ! ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮ ᱦᱩᱸᱫᱨᱩ ᱡᱟᱦᱟᱸᱡ, ᱵᱮᱛᱞᱟ ᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱵᱟᱜᱟᱱ, ᱱᱮᱛᱟᱨᱦᱟᱴ ᱵᱩᱨᱩ ᱴᱷᱟᱶ ᱟᱨ ᱵᱚᱭᱫᱭᱚᱱᱟᱛᱷ ᱢᱚᱱᱫᱤᱨ ᱞᱮᱠᱟᱱ ᱟ.ᱰᱤ ᱪᱚᱨᱚᱠ ᱡᱟᱭᱜᱟ ᱢᱮᱱᱟᱜ-ᱟ।`,
        `ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱧᱮᱞ ᱞᱟ.ᱜᱤᱱ ᱟᱢᱟᱜ ᱜᱚᱲᱚ ᱮᱢ ᱞᱟ.ᱜᱤᱱ ᱤᱧ ᱟ.ᱰᱤ ᱨᱟᱹᱥᱠᱟ.ᱧ! ᱱᱚᱶᱟ ᱯᱚᱱᱚᱛ ᱫᱚ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱞᱟᱠᱪᱟᱨ, ᱪᱚᱨᱚᱠ ᱡᱟᱦᱟᱸᱡ, ᱡᱤᱵᱡᱤᱭᱟ.ᱞᱤ ᱨᱟᱠᱷᱟ ᱚᱲᱟᱜ ᱟᱨ ᱫᱷᱚᱨᱚᱢ ᱴᱷᱟᱶ ᱠᱚ ᱞᱟ.ᱜᱤᱱ ᱵᱟᱰᱟᱭᱚᱜ-ᱟ।`,
        `ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱫᱚ ᱡᱤᱭᱚᱱ ᱯᱨᱚᱠᱨᱤᱛᱤᱭᱟᱜ ᱪᱚᱨᱚᱠ ᱟᱨ ᱞᱟᱠᱪᱟᱨ ᱪᱷᱟᱸᱫᱚᱜ ᱨᱮᱱᱟᱜ ᱫᱟᱱ ᱠᱟᱱᱟ। ᱧᱩᱛᱩᱢᱟᱱ ᱞᱟᱠᱪᱟᱨᱟᱱ ᱴᱷᱟᱶ ᱨᱮ ᱫᱚᱥᱚᱢ ᱡᱟᱦᱟᱸᱡ, ᱡᱚᱱᱦᱟ ᱡᱟᱦᱟᱸᱡ, ᱴᱮᱜᱳᱨ ᱵᱩᱨᱩ ᱟᱨ ᱡᱚᱛᱚ ᱞᱮᱠᱟᱱ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱟ.ᱛᱩ ᱠᱚ ᱢᱮᱱᱟᱜ-ᱟ।`
      ]
    };

    const responseArray = responses[language] || responses.en;
    const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];
    return randomResponse;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await generateResponse(currentInput, selectedLanguage);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: selectedLanguage === 'hi' ? 'क्षमा करें, कुछ गलत हुआ। कृपया पुनः प्रयास करें।' : 
                selectedLanguage === 'snt' ? 'ᱢᱟ.ᱯᱷ ᱢᱮ, ᱪᱮᱫᱟᱜ ᱵᱷᱩᱞ ᱦᱩᱭᱮᱱᱟ। ᱫᱚᱦᱲᱟ ᱪᱮᱥᱴᱟ ᱢᱮ।' :
                'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    
    // Add a language change message
    const changeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: greetingMessages[newLanguage as keyof typeof greetingMessages] || greetingMessages.en,
      timestamp: new Date(),
      language: newLanguage
    };
    
    setMessages(prev => [...prev, changeMessage]);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('multilingual-chatbot-messages');
    initializeWelcomeMessage(selectedLanguage);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
        >
          <div className="flex flex-col items-center">
            <Languages className="h-6 w-6" />
            <span className="text-xs mt-1">Help</span>
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black w-full max-w-4xl h-full max-h-[90vh] rounded-2xl shadow-2xl flex flex-col">
        <Card className={`w-full h-full bg-transparent border-0 shadow-none flex flex-col ${
          isMinimized ? 'h-16' : 'h-full'
        }`}>
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Languages className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Jharkhand Travel Assistant</CardTitle>
                  <p className="text-emerald-100 text-sm">Multi-Language Support 🗣️</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                          <span className="text-sm opacity-70">({lang.nativeName})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/10"
                >
                  {isMinimized ? <MessageSquare className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <CardContent className="flex flex-col h-full bg-white/5 backdrop-blur-sm p-0 rounded-b-2xl">
              {/* Chat Messages Area */}
              <ScrollArea 
                className="flex-1 p-6" 
                ref={scrollAreaRef}
                onScrollCapture={handleScroll}
              >
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 items-start animate-fadeIn ${
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className={`text-sm font-semibold ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-5 h-5" />
                          ) : (
                            <Bot className="w-5 h-5" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`max-w-[75%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div
                          className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-br-md'
                              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2 px-2">
                          <p className="text-xs text-gray-400">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                          {supportedLanguages.find(lang => lang.code === message.language) && (
                            <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded-full">
                              {supportedLanguages.find(lang => lang.code === message.language)?.flag}
                              {supportedLanguages.find(lang => lang.code === message.language)?.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="flex gap-4 items-start animate-fadeIn">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                          <Bot className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white p-4 rounded-2xl rounded-bl-md shadow-lg max-w-[75%]">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {/* Scroll to bottom button */}
              {!shouldAutoScroll && (
                <div className="absolute bottom-24 right-8">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full shadow-lg bg-white/90 hover:bg-white"
                    onClick={() => {
                      setShouldAutoScroll(true);
                      const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
                      if (scrollElement) {
                        scrollElement.scrollTo({
                          top: scrollElement.scrollHeight,
                          behavior: 'smooth'
                        });
                      }
                    }}
                  >
                    <span className="text-lg">↓</span>
                  </Button>
                </div>
              )}
              
              {/* Input Area */}
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-b-2xl border-t border-gray-600/30">
                <div className="flex gap-3 items-center">
                  <div className="flex-1 relative">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder={
                        selectedLanguage === 'hi' ? 'अपना संदेश यहाँ लिखें...' :
                        selectedLanguage === 'snt' ? 'ᱟᱢᱟᱜ ᱠᱷᱚᱵᱚᱨ ᱱᱚᱸᱰᱮ ᱚᱞ ᱢᱮ...' :
                        'Type your message here...'
                      }
                      disabled={loading}
                      className="bg-white/90 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 pr-12 py-3 text-gray-800 rounded-xl"
                    />
                    <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  <Button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl px-6 py-3 transition-all duration-200"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={clearChat}
                    variant="outline"
                    className="border-gray-500 text-gray-300 hover:bg-gray-700 rounded-xl px-4 py-3"
                  >
                    Clear
                  </Button>
                </div>
                
                {/* Language Info */}
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-400">
                    {selectedLanguage === 'hi' ? '🗣️ हिंदी, अंग्रेजी, संथाली, हो, मुंडारी, कुडुख और अन्य स्थानीय भाषाओं में सहायता प्राप्त करें।' :
                     selectedLanguage === 'snt' ? '🗣️ ᱦᱤᱱᱫᱤ, ᱤᱝᱞᱤᱥ, ᱥᱟᱱᱛᱟᱲᱤ, ᱦᱳ, ᱢᱩᱸᱰᱟᱨᱤ, ᱠᱩᱲᱩᱠᱷ ᱟᱨ ᱮᱴᱟᱜ ᱡᱟᱭᱜᱟᱭᱟᱱ ᱯᱟᱹᱨᱥᱤ ᱛᱮ ᱜᱚᱲᱚ ᱧᱟᱢ ᱢᱮ।' :
                     '🗣️ Get assistance in Hindi, English, Santhali, Ho, Mundari, Kurukh, and other regional languages spoken in Jharkhand.'}
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MultilingualChatbot;
