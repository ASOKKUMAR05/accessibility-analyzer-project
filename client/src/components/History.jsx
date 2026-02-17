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
                        <span className="empty-icon">📊</span>
                        <h3>No Reports Yet</h3>
                        <p>Start analyzing websites to see your reports here</p>
                    </div>
                ) : (
                    <div className="reports-grid">
                        {reports.map((report, index) => (
                            <div
                                key={report._id}
                                className="report-card glass-card fade-in"
                                style={{ animationDelay: `${index * 0.05}s` }}
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
                                        🗑️
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
                                    <span className="date-icon">🕒</span>
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
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .history-header h1 {
          font-size: 3rem;
          margin-bottom: var(--spacing-sm);
        }

        .history-subtitle {
          font-size: 1.2rem;
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
          background: var(--gradient-danger);
          color: white;
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          text-align: center;
          margin-bottom: var(--spacing-lg);
        }

        .empty-state {
          text-align: center;
          padding: var(--spacing-xl);
          max-width: 500px;
          margin: 0 auto;
        }

        .empty-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: var(--spacing-md);
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: var(--spacing-lg);
        }

        .report-card {
          padding: var(--spacing-lg);
          cursor: pointer;
          transition: var(--transition-normal);
        }

        .report-card:hover {
          transform: translateY(-8px);
          border-color: var(--primary);
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }

        .report-score {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 800;
          border: 4px solid;
        }

        .score-excellent {
          color: var(--accent);
          border-color: var(--accent);
          background: rgba(16, 185, 129, 0.1);
        }

        .score-good {
          color: var(--primary);
          border-color: var(--primary);
          background: rgba(102, 126, 234, 0.1);
        }

        .score-fair {
          color: var(--warning);
          border-color: var(--warning);
          background: rgba(245, 158, 11, 0.1);
        }

        .score-poor {
          color: var(--danger);
          border-color: var(--danger);
          background: rgba(239, 68, 68, 0.1);
        }

        .delete-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          opacity: 0.6;
          transition: var(--transition-fast);
          padding: var(--spacing-xs);
        }

        .delete-btn:hover {
          opacity: 1;
          transform: scale(1.2);
        }

        .report-url {
          font-size: 1.1rem;
          margin-bottom: var(--spacing-md);
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .report-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius-sm);
        }

        .stat-item {
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: var(--spacing-xs);
        }

        .stat-value {
          display: block;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-critical {
          color: var(--danger);
        }

        .report-date {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .date-icon {
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .reports-grid {
            grid-template-columns: 1fr;
          }

          .history-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
        </div>
    );
};

export default History;
