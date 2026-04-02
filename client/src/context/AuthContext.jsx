import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from local storage on mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const userData = await loginUser(email, password);
        if (userData && userData.token) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        }
        return userData;
    };

    const register = async (name, email, password) => {
        const userData = await registerUser(name, email, password);
        if (userData && userData.token) {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        }
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
