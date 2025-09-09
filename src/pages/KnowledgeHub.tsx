import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import Header from '@/components/Header';

const KnowledgeHub: React.FC = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="max-w-4xl mx-auto p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Knowledge Hub</h1>
                    <p className="text-muted-foreground text-lg">Learn about our mission and vision</p>
                </div>

                {/* Website Goal Information */}
                <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                    <CardContent className="p-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <Leaf className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-blue-800 mb-2">About AgriAssist Village</h2>
                                <p className="text-blue-700 text-lg">
                                    Empowering farmers in rural villages with modern technology
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6 text-gray-700">
                            <p className="text-lg leading-relaxed">
                                Our mission is to empower farmers in rural villages by providing comprehensive agricultural tools and knowledge that help them maximize their productivity and improve their farming practices.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-semibold text-green-800 mb-3">Our Services</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• Comprehensive crop cultivation guides</li>
                                        <li>• AI-powered plant disease scanning</li>
                                        <li>• Real-time weather alerts and forecasts</li>
                                        <li>• Direct marketplace for buying and selling produce</li>
                                        <li>• Labor hiring platform for farm workers</li>
                                        <li>• Smart farming alerts and notifications</li>
                                    </ul>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-semibold text-blue-800 mb-3">Our Vision</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>• Bridge the gap between traditional and modern farming</li>
                                        <li>• Eliminate middlemen in agricultural supply chains</li>
                                        <li>• Provide farmers with data-driven decision making tools</li>
                                        <li>• Promote sustainable and profitable farming practices</li>
                                        <li>• Create economic opportunities in rural communities</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                <h3 className="text-xl font-semibold text-green-800 mb-3">Why Choose AgriAssist Village?</h3>
                                <p className="text-green-700 leading-relaxed">
                                    We understand the unique challenges faced by farmers in rural areas. Our platform combines cutting-edge technology with practical farming knowledge to help you make informed decisions, increase your yields, and improve your profitability. Join thousands of farmers who are already benefiting from our comprehensive agricultural solutions.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default KnowledgeHub;