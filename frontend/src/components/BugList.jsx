// Performance Optimization Phase: Added React.memo, useMemo, useCallback for optimal rendering
// This component showcases our evolution from basic React patterns to performance-optimized code

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ViewColumnsIcon, ListBulletIcon, FunnelIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { 
  ExclamationTriangleIcon, 
  FireIcon, 
  ShieldExclamationIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/solid';
import BugCard from './BugCard';
import './BugList.css';

const BugList = ({ bugs, loading, onStatusUpdate, onDelete }) => {
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedSeverity, setSelectedSeverity] = useState('All Severity');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'severity'

  const statusOptions = ['All Status', 'Open', 'Progress', 'Resolved'];
  const severityOptions = ['All Severity', 'Low', 'Medium', 'High', 'Critical'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'severity', label: 'By Severity' },
    { value: 'title', label: 'By Title' }
  ];

  // Memoize filter counts calculation to prevent recalculation on every render
  const counts = useMemo(() => {
    return {
      total: bugs.length,
      open: bugs.filter(bug => bug.status === 'Open').length,
      inProgress: bugs.filter(bug => bug.status === 'In Progress').length,
      resolved: bugs.filter(bug => bug.status === 'Resolved').length,
      low: bugs.filter(bug => bug.severity === 'Low').length,
      medium: bugs.filter(bug => bug.severity === 'Medium').length,
      high: bugs.filter(bug => bug.severity === 'High').length,
      critical: bugs.filter(bug => bug.severity === 'Critical').length,
    };
  }, [bugs]);

  const filteredAndSortedBugs = useMemo(() => {
    let filtered = bugs;

    // Filter by status
    if (selectedStatus !== 'All Status') {
      filtered = filtered.filter(bug => bug.status === selectedStatus);
    }

    // Filter by severity
    if (selectedSeverity !== 'All Severity') {
      filtered = filtered.filter(bug => bug.severity === selectedSeverity);
    }

    // Sort bugs
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'severity':
          const severityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    return sorted;
  }, [bugs, selectedStatus, selectedSeverity, sortBy]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleStatusChange = useCallback((e) => {
    setSelectedStatus(e.target.value);
  }, []);

  const handleSeverityChange = useCallback((e) => {
    setSelectedSeverity(e.target.value);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedStatus('All Status');
    setSelectedSeverity('All Severity');
  }, []);

  const getSeverityIcon = useCallback((severity) => {
    switch (severity) {
      case 'Critical': return FireIcon;
      case 'High': return ExclamationTriangleIcon;
      case 'Medium': return ShieldExclamationIcon;
      case 'Low': return InformationCircleIcon;
      default: return InformationCircleIcon;
    }
  }, []);

  if (loading) {
    return (
      <div className="bug-list-container">
        <div className="bug-list-header">
          <div className="bug-list-title-section">
            <h2 className="bug-list-title">All Bugs</h2>
            <p className="bug-list-subtitle">Manage and track reported issues</p>
          </div>
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
        <div className="bug-list-title-section">
          <h2 className="bug-list-title">All Bugs</h2>
          <p className="bug-list-subtitle">
            {filteredAndSortedBugs.length} of {bugs.length} bugs
            {(selectedStatus !== 'All Status' || selectedSeverity !== 'All Severity') && ' (filtered)'}
          </p>
        </div>
        
        <div className="bug-list-controls">
          <div className="filters-section">
            <div className="filter-group">
              <label htmlFor="status-filter" className="filter-label">
                Status
              </label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={handleStatusChange}
                className="status-filter"
                aria-describedby="status-filter-help"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status} {status !== 'All Status' && `(${
                      status === 'Open' ? counts.open :
                      status === 'Progress' ? counts.inProgress :
                      status === 'Resolved' ? counts.resolved : 0
                    })`}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="severity-filter" className="filter-label">
                Severity
              </label>
              <select
                id="severity-filter"
                value={selectedSeverity}
                onChange={handleSeverityChange}
                className="severity-filter"
                aria-describedby="severity-filter-help"
              >
                {severityOptions.map(severity => (
                  <option key={severity} value={severity}>
                    {severity} {severity !== 'All Severity' && `(${
                      severity === 'Low' ? counts.low :
                      severity === 'Medium' ? counts.medium :
                      severity === 'High' ? counts.high :
                      severity === 'Critical' ? counts.critical : 0
                    })`}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="sort-filter" className="filter-label">
                Sort
              </label>
              <select
                id="sort-filter"
                value={sortBy}
                onChange={handleSortChange}
                className="sort-filter"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="view-controls">
            <div className="view-toggle" role="tablist" aria-label="View mode">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                role="tab"
                aria-selected={viewMode === 'grid'}
                aria-controls="bugs-container"
                title="Grid View"
              >
                <ViewColumnsIcon className="view-icon" aria-hidden="true" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                role="tab"
                aria-selected={viewMode === 'list'}
                aria-controls="bugs-container"
                title="List View"
              >
                <ListBulletIcon className="view-icon" aria-hidden="true" />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bug-stats">
        <div className="stat-card stat-open">
          <span className="stat-number">{counts.open}</span>
          <span className="stat-label">Open</span>
        </div>
        <div className="stat-card stat-progress">
          <span className="stat-number">{counts.inProgress}</span>
          <span className="stat-label">Progress</span>
        </div>
        <div className="stat-card stat-resolved">
          <span className="stat-number">{counts.resolved}</span>
          <span className="stat-label">Resolved</span>
        </div>
        <div className="stat-card stat-total">
          <span className="stat-number">{counts.total}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>

      {filteredAndSortedBugs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🐛</div>
          <h3 className="empty-title">
            {bugs.length === 0 ? 'No bugs found' : 'No bugs match your filters'}
          </h3>
          <p className="empty-description">
            {bugs.length === 0 
              ? 'Create your first bug report using the form on the left.'
              : 'Try adjusting your filters or create a new bug report.'
            }
          </p>
          {(selectedStatus !== 'All Status' || selectedSeverity !== 'All Severity') && (
            <button 
              onClick={handleClearFilters}
              className="clear-filters-button"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div 
          id="bugs-container"
          className={`bugs-container ${viewMode === 'grid' ? 'bugs-grid' : 'bugs-list'}`}
          role="tabpanel"
          aria-label={`${viewMode} view of bugs`}
        >
          {filteredAndSortedBugs.map(bug => (
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