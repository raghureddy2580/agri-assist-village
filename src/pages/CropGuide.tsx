import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { cropDatabase, CropInfo, getCropById } from '@/lib/cropDatabase';
import { Thermometer, Droplets, Wind, Sun, Calendar, AlertTriangle, CheckCircle, Info, Leaf, Sprout, Scissors, Truck, Camera, Scan } from 'lucide-react';

const CropGuide: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedCrop, setSelectedCrop] = useState<CropInfo | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

    const getStepIcon = (stepId: string) => {
        switch (stepId) {
            case 'seed_preparation':
            case 'land_preparation':
                return <Sprout className="h-5 w-5" />;
            case 'watering_fertilizing':
                return <Droplets className="h-5 w-5" />;
            case 'pest_disease_management':
                return <AlertTriangle className="h-5 w-5" />;
            case 'harvesting':
            case 'harvest_threshing':
                return <Scissors className="h-5 w-5" />;
            default:
                return <Info className="h-5 w-5" />;
        }
    };

    const getClimateIcon = (condition: string) => {
        if (condition.includes('temperature') || condition.includes('heat')) {
            return <Thermometer className="h-4 w-4" />;
        }
        if (condition.includes('humidity') || condition.includes('rain')) {
            return <Droplets className="h-4 w-4" />;
        }
        if (condition.includes('wind')) {
            return <Wind className="h-4 w-4" />;
        }
        return <Sun className="h-4 w-4" />;
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="max-w-6xl mx-auto p-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
                        <p className="text-muted-foreground">You need to be logged in to access crop guides.</p>
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
                    <h1 className="text-3xl font-bold mb-2">Crop Cultivation Guide</h1>
                    <p className="text-muted-foreground">Comprehensive guides for successful crop cultivation</p>
                </div>

                {/* Plant Scanner Quick Access */}
                <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <Scan className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-green-800">AI Plant Disease Scanner</h3>
                                    <p className="text-green-600">Scan your plants to detect diseases and get treatment recommendations</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => navigate('/scanner')}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                <Camera className="h-4 w-4 mr-2" />
                                Scan Plant
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Crop Selection Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Select Crop</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {cropDatabase.map((crop) => (
                                        <Button
                                            key={crop.id}
                                            variant={selectedCrop?.id === crop.id ? "default" : "outline"}
                                            className="w-full justify-start"
                                            onClick={() => setSelectedCrop(crop)}
                                        >
                                            <span className="text-lg mr-2">{crop.images[0]}</span>
                                            <span className="text-left">{crop.name}</span>
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Scanner Access */}
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Camera className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <h4 className="font-medium text-blue-800 mb-2">Need Help Identifying Issues?</h4>
                                    <p className="text-sm text-blue-600 mb-3">Scan your plants for instant disease detection</p>
                                    <Button
                                        onClick={() => navigate('/scanner')}
                                        size="sm"
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Scan className="h-3 w-3 mr-1" />
                                        Quick Scan
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Crop Details */}
                    <div className="lg:col-span-3">
                        {selectedCrop ? (
                            <div className="space-y-6">
                                {/* Crop Header */}
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <span className="text-6xl">{selectedCrop.images[0]}</span>
                                            <div>
                                                <h2 className="text-3xl font-bold">{selectedCrop.name}</h2>
                                                <p className="text-muted-foreground italic">{selectedCrop.scientificName}</p>
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <Badge variant="secondary">{selectedCrop.category}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground">{selectedCrop.description}</p>
                                    </CardContent>
                                </Card>

                                {/* Crop Information Tabs */}
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="overview">Overview</TabsTrigger>
                                        <TabsTrigger value="steps">Steps</TabsTrigger>
                                        <TabsTrigger value="diseases">Diseases</TabsTrigger>
                                        <TabsTrigger value="pests">Pests</TabsTrigger>
                                    </TabsList>

                                    {/* Overview Tab */}
                                    <TabsContent value="overview" className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Climate Requirements */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center space-x-2">
                                                        <Sun className="h-5 w-5" />
                                                        <span>Climate Requirements</span>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Temperature:</span>
                                                        <span>{selectedCrop.climate.temperature.min}°C - {selectedCrop.climate.temperature.max}°C</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Humidity:</span>
                                                        <span>{selectedCrop.climate.humidity.min}% - {selectedCrop.climate.humidity.max}%</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Rainfall:</span>
                                                        <span>{selectedCrop.climate.rainfall.min}mm - {selectedCrop.climate.rainfall.max}mm</span>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Soil Requirements */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Soil Requirements</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Type:</span>
                                                        <span>{selectedCrop.soil.type}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">pH:</span>
                                                        <span>{selectedCrop.soil.ph.min} - {selectedCrop.soil.ph.max}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Nutrients:</span>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {selectedCrop.soil.nutrients.map((nutrient) => (
                                                                <Badge key={nutrient} variant="outline" className="text-xs">
                                                                    {nutrient}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Growing Season */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center space-x-2">
                                                        <Calendar className="h-5 w-5" />
                                                        <span>Growing Season</span>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Planting:</span>
                                                        <span>{selectedCrop.growingSeason.planting}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Harvesting:</span>
                                                        <span>{selectedCrop.growingSeason.harvesting}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Duration:</span>
                                                        <span>{selectedCrop.growingSeason.duration}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Watering */}
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center space-x-2">
                                                        <Droplets className="h-5 w-5" />
                                                        <span>Watering</span>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Frequency:</span>
                                                        <span>{selectedCrop.watering.frequency}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Amount:</span>
                                                        <span>{selectedCrop.watering.amount}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Method:</span>
                                                        <span>{selectedCrop.watering.method}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Fertilizers */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Fertilizer Recommendations</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {selectedCrop.fertilizers.map((fertilizer, index) => (
                                                        <div key={index} className="border rounded-lg p-3">
                                                            <h4 className="font-medium mb-2">{fertilizer.type}</h4>
                                                            <p className="text-sm text-muted-foreground mb-2">{fertilizer.composition}</p>
                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                <div>
                                                                    <span className="text-muted-foreground">Application:</span>
                                                                    <span className="ml-1">{fertilizer.application}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-muted-foreground">Frequency:</span>
                                                                    <span className="ml-1">{fertilizer.frequency}</span>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm mt-1">
                                                                <span className="text-muted-foreground">Quantity:</span>
                                                                <span className="ml-1">{fertilizer.quantity}</span>
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    {/* Steps Tab */}
                                    <TabsContent value="steps" className="space-y-6">
                                        <div className="space-y-4">
                                            {selectedCrop.steps.map((step, index) => (
                                                <Card key={step.id}>
                                                    <CardContent className="p-6">
                                                        <div className="flex items-start space-x-4">
                                                            <div className="flex-shrink-0">
                                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                                    {getStepIcon(step.id)}
                                                                </div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2 mb-2">
                                                                    <h3 className="text-lg font-semibold">{step.title}</h3>
                                                                    <Badge variant="outline">{step.duration}</Badge>
                                                                </div>
                                                                <p className="text-muted-foreground mb-3">{step.description}</p>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h4 className="font-medium mb-2">Requirements:</h4>
                                                                        <ul className="text-sm space-y-1">
                                                                            {step.requirements.map((req, i) => (
                                                                                <li key={i} className="flex items-center space-x-2">
                                                                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                                                                    <span>{req}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>

                                                                    <div>
                                                                        <h4 className="font-medium mb-2">Tips:</h4>
                                                                        <ul className="text-sm space-y-1">
                                                                            {step.tips.map((tip, i) => (
                                                                                <li key={i} className="flex items-center space-x-2">
                                                                                    <Info className="h-3 w-3 text-blue-500" />
                                                                                    <span>{tip}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </div>

                                                                {step.warnings.length > 0 && (
                                                                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                                        <h4 className="font-medium text-yellow-800 mb-2">Warnings:</h4>
                                                                        <ul className="text-sm space-y-1">
                                                                            {step.warnings.map((warning, i) => (
                                                                                <li key={i} className="flex items-center space-x-2 text-yellow-700">
                                                                                    <AlertTriangle className="h-3 w-3" />
                                                                                    <span>{warning}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    {/* Diseases Tab */}
                                    <TabsContent value="diseases" className="space-y-6">
                                        <div className="space-y-4">
                                            {selectedCrop.diseases.map((disease) => (
                                                <Card key={disease.id}>
                                                    <CardContent className="p-6">
                                                        <div className="flex items-start justify-between mb-4">
                                                            <h3 className="text-lg font-semibold">{disease.name}</h3>
                                                            <Badge variant={disease.severity === 'critical' ? 'destructive' : 'secondary'}>
                                                                {disease.severity}
                                                            </Badge>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div>
                                                                <h4 className="font-medium mb-2">Symptoms:</h4>
                                                                <ul className="text-sm space-y-1">
                                                                    {disease.symptoms.map((symptom, i) => (
                                                                        <li key={i} className="flex items-center space-x-2">
                                                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                                            <span>{symptom}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            <div>
                                                                <h4 className="font-medium mb-2">Causes:</h4>
                                                                <ul className="text-sm space-y-1">
                                                                    {disease.causes.map((cause, i) => (
                                                                        <li key={i} className="flex items-center space-x-2">
                                                                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                                                            <span>{cause}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        <div className="mt-6">
                                                            <h4 className="font-medium mb-2">Prevention:</h4>
                                                            <ul className="text-sm space-y-1">
                                                                {disease.prevention.map((prevent, i) => (
                                                                    <li key={i} className="flex items-center space-x-2">
                                                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                                                        <span>{prevent}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    {/* Pests Tab */}
                                    <TabsContent value="pests" className="space-y-6">
                                        <div className="space-y-4">
                                            {selectedCrop.pests.map((pest) => (
                                                <Card key={pest.id}>
                                                    <CardContent className="p-6">
                                                        <h3 className="text-lg font-semibold mb-4">{pest.name}</h3>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                            <div>
                                                                <h4 className="font-medium mb-2">Symptoms:</h4>
                                                                <ul className="text-sm space-y-1">
                                                                    {pest.symptoms.map((symptom, i) => (
                                                                        <li key={i} className="flex items-center space-x-2">
                                                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                                            <span>{symptom}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            <div>
                                                                <h4 className="font-medium mb-2">Damage:</h4>
                                                                <ul className="text-sm space-y-1">
                                                                    {pest.damage.map((damage, i) => (
                                                                        <li key={i} className="flex items-center space-x-2">
                                                                            <AlertTriangle className="h-3 w-3 text-orange-500" />
                                                                            <span>{damage}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        {pest.naturalControl.length > 0 && (
                                                            <div className="mb-6">
                                                                <h4 className="font-medium mb-2">Natural Control:</h4>
                                                                <ul className="text-sm space-y-1">
                                                                    {pest.naturalControl.map((control, i) => (
                                                                        <li key={i} className="flex items-center space-x-2">
                                                                            <Leaf className="h-3 w-3 text-green-500" />
                                                                            <span>{control}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">Select a Crop</h3>
                                    <p className="text-muted-foreground">
                                        Choose a crop from the sidebar to view detailed cultivation guide and information.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CropGuide;