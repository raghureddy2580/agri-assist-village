import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, Phone, MessageCircle, Truck, Shield, Leaf } from 'lucide-react';
import DeliveryCalculator from './DeliveryCalculator';

interface ProductDetailsModalProps {
    product: any;
    isOpen: boolean;
    onClose: () => void;
    onBuy: (product: any) => void;
    onAddToCart: (product: any) => void;
    userLocation: string;
    quantity: number;
    onQuantityChange: (quantity: number) => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
    product,
    isOpen,
    onClose,
    onBuy,
    onAddToCart,
    userLocation,
    quantity,
    onQuantityChange
}) => {
    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-3">
                        <span className="text-3xl">{product.image}</span>
                        <div>
                            <h2 className="text-2xl font-bold">{product.name}</h2>
                            <p className="text-sm text-muted-foreground">by {product.farmer}</p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Product Image and Basic Info */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-8 rounded-lg text-center">
                            <span className="text-8xl">{product.image}</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-green-600">{product.price}</span>
                                <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span className="font-semibold">{product.rating}</span>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <Badge variant="secondary">{product.category}</Badge>
                                <Badge variant="outline">{product.quality}</Badge>
                            </div>

                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{product.location.city}, {product.location.area}</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Details and Actions */}
                    <div className="space-y-6">
                        {/* Quantity Selector */}
                        <div>
                            <h3 className="font-semibold mb-3">Select Quantity</h3>
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    className="h-10 w-10 p-0"
                                >
                                    -
                                </Button>
                                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onQuantityChange(quantity + 1)}
                                    className="h-10 w-10 p-0"
                                >
                                    +
                                </Button>
                                <span className="text-muted-foreground">kg</span>
                            </div>
                        </div>

                        {/* Delivery Information */}
                        <DeliveryCalculator
                            userLocation={userLocation}
                            farmerLocation={`${product.location.city}, ${product.location.area}`}
                            distance={product.distance}
                        />

                        {/* Product Description */}
                        {product.description && (
                            <div className="space-y-2">
                                <h3 className="font-semibold">Description</h3>
                                <p className="text-sm text-muted-foreground">{product.description}</p>
                            </div>
                        )}

                        {/* Product Specifications */}
                        {product.specifications && (
                            <div className="space-y-3">
                                <h3 className="font-semibold">Specifications</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                            <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                            <span className="font-medium">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Product Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Product Information</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Available Quantity:</span>
                                    <span className="font-medium">{product.availableQuantity || product.quantity} kg</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Category:</span>
                                    <span className="font-medium">{product.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Quality Grade:</span>
                                    <span className="font-medium">{product.quality}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Farmer Rating:</span>
                                    <div className="flex items-center space-x-1">
                                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                        <span className="font-medium">{product.rating}/5</span>
                                    </div>
                                </div>
                                {product.harvestDate && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Harvest Date:</span>
                                        <span className="font-medium">{new Date(product.harvestDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {product.certification && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Certification:</span>
                                        <Badge variant="secondary" className="text-xs">{product.certification}</Badge>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">Features</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center space-x-2 text-sm">
                                    <Leaf className="h-4 w-4 text-green-600" />
                                    <span>Fresh & Organic</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <Truck className="h-4 w-4 text-blue-600" />
                                    <span>Fast Delivery</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <Shield className="h-4 w-4 text-purple-600" />
                                    <span>Quality Assured</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <MapPin className="h-4 w-4 text-red-600" />
                                    <span>Local Farmer</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <div className="flex space-x-3">
                                <Button
                                    onClick={() => onBuy(product)}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
                                >
                                    Buy Now - ₹{parseInt(product.price.replace('₹', '')) * quantity}
                                </Button>
                                <Button
                                    onClick={() => onAddToCart(product)}
                                    variant="outline"
                                    className="flex-1 py-3"
                                >
                                    Add to Cart
                                </Button>
                            </div>

                            <div className="flex space-x-3">
                                <Button variant="outline" className="flex-1">
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Message Farmer
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Call Farmer
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDetailsModal;
