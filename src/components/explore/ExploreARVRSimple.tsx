import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Eye, 
  Camera, 
  Smartphone, 
  Monitor, 
  X, 
  Play,
  AlertCircle,
  QrCode
} from 'lucide-react';

// Extend Window type for A-Frame
declare global {
  interface Window {
    AFRAME?: any;
  }
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-assets': any;
      'a-asset-item': any;
      'a-sky': any;
      'a-light': any;
      'a-text': any;
      'a-box': any;
      'a-cylinder': any;
      'a-sphere': any;
      'a-plane': any;
      'a-camera': any;
      'a-entity': any;
      'a-marker': any;
      'model-viewer': any;
    }
  }
}

interface ExploreARVRSimpleProps {
  category?: 'destinations' | 'marketplace' | 'restaurants' | 'hotels' | 'all';
  onBack?: () => void; // Optional callback to navigate back
}

const ExploreARVRSimple: React.FC<ExploreARVRSimpleProps> = ({ category = 'all', onBack }) => {
  const [isVRActive, setIsVRActive] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [aframeLoaded, setAframeLoaded] = useState(false);
  const [vrReady, setVrReady] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<string>('destination');
  const sceneRef = useRef<HTMLDivElement>(null);

  // Sample AR/VR content with proper panorama URLs and better 3D models
  const experiences = {
    destination: {
      title: '🏔️ Betla National Park',
      description: 'Experience the wildlife sanctuary in immersive VR with 360° forest views',
      panoramaUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=4096&h=2048&fit=crop&q=90',
      modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BrainStem/glTF-Binary/BrainStem.glb',
      arModel: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb',
      category: 'Nature & Wildlife'
    },
    marketplace: {
      title: '🎨 Dokra Art Gallery',
      description: 'Explore traditional brass artifacts in 3D with virtual marketplace tour',
      panoramaUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=4096&h=2048&fit=crop&q=90',
      modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb',
      arModel: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
      category: 'Art & Crafts'
    },
    restaurant: {
      title: '🍽️ Traditional Kitchen',
      description: 'Virtual tour of authentic Jharkhandi cuisine and dining experience',
      panoramaUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=4096&h=2048&fit=crop&q=90',
      modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb',
      arModel: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
      category: 'Food & Dining'
    },
    hotel: {
      title: '🏨 Heritage Stay',
      description: 'Preview luxury accommodations in VR with 360° room tours',
      panoramaUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=4096&h=2048&fit=crop&q=90',
      modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Chair/glTF-Binary/Chair.glb',
      arModel: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      category: 'Accommodation'
    }
  };

  // Load A-Frame and Model Viewer dynamically
  useEffect(() => {
    const loadLibraries = async () => {
      try {
        // Check if A-Frame is already loaded (from CDN or package)
        if (typeof window !== 'undefined') {
          if (!window.AFRAME) {
            console.log('🔄 A-Frame not found, loading from CDN...');
            
            // Load A-Frame from CDN as fallback
            const aframeScript = document.createElement('script');
            aframeScript.src = 'https://aframe.io/releases/1.6.0/aframe.min.js';
            aframeScript.async = false;
            
            aframeScript.onload = () => {
              console.log('✅ A-Frame loaded from CDN successfully');
              setAframeLoaded(true);
            };
            
            aframeScript.onerror = async () => {
              console.warn('⚠️ CDN failed, trying package import...');
              try {
                await import('aframe');
                console.log('✅ A-Frame loaded from package');
                setAframeLoaded(true);
              } catch (error) {
                console.error('❌ Failed to load A-Frame:', error);
                setAframeLoaded(true); // Still show interface
              }
            };
            
            document.head.appendChild(aframeScript);
          } else {
            console.log('✅ A-Frame already loaded');
            setAframeLoaded(true);
          }
          
          // Model Viewer is already in index.html, just verify
          if (!customElements.get('model-viewer')) {
            console.log('✅ Model Viewer will load from index.html');
          } else {
            console.log('✅ Model Viewer already available');
          }
        }
      } catch (error) {
        console.error('❌ Failed to load libraries:', error);
        setAframeLoaded(true); // Still show interface
      }
    };

    loadLibraries();
    
    // Cleanup function when component unmounts
    return () => {
      console.log('🧹 Cleaning up AR/VR component');
      try {
        // Clean up VR scene if active
        const scene = document.querySelector('a-scene');
        if (scene && scene.is?.('vr-mode')) {
          scene.exitVR();
        }
        
        // Clean up AR if active
        const modelViewer = document.querySelector('model-viewer') as any;
        if (modelViewer && typeof modelViewer.dismissAR === 'function') {
          modelViewer.dismissAR();
        }
      } catch (error) {
        console.error('❌ Cleanup error:', error);
      }
    };
  }, []);

  // Monitor VR scene readiness
  useEffect(() => {
    if (isVRActive && aframeLoaded) {
      const checkVRReady = () => {
        const scene = document.querySelector('a-scene');
        if (scene && scene.hasLoaded) {
          setVrReady(true);
          console.log('✅ VR Scene is ready');
        } else {
          setTimeout(checkVRReady, 100);
        }
      };
      checkVRReady();
    } else {
      setVrReady(false);
    }
  }, [isVRActive, aframeLoaded]);

  // Check URL parameters for auto-launch AR from QR code scan
  useEffect(() => {
    if (!aframeLoaded) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const experience = urlParams.get('experience');
    
    if (mode === 'ar' && experience) {
      setSelectedExperience(experience);
      // Auto-launch AR on mobile devices
      const isMobile = navigator.userAgent.match(/Mobile|Android|iPhone|iPad/);
      if (isMobile) {
        setTimeout(() => {
          setIsARActive(true);
        }, 1000); // Small delay to ensure everything is loaded
      }
    }
  }, [aframeLoaded]);

  // Handle keyboard escape to exit immersive mode
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && (isVRActive || isARActive || showQRModal)) {
        console.log('⌨️  Escape key pressed - exiting immersive mode');
        exitImmersive();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isVRActive, isARActive, showQRModal]);

  const enterVR = () => {
    if (!aframeLoaded) {
      alert('VR is still loading, please wait...');
      return;
    }
    const exp = experiences[selectedExperience as keyof typeof experiences];
    console.log('🚀 Entering VR mode');
    console.log('📍 Experience:', selectedExperience);
    console.log('🏷️  Title:', exp.title);
    console.log('📸 Panorama URL:', exp.panoramaUrl);
    console.log('🎨 Category:', exp.category);
    setIsVRActive(true);
  };

  const enterAR = () => {
    if (!aframeLoaded) {
      alert('AR is still loading, please wait...');
      return;
    }
    
    const exp = experiences[selectedExperience as keyof typeof experiences];
    console.log('📱 Entering AR mode');
    console.log('📍 Experience:', selectedExperience);
    console.log('🏷️  Title:', exp.title);
    console.log('🎨 Category:', exp.category);
    
    // Check if on mobile device
    const isMobile = navigator.userAgent.match(/Mobile|Android|iPhone|iPad/);
    
    if (isMobile) {
      console.log('📱 Mobile device detected - launching AR directly');
      setIsARActive(true);
    } else {
      console.log('💻 Desktop detected - showing QR code');
      setShowQRModal(true);
    }
  };

  const exitImmersive = () => {
    console.log('🚪 Exiting immersive mode');
    
    try {
      // Clean up VR scene
      if (isVRActive) {
        const scene = document.querySelector('a-scene');
        if (scene) {
          // Exit VR mode if active
          if (scene.is('vr-mode')) {
            scene.exitVR();
          }
          console.log('✅ VR scene cleaned up');
        }
      }
      
      // Clean up AR
      if (isARActive) {
        const modelViewer = document.querySelector('model-viewer') as any;
        if (modelViewer) {
          // Stop any AR sessions
          if (typeof modelViewer.dismissAR === 'function') {
            modelViewer.dismissAR();
          }
          console.log('✅ AR session cleaned up');
        }
      }
      
      // Reset all states
      setIsVRActive(false);
      setIsARActive(false);
      setShowQRModal(false);
      setVrReady(false);
      
      // Clear URL parameters if they exist
      const url = new URL(window.location.href);
      if (url.searchParams.has('mode')) {
        url.searchParams.delete('mode');
        url.searchParams.delete('experience');
        window.history.replaceState({}, '', url.toString());
      }
      
      console.log('✅ Successfully exited immersive mode');
      
      // Call onBack callback if provided
      if (onBack) {
        console.log('📍 Navigating back to previous page');
        setTimeout(() => onBack(), 100); // Small delay to ensure cleanup completes
      }
    } catch (error) {
      console.error('❌ Error during exit:', error);
      // Force reset states even if cleanup fails
      setIsVRActive(false);
      setIsARActive(false);
      setShowQRModal(false);
      setVrReady(false);
      
      // Still call onBack if provided
      if (onBack) {
        setTimeout(() => onBack(), 100);
      }
    }
  };

  const currentExperience = experiences[selectedExperience as keyof typeof experiences];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Experience Selection */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Choose Your Experience</h3>
          <p className="text-muted-foreground">Select a category to explore in VR or AR</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(experiences).map(([key, exp]) => (
            <Button
              key={key}
              variant={selectedExperience === key ? 'default' : 'outline'}
              onClick={() => setSelectedExperience(key)}
              className="h-auto p-4 text-center"
            >
              <div>
                <div className="text-lg mb-1">{exp.title.split(' ')[0]}</div>
                <div className="text-xs">{exp.title.split(' ').slice(1).join(' ')}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Experience Preview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            {currentExperience.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{currentExperience.description}</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* VR Mode */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Virtual Reality Mode
              </h4>
              <p className="text-sm text-muted-foreground">
                Immersive 360° experience. Works on desktop and VR headsets.
              </p>
              <Button 
                onClick={enterVR} 
                className="w-full"
                disabled={!aframeLoaded}
              >
                {aframeLoaded ? (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Enter VR Experience
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Loading VR...
                  </>
                )}
              </Button>
            </div>

            {/* AR Mode */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Augmented Reality Mode
              </h4>
              <p className="text-sm text-muted-foreground">
                View 3D models in your real environment. Best on mobile devices.
              </p>
              <Button 
                onClick={enterAR} 
                variant="outline" 
                className="w-full"
                disabled={!aframeLoaded}
              >
                {aframeLoaded ? (
                  <>
                    <Smartphone className="w-4 h-4 mr-2" />
                    Enter AR Experience
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Loading AR...
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* A-Frame VR Scene */}
      {isVRActive && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Loading indicator */}
          {!vrReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-lg">Loading VR Experience...</p>
                <p className="text-sm text-gray-400 mt-2">Please wait while we prepare your virtual tour</p>
              </div>
            </div>
          )}
          
          <div className="absolute top-4 right-4 z-10">
            <Button onClick={exitImmersive} variant="secondary" size="sm">
              <X className="w-4 h-4 mr-2" />
              Exit VR
            </Button>
          </div>
          
          <div ref={sceneRef} className="w-full h-full">
            <a-scene 
              vr-mode-ui="enabled: true" 
              embedded
              style={{ width: '100%', height: '100%' }}
            >
              {/* Assets */}
              <a-assets>
                <img 
                  id="panorama" 
                  src={currentExperience.panoramaUrl} 
                  crossOrigin="anonymous" 
                />
                <a-asset-item 
                  id="model" 
                  src={currentExperience.modelUrl}
                />
              </a-assets>

              {/* Sky */}
              <a-sky src="#panorama" rotation="0 -130 0" />

              {/* Lighting */}
              <a-light type="ambient" color="#404040" intensity="0.4" />
              <a-light type="directional" position="0 1 0" color="#ffffff" intensity="0.6" />

              {/* Interactive Elements */}
              <a-text 
                position="0 4 -3" 
                value={`Welcome to ${currentExperience.title}`}
                color="#ffffff"
                align="center"
                geometry="primitive: plane; width: 6; height: 1"
                material="color: rgba(0,0,0,0.7); opacity: 0.8"
              />
              
              {/* Display the 3D Model */}
              <a-entity
                gltf-model="#model"
                position="0 1 -5"
                scale="0.5 0.5 0.5"
                animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear"
              />
              
              {/* Animated 3D Objects */}
              <a-box 
                position="-2 0.5 -3" 
                rotation="0 45 0" 
                color="#4CC3D9"
                animation="property: rotation; to: 0 405 0; loop: true; dur: 10000"
              />
              
              <a-cylinder 
                position="2 0.75 -3" 
                radius="0.5" 
                height="1.5" 
                color="#EF2D5E"
                animation="property: position; to: 2 1.5 -3; dir: alternate; dur: 2000; loop: true"
              />

              <a-sphere 
                position="0 1.25 -5" 
                radius="1" 
                color="#FFC65D"
                animation="property: rotation; to: 360 0 0; loop: true; dur: 5000"
              />

              {/* Ground */}
              <a-plane 
                position="0 0 -4" 
                rotation="-90 0 0" 
                width="20" 
                height="20" 
                color="#7BC8A4" 
                opacity="0.3"
              />

              {/* Camera with controls */}
              <a-camera look-controls wasd-controls position="0 1.6 0" />
            </a-scene>
          </div>
        </div>
      )}

      {/* A-Frame AR Scene */}
      {isARActive && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* AR Instructions Banner */}
          <div className="absolute top-0 left-0 right-0 bg-black/90 p-4 z-10">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">📱 AR View</h3>
                <p className="text-gray-300 text-sm">Tap and drag to rotate • Pinch to zoom</p>
              </div>
              <Button onClick={exitImmersive} variant="secondary" size="sm">
                <X className="w-4 h-4 mr-2" />
                Exit AR
              </Button>
            </div>
          </div>
          
          {/* 3D Model Viewer with AR Support */}
          <div className="w-full h-full pt-16">
            <model-viewer
              src={currentExperience.arModel}
              alt={currentExperience.title}
              ar
              ar-modes="webxr scene-viewer quick-look"
              camera-controls
              touch-action="pan-y"
              auto-rotate
              shadow-intensity="1"
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)'
              }}
            >
              {/* AR Button */}
              <button
                slot="ar-button"
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '12px 32px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📱 View in Your Space (AR)
              </button>
              
              {/* Loading indicator */}
              <div slot="poster" style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)'
              }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔄</div>
                  <div>Loading 3D Model...</div>
                </div>
              </div>
            </model-viewer>
            
            {/* Info overlay */}
            <div className="absolute bottom-24 left-0 right-0 px-4">
              <Card className="bg-black/60 backdrop-blur-md border-primary/30 max-w-md mx-auto">
                <CardContent className="p-4">
                  <h4 className="text-white font-bold mb-1">{currentExperience.title}</h4>
                  <p className="text-gray-300 text-sm mb-2">{currentExperience.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      3D Model Ready
                    </span>
                    <span>•</span>
                    <span>Tap button below for full AR</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Status indicator */}
      <div className="text-center mt-4">
        <Badge variant={aframeLoaded ? 'default' : 'secondary'}>
          {aframeLoaded ? '✅ AR/VR Ready' : '⏳ Loading AR/VR Engine...'}
        </Badge>
      </div>

      {/* QR Code Modal for AR on Mobile */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background border border-primary/20 rounded-xl shadow-2xl max-w-md w-full my-8 relative max-h-[90vh] overflow-y-auto">
            {/* Scroll indicator at top */}
            <div className="sticky top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse z-10"></div>
            
            <div className="p-8">
              {/* Close button */}
              <Button
                onClick={() => setShowQRModal(false)}
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10"
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Modal content */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2">Scan to View in AR</h3>
                <p className="text-muted-foreground mb-6">
                  Open your mobile camera and scan this QR code to experience {currentExperience.title} in Augmented Reality
                </p>

                {/* QR Code */}
                <div className="bg-white p-6 rounded-lg inline-block mb-6 shadow-lg">
                  <QRCodeSVG
                    value={`${window.location.origin}/ar-vr-preview?mode=ar&experience=${selectedExperience}`}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                {/* Instructions */}
                <div className="space-y-3 text-left bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-center mb-3">How to use:</h4>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      1
                    </div>
                    <p>Open your phone's camera app</p>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      2
                    </div>
                    <p>Point at the QR code above</p>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      3
                    </div>
                    <p>Tap the notification to open AR view</p>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                      4
                    </div>
                    <p>Move your phone to explore in 3D</p>
                  </div>
                </div>

                {/* Mobile app suggestion */}
                <div className="mt-6 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Works best with AR-enabled mobile browsers</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Scroll indicator at bottom */}
            <div className="sticky bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreARVRSimple;