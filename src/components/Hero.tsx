import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import VideoBackground from "@/components/VideoBackground";
import { useEffect, useState, memo } from "react";
import { useLanguage } from "@/hooks/useLanguage";

const Hero = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section 
      className="relative w-full flex items-start md:items-center justify-center overflow-hidden overflow-x-hidden"
      style={{ 
        minHeight: '100vh'
      }}
    >
      {/* Fullscreen Animated Background with Waterfall/Forest */}
      <VideoBackground
        videoSrc="/videos/hero_section.mp4"
        className="absolute inset-0 w-full h-full"
        autoPlay={true}
        muted={true}
        overlay={false}
        overlayOpacity={0}
        showControls={false}
      >
        {/* Minimal overlay only for text readability */}
        <div className="absolute inset-0 bg-black/10 z-10" />
        
        <div className="relative z-20 w-full flex flex-col justify-center px-4 py-8 md:py-12 pt-20 md:pt-24">
          {/* Main Hero Content - Centered */}
          <div className={`text-center max-w-5xl mx-auto transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            
            {/* Tagline */}
            <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <p className="text-emerald-300/80 text-base md:text-lg font-medium tracking-wide uppercase">
                {t('hero.tagline')}
              </p>
            </div>
            
            {/* Hero Headline */}
            <div className="mb-8 md:mb-12">
              <h1 className="mb-6 md:mb-8 leading-tight animate-fade-in-up text-white" style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '700',
                fontSize: 'clamp(1.75rem, 5vw, 3.5rem)',
                textShadow: '0px 2px 8px rgba(0, 0, 0, 0.8), 0px 4px 16px rgba(0, 0, 0, 0.6)',
                letterSpacing: '-0.02em',
                lineHeight: '1.2',
                filter: 'drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5))',
                animationDelay: '0.2s',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '100%'
              }}>
                {t('hero.title')}
              </h1>
              
              {/* Subtext */}
              <p className="text-base md:text-xl max-w-3xl mx-auto leading-relaxed text-white/90 font-medium drop-shadow-lg px-4" style={{ animationDelay: '0.3s' }}>
                {t('hero.description')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="relative z-30 flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 md:mb-20 px-4" style={{ animationDelay: '0.6s' }}>
              {/* Primary CTA - Forest & Autumn theme */}
              <Link to="/destinations" className="w-full sm:w-auto relative z-30">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-400 dark:hover:to-emerald-400 text-white font-semibold px-10 py-4 rounded-full shadow-xl transition-all duration-300 ease-out hover:scale-105 hover:shadow-green-500/40 active:scale-95 text-base md:text-lg z-30"
                >
                  <span className="relative z-40 flex items-center justify-center gap-3">
                    {t('hero.exploreButton')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
              
              {/* Secondary CTA - Autumn accent */}
              <Link to="/ai-trip-planner" className="w-full sm:w-auto relative z-30">
                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto group relative overflow-hidden bg-amber-50/10 dark:bg-amber-900/10 border-2 border-amber-100/40 dark:border-amber-400/40 hover:border-amber-200/60 dark:hover:border-amber-300/60 text-white hover:text-white font-medium px-8 py-4 rounded-full backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 ease-out hover:scale-105 hover:bg-amber-100/15 dark:hover:bg-amber-800/15 active:scale-95 text-base md:text-lg z-30"
                >
                  <span className="relative z-40 flex items-center justify-center gap-3">
                    {t('hero.aiPlanningButton')}
                    <Sparkles className="w-5 h-5" />
                  </span>
                </Button>
              </Link>
            </div>
            
            {/* Feature Cards Section */}
            <div className={`relative z-30 animate-fade-in-up mt-8 md:mt-12 pb-16 md:pb-24 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '1.0s' }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 max-w-5xl mx-auto px-4">
                {/* Natural Wonders Card */}
                <Link to="/natural-wonders" className="group block relative z-30">
                  <div className="text-center p-6 rounded-2xl bg-white/15 border border-white/30 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/50 hover:border-emerald-400/60 hover:bg-white/25 relative overflow-hidden z-30">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 backdrop-blur-3xl"></div>
                    <div className="relative z-10">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-2xl">🏞️</div>
                      <h3 className="font-bold text-white text-xl mb-2 group-hover:text-emerald-100 transition-colors duration-300 tracking-wide drop-shadow-lg">
                        Natural Wonders
                      </h3>
                      <p className="text-white/95 group-hover:text-white transition-colors duration-300 text-base font-medium drop-shadow-md">
                        Waterfalls & Forests
                      </p>
                    </div>
                  </div>
                </Link>
                
                {/* Cultural Heritage Card */}
                <Link to="/cultural-heritage" className="group block relative z-30">
                  <div className="text-center p-6 rounded-2xl bg-white/15 border border-white/30 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50 hover:border-orange-400/60 hover:bg-white/25 relative overflow-hidden z-30">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-amber-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 backdrop-blur-3xl"></div>
                    <div className="relative z-10">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-2xl">🎨</div>
                      <h3 className="font-bold text-white text-xl mb-2 group-hover:text-orange-100 transition-colors duration-300 tracking-wide drop-shadow-lg">
                        Cultural Heritage
                      </h3>
                      <p className="text-white/95 group-hover:text-white transition-colors duration-300 text-base font-medium drop-shadow-md">
                        Art & Traditions
                      </p>
                    </div>
                  </div>
                </Link>
                
                {/* Authentic Stays Card */}
                <Link to="/stays" className="group block relative z-30">
                  <div className="text-center p-6 rounded-2xl bg-white/15 border border-white/30 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 hover:border-blue-400/60 hover:bg-white/25 relative overflow-hidden z-30">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 backdrop-blur-3xl"></div>
                    <div className="relative z-10">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-2xl">🏡</div>
                      <h3 className="font-bold text-white text-xl mb-2 group-hover:text-blue-100 transition-colors duration-300 tracking-wide drop-shadow-lg">
                        Authentic Stays
                      </h3>
                      <p className="text-white/95 group-hover:text-white transition-colors duration-300 text-base font-medium drop-shadow-md">
                        Eco-lodges
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </VideoBackground>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;