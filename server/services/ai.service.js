import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
    constructor() {
        this.genAI = null;
        this.model = null;
    }

    initialize(apiKey) {
        if (!apiKey) {
            console.warn('Gemini API key not provided. AI suggestions will be limited.');
            return;
        }

        try {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
        } catch (error) {
            console.error('Failed to initialize Gemini AI:', error);
        }
    }

    async generateSuggestions(url, issues, score) {
        // If AI is not available, return basic suggestions
        if (!this.model) {
            return this.getBasicSuggestions(issues, score);
        }

        try {
            const prompt = this.buildPrompt(url, issues, score);
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse the response into individual suggestions
            return this.parseSuggestions(text);
        } catch (error) {
            console.error('AI suggestion generation failed:', error);
            return this.getBasicSuggestions(issues, score);
        }
    }

    buildPrompt(url, issues, score) {
        const issuesSummary = issues.slice(0, 10).map(issue =>
            `- ${issue.title} (${issue.severity}): ${issue.description}`
        ).join('\n');

        return `You are an accessibility expert. A website "${url}" has an accessibility score of ${score}/100.

Here are the main accessibility issues found:
${issuesSummary}

Please provide 5-7 concise, actionable suggestions to improve the website's accessibility. Each suggestion should:
1. Be specific and practical
2. Reference WCAG guidelines where relevant
3. Include code examples or specific implementation steps when possible
4. Prioritize critical issues first

Format your response as a numbered list of suggestions.`;
    }

    parseSuggestions(text) {
        // Split by numbered list items
        const lines = text.split('\n').filter(line => line.trim());
        const suggestions = [];

        for (const line of lines) {
            // Match numbered items like "1.", "1)", etc.
            const match = line.match(/^\d+[\.)]\s*(.+)/);
            if (match) {
                suggestions.push(match[1].trim());
            } else if (line.trim() && suggestions.length > 0) {
                // Continuation of previous suggestion
                suggestions[suggestions.length - 1] += ' ' + line.trim();
            }
        }

        return suggestions.length > 0 ? suggestions : [text];
    }

    getBasicSuggestions(issues, score) {
        const suggestions = [];

        // Score-based suggestions
        if (score < 50) {
            suggestions.push('Critical: Your accessibility score is very low. Prioritize fixing color contrast issues and missing alt text immediately.');
        } else if (score < 75) {
            suggestions.push('Important: Focus on addressing serious accessibility violations to reach WCAG AA compliance.');
        }

        // Issue-based suggestions
        const hasCritical = issues.some(i => i.severity === 'critical');
        if (hasCritical) {
            suggestions.push('Fix all critical issues first - these prevent users from accessing your content.');
        }

        const categories = issues.reduce((acc, issue) => {
            acc[issue.category] = (acc[issue.category] || 0) + 1;
            return acc;
        }, {});

        if (categories.colorContrast > 0) {
            suggestions.push('Improve color contrast ratios to at least 4.5:1 for normal text and 3:1 for large text (WCAG AA standard).');
        }

        if (categories.images > 0) {
            suggestions.push('Add descriptive alt text to all images. Decorative images should have empty alt attributes (alt="").');
        }

        if (categories.ariaAttributes > 0) {
            suggestions.push('Review and fix ARIA attributes. Ensure all ARIA roles have required attributes and valid values.');
        }

        if (categories.formLabels > 0) {
            suggestions.push('Associate all form inputs with explicit <label> elements using the "for" attribute.');
        }

        if (categories.keyboardNavigation > 0) {
            suggestions.push('Ensure all interactive elements are keyboard accessible. Test navigation using only Tab, Enter, and arrow keys.');
        }

        if (categories.semanticHTML > 0) {
            suggestions.push('Use semantic HTML5 elements (<header>, <nav>, <main>, <article>) to improve document structure.');
        }

        // General suggestions
        suggestions.push('Test your site with screen readers like NVDA (Windows) or VoiceOver (Mac/iOS).');
        suggestions.push('Consider implementing skip navigation links for keyboard users.');

        return suggestions.slice(0, 7);
    }
}

export default new AIService();
