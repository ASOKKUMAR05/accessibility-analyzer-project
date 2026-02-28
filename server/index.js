import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRoutes from './routes/analyze.routes.js';
import aiService from './services/ai.service.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize AI service
aiService.initialize(process.env.GEMINI_API_KEY);

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // These options are no longer needed in Mongoose 6+
        });
        console.log(' MongoDB connected successfully');
    } catch (error) {
        console.error(' MongoDB connection error:', error);
        process.exit(1);
    }
};

connectDB();

// Routes
app.use('/api', analyzeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Accessibility Analyzer API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` API available at http://localhost:${PORT}/api`);
    console.log(` MongoDB URI: ${process.env.MONGODB_URI}`);
    console.log(` AI Service: ${process.env.GEMINI_API_KEY ? 'Enabled' : 'Disabled (using fallback)'}`);
});

export default app;
