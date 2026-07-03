import React, { createContext, useState, useCallback, ReactNode } from 'react';

export interface RoverPosition {
  lat: number;
  lng: number;
}

export interface MonitoringData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  cropHealth: number;
  timestamp: Date;
}

export interface RoverState {
  position: RoverPosition;
  battery: number;
  isMoving: boolean;
  heading: number;
  monitoringData: MonitoringData;
  route: RoverPosition[];
}

export interface RoverContextType {
  rover: RoverState;
  moveRover: (lat: number, lng: number) => void;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  setBattery: (battery: number) => void;
  clearRoute: () => void;
  updateHeading: (heading: number) => void;
}

const RoverContext = createContext<RoverContextType | undefined>(undefined);

export const RoverProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rover, setRover] = useState<RoverState>({
    position: { lat: 13.3527, lng: 74.7421 }, // Default to Mangalore
    battery: 100,
    isMoving: false,
    heading: 0,
    monitoringData: {
      temperature: 28,
      humidity: 65,
      soilMoisture: 55,
      cropHealth: 85,
      timestamp: new Date(),
    },
    route: [{ lat: 13.3527, lng: 74.7421 }],
  });

  const moveRover = useCallback((lat: number, lng: number) => {
    setRover((prev) => {
      const prevLat = prev.position.lat;
      const prevLng = prev.position.lng;
      
      // Calculate heading
      const heading = Math.atan2(lng - prevLng, lat - prevLat) * (180 / Math.PI);
      
      return {
        ...prev,
        position: { lat, lng },
        heading: heading,
        battery: Math.max(0, prev.battery - 0.5), // Decrease battery
        route: [...prev.route, { lat, lng }],
      };
    });
  }, []);

  const startMonitoring = useCallback(() => {
    setRover((prev) => ({
      ...prev,
      isMoving: true,
      monitoringData: {
        temperature: 25 + Math.random() * 8,
        humidity: 60 + Math.random() * 30,
        soilMoisture: 50 + Math.random() * 30,
        cropHealth: 70 + Math.random() * 25,
        timestamp: new Date(),
      },
    }));
  }, []);

  const stopMonitoring = useCallback(() => {
    setRover((prev) => ({
      ...prev,
      isMoving: false,
    }));
  }, []);

  const setBattery = useCallback((battery: number) => {
    setRover((prev) => ({
      ...prev,
      battery: Math.min(100, Math.max(0, battery)),
    }));
  }, []);

  const clearRoute = useCallback(() => {
    setRover((prev) => ({
      ...prev,
      route: [prev.position],
    }));
  }, []);

  const updateHeading = useCallback((heading: number) => {
    setRover((prev) => ({
      ...prev,
      heading: heading % 360,
    }));
  }, []);

  const value: RoverContextType = {
    rover,
    moveRover,
    startMonitoring,
    stopMonitoring,
    setBattery,
    clearRoute,
    updateHeading,
  };

  return <RoverContext.Provider value={value}>{children}</RoverContext.Provider>;
};

export const useRover = (): RoverContextType => {
  const context = React.useContext(RoverContext);
  if (!context) {
    throw new Error('useRover must be used within RoverProvider');
  }
  return context;
};
