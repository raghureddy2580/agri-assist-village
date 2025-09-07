import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import Header from '@/components/Header';
import { getCurrentWeather } from '@/lib/weatherService';
import { generateFarmingAlerts, getAlertPreferences, saveAlertPreferences, FarmingAlert, AlertPreferences } from '@/lib/farmingAlerts';
import { smsService, SMSMessage } from '@/lib/smsService';
import { Bell, AlertTriangle, Info, AlertCircle, Settings, CloudRain, Thermometer, Wind, Droplets, Phone, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

const Alerts: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [alerts, setAlerts] = useState<FarmingAlert[]>([]);
    const [smsMessages, setSmsMessages] = useState<SMSMessage[]>([]);
    const [preferences, setPreferences] = useState<AlertPreferences>({
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
    });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('alerts');

    // Load user preferences on component mount
    useEffect(() => {
        if (user?.id) {
            const userPrefs = getAlertPreferences(user.id);
            setPreferences(userPrefs);
        }
    }, [user]);

    // Generate alerts and load SMS messages when component mounts
    useEffect(() => {
        generateAlerts();
        loadSMSMessages();
    }, [user]);

    const loadSMSMessages = () => {
        if (user && preferences.phoneNumber) {
            const messages = smsService.getMessages(preferences.phoneNumber);
            setSmsMessages(messages);
        }
    };

    const generateAlerts = async () => {
        setLoading(true);
        try {
            const weatherData = await getCurrentWeather();
            const newAlerts = generateFarmingAlerts(weatherData);
            setAlerts(newAlerts);
        } catch (error) {
            showToast({
                type: 'error',
                title: 'Error',
                message: 'Failed to fetch weather data for alerts',
                duration: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePreferenceChange = (key: keyof AlertPreferences, value: boolean | string) => {
        const newPreferences = { ...preferences, [key]: value };
        setPreferences(newPreferences);

        if (user?.id) {
            saveAlertPreferences(user.id, newPreferences);
            showToast({
                type: 'success',
                title: 'Preferences Updated',
                message: 'Your alert preferences have been saved',
                duration: 2000
            });
        }
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'critical':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'info':
                return <Info className="h-5 w-5 text-blue-500" />;
            default:
                return <Bell className="h-5 w-5 text-gray-500" />;
        }
    };

    const getAlertColor = (type: string) => {
        switch (type) {
            case 'critical':
                return 'border-red-200 bg-red-50';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50';
            case 'info':
                return 'border-blue-200 bg-blue-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="max-w-4xl mx-auto p-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
                        <p className="text-muted-foreground">You need to be logged in to access farming alerts.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="max-w-6xl mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Farming Alerts & Notifications</h1>
                    <p className="text-muted-foreground">Stay informed about weather conditions that affect your crops</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="alerts" className="flex items-center space-x-2">
                            <Bell className="h-4 w-4" />
                            <span>Current Alerts</span>
                        </TabsTrigger>
                        <TabsTrigger value="sms" className="flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>SMS History</span>
                        </TabsTrigger>
                        <TabsTrigger value="preferences" className="flex items-center space-x-2">
                            <Settings className="h-4 w-4" />
                            <span>Preferences</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Alerts Tab */}
                    <TabsContent value="alerts" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Current Farming Alerts</h2>
                            <Button onClick={generateAlerts} disabled={loading}>
                                {loading ? 'Refreshing...' : 'Refresh Alerts'}
                            </Button>
                        </div>

                        {alerts.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-8">
                                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No Active Alerts</h3>
                                    <p className="text-muted-foreground">Weather conditions are favorable for farming activities.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {alerts.map((alert) => (
                                    <Card key={alert.id} className={`border-l-4 ${getAlertColor(alert.type)}`}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start space-x-4">
                                                {getAlertIcon(alert.type)}
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-semibold text-lg">{alert.title}</h3>
                                                        <Badge variant={alert.type === 'critical' ? 'destructive' : 'secondary'}>
                                                            Priority {alert.priority}/10
                                                        </Badge>
                                                    </div>

                                                    <p className="text-muted-foreground mb-3">{alert.message}</p>

                                                    <div className="bg-white/50 p-3 rounded-lg mb-3">
                                                        <h4 className="font-medium mb-1">Recommendation:</h4>
                                                        <p className="text-sm">{alert.recommendation}</p>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        <span className="text-sm font-medium">Affected Crops:</span>
                                                        {alert.crops.map((crop) => (
                                                            <Badge key={crop} variant="outline" className="text-xs">
                                                                {crop}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                                                        <span>Weather: {alert.weatherCondition}</span>
                                                        <span>{alert.timestamp.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Preferences Tab */}
                    <TabsContent value="preferences" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Settings className="h-5 w-5" />
                                    <span>Alert Preferences</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Alert Types */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Alert Types</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Thermometer className="h-4 w-4 text-red-500" />
                                                <div>
                                                    <Label>Temperature Alerts</Label>
                                                    <p className="text-sm text-muted-foreground">Heat waves, frost warnings</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={preferences.temperatureAlerts}
                                                onCheckedChange={(checked) => handlePreferenceChange('temperatureAlerts', checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <CloudRain className="h-4 w-4 text-blue-500" />
                                                <div>
                                                    <Label>Rain Alerts</Label>
                                                    <p className="text-sm text-muted-foreground">Heavy rain, drought warnings</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={preferences.rainAlerts}
                                                onCheckedChange={(checked) => handlePreferenceChange('rainAlerts', checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Wind className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <Label>Wind Alerts</Label>
                                                    <p className="text-sm text-muted-foreground">High wind warnings</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={preferences.windAlerts}
                                                onCheckedChange={(checked) => handlePreferenceChange('windAlerts', checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Droplets className="h-4 w-4 text-cyan-500" />
                                                <div>
                                                    <Label>Humidity Alerts</Label>
                                                    <p className="text-sm text-muted-foreground">High/low humidity warnings</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={preferences.humidityAlerts}
                                                onCheckedChange={(checked) => handlePreferenceChange('humidityAlerts', checked)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Notification Methods */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Notification Methods</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="phone" className="flex items-center space-x-2">
                                                <Phone className="h-4 w-4" />
                                                <span>Phone Number for SMS</span>
                                            </Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={preferences.phoneNumber}
                                                onChange={(e) => handlePreferenceChange('phoneNumber', e.target.value)}
                                                placeholder="+91 9876543210"
                                                className="mt-1"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>SMS Notifications</Label>
                                                <p className="text-sm text-muted-foreground">Receive alerts via SMS</p>
                                            </div>
                                            <Switch
                                                checked={preferences.smsEnabled}
                                                onCheckedChange={(checked) => handlePreferenceChange('smsEnabled', checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label>Email Notifications</Label>
                                                <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                                            </div>
                                            <Switch
                                                checked={preferences.emailEnabled}
                                                onCheckedChange={(checked) => handlePreferenceChange('emailEnabled', checked)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* SMS History Tab */}
                    <TabsContent value="sms" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">SMS Notification History</h2>
                            <Button onClick={loadSMSMessages} variant="outline">
                                Refresh
                            </Button>
                        </div>

                        {!preferences.phoneNumber ? (
                            <Card>
                                <CardContent className="text-center py-8">
                                    <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No Phone Number</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Add your phone number in preferences to receive SMS alerts.
                                    </p>
                                    <Button onClick={() => setActiveTab('preferences')}>
                                        Go to Preferences
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : smsMessages.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-8">
                                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No SMS Messages</h3>
                                    <p className="text-muted-foreground">
                                        SMS alerts will appear here when weather conditions trigger notifications.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {smsMessages.map((message) => (
                                    <Card key={message.id} className="border-l-4 border-l-blue-500">
                                        <CardContent className="p-6">
                                            <div className="flex items-start space-x-4">
                                                {message.status === 'delivered' ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-500 mt-1" />
                                                )}
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium">To: {message.to}</span>
                                                            <Badge variant={message.status === 'delivered' ? 'default' : 'destructive'}>
                                                                {message.status}
                                                            </Badge>
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">
                                                            {message.timestamp.toLocaleString()}
                                                        </span>
                                                    </div>

                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <p className="text-sm whitespace-pre-line">{message.message}</p>
                                                    </div>

                                                    {message.alertId && (
                                                        <p className="text-xs text-muted-foreground mt-2">
                                                            Alert ID: {message.alertId}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Alerts;