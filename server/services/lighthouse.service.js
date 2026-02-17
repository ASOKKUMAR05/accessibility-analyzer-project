import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import puppeteer from 'puppeteer';

class LighthouseService {
    async analyzeURL(url) {
        let chrome;
        try {
            // Launch Chrome
            chrome = await chromeLauncher.launch({
                chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
            });

            // Run Lighthouse
            const options = {
                logLevel: 'error',
                output: 'json',
                onlyCategories: ['accessibility', 'performance', 'best-practices', 'seo'],
                port: chrome.port
            };

            const runnerResult = await lighthouse(url, options);

            // Extract accessibility data
            const { lhr } = runnerResult;
            const accessibilityCategory = lhr.categories.accessibility;
            const performanceCategory = lhr.categories.performance;
            const bestPracticesCategory = lhr.categories['best-practices'];
            const seoCategory = lhr.categories.seo;

            // Parse issues
            const issues = this.parseIssues(lhr.audits, accessibilityCategory);
            const categorizedIssues = this.categorizeIssues(issues);
            const severityCounts = this.countSeverities(issues);

            return {
                url,
                score: Math.round(accessibilityCategory.score * 100),
                performanceScore: Math.round(performanceCategory.score * 100),
                bestPracticesScore: Math.round(bestPracticesCategory.score * 100),
                seoScore: Math.round(seoCategory.score * 100),
                issues,
                totalIssues: severityCounts,
                categories: categorizedIssues
            };
        } catch (error) {
            console.error('Lighthouse analysis error:', error);
            throw new Error(`Failed to analyze URL: ${error.message}`);
        } finally {
            if (chrome) {
                await chrome.kill();
            }
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
