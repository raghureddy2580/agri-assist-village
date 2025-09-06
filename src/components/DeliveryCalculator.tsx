import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Truck } from "lucide-react";

interface DeliveryCalculatorProps {
    userLocation: string;
    farmerLocation: string;
    distance: number;
}

const DeliveryCalculator: React.FC<DeliveryCalculatorProps> = ({
    userLocation,
    farmerLocation,
    distance
}) => {
    // Calculate delivery cost based on distance
    const calculateDeliveryCost = (distance: number): number => {
        if (distance <= 5) return 30;
        if (distance <= 10) return 50;
        if (distance <= 25) return 80;
        if (distance <= 50) return 120;
        return 200;
    };

    // Calculate estimated delivery time
    const calculateDeliveryTime = (distance: number): string => {
        if (distance <= 5) return "Same day";
        if (distance <= 10) return "1-2 days";
        if (distance <= 25) return "2-3 days";
        if (distance <= 50) return "3-4 days";
        return "4-5 days";
    };

    const deliveryCost = calculateDeliveryCost(distance);
    const deliveryTime = calculateDeliveryTime(distance);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center text-sm">
                    <Truck className="h-4 w-4 mr-2" />
                    Delivery Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Distance:</span>
                    </div>
                    <span className="text-xs font-medium">{distance} km</span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Delivery Time:</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        {deliveryTime}
                    </Badge>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Delivery Cost:</span>
                    <span className="text-sm font-bold text-green-600">₹{deliveryCost}</span>
                </div>

                <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                        <strong>From:</strong> {farmerLocation}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        <strong>To:</strong> {userLocation}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DeliveryCalculator;
