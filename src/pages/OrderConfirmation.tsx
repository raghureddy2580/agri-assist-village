import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import { CheckCircle, ArrowLeft, Home, Package, Phone, MapPin } from "lucide-react";

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");

    // Mock order data - in real app, this would come from API
    const orderData = {
        orderId: orderId || "12345",
        status: "confirmed",
        estimatedDelivery: "2-3 days",
        product: {
            name: "Premium Basmati Rice",
            farmer: "Rajesh Kumar",
            price: 45,
            quantity: 2,
            unit: "kg",
            image: "🌾",
            category: "Grains",
            quality: "Organic"
        },
        customer: {
            name: user?.name || "Customer",
            phone: user?.phone || "Phone not provided",
            address: user?.address ? `${user.address}, ${user.city || ''} ${user.pincode || ''}`.trim() : "Address not provided"
        },
        payment: {
            method: "Cash on Delivery",
            amount: 140
        },
        farmer: {
            name: "Rajesh Kumar",
            phone: "+91 9876543211",
            location: "Bangalore, Hirandalli"
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="max-w-2xl mx-auto p-8">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-green-100 rounded-full p-4">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
                    <p className="text-muted-foreground">
                        Your order has been successfully placed and will be delivered soon.
                    </p>
                </div>

                {/* Order Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Order Details</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                                Order #{orderData.orderId}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-3xl">{orderData.product.image}</span>
                                <div className="flex-1">
                                    <h3 className="font-semibold">{orderData.product.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {orderData.product.quantity} {orderData.product.unit} • {orderData.product.quality}
                                    </p>
                                    <div className="flex space-x-2 mt-1">
                                        <Badge variant="secondary">{orderData.product.category}</Badge>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">₹{orderData.product.price * orderData.product.quantity}</p>
                                    <p className="text-sm text-muted-foreground">₹{orderData.product.price}/{orderData.product.unit}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Subtotal:</p>
                                    <p className="font-semibold">₹{orderData.product.price * orderData.product.quantity}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Delivery Fee:</p>
                                    <p className="font-semibold">₹50</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">Total Amount:</span>
                                <span className="text-lg font-bold text-green-600">₹{orderData.payment.amount}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery Information */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Package className="h-5 w-5 mr-2" />
                            Delivery Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{orderData.customer.name}</p>
                                    <p className="text-sm text-muted-foreground">{orderData.customer.address}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">{orderData.customer.phone}</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Estimated Delivery:</strong> {orderData.estimatedDelivery}
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    You will receive a call from the farmer to confirm delivery time.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Farmer Contact */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Farmer Contact</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div>
                                <p className="font-medium">{orderData.farmer.name}</p>
                                <p className="text-sm text-muted-foreground">{orderData.farmer.location}</p>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Call Farmer
                                </Button>
                                <Button variant="outline" size="sm">
                                    Message
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Information */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">Payment Method</p>
                                <p className="text-sm text-muted-foreground">{orderData.payment.method}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">₹{orderData.payment.amount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={() => navigate("/")}
                        className="flex-1"
                        variant="outline"
                    >
                        <Home className="h-4 w-4 mr-2" />
                        Back to Marketplace
                    </Button>
                    <Button
                        onClick={() => navigate("/")}
                        className="flex-1"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Continue Shopping
                    </Button>
                </div>

                {/* Additional Information */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        You will receive order updates via SMS and email.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        For any queries, contact our support team or the farmer directly.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
