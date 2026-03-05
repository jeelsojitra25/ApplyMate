import React, { useState } from 'react';
import api from '../utils/api';

const TABS = [
  { id: 'match',       label: '📊 Resume Match'    },
  { id: 'suggestions', label: '💡 Resume Tips'      },
  { id: 'coverLetter', label: '✉️ Cover Letter'      },
  { id: 'followUp',    label: '📨 Follow-up Email'  },
];

const AIModal = ({ application, onClose }) => {
  const [activeTab, setActiveTab] = useState('match');
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const resetResult = () => { setResult(null); setCopied(false); };

  const handleMatch = async () => {
    setLoading(true);
    resetResult();
    try {
      const res = await api.post('/api/ai/match', { resume, jobDescription });
      setResult({ type: 'match', data: res.data });
    } catch {
      setResult({ type: 'error', data: 'AI request failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCoverLetter = async () => {
    setLoading(true);
    resetResult();
    try {
      const res = await api.post('/api/ai/cover-letter', { resume, jobDescription, company: application.company, role: application.role });
      setResult({ type: 'coverLetter', data: res.data.coverLetter });
    } catch {
      setResult({ type: 'error', data: 'AI request failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUp = async () => {
    setLoading(true);
    resetResult();
    try {
      const daysSince = Math.floor(
        (new Date() - new Date(application.applied_date)) / (1000 * 60 * 60 * 24)
      );
      const res = await api.post('/api/ai/follow-up', { company: application.company, role: application.role, daySinceApplied: daysSince, notes: application.notes });
      setResult({ type: 'followUp', data: res.data.email });
    } catch {
      setResult({ type: 'error', data: 'AI request failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestions = async () => {
    setLoading(true);
    resetResult();
    try {
      const res = await api.post('/api/ai/suggestions', { resume });
      setResult({ type: 'suggestions', data: res.data });
    } catch {
      setResult({ type: 'error', data: 'AI request failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getScoreClass = (score) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const getActionButton = () => {
    if (activeTab === 'match') {
      return (
        <button
          className="btn btn-primary"
          onClick={handleMatch}
          disabled={loading || !resume.trim() || !jobDescription.trim()}
        >
          {loading ? <><span className="spinner spinner-sm" /> Analyzing…</> : '🔍 Analyze Match'}
        </button>
      );
    }
    if (activeTab === 'suggestions') {
      return (
        <button
          className="btn btn-primary"
          onClick={handleSuggestions}
          disabled={loading || !resume.trim()}
        >
          {loading ? <><span className="spinner spinner-sm" /> Analyzing…</> : '💡 Get Suggestions'}
        </button>
      );
    }
    if (activeTab === 'coverLetter') {
      return (
        <button
          className="btn btn-primary"
          onClick={handleCoverLetter}
          disabled={loading || !resume.trim() || !jobDescription.trim()}
        >
          {loading ? <><span className="spinner spinner-sm" /> Generating…</> : '✉️ Generate Cover Letter'}
        </button>
      );
    }
    if (activeTab === 'followUp') {
      return (
        <button className="btn btn-primary" onClick={handleFollowUp} disabled={loading}>
          {loading ? <><span className="spinner spinner-sm" /> Generating…</> : '📨 Generate Email'}
        </button>
      );
    }
    return null;
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <h3>🤖 AI Assistant — {application.company}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Tabs */}
          <div className="ai-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`ai-tab${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => { setActiveTab(tab.id); resetResult(); }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Match Tab */}
          {activeTab === 'match' && (
            <div>
              <div className="ai-info-banner">
                📋 Analyzing: <strong style={{ marginLeft: 4 }}>{application.role} at {application.company}</strong>
              </div>
              <div className="form-group">
                <label className="form-label">Your Resume</label>
                <textarea
                  className="form-input"
                  style={{ height: '120px' }}
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your full resume text here…"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Job Description</label>
                <textarea
                  className="form-input"
                  style={{ height: '120px' }}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here…"
                />
              </div>
              {getActionButton()}

              {result?.type === 'match' && (
                <div className="ai-result">
                  <div className="match-score-header">
                    <div className={`score-ring ${getScoreClass(result.data.matchScore)}`}>
                      {result.data.matchScore}%
                    </div>
                    <p className="score-label">Resume Match Score</p>
                  </div>

                  {result.data.matchedKeywords?.length > 0 && (
                    <div className="keyword-section">
                      <p className="keyword-section-title">✅ Matched Keywords</p>
                      <div className="keyword-tags">
                        {result.data.matchedKeywords.map((kw, i) => (
                          <span key={i} className="keyword-tag keyword-tag-matched">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.data.missingKeywords?.length > 0 && (
                    <div className="keyword-section">
                      <p className="keyword-section-title">❌ Missing Keywords</p>
                      <div className="keyword-tags">
                        {result.data.missingKeywords.map((kw, i) => (
                          <span key={i} className="keyword-tag keyword-tag-missing">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.data.suggestions && (
                    <div>
                      <p className="keyword-section-title">💡 Suggestions</p>
                      <div className="ai-suggestions-box">{result.data.suggestions}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Resume Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <div>
              <div className="form-group">
                <label className="form-label">Your Resume</label>
                <textarea
                  className="form-input"
                  style={{ height: '150px' }}
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your full resume text here for a detailed analysis…"
                />
              </div>
              {getActionButton()}

              {result?.type === 'suggestions' && (
                <div className="ai-result">
                  <div className="suggestion-score">
                    <div className="suggestion-score-value">{result.data.overallScore}/100</div>
                    <p className="suggestion-score-label">Overall Resume Score</p>
                  </div>

                  {result.data.strengths?.length > 0 && (
                    <div className="suggestion-section">
                      <p className="suggestion-section-title">✅ Strengths</p>
                      {result.data.strengths.map((s, i) => (
                        <div key={i} className="suggestion-item">
                          <span className="suggestion-item-bullet">⭐</span>
                          <div className="suggestion-item-content">
                            <p className="suggestion-item-text">{s}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {result.data.improvements?.length > 0 && (
                    <div className="suggestion-section">
                      <p className="suggestion-section-title">🔧 Areas to Improve</p>
                      {result.data.improvements.map((item, i) => (
                        <div key={i} className="suggestion-item">
                          <span className="suggestion-item-bullet">→</span>
                          <div className="suggestion-item-content">
                            <p className="suggestion-item-section">{item.section}: {item.issue}</p>
                            <p className="suggestion-item-text">{item.suggestion}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {result.data.quickWins?.length > 0 && (
                    <div className="suggestion-section">
                      <p className="suggestion-section-title">⚡ Quick Wins</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {result.data.quickWins.map((win, i) => (
                          <span key={i} className="quick-win-tag">✓ {win}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.data.missingKeywords?.length > 0 && (
                    <div className="suggestion-section" style={{ marginBottom: 0 }}>
                      <p className="suggestion-section-title">🔑 Keywords to Add</p>
                      <div className="keyword-tags">
                        {result.data.missingKeywords.map((kw, i) => (
                          <span key={i} className="keyword-tag keyword-tag-missing">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Cover Letter Tab */}
          {activeTab === 'coverLetter' && (
            <div>
              <div className="ai-info-banner">
                ✉️ Generating cover letter for: <strong style={{ marginLeft: 4 }}>{application.role} at {application.company}</strong>
              </div>
              <div className="form-group">
                <label className="form-label">Your Resume</label>
                <textarea
                  className="form-input"
                  style={{ height: '110px' }}
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your resume here…"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Job Description</label>
                <textarea
                  className="form-input"
                  style={{ height: '110px' }}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here…"
                />
              </div>
              {getActionButton()}

              {result?.type === 'coverLetter' && (
                <div className="ai-result">
                  <button className="copy-btn" onClick={() => handleCopy(result.data)}>
                    {copied ? '✓ Copied!' : '📋 Copy to clipboard'}
                  </button>
                  <pre className="ai-text-result">{result.data}</pre>
                </div>
              )}
            </div>
          )}

          {/* Follow-up Tab */}
          {activeTab === 'followUp' && (
            <div>
              <div className="ai-info-banner">
                📨 Generating follow-up email for: <strong style={{ marginLeft: 4 }}>{application.role} at {application.company}</strong>
                {application.applied_date && (
                  <span style={{ marginLeft: 8, color: 'var(--text-muted)' }}>
                    · Applied {Math.floor((new Date() - new Date(application.applied_date)) / (1000 * 60 * 60 * 24))} days ago
                  </span>
                )}
              </div>

              {application.notes && (
                <div className="form-group">
                  <label className="form-label">Notes from your application</label>
                  <div className="form-input" style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)', minHeight: '60px' }}>
                    {application.notes}
                  </div>
                </div>
              )}

              {getActionButton()}

              {result?.type === 'followUp' && (
                <div className="ai-result">
                  <button className="copy-btn" onClick={() => handleCopy(result.data)}>
                    {copied ? '✓ Copied!' : '📋 Copy to clipboard'}
                  </button>
                  <pre className="ai-text-result">{result.data}</pre>
                </div>
              )}
            </div>
          )}

          {/* Error state */}
          {result?.type === 'error' && (
            <div className="alert alert-error" style={{ marginTop: 16 }}>
              <span>⚠</span><span>{result.data}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIModal;
