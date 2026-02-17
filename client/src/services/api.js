import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
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

export default api;
