import type React from 'react';
import { Shield, RefreshCw, Radio, CloudOff } from 'lucide-react';

interface HeaderProps {
  backendHealthy: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  lastUpdated: string;
}

export const Header: React.FC<HeaderProps> = ({
  backendHealthy,
  isRefreshing,
  onRefresh,
  lastUpdated,
}) => {
  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)',
            padding: '10px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(14, 165, 233, 0.4)'
          }}>
            <Shield size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                CloudShield <span style={{ color: '#38bdf8' }}>AI</span>
              </h1>
              <span className="badge badge-synthetic">
                Synthetic Demo Data
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
              Cloud-Native Threat Detection & Automated Incident Response Console
            </p>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* AWS Inactive Notice */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid #334155',
            color: '#94a3b8'
          }}>
            <CloudOff size={14} color="#94a3b8" />
            <span>AWS Cloud: Standalone / Mock (No AWS keys active)</span>
          </div>

          {/* Backend Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            padding: '4px 10px',
            borderRadius: '6px',
            background: backendHealthy ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${backendHealthy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            color: backendHealthy ? '#34d399' : '#f87171'
          }}>
            {backendHealthy ? <span className="radar-pulse" /> : <Radio size={12} />}
            <span>FastAPI REST: {backendHealthy ? 'Connected (SQLite)' : 'Offline'}</span>
          </div>

          {/* Last Updated */}
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Synced: {lastUpdated}
          </div>

          {/* Refresh Button */}
          <button
            className="btn btn-secondary"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh dashboard data"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} style={{
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
            }} />
            <span>{isRefreshing ? 'Refreshing...' : 'Sync'}</span>
          </button>
        </div>
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </header>
  );
};
