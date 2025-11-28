/**
 * Comprehensive Navigation Buttons Component
 * Provides consistent navigation buttons across all pages
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Home, MapPin, Calendar, Users, MessageCircle, Book, Camera, Utensils, Bed, Car, Sparkles, TrendingUp, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationButton {
  label: string;
  path: string;
  icon: React.ElementType;
  variant?: 'default' | 'outline' | 'secondary';
}

interface NavigationButtonsProps {
  showBackButton?: boolean;
  customBackPath?: string;
  showHomeButton?: boolean;
  showRelatedActions?: boolean;
  relatedActions?: NavigationButton[];
  className?: string;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  showBackButton = false,
  customBackPath,
  showHomeButton = false,
  showRelatedActions = false,
  relatedActions = [],
  className = ""
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (customBackPath) {
      navigate(customBackPath);
    } else {
      navigate(-1);
    }
  };

  const defaultActions: NavigationButton[] = [
    { label: "Explore Destinations", path: "/destinations", icon: MapPin },
    { label: "Plan Trip", path: "/ai-trip-planner", icon: Calendar },
    { label: "Find Stays", path: "/stays", icon: Bed },
    { label: "Restaurants", path: "/restaurants", icon: Utensils },
    { label: "Transport", path: "/transport", icon: Car },
    { label: "Community", path: "/community", icon: MessageCircle },
  ];

  const actionsToShow = relatedActions.length > 0 ? relatedActions : defaultActions;

  if (!showBackButton && !showHomeButton && !showRelatedActions) {
    return null;
  }

  return (
    <Card className={`bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10 ${className}`}>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          {/* Back and Home Buttons */}
          {(showBackButton || showHomeButton) && (
            <div className="flex gap-3 justify-center">
              {showBackButton && (
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              {showHomeButton && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              )}
            </div>
          )}

          {/* Related Actions */}
          {showRelatedActions && actionsToShow.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 text-center">
                Continue Exploring
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {actionsToShow.slice(0, 6).map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.path}
                      variant={action.variant || "outline"}
                      size="sm"
                      onClick={() => navigate(action.path)}
                      className="flex items-center gap-2 h-auto py-2 px-3"
                    >
                      <Icon className="w-3 h-3" />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Quick navigation components for specific use cases
export const BackToDestinations: React.FC = () => (
  <NavigationButtons 
    showBackButton
    customBackPath="/destinations"
    showRelatedActions
    relatedActions={[
      { label: "Plan Trip", path: "/ai-trip-planner", icon: Sparkles },
      { label: "Find Stays", path: "/stays", icon: Bed },
      { label: "Book Transport", path: "/transport", icon: Car },
      { label: "Check Weather", path: "/smart-weather", icon: Calendar },
      { label: "Join Community", path: "/community", icon: Users },
      { label: "View Analytics", path: "/analytics-dashboard", icon: TrendingUp },
    ]}
  />
);

export const BackToExplore: React.FC = () => (
  <NavigationButtons 
    showBackButton
    customBackPath="/explore"
    showRelatedActions
    relatedActions={[
      { label: "All Destinations", path: "/destinations", icon: MapPin },
      { label: "Cultural Sites", path: "/cultural-heritage", icon: Book },
      { label: "Natural Wonders", path: "/natural-wonders", icon: Camera },
      { label: "Authentic Stays", path: "/stays", icon: Bed },
      { label: "Local Food", path: "/restaurants", icon: Utensils },
      { label: "District Guide", path: "/districts", icon: MapPin },
    ]}
  />
);

export const BackToServices: React.FC = () => (
  <NavigationButtons 
    showBackButton
    customBackPath="/services"
    showRelatedActions
    relatedActions={[
      { label: "AI Trip Planner", path: "/ai-trip-planner", icon: Sparkles },
      { label: "Smart Booking", path: "/predictive-booking", icon: Calendar },
      { label: "Weather Insights", path: "/smart-weather", icon: TrendingUp },
      { label: "AR/VR Preview", path: "/ar-vr-preview", icon: Camera },
      { label: "Community Chat", path: "/community", icon: MessageCircle },
      { label: "Support", path: "/support", icon: Users },
    ]}
  />
);

export const ProfileNavigation: React.FC = () => (
  <NavigationButtons 
    showHomeButton
    showRelatedActions
    relatedActions={[
      { label: "My Bookings", path: "/my-bookings", icon: Calendar },
      { label: "Favorites", path: "/favorites", icon: MapPin },
      { label: "Settings", path: "/settings", icon: Settings },
      { label: "Support", path: "/support", icon: MessageCircle },
      { label: "Plan New Trip", path: "/ai-trip-planner", icon: Sparkles },
      { label: "Explore", path: "/explore", icon: Camera },
    ]}
  />
);

export default NavigationButtons;