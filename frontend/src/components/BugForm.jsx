import React, { useState } from 'react';
import './BugForm.css';

const BugForm = ({ onBugCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'Low'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSeverityChange = (severity) => {
    setFormData({
      ...formData,
      severity: severity
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onBugCreated(formData);
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        severity: 'Low'
      });
    } catch (err) {
      setError('Failed to create bug. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const severityOptions = ['Low', 'Medium', 'High'];

  return (
    <div className="bug-form-container">
      <div className="bug-form-header">
        <h2 className="bug-form-title">New Bug Report</h2>
      </div>

      {error && (
        <div className="bug-form-error">
          <p className="bug-form-error-text">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bug-form">
        <div className="form-field">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Short description of the issue"
            className="form-input"
            disabled={isSubmitting}
          />
          <div className="character-count">
            {formData.title.length}/100
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed information about the bug"
            rows={4}
            className="form-textarea"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-field">
          <label className="form-label">
            Severity
          </label>
          <div className="severity-buttons">
            {severityOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleSeverityChange(option)}
                className={`severity-button severity-${option.toLowerCase()} ${
                  formData.severity === option ? 'active' : ''
                }`}
                disabled={isSubmitting}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? (
            <>
              <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            'Submit Bug Report'
          )}
        </button>
      </form>
    </div>
  );
};

export default BugForm; 