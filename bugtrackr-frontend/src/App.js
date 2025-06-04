import React, { useState, useEffect } from 'react';
import { ExclamationTriangleIcon, XMarkIcon, BugAntIcon } from '@heroicons/react/24/outline';
import BugForm from './components/BugForm';
import BugList from './components/BugList';
import * as api from './api';
import './App.css';

function App() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBugs();
  }, []);

  const loadBugs = async () => {
    try {
      setLoading(true);
      const bugsData = await api.fetchBugs();
      setBugs(bugsData);
      setError(null);
    } catch (err) {
      setError('Failed to load bugs. Please check if the backend server is running.');
      console.error('Error loading bugs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBugCreated = async (bugData) => {
    try {
      const newBug = await api.createBug(bugData);
      setBugs(prevBugs => [newBug, ...prevBugs]);
      return newBug;
    } catch (err) {
      console.error('Error creating bug:', err);
      throw err;
    }
  };

  const handleBugStatusUpdate = async (bugId, updates) => {
    try {
      const updatedBug = await api.updateBug(bugId, updates);
      setBugs(prevBugs => 
        prevBugs.map(bug => 
          bug.id === bugId ? updatedBug : bug
        )
      );
      return updatedBug;
    } catch (err) {
      console.error('Error updating bug:', err);
      throw err;
    }
  };

  const handleBugDelete = async (bugId) => {
    try {
      await api.deleteBug(bugId);
      setBugs(prevBugs => prevBugs.filter(bug => bug.id !== bugId));
    } catch (err) {
      console.error('Error deleting bug:', err);
      throw err;
    }
  };

  const dismissError = () => {
    setError(null);
  };

  // Calculate stats for footer
  const stats = {
    total: bugs.length,
    open: bugs.filter(bug => bug.status === 'Open').length,
    inProgress: bugs.filter(bug => bug.status === 'In Progress').length,
    resolved: bugs.filter(bug => bug.status === 'Resolved').length
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <BugAntIcon className="header-icon" />
            <div>
              <h1 className="header-title">BugTrackr</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {error && (
          <div className="error-alert">
            <ExclamationTriangleIcon className="error-icon" />
            <p className="error-text">{error}</p>
            <button onClick={dismissError} className="error-dismiss">
              <XMarkIcon style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        )}

        <div className="grid grid-two-cols">
          <div className="card">
            <BugForm onBugCreated={handleBugCreated} />
          </div>
          
          <div className="card">
            <BugList 
              bugs={bugs}
              loading={loading}
              onStatusUpdate={handleBugStatusUpdate}
              onDelete={handleBugDelete}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p>BugTrackr - Keep your projects bug-free</p>
          <div className="footer-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.total}</span>
              <span>Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number stat-open">{stats.open}</span>
              <span>Open</span>
            </div>
            <div className="stat-item">
              <span className="stat-number stat-progress">{stats.inProgress}</span>
              <span>In Progress</span>
            </div>
            <div className="stat-item">
              <span className="stat-number stat-resolved">{stats.resolved}</span>
              <span>Resolved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
