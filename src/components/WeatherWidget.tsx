import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind,
  Eye,
  MapPin
} from "lucide-react";

const WeatherWidget = () => {
  // Mock weather data - in real app this would come from weather API
  const currentWeather = {
    location: "Punjab, India",
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    uvIndex: 6
  };

  const forecast = [
    { day: "Today", icon: Cloud, temp: "28°/18°", condition: "Partly Cloudy", rain: "10%" },
    { day: "Tomorrow", icon: Sun, temp: "32°/20°", condition: "Sunny", rain: "0%" },
    { day: "Wed", icon: CloudRain, temp: "26°/16°", condition: "Light Rain", rain: "70%" },
    { day: "Thu", icon: Sun, temp: "30°/19°", condition: "Clear", rain: "5%" },
    { day: "Fri", icon: Cloud, temp: "29°/17°", condition: "Cloudy", rain: "20%" }
  ];

  const farmingAlerts = [
    { type: "warning", message: "Ideal conditions for wheat harvesting", icon: "🌾" },
    { type: "info", message: "Good time for irrigation - low wind", icon: "💧" },
    { type: "success", message: "Perfect weather for pesticide application", icon: "🚜" }
  ];

  return (
    <section className="py-16 bg-gradient-sky/20" id="weather">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Current Weather Card */}
          <Card className="lg:col-span-1 shadow-medium">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  Current Weather
                </CardTitle>
                <Badge variant="outline" className="text-xs">Live</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{currentWeather.location}</p>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Cloud className="h-12 w-12 text-primary mr-3" />
                  <span className="text-4xl font-bold text-foreground">{currentWeather.temperature}°C</span>
                </div>
                <p className="text-muted-foreground font-medium">{currentWeather.condition}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Humidity</p>
                    <p className="font-semibold">{currentWeather.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Wind</p>
                    <p className="font-semibold">{currentWeather.windSpeed} km/h</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Visibility</p>
                    <p className="font-semibold">{currentWeather.visibility} km</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">UV Index</p>
                    <p className="font-semibold">{currentWeather.uvIndex}/10</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5-Day Forecast */}
          <Card className="lg:col-span-1 shadow-medium">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">5-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <day.icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{day.day}</p>
                        <p className="text-xs text-muted-foreground">{day.condition}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{day.temp}</p>
                      <p className="text-xs text-blue-500">{day.rain} rain</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Farming Alerts */}
          <Card className="lg:col-span-1 shadow-medium">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Farming Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {farmingAlerts.map((alert, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    alert.type === 'warning' ? 'bg-warning/10 border-warning' :
                    alert.type === 'info' ? 'bg-blue-50 border-blue-400' :
                    'bg-success/10 border-success'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{alert.icon}</span>
                      <p className="text-sm font-medium text-foreground leading-relaxed">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Thermometer className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Today's Farming Tip</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  With current humidity at 65%, it's an excellent time for transplanting seedlings. 
                  Avoid watering in the next 2 hours due to optimal soil moisture levels.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WeatherWidget;