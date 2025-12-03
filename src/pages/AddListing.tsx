import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import Header from '@/components/Header';
import { cropDatabase } from '@/lib/cropDatabase';
import { saveProduceListing } from '@/lib/produceStorage';
import {
    ArrowLeft,
    Upload,
    MapPin,
    Calendar,
    DollarSign,
    Package,
    Leaf,
    Truck
} from 'lucide-react';

const AddListing: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        cropId: '',
        quantity: '',
        unit: 'kg',
        pricePerUnit: '',
        quality: 'Grade A',
        harvestDate: '',
        description: '',
        availableUntil: '',
        deliveryAvailable: false,
        negotiable: true,
        organic: false,
        village: '',
        district: '',
        state: 'Karnataka'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Indian states for location selection
    const indianStates = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ];

    // Karnataka districts
    const karnatakaDistricts = [
        'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban',
        'Bidar', 'Chamarajanagar', 'Chikballapur', 'Chikkamagaluru', 'Chitradurga',
        'Dakshina Kannada', 'Davangere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri',
        'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur',
        'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'
    ];

    const cropOptions = cropDatabase.map(crop => ({
        id: crop.id,
        name: crop.name,
        category: crop.category
    }));

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            showToast({
                type: 'error',
                title: 'Authentication Required',
                message: 'Please login to list your produce.',
                duration: 4000
            });
            navigate('/login');
            return;
        }

        // Validation
        if (!formData.cropId || !formData.quantity || !formData.pricePerUnit ||
            !formData.harvestDate || !formData.availableUntil || !formData.village ||
            !formData.district) {
            showToast({
                type: 'error',
                title: 'Missing Information',
                message: 'Please fill in all required fields.',
                duration: 4000
            });
            return;
        }

        const quantity = parseFloat(formData.quantity);
        const pricePerUnit = parseFloat(formData.pricePerUnit);

        if (quantity <= 0 || pricePerUnit <= 0) {
            showToast({
                type: 'error',
                title: 'Invalid Values',
                message: 'Quantity and price must be greater than zero.',
                duration: 4000
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const selectedCrop = cropDatabase.find(crop => crop.id === formData.cropId);

            const listingData = {
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                userPhone: user.phone || '',
                cropId: formData.cropId,
                cropName: selectedCrop?.name || formData.cropId,
                quantity,
                unit: formData.unit,
                pricePerUnit,
                quality: formData.quality,
                harvestDate: formData.harvestDate,
                description: formData.description || `${selectedCrop?.name || 'Produce'} available for sale`,
                images: selectedCrop?.images || ['🌾'],
                availableUntil: formData.availableUntil,
                deliveryAvailable: formData.deliveryAvailable,
                negotiable: formData.negotiable,
                organic: formData.organic,
                village: formData.village,
                district: formData.district,
                state: formData.state
            };

            const savedListing = saveProduceListing(listingData);

            showToast({
                type: 'success',
                title: 'Listing Created Successfully!',
                message: `Your ${selectedCrop?.name || 'produce'} listing has been created and is now visible to buyers.`,
                duration: 5000
            });

            // Navigate back to marketplace
            navigate('/marketplace');

        } catch (error) {
            console.error('Error creating listing:', error);
            showToast({
                type: 'error',
                title: 'Error Creating Listing',
                message: 'There was an error creating your listing. Please try again.',
                duration: 4000
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="max-w-4xl mx-auto p-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
                        <p className="text-muted-foreground">You need to be logged in to list your produce.</p>
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
            <div className="max-w-4xl mx-auto p-8">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/marketplace')}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Marketplace
                    </Button>
                    <h1 className="text-3xl font-bold mb-2">List Your Produce</h1>
                    <p className="text-muted-foreground">
                        Connect directly with Indian buyers and eliminate middlemen costs
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Product Details */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Package className="h-5 w-5" />
                                        <span>Product Details</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="crop">Crop Type *</Label>
                                        <Select
                                            value={formData.cropId}
                                            onValueChange={(value) => handleInputChange('cropId', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select crop type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cropOptions.map((crop) => (
                                                    <SelectItem key={crop.id} value={crop.id}>
                                                        {crop.name} ({crop.category})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="quantity">Quantity *</Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                value={formData.quantity}
                                                onChange={(e) => handleInputChange('quantity', e.target.value)}
                                                placeholder="e.g., 500"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="unit">Unit</Label>
                                            <Select
                                                value={formData.unit}
                                                onValueChange={(value) => handleInputChange('unit', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="kg">kg</SelectItem>
                                                    <SelectItem value="quintal">quintal</SelectItem>
                                                    <SelectItem value="ton">ton</SelectItem>
                                                    <SelectItem value="pieces">pieces</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="price">Price per Unit (₹) *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.pricePerUnit}
                                            onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                                            placeholder="e.g., 25.00"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="quality">Quality Grade</Label>
                                        <Select
                                            value={formData.quality}
                                            onValueChange={(value) => handleInputChange('quality', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Premium">Premium</SelectItem>
                                                <SelectItem value="Grade A">Grade A</SelectItem>
                                                <SelectItem value="Grade B">Grade B</SelectItem>
                                                <SelectItem value="Standard">Standard</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="harvestDate">Harvest Date *</Label>
                                            <Input
                                                id="harvestDate"
                                                type="date"
                                                value={formData.harvestDate}
                                                onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="availableUntil">Available Until *</Label>
                                            <Input
                                                id="availableUntil"
                                                type="date"
                                                value={formData.availableUntil}
                                                onChange={(e) => handleInputChange('availableUntil', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder="Describe your produce, farming methods, special features..."
                                            rows={3}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Options */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Options</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="organic"
                                            checked={formData.organic}
                                            onCheckedChange={(checked) => handleInputChange('organic', checked)}
                                        />
                                        <Label htmlFor="organic" className="flex items-center space-x-2">
                                            <Leaf className="h-4 w-4 text-green-600" />
                                            <span>Organic / Chemical-free farming</span>
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="negotiable"
                                            checked={formData.negotiable}
                                            onCheckedChange={(checked) => handleInputChange('negotiable', checked)}
                                        />
                                        <Label htmlFor="negotiable">Price is negotiable</Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="delivery"
                                            checked={formData.deliveryAvailable}
                                            onCheckedChange={(checked) => handleInputChange('deliveryAvailable', checked)}
                                        />
                                        <Label htmlFor="delivery" className="flex items-center space-x-2">
                                            <Truck className="h-4 w-4 text-blue-600" />
                                            <span>Delivery available</span>
                                        </Label>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Location & Summary */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <MapPin className="h-5 w-5" />
                                        <span>Location Details</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="state">State</Label>
                                        <Select
                                            value={formData.state}
                                            onValueChange={(value) => handleInputChange('state', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {indianStates.map((state) => (
                                                    <SelectItem key={state} value={state}>
                                                        {state}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="district">District *</Label>
                                        <Select
                                            value={formData.district}
                                            onValueChange={(value) => handleInputChange('district', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select district" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {karnatakaDistricts.map((district) => (
                                                    <SelectItem key={district} value={district}>
                                                        {district}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="village">Village/Town *</Label>
                                        <Input
                                            id="village"
                                            value={formData.village}
                                            onChange={(e) => handleInputChange('village', e.target.value)}
                                            placeholder="Enter village or town name"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Listing Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Listing Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Crop:</span>
                                            <span className="font-medium">
                                                {cropDatabase.find(c => c.id === formData.cropId)?.name || 'Not selected'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Quantity:</span>
                                            <span className="font-medium">
                                                {formData.quantity || '0'} {formData.unit}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Price per unit:</span>
                                            <span className="font-medium">
                                                ₹{formData.pricePerUnit || '0'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Total value:</span>
                                            <span className="font-bold text-green-600">
                                                ₹{(parseFloat(formData.quantity || '0') * parseFloat(formData.pricePerUnit || '0')).toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Quality:</span>
                                            <span className="font-medium">{formData.quality}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Organic:</span>
                                            <span className="font-medium">{formData.organic ? 'Yes' : 'No'}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Negotiable:</span>
                                            <span className="font-medium">{formData.negotiable ? 'Yes' : 'No'}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
                            </Button>
                        </div>
                    </div>
                </form>

                {/* Developer Info */}
                <Card className="mt-8 bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Developer Note:</strong> All produce listings are stored locally and logged to the browser console for development visibility.
                            Use <code className="bg-blue-100 px-1 rounded">window.produceListingDebug.logAll()</code> in the console to view all listings.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AddListing;
