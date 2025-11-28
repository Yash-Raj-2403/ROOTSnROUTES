import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NavigationButtons } from "@/components/NavigationButtons";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, ShoppingBag, Heart } from "lucide-react";

const Handicrafts = () => {
  const { t } = useLanguage();

  const handicrafts = [
    {
      id: 1,
      name: "Dokra Metal Craft",
      description: "Ancient lost-wax casting technique creating beautiful brass figurines and decorative items",
      origin: "Tribal artisans of Jharkhand",
      price: "₹500 - ₹5000",
      category: "Metal Work",
      image: "/placeholder-craft.jpg",
      artisan: "Ramesh Kumar",
      location: "Ranchi"
    },
    {
      id: 2,
      name: "Jadur Weaving",
      description: "Traditional handloom textiles with intricate patterns and natural dyes",
      origin: "Santhal tribal community",
      price: "₹800 - ₹3000",
      category: "Textiles",
      image: "/placeholder-craft.jpg",
      artisan: "Maya Devi",
      location: "Dumka"
    },
    {
      id: 3,
      name: "Bamboo Crafts",
      description: "Eco-friendly baskets, furniture, and decorative items made from local bamboo",
      origin: "Munda and Oraon tribes",
      price: "₹200 - ₹2000",
      category: "Bamboo Work",
      image: "/placeholder-craft.jpg",
      artisan: "Santosh Oraon",
      location: "Chaibasa"
    },
    {
      id: 4,
      name: "Sohrai Paintings",
      description: "Traditional wall art with geometric patterns and natural pigments",
      origin: "Kurmi and Santhal artists",
      price: "₹1000 - ₹8000",
      category: "Paintings",
      image: "/placeholder-craft.jpg",
      artisan: "Geeta Mahli",
      location: "Hazaribagh"
    },
    {
      id: 5,
      name: "Stone Carving",
      description: "Intricate sculptures and decorative pieces carved from local sandstone",
      origin: "Traditional stone artisans",
      price: "₹1500 - ₹10000",
      category: "Stone Work",
      image: "/placeholder-craft.jpg",
      artisan: "Vikram Singh",
      location: "Palamu"
    },
    {
      id: 6,
      name: "Tribal Jewelry",
      description: "Handcrafted silver and brass jewelry with traditional tribal designs",
      origin: "Ho and Munda tribes",
      price: "₹300 - ₹4000",
      category: "Jewelry",
      image: "/placeholder-craft.jpg",
      artisan: "Priya Munda",
      location: "Seraikela"
    }
  ];

  const categories = ["All", "Metal Work", "Textiles", "Bamboo Work", "Paintings", "Stone Work", "Jewelry"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Traditional Handicrafts of Jharkhand</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover authentic handcrafted treasures made by skilled artisans using age-old traditional techniques
            </p>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <Badge 
                  key={category} 
                  variant={category === "All" ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Handicrafts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {handicrafts.map((craft) => (
              <Card key={craft.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader className="pb-4">
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-muted-foreground">🎨 {craft.category}</span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {craft.name}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit">
                    {craft.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {craft.description}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Origin:</strong> {craft.origin}
                      </div>
                      <div>
                        <strong>Price Range:</strong> {craft.price}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-primary" />
                        <span>{craft.location}</span>
                      </div>
                      <div>
                        <strong>Artisan:</strong> {craft.artisan}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* About Jharkhand Handicrafts */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Rich Craft Heritage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Jharkhand's handicrafts represent centuries of artistic tradition passed down through generations 
                    of skilled tribal artisans. Each piece tells a story of cultural heritage and showcases the 
                    deep connection between the people and their land.
                  </p>
                  <p>
                    The state's rich mineral resources, abundant forests, and diverse tribal communities have 
                    contributed to a unique variety of crafts that are both functional and aesthetically beautiful.
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li>• Authentic traditional techniques</li>
                    <li>• Eco-friendly and sustainable materials</li>
                    <li>• Direct support to local artisans</li>
                    <li>• Cultural preservation through commerce</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Support Local Artisans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    When you purchase handicrafts from Jharkhand, you're not just buying a product – you're 
                    supporting entire communities and helping preserve traditional art forms for future generations.
                  </p>
                  <p>
                    Our platform connects you directly with artisans, ensuring fair wages and promoting 
                    sustainable livelihoods in rural areas.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong className="text-foreground">Quality Assurance</strong>
                      <p>Authentic handmade products</p>
                    </div>
                    <div>
                      <strong className="text-foreground">Fair Trade</strong>
                      <p>Direct artisan support</p>
                    </div>
                    <div>
                      <strong className="text-foreground">Cultural Value</strong>
                      <p>Traditional techniques</p>
                    </div>
                    <div>
                      <strong className="text-foreground">Eco-Friendly</strong>
                      <p>Sustainable materials</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How to Purchase */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">How to Purchase Authentic Handicrafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Browse Collection</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore our curated collection of authentic handicrafts
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Contact Artisan</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect directly with artisans for custom orders
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Secure Payment</h3>
                  <p className="text-sm text-muted-foreground">
                    Safe and secure payment processing
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">4</span>
                  </div>
                  <h3 className="font-semibold mb-2">Receive & Enjoy</h3>
                  <p className="text-sm text-muted-foreground">
                    Get your authentic handicraft delivered safely
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visit Artisan Centers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Visit Artisan Centers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Experience the craft-making process firsthand by visiting our partner artisan centers across Jharkhand.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-foreground">Ranchi Craft Center</strong>
                  <p className="text-muted-foreground">Metal work and jewelry making</p>
                </div>
                <div>
                  <strong className="text-foreground">Dumka Weaving Center</strong>
                  <p className="text-muted-foreground">Traditional textile weaving</p>
                </div>
                <div>
                  <strong className="text-foreground">Hazaribagh Art Village</strong>
                  <p className="text-muted-foreground">Sohrai paintings and folk art</p>
                </div>
              </div>
              <Button className="mt-4">
                Plan Artisan Visit
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <NavigationButtons
        showBackButton={true}
        customBackPath="/marketplace"
        showRelatedActions={true}
        relatedActions={[
          { label: "Visit Marketplace", path: "/marketplace", icon: ShoppingBag },
          { label: "Cultural Heritage", path: "/cultural-heritage", icon: Heart },
          { label: "Plan Artisan Tour", path: "/ai-trip-planner", icon: MapPin }
        ]}
      />
      
      <Footer />
    </div>
  );
};

export default Handicrafts;