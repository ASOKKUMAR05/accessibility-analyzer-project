import React, { useState, useEffect } from 'react';
import './index.css';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import History from './components/History';

function App() {
  const [view, setView] = useState('home');
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleAnalysisComplete = (report) => {
    setCurrentReport(report);
    setView('dashboard');
  };

  const handleBackToHome = () => {
    setView('home');
    setCurrentReport(null);
  };

  const handleShowHistory = () => {
    setView('history');
  };

  const handleViewReport = async (report) => {
    try {
      setLoading(true);
      // Fetch full report to get the 'issues' array which is omitted from the history list payload
      const { getReport } = await import('./services/api');
      const response = await getReport(report._id);
      setCurrentReport(response.report);
      setView('dashboard');
    } catch (error) {
      console.error('Failed to load full report', error);
      // Fallback to the partial report if fetching the full one fails
      setCurrentReport(report);
      setView('dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <nav className="nav">
        <div className="container flex-between">
          <div className="logo">
            <span className="logo-text">Accessibility Analyzer</span>
          </div>
          <div className="nav-links">
            <button
              className="nav-link"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
            <button
              className={`nav-link ${view === 'home' ? 'active' : ''}`}
              onClick={handleBackToHome}
            >
              Home
            </button>
            <button
              className={`nav-link ${view === 'history' ? 'active' : ''}`}
              onClick={handleShowHistory}
            >
              History
            </button>
          </div>
        </div>
      </nav>

      <main>
        {view === 'home' && (
          <Hero
            onAnalysisComplete={handleAnalysisComplete}
            loading={loading}
            setLoading={setLoading}
          />
        )}

        {view === 'dashboard' && currentReport && (
          <Dashboard
            report={currentReport}
            onBack={handleBackToHome}
            theme={theme}
          />
        )}

        {view === 'history' && (
          <History
            onViewReport={handleViewReport}
          />
        )}
      </main>

      <footer className="footer">
        <div className="container text-center">
          <p className="text-muted">
            © 2026 Accessibility Analyzer · Powered by Lighthouse
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
