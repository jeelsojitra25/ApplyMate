import React from 'react';

const COLUMNS = [
  { status: 'Applied',      color: '#3b82f6', bg: '#eff6ff' },
  { status: 'Interviewing', color: '#f59e0b', bg: '#fffbeb' },
  { status: 'Offer',        color: '#10b981', bg: '#ecfdf5' },
  { status: 'Rejected',     color: '#ef4444', bg: '#fef2f2' },
];

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

const KanbanBoard = ({ applications, onEdit, onDelete, onAI }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      padding: '20px',
      minHeight: '300px',
    }}>
      {COLUMNS.map((col) => {
        const items = applications.filter((app) => app.status === col.status);
        return (
          <div key={col.status} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Column header */}
            <div style={{
              padding: '10px 14px',
              background: col.bg,
              borderRadius: '8px',
              borderLeft: `4px solid ${col.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontWeight: 700, fontSize: '13px', color: col.color }}>{col.status}</span>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                background: col.color,
                color: 'white',
                borderRadius: '9999px',
                padding: '1px 8px',
              }}>{items.length}</span>
            </div>

            {/* Cards */}
            {items.map((app) => (
              <div key={app.id} style={{
                background: 'var(--surface, #fff)',
                border: '1px solid var(--border, #e2e8f0)',
                borderRadius: '8px',
                padding: '14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                transition: 'box-shadow 150ms ease',
              }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary, #0f172a)', marginBottom: '4px' }}>
                  {app.company}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary, #475569)', marginBottom: '8px' }}>
                  {app.role}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', marginBottom: '10px' }}>
                  {formatDate(app.applied_date)}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => onEdit(app)}
                    style={{
                      padding: '4px 8px', fontSize: '11px', fontWeight: 500,
                      background: '#eef2ff', color: '#6366f1', border: 'none',
                      borderRadius: '4px', cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onAI(app)}
                    style={{
                      padding: '4px 8px', fontSize: '11px', fontWeight: 500,
                      background: '#f3e8ff', color: '#7c3aed', border: 'none',
                      borderRadius: '4px', cursor: 'pointer',
                    }}
                  >
                    AI
                  </button>
                  <button
                    onClick={() => onDelete(app.id)}
                    style={{
                      padding: '4px 8px', fontSize: '11px', fontWeight: 500,
                      background: '#fef2f2', color: '#ef4444', border: 'none',
                      borderRadius: '4px', cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div style={{
                padding: '20px',
                textAlign: 'center',
                color: 'var(--text-muted, #94a3b8)',
                fontSize: '12px',
                border: '2px dashed var(--border, #e2e8f0)',
                borderRadius: '8px',
              }}>
                No applications
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
