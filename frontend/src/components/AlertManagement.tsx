import type React from 'react';
import { Search, ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react';
import type { SecurityAlert, SeverityLevel, AlertStatus } from '../types';

interface AlertManagementProps {
  alerts: SecurityAlert[];
  onQuickResolve: (id: number) => void;
  onSelectAlert: (alert: SecurityAlert) => void;
  severityFilter: string;
  setSeverityFilter: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const AlertManagement: React.FC<AlertManagementProps> = ({
  alerts,
  onQuickResolve,
  onSelectAlert,
  severityFilter,
  setSeverityFilter,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
}) => {
  const getSeverityBadgeClass = (sev: SeverityLevel) => {
    switch (sev) {
      case 'Critical': return 'badge-critical';
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case 'Open':
        return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)' }}>Open</span>;
      case 'Investigating':
        return <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>Investigating</span>;
      case 'Resolved':
        return <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' }}>Resolved</span>;
      default:
        return <span className="badge" style={{ background: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8', border: '1px solid #475569' }}>Dismissed</span>;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      {/* Title & Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={20} color="#fb923c" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
            Alert Management Console
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '4px' }}>
            ({alerts.length} alerts loaded)
          </span>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search alerts or tactics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#f8fafc',
                borderRadius: '8px',
                padding: '6px 12px 6px 32px',
                fontSize: '0.825rem',
                outline: 'none',
                minWidth: '200px'
              }}
            />
          </div>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#f8fafc',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '0.825rem',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#f8fafc',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '0.825rem',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Investigating">Investigating</option>
            <option value="Resolved">Resolved</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>Severity</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>Alert Title & Description</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>Category & MITRE</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>Risk Score</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>Assignee</th>
              <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <tr
                  key={alert.id}
                  style={{
                    borderBottom: '1px solid rgba(51, 65, 85, 0.4)',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.5)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {/* Severity */}
                  <td style={{ padding: '14px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    <span className={`badge ${getSeverityBadgeClass(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </td>

                  {/* Title & Description */}
                  <td style={{ padding: '14px', verticalAlign: 'top', maxWidth: '340px' }}>
                    <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>
                      {alert.title}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.4 }}>
                      {alert.description}
                    </div>
                    {alert.notes && (
                      <div style={{ color: '#38bdf8', fontSize: '0.72rem', marginTop: '4px' }}>
                        Notes: {alert.notes.length > 60 ? `${alert.notes.slice(0, 60)}...` : alert.notes}
                      </div>
                    )}
                  </td>

                  {/* Category & MITRE */}
                  <td style={{ padding: '14px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    <div style={{ color: '#e2e8f0', fontWeight: 500 }}>{alert.category}</div>
                    {alert.mitre_tactic && (
                      <div style={{ fontSize: '0.72rem', color: '#a5b4fc', marginTop: '2px' }}>
                        Tactic: {alert.mitre_tactic}
                      </div>
                    )}
                  </td>

                  {/* Risk Score */}
                  <td style={{ padding: '14px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '40px',
                        height: '6px',
                        backgroundColor: '#334155',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${alert.risk_score}%`,
                          height: '100%',
                          backgroundColor: alert.risk_score >= 80 ? '#ef4444' : alert.risk_score >= 50 ? '#f59e0b' : '#3b82f6'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: alert.risk_score >= 80 ? '#ef4444' : '#f59e0b' }}>
                        {alert.risk_score}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    {getStatusBadge(alert.status)}
                  </td>

                  {/* Assignee */}
                  <td style={{ padding: '14px', verticalAlign: 'top', whiteSpace: 'nowrap', color: '#94a3b8', fontSize: '0.8rem' }}>
                    {alert.assigned_to}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px', verticalAlign: 'top', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      {alert.status !== 'Resolved' && (
                        <button
                          className="btn btn-success"
                          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                          title="Quick resolve this alert"
                          onClick={() => onQuickResolve(alert.id)}
                        >
                          <CheckCircle size={12} />
                          <span>Resolve</span>
                        </button>
                      )}
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        title="Manage / View Details"
                        onClick={() => onSelectAlert(alert)}
                      >
                        <ExternalLink size={12} />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No security alerts matched the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
