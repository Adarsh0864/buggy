import React, { useState } from 'react';
import { ViewColumnsIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import BugCard from './BugCard';
import './BugList.css';

const BugList = ({ bugs, loading, onStatusUpdate, onDelete }) => {
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const statusOptions = ['All Status', 'Open', 'In Progress', 'Resolved'];

  const filteredBugs = selectedStatus === 'All Status' 
    ? bugs 
    : bugs.filter(bug => bug.status === selectedStatus);

  if (loading) {
    return (
      <div className="bug-list-container">
        <div className="bug-list-header">
          <h2 className="bug-list-title">All Bugs</h2>
        </div>
        <div className="loading-container">
          <div className="loading-spinner-large"></div>
          <p className="loading-text">Loading bugs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bug-list-container">
      <div className="bug-list-header">
        <h2 className="bug-list-title">All Bugs</h2>
        <div className="bug-list-controls">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="status-filter"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <div className="view-toggle">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid View"
            >
              <ViewColumnsIcon className="view-icon" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              title="List View"
            >
              <ListBulletIcon className="view-icon" />
              List
            </button>
          </div>
        </div>
      </div>

      {filteredBugs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🐛</div>
          <h3 className="empty-title">
            {selectedStatus === 'All Status' ? 'No bugs found' : `No ${selectedStatus.toLowerCase()} bugs`}
          </h3>
          <p className="empty-description">
            {selectedStatus === 'All Status' 
              ? 'Create your first bug report using the form on the left.'
              : `There are no bugs with status "${selectedStatus}".`
            }
          </p>
        </div>
      ) : (
        <div className={`bugs-container ${viewMode === 'grid' ? 'bugs-grid' : 'bugs-list'}`}>
          {filteredBugs.map(bug => (
            <BugCard
              key={bug.id}
              bug={bug}
              onStatusUpdate={onStatusUpdate}
              onDelete={onDelete}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BugList; 