import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { LogIn, UserPlus, Leaf, Mail, Lock, User, Phone, MapPin } from 'lucide-react';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register, loading } = useAuth();
    const { showToast } = useToast();

    const [loginData, setLoginData] = useState({
        identifier: '',
        password: ''
    });

    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: '',
        city: '',
        pincode: ''
    });

    const [activeTab, setActiveTab] = useState('login');

    const from = location.state?.from?.pathname || '/';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!loginData.identifier || !loginData.password) {
            showToast({
                type: 'error',
                title: 'Validation Error',
                message: 'Please fill in all fields',
                duration: 3000
            });
            return;
        }

        const success = await login(loginData.identifier, loginData.password);

        if (success) {
            showToast({
                type: 'success',
                title: 'Login Successful',
                message: 'Welcome back to AgriAssist!',
                duration: 3000
            });
            navigate(from, { replace: true });
        } else {
            showToast({
                type: 'error',
                title: 'Login Failed',
                message: 'Invalid email or password',
                duration: 3000
            });
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!registerData.name || !registerData.email || !registerData.phone || !registerData.password) {
            showToast({
                type: 'error',
                title: 'Validation Error',
                message: 'Please fill in all required fields',
                duration: 3000
            });
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            showToast({
                type: 'error',
                title: 'Password Mismatch',
                message: 'Passwords do not match',
                duration: 3000
            });
            return;
        }

        if (registerData.password.length < 6) {
            showToast({
                type: 'error',
                title: 'Weak Password',
                message: 'Password must be at least 6 characters long',
                duration: 3000
            });
            return;
        }

        const success = await register({
            name: registerData.name,
            email: registerData.email,
            phone: registerData.phone,
            password: registerData.password,
            address: registerData.address,
            city: registerData.city,
            pincode: registerData.pincode
        });

        if (success) {
            showToast({
                type: 'success',
                title: 'Registration Successful',
                message: 'Welcome to Agri-Rover! Your account has been created.',
                duration: 3000
            });
            navigate(from, { replace: true });
        } else {
            showToast({
                type: 'error',
                title: 'Registration Failed',
                message: 'Email already exists. Please use a different email.',
                duration: 3000
            });
        }
    };

    const handleLoginInputChange = (field: string, value: string) => {
        setLoginData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleRegisterInputChange = (field: string, value: string) => {
        setRegisterData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Leaf className="h-8 w-8 text-green-600" />
                        <h1 className="text-3xl font-bold text-gray-800">Agri-Rover</h1>
                    </div>
                    <p className="text-gray-600">Fresh from farm to your table</p>
                </div>

                {/* Auth Card */}
                <Card className="shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">
                            {activeTab === 'login' ? 'Welcome Back' : 'Join AgriAssist'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="login" className="flex items-center space-x-2">
                                    <LogIn className="h-4 w-4" />
                                    <span>Login</span>
                                </TabsTrigger>
                                <TabsTrigger value="register" className="flex items-center space-x-2">
                                    <UserPlus className="h-4 w-4" />
                                    <span>Register</span>
                                </TabsTrigger>
                            </TabsList>

                            {/* Login Tab */}
                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="space-y-4">

                                    <div>
                                        <Label htmlFor="login-identifier" className="flex items-center space-x-2">
                                            <Mail className="h-4 w-4" />
                                            <span>Email or Phone</span>
                                        </Label>
                                        <Input
                                            id="login-identifier"
                                            type="text"
                                            value={loginData.identifier}
                                            onChange={(e) => handleLoginInputChange('identifier', e.target.value)}
                                            placeholder="Enter your email or phone"
                                            className="mt-1"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="login-password" className="flex items-center space-x-2">
                                            <Lock className="h-4 w-4" />
                                            <span>Password</span>
                                        </Label>
                                        <Input
                                            id="login-password"
                                            type="password"
                                            value={loginData.password}
                                            onChange={(e) => handleLoginInputChange('password', e.target.value)}
                                            placeholder="Enter your password"
                                            className="mt-1"
                                            disabled={loading}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        disabled={loading}
                                    >
                                        {loading ? 'Signing In...' : 'Sign In'}
                                    </Button>
                                </form>
                            </TabsContent>

                            {/* Register Tab */}
                            <TabsContent value="register">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="register-name" className="flex items-center space-x-2">
                                                <User className="h-4 w-4" />
                                                <span>Name *</span>
                                            </Label>
                                            <Input
                                                id="register-name"
                                                type="text"
                                                value={registerData.name}
                                                onChange={(e) => handleRegisterInputChange('name', e.target.value)}
                                                placeholder="Full name"
                                                className="mt-1"
                                                disabled={loading}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="register-phone" className="flex items-center space-x-2">
                                                <Phone className="h-4 w-4" />
                                                <span>Phone *</span>
                                            </Label>
                                            <Input
                                                id="register-phone"
                                                type="tel"
                                                value={registerData.phone}
                                                onChange={(e) => handleRegisterInputChange('phone', e.target.value)}
                                                placeholder="Phone number"
                                                className="mt-1"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="register-email" className="flex items-center space-x-2">
                                            <Mail className="h-4 w-4" />
                                            <span>Email *</span>
                                        </Label>
                                        <Input
                                            id="register-email"
                                            type="email"
                                            value={registerData.email}
                                            onChange={(e) => handleRegisterInputChange('email', e.target.value)}
                                            placeholder="Email address"
                                            className="mt-1"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="register-password">Password *</Label>
                                            <Input
                                                id="register-password"
                                                type="password"
                                                value={registerData.password}
                                                onChange={(e) => handleRegisterInputChange('password', e.target.value)}
                                                placeholder="Password"
                                                className="mt-1"
                                                disabled={loading}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="register-confirm-password">Confirm Password *</Label>
                                            <Input
                                                id="register-confirm-password"
                                                type="password"
                                                value={registerData.confirmPassword}
                                                onChange={(e) => handleRegisterInputChange('confirmPassword', e.target.value)}
                                                placeholder="Confirm password"
                                                className="mt-1"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="register-address" className="flex items-center space-x-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>Address</span>
                                        </Label>
                                        <Textarea
                                            id="register-address"
                                            value={registerData.address}
                                            onChange={(e) => handleRegisterInputChange('address', e.target.value)}
                                            placeholder="Delivery address"
                                            className="mt-1"
                                            rows={2}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="register-city">City</Label>
                                            <Input
                                                id="register-city"
                                                type="text"
                                                value={registerData.city}
                                                onChange={(e) => handleRegisterInputChange('city', e.target.value)}
                                                placeholder="City"
                                                className="mt-1"
                                                disabled={loading}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="register-pincode">Pincode</Label>
                                            <Input
                                                id="register-pincode"
                                                type="text"
                                                value={registerData.pincode}
                                                onChange={(e) => handleRegisterInputChange('pincode', e.target.value)}
                                                placeholder="Pincode"
                                                className="mt-1"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-gray-600">
                    <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </div>
    );
};

export default Login;