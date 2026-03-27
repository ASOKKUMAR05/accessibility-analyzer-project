import React from 'react';

const Suggestions = ({ suggestions }) => {
    if (!suggestions || suggestions.length === 0) {
        return null;
    }

    return (
        <div className="suggestions-section">
            <div className="suggestions-header">
                <h2>AI-Powered Suggestions</h2>
                <p className="suggestions-subtitle">
                    Recommendations to improve your website's accessibility
                </p>
            </div>

            <div className="suggestions-grid grid grid-2">
                {suggestions.map((suggestion, index) => (
                    <div
                        key={index}
                        className="suggestion-card glass-card fade-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <div className="suggestion-number">{index + 1}</div>
                        <p className="suggestion-text">{suggestion}</p>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .suggestions-section {
          margin: var(--spacing-xl) 0;
        }

        .suggestions-header {
          margin-bottom: var(--spacing-lg);
        }

        .suggestions-header h2 {
          font-size: 1.75rem;
          margin-bottom: var(--spacing-xs);
        }

        .suggestions-subtitle {
          color: var(--text-muted);
          font-size: 1rem;
        }

        .suggestions-grid {
          gap: var(--spacing-md);
        }

        .suggestion-card {
          padding: var(--spacing-lg);
          padding-left: calc(var(--spacing-lg) + 36px);
          position: relative;
        }

        .suggestion-number {
          position: absolute;
          top: var(--spacing-lg);
          left: var(--spacing-md);
          width: 28px;
          height: 28px;
          background: var(--primary);
          color: #fff;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.8125rem;
        }

        .suggestion-text {
          color: var(--text-secondary);
          line-height: 1.7;
          font-size: 0.9375rem;
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .suggestions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default Suggestions;
