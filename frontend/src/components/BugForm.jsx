import React, { useState } from 'react';
import { PlusIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { 
  ExclamationTriangleIcon, 
  FireIcon, 
  ShieldExclamationIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/solid';
import './BugForm.css';

const BugForm = ({ onBugCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'Low'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleBlur = (field) => {
    setTouched({
      ...touched,
      [field]: true
    });
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
    
    // Mark all fields as touched
    setTouched({
      title: true,
      description: true
    });

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
      setTouched({});
    } catch (err) {
      setError('Failed to create bug. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const severityOptions = [
    { 
      name: 'Low', 
      color: 'green',
      icon: InformationCircleIcon,
      description: 'Minor issue or cosmetic problem'
    },
    { 
      name: 'Medium', 
      color: 'yellow',
      icon: ExclamationCircleIcon,
      description: 'Moderate impact on functionality'
    },
    { 
      name: 'High', 
      color: 'orange',
      icon: ExclamationTriangleIcon,
      description: 'Significant impact or data loss'
    },
    { 
      name: 'Critical', 
      color: 'red',
      icon: FireIcon,
      description: 'System crash or security vulnerability'
    }
  ];

  const isFieldValid = (field) => {
    return formData[field].trim().length > 0;
  };

  const showFieldError = (field) => {
    return touched[field] && !isFieldValid(field);
  };

  return (
    <div className="bug-form-container">
      <div className="bug-form-header">
        <div className="bug-form-header-content">
          <div className="bug-form-icon-wrapper">
            <PlusIcon className="bug-form-icon" />
          </div>
          <div className="bug-form-header-text">
            <h2 className="bug-form-title">New Bug Report</h2>
            <p className="bug-form-subtitle">Report a new issue or bug to help improve the system</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bug-form-error" role="alert">
          <ExclamationTriangleIcon className="bug-form-error-icon" />
          <p className="bug-form-error-text">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bug-form" noValidate>
        <div className="form-field">
          <label htmlFor="title" className="form-label">
            Bug Title <span className="required-indicator" aria-label="required">*</span>
          </label>
          <div className="form-input-wrapper">
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={() => handleBlur('title')}
              placeholder="Brief description of the issue"
              className={`form-input ${showFieldError('title') ? 'error' : ''} ${isFieldValid('title') ? 'valid' : ''}`}
              disabled={isSubmitting}
              maxLength={100}
              aria-required="true"
              aria-describedby="title-help title-count"
            />
            {isFieldValid('title') && (
              <CheckCircleIcon className="field-icon field-icon-success" />
            )}
            {showFieldError('title') && (
              <ExclamationCircleIcon className="field-icon field-icon-error" />
            )}
          </div>
          {showFieldError('title') && (
            <p className="field-error" role="alert">Title is required</p>
          )}
          <div className="field-help">
            <span id="title-help" className="field-description">
              Provide a clear, concise summary of the issue
            </span>
            <span id="title-count" className="character-count">
              {formData.title.length}/100
            </span>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="description" className="form-label">
            Description <span className="required-indicator" aria-label="required">*</span>
          </label>
          <div className="form-input-wrapper">
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={() => handleBlur('description')}
              placeholder="Detailed steps to reproduce, expected behavior, actual behavior..."
              className={`form-textarea ${showFieldError('description') ? 'error' : ''} ${isFieldValid('description') ? 'valid' : ''}`}
              disabled={isSubmitting}
              maxLength={500}
              rows={4}
              aria-required="true"
              aria-describedby="description-help description-count"
            />
            {isFieldValid('description') && (
              <CheckCircleIcon className="field-icon field-icon-success textarea-icon" />
            )}
            {showFieldError('description') && (
              <ExclamationCircleIcon className="field-icon field-icon-error textarea-icon" />
            )}
          </div>
          {showFieldError('description') && (
            <p className="field-error" role="alert">Description is required</p>
          )}
          <div className="field-help">
            <span id="description-help" className="field-description">
              Include steps to reproduce, expected vs actual behavior
            </span>
            <span id="description-count" className="character-count">
              {formData.description.length}/500
            </span>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">
            Severity Level
          </label>
          <p className="field-description severity-description">
            Select the impact level of this bug
          </p>
          <div className="severity-buttons" role="radiogroup" aria-labelledby="severity-label">
            {severityOptions.map(option => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => handleSeverityChange(option.name)}
                  className={`severity-button severity-${option.name.toLowerCase()} ${
                    formData.severity === option.name ? 'active' : ''
                  }`}
                  disabled={isSubmitting}
                  role="radio"
                  aria-checked={formData.severity === option.name}
                  aria-describedby={`severity-${option.name.toLowerCase()}-desc`}
                  title={option.description}
                >
                  <IconComponent className="severity-icon" />
                  <span className="severity-text">
                    <span className="severity-name">{option.name}</span>
                    <span className="severity-description-text" id={`severity-${option.name.toLowerCase()}-desc`}>
                      {option.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
          className="submit-button"
          aria-describedby="submit-help"
        >
          {isSubmitting ? (
            <>
              <div className="loading-spinner" aria-hidden="true"></div>
              <span>Creating Bug Report...</span>
            </>
          ) : (
            <>
              <PlusIcon className="submit-icon" aria-hidden="true" />
              <span>Create Bug Report</span>
            </>
          )}
        </button>
        
        <p id="submit-help" className="submit-help">
          Review your information and click to submit the bug report
        </p>
      </form>
    </div>
  );
};

export default BugForm; 