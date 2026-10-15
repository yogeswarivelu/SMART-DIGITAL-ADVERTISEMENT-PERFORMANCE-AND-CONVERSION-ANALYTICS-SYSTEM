import type React from 'react';
import { ShieldCheck, AlertTriangle, Activity, Bell, CheckCircle2 } from 'lucide-react';
import type { OverviewMetrics } from '../types';

interface SummaryCardsProps {
  metrics: OverviewMetrics | null;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ metrics }) => {
  const score = metrics?.security_score ?? 85;
  const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const scoreStatus = score >= 80 ? 'Optimal Guard' : score >= 60 ? 'Elevated Warning' : 'Critical Threat State';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {/* 1. Security Posture Score */}
      <div className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Security Posture Score</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: scoreColor }}>
                {metrics ? score : '--'}
              </span>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>/ 100</span>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '6px',
              fontSize: '0.75rem',
              color: scoreColor,
              fontWeight: 600
            }}>
              ● {scoreStatus}
            </div>
          </div>
          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            padding: '10px',
            borderRadius: '10px',
            color: '#38bdf8'
          }}>
            <ShieldCheck size={24} />
          </div>
        </div>
      </div>

      {/* 2. Active Threats */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Active Threats</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f87171', marginTop: '6px' }}>
              {metrics ? metrics.active_threats : '--'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
              {metrics ? `${metrics.severity_breakdown.critical} Critical, ${metrics.severity_breakdown.high} High` : 'Calculating...'}
            </div>
          </div>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '10px',
            borderRadius: '10px',
            color: '#f87171'
          }}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* 3. Total Events Ingested */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Events Processed (24h)</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
              {metrics ? metrics.total_events_today.toLocaleString() : '--'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
              Stream rate: 1.2k events/hr (simulated)
            </div>
          </div>
          <div style={{
            background: 'rgba(56, 189, 248, 0.1)',
            padding: '10px',
            borderRadius: '10px',
            color: '#38bdf8'
          }}>
            <Activity size={24} />
          </div>
        </div>
      </div>

      {/* 4. Open Alerts */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Open Security Alerts</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24', marginTop: '6px' }}>
              {metrics ? metrics.open_alerts : '--'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
              {metrics ? `${metrics.status_breakdown.investigating} under investigation` : 'Calculating...'}
            </div>
          </div>
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            padding: '10px',
            borderRadius: '10px',
            color: '#fbbf24'
          }}>
            <Bell size={24} />
          </div>
        </div>
      </div>

      {/* 5. Remediated Today */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Remediated Today</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399', marginTop: '6px' }}>
              {metrics ? metrics.resolved_today : '--'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
              Automated playbook response
            </div>
          </div>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '10px',
            borderRadius: '10px',
            color: '#34d399'
          }}>
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};
