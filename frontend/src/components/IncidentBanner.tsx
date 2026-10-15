import type React from 'react';
import { ShieldAlert, Lock, CheckCircle2, User } from 'lucide-react';
import type { Incident } from '../types';

interface IncidentBannerProps {
  incidents: Incident[];
  onContain: (id: number) => void;
  isProcessing: boolean;
}

export const IncidentBanner: React.FC<IncidentBannerProps> = ({
  incidents,
  onContain,
  isProcessing,
}) => {
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');

  if (activeIncidents.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <ShieldAlert size={20} color="#f87171" />
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
          Active High-Priority Incidents ({activeIncidents.length})
        </h2>
        <span className="badge badge-critical">Attention Required</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {activeIncidents.map((incident) => {
          const isContained = incident.status === 'Contained';
          return (
            <div
              key={incident.id}
              className="glass-panel"
              style={{
                padding: '16px 20px',
                borderLeft: `4px solid ${isContained ? '#fbbf24' : '#ef4444'}`,
                background: isContained ? 'rgba(30, 41, 59, 0.7)' : 'rgba(239, 68, 68, 0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>
                      {incident.incident_number}
                    </span>
                    <span className={`badge ${incident.severity === 'Critical' ? 'badge-critical' : 'badge-high'}`}>
                      {incident.severity}
                    </span>
                    <span className="badge" style={{
                      background: isContained ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: isContained ? '#fbbf24' : '#f87171',
                      border: `1px solid ${isContained ? '#fbbf24' : '#ef4444'}`
                    }}>
                      {incident.status}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', marginTop: '6px' }}>
                    {incident.title}
                  </h4>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '8px', lineHeight: 1.4 }}>
                {incident.summary}
              </p>

              <div style={{
                marginTop: '12px',
                paddingTop: '10px',
                borderTop: '1px solid rgba(51, 65, 85, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <User size={13} />
                  <span>Lead: {incident.lead_analyst}</span>
                </div>

                {!isContained ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => onContain(incident.id)}
                    disabled={isProcessing}
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    <Lock size={12} />
                    <span>One-Click Contain</span>
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#fbbf24' }}>
                    <CheckCircle2 size={13} />
                    <span>Contained: {incident.containment_action?.slice(0, 32)}...</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
