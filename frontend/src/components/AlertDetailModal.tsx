import { useState } from 'react';
import type React from 'react';
import { X } from 'lucide-react';
import type { SecurityAlert, AlertStatus } from '../types';

interface AlertDetailModalProps {
  alert: SecurityAlert | null;
  onClose: () => void;
  onUpdate: (id: number, data: { status?: AlertStatus; assigned_to?: string; notes?: string }) => void;
  isSaving: boolean;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  onClose,
  onUpdate,
  isSaving,
}) => {
  if (!alert) return null;

  const [status, setStatus] = useState<AlertStatus>(alert.status);
  const [assignedTo, setAssignedTo] = useState<string>(alert.assigned_to || 'Unassigned');
  const [notes, setNotes] = useState<string>(alert.notes || '');

  const handleSave = () => {
    onUpdate(alert.id, {
      status,
      assigned_to: assignedTo,
      notes,
    });
  };

  const getSeverityBadgeClass = (sev: string) => {
    switch (sev) {
      case 'Critical': return 'badge-critical';
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#0b1120',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '24px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #1e293b', paddingBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className={`badge ${getSeverityBadgeClass(alert.severity)}`}>
                {alert.severity}
              </span>
              <span className="badge badge-synthetic">
                SYNTHETIC DEMO ALERT #{alert.id}
              </span>
              {alert.mitre_tactic && (
                <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  MITRE: {alert.mitre_tactic}
                </span>
              )}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginTop: '10px' }}>
              {alert.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Description */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
              Incident Summary & Context
            </div>
            <p style={{ fontSize: '0.875rem', color: '#e2e8f0', background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              {alert.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Risk Score</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: alert.risk_score >= 80 ? '#ef4444' : '#f59e0b', marginTop: '2px' }}>
                {alert.risk_score} / 100
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Vector Category</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginTop: '4px' }}>
                {alert.category}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 14px', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Detected Timestamp</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                {new Date(alert.created_at).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Form Actions: Status & Assignment */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Investigation Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AlertStatus)}
                style={{
                  width: '100%',
                  background: '#1e293b',
                  color: '#f8fafc',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.85rem'
                }}
              >
                <option value="Open">Open (Pending)</option>
                <option value="Investigating">Investigating (In Progress)</option>
                <option value="Resolved">Resolved (Remediated)</option>
                <option value="Dismissed">Dismissed (False Positive)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Assigned SecOps Analyst
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1e293b',
                  color: '#f8fafc',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.85rem'
                }}
              >
                <option value="Unassigned">Unassigned</option>
                <option value="Sarah Chen">Sarah Chen (Senior SOC Lead)</option>
                <option value="Elena Rostova">Elena Rostova (SOC Analyst II)</option>
                <option value="Marcus Vance">Marcus Vance (Cloud Security)</option>
                <option value="AI SOC Auto-Pilot">AI SOC Auto-Pilot (Automated Engine)</option>
              </select>
            </div>
          </div>

          {/* Investigation Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
              Analyst Investigation Notes & Playbook Actions
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add investigation findings, forensic notes, or remediation status..."
              style={{
                width: '100%',
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '0.85rem',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        {/* Footer actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid #1e293b'
        }}>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Updating...' : 'Save Alert State'}
          </button>
        </div>
      </div>
    </div>
  );
};
