import type React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, Cell, PieChart, Pie, Legend
} from 'recharts';
import { TrendingUp, Crosshair, PieChart as PieIcon } from 'lucide-react';
import type { OverviewMetrics } from '../types';

interface ThreatChartsProps {
  metrics: OverviewMetrics | null;
}

const SEVERITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
};

const PIE_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6', '#06b6d4'];

export const ThreatCharts: React.FC<ThreatChartsProps> = ({ metrics }) => {
  const trendData = metrics?.hourly_threat_trend || [];
  const mitreData = metrics?.mitre_tactics || [];
  const categoryData = metrics?.top_categories || [];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    }}>
      {/* 1. Threat Timeline Chart */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
              Threat Volume Timeline
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Last 12 Hours</span>
        </div>

        <div style={{ width: '100%', height: 240 }}>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={SEVERITY_COLORS.critical} stopOpacity={0.7}/>
                    <stop offset="95%" stopColor={SEVERITY_COLORS.critical} stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={SEVERITY_COLORS.high} stopOpacity={0.6}/>
                    <stop offset="95%" stopColor={SEVERITY_COLORS.high} stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="medGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={SEVERITY_COLORS.medium} stopOpacity={0.5}/>
                    <stop offset="95%" stopColor={SEVERITY_COLORS.medium} stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="critical" stroke={SEVERITY_COLORS.critical} fillOpacity={1} fill="url(#critGrad)" name="Critical" />
                <Area type="monotone" dataKey="high" stroke={SEVERITY_COLORS.high} fillOpacity={1} fill="url(#highGrad)" name="High" />
                <Area type="monotone" dataKey="medium" stroke={SEVERITY_COLORS.medium} fillOpacity={1} fill="url(#medGrad)" name="Medium" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
              Loading timeline telemetry...
            </div>
          )}
        </div>
      </div>

      {/* 2. MITRE ATT&CK Tactics Bar Chart */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Crosshair size={18} color="#a855f7" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
              MITRE ATT&CK® Distribution
            </h3>
          </div>
          <span className="badge badge-synthetic">Demo Mappings</span>
        </div>

        <div style={{ width: '100%', height: 240 }}>
          {mitreData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mitreData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="tactic"
                  stroke="#64748b"
                  fontSize={10}
                  angle={-18}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Alerts">
                  {mitreData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
              Loading tactics breakdown...
            </div>
          )}
        </div>
      </div>

      {/* 3. Threat Categories Breakdown */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieIcon size={18} color="#10b981" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
              Alerts by Threat Vector
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Synthetic Categories</span>
        </div>

        <div style={{ width: '100%', height: 240, display: 'flex', alignItems: 'center' }}>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cat-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconSize={8}
                  formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '11px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', color: '#64748b' }}>
              Loading category breakdown...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
