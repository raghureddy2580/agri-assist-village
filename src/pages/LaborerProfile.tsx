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
import { User, MapPin, Briefcase, Star, Calendar, Phone, Mail, Award } from 'lucide-react';

const LaborerProfile: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        age: '',
        gender: '',
        education: '',
        languages: [] as string[],
        village: '',
        district: '',
        state: '',
        pincode: '',
        totalYears: '',
        skills: [] as string[],
        certifications: [] as string[],
        workType: [] as string[],
        availableDays: [] as string[],
        preferredLocations: [] as string[],
        travelWillingness: '',
        minWage: '',
        maxDistance: '',
        accommodation: false,
        food: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const skillOptions = [
        'harvesting', 'plowing', 'irrigation', 'pest_control', 'planting',
        'weeding', 'fertilizing', 'threshing', 'transport', 'equipment_operation'
    ];

    const languageOptions = ['Hindi', 'English', 'Kannada', 'Telugu', 'Tamil', 'Marathi', 'Gujarati', 'Punjabi'];

    const dayOptions = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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

    const handleSkillChange = (skill: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            skills: checked
                ? [...prev.skills, skill]
                : prev.skills.filter(s => s !== skill)
        }));
    };

    const handleLanguageChange = (language: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            languages: checked
                ? [...prev.languages, language]
                : prev.languages.filter(l => l !== language)
        }));
    };

    const handleDayChange = (day: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            availableDays: checked
                ? [...prev.availableDays, day]
                : prev.availableDays.filter(d => d !== day)
        }));
    };

    const handleLocationChange = (location: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            preferredLocations: checked
                ? [...prev.preferredLocations, location]
                : prev.preferredLocations.filter(l => l !== location)
        }));
    };

    const handleWorkTypeChange = (workType: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            workType: checked
                ? [...prev.workType, workType]
                : prev.workType.filter(w => w !== workType)
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.age || parseInt(formData.age) < 18) newErrors.age = 'Valid age (18+) is required';
        if (!formData.village.trim()) newErrors.village = 'Village is required';
        if (!formData.district.trim()) newErrors.district = 'District is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';
        if (formData.languages.length === 0) newErrors.languages = 'At least one language is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Here you would typically send the data to your backend
        console.log('Profile data:', formData);

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
                    <h1 className="text-3xl font-bold mb-2">Laborer Profile</h1>
                    <p className="text-muted-foreground">Manage your profile and job preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Summary */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <User className="h-10 w-10 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold mb-2">{formData.name || 'Your Name'}</h2>
                                    <div className="flex items-center justify-center space-x-1 mb-2">
                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                        <span className="text-sm text-muted-foreground">4.5 (28 jobs)</span>
                                    </div>
                                    <Badge variant="secondary" className="mb-4">Verified Profile</Badge>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{formData.village || 'Location not set'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{formData.phone || 'Phone not set'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        <span>{formData.totalYears ? `${formData.totalYears} years experience` : 'Experience not set'}</span>
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

                        {/* Skills Summary */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Skills</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {formData.skills.length > 0 ? (
                                        formData.skills.map((skill) => (
                                            <Badge key={skill} variant="outline" className="capitalize">
                                                {skill.replace('_', ' ')}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No skills added yet</p>
                                    )}
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

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                            <Label htmlFor="age">Age *</Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                value={formData.age}
                                                onChange={(e) => handleInputChange('age', e.target.value)}
                                                disabled={!isEditing}
                                                className={errors.age ? 'border-red-500' : ''}
                                            />
                                            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="gender">Gender</Label>
                                            <Select
                                                value={formData.gender}
                                                onValueChange={(value) => handleInputChange('gender', value)}
                                                disabled={!isEditing}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="education">Education</Label>
                                            <Select
                                                value={formData.education}
                                                onValueChange={(value) => handleInputChange('education', value)}
                                                disabled={!isEditing}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select education" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="illiterate">Illiterate</SelectItem>
                                                    <SelectItem value="primary">Primary School</SelectItem>
                                                    <SelectItem value="secondary">Secondary School</SelectItem>
                                                    <SelectItem value="higher_secondary">Higher Secondary</SelectItem>
                                                    <SelectItem value="graduate">Graduate</SelectItem>
                                                    <SelectItem value="post_graduate">Post Graduate</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="totalYears">Years of Experience</Label>
                                            <Input
                                                id="totalYears"
                                                type="number"
                                                value={formData.totalYears}
                                                onChange={(e) => handleInputChange('totalYears', e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="e.g., 5"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Location */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <MapPin className="h-5 w-5" />
                                        <span>Location</span>
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

                            {/* Skills and Languages */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>Skills & Languages</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <Label className="text-base font-medium mb-3 block">Skills *</Label>
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
                                        {errors.skills && <p className="text-red-500 text-sm mt-2">{errors.skills}</p>}
                                    </div>

                                    <div>
                                        <Label className="text-base font-medium mb-3 block">Languages *</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {languageOptions.map((language) => (
                                                <div key={language} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`lang-${language}`}
                                                        checked={formData.languages.includes(language)}
                                                        onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                                                        disabled={!isEditing}
                                                    />
                                                    <Label htmlFor={`lang-${language}`} className="text-sm">
                                                        {language}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.languages && <p className="text-red-500 text-sm mt-2">{errors.languages}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Work Preferences */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Briefcase className="h-5 w-5" />
                                        <span>Work Preferences</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <Label className="text-base font-medium mb-3 block">Work Types</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {['daily_wage', 'contract', 'seasonal'].map((workType) => (
                                                <div key={workType} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`worktype-${workType}`}
                                                        checked={formData.workType.includes(workType)}
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

                                    <div>
                                        <Label className="text-base font-medium mb-3 block">Available Days</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {dayOptions.map((day) => (
                                                <div key={day} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`day-${day}`}
                                                        checked={formData.availableDays.includes(day)}
                                                        onCheckedChange={(checked) => handleDayChange(day, checked as boolean)}
                                                        disabled={!isEditing}
                                                    />
                                                    <Label htmlFor={`day-${day}`} className="text-sm capitalize">
                                                        {day}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-base font-medium mb-3 block">Preferred Locations</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {districtOptions.slice(0, 6).map((location) => (
                                                <div key={location} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`location-${location}`}
                                                        checked={formData.preferredLocations.includes(location)}
                                                        onCheckedChange={(checked) => handleLocationChange(location, checked as boolean)}
                                                        disabled={!isEditing}
                                                    />
                                                    <Label htmlFor={`location-${location}`} className="text-sm">
                                                        {location}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="travelWillingness">Travel Willingness</Label>
                                            <Select
                                                value={formData.travelWillingness}
                                                onValueChange={(value) => handleInputChange('travelWillingness', value)}
                                                disabled={!isEditing}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select willingness" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="local">Local only</SelectItem>
                                                    <SelectItem value="district">Within district</SelectItem>
                                                    <SelectItem value="state">Within state</SelectItem>
                                                    <SelectItem value="anywhere">Anywhere</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="minWage">Minimum Daily Wage (₹)</Label>
                                            <Input
                                                id="minWage"
                                                type="number"
                                                value={formData.minWage}
                                                onChange={(e) => handleInputChange('minWage', e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="300"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="maxDistance">Maximum Distance (km)</Label>
                                            <Input
                                                id="maxDistance"
                                                type="number"
                                                value={formData.maxDistance}
                                                onChange={(e) => handleInputChange('maxDistance', e.target.value)}
                                                disabled={!isEditing}
                                                placeholder="50"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="accommodation"
                                                    checked={formData.accommodation}
                                                    onCheckedChange={(checked) => handleInputChange('accommodation', checked)}
                                                    disabled={!isEditing}
                                                />
                                                <Label htmlFor="accommodation">Willing to work with accommodation</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="food"
                                                    checked={formData.food}
                                                    onCheckedChange={(checked) => handleInputChange('food', checked)}
                                                    disabled={!isEditing}
                                                />
                                                <Label htmlFor="food">Food provided</Label>
                                            </div>
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

export default LaborerProfile;