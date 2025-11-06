import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Camera, Play, VolumeX, Volume2, RotateCw } from 'lucide-react';

interface ARVRPreviewProps {
  destination: {
    name: string;
    images: string[];
    video360?: string;
    arModel?: string;
  };
}

const ARVRPreview: React.FC<ARVRPreviewProps> = ({ destination }) => {
  const [currentView, setCurrentView] = useState<'images' | '360' | 'ar'>('images');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const switchToNext = () => {
    setCurrentImageIndex((prev) => 
      prev >= destination.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Virtual Experience</span>
          <div className="flex gap-2">
            <Badge 
              variant={currentView === 'images' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setCurrentView('images')}
            >
              <Camera className="w-3 h-3 mr-1" />
              Gallery
            </Badge>
            <Badge 
              variant={currentView === '360' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setCurrentView('360')}
            >
              <Eye className="w-3 h-3 mr-1" />
              360° View
            </Badge>
            <Badge 
              variant={currentView === 'ar' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setCurrentView('ar')}
            >
              <RotateCw className="w-3 h-3 mr-1" />
              AR Preview
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {/* Image Gallery View */}
        {currentView === 'images' && (
          <div className="relative">
            <img
              src={destination.images[currentImageIndex]}
              alt={`${destination.name} view ${currentImageIndex + 1}`}
              className="w-full h-64 md:h-80 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-lg font-semibold">{destination.name}</h3>
                <p className="text-sm opacity-90">
                  Image {currentImageIndex + 1} of {destination.images.length}
                </p>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={switchToNext}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                Next View
              </Button>
            </div>
            <div className="absolute top-4 left-4 right-4 flex justify-center">
              <div className="flex gap-2">
                {destination.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 360° View */}
        {currentView === '360' && (
          <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
            <div className="flex items-center justify-center h-64 md:h-80">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                  <Eye className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">360° Virtual Tour</h3>
                <p className="text-muted-foreground mb-4 max-w-sm">
                  Experience {destination.name} in immersive 360° view. 
                  Look around using your mouse or device orientation.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="default"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    {isPlaying ? 'Pause Tour' : 'Start Tour'}
                  </Button>
                  <Button 
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-white/90 text-primary">
                360° Experience
              </Badge>
            </div>
          </div>
        )}

        {/* AR Preview */}
        {currentView === 'ar' && (
          <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
            <div className="flex items-center justify-center h-64 md:h-80 p-6">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-4 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Camera className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">AR Experience</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  View {destination.name} in augmented reality. 
                  Place 3D models in your real environment.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button 
                    variant="default"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => window.location.href = '/ar-vr-preview'}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Open AR Experience
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/ar-vr-preview'}
                  >
                    View 3D Model
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  📱 Works best on mobile devices with camera access
                </p>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                AR Ready
              </Badge>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="p-4 bg-muted/50 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Immersive virtual experience powered by AR/VR technology</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Virtual Tours
              </span>
              <span className="flex items-center gap-1">
                <Camera className="w-3 h-3" />
                AR Preview
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ARVRPreview;