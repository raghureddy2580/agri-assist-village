import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { cropDatabase } from '@/lib/cropDatabase';
import {
    ShoppingCart,
    MapPin,
    Phone,
    Mail,
    IndianRupee,
    Truck,
    Star,
    Search,
    Filter,
    Plus,
    MessageSquare,
    TrendingDown,
    Users
} from 'lucide-react';

// Mock marketplace data
const mockListings = [
    {
        id: 'listing_001',
        farmerId: 'farmer_001',
        farmerName: 'Rajesh Kumar',
        farmerLocation: 'Bangalore Rural, Karnataka',
        farmerPhone: '+91 9876543210',
        farmerEmail: 'rajesh.farmer@email.com',
        cropId: 'tomato',
        cropName: 'Tomato',
        quantity: 500,
        unit: 'kg',
        pricePerUnit: 25,
        totalPrice: 12500,
        quality: 'Grade A',
        harvestDate: '2024-09-10',
        description: 'Fresh organic tomatoes from our farm. Pesticide-free and ready for market.',
        images: ['🍅'],
        availableUntil: '2024-09-15',
        deliveryAvailable: true,
        negotiable: true,
        organic: true,
        createdAt: '2024-09-08T10:00:00Z'
    },
    {
        id: 'listing_002',
        farmerId: 'farmer_002',
        farmerName: 'Priya Sharma',
        farmerLocation: 'Kolar, Karnataka',
        farmerPhone: '+91 8765432109',
        farmerEmail: 'priya.farm@email.com',
        cropId: 'rice',
        cropName: 'Rice',
        quantity: 2000,
        unit: 'kg',
        pricePerUnit: 35,
        totalPrice: 70000,
        quality: 'Premium',
        harvestDate: '2024-09-05',
        description: 'High-quality basmati rice. Fresh harvest, excellent for export.',
        images: ['🌾'],
        availableUntil: '2024-09-20',
        deliveryAvailable: true,
        negotiable: true,
        organic: false,
        createdAt: '2024-09-07T14:30:00Z'
    },
    {
        id: 'listing_003',
        farmerId: 'farmer_003',
        farmerName: 'Amit Singh',
        farmerLocation: 'Tumkur, Karnataka',
        farmerPhone: '+91 7654321098',
        farmerEmail: 'amit.farmer@email.com',
        cropId: 'wheat',
        cropName: 'Wheat',
        quantity: 1500,
        unit: 'kg',
        pricePerUnit: 22,
        totalPrice: 33000,
        quality: 'Grade A',
        harvestDate: '2024-09-08',
        description: 'Premium quality wheat grains. Perfect for flour mills.',
        images: ['🌾'],
        availableUntil: '2024-09-18',
        deliveryAvailable: false,
        negotiable: true,
        organic: true,
        createdAt: '2024-09-06T09:15:00Z'
    }
];

// Indian buyer contacts
const indianBuyers = [
    {
        id: 'buyer_001',
        name: 'Delhi Fruits & Vegetables Co.',
        location: 'Delhi, India',
        phone: '+91 9876543211',
        email: 'contact@delhifruits.com',
        type: 'Wholesale Buyer',
        interestedCrops: ['tomato', 'potato', 'onion'],
        preferredPriceRange: '₹20-40/kg',
        buyingCapacity: '500-2000 kg/week'
    },
    {
        id: 'buyer_002',
        name: 'Mumbai Rice Traders',
        location: 'Mumbai, Maharashtra',
        phone: '+91 8765432110',
        email: 'info@mumbairice.com',
        type: 'Rice Exporter',
        interestedCrops: ['rice', 'wheat'],
        preferredPriceRange: '₹30-50/kg',
        buyingCapacity: '1000-5000 kg/week'
    },
    {
        id: 'buyer_003',
        name: 'Chennai Organic Foods',
        location: 'Chennai, Tamil Nadu',
        phone: '+91 7654321109',
        email: 'orders@chennaorganic.com',
        type: 'Organic Produce Buyer',
        interestedCrops: ['tomato', 'rice', 'wheat', 'maize'],
        preferredPriceRange: '₹25-45/kg',
        buyingCapacity: '300-1500 kg/week'
    },
    {
        id: 'buyer_004',
        name: 'Kolkata Grain Market',
        location: 'Kolkata, West Bengal',
        phone: '+91 6543211098',
        email: 'buyers@kolkatagrain.com',
        type: 'Grain Wholesale',
        interestedCrops: ['rice', 'wheat', 'maize'],
        preferredPriceRange: '₹22-38/kg',
        buyingCapacity: '2000-10000 kg/week'
    }
];

