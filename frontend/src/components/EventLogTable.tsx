import type React from 'react';
import { Activity, Search } from 'lucide-react';
import type { SecurityEvent, SeverityLevel } from '../types';

interface EventLogTableProps {
  events: SecurityEvent[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  severityFilter: string;
  setSeverityFilter: (s: string) => void;
}

export const EventLogTable: React.FC<EventLogTableProps> = ({
  events,
  searchQuery,
  setSearchQuery,
  severityFilter,
  setSeverityFilter,
}) => {
  const getActionBadge = (action: string) => {
    switch (action.toLowerCase()) {
      case 'blocked':
        return <span className="badge badge-action-blocked">Blocked</span>;
      case 'quarantined':
        return <span className="badge badge-action-quarantined">Quarantined</span>;
      case 'monitored':
        return <span className="badge badge-action-monitored">Monitored</span>;
      default:
        return <span className="badge badge-action-logged">{action}</span>;
    }
  };

  const getSeverityBadgeClass = (sev: SeverityLevel) => {
    switch (sev) {
      case 'Critical': return 'badge-critical';
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={20} color="#38bdf8" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
            Real-Time Security Event Stream
          </h2>
          <span className="badge badge-synthetic">Synthetic Telemetry</span>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            ({events.length} records)
          </span>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search IP, resource, event..."
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
                minWidth: '220px'
              }}
            />
          </div>

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
        </div>
      </div>

      <div style={{ overflowX: 'auto', maxHeight: '540px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
          <thead style={{ position: 'sticky', top: 0, background: '#090d16', zIndex: 10 }}>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Timestamp</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Event Type</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Severity</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Source IP</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Destination IP</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Target Resource</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Enforcement Action</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((evt) => (
                <tr
                  key={evt.id}
                  style={{
                    borderBottom: '1px solid rgba(51, 65, 85, 0.3)',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.4)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {/* Timestamp */}
                  <td style={{ padding: '10px 12px', color: '#64748b', whiteSpace: 'nowrap', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>

                  {/* Event Type */}
                  <td style={{ padding: '10px 12px', color: '#f8fafc', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {evt.event_type}
                  </td>

                  {/* Severity */}
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                    <span className={`badge ${getSeverityBadgeClass(evt.severity)}`}>
                      {evt.severity}
                    </span>
                  </td>

                  {/* Source IP */}
                  <td style={{ padding: '10px 12px', color: '#38bdf8', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                    {evt.source_ip}
                  </td>

                  {/* Destination IP */}
                  <td style={{ padding: '10px 12px', color: '#94a3b8', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                    {evt.destination_ip}
                  </td>

                  {/* Resource */}
                  <td style={{ padding: '10px 12px', color: '#cbd5e1', whiteSpace: 'nowrap' }}>
                    <span style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '2px 6px', borderRadius: '4px', border: '1px solid #334155' }}>
                      {evt.resource_name}
                    </span>
                  </td>

                  {/* Action Taken */}
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                    {getActionBadge(evt.action_taken)}
                  </td>

                  {/* Details */}
                  <td style={{ padding: '10px 12px', color: '#94a3b8', maxWidth: '300px' }}>
                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={evt.details}>
                      {evt.details}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  No security events matching current criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
