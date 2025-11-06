import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Facebook, Youtube, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import NewsletterService from "@/services/newsletterService";
import CommunityChatLink from "./CommunityChatLink";
import Logo from "@/components/Logo";

const Footer = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribing(true);
    try {
      // Check if Supabase is available
      if (!supabase) {
        throw new Error('Database connection unavailable');
      }

      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([
          {
            email: email.trim(),
            subscribed_at: new Date().toISOString(),
            source: 'footer',
          }
        ]);

      if (error) {
        console.error('Supabase error:', error);
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already subscribed!",
            description: "This email is already subscribed to our newsletter.",
            variant: "default",
          });
          setEmail("");
          return;
        } else if (error.code === '42P01') { // Table doesn't exist
          // Fall back to local storage
          throw new Error('Database table not found');
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully subscribed!",
          description: "Thank you for subscribing to our newsletter.",
          variant: "default",
        });
        setEmail("");
      }
    } catch (error) {
      console.error('Subscription error:', error);
      
      // Fallback to local storage
      try {
        // Check if already subscribed locally
        if (NewsletterService.isSubscribedLocally(email.trim())) {
          toast({
            title: "Already subscribed!",
            description: "This email is already subscribed to our newsletter.",
            variant: "default",
          });
          setEmail("");
          return;
        }

        // Save to local storage
        const saved = NewsletterService.saveToLocalStorage(email.trim(), 'footer');
        if (saved) {
          toast({
            title: "Subscription saved!",
            description: "Your subscription has been saved locally and will be processed when our service is available.",
            variant: "default",
          });
          setEmail("");
        } else {
          throw new Error('Failed to save locally');
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        
        // Final error handling
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('connection')) {
          toast({
            title: "Connection Error",
            description: "Please check your internet connection and try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Subscription failed",
            description: "Please try again later or contact support if the issue persists.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-gradient-subtle dark:bg-black border-t border-border">
      <div className="container mx-auto px-6 py-6">
        {/* Single Row Layout */}
        <div className="flex flex-wrap items-start justify-between gap-6 mb-6">{/* Brand Section */}
          {/* Brand Section */}
          <div className="flex-shrink-0 max-w-xs">
            <div className="mb-4">
              <Logo size={48} showText={true} />
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">rootsnroutesofficial@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">+91 9876543210</span>
              </div>
            </div>
          </div>

          {/* Explore Links */}
          <div className="flex-shrink-0">
            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center">
              <span className="bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">
                Explore
              </span>
            </h4>
            <div className="space-y-2">
              <Link to="/destinations" className="block text-muted-foreground hover:text-primary transition-colors">
                Destinations
              </Link>
              <Link to="/marketplace" className="block text-muted-foreground hover:text-primary transition-colors">
                Marketplace
              </Link>
              <Link to="/transport" className="block text-muted-foreground hover:text-primary transition-colors">
                Transport
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Jharkhand
              </Link>
            </div>
          </div>

          {/* Services Links */}
          <div className="flex-shrink-0">
            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center">
              <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Services
              </span>
            </h4>
            <div className="space-y-2">
              <Link to="/explore-districts" className="block text-muted-foreground hover:text-primary transition-colors">
                Interactive Map
              </Link>
              <Link to="/ar-vr-preview" className="block text-muted-foreground hover:text-primary transition-colors">
                AR/VR Previews
              </Link>
              <Link to="/stays" className="block text-muted-foreground hover:text-primary transition-colors">
                Homestays
              </Link>
              <Link to="/restaurants" className="block text-muted-foreground hover:text-primary transition-colors">
                Local Dining
              </Link>
              <Link to="/local-guides" className="block text-muted-foreground hover:text-primary transition-colors">
                Local Guides
              </Link>
              <Link to="/transport" className="block text-muted-foreground hover:text-primary transition-colors">
                Transport Services
              </Link>
            </div>
          </div>

          {/* AI Services Links */}
          <div className="flex-shrink-0">
            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                AI Services
              </span>
            </h4>
            <div className="space-y-2">
              <Link to="/ai-trip-planner" className="block text-muted-foreground hover:text-primary transition-colors">
                AI Trip Planner
              </Link>
              <Link to="/chatbot" className="block text-muted-foreground hover:text-primary transition-colors">
                Multilingual AI Chatbot
              </Link>
              <Link to="/smart-weather" className="block text-muted-foreground hover:text-primary transition-colors">
                Smart Weather Guide
              </Link>
              <Link to="/predictive-booking" className="block text-muted-foreground hover:text-primary transition-colors">
                Smart Booking
              </Link>
              <Link to="/feedback-analysis" className="block text-muted-foreground hover:text-primary transition-colors">
                Feedback Analysis
              </Link>
            </div>
          </div>

          {/* Support Links */}
          <div className="flex-shrink-0">
            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center">
              <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Support
              </span>
            </h4>
            <div className="space-y-2">
              <Link to="/support" className="block text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </Link>
              <CommunityChatLink className="block text-muted-foreground hover:text-primary transition-colors">
                Community Chat
              </CommunityChatLink>
              <Link to="/support" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link to="/analytics-dashboard" className="block text-muted-foreground hover:text-primary transition-colors">
                Tourism Insights
              </Link>
              <Link to="/privacy-policy" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter & Social Media Section */}
        <div className="border-t border-border pt-6 pb-4">
          <div className="text-center">
            <h4 className="text-xl font-bold text-foreground mb-3">Stay Connected</h4>
            <p className="text-muted-foreground mb-4 max-w-xl mx-auto">
              Subscribe for travel updates and exclusive offers from Jharkhand.
            </p>
            
            {/* Newsletter Signup */}
            <div className="flex justify-center mb-6">
              <form onSubmit={handleSubscribe} className="flex gap-3 w-full max-w-md">
                <Input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-card border-border focus:border-primary flex-1"
                  required
                />
                <Button 
                  type="submit" 
                  variant="default" 
                  className="px-4 bg-gradient-to-r from-forest-500 to-autumn-500 hover:from-forest-600 hover:to-autumn-600"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? "..." : t('footer.subscribe')}
                </Button>
              </form>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex justify-center gap-4">
              <a 
                href="https://www.facebook.com/rootsnroutes" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-card hover:bg-primary/10 rounded-full transition-all duration-300 group shadow-sm hover:shadow-md"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
              </a>
              <a 
                href="https://www.youtube.com/@rootsnroutes" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-card hover:bg-primary/10 rounded-full transition-all duration-300 group shadow-sm hover:shadow-md"
                aria-label="Follow us on YouTube"
              >
                <Youtube className="w-5 h-5 text-muted-foreground group-hover:text-red-600 transition-colors" />
              </a>
              <a 
                href="https://www.instagram.com/rootsnroutes" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-card hover:bg-primary/10 rounded-full transition-all duration-300 group shadow-sm hover:shadow-md"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 text-muted-foreground group-hover:text-pink-600 transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-4 text-center">
          <p className="text-muted-foreground">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;