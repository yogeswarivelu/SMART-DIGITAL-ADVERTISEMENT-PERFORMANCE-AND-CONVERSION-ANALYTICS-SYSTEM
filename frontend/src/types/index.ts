export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
export type AlertStatus = 'Open' | 'Investigating' | 'Resolved' | 'Dismissed';
export type IncidentStatus = 'Active' | 'Contained' | 'Resolved';

export interface SecurityAlert {
  id: number;
  title: string;
  description: string;
  severity: SeverityLevel;
  status: AlertStatus;
  category: string;
  risk_score: number;
  mitre_tactic?: string;
  assigned_to: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  is_synthetic: boolean;
}

export interface SecurityEvent {
  id: number;
  timestamp: string;
  event_type: string;
  severity: SeverityLevel;
  source_ip: string;
  destination_ip: string;
  resource_name: string;
  action_taken: string;
  details?: string;
  is_synthetic: boolean;
}

export interface Incident {
  id: number;
  incident_number: string;
  title: string;
  summary: string;
  severity: SeverityLevel;
  status: IncidentStatus;
  lead_analyst: string;
  affected_assets_count: number;
  containment_action?: string;
  created_at: string;
  is_synthetic: boolean;
}

export interface OverviewMetrics {
  security_score: number;
  total_events_today: number;
  active_threats: number;
  open_alerts: number;
  resolved_today: number;
  severity_breakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  status_breakdown: {
    open: number;
    investigating: number;
    resolved: number;
    dismissed: number;
  };
  hourly_threat_trend: Array<{
    time: string;
    critical: number;
    high: number;
    medium: number;
    low: number;
  }>;
  top_categories: Array<{
    name: string;
    count: number;
  }>;
  mitre_tactics: Array<{
    tactic: string;
    count: number;
  }>;
  data_mode: string;
}
