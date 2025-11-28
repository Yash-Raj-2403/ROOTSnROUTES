import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Activity, Lock, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';
import LocalChat from '@/components/LocalChat';
import { NavigationButtons } from '@/components/NavigationButtons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DevelopmentNotice from '@/components/DevelopmentNotice';

const CommunityChat = () => {
  const { user, loading } = useAuth();
  const [activeUsers] = useState(2847);
  const [todayMessages] = useState(12459);
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (loading) {
    return (
      <>
        <DevelopmentNotice />
        <Header />
        <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <DevelopmentNotice />
        <Header />
        <div className="min-h-screen bg-background pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Community Chat
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Connect with fellow travelers and locals in Jharkhand
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <Card className="shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <Lock className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Login Required
                    </h2>
                    <p className="text-muted-foreground">
                      Please log in to access the community chat and connect with other travelers.
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowLoginModal(true)}
                    className="w-full"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login to Join Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <LoginModal 
            isOpen={showLoginModal} 
            onClose={() => setShowLoginModal(false)} 
          />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <DevelopmentNotice />
      <Header />
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Community Chat
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with fellow travelers and locals in Jharkhand
            </p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Live Community Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LocalChat />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5" />
                  Live Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Active Users
                    </span>
                    <Badge variant="secondary">{activeUsers.toLocaleString()}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      Today's Messages
                    </span>
                    <Badge variant="secondary">{todayMessages.toLocaleString()}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Actions */}
            <NavigationButtons 
              showBackButton
              showRelatedActions
              relatedActions={[
                { label: "Explore Destinations", path: "/destinations", icon: Activity },
                { label: "Plan Trip", path: "/ai-trip-planner", icon: MessageCircle },
                { label: "Find Stays", path: "/stays", icon: Users },
                { label: "Local Guides", path: "/local-guides", icon: Users },
                { label: "Support", path: "/support", icon: MessageCircle },
                { label: "My Profile", path: "/profile", icon: Users },
              ]}
            />
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default CommunityChat;