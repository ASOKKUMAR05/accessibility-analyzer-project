import express from 'express';
import lighthouseService from '../services/lighthouse.service.js';
import aiService from '../services/ai.service.js';
import Report from '../models/Report.js';

const router = express.Router();

// Analyze a URL
router.post('/analyze', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        console.log(`Analyzing URL: ${url}`);

        // Run Lighthouse analysis
        const analysisResult = await lighthouseService.analyzeURL(url);

        // Generate AI suggestions
        const suggestions = await aiService.generateSuggestions(
            url,
            analysisResult.issues,
            analysisResult.score
        );

        // Save report to database
        const report = new Report({
            ...analysisResult,
            suggestions
        });

        await report.save();

        res.json({
            success: true,
            report: {
                id: report._id,
                url: report.url,
                score: report.score,
                performanceScore: report.performanceScore,
                bestPracticesScore: report.bestPracticesScore,
                seoScore: report.seoScore,
                issues: report.issues,
                totalIssues: report.totalIssues,
                categories: report.categories,
                suggestions: report.suggestions,
                analyzedAt: report.analyzedAt
            }
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            error: 'Failed to analyze URL',
            message: error.message
        });
    }
});

// Get all reports
router.get('/reports', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const reports = await Report.find()
            .sort({ analyzedAt: -1 })
            .limit(limit)
            .select('-issues'); // Exclude detailed issues for list view

        res.json({
            success: true,
            reports
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({
            error: 'Failed to fetch reports',
            message: error.message
        });
    }
});

// Get a specific report
router.get('/reports/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.json({
            success: true,
            report
        });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({
            error: 'Failed to fetch report',
            message: error.message
        });
    }
});

// Delete a report
router.delete('/reports/:id', async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.json({
            success: true,
            message: 'Report deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({
            error: 'Failed to delete report',
            message: error.message
        });
    }
});

export default router;
