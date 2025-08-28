import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle,
  TrendingUp,
  ArrowRight
} from "lucide-react";

const MarketplacePreview = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Basmati Rice",
      farmer: "Rajesh Kumar",
      location: "Punjab, India",
      price: "₹45/kg",
      quantity: "500 kg available",
      rating: 4.8,
      image: "🌾",
      category: "Grains",
      quality: "Organic"
    },
    {
      id: 2,
      name: "Fresh Tomatoes",
      farmer: "Sunita Devi",
      location: "Maharashtra, India",
      price: "₹25/kg",
      quantity: "200 kg available",
      rating: 4.6,
      image: "🍅",
      category: "Vegetables",
      quality: "Premium"
    },
    {
      id: 3,
      name: "Wheat Flour",
      farmer: "Amandeep Singh",
      location: "Haryana, India",
      price: "₹35/kg",
      quantity: "1000 kg available",
      rating: 4.9,
      image: "🌾",
      category: "Processed",
      quality: "Grade A"
    }
  ];

  const buyingRequests = [
    {
      buyer: "Green Valley Co-op",
      product: "Organic Potatoes",
      quantity: "2 tons",
      budget: "₹15-20/kg",
      location: "Delhi NCR"
    },
    {
      buyer: "Fresh Mart Chain",
      product: "Mixed Vegetables",
      quantity: "500 kg daily",
      budget: "Market Rate",
      location: "Mumbai"
    }
  ];

  return (
    <section className="py-20 bg-background" id="marketplace">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Direct Farmer Marketplace
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect directly with buyers and sellers. No middlemen, better prices, fresh produce.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Featured Products */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-foreground">Featured Products</h3>
              <Button variant="outline">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-medium transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-4xl">{product.image}</div>
                        <div>
                          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                            {product.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                            <Badge variant="outline" className="text-xs">{product.quality}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{product.price}</p>
                        <p className="text-xs text-muted-foreground">{product.quantity}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{product.farmer}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{product.location}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Market Stats */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="h-5 w-5 mr-2 text-success" />
                  Market Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Listings</span>
                    <span className="font-semibold text-foreground">2,847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Today's Trades</span>
                    <span className="font-semibold text-success">₹45,230</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg. Savings</span>
                    <span className="font-semibold text-primary">18%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Buying Requests */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="text-lg">Latest Buying Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {buyingRequests.map((request, index) => (
                    <div key={index} className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-foreground text-sm">{request.buyer}</h4>
                        <Badge variant="outline" className="text-xs">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Looking for: <span className="font-medium text-foreground">{request.product}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        Quantity: {request.quantity} • Budget: {request.budget}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{request.location}</span>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs px-3 py-1">
                          Contact
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Requests
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  List Your Produce
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Post Buying Request
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Price Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplacePreview;