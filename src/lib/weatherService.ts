export interface WeatherData {
    temperature: number;
    humidity: number;
    precipitation: number;
    windSpeed: number;
    windDirection: string;
    condition: string;
    forecast: WeatherForecast[];
    location: {
        city: string;
        region: string;
        country: string;
    };
}

export interface WeatherForecast {
    date: string;
    temperature: {
        min: number;
        max: number;
    };
    condition: string;
    precipitation: number;
    humidity: number;
}

// Mock weather data for demonstration
const mockWeatherData: WeatherData = {
    temperature: 28,
    humidity: 65,
    precipitation: 0,
    windSpeed: 12,
    windDirection: "NE",
    condition: "Partly Cloudy",
    location: {
        city: "Bangalore",
        region: "Karnataka",
        country: "India"
    },
    forecast: [
        {
            date: "2024-09-08",
            temperature: { min: 22, max: 30 },
            condition: "Sunny",
            precipitation: 0,
            humidity: 60
        },
        {
            date: "2024-09-09",
            temperature: { min: 21, max: 28 },
            condition: "Light Rain",
            precipitation: 2.5,
            humidity: 75
        },
        {
            date: "2024-09-10",
            temperature: { min: 20, max: 27 },
            condition: "Cloudy",
            precipitation: 0,
            humidity: 70
        }
    ]
};

export const getCurrentWeather = async (lat?: number, lng?: number): Promise<WeatherData> => {
    // In a real application, you would call a weather API like OpenWeatherMap
    // For now, we'll return mock data with some randomization

    return new Promise((resolve) => {
        setTimeout(() => {
            // Add some randomization to make it feel more real
            const randomizedData = {
                ...mockWeatherData,
                temperature: mockWeatherData.temperature + (Math.random() - 0.5) * 4,
                humidity: Math.max(30, Math.min(90, mockWeatherData.humidity + (Math.random() - 0.5) * 20)),
                precipitation: Math.max(0, mockWeatherData.precipitation + (Math.random() - 0.5) * 2)
            };
            resolve(randomizedData);
        }, 1000);
    });
};

export const getWeatherByLocation = async (location: string): Promise<WeatherData> => {
    // Mock implementation - in real app, geocode location first
    return getCurrentWeather();
};