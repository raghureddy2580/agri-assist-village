import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Users, TrendingUp, Shield } from "lucide-react";
import heroImage from "@/assets/hero-farming.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-background to-accent/20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Smart Farming Technology" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Trusted by 10,000+ Farmers Worldwide
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Smart Farming for the
            <span className="text-primary block">Modern Farmer</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Revolutionize your farming with AI-powered crop management, real-time weather insights, 
            labor hiring, and direct marketplace connections. Boost productivity and profits with digital agriculture.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6 font-semibold">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 font-semibold">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary mr-2" />
                <span className="text-2xl font-bold text-foreground">10K+</span>
              </div>
              <p className="text-muted-foreground font-medium">Active Farmers</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-success mr-2" />
                <span className="text-2xl font-bold text-foreground">35%</span>
              </div>
              <p className="text-muted-foreground font-medium">Avg. Yield Increase</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-warning mr-2" />
                <span className="text-2xl font-bold text-foreground">24/7</span>
              </div>
              <p className="text-muted-foreground font-medium">Expert Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;