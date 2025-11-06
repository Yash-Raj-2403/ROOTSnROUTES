import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Send, 
  MessageSquare, 
  Users, 
  MapPin, 
  Heart, 
  Reply, 
  Clock,
  Smile,
  Image,
  MoreVertical
} from 'lucide-react';
import { messageService, ChatMessage } from '@/services/messageService';
import { allDestinations } from '@/data/completeDestinations';

// Avatar colors for different users - moved outside component to avoid dependency issues
const AVATAR_COLORS = [
  'bg-red-500', 'bg-emerald-500', 'bg-green-500', 'bg-yellow-500',
  'bg-orange-500', 'bg-pink-500', 'bg-cyan-500', 'bg-teal-500'
];

interface LocalChatProps {
  destinationId?: string;
  destinationName?: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

const LocalChat: React.FC<LocalChatProps> = ({ destinationId, destinationName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | undefined>(destinationId);
  const [isLoading, setIsLoading] = useState(false);
  const [onlineUsers] = useState<User[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Generate a consistent user session
  useEffect(() => {
    
    const generateUser = () => {
      const names = [
        'Travel Explorer', 'Nature Lover', 'Adventure Seeker', 'Culture Enthusiast',
        'Photo Hunter', 'Solo Traveler', 'Family Vacationer', 'Mountain Climber',
        'Wanderer', 'Explorer', 'Tourist', 'Backpacker'
      ];
      
      const userId = localStorage.getItem('chat_user_id') || 
        'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chat_user_id', userId);
      
      const userName = localStorage.getItem('chat_user_name') || 
        names[Math.floor(Math.random() * names.length)] + '_' + userId.substr(-3);
      localStorage.setItem('chat_user_name', userName);

      const colorIndex = parseInt(userId.substr(-1), 16) % AVATAR_COLORS.length;
      
      return {
        id: userId,
        name: userName,
        avatar: userName.charAt(0).toUpperCase(),
        color: AVATAR_COLORS[colorIndex]
      };
    };

    setCurrentUser(generateUser());
  }, []);

  // Load messages when component mounts or destination changes
  const loadMessages = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const chatMessages = await messageService.getChatMessages(selectedDestination, 100);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDestination]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
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
  }, [messages, scrollToBottom]);

  const scrollToBottomOld = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    const messageData = {
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_avatar: currentUser.avatar,
      destination_id: selectedDestination,
      destination_name: selectedDestination ? 
        allDestinations.find(d => d.id.toString() === selectedDestination)?.name : 
        undefined,
      message: newMessage.trim(),
      message_type: 'text' as const
    };

    try {
      const sentMessage = await messageService.submitChatMessage(messageData);
      if (sentMessage) {
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getDestinationOptions = () => {
    const uniqueDestinations = allDestinations.reduce((acc, dest) => {
      if (!acc.find(d => d.name === dest.district)) {
        acc.push({ id: dest.district, name: dest.district, type: 'district' });
      }
      return acc;
    }, [] as Array<{ id: string; name: string; type: string }>);

    return [
      { id: 'general', name: 'General Chat', type: 'general' },
      ...uniqueDestinations.slice(0, 10),
      ...allDestinations.slice(0, 5).map(dest => ({
        id: dest.id.toString(),
        name: dest.name,
        type: 'destination'
      }))
    ];
  };

  const getCurrentRoomName = () => {
    if (!selectedDestination || selectedDestination === 'general') return 'General Travel Chat';
    
    const destination = allDestinations.find(d => d.id.toString() === selectedDestination);
    if (destination) return `${destination.name} Chat`;
    
    return `${selectedDestination} District Chat`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="text-primary" />
              Local Travel Chat
            </CardTitle>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {onlineUsers.length + 1} online
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select 
                value={selectedDestination || 'general'} 
                onValueChange={setSelectedDestination}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose chat room" />
                </SelectTrigger>
                <SelectContent>
                  {getDestinationOptions().map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      <div className="flex items-center gap-2">
                        {option.type === 'general' && <MessageSquare size={16} />}
                        {option.type === 'district' && <MapPin size={16} />}
                        {option.type === 'destination' && <MapPin size={16} />}
                        <span>{option.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin size={12} />
              {getCurrentRoomName()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4"
            ref={messagesContainerRef}
            onScroll={handleScroll}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
                <p className="text-sm mt-2">
                  Share your travel experiences and connect with fellow travelers.
                </p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isCurrentUser = message.user_id === currentUser?.id;
                const showAvatar = index === 0 || 
                  messages[index - 1].user_id !== message.user_id;
                
                return (
                  <div
                    key={message.id || index}
                    className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {showAvatar && !isCurrentUser && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                        AVATAR_COLORS[parseInt(message.user_id.substr(-1), 16) % AVATAR_COLORS.length]
                      }`}>
                        {message.user_avatar || message.user_name.charAt(0)}
                      </div>
                    )}
                    
                    <div className={`flex-1 max-w-xs md:max-w-md ${
                      isCurrentUser ? 'ml-12' : 'mr-12'
                    }`}>
                      {showAvatar && (
                        <div className={`flex items-center gap-2 mb-1 ${
                          isCurrentUser ? 'justify-end' : 'justify-start'
                        }`}>
                          <span className="text-sm font-semibold text-muted-foreground">
                            {isCurrentUser ? 'You' : message.user_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {message.created_at && formatTime(message.created_at)}
                          </span>
                        </div>
                      )}
                      
                      <div className={`p-3 rounded-lg ${
                        isCurrentUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.message}</p>
                      </div>
                      
                      {/* Message Actions */}
                      <div className={`flex items-center gap-2 mt-1 ${
                        isCurrentUser ? 'justify-end' : 'justify-start'
                      }`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                          onClick={() => setReplyingTo(message)}
                        >
                          <Reply size={12} className="mr-1" />
                          Reply
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                        >
                          <Heart size={12} className="mr-1" />
                          {message.likes || 0}
                        </Button>
                      </div>
                    </div>
                    
                    {showAvatar && isCurrentUser && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                        currentUser?.color || AVATAR_COLORS[0]
                      }`}>
                        {currentUser?.avatar || 'U'}
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Preview */}
          {replyingTo && (
            <div className="px-4 py-2 bg-muted border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Reply size={14} />
                  <span>Replying to <strong>{replyingTo.user_name}</strong></span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setReplyingTo(null)}
                  className="h-6 px-2"
                >
                  ×
                </Button>
              </div>
              <p className="text-sm text-muted-foreground truncate mt-1">
                {replyingTo.message}
              </p>
            </div>
          )}

          {/* Input Area */}
          <div className="flex-shrink-0 p-4 border-t">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${getCurrentRoomName()}...`}
                  className="resize-none"
                />
              </div>
              
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  disabled
                  title="Coming soon"
                >
                  <Smile size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled
                  title="Coming soon"
                >
                  <Image size={16} />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send • Be respectful and follow community guidelines
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Guidelines */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <MessageSquare size={16} />
            Community Guidelines
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p>• Be respectful and friendly to all travelers</p>
              <p>• Share genuine experiences and helpful tips</p>
              <p>• Keep discussions relevant to travel and destinations</p>
            </div>
            <div>
              <p>• No spam, advertising, or inappropriate content</p>
              <p>• Protect your privacy - don't share personal details</p>
              <p>• Report any issues to moderators</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalChat;