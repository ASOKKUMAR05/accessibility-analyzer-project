import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const analyzeURL = async (url) => {
    try {
        const response = await api.post('/analyze', { url });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getReports = async (limit = 20) => {
    try {
        const response = await api.get(`/reports?limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getReport = async (id) => {
    try {
        const response = await api.get(`/reports/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteReport = async (id) => {
    try {
        const response = await api.delete(`/reports/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Auth API Calls
export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'An error occurred during login' };
    }
};

export const registerUser = async (name, email, password) => {
    try {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'An error occurred during registration' };
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'An error occurred fetching user' };
    }
};

export default api;
