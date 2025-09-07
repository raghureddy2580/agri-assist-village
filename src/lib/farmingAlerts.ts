import { WeatherData } from './weatherService';

export interface FarmingAlert {
    id: string;
    type: 'warning' | 'info' | 'critical';
    title: string;
    message: string;
    recommendation: string;
    crops: string[];
    timestamp: Date;
    weatherCondition: string;
    priority: number; // 1-10, higher is more urgent
}

export interface AlertPreferences {
    temperatureAlerts: boolean;
    rainAlerts: boolean;
    windAlerts: boolean;
    humidityAlerts: boolean;
    frostAlerts: boolean;
    droughtAlerts: boolean;
    pestAlerts: boolean;
    phoneNumber: string;
    smsEnabled: boolean;
    emailEnabled: boolean;
}

const DEFAULT_PREFERENCES: AlertPreferences = {
    temperatureAlerts: true,
    rainAlerts: true,
    windAlerts: true,
    humidityAlerts: true,
    frostAlerts: true,
    droughtAlerts: true,
    pestAlerts: true,
    phoneNumber: '',
    smsEnabled: true,
    emailEnabled: true
};

// Generate farming alerts based on weather conditions
export const generateFarmingAlerts = (weatherData: WeatherData): FarmingAlert[] => {
    const alerts: FarmingAlert[] = [];
    const { temperature, humidity, precipitation, windSpeed, condition, forecast } = weatherData;

    // Temperature-based alerts
    if (temperature > 35) {
        alerts.push({
            id: `temp-high-${Date.now()}`,
            type: 'warning',
            title: 'High Temperature Alert',
            message: `Temperature is ${temperature}°C, which is very high for most crops.`,
            recommendation: 'Provide shade to plants, increase irrigation, and avoid pesticide application during peak heat.',
            crops: ['Tomatoes', 'Peppers', 'Eggplant', 'Leafy Greens'],
            timestamp: new Date(),
            weatherCondition: `High Temperature (${temperature}°C)`,
            priority: 8
        });
    } else if (temperature < 10) {
        alerts.push({
            id: `temp-low-${Date.now()}`,
            type: 'critical',
            title: 'Frost Warning',
            message: `Temperature is ${temperature}°C, frost risk detected.`,
            recommendation: 'Cover plants with frost cloth, move sensitive plants indoors, and delay planting.',
            crops: ['Tomatoes', 'Peppers', 'Cucumbers', 'Beans'],
            timestamp: new Date(),
            weatherCondition: `Low Temperature (${temperature}°C)`,
            priority: 10
        });
    }

    // Humidity alerts
    if (humidity > 85) {
        alerts.push({
            id: `humidity-high-${Date.now()}`,
            type: 'warning',
            title: 'High Humidity Alert',
            message: `Humidity is ${humidity}%, which can promote fungal diseases.`,
            recommendation: 'Improve air circulation, avoid overhead watering, and apply preventive fungicides.',
            crops: ['Tomatoes', 'Cucumbers', 'Peppers', 'Strawberries'],
            timestamp: new Date(),
            weatherCondition: `High Humidity (${humidity}%)`,
            priority: 7
        });
    } else if (humidity < 30) {
        alerts.push({
            id: `humidity-low-${Date.now()}`,
            type: 'warning',
            title: 'Low Humidity Alert',
            message: `Humidity is ${humidity}%, which can cause plant stress.`,
            recommendation: 'Increase irrigation frequency and consider misting plants.',
            crops: ['Leafy Greens', 'Herbs', 'Root Vegetables'],
            timestamp: new Date(),
            weatherCondition: `Low Humidity (${humidity}%)`,
            priority: 6
        });
    }

    // Precipitation alerts
    if (precipitation > 10) {
        alerts.push({
            id: `rain-heavy-${Date.now()}`,
            type: 'warning',
            title: 'Heavy Rain Alert',
            message: `Heavy precipitation (${precipitation}mm) expected.`,
            recommendation: 'Ensure proper drainage, delay fertilizer application, and protect seedlings from waterlogging.',
            crops: ['Rice', 'Leafy Greens', 'Root Vegetables'],
            timestamp: new Date(),
            weatherCondition: `Heavy Rain (${precipitation}mm)`,
            priority: 7
        });
    } else if (precipitation > 0 && precipitation <= 2) {
        alerts.push({
            id: `rain-light-${Date.now()}`,
            type: 'info',
            title: 'Light Rain Expected',
            message: `Light precipitation (${precipitation}mm) forecast.`,
            recommendation: 'Good for irrigation, but monitor for fungal diseases if humidity remains high.',
            crops: ['All Crops'],
            timestamp: new Date(),
            weatherCondition: `Light Rain (${precipitation}mm)`,
            priority: 3
        });
    }

    // Wind alerts
    if (windSpeed > 25) {
        alerts.push({
            id: `wind-high-${Date.now()}`,
            type: 'warning',
            title: 'High Wind Alert',
            message: `Wind speed is ${windSpeed} km/h, which can damage plants.`,
            recommendation: 'Stake tall plants, protect seedlings, and avoid spraying pesticides.',
            crops: ['Tomatoes', 'Peppers', 'Corn', 'Beans'],
            timestamp: new Date(),
            weatherCondition: `High Wind (${windSpeed} km/h)`,
            priority: 6
        });
    }

    // Forecast-based alerts
    const tomorrow = forecast[0];
    if (tomorrow && tomorrow.precipitation > 5) {
        alerts.push({
            id: `forecast-rain-${Date.now()}`,
            type: 'info',
            title: 'Rain Forecast Tomorrow',
            message: `Tomorrow: ${tomorrow.condition} with ${tomorrow.precipitation}mm precipitation expected.`,
            recommendation: 'Prepare for wet conditions, delay field work if heavy rain is expected.',
            crops: ['All Crops'],
            timestamp: new Date(),
            weatherCondition: `Tomorrow: ${tomorrow.condition}`,
            priority: 4
        });
    }

    // Sort alerts by priority (highest first)
    return alerts.sort((a, b) => b.priority - a.priority);
};