const Marketplace: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [listings, setListings] = useState(mockListings);
    const [filteredListings, setFilteredListings] = useState(mockListings);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        crop: '',
        location: '',
        priceRange: '',
        quality: '',
        organic: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedListing, setSelectedListing] = useState<any>(null);
    const [showBuyers, setShowBuyers] = useState(false);
    const [viewMode, setViewMode] = useState<'listings' | 'buyers'>('listings');

    const cropOptions = cropDatabase.map(crop => ({
        id: crop.id,
        name: crop.name,
        category: crop.category
    }));

    const locations = [
        'Bangalore Rural, Karnataka',
        'Bangalore Urban, Karnataka',
        'Kolar, Karnataka',
        'Tumkur, Karnataka',
        'Hassan, Karnataka',
        'Mandya, Karnataka'
    ];

    useEffect(() => {
        applyFilters();
    }, [listings, searchQuery, filters]);

    const applyFilters = () => {
        let filtered = listings;

        // Search query filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(listing =>
                listing.cropName.toLowerCase().includes(query) ||
                listing.farmerName.toLowerCase().includes(query) ||
                listing.description.toLowerCase().includes(query) ||
                listing.farmerLocation.toLowerCase().includes(query)
            );
        }

        // Crop filter
        if (filters.crop) {
            filtered = filtered.filter(listing => listing.cropId === filters.crop);
        }

        // Location filter
        if (filters.location) {
            filtered = filtered.filter(listing =>
                listing.farmerLocation.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Price range filter
        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number);
            filtered = filtered.filter(listing =>
                listing.pricePerUnit >= min && listing.pricePerUnit <= max
            );
        }

        // Quality filter
        if (filters.quality) {
            filtered = filtered.filter(listing => listing.quality === filters.quality);
        }

        // Organic filter
        if (filters.organic === 'organic') {
            filtered = filtered.filter(listing => listing.organic);
        } else if (filters.organic === 'conventional') {
            filtered = filtered.filter(listing => !listing.organic);
        }

        setFilteredListings(filtered);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            crop: '',
            location: '',
            priceRange: '',
            quality: '',
            organic: ''
        });
        setSearchQuery('');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getDaysLeft = (expiresAt: string) => {
        const today = new Date();
        const expiry = new Date(expiresAt);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? `${diffDays} days left` : 'Expired';
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="max-w-6xl mx-auto p-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
                        <p className="text-muted-foreground">You need to be logged in to access the marketplace.</p>
                        <Button onClick={() => navigate('/login')} className="mt-4">
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="max-w-6xl mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Agricultural Marketplace</h1>
                    <p className="text-muted-foreground">Connect directly with Indian buyers and eliminate middlemen costs</p>
                </div>

                {/* Problem Statement */}
                <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                    <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <TrendingDown className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-green-800 mb-2">Eliminate Middlemen Costs</h3>
                                <p className="text-green-700">
                                    Farmers lose 20-40% of their earnings to middlemen. Our marketplace connects you directly with verified Indian buyers
                                    who offer fair, affordable prices for your produce. List your crops and get contacted by genuine buyers across India.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* View Toggle */}
                <div className="flex items-center space-x-4 mb-6">
                    <Button
                        variant={viewMode === 'listings' ? 'default' : 'outline'}
                        onClick={() => setViewMode('listings')}
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Browse Listings
                    </Button>
                    <Button
                        variant={viewMode === 'buyers' ? 'default' : 'outline'}
                        onClick={() => setViewMode('buyers')}
                    >
                        <Users className="h-4 w-4 mr-2" />
                        Find Buyers
                    </Button>
                </div>

                {viewMode === 'listings' ? (
                    // Listings View
                    <>
                        {/* Search and Filters */}
                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Search Bar */}
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search crops, farmers, or locations..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    {/* Filter Toggle */}
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center space-x-2"
                                    >
                                        <Filter className="h-4 w-4" />
                                        <span>Filters</span>
                                    </Button>

                                    {/* Add Listing Button */}
                                    <Button onClick={() => navigate('/add-listing')} className="bg-green-600 hover:bg-green-700">
                                        <Plus className="h-4 w-4 mr-2" />
                                        List Produce
                                    </Button>
                                </div>

                                {/* Filters Panel */}
                                {showFilters && (
                                    <div className="mt-6 pt-6 border-t">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div>
                                                <Label htmlFor="crop-filter">Crop Type</Label>
                                                <Select value={filters.crop} onValueChange={(value) => handleFilterChange('crop', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="All crops" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {cropOptions.map((crop) => (
                                                            <SelectItem key={crop.id} value={crop.id}>
                                                                {crop.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="location-filter">Location</Label>
                                                <Select value={filters.location} onValueChange={(value) => handleFilterChange('location', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="All locations" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {locations.map((location) => (
                                                            <SelectItem key={location} value={location}>
                                                                {location}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="price-filter">Price Range (₹/kg)</Label>
                                                <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Any price" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0-20">Under ₹20</SelectItem>
                                                        <SelectItem value="20-40">₹20-40</SelectItem>
                                                        <SelectItem value="40-60">₹40-60</SelectItem>
                                                        <SelectItem value="60-100">Above ₹60</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="organic-filter">Type</Label>
                                                <Select value={filters.organic} onValueChange={(value) => handleFilterChange('organic', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="All types" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="">All types</SelectItem>
                                                        <SelectItem value="organic">Organic</SelectItem>
                                                        <SelectItem value="conventional">Conventional</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-4">
                                            <Button variant="outline" onClick={clearFilters}>
                                                Clear Filters
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Results Summary */}
                        <div className="mb-6">
                            <p className="text-muted-foreground">
                                Showing {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''}
                                {searchQuery && ` for "${searchQuery}"`}
                            </p>
                        </div>

                        {/* Listings Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredListings.length === 0 ? (
                                <div className="col-span-full">
                                    <Card>
                                        <CardContent className="text-center py-12">
                                            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <h3 className="text-lg font-medium mb-2">No listings found</h3>
                                            <p className="text-muted-foreground mb-4">
                                                Try adjusting your search criteria or filters
                                            </p>
                                            <Button onClick={clearFilters}>Clear Filters</Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                filteredListings.map((listing) => (
                                    <Card key={listing.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-4xl">{listing.images[0]}</span>
                                                    <div>
                                                        <h3 className="text-lg font-semibold">{listing.cropName}</h3>
                                                        <p className="text-sm text-muted-foreground">{listing.quality}</p>
                                                    </div>
                                                </div>
                                                {listing.organic && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Organic
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span>{listing.farmerLocation}</span>
                                                </div>

                                                <div className="flex items-center space-x-2 text-sm">
                                                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-semibold">₹{listing.pricePerUnit}/{listing.unit}</span>
                                                    <span className="text-muted-foreground">
                                                        ({listing.quantity} {listing.unit} available)
                                                    </span>
                                                </div>

                                                <div className="flex items-center space-x-2 text-sm">
                                                    <Truck className="h-4 w-4 text-muted-foreground" />
                                                    <span>{listing.deliveryAvailable ? 'Delivery available' : 'Pickup only'}</span>
                                                </div>
                                            </div>

                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                {listing.description}
                                            </p>

                                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                                <span>By {listing.farmerName}</span>
                                                <span className="text-orange-600">
                                                    {getDaysLeft(listing.availableUntil)}
                                                </span>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="flex-1">
                                                            <MessageSquare className="h-4 w-4 mr-1" />
                                                            Contact Farmer
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Contact {listing.farmerName}</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="space-y-4">
                                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                                <h4 className="font-medium mb-2">Farmer Details</h4>
                                                                <p className="text-sm"><strong>Name:</strong> {listing.farmerName}</p>
                                                                <p className="text-sm"><strong>Location:</strong> {listing.farmerLocation}</p>
                                                                <p className="text-sm"><strong>Crop:</strong> {listing.cropName} ({listing.quantity} {listing.unit})</p>
                                                                <p className="text-sm"><strong>Price:</strong> ₹{listing.pricePerUnit}/{listing.unit}</p>
                                                            </div>
                                                            <div className="p-4 bg-blue-50 rounded-lg">
                                                                <h4 className="font-medium mb-2">Contact Information</h4>
                                                                <p className="text-sm"><strong>Phone:</strong> {listing.farmerPhone}</p>
                                                                <p className="text-sm"><strong>Email:</strong> {listing.farmerEmail}</p>
                                                            </div>
                                                            <div className="p-4 bg-green-50 rounded-lg">
                                                                <h4 className="font-medium mb-2">Product Details</h4>
                                                                <p className="text-sm"><strong>Quality:</strong> {listing.quality}</p>
                                                                <p className="text-sm"><strong>Organic:</strong> {listing.organic ? 'Yes' : 'No'}</p>
                                                                <p className="text-sm"><strong>Negotiable:</strong> {listing.negotiable ? 'Yes' : 'No'}</p>
                                                                <p className="text-sm"><strong>Delivery:</strong> {listing.deliveryAvailable ? 'Available' : 'Pickup only'}</p>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                    Buy Now
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </>
                ) : (
                    // Buyers View
                    <>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">Verified Indian Buyers</h2>
                            <p className="text-muted-foreground">
                                Connect directly with buyers across India who are looking to purchase your produce at fair prices
                            </p>
                        </div>

                        {/* Buyers Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {indianBuyers.map((buyer) => (
                                <Card key={buyer.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold mb-1">{buyer.name}</h3>
                                                <p className="text-sm text-muted-foreground mb-2">{buyer.type}</p>
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span>{buyer.location}</span>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                                Verified
                                            </Badge>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            <div>
                                                <h4 className="text-sm font-medium mb-1">Interested Crops</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {buyer.interestedCrops.map((cropId) => {
                                                        const crop = cropOptions.find(c => c.id === cropId);
                                                        return (
                                                            <Badge key={cropId} variant="outline" className="text-xs">
                                                                {crop?.name || cropId}
                                                            </Badge>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium">Price Range:</span>
                                                    <p className="text-muted-foreground">{buyer.preferredPriceRange}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Capacity:</span>
                                                    <p className="text-muted-foreground">{buyer.buyingCapacity}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="flex-1">
                                                        <Phone className="h-4 w-4 mr-1" />
                                                        Contact
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Contact {buyer.name}</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="p-4 bg-gray-50 rounded-lg">
                                                            <h4 className="font-medium mb-2">Buyer Information</h4>
                                                            <p className="text-sm"><strong>Company:</strong> {buyer.name}</p>
                                                            <p className="text-sm"><strong>Type:</strong> {buyer.type}</p>
                                                            <p className="text-sm"><strong>Location:</strong> {buyer.location}</p>
                                                        </div>
                                                        <div className="p-4 bg-blue-50 rounded-lg">
                                                            <h4 className="font-medium mb-2">Contact Details</h4>
                                                            <p className="text-sm"><strong>Phone:</strong> {buyer.phone}</p>
                                                            <p className="text-sm"><strong>Email:</strong> {buyer.email}</p>
                                                        </div>
                                                        <div className="p-4 bg-green-50 rounded-lg">
                                                            <h4 className="font-medium mb-2">Buying Preferences</h4>
                                                            <p className="text-sm"><strong>Interested Crops:</strong> {buyer.interestedCrops.join(', ')}</p>
                                                            <p className="text-sm"><strong>Price Range:</strong> {buyer.preferredPriceRange}</p>
                                                            <p className="text-sm"><strong>Weekly Capacity:</strong> {buyer.buyingCapacity}</p>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                Send Inquiry
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                )}

                {/* Call to Action */}
                <Card className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                    <CardContent className="p-6 text-center">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                            {viewMode === 'listings' ? 'Ready to Sell Your Produce?' : 'Looking for Specific Buyers?'}
                        </h3>
                        <p className="text-blue-700 mb-4">
                            {viewMode === 'listings'
                                ? 'List your crops today and connect directly with Indian buyers at fair prices.'
                                : 'Contact us to find buyers for specific crops or regions.'
                            }
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            {viewMode === 'listings' ? 'List Your Produce' : 'Find More Buyers'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Marketplace;