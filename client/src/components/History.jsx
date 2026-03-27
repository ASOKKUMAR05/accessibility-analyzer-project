import React, { useState, useEffect } from 'react';
import { getReports, deleteReport } from '../services/api';

const History = ({ onViewReport }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const result = await getReports(20);
            setReports(result.reports || []);
        } catch (err) {
            setError('Failed to load reports');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();

        if (!confirm('Are you sure you want to delete this report?')) {
            return;
        }

        try {
            await deleteReport(id);
            setReports(reports.filter(r => r._id !== id));
        } catch (err) {
            alert('Failed to delete report');
            console.error(err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getScoreClass = (score) => {
        if (score >= 90) return 'score-excellent';
        if (score >= 75) return 'score-good';
        if (score >= 50) return 'score-fair';
        return 'score-poor';
    };

    if (loading) {
        return (
            <div className="history-loading">
                <div className="spinner"></div>
                <p>Loading reports...</p>
            </div>
        );
    }

    return (
        <div className="history slide-up">
            <div className="container">
                <div className="history-header">
                    <h1>Analysis History</h1>
                    <p className="history-subtitle">
                        View and manage your previous accessibility reports
                    </p>
                </div>

                {error && (
                    <div className="error-banner">
                        {error}
                    </div>
                )}

                {reports.length === 0 ? (
                    <div className="empty-state glass-card">
                        <h3>No Reports Yet</h3>
                        <p>Start analyzing websites to see your reports here</p>
                    </div>
                ) : (
                    <div className="reports-grid">
                        {reports.map((report, index) => (
                            <div
                                key={report._id}
                                className="report-card glass-card fade-in"
                                style={{ animationDelay: `${index * 0.03}s` }}
                                onClick={() => onViewReport(report)}
                            >
                                <div className="report-header">
                                    <div className={`report-score ${getScoreClass(report.score)}`}>
                                        {report.score}
                                    </div>
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => handleDelete(report._id, e)}
                                        title="Delete report"
                                    >
                                        ×
                                    </button>
                                </div>

                                <h3 className="report-url">{report.url}</h3>

                                <div className="report-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">Total Issues</span>
                                        <span className="stat-value">
                                            {Object.values(report.totalIssues || {}).reduce((a, b) => a + b, 0)}
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Critical</span>
                                        <span className="stat-value stat-critical">
                                            {report.totalIssues?.critical || 0}
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Performance</span>
                                        <span className="stat-value">
                                            {report.performanceScore || 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                <div className="report-date">
                                    {formatDate(report.analyzedAt)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
        .history {
          padding: var(--spacing-xl) 0;
          min-height: 100vh;
        }

        .history-header {
          margin-bottom: var(--spacing-xl);
        }

        .history-header h1 {
          font-size: 2.25rem;
          margin-bottom: var(--spacing-xs);
        }

        .history-subtitle {
          font-size: 1rem;
          color: var(--text-muted);
        }

        .history-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: var(--spacing-md);
        }

        .error-banner {
          background: var(--danger);
          color: white;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          text-align: center;
          margin-bottom: var(--spacing-lg);
          font-size: 0.875rem;
        }

        .empty-state {
          text-align: center;
          padding: var(--spacing-xl);
          max-width: 400px;
          margin: 0 auto;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--spacing-lg);
        }

        .report-card {
          padding: var(--spacing-lg);
          cursor: pointer;
        }

        .report-card:hover {
          border-color: var(--primary);
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }

        .report-score {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          border: 3px solid;
        }

        .score-excellent {
          color: var(--accent);
          border-color: var(--accent);
          background: rgba(22, 163, 74, 0.08);
        }

        .score-good {
          color: var(--primary);
          border-color: var(--primary);
          background: rgba(37, 99, 235, 0.08);
        }

        .score-fair {
          color: var(--warning);
          border-color: var(--warning);
          background: rgba(217, 119, 6, 0.08);
        }

        .score-poor {
          color: var(--danger);
          border-color: var(--danger);
          background: rgba(220, 38, 38, 0.08);
        }

        .delete-btn {
          background: none;
          border: 1px solid var(--border-color);
          font-size: 1.25rem;
          cursor: pointer;
          color: var(--text-muted);
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
          line-height: 1;
        }

        .delete-btn:hover {
          border-color: var(--danger);
          color: var(--danger);
          background: rgba(220, 38, 38, 0.06);
        }

        .report-url {
          font-size: 1rem;
          margin-bottom: var(--spacing-md);
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .report-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
          padding: var(--spacing-sm);
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
        }

        .stat-item {
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 0.6875rem;
          color: var(--text-muted);
          margin-bottom: 2px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          font-weight: 500;
        }

        .stat-value {
          display: block;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .stat-critical {
          color: var(--danger);
        }

        .report-date {
          color: var(--text-muted);
          font-size: 0.8125rem;
        }

        @media (max-width: 768px) {
          .reports-grid {
            grid-template-columns: 1fr;
          }

          .history-header h1 {
            font-size: 1.75rem;
          }
        }
      `}</style>
        </div>
    );
};

export default History;
