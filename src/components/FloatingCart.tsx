import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, X } from 'lucide-react';
import Cart from './Cart';
import { useNavigate } from 'react-router-dom';

const FloatingCart: React.FC = () => {
    const { state } = useCart();
    const [showCart, setShowCart] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (state.items.length === 0) return;

        const productIds = state.items.map(item => item.id).join(',');
        const quantities = state.items.map(item => item.quantity).join(',');

        navigate(`/checkout?products=${productIds}&quantities=${quantities}&fromCart=true`);
        setShowCart(false);
    };

    return (
        <>
            {/* Floating Cart Button */}
            <div className="fixed bottom-6 right-6 z-40">
                <Button
                    onClick={() => setShowCart(!showCart)}
                    className="relative bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 shadow-lg"
                    size="lg"
                >
                    <ShoppingCart className="h-6 w-6" />
                    {state.totalItems > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center text-xs"
                        >
                            {state.totalItems}
                        </Badge>
                    )}
                </Button>
            </div>

            {/* Cart Sidebar */}
            {showCart && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)} />
                    <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold">Shopping Cart</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowCart(false)}
                                className="h-8 w-8 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="p-4 h-full overflow-y-auto">
                            <Cart onClose={() => setShowCart(false)} />
                        </div>
                        {state.items.length > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-semibold">Total: ₹{state.totalAmount + 50}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {state.totalItems} items
                                    </span>
                                </div>
                                <Button
                                    onClick={handleCheckout}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    Proceed to Checkout
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingCart;
