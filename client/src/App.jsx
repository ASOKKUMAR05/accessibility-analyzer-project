import React, { useState } from 'react';
import './index.css';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import History from './components/History';

function App() {
  const [view, setView] = useState('home'); // 'home', 'dashboard', 'history'
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleViewReport = (report) => {
    setCurrentReport(report);
    setView('dashboard');
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="nav">
        <div className="container flex-between">
          <div className="logo">
            <span className="logo-icon">♿</span>
            <span className="logo-text">A11y Analyzer</span>
          </div>
          <div className="nav-links">
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

      {/* Main Content */}
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
          />
        )}

        {view === 'history' && (
          <History
            onViewReport={handleViewReport}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container text-center">
          <p className="text-muted">
            Built with ❤️ for accessibility • Powered by Lighthouse & AI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
