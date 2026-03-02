import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AddApplicationModal = ({ onClose, onSuccess }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    applied_date: '',
    follow_up_date: '',
    job_url: '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(
        'http://localhost:3000/api/applications',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Add New Application</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="alert alert-error">
              <span>⚠</span><span>{error}</span>
            </div>
          )}

          <form id="add-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Company *</label>
                <input
                  className="form-input"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Google"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role *</label>
                <input
                  className="form-input"
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Software Engineer"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option>Applied</option>
                  <option>Interviewing</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Applied Date *</label>
                <input
                  className="form-input"
                  type="date"
                  name="applied_date"
                  value={formData.applied_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Follow Up Date</label>
                <input
                  className="form-input"
                  type="date"
                  name="follow_up_date"
                  value={formData.follow_up_date}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Job URL</label>
                <input
                  className="form-input"
                  type="url"
                  name="job_url"
                  value={formData.job_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any notes about this application…"
                style={{ height: '80px' }}
              />
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="add-form" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <><span className="spinner spinner-sm" /> Adding…</>
            ) : (
              '+ Add Application'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddApplicationModal;
