import React, { useState } from 'react';

const IssueCard = ({ issue, index }) => {
    const [expanded, setExpanded] = useState(false);

    const severityColors = {
        critical: 'severity-critical',
        serious: 'severity-serious',
        moderate: 'severity-moderate',
        minor: 'severity-minor'
    };

    const severityIcons = {
        critical: '🚨',
        serious: '⚠️',
        moderate: 'ℹ️',
        minor: '💡'
    };

    return (
        <div className={`issue-card glass-card fade-in`} style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="issue-header" onClick={() => setExpanded(!expanded)}>
                <div className="issue-title-section">
                    <span className="issue-icon">{severityIcons[issue.severity]}</span>
                    <div>
                        <h4 className="issue-title">{issue.title}</h4>
                        <span className={`severity-badge ${severityColors[issue.severity]}`}>
                            {issue.severity}
                        </span>
                        {issue.wcagLevel && (
                            <span className="wcag-badge">WCAG {issue.wcagLevel}</span>
                        )}
                    </div>
                </div>
                <button className="expand-btn">
                    {expanded ? '↑' : '↓'}
                </button>
            </div>

            {expanded && (
                <div className="issue-details">
                    <p className="issue-description">{issue.description}</p>

                    {issue.element && (
                        <div className="code-section">
                            <label>Affected Element:</label>
                            <pre className="code-block">
                                <code>{issue.element}</code>
                            </pre>
                        </div>
                    )}

                    {issue.selector && (
                        <div className="selector-section">
                            <label>CSS Selector:</label>
                            <code className="selector">{issue.selector}</code>
                        </div>
                    )}

                    {issue.category && (
                        <div className="category-tag">
                            Category: <strong>{issue.category}</strong>
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
        .issue-card {
          padding: var(--spacing-md);
          cursor: pointer;
          transition: var(--transition-normal);
        }

        .issue-card:hover {
          transform: translateX(8px);
        }

        .issue-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--spacing-md);
        }

        .issue-title-section {
          display: flex;
          gap: var(--spacing-md);
          align-items: flex-start;
          flex: 1;
        }

        .issue-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .issue-title {
          font-size: 1.1rem;
          margin-bottom: var(--spacing-xs);
          color: var(--text-primary);
        }

        .wcag-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          margin-left: var(--spacing-xs);
          color: var(--text-secondary);
        }

        .expand-btn {
          background: var(--bg-secondary);
          border: none;
          color: var(--text-primary);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          transition: var(--transition-fast);
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .expand-btn:hover {
          background: var(--primary);
          transform: scale(1.1);
        }

        .issue-details {
          margin-top: var(--spacing-md);
          padding-top: var(--spacing-md);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .issue-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--spacing-md);
        }

        .code-section,
        .selector-section {
          margin-bottom: var(--spacing-md);
        }

        .code-section label,
        .selector-section label {
          display: block;
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: var(--spacing-xs);
        }

        .code-block {
          background: var(--bg-primary);
          padding: var(--spacing-md);
          border-radius: var(--radius-sm);
          overflow-x: auto;
          border-left: 3px solid var(--primary);
        }

        .code-block code {
          color: var(--accent-light);
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
        }

        .selector {
          background: var(--bg-primary);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          color: var(--primary-light);
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
        }

        .category-tag {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .category-tag strong {
          color: var(--text-primary);
        }
      `}</style>
        </div>
    );
};

export default IssueCard;
