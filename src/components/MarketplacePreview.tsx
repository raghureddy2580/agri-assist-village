import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "./Toast";
import DeliveryCalculator from "./DeliveryCalculator";
import FloatingCart from "./FloatingCart";
import ProductDetailsModal from "./ProductDetailsModal";
import { getAvailableQuantity, reduceInventory, productDetails } from "@/lib/inventory";
import {
  ShoppingCart,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Plus,
  Navigation,
  Filter,
  SortAsc
} from "lucide-react";

const MarketplacePreview = () => {
  const [userLocation, setUserLocation] = useState("Bangalore, Hirandalli");
  const [userCoordinates, setUserCoordinates] = useState({ lat: 12.9716, lng: 77.5946 });
  const [sortBy, setSortBy] = useState("distance");
  const [filterRadius, setFilterRadius] = useState("all");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({});
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const { dispatch } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Available locations for suggestions
  const availableLocations = [
    "Bangalore, Hirandalli",
    "Bangalore, Koramangala",
    "Bangalore, Indiranagar",
    "Bangalore, JP Nagar",
    "Bangalore, Marathahalli",
    "Bangalore, Whitefield",
    "Mysore, VV Mohalla",
    "Mysore, Saraswathipuram"
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Basmati Rice",
      farmer: "Rajesh Kumar",
      farmerPhone: "+91 9876543210",
      location: { city: "Bangalore", area: "Hirandalli", lat: 12.9716, lng: 77.5946 },
      price: "₹45/kg",
      quantity: "500 kg available",
      rating: 4.8,
      image: "🌾",
      category: "Grains",
      quality: "Organic",
      description: "Long-grain aromatic rice, perfect for biryani and pulao. Grown using traditional farming methods without chemical pesticides.",
      specifications: {
        variety: "Basmati 386",
        grainLength: "8.5mm",
        moisture: "12%",
        shelfLife: "2 years",
        packaging: "5kg vacuum sealed bags"
      },
      harvestDate: "2024-08-15",
      certification: "NPOP Certified Organic"
    },
    {
      id: 2,
      name: "Fresh Tomatoes",
      farmer: "Sunita Devi",
      farmerPhone: "+91 8765432109",
      location: { city: "Mysore", area: "VV Mohalla", lat: 12.2958, lng: 76.6394 },
      price: "₹25/kg",
      quantity: "200 kg available",
      rating: 4.6,
      image: "🍅",
      category: "Vegetables",
      quality: "Premium",
      description: "Vine-ripened tomatoes with rich red color and juicy texture. Perfect for salads, cooking, and making sauces.",
      specifications: {
        variety: "Local Hybrid",
        size: "Medium (80-100g)",
        color: "Deep red",
        shelfLife: "7-10 days",
        packaging: "5kg wooden crates"
      },
      harvestDate: "2024-09-01",
      certification: "Fresh Produce Certified"
    },
    {
      id: 3,
      name: "Wheat Flour",
      farmer: "Amandeep Singh",
      farmerPhone: "+91 7654321098",
      location: { city: "Bangalore", area: "Whitefield", lat: 12.9698, lng: 77.7499 },
      price: "₹35/kg",
      quantity: "1000 kg available",
      rating: 4.9,
      image: "🌾",
      category: "Processed",
      quality: "Grade A",
      description: "Finely milled whole wheat flour, ideal for making chapatis, parathas, and traditional Indian breads.",
      specifications: {
        type: "Whole Wheat",
        protein: "12.5%",
        moisture: "10%",
        shelfLife: "6 months",
        packaging: "1kg, 5kg, 10kg bags"
      },
      harvestDate: "2024-07-20",
      certification: "FSSAI Approved"
    },
    {
      id: 4,
      name: "Organic Carrots",
      farmer: "Priya Sharma",
      farmerPhone: "+91 6543210987",
      location: { city: "Bangalore", area: "Koramangala", lat: 12.9352, lng: 77.6245 },
      price: "₹30/kg",
      quantity: "150 kg available",
      rating: 4.7,
      image: "🥕",
      category: "Vegetables",
      quality: "Organic",
      description: "Sweet and crunchy organic carrots grown without synthetic pesticides. Rich in beta-carotene and nutrients.",
      specifications: {
        variety: "Nantes",
        size: "Medium (15-18cm)",
        color: "Orange",
        shelfLife: "14 days",
        packaging: "2kg mesh bags"
      },
      harvestDate: "2024-08-25",
      certification: "NPOP Organic Certified"
    },
    {
      id: 5,
      name: "Fresh Spinach",
      farmer: "Kumar Reddy",
      farmerPhone: "+91 5432109876",
      location: { city: "Bangalore", area: "Indiranagar", lat: 12.9719, lng: 77.6412 },
      price: "₹20/kg",
      quantity: "100 kg available",
      rating: 4.5,
      image: "🥬",
      category: "Vegetables",
      quality: "Fresh",
      description: "Tender green spinach leaves, harvested fresh daily. Excellent source of iron, vitamins, and minerals.",
      specifications: {
        variety: "Palak",
        leafSize: "Medium",
        color: "Deep green",
        shelfLife: "3-4 days",
        packaging: "500g bunches"
      },
      harvestDate: "2024-09-05",
      certification: "Fresh Produce Certified"
    },
    {
      id: 6,
      name: "Red Rice",
      farmer: "Lakshmi Nair",
      farmerPhone: "+91 4321098765",
      location: { city: "Bangalore", area: "JP Nagar", lat: 12.9063, lng: 77.5857 },
      price: "₹50/kg",
      quantity: "300 kg available",
      rating: 4.9,
      image: "🌾",
      category: "Grains",
      quality: "Organic",
      description: "Nutritious red rice with high fiber content and nutty flavor. Rich in antioxidants and minerals.",
      specifications: {
        variety: "Kerala Red",
        grainLength: "6mm",
        color: "Red-brown",
        shelfLife: "18 months",
        packaging: "2kg vacuum packs"
      },
      harvestDate: "2024-08-10",
      certification: "Organic & Natural"
    },
    {
      id: 7,
      name: "Green Peas",
      farmer: "Ravi Patel",
      farmerPhone: "+91 3210987654",
      location: { city: "Bangalore", area: "Marathahalli", lat: 12.9581, lng: 77.7014 },
      price: "₹40/kg",
      quantity: "250 kg available",
      rating: 4.4,
      image: "🫛",
      category: "Vegetables",
      quality: "Fresh",
      description: "Sweet and tender green peas, perfect for cooking curries, soups, or eating fresh from the pod.",
      specifications: {
        variety: "Sweet Peas",
        size: "Small to medium",
        color: "Bright green",
        shelfLife: "5-7 days",
        packaging: "1kg plastic bags"
      },
      harvestDate: "2024-09-03",
      certification: "Fresh Produce Certified"
    },
    {
      id: 8,
      name: "Jasmine Rice",
      farmer: "Meera Singh",
      farmerPhone: "+91 2109876543",
      location: { city: "Mysore", area: "Saraswathipuram", lat: 12.3118, lng: 76.6525 },
      price: "₹55/kg",
      quantity: "400 kg available",
      rating: 4.8,
      image: "🌾",
      category: "Grains",
      quality: "Premium",
      description: "Fragrant long-grain rice with delicate aroma. Perfect for Asian cuisine and special occasions.",
      specifications: {
        variety: "Thai Jasmine",
        grainLength: "8mm",
        fragrance: "High",
        shelfLife: "24 months",
        packaging: "5kg premium bags"
      },
      harvestDate: "2024-08-20",
      certification: "Premium Quality Certified"
    },
    {
      id: 9,
      name: "Cherry Tomatoes",
      farmer: "Ravi Kumar",
      farmerPhone: "+91 1098765432",
      location: { city: "Bangalore", area: "Marathahalli", lat: 12.9581, lng: 77.7014 },
      price: "₹60/kg",
      quantity: "80 kg available",
      rating: 4.7,
      image: "🍅",
      category: "Vegetables",
      quality: "Premium",
      description: "Sweet and juicy cherry tomatoes, perfect for salads, snacking, or garnishing. Grown in controlled greenhouse environment.",
      specifications: {
        variety: "Sweet 100",
        size: "Small (15-20g)",
        color: "Bright red",
        shelfLife: "10-12 days",
        packaging: "250g punnet boxes"
      },
      harvestDate: "2024-09-02",
      certification: "Premium Quality Certified"
    },
    {
      id: 10,
      name: "Roma Tomatoes",
      farmer: "Priya Patel",
      farmerPhone: "+91 0987654321",
      location: { city: "Bangalore", area: "Whitefield", lat: 12.9698, lng: 77.7499 },
      price: "₹35/kg",
      quantity: "120 kg available",
      rating: 4.5,
      image: "🍅",
      category: "Vegetables",
      quality: "Fresh",
      description: "Oval-shaped tomatoes ideal for cooking sauces, pastes, and canning. Firm texture with fewer seeds.",
      specifications: {
        variety: "Roma VF",
        size: "Medium (100-120g)",
        shape: "Oval",
        shelfLife: "8-10 days",
        packaging: "5kg wooden boxes"
      },
      harvestDate: "2024-09-01",
      certification: "Fresh Produce Certified"
    },
    {
      id: 11,
      name: "Organic Onions",
      farmer: "Suresh Reddy",
      farmerPhone: "+91 9876543210",
      location: { city: "Mysore", area: "VV Mohalla", lat: 12.2958, lng: 76.6394 },
      price: "₹28/kg",
      quantity: "300 kg available",
      rating: 4.6,
      image: "🧅",
      category: "Vegetables",
      quality: "Organic",
      description: "Sweet and pungent organic onions grown without chemical fertilizers. Perfect for cooking and medicinal uses.",
      specifications: {
        variety: "Red Onion",
        size: "Medium (80-100g)",
        color: "Deep red",
        shelfLife: "30-45 days",
        packaging: "10kg mesh bags"
      },
      harvestDate: "2024-08-30",
      certification: "NPOP Organic Certified"
    },
    {
      id: 12,
      name: "Fresh Potatoes",
      farmer: "Anita Sharma",
      farmerPhone: "+91 1234567890",
      location: { city: "Bangalore", area: "Indiranagar", lat: 12.9719, lng: 77.6412 },
      price: "₹22/kg",
      quantity: "400 kg available",
      rating: 4.4,
      image: "🥔",
      category: "Vegetables",
      quality: "Fresh",
      description: "Fresh dug potatoes with smooth skin and firm texture. Excellent for boiling, baking, or frying.",
      specifications: {
        variety: "Kufri Jyoti",
        size: "Medium (100-150g)",
        skin: "Smooth, light brown",
        shelfLife: "20-25 days",
        packaging: "20kg gunny bags"
      },
      harvestDate: "2024-09-04",
      certification: "Fresh Produce Certified"
    },
    {
      id: 13,
      name: "Bell Peppers",
      farmer: "Raj Singh",
      farmerPhone: "+91 7654321098",
      location: { city: "Bangalore", area: "Koramangala", lat: 12.9352, lng: 77.6245 },
      price: "₹45/kg",
      quantity: "90 kg available",
      rating: 4.8,
      image: "🫑",
      category: "Vegetables",
      quality: "Premium",
      description: "Crisp and colorful bell peppers, rich in vitamins. Available in red, yellow, and green varieties.",
      specifications: {
        variety: "California Wonder",
        size: "Large (150-200g)",
        colors: "Red, Yellow, Green",
        shelfLife: "10-14 days",
        packaging: "2kg cardboard boxes"
      },
      harvestDate: "2024-09-03",
      certification: "Premium Quality Certified"
    },
    {
      id: 14,
      name: "Fresh Ginger",
      farmer: "Lakshmi Devi",
      farmerPhone: "+91 0123456789",
      location: { city: "Bangalore", area: "JP Nagar", lat: 12.9063, lng: 77.5857 },
      price: "₹80/kg",
      quantity: "50 kg available",
      rating: 4.9,
      image: "🫚",
      category: "Vegetables",
      quality: "Organic",
      description: "Aromatic organic ginger with strong flavor and medicinal properties. Perfect for cooking and health remedies.",
      specifications: {
        variety: "Rio de Janeiro",
        size: "Medium (8-10cm)",
        moisture: "8-10%",
        shelfLife: "6-8 months",
        packaging: "5kg jute bags"
      },
      harvestDate: "2024-08-28",
      certification: "NPOP Organic Certified"
    },
    {
      id: 15,
      name: "Garlic",
      farmer: "Venkat Rao",
      farmerPhone: "+91 5432109876",
      location: { city: "Mysore", area: "Saraswathipuram", lat: 12.3118, lng: 76.6525 },
      price: "₹70/kg",
      quantity: "75 kg available",
      rating: 4.7,
      image: "🧄",
      category: "Vegetables",
      quality: "Fresh",
      description: "Fresh garlic bulbs with strong aroma and flavor. Excellent for cooking and health benefits.",
      specifications: {
        variety: "G-282",
        bulbSize: "Medium (40-50g)",
        cloves: "10-12 per bulb",
        shelfLife: "8-10 months",
        packaging: "10kg mesh bags"
      },
      harvestDate: "2024-08-25",
      certification: "Fresh Produce Certified"
    }
  ];

  // Function to calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };

  // Function to get coordinates for a location (simplified - in real app, use geocoding API)
  const getLocationCoordinates = (location: string) => {
    const locationMap: { [key: string]: { lat: number; lng: number } } = {
      "bangalore, hirandalli": { lat: 12.9716, lng: 77.5946 },
      "bangalore, koramangala": { lat: 12.9352, lng: 77.6245 },
      "bangalore, indiranagar": { lat: 12.9719, lng: 77.6412 },
      "bangalore, jp nagar": { lat: 12.9063, lng: 77.5857 },
      "bangalore, marathahalli": { lat: 12.9581, lng: 77.7014 },
      "bangalore, whitefield": { lat: 12.9698, lng: 77.7499 },
      "mysore, vv mohalla": { lat: 12.2958, lng: 76.6394 },
      "mysore, saraswathipuram": { lat: 12.3118, lng: 76.6525 }
    };

    return locationMap[location.toLowerCase()] || { lat: 12.9716, lng: 77.5946 };
  };

  // Update user coordinates when location changes
  useEffect(() => {
    const coords = getLocationCoordinates(userLocation);
    setUserCoordinates(coords);
  }, [userLocation]);

  // Add distance, current inventory, and detailed info to each product
  const productsWithDistance = featuredProducts.map(product => {
    const distance = calculateDistance(
      userCoordinates.lat,
      userCoordinates.lng,
      product.location.lat,
      product.location.lng
    );
    const availableQuantity = getAvailableQuantity(product.id);
    const details = productDetails[product.id] || {};

    return {
      ...product,
      ...details,
      distance,
      availableQuantity,
      quantity: `${availableQuantity} kg available`
    };
  });

  // Filter products by radius
  const filteredByRadius = productsWithDistance.filter(product => {
    if (filterRadius === "all") return true;
    const radius = parseInt(filterRadius);
    return product.distance <= radius;
  });

  // Sort products based on selected criteria
  const sortedProducts = [...filteredByRadius].sort((a, b) => {
    switch (sortBy) {
      case "distance":
        return a.distance - b.distance;
      case "price":
        const priceA = parseInt(a.price.replace('₹', ''));
        const priceB = parseInt(b.price.replace('₹', ''));
        return priceA - priceB;
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Initialize quantities for all products
  useEffect(() => {
    const initialQuantities: { [key: number]: number } = {};
    featuredProducts.forEach(product => {
      initialQuantities[product.id] = 1;
    });
    setProductQuantities(initialQuantities);
  }, []);

  // Handler for quantity change
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    const availableQuantity = getAvailableQuantity(productId);
    const maxQuantity = Math.min(availableQuantity, 99); // Cap at 99 for UI
    setProductQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, Math.min(maxQuantity, newQuantity))
    }));
  };

  // Handler for Buy Now button
  const handleBuy = (product) => {
    const quantity = productQuantities[product.id] || 1;
    const availableQuantity = getAvailableQuantity(product.id);

    if (quantity > availableQuantity) {
      showToast({
        type: 'error',
        title: 'Insufficient Inventory',
        message: `Only ${availableQuantity} kg available. Please reduce quantity.`,
        duration: 4000
      });
      return;
    }

    // Navigate to checkout page with product info and user location
    navigate(`/checkout?productId=${product.id}&quantity=${quantity}&location=${encodeURIComponent(userLocation)}`);
  };

  // Handler for Add to Cart button
  const handleAddToCart = (product) => {
    const quantity = productQuantities[product.id] || 1;
    const cartItem = {
      id: product.id,
      name: product.name,
      farmer: product.farmer,
      price: parseInt(product.price.replace('₹', '')),
      unit: 'kg',
      image: product.image,
      category: product.category,
      quality: product.quality,
      location: product.location,
      quantity: quantity
    };

    dispatch({ type: 'ADD_TO_CART', payload: cartItem });

    // Show success toast notification
    showToast({
      type: 'success',
      title: 'Added to Cart!',
      message: `${product.name} (${quantity} kg) has been added to your cart.`,
      duration: 3000
    });
  };

  // Handler for viewing product details
  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  // Handler for modal quantity change
  const handleModalQuantityChange = (newQuantity: number) => {
    if (selectedProduct) {
      setProductQuantities(prev => ({
        ...prev,
        [selectedProduct.id]: newQuantity
      }));
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Products Near You</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Navigation className="h-4 w-4" />
          <span>Showing {sortedProducts.length} products</span>
        </div>
      </div>

      {/* Location and Filter Controls */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Label htmlFor="location" className="text-sm font-medium">Your Location</Label>
            <Input
              id="location"
              value={userLocation}
              onChange={e => setUserLocation(e.target.value)}
              onFocus={() => setShowLocationSuggestions(true)}
              onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
              placeholder="City, Area (e.g., Bangalore, Koramangala)"
              className="mt-1"
            />
            {showLocationSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {availableLocations
                  .filter(loc => loc.toLowerCase().includes(userLocation.toLowerCase()))
                  .map((location, index) => (
                    <button
                      key={index}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      onClick={() => {
                        setUserLocation(location);
                        setShowLocationSuggestions(false);
                      }}
                    >
                      {location}
                    </button>
                  ))}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="radius" className="text-sm font-medium">Search Radius</Label>
            <Select value={filterRadius} onValueChange={setFilterRadius}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="5">Within 5 km</SelectItem>
                <SelectItem value="10">Within 10 km</SelectItem>
                <SelectItem value="25">Within 25 km</SelectItem>
                <SelectItem value="50">Within 50 km</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sort" className="text-sm font-medium">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Nearest First</SelectItem>
                <SelectItem value="price">Price (Low to High)</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No products found in your area</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try expanding your search radius or changing your location
            </p>
          </div>
        ) : (
          sortedProducts.map(product => (
            <Card key={product.id} className="shadow-medium">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{product.image}</span>
                  <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
                  <Badge variant="secondary" className="ml-2">{product.category}</Badge>
                  <Badge variant="outline" className="ml-2">{product.quality}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-700 font-bold text-lg">{product.price}</span>
                  <span className="text-xs text-muted-foreground">{product.quantity}</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground">• {product.farmer}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {product.location.city}, {product.location.area}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Navigation className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-medium text-green-600">
                      {product.distance} km
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Quantity:</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(product.id, (productQuantities[product.id] || 1) - 1)}
                        disabled={productQuantities[product.id] <= 1}
                        className="h-8 w-8 p-0"
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {productQuantities[product.id] || 1}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(product.id, (productQuantities[product.id] || 1) + 1)}
                        className="h-8 w-8 p-0"
                      >
                        +
                      </Button>
                      <span className="text-xs text-muted-foreground ml-1">kg</span>
                    </div>
                  </div>

                  <DeliveryCalculator
                    userLocation={userLocation}
                    farmerLocation={`${product.location.city}, ${product.location.area}`}
                    distance={product.distance}
                  />

                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      className="flex items-center space-x-2 flex-1"
                      onClick={() => handleBuy(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => handleViewDetails(product)}
                    className="w-full text-sm"
                  >
                    View Details
                  </Button>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Floating Cart */}
      <FloatingCart />

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onBuy={handleBuy}
        onAddToCart={handleAddToCart}
        userLocation={userLocation}
        quantity={selectedProduct ? (productQuantities[selectedProduct.id] || 1) : 1}
        onQuantityChange={handleModalQuantityChange}
      />
    </section>
  );
};

export default MarketplacePreview;