import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, ShoppingCart, Leaf, Bell, Camera, BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-800">AgriAssist</span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">Welcome, {user?.name}</span>
                </div>

                {/* Cart Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={() => navigate('/')}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Marketplace</span>
                </Button>

                {/* Alerts Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={() => navigate('/alerts')}
                >
                  <Bell className="h-4 w-4" />
                  <span>Alerts</span>
                </Button>

                {/* Scanner Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={() => navigate('/scanner')}
                >
                  <Camera className="h-4 w-4" />
                  <span>Scanner</span>
                </Button>

                {/* Crop Guide Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={() => navigate('/crop-guide')}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Crop Guide</span>
                </Button>

                {/* Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Button>

                {/* Register Button */}
                <Button
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                >
                  <span>Get Started</span>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;