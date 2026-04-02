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
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        } catch (error) {
            console.error('Failed to initialize Gemini AI:', error);
        }
    }

    async generateSuggestions(url, issues, score) {
        // If AI is not available, return an explicit service unavailable message
        if (!this.model) {
            return ["AI suggestions unavailable. Please check your Gemini API key."];
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
            return ["AI suggestions unavailable due to an error. Please check your console or try again later."];
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


}

export default new AIService();
