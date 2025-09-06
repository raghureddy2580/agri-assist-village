import React from "react";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CartProps {
    onClose?: () => void;
}

const Cart: React.FC<CartProps> = ({ onClose }) => {
    const { state, dispatch } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = (itemId: number, newQuantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity: newQuantity } });
    };

    const handleRemoveItem = (itemId: number) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    };

    const handleCheckout = () => {
        if (state.items.length === 0) return;

        // Create a comma-separated list of product IDs for the checkout
        const productIds = state.items.map(item => item.id).join(',');
        const quantities = state.items.map(item => item.quantity).join(',');

        navigate(`/checkout?products=${productIds}&quantities=${quantities}&fromCart=true`);

        if (onClose) onClose();
    };

    const deliveryFee = state.items.length > 0 ? 50 : 0;
    const finalTotal = state.totalAmount + deliveryFee;

    if (state.items.length === 0) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Shopping Cart
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Your cart is empty</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Add some products to get started
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Shopping Cart
                    </span>
                    <Badge variant="secondary">{state.totalItems} items</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {state.items.map((item) => (
                        <div key={item.id} className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">{item.image}</span>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                                    <p className="text-xs text-muted-foreground">by {item.farmer}</p>
                                    <div className="flex space-x-1 mt-1">
                                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                                        <Badge variant="secondary" className="text-xs">{item.quality}</Badge>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-muted-foreground">Qty:</span>
                                    <Select
                                        value={item.quantity.toString()}
                                        onValueChange={(value) => handleQuantityChange(item.id, parseInt(value))}
                                    >
                                        <SelectTrigger className="w-16 h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5, 10, 15, 20, 25, 50].map(num => (
                                                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <span className="text-sm text-muted-foreground">{item.unit}</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">₹{item.price * item.quantity}</p>
                                    <p className="text-xs text-muted-foreground">₹{item.price}/{item.unit}</p>
                                </div>
                            </div>

                            <Separator />
                        </div>
                    ))}

                    {/* Cart Summary */}
                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>₹{state.totalAmount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Delivery Fee:</span>
                            <span>₹{deliveryFee}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>₹{finalTotal}</span>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <Button
                        onClick={handleCheckout}
                        className="w-full bg-green-600 hover:bg-green-700"
                    >
                        Proceed to Checkout
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default Cart;
