import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExploreARVRSimple from "@/components/explore/ExploreARVRSimple";
import { useLanguage } from "@/hooks/useLanguage";
import { Eye, Camera, Monitor, Smartphone, Globe, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ARVRPreviewPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-amber-500/10" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Immersive Tourism Experience</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
                AR/VR Virtual Previews
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Experience Jharkhand's destinations, hotels, restaurants, and marketplace in stunning Virtual Reality or Augmented Reality before you visit.
              </p>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Monitor className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">VR Experience</h3>
                    <p className="text-sm text-muted-foreground">Immersive 360° virtual tours on desktop & VR headsets</p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">AR Preview</h3>
                    <p className="text-sm text-muted-foreground">View 3D models in your real environment via mobile</p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">360° Panoramas</h3>
                    <p className="text-sm text-muted-foreground">Explore stunning panoramic views of destinations</p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">Interactive 3D</h3>
                    <p className="text-sm text-muted-foreground">Interact with animated 3D objects and scenes</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* AR/VR Component Section */}
        <section className="py-12 bg-gradient-to-br from-background via-muted/5 to-background">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <ExploreARVRSimple 
                category="all"
                onBack={() => {
                  // Scroll back to top of page
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">How to Use AR/VR Previews</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Select Category</h4>
                      <p className="text-sm text-muted-foreground">Choose from destinations, marketplace, hotels, or restaurants</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Choose Mode</h4>
                      <p className="text-sm text-muted-foreground">Pick VR for immersive experience or AR for mobile viewing</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Interact & Explore</h4>
                      <p className="text-sm text-muted-foreground">Use mouse/touch to look around in VR or move your phone for AR</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Exit Anytime</h4>
                      <p className="text-sm text-muted-foreground">Click the exit button to return to normal view</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips Section */}
              <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Tips for Best Experience
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Use VR mode on desktop with a VR headset for the most immersive experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>AR mode works best on mobile devices with camera access enabled</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Ensure good lighting conditions when using AR features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Use headphones for better audio immersion in VR mode</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ARVRPreviewPage;
