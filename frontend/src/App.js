import React, { useState, useEffect } from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import BugForm from './components/BugForm';
import BugList from './components/BugList';
import Sidebar from './components/Sidebar';
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

  return (
    <div className="app">
      <Sidebar />
      
      <div className="main-content">
        {error && (
          <div className="error-alert">
            <ExclamationTriangleIcon className="error-icon" />
            <p className="error-text">{error}</p>
            <button onClick={dismissError} className="error-dismiss">
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="form-section">
            <BugForm onBugCreated={handleBugCreated} />
          </div>
          
          <div className="list-section">
            <BugList 
              bugs={bugs}
              loading={loading}
              onStatusUpdate={handleBugStatusUpdate}
              onDelete={handleBugDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
