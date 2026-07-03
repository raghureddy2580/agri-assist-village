import React, { useState, useEffect } from 'react';
import { useRover, RoverPosition } from '../contexts/RoverContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AlertCircle, Play, Square, Trash2, Radio, Zap, Droplets } from 'lucide-react';

const RoverControls: React.FC = () => {
  const { rover, moveRover, startMonitoring, stopMonitoring, clearRoute } = useRover();
  const [isAutoMoving, setIsAutoMoving] = useState(false);
  const [manualLat, setManualLat] = useState('13.3527');
  const [manualLng, setManualLng] = useState('74.7421');

  // Auto-movement simulation
  useEffect(() => {
    if (!isAutoMoving) return;

    const interval = setInterval(() => {
      // Simulate rover moving in a pattern (square patrol)
      const offset = 0.001; // ~111 meters
      const step = Math.floor(Date.now() / 2000) % 4;

      let newLat = rover.position.lat;
      let newLng = rover.position.lng;

      switch (step) {
        case 0:
          newLat += offset;
          break;
        case 1:
          newLng += offset;
          break;
        case 2:
          newLat -= offset;
          break;
        case 3:
          newLng -= offset;
          break;
      }

      moveRover(newLat, newLng);
      startMonitoring();
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoMoving, moveRover, rover.position, startMonitoring]);

  const handleManualMove = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid latitude and longitude values');
      return;
    }

    moveRover(lat, lng);
    startMonitoring();
  };

  const handleToggleAutoMove = () => {
    setIsAutoMoving(!isAutoMoving);
    if (!isAutoMoving) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
  };

  const getBatteryColor = () => {
    if (rover.battery > 50) return 'text-green-600';
    if (rover.battery > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthColor = () => {
    if (rover.monitoringData.cropHealth > 80) return 'text-green-600';
    if (rover.monitoringData.cropHealth > 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Control Panel */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="w-5 h-5" />
            Rover Control Panel
          </CardTitle>
          <CardDescription>Manage rover movement and monitoring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auto Movement Control */}
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Auto Patrol Mode</span>
              <span className={`text-sm font-medium ${isAutoMoving ? 'text-green-600' : 'text-gray-600'}`}>
                {isAutoMoving ? '🔴 Active' : '⚪ Inactive'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Rover will automatically patrol in a square pattern, monitoring the land continuously.
            </p>
            <Button
              onClick={handleToggleAutoMove}
              className={`w-full ${isAutoMoving ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isAutoMoving ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Stop Patrol
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Patrol
                </>
              )}
            </Button>
          </div>

          {/* Manual Movement Control */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-semibold text-gray-700">Manual Movement</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Latitude</label>
                <Input
                  type="number"
                  step="0.0001"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="13.3527"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Longitude</label>
                <Input
                  type="number"
                  step="0.0001"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  placeholder="74.7421"
                />
              </div>
            </div>
            <Button onClick={handleManualMove} className="w-full bg-blue-500 hover:bg-blue-600">
              Move to Location
            </Button>
          </div>

          {/* Route Management */}
          <div className="flex gap-2">
            <Button onClick={clearRoute} variant="outline" className="flex-1">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Route
            </Button>
            <Button onClick={stopMonitoring} variant="outline" className="flex-1">
              <Square className="w-4 h-4 mr-2" />
              Stop Monitoring
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Data Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Live Monitoring</CardTitle>
          <CardDescription>Real-time sensor data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Battery Status */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className={`w-4 h-4 ${getBatteryColor()}`} />
                <span className="text-sm font-medium text-gray-700">Battery</span>
              </div>
              <span className={`font-semibold ${getBatteryColor()}`}>{rover.battery.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  rover.battery > 50 ? 'bg-green-500' : rover.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${rover.battery}%` }}
              ></div>
            </div>
          </div>

          {/* Temperature */}
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌡️</span>
                <span className="text-sm font-medium text-gray-700">Temperature</span>
              </div>
              <span className="font-semibold text-red-600">{rover.monitoringData.temperature.toFixed(1)}°C</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Humidity</span>
              </div>
              <span className="font-semibold text-blue-600">{rover.monitoringData.humidity.toFixed(1)}%</span>
            </div>
          </div>

          {/* Soil Moisture */}
          <div className="p-3 bg-amber-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">💧</span>
                <span className="text-sm font-medium text-gray-700">Soil Moisture</span>
              </div>
              <span className="font-semibold text-amber-600">{rover.monitoringData.soilMoisture.toFixed(1)}%</span>
            </div>
          </div>

          {/* Crop Health */}
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌱</span>
                <span className="text-sm font-medium text-gray-700">Crop Health</span>
              </div>
              <span className={`font-semibold ${getHealthColor()}`}>
                {rover.monitoringData.cropHealth.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  rover.monitoringData.cropHealth > 80
                    ? 'bg-green-500'
                    : rover.monitoringData.cropHealth > 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${rover.monitoringData.cropHealth}%` }}
              ></div>
            </div>
          </div>

          {/* Status Alert */}
          {rover.battery < 20 && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-700">Low battery! Please charge the rover soon.</p>
            </div>
          )}

          {/* Position Info */}
          <div className="p-3 bg-gray-100 rounded-lg text-xs">
            <p className="text-gray-600">
              <span className="font-semibold">Position:</span> {rover.position.lat.toFixed(4)}, {rover.position.lng.toFixed(4)}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Heading:</span> {rover.heading.toFixed(1)}°
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Route Points:</span> {rover.route.length}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoverControls;
