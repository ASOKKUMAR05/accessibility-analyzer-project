import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { getReport } from './services/api';
import './index.css';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const { user, logout, loading: authLoading } = useAuth();
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
      const response = await getReport(report._id);
      setCurrentReport(response.report);
      setView('dashboard');
    } catch (error) {
      console.error('Failed to load full report', error);
      setCurrentReport(report);
      setView('dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="nav">
        <div className="container flex-between">
          <div className="logo">
            <span className="logo-text">Accessibility Analyzer</span>
          </div>
          {user ? (
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
              <button className="nav-link" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-links">
              <button className="nav-link" onClick={toggleTheme}>
                 {theme === 'light' ? 'Dark' : 'Light'}
              </button>
            </div>
          )}
        </div>
      </nav>

      <main>
        <Routes>
          {user ? (
            <Route path="*" element={
              <>
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
              </>
            } />
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
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
