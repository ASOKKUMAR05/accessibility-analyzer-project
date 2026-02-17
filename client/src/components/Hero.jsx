import React, { useState } from 'react';
import { analyzeURL } from '../services/api';

const Hero = ({ onAnalysisComplete, loading, setLoading }) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!url.trim()) {
            setError('Please enter a URL');
            return;
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            setError('Please enter a valid URL (including http:// or https://)');
            return;
        }

        setLoading(true);

        try {
            const result = await analyzeURL(url);
            onAnalysisComplete(result.report);
        } catch (err) {
            setError(err.error || err.message || 'Failed to analyze URL. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="hero">
            <div className="container">
                <div className="hero-content fade-in">
                    <h1 className="hero-title">
                        Make the Web
                        <span className="text-gradient"> Accessible</span>
                    </h1>
                    <p className="hero-subtitle">
                        Analyze any website for accessibility issues and get AI-powered suggestions
                        to improve usability for everyone.
                    </p>

                    <form onSubmit={handleSubmit} className="url-form">
                        <div className="input-group">
                            <input
                                type="text"
                                className="input url-input"
                                placeholder="Enter website URL (e.g., https://example.com)"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                disabled={loading}
                            />
                            {error && <p className="error-message">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-analyze"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner-small"></div>
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <span>🔍</span>
                                    Analyze Accessibility
                                </>
                            )}
                        </button>
                    </form>

                    {/* Features */}
                    <div className="features grid grid-3 mt-3">
                        <div className="feature-card glass-card">
                            <div className="feature-icon">🎨</div>
                            <h3>Color Contrast</h3>
                            <p>Check color contrast ratios for readability</p>
                        </div>
                        <div className="feature-card glass-card">
                            <div className="feature-icon">⌨️</div>
                            <h3>Keyboard Navigation</h3>
                            <p>Ensure full keyboard accessibility</p>
                        </div>
                        <div className="feature-card glass-card">
                            <div className="feature-icon">🤖</div>
                            <h3>AI Suggestions</h3>
                            <p>Get smart recommendations to fix issues</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .hero {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          padding: var(--spacing-xl) 0;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.15), transparent);
          border-radius: 50%;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 4rem;
          margin-bottom: var(--spacing-md);
          font-weight: 800;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xl);
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .url-form {
          max-width: 700px;
          margin: 0 auto var(--spacing-xl);
        }

        .url-input {
          font-size: 1.1rem;
          padding: var(--spacing-md) var(--spacing-lg);
        }

        .btn-analyze {
          width: 100%;
          padding: var(--spacing-md);
          font-size: 1.1rem;
          margin-top: var(--spacing-sm);
        }

        .spinner-small {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .error-message {
          color: var(--danger);
          font-size: 0.9rem;
          margin-top: var(--spacing-xs);
          text-align: left;
        }

        .features {
          margin-top: var(--spacing-xl);
        }

        .feature-card {
          text-align: center;
          padding: var(--spacing-lg);
          transition: var(--transition-normal);
        }

        .feature-card:hover {
          transform: translateY(-8px);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: var(--spacing-sm);
        }

        .feature-card h3 {
          font-size: 1.25rem;
          margin-bottom: var(--spacing-xs);
        }

        .feature-card p {
          font-size: 0.95rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .features {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </section>
    );
};

export default Hero;
