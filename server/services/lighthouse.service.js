import axios from 'axios';

class LighthouseService {
    async analyzeURL(url) {
        try {
            console.log(`Analyzing via Google PageSpeed API: ${url}`);
            // Call Google PageSpeed Insights API
            const apiKey = process.env.PAGESPEED_API_KEY;
            const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=accessibility&category=performance&category=best-practices&category=seo${apiKey ? `&key=${apiKey}` : ''}`;

            let response;
            try {
                response = await axios.get(apiUrl);
            } catch (axiosError) {
                const status = axiosError.response?.status;
                const responseData = axiosError.response?.data;

                // PageSpeed API returns an HTML page for 429 rate-limit errors
                if (status === 429 || (typeof responseData === 'string' && responseData.includes('automated queries'))) {
                    throw new Error(
                        'Google PageSpeed API rate limit reached. Please wait a moment and try again, or add a PAGESPEED_API_KEY environment variable to increase your quota.'
                    );
                }

                // Surface structured JSON error messages when available
                const jsonMessage = typeof responseData === 'object' ? responseData?.error?.message : null;
                throw new Error(jsonMessage || axiosError.message);
            }

            // Extract accessibility data exactly how local Lighthouse returns it
            const { lighthouseResult: lhr } = response.data;
            const accessibilityCategory = lhr.categories.accessibility || { score: 0, auditRefs: [] };
            const performanceCategory = lhr.categories.performance || { score: 0 };
            const bestPracticesCategory = lhr.categories['best-practices'] || { score: 0 };
            const seoCategory = lhr.categories.seo || { score: 0 };

            // Parse issues
            const issues = this.parseIssues(lhr.audits, accessibilityCategory);
            const categorizedIssues = this.categorizeIssues(issues);
            const severityCounts = this.countSeverities(issues);

            return {
                url,
                score: Math.round((accessibilityCategory.score || 0) * 100),
                performanceScore: Math.round((performanceCategory.score || 0) * 100),
                bestPracticesScore: Math.round((bestPracticesCategory.score || 0) * 100),
                seoScore: Math.round((seoCategory.score || 0) * 100),
                issues,
                totalIssues: severityCounts,
                categories: categorizedIssues
            };
        } catch (error) {
            console.error('PageSpeed API error:', error.message);
            throw new Error(`Failed to analyze URL: ${error.message}`);
        }
    }

    parseIssues(audits, accessibilityCategory) {
        const issues = [];
        const auditRefs = accessibilityCategory.auditRefs;

        for (const auditRef of auditRefs) {
            const audit = audits[auditRef.id];

            if (audit.score !== null && audit.score < 1) {
                const severity = this.determineSeverity(audit.score, auditRef.weight);

                // Extract details
                const details = audit.details;
                let element = '';
                let selector = '';

                if (details && details.items && details.items.length > 0) {
                    const item = details.items[0];
                    if (item.node) {
                        element = item.node.snippet || '';
                        selector = item.node.selector || '';
                    }
                }

                issues.push({
                    id: auditRef.id,
                    title: audit.title,
                    description: audit.description,
                    severity,
                    element,
                    selector,
                    category: this.getCategoryFromAudit(auditRef.id),
                    wcagLevel: this.getWCAGLevel(auditRef.id)
                });
            }
        }

        return issues;
    }

    determineSeverity(score, weight) {
        if (score === 0) return 'critical';
        if (score < 0.5 && weight >= 3) return 'serious';
        if (score < 0.75) return 'moderate';
        return 'minor';
    }

    getCategoryFromAudit(auditId) {
        const categoryMap = {
            'color-contrast': 'colorContrast',
            'aria-': 'ariaAttributes',
            'tabindex': 'keyboardNavigation',
            'accesskeys': 'keyboardNavigation',
            'heading': 'semanticHTML',
            'html-': 'semanticHTML',
            'label': 'formLabels',
            'form-': 'formLabels',
            'image-': 'images',
            'image-alt': 'images'
        };

        for (const [key, category] of Object.entries(categoryMap)) {
            if (auditId.includes(key)) {
                return category;
            }
        }

        return 'other';
    }

    getWCAGLevel(auditId) {
        // Map common audits to WCAG levels
        const wcagMap = {
            'color-contrast': 'AA',
            'image-alt': 'A',
            'aria-allowed-attr': 'A',
            'aria-required-attr': 'A',
            'label': 'A',
            'link-name': 'A'
        };

        return wcagMap[auditId] || 'AA';
    }

    categorizeIssues(issues) {
        const categories = {
            colorContrast: 0,
            ariaAttributes: 0,
            keyboardNavigation: 0,
            semanticHTML: 0,
            formLabels: 0,
            images: 0
        };

        issues.forEach(issue => {
            if (categories.hasOwnProperty(issue.category)) {
                categories[issue.category]++;
            }
        });

        return categories;
    }

    countSeverities(issues) {
        return issues.reduce((acc, issue) => {
            acc[issue.severity] = (acc[issue.severity] || 0) + 1;
            return acc;
        }, { critical: 0, serious: 0, moderate: 0, minor: 0 });
    }
}

export default new LighthouseService();
