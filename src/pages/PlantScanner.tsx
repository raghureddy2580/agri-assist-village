import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import Header from '@/components/Header';
import { getCropById, getRecommendedPesticides, CropInfo, DiseaseInfo, PestInfo, PesticideInfo } from '@/lib/cropDatabase';
import { Camera, Upload, X, AlertTriangle, CheckCircle, Info, ShoppingCart } from 'lucide-react';

interface ScanResult {
    cropId: string;
    diseaseId?: string;
    pestId?: string;
    confidence: number;
    recommendations: PesticideInfo[];
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

const PlantScanner: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
            }
        } catch (error) {
            showToast({
                type: 'error',
                title: 'Camera Error',
                message: 'Unable to access camera. Please check permissions.',
                duration: 3000
            });
        }
    }, [showToast]);

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            setIsCameraActive(false);
        }
    }, []);

    const captureImage = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0);
                const imageDataUrl = canvas.toDataURL('image/jpeg');
                setSelectedImage(imageDataUrl);
                stopCamera();
            }
        }
    }, [stopCamera]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeImage = async () => {
        if (!selectedImage) return;

        setIsAnalyzing(true);
        setAnalysisProgress(0);

        // Simulate analysis progress
        const progressInterval = setInterval(() => {
            setAnalysisProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 300);

        try {
            // Simulate API call to image recognition service
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Mock analysis result - in real app, this would come from AI service
            const mockResults = [
                {
                    cropId: 'tomato',
                    diseaseId: 'blight',
                    confidence: 85,
                    description: 'Late blight detected on tomato leaves',
                    severity: 'high' as const
                },
                {
                    cropId: 'rice',
                    pestId: 'stem_borer',
                    confidence: 78,
                    description: 'Stem borer damage detected on rice plants',
                    severity: 'medium' as const
                },
                {
                    cropId: 'wheat',
                    diseaseId: 'rust',
                    confidence: 92,
                    description: 'Wheat rust infection detected',
                    severity: 'critical' as const
                }
            ];

            // Randomly select a result for demo
            const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
            const crop = getCropById(randomResult.cropId);

            if (crop) {
                let recommendations: PesticideInfo[] = [];

                if (randomResult.diseaseId) {
                    recommendations = getRecommendedPesticides(randomResult.cropId, 'disease', randomResult.diseaseId);
                } else if (randomResult.pestId) {
                    recommendations = getRecommendedPesticides(randomResult.cropId, 'pest', randomResult.pestId);
                }

                const result: ScanResult = {
                    ...randomResult,
                    recommendations
                };

                setScanResult(result);
                setAnalysisProgress(100);

                showToast({
                    type: 'success',
                    title: 'Analysis Complete',
                    message: `Detected ${crop.name} with ${randomResult.confidence}% confidence`,
                    duration: 3000
                });
            }
        } catch (error) {
            showToast({
                type: 'error',
                title: 'Analysis Failed',
                message: 'Unable to analyze the image. Please try again.',
                duration: 3000
            });
        } finally {
            setIsAnalyzing(false);
            clearInterval(progressInterval);
        }
    };

    const resetScanner = () => {
        setSelectedImage(null);
        setScanResult(null);
        setAnalysisProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical':
                return <AlertTriangle className="h-4 w-4" />;
            case 'high':
                return <AlertTriangle className="h-4 w-4" />;
            case 'medium':
                return <Info className="h-4 w-4" />;
            case 'low':
                return <CheckCircle className="h-4 w-4" />;
            default:
                return <Info className="h-4 w-4" />;
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="max-w-4xl mx-auto p-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
                        <p className="text-muted-foreground">You need to be logged in to use the plant scanner.</p>
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
                    <h1 className="text-3xl font-bold mb-2">Plant Disease Scanner</h1>
                    <p className="text-muted-foreground">Scan your plants to detect diseases and get treatment recommendations</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Scanner Interface */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Camera className="h-5 w-5" />
                                    <span>Capture or Upload Image</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {!selectedImage ? (
                                    <>
                                        {/* Camera View */}
                                        <div className="relative">
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="w-full h-64 bg-gray-200 rounded-lg object-cover"
                                                style={{ display: isCameraActive ? 'block' : 'none' }}
                                            />
                                            <canvas ref={canvasRef} className="hidden" />

                                            {!isCameraActive && (
                                                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <div className="text-center">
                                                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                                        <p className="text-gray-500">Camera not active</p>
                                                    </div>
                                                </div>
                                            )}

                                            {isCameraActive && (
                                                <Button
                                                    onClick={captureImage}
                                                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                                                >
                                                    Capture
                                                </Button>
                                            )}
                                        </div>

                                        {/* Control Buttons */}
                                        <div className="flex space-x-2">
                                            {!isCameraActive ? (
                                                <Button onClick={startCamera} className="flex-1">
                                                    <Camera className="h-4 w-4 mr-2" />
                                                    Open Camera
                                                </Button>
                                            ) : (
                                                <Button onClick={stopCamera} variant="outline" className="flex-1">
                                                    <X className="h-4 w-4 mr-2" />
                                                    Close Camera
                                                </Button>
                                            )}

                                            <Button
                                                onClick={() => fileInputRef.current?.click()}
                                                variant="outline"
                                                className="flex-1"
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                Upload
                                            </Button>
                                        </div>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                    </>
                                ) : (
                                    <>
                                        {/* Selected Image */}
                                        <div className="relative">
                                            <img
                                                src={selectedImage}
                                                alt="Selected plant"
                                                className="w-full h-64 object-cover rounded-lg"
                                            />
                                            <Button
                                                onClick={resetScanner}
                                                variant="outline"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Analysis Button */}
                                        <Button
                                            onClick={analyzeImage}
                                            disabled={isAnalyzing}
                                            className="w-full"
                                        >
                                            {isAnalyzing ? 'Analyzing...' : 'Analyze Plant'}
                                        </Button>

                                        {/* Progress Bar */}
                                        {isAnalyzing && (
                                            <div className="space-y-2">
                                                <Progress value={analysisProgress} className="w-full" />
                                                <p className="text-sm text-center text-muted-foreground">
                                                    Analyzing image... {analysisProgress}%
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results Panel */}
                    <div className="space-y-6">
                        {scanResult ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Analysis Results</span>
                                        <Badge className={getSeverityColor(scanResult.severity)}>
                                            {getSeverityIcon(scanResult.severity)}
                                            <span className="ml-1 capitalize">{scanResult.severity}</span>
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">Detection</h3>
                                        <p className="text-sm text-muted-foreground">{scanResult.description}</p>
                                        <p className="text-sm mt-1">
                                            <strong>Confidence:</strong> {scanResult.confidence}%
                                        </p>
                                    </div>

                                    {scanResult.recommendations.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-3">Recommended Treatments</h3>
                                            <div className="space-y-3">
                                                {scanResult.recommendations.map((pesticide) => (
                                                    <div key={pesticide.id} className="border rounded-lg p-3">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-medium">{pesticide.name}</h4>
                                                            <Badge variant="outline">₹{pesticide.price}</Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            {pesticide.activeIngredient} • {pesticide.type}
                                                        </p>
                                                        <div className="flex items-center space-x-2 text-xs">
                                                            <span>Dosage: {pesticide.dosage}</span>
                                                            <span>•</span>
                                                            <span>Application: {pesticide.application}</span>
                                                        </div>
                                                        <Button size="sm" className="mt-2 w-full">
                                                            <ShoppingCart className="h-3 w-3 mr-1" />
                                                            Add to Cart
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>Note:</strong> This is an AI-powered analysis. For accurate diagnosis,
                                            consult with a local agricultural expert or extension service.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                                    <p className="text-muted-foreground">
                                        Capture or upload a plant image to get disease detection and treatment recommendations.
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

export default PlantScanner;