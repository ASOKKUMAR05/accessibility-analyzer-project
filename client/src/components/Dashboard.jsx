import React from 'react';
import IssueCard from './IssueCard';
import Suggestions from './Suggestions';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, ChartDataLabels);

const Dashboard = ({ report, onBack }) => {
  const { score, performanceScore, bestPracticesScore, seoScore, issues, totalIssues, categories, suggestions, url } = report;

  // Severity chart data
  const severityValues = [
    totalIssues.critical || 0,
    totalIssues.serious || 0,
    totalIssues.moderate || 0,
    totalIssues.minor || 0
  ];
  const severityTotal = severityValues.reduce((a, b) => a + b, 0);

  const severityData = {
    labels: ['Critical', 'Serious', 'Moderate', 'Minor'],
    datasets: [{
      data: severityValues,
      backgroundColor: [
        'rgba(239, 68, 68, 0.9)',
        'rgba(245, 158, 11, 0.9)',
        'rgba(59, 130, 246, 0.9)',
        'rgba(16, 185, 129, 0.9)'
      ],
      borderColor: [
        '#ef4444',
        '#f59e0b',
        '#3b82f6',
        '#10b981'
      ],
      borderWidth: 3,
      hoverOffset: 12,
      hoverBorderWidth: 4
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2,
    cutout: '52%',
    layout: { padding: { top: 10, bottom: 10 } },
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          color: '#f1f5f9',
          font: { size: 13, weight: '600', family: 'Inter, sans-serif' },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          pointStyleWidth: 12,
          generateLabels: (chart) => {
            const data = chart.data;
            return data.labels.map((label, i) => {
              const value = data.datasets[0].data[i];
              const pct = severityTotal > 0 ? Math.round((value / severityTotal) * 100) : 0;
              return {
                text: `${label}  ${value} (${pct}%)`,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].borderColor[i],
                pointStyle: 'circle',
                hidden: false,
                index: i
              };
            });
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        padding: 14,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed;
            const pct = severityTotal > 0 ? ((val / severityTotal) * 100).toFixed(1) : 0;
            return `  ${val} issue${val !== 1 ? 's' : ''} (${pct}%)`;
          }
        }
      },
      datalabels: {
        display: (ctx) => ctx.dataset.data[ctx.dataIndex] > 0,
        color: '#ffffff',
        font: { size: 16, weight: 'bold', family: 'Inter, sans-serif' },
        textShadowBlur: 8,
        textShadowColor: 'rgba(0,0,0,0.8)',
        formatter: (value) => {
          if (value === 0) return null;
          const pct = severityTotal > 0 ? Math.round((value / severityTotal) * 100) : 0;
          return `${value}\n(${pct}%)`;
        }
      }
    }
  };

  // Category chart data — each bar gets its own distinct color
  const categoryColors = [
    { bg: 'rgba(168, 85, 247, 0.85)', border: '#a855f7' },
    { bg: 'rgba(59, 130, 246, 0.85)', border: '#3b82f6' },
    { bg: 'rgba(34, 197, 94, 0.85)', border: '#22c55e' },
    { bg: 'rgba(245, 158, 11, 0.85)', border: '#f59e0b' },
    { bg: 'rgba(239, 68, 68, 0.85)', border: '#ef4444' },
    { bg: 'rgba(20, 184, 166, 0.85)', border: '#14b8a6' }
  ];

  const categoryValues = [
    categories.colorContrast || 0,
    categories.ariaAttributes || 0,
    categories.keyboardNavigation || 0,
    categories.semanticHTML || 0,
    categories.formLabels || 0,
    categories.images || 0
  ];

  const categoryData = {
    labels: ['Contrast', 'ARIA', 'Keyboard', 'Semantic', 'Forms', 'Images'],
    datasets: [{
      label: 'Issue Count',
      data: categoryValues,
      backgroundColor: categoryColors.map(c => c.bg),
      borderColor: categoryColors.map(c => c.border),
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
      hoverBorderWidth: 3,
      hoverBorderColor: '#ffffff'
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2,
    layout: { padding: { top: 28, right: 10 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        padding: 14,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          title: (items) => {
            const rawLabels = ['Color Contrast', 'ARIA', 'Keyboard', 'Semantic HTML', 'Forms', 'Images'];
            return rawLabels[items[0].dataIndex];
          },
          label: (ctx) => {
            const v = ctx.parsed.y;
            return `  ${v} issue${v !== 1 ? 's' : ''}`;
          }
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        offset: 2,
        color: '#f1f5f9',
        font: { size: 15, weight: 'bold', family: 'Inter, sans-serif' },
        formatter: (value) => value > 0 ? value : ''
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#94a3b8',
          font: { size: 13, family: 'Inter, sans-serif' },
          stepSize: 1,
          precision: 0
        },
        grid: { color: 'rgba(255, 255, 255, 0.08)' },
        border: { color: 'rgba(255,255,255,0.15)' }
      },
      x: {
        ticks: {
          color: '#e2e8f0',
          font: { size: 13, weight: '700', family: 'Inter, sans-serif' },
          maxRotation: 45,
          minRotation: 0,
          autoSkip: false
        },
        grid: { display: false },
        border: { color: 'rgba(255,255,255,0.15)' }
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
              <Doughnut data={severityData} options={doughnutOptions} />
            </div>
            <div className="total-issues">
              Total Issues: <strong>{totalIssueCount}</strong>
            </div>
          </div>

          <div className="chart-card glass-card">
            <h3>Issues by Category</h3>
            <div className="chart-container">
              <Bar data={categoryData} options={barOptions} />
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
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: 0.01em;
        }

        .chart-card {
          overflow: visible;
        }

        .chart-container {
          height: 380px;
          position: relative;
          padding-top: 4px;
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
