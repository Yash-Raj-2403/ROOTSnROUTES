import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DevelopmentNotice from "@/components/DevelopmentNotice";
import { NavigationButtons } from "@/components/NavigationButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Car, Users, Camera, Mountain, Shield, Phone, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {

  const services = [
    {
      icon: MapPin,
      title: 'Tour Planning',
      description: 'Customized itineraries for your perfect Jharkhand adventure',
      features: ['Personalized routes', 'Local insights', 'Budget planning', 'Time optimization']
    },
    {
      icon: Calendar,
      title: 'Booking Services',
      description: 'Easy booking for accommodations, activities, and experiences',
      features: ['Hotel bookings', 'Activity reservations', 'Group bookings', 'Instant confirmation']
    },
    {
      icon: Car,
      title: 'Transportation',
      description: 'Reliable transport solutions for your entire journey',
      features: ['Car rentals', 'Driver services', 'Airport transfers', 'Local transport']
    },
    {
      icon: Users,
      title: 'Group Tours',
      description: 'Organized group experiences with professional guides',
      features: ['Expert guides', 'Group discounts', 'Safety assured', 'Cultural immersion']
    },
    {
      icon: Camera,
      title: 'Photography Tours',
      description: 'Capture the beauty of Jharkhand with expert photography guidance',
      features: ['Professional guides', 'Best locations', 'Equipment advice', 'Photo editing tips']
    },
    {
      icon: Mountain,
      title: 'Adventure Activities',
      description: 'Thrilling outdoor adventures in Jharkhand\'s natural landscapes',
      features: ['Rock climbing', 'Trekking expeditions', 'Water sports', 'Wildlife safaris']
    },
    {
      icon: Shield,
      title: 'Travel Insurance',
      description: 'Comprehensive travel insurance for peace of mind',
      features: ['Medical coverage', 'Trip cancellation', '24/7 support', 'Emergency assistance']
    },
    {
      icon: Phone,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for all your travel needs',
      features: ['Emergency hotline', 'Local assistance', 'Language support', 'Real-time updates']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <DevelopmentNotice />
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 mt-16 bg-forest-600">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Tour Packages & Services
          </h1>
          <p className="text-xl text-forest-300 max-w-3xl mx-auto">
            Comprehensive travel services to make your Jharkhand journey unforgettable
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300 bg-card/50 border-border">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-forest-100 dark:bg-forest-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-forest-600 dark:text-forest-400" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="text-sm text-left">
                          <span className="text-forest-600 dark:text-forest-400">✓</span> <span className="text-card-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-forest-600 dark:bg-forest-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-forest-100">
            Contact us today to discuss your travel needs and get a personalized quote
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ai-trip-planner">
              <Button size="lg" variant="default" className="bg-white text-forest-600 hover:bg-forest-50 font-semibold">
                Get AI Quote & Plan Trip
              </Button>
            </Link>
            <Link to="/support">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-forest-600">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <NavigationButtons
        showBackButton={true}
        customBackPath="/"
        showRelatedActions={true}
        relatedActions={[
          { label: "Start Trip Planning", path: "/ai-trip-planner", icon: Sparkles },
          { label: "Browse Destinations", path: "/destinations", icon: MapPin },
          { label: "Get Support", path: "/support", icon: Users }
        ]}
      />

      <Footer />
    </div>
  );
};

export default Services;