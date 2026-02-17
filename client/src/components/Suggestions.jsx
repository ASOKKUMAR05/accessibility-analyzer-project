import React from 'react';

const Suggestions = ({ suggestions }) => {
    if (!suggestions || suggestions.length === 0) {
        return null;
    }

    return (
        <div className="suggestions-section">
            <div className="suggestions-header">
                <h2>
                    <span className="ai-icon">🤖</span>
                    AI-Powered Suggestions
                </h2>
                <p className="suggestions-subtitle">
                    Smart recommendations to improve your website's accessibility
                </p>
            </div>

            <div className="suggestions-grid grid grid-2">
                {suggestions.map((suggestion, index) => (
                    <div
                        key={index}
                        className="suggestion-card glass-card fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
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
          text-align: center;
          margin-bottom: var(--spacing-lg);
        }

        .suggestions-header h2 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          font-size: 2rem;
          margin-bottom: var(--spacing-xs);
        }

        .ai-icon {
          font-size: 2.5rem;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .suggestions-subtitle {
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .suggestions-grid {
          gap: var(--spacing-md);
        }

        .suggestion-card {
          padding: var(--spacing-lg);
          position: relative;
          transition: var(--transition-normal);
        }

        .suggestion-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
        }

        .suggestion-number {
          position: absolute;
          top: -12px;
          left: var(--spacing-md);
          width: 36px;
          height: 36px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          box-shadow: var(--shadow-md);
        }

        .suggestion-text {
          margin-top: var(--spacing-sm);
          color: var(--text-secondary);
          line-height: 1.7;
          font-size: 1rem;
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
