import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RoverMap from '../components/RoverMap';
import RoverControls from '../components/RoverControls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { AlertCircle, Info } from 'lucide-react';

const RoverMonitoring: React.FC = () => {
  // Note: Replace with actual API key from environment variables
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <span className="text-4xl">🤖</span>
            Agricultural Rover Monitor
          </h1>
          <p className="text-lg text-gray-600">
            Real-time crop monitoring and land surveillance using autonomous rovers
          </p>
        </div>

        {/* Info Banner */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900">How it Works</p>
                  <p className="text-sm text-blue-800 mt-1">
                    The rover uses satellite imagery to navigate across your agricultural land. Use the Auto Patrol mode to 
                    automatically monitor your crops, or manually direct the rover to specific coordinates. Real-time sensors 
                    track temperature, humidity, soil moisture, and overall crop health as the rover moves.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_360px]">
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                  <div className="bg-slate-900 text-white px-4 py-2 font-semibold">How to Use the Rover</div>
                  <div className="aspect-video bg-black">
                    <iframe
                      className="h-full w-full"
                      src="https://www.youtube.com/embed/WrE9J94gGNQ?si=hqTX1H0_wzvFDjXa"
                      title="Rover Usage Guide"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900 mb-2">Farmer Tutorial</p>
                  <p className="text-sm text-slate-700">
                    Watch this quick video to learn how to start the rover, switch to auto patrol mode, and use the secure 
                    farmer interface for live monitoring. This guide is crafted for farmers to operate the rover with ease.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-700 list-disc list-inside">
                    <li>Step 1: Login and open the Rover Monitoring page.</li>
                    <li>Step 2: Use the control panel to start monitoring.</li>
                    <li>Step 3: Review live data and navigate the rover manually.</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Map Section */}
          <div>
            <RoverMap googleMapsApiKey={GOOGLE_MAPS_API_KEY} />
          </div>

          {/* Controls and Monitoring Section */}
          <RoverControls />

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">📡</span>
                  GPS Navigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Precise GPS coordinates guide the rover to specific locations on your farmland.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">🌡️</span>
                  Environmental Sensors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Multi-sensor array measures temperature, humidity, and soil conditions in real-time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  Autonomous Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Auto-patrol your fields with continuous monitoring and data collection.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Data Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Comprehensive reports and insights about your crop health and field conditions.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>⚙️</span>
                Technical Specifications
              </CardTitle>
              <CardDescription>Current Rover Capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700">Sensors</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Temperature Sensor</li>
                    <li>✓ Humidity Sensor</li>
                    <li>✓ Soil Moisture Probe</li>
                    <li>✓ Crop Health Camera</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700">Navigation</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ GPS/GNSS Module</li>
                    <li>✓ IMU (9-axis)</li>
                    <li>✓ Compass</li>
                    <li>✓ Odometry</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700">Performance</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ Battery Life: 8+ hours</li>
                    <li>✓ Speed: 0.5-2 m/s</li>
                    <li>✓ Range: 5+ km</li>
                    <li>✓ Accuracy: ±0.5m</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Notice */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-yellow-900">Important Notice</p>
                  <p className="text-sm text-yellow-800 mt-1">
                    Ensure the rover has a clear path before starting patrol mode. Avoid operating in heavy rainfall 
                    or extremely muddy conditions. Always maintain line-of-sight when possible for better GPS accuracy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RoverMonitoring;
