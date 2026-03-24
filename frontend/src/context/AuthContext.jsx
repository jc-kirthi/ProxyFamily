import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/auth`;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // ✅ Store both user and token
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });
    
    const [isAuthenticated, setIsAuthenticated] = useState(!!user && !!token);
    const [isAuthReady, setIsAuthReady] = useState(true);

    // ✅ Sync with localStorage
    useEffect(() => {
        if (user && token) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setIsAuthenticated(false);
        }
    }, [user, token]);

    // ✅ Updated login function
    const login = (userData) => {
        setUser(userData.user);
        setToken(userData.token); // Store the token
    };

    // ✅ Updated logout function (MOCKED FOR FRONTEND DEMO)
    const logout = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 400));
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setUser(null);
            setToken(null);
        }
    };

    // ✅ NEW: Demo Login for judges
    const demoLogin = () => {
        const demoUser = {
            id: 'demo_judge',
            name: 'Expert Judge',
            email: 'judge@demo.com',
            role: 'freelancer'
        };
        const demoToken = 'demo-token-judge-123';
        setUser(demoUser);
        setToken(demoToken);
    };

    const value = {
        user,
        token, // 🔥 Expose token for API calls
        isAuthenticated,
        isAuthReady,
        login,
        logout,
        demoLogin
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
