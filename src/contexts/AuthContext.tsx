import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    pincode?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('agri_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('agri_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get stored users
        const users = JSON.parse(localStorage.getItem('agri_users') || '[]');

        // Find user
        const foundUser = users.find((u: any) => u.email === email && u.password === password);

        if (foundUser) {
            const { password: _, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
            localStorage.setItem('agri_user', JSON.stringify(userWithoutPassword));
            setLoading(false);
            return true;
        }

        setLoading(false);
        return false;
    };

    const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
        setLoading(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get existing users
        const users = JSON.parse(localStorage.getItem('agri_users') || '[]');

        // Check if user already exists
        const existingUser = users.find((u: any) => u.email === userData.email);
        if (existingUser) {
            setLoading(false);
            return false;
        }

        // Create new user
        const newUser = {
            ...userData,
            id: Date.now().toString()
        };

        // Save user
        users.push(newUser);
        localStorage.setItem('agri_users', JSON.stringify(users));

        // Auto login
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem('agri_user', JSON.stringify(userWithoutPassword));

        setLoading(false);
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('agri_user');
    };

    const value: AuthContextType = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};