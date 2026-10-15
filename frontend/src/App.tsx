import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { IncidentBanner } from './components/IncidentBanner';
import { ThreatCharts } from './components/ThreatCharts';
import { AlertManagement } from './components/AlertManagement';
import { EventLogTable } from './components/EventLogTable';
import { AlertDetailModal } from './components/AlertDetailModal';
import { apiService } from './services/api';
import type { OverviewMetrics, SecurityAlert, SecurityEvent, Incident, AlertStatus } from './types';
import { ShieldCheck, ShieldAlert, Activity, Server, AlertCircle } from 'lucide-react';

export function App() {
  // State
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [backendHealthy, setBackendHealthy] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected Alert for Details Modal
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [isSavingAlert, setIsSavingAlert] = useState<boolean>(false);
  const [isProcessingContain, setIsProcessingContain] = useState<boolean>(false);

  // Filters for alerts
  const [alertSeverityFilter, setAlertSeverityFilter] = useState<string>('All');
  const [alertStatusFilter, setAlertStatusFilter] = useState<string>('All');
  const [alertSearchQuery, setAlertSearchQuery] = useState<string>('');

  // Filters for events
  const [eventSeverityFilter, setEventSeverityFilter] = useState<string>('All');
  const [eventSearchQuery, setEventSearchQuery] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'alerts' | 'events' | 'incidents'>('alerts');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Main data load function
  const loadDashboardData = useCallback(async () => {
    setIsRefreshing(true);
    setErrorMessage(null);
    try {
      // 1. Health check
      try {
        await apiService.getHealth();
        setBackendHealthy(true);
      } catch (e) {
        setBackendHealthy(false);
        throw new Error('Backend server is not reachable at http://127.0.0.1:8000. Please start the backend.');
      }

      // 2. Fetch parallel
      const [overviewData, alertsData, eventsData, incidentsData] = await Promise.all([
        apiService.getOverview(),
        apiService.getAlerts({
          severity: alertSeverityFilter,
          status: alertStatusFilter,
          search: alertSearchQuery,
        }),
        apiService.getEvents({
          severity: eventSeverityFilter,
          search: eventSearchQuery,
          limit: 50,
        }),
        apiService.getIncidents(),
      ]);

      setMetrics(overviewData);
      setAlerts(alertsData);
      setEvents(eventsData);
      setIncidents(incidentsData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setErrorMessage(err.message || 'Error communicating with security backend');
    } finally {
      setIsRefreshing(false);
    }
  }, [alertSeverityFilter, alertStatusFilter, alertSearchQuery, eventSeverityFilter, eventSearchQuery]);

  // Initial fetch and dependency trigger
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle Quick Resolve Alert
  const handleQuickResolve = async (id: number) => {
    try {
      await apiService.quickResolveAlert(id);
      showToast(`Alert #${id} marked as Resolved.`);
      loadDashboardData();
    } catch (err: any) {
      showToast(`Failed to resolve alert: ${err.message}`);
    }
  };

  // Handle Modal Update
  const handleUpdateAlert = async (id: number, data: { status?: AlertStatus; assigned_to?: string; notes?: string }) => {
    setIsSavingAlert(true);
    try {
      await apiService.updateAlert(id, data);
      showToast(`Alert #${id} updated successfully.`);
      setSelectedAlert(null);
      loadDashboardData();
    } catch (err: any) {
      showToast(`Error updating alert: ${err.message}`);
    } finally {
      setIsSavingAlert(false);
    }
  };

  // Handle One-Click Incident Containment
  const handleContainIncident = async (id: number) => {
    setIsProcessingContain(true);
    try {
      await apiService.containIncident(id, 'Network egress suspended & IAM credentials revoked via CloudShield One-Click Containment');
      showToast(`Incident #${id} contained successfully.`);
      loadDashboardData();
    } catch (err: any) {
      showToast(`Failed to contain incident: ${err.message}`);
    } finally {
      setIsProcessingContain(false);
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 20px', minHeight: '100vh' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#38bdf8',
          border: '1px solid #0284c7',
          borderRadius: '8px',
          padding: '12px 18px',
          fontSize: '0.85rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ShieldCheck size={18} color="#34d399" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        backendHealthy={backendHealthy}
        isRefreshing={isRefreshing}
        onRefresh={loadDashboardData}
        lastUpdated={lastUpdated || 'Initial load...'}
      />

      {/* Error Notice */}
      {errorMessage && (
        <div className="glass-panel" style={{
          marginBottom: '20px',
          padding: '14px 18px',
          borderColor: 'rgba(239, 68, 68, 0.4)',
          background: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#fca5a5',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} color="#ef4444" />
            <span>{errorMessage}</span>
          </div>
          <button className="btn btn-danger" onClick={loadDashboardData} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
            Retry Connection
          </button>
        </div>
      )}

      {/* Summary Metrics Cards */}
      <SummaryCards metrics={metrics} />

      {/* Active Incidents Banner */}
      <IncidentBanner
        incidents={incidents}
        onContain={handleContainIncident}
        isProcessing={isProcessingContain}
      />

      {/* Threat Visual Analytics */}
      <ThreatCharts metrics={metrics} />

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
        borderBottom: '1px solid #1e293b',
        paddingBottom: '8px'
      }}>
        <button
          onClick={() => setActiveTab('alerts')}
          style={{
            background: activeTab === 'alerts' ? '#1e293b' : 'transparent',
            color: activeTab === 'alerts' ? '#38bdf8' : '#94a3b8',
            border: activeTab === 'alerts' ? '1px solid #334155' : '1px solid transparent',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ShieldAlert size={16} />
          <span>Security Alerts ({alerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          style={{
            background: activeTab === 'events' ? '#1e293b' : 'transparent',
            color: activeTab === 'events' ? '#38bdf8' : '#94a3b8',
            border: activeTab === 'events' ? '1px solid #334155' : '1px solid transparent',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Activity size={16} />
          <span>Event Stream ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('incidents')}
          style={{
            background: activeTab === 'incidents' ? '#1e293b' : 'transparent',
            color: activeTab === 'incidents' ? '#38bdf8' : '#94a3b8',
            border: activeTab === 'incidents' ? '1px solid #334155' : '1px solid transparent',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Server size={16} />
          <span>All Incidents ({incidents.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'alerts' && (
        <AlertManagement
          alerts={alerts}
          onQuickResolve={handleQuickResolve}
          onSelectAlert={(alert) => setSelectedAlert(alert)}
          severityFilter={alertSeverityFilter}
          setSeverityFilter={setAlertSeverityFilter}
          statusFilter={alertStatusFilter}
          setStatusFilter={setAlertStatusFilter}
          searchQuery={alertSearchQuery}
          setSearchQuery={setAlertSearchQuery}
        />
      )}

      {activeTab === 'events' && (
        <EventLogTable
          events={events}
          searchQuery={eventSearchQuery}
          setSearchQuery={setEventSearchQuery}
          severityFilter={eventSeverityFilter}
          setSeverityFilter={setEventSeverityFilter}
        />
      )}

      {activeTab === 'incidents' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
              Full Cybersecurity Incident History & Case Logs
            </h3>
            <span className="badge badge-synthetic">Demo Incidents</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {incidents.map((inc) => (
              <div key={inc.id} style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#38bdf8' }}>{inc.incident_number}</span>
                    <span className={`badge ${inc.severity === 'Critical' ? 'badge-critical' : 'badge-high'}`}>{inc.severity}</span>
                    <span className="badge" style={{ background: '#1e293b', color: '#cbd5e1' }}>{inc.status}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(inc.created_at).toLocaleString()}</span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', marginTop: '6px' }}>{inc.title}</h4>
                <p style={{ fontSize: '0.825rem', color: '#94a3b8', marginTop: '4px' }}>{inc.summary}</p>
                <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#cbd5e1' }}>
                  <strong>Lead:</strong> {inc.lead_analyst} | <strong>Affected Assets:</strong> {inc.affected_assets_count} | <strong>Containment:</strong> {inc.containment_action || 'None'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alert Details & Triage Modal */}
      <AlertDetailModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onUpdate={handleUpdateAlert}
        isSaving={isSavingAlert}
      />
    </div>
  );
}

export default App;
