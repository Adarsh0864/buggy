import React, { useState } from 'react';
import { XMarkIcon, CalendarIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import './BugList.css';

const BugCard = ({ bug, onStatusUpdate, onDelete, viewMode = 'grid' }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSeverityColor = (severity) => {
    const colorMap = {
      'Low': '#10b981',
      'Medium': '#f59e0b', 
      'High': '#ef4444',
      'Critical': '#dc2626'
    };
    return colorMap[severity] || '#10b981';
  };

  const getBugId = (id) => {
    return `BUG-${String(id).padStart(3, '0')}`;
  };

  return (
    <div 
      className={`bug-card ${viewMode} ${isDeleting ? 'deleting' : ''}`}
      style={{
        borderLeftColor: getSeverityColor(bug.severity),
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid'
      }}
    >
      <div className="bug-card-header">
        <div className="bug-id">
          {getBugId(bug.id)}
        </div>
        <div className="bug-date">
          • {formatDate(bug.created_at)}
        </div>
        <div className="bug-actions">
          <button
            className="action-button edit-button"
            title="Edit bug"
          >
            <PencilSquareIcon className="action-icon" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="action-button delete-button"
            title="Delete bug"
          >
            <XMarkIcon className="action-icon" />
          </button>
        </div>
      </div>

      <h3 className="bug-title">
        {bug.title}
      </h3>

      <p className="bug-description">
        {bug.description}
      </p>

      <div className="bug-footer">
        <div className="severity-tag" style={{ backgroundColor: getSeverityColor(bug.severity) }}>
          {bug.severity}
        </div>
        
        <select
          value={bug.status}
          onChange={handleStatusChange}
          disabled={isUpdating || isDeleting}
          className="status-select"
        >
          <option value="Open">open</option>
          <option value="In Progress">in progress</option>
          <option value="Resolved">resolved</option>
        </select>
      </div>

      {isUpdating && (
        <div className="updating-overlay">
          <div className="updating-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default BugCard; 