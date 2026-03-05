import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AddApplicationModal from '../components/AddApplicationModal';
import EditApplicationModal from '../components/EditApplicationModal';
import AIModal from '../components/AIModal';
import KanbanBoard from '../components/KanbanBoard';

const STATUS_CONFIG = {
  Applied:      { color: '#3b82f6', badge: 'badge-applied',      icon: '📝' },
  Interviewing: { color: '#f59e0b', badge: 'badge-interviewing', icon: '🤝' },
  Offer:        { color: '#10b981', badge: 'badge-offer',        icon: '🎉' },
  Rejected:     { color: '#ef4444', badge: 'badge-rejected',     icon: '✕'  },
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editApp, setEditApp] = useState(null);
  const [aiApp, setAiApp] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [viewMode, setViewMode] = useState('table');

  const notifRef = useRef(null);
  /* ─── Data Fetching ─── */
  const fetchApplications = async () => {
    try {
      const res = await api.get('/api/applications');
      setApplications(res.data);
    } catch {
      addToast('Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/applications/stats');
      setStats(res.data);
    } catch {
      // silently fail — stats are supplementary
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Dark mode ─── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  /* ─── Close notifications on outside click ─── */
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ─── Upcoming follow-ups (today + 7 days ahead, or overdue) ─── */
  const upcomingFollowUps = applications.filter((app) => {
    if (!app.follow_up_date) return false;
    const diff =
      (new Date(app.follow_up_date) - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= -1 && diff <= 7;
  });

  /* ─── Handlers ─── */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/applications/${id}`);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      fetchStats();
      addToast('Application deleted', 'info');
    } catch {
      addToast('Failed to delete application', 'error');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleAddSuccess = () => {
    fetchApplications();
    fetchStats();
    addToast('Application added successfully! 🎉', 'success');
  };

  const handleEditSuccess = () => {
    fetchApplications();
    fetchStats();
    addToast('Application updated successfully', 'success');
  };

  /* ─── Analytics: pipeline chart segments ─── */
  const total = parseInt(stats.total) || 0;
  const pipelineSegments = [
    { key: 'Applied',      value: parseInt(stats.applied) || 0,      color: '#3b82f6' },
    { key: 'Interviewing', value: parseInt(stats.interviewing) || 0,  color: '#f59e0b' },
    { key: 'Offer',        value: parseInt(stats.offer) || 0,         color: '#10b981' },
    { key: 'Rejected',     value: parseInt(stats.rejected) || 0,      color: '#ef4444' },
  ];

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? 'Good morning' :
    greetingHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo-box">🎯</div>
          <span className="navbar-brand-name">ApplyMate</span>
        </div>

        <div className="navbar-right">
          {/* Dark mode toggle */}
          <button className="navbar-theme-btn" onClick={() => setDarkMode(v => !v)} title="Toggle dark mode">
            {darkMode ? '\u2600\uFE0F' : '\uD83C\uDF19'}
          </button>

          {/* Notification bell */}
          <div className="navbar-notification-wrap" ref={notifRef}>
            <button
              className="navbar-notification-btn"
              onClick={() => setShowNotifications((v) => !v)}
              title="Follow-up reminders"
            >
              🔔
              {upcomingFollowUps.length > 0 && (
                <span className="notification-badge">{upcomingFollowUps.length}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-panel">
                <div className="notification-panel-header">
                  🔔 Follow-up Reminders
                </div>
                {upcomingFollowUps.length === 0 ? (
                  <div className="notification-empty">No upcoming follow-ups 🎉</div>
                ) : (
                  upcomingFollowUps.map((app) => {
                    const diff = Math.ceil(
                      (new Date(app.follow_up_date) - new Date()) / (1000 * 60 * 60 * 24)
                    );
                    const label =
                      diff < 0 ? `${Math.abs(diff)}d overdue` :
                      diff === 0 ? 'Due today' :
                      `Due in ${diff}d`;
                    return (
                      <div key={app.id} className="notification-item">
                        <div className="notification-dot" />
                        <div>
                          <div className="notification-item-company">{app.company}</div>
                          <div className="notification-item-role">{app.role}</div>
                          <span className="notification-item-date">{label}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* User chip */}
          <div className="navbar-user">
            <div className="navbar-avatar">{getInitials(user?.name)}</div>
            <span>{user?.name}</span>
          </div>

          <button className="navbar-logout" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </nav>

      {/* ── Dashboard body ── */}
      <div className="dashboard">
        <div className="dashboard-content">

          {/* Greeting */}
          <div className="dashboard-greeting">
            <h2>{greeting}, {user?.name?.split(' ')[0]} 👋</h2>
            <p>
              {total === 0
                ? 'Start tracking your job applications below.'
                : `You have ${total} application${total !== 1 ? 's' : ''} tracked. Keep going!`}
            </p>
          </div>

          {/* ── Stats Grid ── */}
          <div className="stats-grid">
            {[
              { label: 'Total',        value: stats.total        || 0, cls: 'total',        icon: '📁', color: '#6366f1' },
              { label: 'Applied',      value: stats.applied      || 0, cls: 'applied',      icon: '📝', color: '#3b82f6' },
              { label: 'Interviewing', value: stats.interviewing || 0, cls: 'interviewing', icon: '🤝', color: '#f59e0b' },
              { label: 'Offers',       value: stats.offer        || 0, cls: 'offer',        icon: '🎉', color: '#10b981' },
              { label: 'Rejected',     value: stats.rejected     || 0, cls: 'rejected',     icon: '✕',  color: '#ef4444' },
            ].map((s) => (
              <div key={s.label} className={`stat-card stat-card-${s.cls}`}>
                <span className="stat-icon">{s.icon}</span>
                <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Analytics Row ── */}
          <div className="analytics-row">
            {/* Pipeline chart */}
            <div className="analytics-card">
              <p className="analytics-title">Application Pipeline</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={pipelineSegments}>
                  <XAxis dataKey="key" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {pipelineSegments.map((seg, idx) => (
                      <Cell key={idx} fill={seg.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Follow-up reminders */}
            <div className="analytics-card">
              <p className="analytics-title">
                Follow-up Reminders
                {upcomingFollowUps.length > 0 && (
                  <span
                    className="table-count"
                    style={{ marginLeft: 8, background: '#fef2f2', color: '#ef4444' }}
                  >
                    {upcomingFollowUps.length} due
                  </span>
                )}
              </p>
              {upcomingFollowUps.length === 0 ? (
                <div className="followup-empty">
                  <span className="followup-check">✅</span>
                  No follow-ups due in the next 7 days
                </div>
              ) : (
                <div className="followup-list">
                  {upcomingFollowUps.slice(0, 4).map((app) => {
                    const diff = Math.ceil(
                      (new Date(app.follow_up_date) - new Date()) / (1000 * 60 * 60 * 24)
                    );
                    const label =
                      diff < 0 ? `${Math.abs(diff)} day${Math.abs(diff) !== 1 ? 's' : ''} overdue` :
                      diff === 0 ? 'Due today' :
                      `Due in ${diff} day${diff !== 1 ? 's' : ''}`;
                    return (
                      <div key={app.id} className="followup-item">
                        <div className="followup-item-info">
                          <div className="followup-item-company">{app.company}</div>
                          <div className="followup-item-meta">{app.role}</div>
                        </div>
                        <span className="followup-item-date">{label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Applications Table ── */}
          <div className="table-card">
            <div className="table-header">
              <div className="table-title">
                Your Applications
                <span className="table-count">{applications.length}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="view-toggle">
                  <button
                    className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setViewMode('table')}
                  >
                    Table
                  </button>
                  <button
                    className={`view-toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                    onClick={() => setViewMode('kanban')}
                  >
                    Kanban
                  </button>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowAddModal(true)}
                >
                  + Add Application
                </button>
              </div>
            </div>

            {!loading && applications.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">📋</span>
                <h3>No applications yet</h3>
                <p>Start tracking your job search by adding your first application.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                >
                  + Add First Application
                </button>
              </div>
            ) : viewMode === 'kanban' ? (
              <KanbanBoard
                applications={applications}
                onEdit={setEditApp}
                onDelete={handleDelete}
                onAI={setAiApp}
              />
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Applied</th>
                      <th>Follow Up</th>
                      <th>Link</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={`skel-${i}`}>
                          <td colSpan="7"><div className="skeleton" style={{ height: '20px', borderRadius: '4px' }} /></td>
                        </tr>
                      ))
                    ) : applications.map((app) => (
                      <tr key={app.id}>
                        <td className="td-company">{app.company}</td>
                        <td className="td-role">{app.role}</td>
                        <td>
                          <span className={`badge ${STATUS_CONFIG[app.status]?.badge || 'badge-applied'}`}>
                            {STATUS_CONFIG[app.status]?.icon} {app.status}
                          </span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                          {formatDate(app.applied_date)}
                        </td>
                        <td style={{ whiteSpace: 'nowrap', color: app.follow_up_date ? 'var(--warning)' : 'var(--text-muted)' }}>
                          {app.follow_up_date ? formatDate(app.follow_up_date) : '—'}
                        </td>
                        <td className="td-url">
                          {app.job_url ? (
                            <a href={app.job_url} target="_blank" rel="noopener noreferrer">
                              View ↗
                            </a>
                          ) : '—'}
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button
                              className="btn-table-edit"
                              onClick={() => setEditApp(app)}
                              title="Edit"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn-table-ai"
                              onClick={() => setAiApp(app)}
                              title="AI Assistant"
                            >
                              🤖 AI
                            </button>
                            {confirmDeleteId === app.id ? (
                              <>
                                <button
                                  className="btn-table-delete"
                                  onClick={() => handleDelete(app.id)}
                                >
                                  Confirm
                                </button>
                                <button
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => setConfirmDeleteId(null)}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                className="btn-table-delete"
                                onClick={() => setConfirmDeleteId(app.id)}
                                title="Delete"
                              >
                                🗑
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showAddModal && (
        <AddApplicationModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {editApp && (
        <EditApplicationModal
          application={editApp}
          onClose={() => setEditApp(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {aiApp && (
        <AIModal
          application={aiApp}
          onClose={() => setAiApp(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
