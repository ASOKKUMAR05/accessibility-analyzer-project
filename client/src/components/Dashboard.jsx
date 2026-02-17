import React from 'react';
import IssueCard from './IssueCard';
import Suggestions from './Suggestions';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = ({ report, onBack }) => {
    const { score, performanceScore, bestPracticesScore, seoScore, issues, totalIssues, categories, suggestions, url } = report;

    // Severity chart data
    const severityData = {
        labels: ['Critical', 'Serious', 'Moderate', 'Minor'],
        datasets: [{
            data: [
                totalIssues.critical || 0,
                totalIssues.serious || 0,
                totalIssues.moderate || 0,
                totalIssues.minor || 0
            ],
            backgroundColor: [
                'rgba(239, 68, 68, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)'
            ],
            borderColor: [
                'rgba(239, 68, 68, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(16, 185, 129, 1)'
            ],
            borderWidth: 2
        }]
    };

    // Category chart data
    const categoryData = {
        labels: ['Color Contrast', 'ARIA', 'Keyboard', 'Semantic HTML', 'Forms', 'Images'],
        datasets: [{
            label: 'Issues by Category',
            data: [
                categories.colorContrast || 0,
                categories.ariaAttributes || 0,
                categories.keyboardNavigation || 0,
                categories.semanticHTML || 0,
                categories.formLabels || 0,
                categories.images || 0
            ],
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
            borderColor: 'rgba(102, 126, 234, 1)',
            borderWidth: 2
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#f8fafc',
                    font: { size: 12 }
                }
            }
        },
        scales: {
            y: {
                ticks: { color: '#cbd5e1' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
                ticks: { color: '#cbd5e1' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        }
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'var(--accent)';
        if (score >= 75) return 'var(--primary)';
        if (score >= 50) return 'var(--warning)';
        return 'var(--danger)';
    };

    const totalIssueCount = Object.values(totalIssues).reduce((a, b) => a + b, 0);

    return (
        <div className="dashboard slide-up">
            <div className="container">
                {/* Header */}
                <div className="dashboard-header">
                    <button className="btn-back" onClick={onBack}>
                        ← Back to Home
                    </button>
                    <div className="url-display">
                        <h2>Analysis Report</h2>
                        <p className="analyzed-url">{url}</p>
                    </div>
                </div>

                {/* Score Overview */}
                <div className="score-overview glass-card">
                    <div className="score-main">
                        <div className="score-circle" style={{ '--score': score }}>
                            <span style={{ color: getScoreColor(score) }}>{score}</span>
                        </div>
                        <div className="score-info">
                            <h3>Accessibility Score</h3>
                            <p className="score-description">
                                {score >= 90 && 'Excellent! Your site is highly accessible.'}
                                {score >= 75 && score < 90 && 'Good, but there\'s room for improvement.'}
                                {score >= 50 && score < 75 && 'Needs work. Address critical issues first.'}
                                {score < 50 && 'Critical issues found. Immediate action required.'}
                            </p>
                        </div>
                    </div>

                    <div className="other-scores">
                        <div className="score-item">
                            <div className="score-label">Performance</div>
                            <div className="score-value" style={{ color: getScoreColor(performanceScore) }}>
                                {performanceScore}
                            </div>
                        </div>
                        <div className="score-item">
                            <div className="score-label">Best Practices</div>
                            <div className="score-value" style={{ color: getScoreColor(bestPracticesScore) }}>
                                {bestPracticesScore}
                            </div>
                        </div>
                        <div className="score-item">
                            <div className="score-label">SEO</div>
                            <div className="score-value" style={{ color: getScoreColor(seoScore) }}>
                                {seoScore}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="charts-grid grid grid-2">
                    <div className="chart-card glass-card">
                        <h3>Issues by Severity</h3>
                        <div className="chart-container">
                            <Doughnut data={severityData} options={{ ...chartOptions, scales: undefined }} />
                        </div>
                        <div className="total-issues">
                            Total Issues: <strong>{totalIssueCount}</strong>
                        </div>
                    </div>

                    <div className="chart-card glass-card">
                        <h3>Issues by Category</h3>
                        <div className="chart-container">
                            <Bar data={categoryData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* AI Suggestions */}
                <Suggestions suggestions={suggestions} />

                {/* Issues List */}
                <div className="issues-section">
                    <h2>Detailed Issues ({totalIssueCount})</h2>
                    <div className="issues-grid">
                        {issues && issues.length > 0 ? (
                            issues.map((issue, index) => (
                                <IssueCard key={index} issue={issue} index={index} />
                            ))
                        ) : (
                            <div className="no-issues glass-card">
                                <span className="success-icon">✅</span>
                                <h3>No Issues Found!</h3>
                                <p>This website has excellent accessibility!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .dashboard {
          padding: var(--spacing-xl) 0;
          min-height: 100vh;
        }

        .dashboard-header {
          margin-bottom: var(--spacing-xl);
        }

        .btn-back {
          background: var(--bg-secondary);
          color: var(--text-primary);
          padding: var(--spacing-sm) var(--spacing-lg);
          border: none;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: var(--transition-fast);
          margin-bottom: var(--spacing-md);
          font-weight: 600;
        }

        .btn-back:hover {
          background: var(--bg-tertiary);
          transform: translateX(-4px);
        }

        .url-display h2 {
          font-size: 2rem;
          margin-bottom: var(--spacing-xs);
        }

        .analyzed-url {
          color: var(--primary);
          font-size: 1.1rem;
          word-break: break-all;
        }

        .score-overview {
          padding: var(--spacing-xl);
          margin-bottom: var(--spacing-lg);
        }

        .score-main {
          display: flex;
          align-items: center;
          gap: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
          flex-wrap: wrap;
        }

        .score-info h3 {
          font-size: 1.5rem;
          margin-bottom: var(--spacing-xs);
        }

        .score-description {
          font-size: 1.1rem;
        }

        .other-scores {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--spacing-lg);
          padding-top: var(--spacing-lg);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .score-item {
          text-align: center;
        }

        .score-label {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: var(--spacing-xs);
        }

        .score-value {
          font-size: 2rem;
          font-weight: 700;
        }

        .charts-grid {
          margin-bottom: var(--spacing-xl);
        }

        .chart-card h3 {
          margin-bottom: var(--spacing-md);
          font-size: 1.25rem;
        }

        .chart-container {
          height: 300px;
          position: relative;
        }

        .total-issues {
          text-align: center;
          margin-top: var(--spacing-md);
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        .issues-section {
          margin-top: var(--spacing-xl);
        }

        .issues-section h2 {
          margin-bottom: var(--spacing-lg);
          font-size: 2rem;
        }

        .issues-grid {
          display: grid;
          gap: var(--spacing-md);
        }

        .no-issues {
          text-align: center;
          padding: var(--spacing-xl);
        }

        .success-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: var(--spacing-md);
        }

        @media (max-width: 768px) {
          .score-main {
            flex-direction: column;
            text-align: center;
          }

          .chart-container {
            height: 250px;
          }
        }
      `}</style>
        </div>
    );
};

export default Dashboard;
