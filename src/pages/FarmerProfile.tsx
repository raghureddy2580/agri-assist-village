import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { cropDatabase } from '@/lib/cropDatabase';
import {
    User,
    MapPin,
    Tractor,
    Leaf,
    Star,
    Calendar,
    Phone,
    Mail,
    Award,
    TrendingUp
} from 'lucide-react';

const FarmerProfile: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        farmSize: '',
        farmingType: '',
        experience: '',
        crops: [] as string[],
        village: '',
        district: '',
        state: '',
        pincode: '',
        workTypes: [] as string[],
        skills: [] as string[],
        paymentMethod: '',
        accommodation: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const cropOptions = cropDatabase.map(crop => ({
        id: crop.id,
        name: crop.name,
        category: crop.category
    }));

    const skillOptions = [
        'crop_management', 'pest_control', 'irrigation', 'soil_management',
        'harvesting', 'equipment_operation', 'organic_farming', 'record_keeping'
    ];

    const workTypeOptions = ['daily_wage', 'contract', 'seasonal'];

    const districtOptions = [
        'Bangalore Rural', 'Bangalore Urban', 'Kolar', 'Chikkaballapur', 'Tumkur',
        'Hassan', 'Mandya', 'Mysore', 'Chamarajanagar', 'Ramanagara'
    ];

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleCropChange = (cropId: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            crops: checked
                ? [...prev.crops, cropId]
                : prev.crops.filter(c => c !== cropId)
        }));
    };

    const handleSkillChange = (skill: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            skills: checked
                ? [...prev.skills, skill]
                : prev.skills.filter(s => s !== skill)
        }));
    };

    const handleWorkTypeChange = (workType: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            workTypes: checked
                ? [...prev.workTypes, workType]
                : prev.workTypes.filter(w => w !== workType)
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.farmSize.trim()) newErrors.farmSize = 'Farm size is required';
        if (!formData.farmingType) newErrors.farmingType = 'Farming type is required';
        if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
        if (formData.crops.length === 0) newErrors.crops = 'At least one crop is required';
        if (!formData.village.trim()) newErrors.village = 'Village is required';
        if (!formData.district.trim()) newErrors.district = 'District is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Here you would typically send the data to your backend
        console.log('Farmer profile data:', formData);

        // For now, just show success and exit edit mode
        alert('Profile updated successfully!');
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="max-w-4xl mx-auto p-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
                        <p className="text-muted-foreground">You need to be logged in to manage your profile.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="max-w-4xl mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Farmer Profile</h1>
                    <p className="text-muted-foreground">Manage your farm details and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Summary */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <User className="h-10 w-10 text-green-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold mb-2">{formData.name || 'Your Name'}</h2>
                                    <div className="flex items-center justify-center space-x-1 mb-2">
                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                        <span className="text-sm text-muted-foreground">4.5 (42 jobs posted)</span>
                                    </div>
                                    <Badge variant="secondary" className="mb-4">Verified Farmer</Badge>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{formData.village || 'Location not set'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Tractor className="h-4 w-4 text-muted-foreground" />
                                        <span>{formData.farmSize ? `${formData.farmSize} acres` : 'Farm size not set'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Leaf className="h-4 w-4 text-muted-foreground" />
                                        <span>{formData.experience ? `${formData.experience} years experience` : 'Experience not set'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{formData.phone || 'Phone not set'}</span>
                                    </div>
                                </div>

                                {!isEditing && (
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full mt-4"
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Farm Summary */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Farm Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-medium mb-2">Crops Grown</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {formData.crops.length > 0 ? (
                                                formData.crops.slice(0, 3).map((cropId) => {
                                                    const crop = cropOptions.find(c => c.id === cropId);
                                                    return (
                                                        <Badge key={cropId} variant="outline" className="text-xs">
                                                            {crop?.name || cropId}
                                                        </Badge>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-sm text-muted-foreground">No crops added yet</p>
                                            )}
                                            {formData.crops.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{formData.crops.length - 3} more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-2">Farming Type</h4>
                                        <p className="text-sm text-muted-foreground capitalize">
                                            {formData.farmingType || 'Not specified'}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-2">Work Types Needed</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {formData.workTypes.length > 0 ? (
                                                formData.workTypes.map((workType) => (
                                                    <Badge key={workType} variant="outline" className="text-xs capitalize">
                                                        {workType.replace('_', ' ')}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground">No work types specified</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Profile Details Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit}>
                            {/* Personal Information */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <User className="h-5 w-5" />
                                        <span>Personal Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                disabled={!isEditing}
                                                className={errors.name ? 'border-red-500' : ''}
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                disabled={!isEditing}
                                                className={errors.phone ? 'border-red-500' : ''}
                                            />
                                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="experience">Years of Farming Experience *</Label>
                                            <Input
                                                id="experience"
                                                type="number"
                                                value={formData.experience}
                                                onChange={(e) => handleInputChange('experience', e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="e.g., 15"
                                                className={errors.experience ? 'border-red-500' : ''}
                                            />
                                            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Farm Details */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Tractor className="h-5 w-5" />
                                        <span>Farm Details</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="farmSize">Farm Size (acres) *</Label>
                                            <Input
                                                id="farmSize"
                                                type="number"
                                                value={formData.farmSize}
                                                onChange={(e) => handleInputChange('farmSize', e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="e.g., 25"
                                                className={errors.farmSize ? 'border-red-500' : ''}
                                            />
                                            {errors.farmSize && <p className="text-red-500 text-sm mt-1">{errors.farmSize}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="farmingType">Farming Type *</Label>
                                            <Select
                                                value={formData.farmingType}
                                                onValueChange={(value) => handleInputChange('farmingType', value)}
                                                disabled={!isEditing}
                                            >
                                                <SelectTrigger className={errors.farmingType ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Select farming type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="organic">Organic Farming</SelectItem>
                                                    <SelectItem value="conventional">Conventional Farming</SelectItem>
                                                    <SelectItem value="mixed">Mixed Farming</SelectItem>
                                                    <SelectItem value="sustainable">Sustainable Farming</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.farmingType && <p className="text-red-500 text-sm mt-1">{errors.farmingType}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Location */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <MapPin className="h-5 w-5" />
                                        <span>Farm Location</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="village">Village *</Label>
                                            <Input
                                                id="village"
                                                value={formData.village}
                                                onChange={(e) => handleInputChange('village', e.target.value)}
                                                disabled={!isEditing}
                                                className={errors.village ? 'border-red-500' : ''}
                                            />
                                            {errors.village && <p className="text-red-500 text-sm mt-1">{errors.village}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="district">District *</Label>
                                            <Select
                                                value={formData.district}
                                                onValueChange={(value) => handleInputChange('district', value)}
                                                disabled={!isEditing}
                                            >
                                                <SelectTrigger className={errors.district ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Select district" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {districtOptions.map((district) => (
                                                        <SelectItem key={district} value={district}>
                                                            {district}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="state">State *</Label>
                                            <Input
                                                id="state"
                                                value={formData.state}
                                                onChange={(e) => handleInputChange('state', e.target.value)}
                                                disabled={!isEditing}
                                                className={errors.state ? 'border-red-500' : ''}
                                            />
                                            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="pincode">Pincode</Label>
                                            <Input
                                                id="pincode"
                                                value={formData.pincode}
                                                onChange={(e) => handleInputChange('pincode', e.target.value)}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Crops and Skills */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>Crops & Skills</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <Label className="text-base font-medium mb-3 block">Crops You Grow *</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                                            {cropOptions.map((crop) => (
                                                <div key={crop.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`crop-${crop.id}`}
                                                        checked={formData.crops.includes(crop.id)}
                                                        onCheckedChange={(checked) => handleCropChange(crop.id, checked as boolean)}
                                                        disabled={!isEditing}
                                                    />
                                                    <Label htmlFor={`crop-${crop.id}`} className="text-sm">
                                                        {crop.name}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.crops && <p className="text-red-500 text-sm mt-2">{errors.crops}</p>}
                                    </div>

                                    <div>
                                        <Label className="text-base font-medium mb-3 block">Your Farming Skills</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {skillOptions.map((skill) => (
                                                <div key={skill} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`skill-${skill}`}
                                                        checked={formData.skills.includes(skill)}
                                                        onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
                                                        disabled={!isEditing}
                                                    />
                                                    <Label htmlFor={`skill-${skill}`} className="text-sm capitalize">
                                                        {skill.replace('_', ' ')}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Work Preferences */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <TrendingUp className="h-5 w-5" />
                                        <span>Work Preferences</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <Label className="text-base font-medium mb-3 block">Work Types You Need</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {workTypeOptions.map((workType) => (
                                                <div key={workType} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`worktype-${workType}`}
                                                        checked={formData.workTypes.includes(workType)}
                                                        onCheckedChange={(checked) => handleWorkTypeChange(workType, checked as boolean)}
                                                        disabled={!isEditing}
                                                    />
                                                    <Label htmlFor={`worktype-${workType}`} className="text-sm capitalize">
                                                        {workType.replace('_', ' ')}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="paymentMethod">Preferred Payment Method</Label>
                                            <Select
                                                value={formData.paymentMethod}
                                                onValueChange={(value) => handleInputChange('paymentMethod', value)}
                                                disabled={!isEditing}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select payment method" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="daily">Daily</SelectItem>
                                                    <SelectItem value="weekly">Weekly</SelectItem>
                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center space-x-2 pt-8">
                                            <Checkbox
                                                id="accommodation"
                                                checked={formData.accommodation}
                                                onCheckedChange={(checked) => handleInputChange('accommodation', checked)}
                                                disabled={!isEditing}
                                            />
                                            <Label htmlFor="accommodation">Can provide accommodation for workers</Label>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                        Save Profile
                                    </Button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerProfile;