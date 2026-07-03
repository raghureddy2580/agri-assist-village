import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { useRover } from '../contexts/RoverContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface RoverMapProps {
  googleMapsApiKey: string;
}

const RoverMap: React.FC<RoverMapProps> = ({ googleMapsApiKey }) => {
  const { rover } = useRover();
  const mapRef = useRef<any>(null);
  const [zoom, setZoom] = useState(16);
  const [showInfoWindow, setShowInfoWindow] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const hasValidApiKey = Boolean(googleMapsApiKey && googleMapsApiKey !== 'YOUR_GOOGLE_MAPS_API_KEY');
  const useEmbedMap = !hasValidApiKey || loadError;

  // Convert route to polyline points
  const routePoints = rover.route.map(pos => ({
    lat: pos.lat,
    lng: pos.lng,
  }));

  // Rover icon with rotation
  const getRoverIcon = () => ({
    path: window.google?.maps?.SymbolPath?.CIRCLE,
    scale: 8,
    fillColor: '#10b981',
    fillOpacity: 1,
    strokeColor: '#047857',
    strokeWeight: 2,
  });

  const mapContainerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '8px',
  };

  const defaultCenter = {
    lat: rover.position.lat,
    lng: rover.position.lng,
  };

  const mapOptions = {
    zoom: zoom,
    center: defaultCenter,
    mapTypeId: 'satellite', // Show satellite view for better agricultural visualization
    mapTypeControl: true,
    fullscreenControl: true,
    streetViewControl: false,
  };

  useEffect(() => {
    // Center map on rover position
    if (mapRef.current && rover.position) {
      mapRef.current.panTo({
        lat: rover.position.lat,
        lng: rover.position.lng,
      });
    }
  }, [rover.position]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Agricultural Land Monitor</CardTitle>
        <CardDescription>Real-time rover monitoring with crop inspection</CardDescription>
      </CardHeader>
      <CardContent>
        {useEmbedMap ? (
          <div className="relative">
            <div className="mb-4 text-sm text-gray-600">
              Showing a Google Maps embed because the app does not have a valid Maps JavaScript API key configured.
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200" style={{ height: '500px' }}>
              <iframe
                title="Google Map Embed"
                src={`https://www.google.com/maps?q=${defaultCenter.lat},${defaultCenter.lng}&z=16&output=embed`}
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        ) : (
          <LoadScript
            googleMapsApiKey={googleMapsApiKey}
            onError={() => setLoadError(true)}
          >
            <div className="relative">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={zoom}
                onLoad={(map) => {
                  mapRef.current = map;
                }}
                options={mapOptions}
                onZoomChanged={() => {
                  if (mapRef.current) {
                    setZoom(mapRef.current.getZoom());
                  }
                }}
              >
              {/* Display rover route */}
              {routePoints.length > 1 && (
                <Polyline
                  path={routePoints}
                  options={{
                    strokeColor: '#3b82f6',
                    strokeOpacity: 0.7,
                    strokeWeight: 3,
                    geodesic: true,
                  }}
                />
              )}

              {/* Display rover marker */}
              <Marker
                position={{
                  lat: rover.position.lat,
                  lng: rover.position.lng,
                }}
                title="Rover Position"
                icon={{
                  path: `M0,-28 C-7.73,-28 -14,-21.73 -14,-14 C-14,-10.77 -12.89,-7.85 -11.05,-5.59 L0,11.52 L11.05,-5.59 C12.89,-7.85 14,-10.77 14,-14 C14,-21.73 7.73,-28 0,-28 Z`,
                  fillColor: '#10b981',
                  fillOpacity: 1,
                  strokeColor: '#047857',
                  strokeWeight: 2,
                  scale: 1.5,
                  rotation: rover.heading,
                }}
                onClick={() => setShowInfoWindow(true)}
              >
                {showInfoWindow && (
                  <InfoWindow
                    position={{
                      lat: rover.position.lat,
                      lng: rover.position.lng,
                    }}
                    onCloseClick={() => setShowInfoWindow(false)}
                  >
                    <div className="text-sm">
                      <p className="font-semibold text-gray-800">🤖 Rover Status</p>
                      <p className="text-gray-700">Lat: {rover.position.lat.toFixed(4)}</p>
                      <p className="text-gray-700">Lng: {rover.position.lng.toFixed(4)}</p>
                      <p className="text-gray-700">Heading: {rover.heading.toFixed(1)}°</p>
                      <p className="text-green-600 font-semibold">Battery: {rover.battery.toFixed(1)}%</p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>

              {/* Display monitoring points on route */}
              {routePoints.slice(0, Math.max(1, routePoints.length - 1)).map((point, idx) => (
                <Marker
                  key={`checkpoint-${idx}`}
                  position={point}
                  title={`Checkpoint ${idx + 1}`}
                  icon={{
                    path: window.google?.maps?.SymbolPath?.CIRCLE,
                    scale: 5,
                    fillColor: '#f59e0b',
                    fillOpacity: 0.6,
                    strokeColor: '#d97706',
                    strokeWeight: 1,
                  }}
                />
              ))}
            </GoogleMap>
          </div>
        </LoadScript>
        )}

        {/* Map Legend */}
        <div className="mt-4 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-green-700"></div>
            <span className="text-sm font-medium">Current Rover</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-400 rounded-full border border-amber-600"></div>
            <span className="text-sm font-medium">Monitored Area</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 bg-blue-500"></div>
            <span className="text-sm font-medium">Rover Path</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📡</span>
            <span className="text-sm font-medium">Active Zone</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoverMap;
