import type { OverviewMetrics, SecurityAlert, SecurityEvent, Incident } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error [${res.status}]: ${errorText || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const apiService = {
  async getHealth(): Promise<{ status: string; mode: string; service: string }> {
    const res = await fetch(`${API_BASE}/api/health`);
    return handleResponse(res);
  },

  async getOverview(): Promise<OverviewMetrics> {
    const res = await fetch(`${API_BASE}/api/overview`);
    return handleResponse<OverviewMetrics>(res);
  },

  async getAlerts(filters?: {
    severity?: string;
    status?: string;
    category?: string;
    search?: string;
  }): Promise<SecurityAlert[]> {
    const params = new URLSearchParams();
    if (filters?.severity && filters.severity !== 'All') params.append('severity', filters.severity);
    if (filters?.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);

    const url = `${API_BASE}/api/alerts${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    return handleResponse<SecurityAlert[]>(res);
  },

  async updateAlert(
    id: number,
    data: { status?: string; assigned_to?: string; notes?: string; risk_score?: number }
  ): Promise<SecurityAlert> {
    const res = await fetch(`${API_BASE}/api/alerts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<SecurityAlert>(res);
  },

  async quickResolveAlert(id: number): Promise<SecurityAlert> {
    const res = await fetch(`${API_BASE}/api/alerts/${id}/quick-resolve`, {
      method: 'POST',
    });
    return handleResponse<SecurityAlert>(res);
  },

  async getEvents(filters?: {
    severity?: string;
    action_taken?: string;
    search?: string;
    limit?: number;
  }): Promise<SecurityEvent[]> {
    const params = new URLSearchParams();
    if (filters?.severity && filters.severity !== 'All') params.append('severity', filters.severity);
    if (filters?.action_taken && filters.action_taken !== 'All') params.append('action_taken', filters.action_taken);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', String(filters.limit));

    const url = `${API_BASE}/api/events${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    return handleResponse<SecurityEvent[]>(res);
  },

  async getIncidents(): Promise<Incident[]> {
    const res = await fetch(`${API_BASE}/api/incidents`);
    return handleResponse<Incident[]>(res);
  },

  async containIncident(id: number, notes?: string): Promise<Incident> {
    const res = await fetch(`${API_BASE}/api/incidents/${id}/contain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action_notes: notes }),
    });
    return handleResponse<Incident>(res);
  },
};
