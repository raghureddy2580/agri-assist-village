import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import WeatherWidget from "@/components/WeatherWidget";
import MarketplacePreview from "@/components/MarketplacePreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        <FeatureCards />
        <WeatherWidget />
        <MarketplacePreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
