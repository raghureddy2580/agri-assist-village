import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { reduceInventory } from "@/lib/inventory";
import { getCurrentLocation, formatAddress } from "@/lib/geolocation";
import Header from "@/components/Header";
import { ArrowLeft, ShoppingCart, MapPin, User, CreditCard, Navigation } from "lucide-react";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state: cartState, dispatch: cartDispatch } = useCart();
    const { user } = useAuth();
    const params = new URLSearchParams(location.search);
    const productId = params.get("productId");
    const quantity = params.get("quantity");
    const products = params.get("products");
    const quantities = params.get("quantities");
    const fromCart = params.get("fromCart");
    const userLocation = params.get("location");


    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [customerInfo, setCustomerInfo] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        address: user?.address || "",
        city: user?.city || userLocation || "",
        pincode: user?.pincode || ""
    });
    const [paymentMethod, setPaymentMethod] = useState("");
    const [orderNotes, setOrderNotes] = useState("");
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState("");

    // Update customer info when user data changes
    useEffect(() => {
        if (user) {
            setCustomerInfo(prev => ({
                ...prev,
                name: user.name || prev.name,
                phone: user.phone || prev.phone,
                email: user.email || prev.email,
                address: user.address || prev.address,
                city: user.city || prev.city,
                pincode: user.pincode || prev.pincode
            }));
        }
    }, [user]);

    // Mock product data - in real app, this would come from API
    const productData = {
        1: {
            id: 1,
            name: "Premium Basmati Rice",
            farmer: "Rajesh Kumar",
            price: 45,
            unit: "kg",
            image: "🌾",
            category: "Grains",
            quality: "Organic",
            location: { city: "Bangalore", area: "Hirandalli" }
        },
        2: {
            id: 2,
            name: "Fresh Tomatoes",
            farmer: "Sunita Devi",
            price: 25,
            unit: "kg",
            image: "🍅",
            category: "Vegetables",
            quality: "Premium",
            location: { city: "Mysore", area: "VV Mohalla" }
        },
        3: {
            id: 3,
            name: "Wheat Flour",
            farmer: "Amandeep Singh",
            price: 35,
            unit: "kg",
            image: "🌾",
            category: "Processed",
            quality: "Grade A",
            location: { city: "Bangalore", area: "Whitefield" }
        },
        4: {
            id: 4,
            name: "Organic Carrots",
            farmer: "Priya Sharma",
            price: 30,
            unit: "kg",
            image: "🥕",
            category: "Vegetables",
            quality: "Organic",
            location: { city: "Bangalore", area: "Koramangala" }
        },
        5: {
            id: 5,
            name: "Fresh Spinach",
            farmer: "Kumar Reddy",
            price: 20,
            unit: "kg",
            image: "🥬",
            category: "Vegetables",
            quality: "Fresh",
            location: { city: "Bangalore", area: "Indiranagar" }
        },
        6: {
            id: 6,
            name: "Red Rice",
            farmer: "Lakshmi Nair",
            price: 50,
            unit: "kg",
            image: "🌾",
            category: "Grains",
            quality: "Organic",
            location: { city: "Bangalore", area: "JP Nagar" }
        },
        7: {
            id: 7,
            name: "Green Peas",
            farmer: "Ravi Patel",
            price: 40,
            unit: "kg",
            image: "🫛",
            category: "Vegetables",
            quality: "Fresh",
            location: { city: "Bangalore", area: "Marathahalli" }
        },
        8: {
            id: 8,
            name: "Jasmine Rice",
            farmer: "Meera Singh",
            price: 55,
            unit: "kg",
            image: "🌾",
            category: "Grains",
            quality: "Premium",
            location: { city: "Mysore", area: "Saraswathipuram" }
        },
        9: {
            id: 9,
            name: "Cherry Tomatoes",
            farmer: "Ravi Kumar",
            price: 60,
            unit: "kg",
            image: "🍅",
            category: "Vegetables",
            quality: "Premium",
            location: { city: "Bangalore", area: "Marathahalli" }
        },
        10: {
            id: 10,
            name: "Roma Tomatoes",
            farmer: "Priya Patel",
            price: 35,
            unit: "kg",
            image: "🍅",
            category: "Vegetables",
            quality: "Fresh",
            location: { city: "Bangalore", area: "Whitefield" }
        },
        11: {
            id: 11,
            name: "Organic Onions",
            farmer: "Suresh Reddy",
            price: 28,
            unit: "kg",
            image: "🧅",
            category: "Vegetables",
            quality: "Organic",
            location: { city: "Mysore", area: "VV Mohalla" }
        },
        12: {
            id: 12,
            name: "Fresh Potatoes",
            farmer: "Anita Sharma",
            price: 22,
            unit: "kg",
            image: "🥔",
            category: "Vegetables",
            quality: "Fresh",
            location: { city: "Bangalore", area: "Indiranagar" }
        },
        13: {
            id: 13,
            name: "Bell Peppers",
            farmer: "Raj Singh",
            price: 45,
            unit: "kg",
            image: "🫑",
            category: "Vegetables",
            quality: "Premium",
            location: { city: "Bangalore", area: "Koramangala" }
        },
        14: {
            id: 14,
            name: "Fresh Ginger",
            farmer: "Lakshmi Devi",
            price: 80,
            unit: "kg",
            image: "🫚",
            category: "Vegetables",
            quality: "Organic",
            location: { city: "Bangalore", area: "JP Nagar" }
        },
        15: {
            id: 15,
            name: "Garlic",
            farmer: "Venkat Rao",
            price: 70,
            unit: "kg",
            image: "🧄",
            category: "Vegetables",
            quality: "Fresh",
            location: { city: "Mysore", area: "Saraswathipuram" }
        }
    };

    const product = productData[productId] || null;
    const initialQuantity = quantity ? parseInt(quantity) : 1;

    // Initialize quantity from URL parameter
    React.useEffect(() => {
        if (quantity) {
            setSelectedQuantity(parseInt(quantity));
        }
    }, [quantity]);

    const totalAmount = product ? product.price * selectedQuantity : 0;
    const deliveryFee = 50; // Fixed delivery fee
    const finalTotal = totalAmount + deliveryFee;

    const handleInputChange = (field: string, value: string) => {
        setCustomerInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleGetCurrentLocation = async () => {
        setIsGettingLocation(true);
        setLocationError("");

        try {
            const locationData = await getCurrentLocation();
            const formattedAddress = formatAddress(locationData);

            setCustomerInfo(prev => ({
                ...prev,
                address: formattedAddress,
                city: locationData.city || prev.city,
                pincode: locationData.postalCode || prev.pincode
            }));

            alert("Location detected successfully!");
        } catch (error) {
            setLocationError(error.message);
            alert(`Location Error: ${error.message}`);
        } finally {
            setIsGettingLocation(false);
        }
    };

    const handlePlaceOrder = async () => {
        // Validate form
        if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !paymentMethod) {
            alert("Please fill in all required fields");
            return;
        }

        // Check inventory availability
        const inventoryReduced = reduceInventory(parseInt(productId), selectedQuantity);
        if (!inventoryReduced) {
            alert("Sorry, this product is no longer available in the requested quantity. Please try again.");
            navigate("/"); // Redirect to marketplace
            return;
        }

        // Simulate payment processing for card/UPI
        if (paymentMethod === "card" || paymentMethod === "upi") {
            // Show processing message
            const processingMessage = paymentMethod === "card"
                ? "Processing card payment..."
                : "Processing UPI payment...";

            alert(processingMessage);

            // Simulate payment delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulate payment success (90% success rate)
            const paymentSuccess = Math.random() > 0.1;

            if (!paymentSuccess) {
                alert("Payment failed. Please try again or use a different payment method.");
                return;
            }

            alert("Payment successful!");
        }

        // In a real app, this would make an API call to place the order
        const orderData = {
            productId,
            product: product,
            quantity: selectedQuantity,
            customerInfo,
            paymentMethod,
            orderNotes,
            totalAmount: finalTotal,
            userLocation,
            orderId: Date.now()
        };

        console.log("Order placed:", orderData);

        // Navigate to order confirmation
        navigate(`/order-confirmation?orderId=${orderData.orderId}`);
    };

    if (!product) {
        return (
            <div className="min-h-screen bg-background p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                        <Button onClick={() => navigate("/")} variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Marketplace
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="max-w-4xl mx-auto p-8">
                <div className="mb-6">
                    <Button onClick={() => navigate("/")} variant="outline" className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Marketplace
                    </Button>
                    <h1 className="text-3xl font-bold">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Details */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-4 mb-4">
                                    <span className="text-3xl">{product.image}</span>
                                    <div>
                                        <h3 className="font-semibold">{product.name}</h3>
                                        <p className="text-sm text-muted-foreground">by {product.farmer}</p>
                                        <div className="flex space-x-2 mt-1">
                                            <Badge variant="secondary">{product.category}</Badge>
                                            <Badge variant="outline">{product.quality}</Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-2">
                                    <Label htmlFor="quantity">Quantity ({product.unit}):</Label>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                                            disabled={selectedQuantity <= 1}
                                            className="h-8 w-8 p-0"
                                        >
                                            -
                                        </Button>
                                        <span className="w-8 text-center font-medium">
                                            {selectedQuantity}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                                            className="h-8 w-8 p-0"
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Price per {product.unit}:</span>
                                        <span>₹{product.price}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Quantity:</span>
                                        <span>{selectedQuantity} {product.unit}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>₹{totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery Fee:</span>
                                        <span>₹{deliveryFee}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total:</span>
                                        <span>₹{finalTotal}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="h-5 w-5 mr-2" />
                                    Customer Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={customerInfo.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            value={customerInfo.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={customerInfo.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label htmlFor="address">Delivery Address *</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleGetCurrentLocation}
                                            disabled={isGettingLocation}
                                            className="flex items-center space-x-1"
                                        >
                                            <Navigation className="h-4 w-4" />
                                            <span>{isGettingLocation ? 'Getting Location...' : 'Use Current Location'}</span>
                                        </Button>
                                    </div>
                                    <Textarea
                                        id="address"
                                        value={customerInfo.address}
                                        onChange={(e) => handleInputChange("address", e.target.value)}
                                        placeholder="Enter your complete delivery address or use current location"
                                        rows={3}
                                    />
                                    {locationError && (
                                        <p className="text-sm text-red-600 mt-1">{locationError}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            value={customerInfo.city}
                                            onChange={(e) => handleInputChange("city", e.target.value)}
                                            placeholder="Enter your city"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="pincode">Pincode</Label>
                                        <Input
                                            id="pincode"
                                            value={customerInfo.pincode}
                                            onChange={(e) => handleInputChange("pincode", e.target.value)}
                                            placeholder="Enter pincode"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                                    <Textarea
                                        id="notes"
                                        value={orderNotes}
                                        onChange={(e) => setOrderNotes(e.target.value)}
                                        placeholder="Any special instructions for your order"
                                        rows={2}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payment & Location Info */}
                    <div className="space-y-6">
                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <CreditCard className="h-5 w-5 mr-2" />
                                    Payment Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="cod"
                                            name="payment"
                                            value="cod"
                                            checked={paymentMethod === "cod"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <Label htmlFor="cod">Cash on Delivery (COD)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="upi"
                                            name="payment"
                                            value="upi"
                                            checked={paymentMethod === "upi"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <Label htmlFor="upi">UPI Payment</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="card"
                                            name="payment"
                                            value="card"
                                            checked={paymentMethod === "card"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <Label htmlFor="card">Credit/Debit Card</Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    Location Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Your Location:</span>
                                        <span className="text-sm font-medium">{userLocation}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Product Location:</span>
                                        <span className="text-sm font-medium">
                                            {product.location.city}, {product.location.area}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Estimated Delivery:</span>
                                        <span className="text-sm font-medium">2-3 days</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Place Order Button */}
                        <Button
                            onClick={handlePlaceOrder}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                            size="lg"
                        >
                            Place Order - ₹{finalTotal}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
