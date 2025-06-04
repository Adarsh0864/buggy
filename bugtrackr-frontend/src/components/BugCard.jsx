import React, { useState } from 'react';
import { 
  XMarkIcon, 
  CalendarIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  ExclamationTriangleIcon, 
  FireIcon, 
  ShieldExclamationIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/solid';
import './BugList.css';

const BugCard = React.memo(({ bug, onStatusUpdate, onDelete, viewMode = 'grid' }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (e) => {
    let newStatus = e.target.value;
    // Map display value to backend value
    if (newStatus === 'Progress') {
      newStatus = 'In Progress';
    }
    if (newStatus === bug.status) return;

    setIsUpdating(true);
    try {
      await onStatusUpdate(bug.id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bug report?')) {
      setIsDeleting(true);
      try {
        await onDelete(bug.id);
      } catch (error) {
        console.error('Failed to delete bug:', error);
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getBugId = (id) => {
    return `BUG-${String(id).padStart(3, '0')}`;
  };

  const getSeverityClass = (severity) => {
    return `severity-${severity.toLowerCase()}`;
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Critical': return FireIcon;
      case 'High': return ExclamationTriangleIcon;
      case 'Medium': return ShieldExclamationIcon;
      case 'Low': return InformationCircleIcon;
      default: return InformationCircleIcon;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return ExclamationCircleIcon;
      case 'In Progress': return ClockIcon;
      case 'Progress': return ClockIcon;
      case 'Resolved': return CheckCircleIcon;
      default: return ExclamationCircleIcon;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Open': return 'Open';
      case 'In Progress': return 'Progress';
      case 'Progress': return 'Progress';
      case 'Resolved': return 'Resolved';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'status-open';
      case 'In Progress': return 'status-progress';
      case 'Progress': return 'status-progress';
      case 'Resolved': return 'status-resolved';
      default: return 'status-open';
    }
  };

  const SeverityIcon = getSeverityIcon(bug.severity);
  const StatusIcon = getStatusIcon(bug.status);

  return (
    <div 
      className={`bug-card ${viewMode} ${getSeverityClass(bug.severity)} ${isDeleting ? 'deleting' : ''}`}
      role="article"
      aria-label={`Bug report: ${bug.title}`}
    >
      <div className="bug-card-header">
        <div className="bug-card-info">
          <div className="bug-id" aria-label={`Bug ID: ${getBugId(bug.id)}`}>
            {getBugId(bug.id)}
          </div>
          <div className="bug-date" aria-label={`Created: ${formatDate(bug.created_at)}`}>
            <CalendarIcon className="date-icon" aria-hidden="true" />
            {formatDate(bug.created_at)}
          </div>
        </div>
        <div className="bug-actions" role="toolbar" aria-label="Bug actions">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="action-button delete-button"
            title="Delete bug report"
            aria-label={`Delete bug ${getBugId(bug.id)}`}
          >
            <XMarkIcon className="action-icon" aria-hidden="true" />
          </button>
        </div>
      </div>

      <h3 className="bug-title">
        {bug.title}
      </h3>

      <p className="bug-description" title={bug.description}>
        {bug.description}
      </p>

      <div className="bug-footer">
        <div className="bug-meta">
          <div className={`severity-tag ${getSeverityClass(bug.severity)}`}>
            <SeverityIcon className="severity-icon" aria-hidden="true" />
            <span className="severity-text">{bug.severity}</span>
          </div>
          
          <div className={`status-indicator ${getStatusColor(bug.status)}`}>
            <StatusIcon className="status-icon" aria-hidden="true" />
            <span className="status-text">{getStatusLabel(bug.status)}</span>
          </div>
        </div>
        
        <div className="bug-controls">
          <label htmlFor={`status-select-${bug.id}`} className="sr-only">
            Change status for {getBugId(bug.id)}
          </label>
          <select
            id={`status-select-${bug.id}`}
            value={bug.status === 'In Progress' ? 'Progress' : bug.status}
            onChange={handleStatusChange}
            disabled={isUpdating || isDeleting}
            className="status-select"
            aria-describedby={`status-help-${bug.id}`}
          >
            <option value="Open">🔴 Open</option>
            <option value="Progress">🟡 Progress</option>
            <option value="Resolved">🟢 Resolved</option>
          </select>
          <div id={`status-help-${bug.id}`} className="sr-only">
            Current status: {getStatusLabel(bug.status)}
          </div>
        </div>
      </div>

      {isUpdating && (
        <div className="updating-overlay" role="status" aria-label="Updating bug status">
          <div className="updating-spinner" aria-hidden="true"></div>
          <span className="sr-only">Updating...</span>
        </div>
      )}
    </div>
  );
});

export default BugCard; 