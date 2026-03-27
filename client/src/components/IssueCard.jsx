import React, { useState } from 'react';

const severityBorderColors = {
    critical: '#dc2626',
    serious: '#d97706',
    moderate: '#2563eb',
    minor: '#16a34a'
};

const IssueCard = ({ issue, index }) => {
    const [expanded, setExpanded] = useState(false);

    const severityColors = {
        critical: 'severity-critical',
        serious: 'severity-serious',
        moderate: 'severity-moderate',
        minor: 'severity-minor'
    };

    const borderColor = severityBorderColors[issue.severity] || '#e2e8f0';

    return (
        <div
            className={`issue-card glass-card fade-in`}
            style={{ animationDelay: `${index * 0.03}s`, borderLeftColor: borderColor }}
        >
            <div className="issue-header" onClick={() => setExpanded(!expanded)}>
                <div className="issue-title-section">
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
                    {expanded ? '−' : '+'}
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
          border-left: 3px solid var(--border-color);
        }

        .issue-card:hover {
          background: var(--bg-tertiary);
          transform: none;
          box-shadow: none;
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

        .issue-title {
          font-size: 1rem;
          margin-bottom: var(--spacing-xs);
          color: var(--text-primary);
        }

        .wcag-badge {
          display: inline-block;
          padding: 0.2rem 0.4rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
          font-size: 0.7rem;
          margin-left: var(--spacing-xs);
          color: var(--text-muted);
          font-weight: 500;
        }

        .expand-btn {
          background: var(--bg-tertiary);
          border: none;
          color: var(--text-secondary);
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition-fast);
          font-size: 1rem;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .expand-btn:hover {
          background: var(--primary);
          color: #fff;
        }

        .issue-details {
          margin-top: var(--spacing-md);
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--border-color);
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
          font-size: 0.8125rem;
          margin-bottom: var(--spacing-xs);
          font-weight: 500;
        }

        .code-block {
          background: var(--bg-tertiary);
          padding: var(--spacing-sm);
          border-radius: var(--radius-sm);
          overflow-x: auto;
          border-left: 3px solid var(--primary);
        }

        .code-block code {
          color: var(--text-primary);
          font-family: 'Courier New', monospace;
          font-size: 0.8125rem;
        }

        .selector {
          background: var(--bg-tertiary);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-family: 'Courier New', monospace;
          font-size: 0.8125rem;
        }

        .category-tag {
          color: var(--text-muted);
          font-size: 0.8125rem;
        }

        .category-tag strong {
          color: var(--text-primary);
        }
      `}</style>
        </div>
    );
};

export default IssueCard;
