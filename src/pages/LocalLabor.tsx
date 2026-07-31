import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { sampleLabourers, LabourerProfile, createConnection } from '@/lib/labourDatabase';
import {
    MapPin,
    Users,
    Star,
    Phone,
    Calendar,
    Clock,
    CheckCircle,
    AlertTriangle,
    UserCheck,
    MessageSquare
} from 'lucide-react';

const LocalLabour: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [selectedLocation, setSelectedLocation] = useState({
        district: '',
        village: ''
    });
    const [availableLabourers, setAvailableLabourers] = useState<LabourerProfile[]>([]);
    const [filteredLabourers, setFilteredLabourers] = useState<LabourerProfile[]>([]);
    const [selectedLabourer, setSelectedLabourer] = useState<LabourerProfile | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<Record<string, string>>({});

    const districts = [
        'Bangalore Rural', 'Bangalore Urban', 'Kolar', 'Chikkaballapur', 'Tumkur',
        'Hassan', 'Mandya', 'Mysore', 'Chamarajanagar', 'Ramanagara'
    ];

    const villagesByDistrict: Record<string, string[]> = {
        'Bangalore Rural': ['Whitefield', 'Sarjapur', 'Electronic City', 'Marathahalli', 'Koramangala'],
        'Bangalore Urban': ['Rajajinagar', 'Malleshwaram', 'Basavanagudi', 'Jayanagar', 'Indiranagar'],
        'Kolar': ['Kolar Town', 'Mulbagal', 'Malur', 'Bangarpet', 'Srinivaspur'],
        'Chikkaballapur': ['Chikkaballapur Town', 'Gudibanda', 'Bagepalli', 'Chintamani', 'Gauribidanur'],
        'Tumkur': ['Tumkur Town', 'Tiptur', 'Gubbi', 'Kunigal', 'Madhugiri']
    };

    useEffect(() => {
        // Load available labourers
        const verifiedLabourers = sampleLabourers.filter(labourer => labourer.profileVerified);
        setAvailableLabourers(verifiedLabourers);
        setFilteredLabourers(verifiedLabourers);
    }, []);

    const handleLocationChange = (field: 'district' | 'village', value: string) => {
        const newLocation = { ...selectedLocation, [field]: value };

        if (field === 'district') {
            newLocation.village = ''; // Reset village when district changes
        }

        setSelectedLocation(newLocation);

        // Filter labourers by location
        let filtered = availableLabourers;

        if (newLocation.district) {
            filtered = filtered.filter(labourer =>
                labourer.location.district.toLowerCase().includes(newLocation.district.toLowerCase())
            );
        }

        if (newLocation.village) {
            filtered = filtered.filter(labourer =>
                labourer.location.village.toLowerCase().includes(newLocation.village.toLowerCase())
            );
        }

        setFilteredLabourers(filtered);
    };

    const handleConnect = (labourerId: string) => {
        if (!user) return;

        // Create connection
        const connection = createConnection(user.id, labourerId, 'local_labour', 'farmer', 'Local labour connection');

        // Update connection status
        setConnectionStatus(prev => ({
            ...prev,
            [labourerId]: 'pending'
        }));

        alert('Connection request sent successfully!');
    };

    const getAvailabilityStatus = (labourer: LabourerProfile) => {
        const currentHour = new Date().getHours();
        const availableDays = labourer.availability.availableDays;
        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        const isAvailableToday = availableDays.includes(currentDay);
        const isWorkingHours = currentHour >= 6 && currentHour <= 18; // 6 AM to 6 PM

        if (isAvailableToday && isWorkingHours) {
            return { status: 'available', color: 'text-green-600 bg-green-100', text: 'Available Now' };
        } else if (isAvailableToday) {
            return { status: 'available_today', color: 'text-blue-600 bg-blue-100', text: 'Available Today' };
        } else {
            return { status: 'unavailable', color: 'text-gray-600 bg-gray-100', text: 'Not Available Today' };
        }
    };

    const getDistance = (labourerLocation: string, farmerLocation: string) => {
        // Simple distance calculation (in a real app, you'd use geolocation API)
        if (labourerLocation === farmerLocation) return '0.5 km';
        return '2-5 km'; // Mock distance
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="max-w-6xl mx-auto p-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
                        <p className="text-muted-foreground">You need to be logged in to access local labour information.</p>
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
                    <h1 className="text-3xl font-bold mb-2">Local Labour Availability</h1>
                    <p className="text-muted-foreground">Find available workers in your area to complete your farming work on time</p>
                </div>

                {/* Problem Statement */}
                <Card className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                    <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-orange-800 mb-2">Solve Labour Shortage Problems</h3>
                                <p className="text-orange-700">
                                    Many farmers face delays in harvesting and other farming activities due to labour shortages.
                                    Our platform connects you with verified, available workers in your local area to ensure timely completion of your farming work.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Location Filter */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5" />
                            <span>Find Workers in Your Area</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">District</label>
                                <Select value={selectedLocation.district} onValueChange={(value) => handleLocationChange('district', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your district" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {districts.map((district) => (
                                            <SelectItem key={district} value={district}>
                                                {district}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Village (Optional)</label>
                                <Select
                                    value={selectedLocation.village}
                                    onValueChange={(value) => handleLocationChange('village', value)}
                                    disabled={!selectedLocation.district}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your village" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedLocation.district && villagesByDistrict[selectedLocation.district]?.map((village) => (
                                            <SelectItem key={village} value={village}>
                                                {village}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                                <strong>📍 Location Selected:</strong> {selectedLocation.district || 'Select district'}
                                {selectedLocation.village && `, ${selectedLocation.village}`}
                            </p>
                            <p className="text-sm text-blue-600 mt-1">
                                Showing {filteredLabourers.length} available worker{filteredLabourers.length !== 1 ? 's' : ''} in this area
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Available Labourers */}
                <div className="space-y-6">
                    {filteredLabourers.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No workers found in this area</h3>
                                <p className="text-muted-foreground mb-4">
                                    Try selecting a different location or check back later.
                                </p>
                                <Button onClick={() => navigate('/post-job')}>
                                    Post a Job Instead
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {/* Summary Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-green-600">{filteredLabourers.length}</div>
                                        <p className="text-sm text-muted-foreground">Available Workers</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {filteredLabourers.filter(l => getAvailabilityStatus(l).status === 'available').length}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Available Now</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {filteredLabourers.filter(l => l.workExperience.totalYears >= 3).length}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Experienced Workers</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Labourer Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredLabourers.map((labourer) => {
                                    const availability = getAvailabilityStatus(labourer);
                                    const connectionKey = labourer.id;
                                    const status = connectionStatus[connectionKey] || 'none';

                                    return (
                                        <Card key={labourer.id} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-start space-x-3">
                                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <span className="text-blue-600 font-semibold">
                                                                {labourer.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold">{labourer.name}</h3>
                                                            <div className="flex items-center space-x-2 mt-1">
                                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                                <span className="text-sm text-muted-foreground">{labourer.rating}</span>
                                                                <span className="text-sm text-muted-foreground">•</span>
                                                                <span className="text-sm text-muted-foreground">
                                                                    {labourer.workExperience.totalYears} years exp.
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${availability.color}`}>
                                                        {availability.text}
                                                    </div>
                                                </div>

                                                <div className="space-y-3 mb-4">
                                                    <div className="flex items-center space-x-2 text-sm">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span>{labourer.location.village}, {labourer.location.district}</span>
                                                        <span className="text-muted-foreground">•</span>
                                                        <span className="text-green-600 font-medium">
                                                            {getDistance(labourer.location.village, selectedLocation.village || selectedLocation.district)}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center space-x-2 text-sm">
                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                        <span>{labourer.phone}</span>
                                                    </div>

                                                    <div className="flex items-center space-x-2 text-sm">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>Available: {labourer.availability.availableDays.slice(0, 3).join(', ')}</span>
                                                    </div>
                                                </div>

                                                {/* Skills */}
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium mb-2">Skills</h4>
                                                    <div className="flex flex-wrap gap-1">
                                                        {labourer.workExperience.skills.slice(0, 4).map((skill) => (
                                                            <Badge key={skill} variant="outline" className="text-xs capitalize">
                                                                {skill.replace('_', ' ')}
                                                            </Badge>
                                                        ))}
                                                        {labourer.workExperience.skills.length > 4 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{labourer.workExperience.skills.length - 4} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Work Types */}
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium mb-2">Available for</h4>
                                                    <div className="flex flex-wrap gap-1">
                                                        {labourer.availability.workType.map((workType) => (
                                                            <Badge key={workType} variant="secondary" className="text-xs capitalize">
                                                                {workType.replace('_', ' ')}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t">
                                                    <div className="text-sm">
                                                        <span className="font-medium">₹{labourer.preferences.minWage}</span>
                                                        <span className="text-muted-foreground">/day minimum</span>
                                                    </div>

                                                    <div className="flex space-x-2">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline" size="sm">
                                                                    <MessageSquare className="h-4 w-4 mr-1" />
                                                                    Contact
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Contact {labourer.name}</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="space-y-4">
                                                                    <div className="p-4 bg-gray-50 rounded-lg">
                                                                        <h4 className="font-medium mb-2">Contact Information</h4>
                                                                        <p className="text-sm"><strong>Phone:</strong> {labourer.phone}</p>
                                                                        <p className="text-sm"><strong>Email:</strong> {labourer.email}</p>
                                                                        <p className="text-sm"><strong>Location:</strong> {labourer.location.village}, {labourer.location.district}</p>
                                                                    </div>
                                                                    <div className="p-4 bg-blue-50 rounded-lg">
                                                                        <h4 className="font-medium mb-2">Work Preferences</h4>
                                                                        <p className="text-sm"><strong>Minimum Wage:</strong> ₹{labourer.preferences.minWage}/day</p>
                                                                        <p className="text-sm"><strong>Available Days:</strong> {labourer.availability.availableDays.join(', ')}</p>
                                                                        <p className="text-sm"><strong>Work Types:</strong> {labourer.availability.workType.join(', ')}</p>
                                                                    </div>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>

                                                        {status === 'pending' ? (
                                                            <Button variant="secondary" size="sm" disabled>
                                                                <Clock className="h-4 w-4 mr-1" />
                                                                Pending
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                onClick={() => handleConnect(labourer.id)}
                                                                size="sm"
                                                                className="bg-green-600 hover:bg-green-700"
                                                            >
                                                                <UserCheck className="h-4 w-4 mr-1" />
                                                                Connect
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Call to Action */}
                <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                    <CardContent className="p-6 text-center">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">Need More Workers?</h3>
                        <p className="text-green-700 mb-4">
                            Post a detailed job requirement to attract more qualified workers from your area.
                        </p>
                        <Button onClick={() => navigate('/post-job')} className="bg-green-600 hover:bg-green-700">
                            Post a Job
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LocalLabour;