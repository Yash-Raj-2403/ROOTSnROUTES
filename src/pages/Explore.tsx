import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DevelopmentNotice from "@/components/DevelopmentNotice";
import ExploreARVRSimple from "@/components/explore/ExploreARVRSimple";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  MapPin, 
  ShoppingBag, 
  Building, 
  UtensilsCrossed, 
  Car,
  ArrowRight,
  Star,
  Users,
  Phone
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

const Explore = () => {
  const { t } = useLanguage();

  const sections = [
    {
      id: 'destinations',
      title: 'Destinations',
      description: 'Discover breathtaking waterfalls, ancient temples, and natural wonders across Jharkhand',
      icon: MapPin,
      iconColor: 'text-primary',
      bgGradient: 'from-primary/10 to-accent/10',
      borderColor: 'border-primary/20',
      link: '/destinations',
      features: ['100+ Destinations ✨', 'Hidden Gems 🏔️', '24 Districts 🌍', 'Expert Guides 👨‍🏫'],
      stats: { primary: '100+', secondary: 'Places' }
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Connect with local artisans and discover authentic handicrafts, homestays, and experiences',
      icon: ShoppingBag,
      iconColor: 'text-accent',
      bgGradient: 'from-accent/10 to-secondary/10',
      borderColor: 'border-accent/20',
      link: '/marketplace',
      features: ['Local Artisans 🎨', 'Authentic Crafts 🏺', 'Homestays 🏡', 'Cultural Tours 🎭'],
      stats: { primary: '500+', secondary: 'Artisans' }
    },
    {
      id: 'hotels',
      title: 'Hotels',
      description: 'Find comfortable accommodations from luxury resorts to cozy eco-lodges',
      icon: Building,
      iconColor: 'text-secondary-foreground',
      bgGradient: 'from-secondary/10 to-muted/10',
      borderColor: 'border-secondary/20',
      link: '/stays',
      features: ['Luxury Resorts 🏨', 'Eco Lodges 🌿', 'Budget Stays 💰', 'Local Recommendations ⭐'],
      stats: { primary: '50+', secondary: 'Hotels' }
    },
    {
      id: 'restaurants',
      title: 'Restaurants',
      description: 'Savor authentic Jharkhandi cuisine and traditional tribal delicacies',
      icon: UtensilsCrossed,
      iconColor: 'text-orange-600',
      bgGradient: 'from-orange-500/10 to-red-500/10',
      borderColor: 'border-orange-200',
      link: '/restaurants',
      features: ['Local Cuisine 🍛', 'Tribal Delicacies 🥘', 'Traditional Recipes 📜', 'Food Tours 🍽️'],
      stats: { primary: '25+', secondary: 'Restaurants' }
    },
    {
      id: 'transportation',
      title: 'Transportation',
      description: 'Plan your journey with reliable transport options and local guidance',
      icon: Car,
      iconColor: 'text-muted-foreground',
      bgGradient: 'from-muted/10 to-card/10',
      borderColor: 'border-muted/20',
      link: '/transport',
      features: ['Bus Services 🚌', 'Car Rentals 🚗', 'Local Guides 👨‍💼', 'Route Planning 🗺️'],
      stats: { primary: '24/7', secondary: 'Support' }
    }
  ];

  return (
    <main>
      <DevelopmentNotice />
      <Header />
      
      {/* Hero Section - Better Content Colors & Sizing */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-hero relative overflow-hidden">
        {/* Enhanced background overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20 dark:bg-black/30"></div>
        <div className="container mx-auto px-6 relative z-10 py-16">
          <div className="text-center max-w-6xl mx-auto">
            <div className="space-y-10">
              {/* Better sized and colored heading */}
              <div className="space-y-6">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-2xl">
                  Explore Jharkhand ✨
                </h1>
                <p className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed font-medium text-white/95 drop-shadow-lg">
                  Your gateway to discovering the authentic beauty of Jharkhand! 🌈 
                  From majestic destinations to local experiences, find everything 
                  you need for an unforgettable journey! 💫
                </p>
              </div>
              
              {/* Better sized stats grid */}
              <div className="pt-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                  <div className="text-center bg-card/25 backdrop-blur-lg rounded-xl p-5 border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-2xl mb-2">100+</div>
                    <div className="text-sm md:text-base text-white/95 font-medium drop-shadow-lg">✨ Destinations</div>
                  </div>
                  <div className="text-center bg-card/25 backdrop-blur-lg rounded-xl p-5 border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-2xl mb-2">500+</div>
                    <div className="text-sm md:text-base text-white/95 font-medium drop-shadow-lg">🎨 Local Partners</div>
                  </div>
                  <div className="text-center bg-card/25 backdrop-blur-lg rounded-xl p-5 border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-2xl mb-2">24</div>
                    <div className="text-sm md:text-base text-white/95 font-medium drop-shadow-lg">🏞️ Districts</div>
                  </div>
                  <div className="text-center bg-card/25 backdrop-blur-lg rounded-xl p-5 border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-2xl mb-2">10K+</div>
                    <div className="text-sm md:text-base text-white/95 font-medium drop-shadow-lg">💖 Happy Travelers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AR/VR Experience Section */}
      <section className="py-16 bg-emerald-50 dark:bg-emerald-950/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-emerald-900 dark:text-emerald-100">
              🥽 Immersive AR/VR Experience
            </h2>
            <p className="text-xl text-emerald-700 dark:text-emerald-300 max-w-3xl mx-auto">
              Step into the future of travel! Experience destinations, hotels, and local attractions in stunning 3D virtual reality or through augmented reality on your mobile device.
            </p>
          </div>
          
          {/* AR/VR Component */}
          <div className="max-w-6xl mx-auto">
            <ExploreARVRSimple 
              category="all" 
              onBack={() => {
                // Scroll back to the explore sections
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        </div>
      </section>

      {/* Main Sections - Keep original gradient-subtle theme */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Would You Like to Explore? 🎯</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose your adventure and discover the wonders that await you in Jharkhand
            </p>
          </div>

          {/* Section Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              
              return (
                <Card 
                  key={section.id} 
                  className={`overflow-hidden bg-card border-2 ${section.borderColor} hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1`}
                >
                  <div className={`p-8 bg-gradient-to-br ${section.bgGradient} relative`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    
                    {/* Icon and Stats */}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className="p-4 rounded-2xl bg-card shadow-lg border border-border">
                          <IconComponent className={`w-8 h-8 ${section.iconColor}`} />
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${section.iconColor}`}>
                            {section.stats.primary}
                          </div>
                          <div className="text-sm text-foreground font-medium opacity-80">
                            {section.stats.secondary}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {section.description}
                        </p>

                        {/* Features - Enhanced with emojis */}
                        <div className="grid grid-cols-2 gap-2">
                          {section.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${section.iconColor.replace('text-', 'bg-')}`}></div>
                              <span className="text-sm text-foreground font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* CTA Button */}
                        <div className="pt-4">
                          <Link to={section.link} className="block">
                            <Button 
                              className="w-full group-hover:scale-105 transition-transform duration-300"
                              variant="default"
                            >
                              Explore {section.title}
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 bg-background border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Quick Access 🚀</h2>
            <p className="text-muted-foreground">Popular actions and services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Emergency Support */}
            <Card className="p-6 text-center bg-destructive/5 border-destructive/20 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-6 h-6 text-destructive" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-destructive">Emergency Help 🆘</h3>
              <p className="text-sm text-muted-foreground mb-4 font-medium">24/7 support for travelers in need</p>
              <Link to="/support">
                <Button variant="outline" size="sm" className="border-destructive/40 text-destructive hover:bg-destructive/10 font-semibold">
                  Get Help
                </Button>
              </Link>
            </Card>

            {/* AI Trip Planner */}
            <Card className="p-6 text-center bg-primary/5 border-primary/20 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Star className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-primary">AI Trip Planner 🤖</h3>
              <p className="text-sm text-muted-foreground mb-4 font-medium">Personalized itinerary planning powered by AI</p>
              <Link to="/ai-trip-planner">
                <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10 font-semibold">
                  Plan Trip
                </Button>
              </Link>
            </Card>

            {/* Community Chat */}
            <Card className="p-6 text-center bg-accent/5 border-accent/20 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-accent" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-accent">Community 💬</h3>
              <p className="text-sm text-muted-foreground mb-4 font-medium">Connect with fellow travelers and locals</p>
              <Link to="/community-chat">
                <Button variant="outline" size="sm" className="border-accent/40 text-accent hover:bg-accent/10 font-semibold">
                  Join Chat
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action - Fixed for Both Light & Dark Mode */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        {/* Enhanced background overlay */}
        <div className="absolute inset-0 bg-black/15 dark:bg-black/40"></div>
        <div className="container mx-auto px-6 relative z-10">
          <Card className="cta-section-card p-12 md:p-16 text-center border-0 shadow-2xl relative overflow-hidden rounded-2xl max-w-4xl mx-auto">
            <div className="text-white relative z-10 space-y-8">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-2xl leading-tight">
                  Ready for Your Jharkhand Adventure? 🎉
                </h2>
                <p className="text-lg md:text-xl leading-relaxed text-white/95 font-medium drop-shadow-lg max-w-3xl mx-auto">
                  Join thousands of travelers who have discovered the magic of Jharkhand through our platform. 
                  Start planning your perfect journey today! ✨
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4">
                <Link to="/destinations" className="w-full sm:w-auto">
                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full sm:w-auto cta-primary-button font-semibold text-lg px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      🌟 Start Exploring Now
                    </span>
                  </Button>
                </Link>
                <Link to="/chatbot" className="w-full sm:w-auto">
                  <Button 
                    variant="hero-outline" 
                    size="lg" 
                    className="w-full sm:w-auto cta-secondary-button font-medium text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      🤖 Ask AI Assistant
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Explore;