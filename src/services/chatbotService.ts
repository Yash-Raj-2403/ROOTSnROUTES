interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

interface LocalTip {
  location: string;
  tip: string;
  category: 'transport' | 'food' | 'safety' | 'culture' | 'weather';
}

class SmartChatbotService {
  private faqs: FAQItem[] = [
    {
      id: '1',
      question: 'What is the best time to visit Jharkhand?',
      answer: 'The best time to visit Jharkhand is from October to March when the weather is pleasant and cool. Avoid monsoon season (July-September) as many areas become inaccessible.',
      category: 'general',
      keywords: ['weather', 'time', 'visit', 'season', 'month']
    },
    {
      id: '2',
      question: 'How do I reach Netarhat from Ranchi?',
      answer: 'From Ranchi, take a bus or taxi to Gumla (80 km), then another 37 km to Netarhat. Total journey takes 3-4 hours. You can also book a direct cab from Ranchi.',
      category: 'transport',
      keywords: ['netarhat', 'ranchi', 'transport', 'bus', 'taxi', 'reach']
    },
    {
      id: '3',
      question: 'What are the famous foods of Jharkhand?',
      answer: 'Must-try foods include Litti Chokha, Handia (rice beer), Bamboo Shoot Curry, Tribal Thali, and various local sweets. Each district has its unique specialties.',
      category: 'food',
      keywords: ['food', 'cuisine', 'litti', 'handia', 'bamboo', 'local']
    },
    // Add more FAQs...
  ];

  private localTips: LocalTip[] = [
    {
      location: 'Deoghar',
      tip: 'Visit Baba Baidyanath Temple early morning (5-6 AM) to avoid crowds. Carry water as queues can be long.',
      category: 'culture'
    },
    {
      location: 'Netarhat',
      tip: 'Book accommodation in advance, especially during winter. Carry warm clothes as temperatures can drop significantly.',
      category: 'weather'
    },
    {
      location: 'Jamshedpur',
      tip: 'Use Tata Steel buses for cheap and reliable local transportation. They connect most parts of the city.',
      category: 'transport'
    }
    // Add more tips...
  ];

  private emergencyNumbers = {
    police: '100',
    ambulance: '108',
    fire: '101',
    tourist_helpline: '1363',
    jharkhand_tourism: '+91-651-2446466'
  };

  public searchFAQs(query: string): FAQItem[] {
    const searchTerms = query.toLowerCase().split(' ');
    
    return this.faqs.filter(faq => {
      const questionWords = faq.question.toLowerCase().split(' ');
      const keywords = faq.keywords;
      
      return searchTerms.some(term => 
        questionWords.some(word => word.includes(term)) ||
        keywords.some(keyword => keyword.includes(term))
      );
    }).slice(0, 5); // Return top 5 matches
  }

  public getLocalTips(location?: string): LocalTip[] {
    if (location) {
      return this.localTips.filter(tip => 
        tip.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    return this.localTips.slice(0, 3); // Return random 3 tips
  }

  public getEmergencyNumbers() {
    return this.emergencyNumbers;
  }

  public generateResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Emergency keywords
    if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('police')) {
      return `🚨 Emergency Numbers:\n📞 Police: ${this.emergencyNumbers.police}\n🏥 Ambulance: ${this.emergencyNumbers.ambulance}\n🔥 Fire: ${this.emergencyNumbers.fire}\n🎫 Tourist Helpline: ${this.emergencyNumbers.tourist_helpline}`;
    }

    // Weather queries
    if (lowerMessage.includes('weather') || lowerMessage.includes('temperature')) {
      return "The weather in Jharkhand varies by season. Winter (Nov-Feb) is cool and pleasant (10-25°C), Summer (Mar-May) is hot (25-42°C), and Monsoon (Jun-Sep) brings heavy rainfall. Check current weather conditions before traveling.";
    }

    // Transport queries
    if (lowerMessage.includes('transport') || lowerMessage.includes('bus') || lowerMessage.includes('train')) {
      return "Jharkhand has good rail and road connectivity. Major stations include Ranchi, Jamshedpur, and Dhanbad. For local transport, use state buses, shared autos, or book cabs. Many destinations require 4WD vehicles.";
    }

    // Food queries
    if (lowerMessage.includes('food') || lowerMessage.includes('restaurant') || lowerMessage.includes('eat')) {
      return "Try authentic Jharkhand cuisine including Litti Chokha, Handia, Tribal Thali, and Bamboo Shoot preparations. Each district has unique specialties. Look for local dhabas and tribal restaurants for authentic experience.";
    }

    // Accommodation queries
    if (lowerMessage.includes('stay') || lowerMessage.includes('hotel') || lowerMessage.includes('accommodation')) {
      return "Jharkhand offers various accommodation options from tribal homestays to luxury resorts. Book in advance for popular destinations like Netarhat and Deoghar. Homestays provide authentic cultural experience.";
    }

    // Search FAQs for relevant response
    const relevantFAQs = this.searchFAQs(message);
    if (relevantFAQs.length > 0) {
      return relevantFAQs[0].answer + "\n\n💡 Need more specific help? Ask about transport, food, weather, or accommodations!";
    }

    // Default response
    return "I can help you with information about Jharkhand tourism! Ask me about:\n🏨 Accommodations\n🚌 Transportation\n🍽️ Local cuisine\n🌤️ Weather conditions\n🆘 Emergency numbers\n🗺️ Popular destinations\n\nWhat would you like to know?";
  }

  public getSuggestedQuestions(): string[] {
    return [
      "What's the best time to visit Jharkhand?",
      "How do I reach Netarhat from Ranchi?",
      "What are the famous foods to try?",
      "Emergency contact numbers",
      "Best places to stay in Deoghar",
      "Transportation options in Jamshedpur"
    ];
  }
}

export const chatbotService = new SmartChatbotService();