// Get user alert preferences
export const getAlertPreferences = (userId: string): AlertPreferences => {
    const stored = localStorage.getItem(`alert_preferences_${userId}`);
    if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    }
    return DEFAULT_PREFERENCES;
};

// Save user alert preferences
export const saveAlertPreferences = (userId: string, preferences: AlertPreferences): void => {
    localStorage.setItem(`alert_preferences_${userId}`, JSON.stringify(preferences));
};

// Filter alerts based on user preferences
export const filterAlertsByPreferences = (alerts: FarmingAlert[], preferences: AlertPreferences): FarmingAlert[] => {
    return alerts.filter(alert => {
        if (!preferences.temperatureAlerts && alert.title.toLowerCase().includes('temperature')) return false;
        if (!preferences.rainAlerts && alert.title.toLowerCase().includes('rain')) return false;
        if (!preferences.windAlerts && alert.title.toLowerCase().includes('wind')) return false;
        if (!preferences.humidityAlerts && alert.title.toLowerCase().includes('humidity')) return false;
        if (!preferences.frostAlerts && alert.title.toLowerCase().includes('frost')) return false;
        return true;
    });
};

// Mock SMS sending function
export const sendSMSAlert = async (phoneNumber: string, alert: FarmingAlert): Promise<boolean> => {
    try {
        const { sendFarmingAlertSMS } = await import('./smsService');
        const result = await sendFarmingAlertSMS(phoneNumber, alert);
        return result !== null;
    } catch (error) {
        console.error('Failed to send SMS alert:', error);
        return false;
    }
};

// Mock email sending function
export const sendEmailAlert = async (email: string, alert: FarmingAlert): Promise<boolean> => {
    // In a real application, this would integrate with an email service
    console.log(`Sending email to ${email}: ${alert.title} - ${alert.message}`);

    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    });
};

// Send alerts to user based on preferences
export const sendAlertsToUser = async (userId: string, alerts: FarmingAlert[]): Promise<void> => {
    const preferences = getAlertPreferences(userId);
    const filteredAlerts = filterAlertsByPreferences(alerts, preferences);

    for (const alert of filteredAlerts) {
        if (preferences.smsEnabled && preferences.phoneNumber) {
            await sendSMSAlert(preferences.phoneNumber, alert);
        }

        // Note: Email would need user email from auth context
        // if (preferences.emailEnabled && userEmail) {
        //   await sendEmailAlert(userEmail, alert);
        // }
    }
};