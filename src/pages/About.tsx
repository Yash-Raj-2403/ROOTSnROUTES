import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DevelopmentNotice from "@/components/DevelopmentNotice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TeamMember from "@/components/TeamMember";
import FAQ from "@/components/FAQ";
import { motion, useReducedMotion } from "framer-motion";
import { Zap, Shield, Leaf, Users, Heart, Award, Globe, TreePine } from "lucide-react";
import { Link } from "react-router-dom";
import hundruFalls from "@/assets/hundru-falls.jpg";
import { useLanguage } from "@/hooks/useLanguage";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      ease: "easeOut"
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
} as const;

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
} as const;

const About = () => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const values = [
    {
      icon: Heart,
      title: t('about.values.authenticity.title'),
      description: t('about.values.authenticity.description')
    },
    {
      icon: Leaf,
      title: t('about.values.environmental.title'), 
      description: t('about.values.environmental.description')
    },
    {
      icon: Award,
      title: t('about.values.quality.title'),
      description: t('about.values.quality.description')
    },
    {
      icon: TreePine,
      title: t('about.values.cultural.title'),
      description: t('about.values.cultural.description')
    }
  ];

  const features = [
    {
      icon: Zap,
      title: t('features.aiPowered.title'),
      description: t('features.aiPowered.description')
    },
    {
      icon: Shield,
      title: t('features.blockchain.title'),
      description: t('features.blockchain.description')
    },
    {
      icon: Leaf,
      title: "Sustainable Tourism",
      description: "Promoting eco-friendly travel practices that preserve Jharkhand's natural beauty for future generations."
    },
    {
      icon: Users,
      title: "Community Empowerment",
      description: "Direct support to local communities, artisans, and service providers, ensuring tourism benefits reach grassroots level."
    }
  ];

  const team = [
    {
      name: "Yash Raj",
      role: "Team Lead & Chief Technology Officer",
      description: "Visionary team leader and chief technology officer driving the ROOTSnROUTES platform. Orchestrates overall project strategy, AI integration, full-stack architecture, and stakeholder coordination. Leading the mission to revolutionize sustainable tourism in Jharkhand through innovative technology solutions.",
      image: ""
    },
    {
      name: "Tanish Oberoi",
      role: "Project Manager & System Integration Lead",
      description: "Strategic project manager ensuring seamless execution and system integration. Manages development workflows, coordinates cross-functional teams, and ensures alignment with Smart India Hackathon objectives while maintaining project timelines and quality standards.",
      image: ""
    },
    {
      name: "Shreesh Kambampally", 
      role: "Backend Lead & Cloud Infrastructure Architect",
      description: "Backend systems expert and cloud infrastructure specialist. Architected secure payment processing, scalable database systems, real-time data synchronization, robust API design, and enterprise-grade cloud infrastructure for the tourism platform.",
      image: ""
    },
    {
      name: "Pakkireddy Nihal Reddy",
      role: "Frontend Lead & Interactive Experience Developer", 
      description: "Frontend development specialist creating immersive user experiences. Developed interactive tourism maps, weather-based recommendations, multilingual interfaces, responsive component libraries, and optimized performance for seamless user journeys.",
      image: ""
    },
    {
      name: "Sriya Gayatri",
      role: "Design Lead & User Experience Strategist",
      description: "Creative design leader crafting authentic tourism experiences. Designed comprehensive visual identity, intuitive UX/UI flows, accessibility-first interfaces, cultural branding, and conducted extensive user research for inclusive digital tourism.",
      image: ""
    },
    {
      name: "Kulkarni Sahithi",
      role: "Research Lead & Content Strategy Director",
      description: "Tourism research specialist and strategic content director. Curated comprehensive destination databases, developed cultural authenticity guidelines, managed content ecosystems, and coordinated community partnerships for genuine local experiences.",
      image: ""
    }
  ];

  const stats = [
    { number: "50+", label: "Destinations Mapped", desc: "Comprehensive coverage of Jharkhand's tourist spots" },
    { number: "200+", label: "Local Partners", desc: "Verified homestays, guides, and service providers" },
    { number: "500+", label: "Artisans Supported", desc: "Direct marketplace access for local craftspeople" },
    { number: "10K+", label: "Travelers Served", desc: "Happy visitors experiencing authentic Jharkhand" }
  ];

  return (
    <main>
      <DevelopmentNotice />
      <Header />
      
      {/* Hero Section - Enhanced Background */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ 
          paddingTop: 'calc(var(--dev-notice-height, 0px) + 80px)',
          minHeight: 'calc(100vh - var(--dev-notice-height, 0px))'
        }}
        initial="hidden"
        animate="visible"
        variants={shouldReduceMotion ? {} : containerVariants}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${hundruFalls})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="absolute inset-0 bg-black/25 dark:bg-black/40" />

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-2xl"
            variants={shouldReduceMotion ? {} : itemVariants}
          >
            {t('about.title')}
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto mb-8 leading-relaxed drop-shadow-lg"
            variants={shouldReduceMotion ? {} : itemVariants}
          >
            Connecting travelers with the authentic soul of Jharkhand through technology, sustainability, and community empowerment
          </motion.p>
          <motion.div variants={shouldReduceMotion ? {} : itemVariants}>
            <Link to="/destinations">
              <Button variant="hero" size="lg" className="cta-primary-button font-semibold text-lg px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300">
                Start Your Journey
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">{t('about.mission.title')}</h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {t('about.mission.description')}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe that tourism should benefit everyone: travelers seeking authentic experiences, local communities 
              preserving their heritage, and the environment that sustains us all. Through AI-powered personalization 
              and blockchain-secured transactions, we're creating the future of responsible travel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link to="/destinations">
                <Button variant="default" size="lg">Plan Your Trip</Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" size="lg">Join Our Community</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Jharkhand Section */}
      <section className="py-20 bg-gradient-nature">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('about.jharkhand.title')}</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('about.jharkhand.subtitle')}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-6">{t('about.jharkhand.heritage.title')}</h3>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    {t('about.jharkhand.heritage.description1')}
                  </p>
                  <p>
                    {t('about.jharkhand.heritage.description2')}
                  </p>
                  <p>
                    {t('about.jharkhand.heritage.description3')}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card/80 p-6 rounded-2xl border-border">
                  <h4 className="text-2xl font-bold text-primary mb-2">32+</h4>
                  <p className="text-muted-foreground">Tribal Communities</p>
                </div>
                <div className="bg-card/80 p-6 rounded-2xl border-border">
                  <h4 className="text-2xl font-bold text-primary mb-2">32%</h4>
                  <p className="text-muted-foreground">Forest Cover</p>
                </div>
                <div className="bg-card/80 p-6 rounded-2xl border-border">
                  <h4 className="text-2xl font-bold text-primary mb-2">50+</h4>
                  <p className="text-muted-foreground">Waterfalls</p>
                </div>
                <div className="bg-card/80 p-6 rounded-2xl border-border">
                  <h4 className="text-2xl font-bold text-primary mb-2">24</h4>
                  <p className="text-muted-foreground">Districts</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 bg-card/50 border-border">
                <div className="w-12 h-12 bg-forest-500 rounded-xl flex items-center justify-center mb-4">
                  <TreePine className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">Natural Wonders</h4>
                <p className="text-muted-foreground">
                  From Hundru Falls to Betla National Park, explore pristine forests, 
                  majestic waterfalls, and diverse wildlife in their natural habitat.
                </p>
              </Card>
              
              <Card className="p-6 bg-card/50 border-border">
                <div className="w-12 h-12 bg-autumn-500 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">Tribal Culture</h4>
                <p className="text-muted-foreground">
                  Experience the rich traditions of Santhali, Ho, Munda, and other tribal communities 
                  through festivals, art, music, and sustainable lifestyle practices.
                </p>
              </Card>
              
              <Card className="p-6 bg-card/50 border-border">
                <div className="w-12 h-12 bg-earth-500 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">Spiritual Sites</h4>
                <p className="text-muted-foreground">
                  Visit ancient temples like Baidyanath Dham, sacred Sarna groves, 
                  and pilgrimage sites that have been centers of faith for centuries.
                </p>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">Languages of Jharkhand</h3>
              <p className="text-muted-foreground mb-6">
                Jharkhand is a linguistic tapestry with Hindi as the official language, 
                alongside regional languages like Santhali, Ho, Mundari, Kurukh, and Kharia.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full">Hindi</span>
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full">Santhali</span>
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full">Ho</span>
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full">Mundari</span>
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full">Kurukh</span>
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full">Kharia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section 
        className="py-20 bg-gradient-subtle"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={shouldReduceMotion ? {} : containerVariants}
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            variants={shouldReduceMotion ? {} : itemVariants}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-foreground mb-6"
              variants={shouldReduceMotion ? {} : itemVariants}
            >
              Powered by Innovation
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              variants={shouldReduceMotion ? {} : itemVariants}
            >
              Cutting-edge technology meets traditional wisdom to create unparalleled travel experiences
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
            variants={shouldReduceMotion ? {} : containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={shouldReduceMotion ? {} : cardVariants}
                whileHover={shouldReduceMotion ? {} : "hover"}
              >
                <Card className="p-8 bg-card/50 border-border hover:bg-card/80 transition-all duration-300 h-full">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-card rounded-2xl flex items-center justify-center flex-shrink-0 about-icon-container">
                      <feature.icon className="w-8 h-8 text-white icon-text" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Impact Stats */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Our Impact</h2>
            <p className="text-xl text-muted-foreground">
              Real numbers, real impact on Jharkhand's tourism ecosystem
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center bg-card/30 border-border hover:bg-card/50 transition-all duration-300">
                <div className="text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-lg font-medium text-foreground mb-2">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.desc}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <motion.section 
        className="py-20 bg-gradient-subtle"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={shouldReduceMotion ? {} : containerVariants}
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            variants={shouldReduceMotion ? {} : itemVariants}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-foreground mb-6"
              variants={shouldReduceMotion ? {} : itemVariants}
            >
              Our Values
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              variants={shouldReduceMotion ? {} : itemVariants}
            >
              The principles that guide every decision and shape every experience we create
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
            variants={shouldReduceMotion ? {} : containerVariants}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={shouldReduceMotion ? {} : cardVariants}
                whileHover={shouldReduceMotion ? {} : "hover"}
              >
                <Card className="p-8 bg-card/50 border-border hover:bg-card/80 transition-all duration-300 text-center h-full">
                  <div className="w-16 h-16 bg-gradient-nature rounded-2xl flex items-center justify-center mx-auto mb-6 about-icon-container">
                    <value.icon className="w-8 h-8 text-white icon-text" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Project Overview Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About ROOTSnROUTES</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A Smart India Hackathon 2025 project revolutionizing Jharkhand's tourism ecosystem through innovative technology
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-6">Our Vision</h3>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    ROOTSnROUTES represents a paradigm shift in how travelers discover and experience Jharkhand's hidden treasures. 
                    Developed as part of Smart India Hackathon 2025, our platform addresses the critical challenge of promoting 
                    sustainable tourism while empowering local communities.
                  </p>
                  <p>
                    By leveraging cutting-edge AI technology, blockchain security, and comprehensive multilingual support, 
                    we're creating an inclusive digital ecosystem that connects travelers with authentic local experiences 
                    across all 24 districts of Jharkhand.
                  </p>
                  <p>
                    Our platform goes beyond traditional tourism by integrating real-time weather monitoring, emergency services, 
                    local marketplace access, and AI-powered itinerary planning to ensure safe, meaningful, and culturally 
                    respectful travel experiences.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-6 bg-card/80 border-border text-center">
                  <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-foreground mb-2">AI-Powered</h4>
                  <p className="text-sm text-muted-foreground">Smart itinerary planning and personalized recommendations</p>
                </Card>
                <Card className="p-6 bg-card/80 border-border text-center">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-foreground mb-2">Secure</h4>
                  <p className="text-sm text-muted-foreground">Blockchain-secured payments and transparent transactions</p>
                </Card>
                <Card className="p-6 bg-card/80 border-border text-center">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-foreground mb-2">Community-First</h4>
                  <p className="text-sm text-muted-foreground">Direct support to local artisans and service providers</p>
                </Card>
                <Card className="p-6 bg-card/80 border-border text-center">
                  <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-foreground mb-2">Accessible</h4>
                  <p className="text-sm text-muted-foreground">Multilingual support in 7+ local languages</p>
                </Card>
              </div>
            </div>

            <div className="bg-card/30 rounded-2xl p-8 border border-border">
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Key Innovations</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">AI Itinerary Planner</h4>
                  <p className="text-sm text-muted-foreground">Personalized travel plans based on preferences, weather, and local events</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌦️</span>
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Weather Intelligence</h4>
                  <p className="text-sm text-muted-foreground">Real-time weather monitoring across all 24 districts with safety recommendations</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💝</span>
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Local Marketplace</h4>
                  <p className="text-sm text-muted-foreground">Direct access to authentic local products and artisan communities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
              A passionate team of innovators, developers, and designers who came together for Smart India Hackathon 2025 
              to revolutionize Jharkhand's tourism ecosystem. Each member brings unique expertise to create a comprehensive 
              platform that bridges technology with authentic cultural experiences.
            </p>
            <div className="bg-card/30 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Smart India Hackathon 2025</strong> - Team ROOTSnROUTES<br/>
                Problem Statement: Development of a Smart Digital Platform to Promote Eco & Cultural Tourism in Jharkhand
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                description={member.description}
                image={member.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section - Enhanced with Better Button Styling */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <Card className="bg-gradient-hero p-12 text-center border-0 shadow-2xl">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
                Ready to Explore Jharkhand?
              </h2>
              <p className="text-xl text-white/95 mb-8 leading-relaxed drop-shadow-lg">
                Join thousands of travelers discovering the authentic beauty of Jharkhand through sustainable tourism
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/destinations">
                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full sm:w-auto cta-primary-button font-semibold text-lg px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    Start Planning Now
                  </Button>
                </Link>
                <Button 
                  variant="hero-outline" 
                  size="lg" 
                  className="w-full sm:w-auto cta-secondary-button font-medium text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Contact Our Team
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;