from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, List

# Event schemas
class SecurityEventBase(BaseModel):
    event_type: str
    severity: str
    source_ip: str
    destination_ip: str
    resource_name: str
    action_taken: str
    details: Optional[str] = None
    is_synthetic: bool = True

class SecurityEventResponse(SecurityEventBase):
    id: int
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)


# Alert schemas
class SecurityAlertBase(BaseModel):
    title: str
    description: str
    severity: str
    status: str = "Open"
    category: str
    risk_score: int = Field(default=50, ge=1, le=100)
    mitre_tactic: Optional[str] = None
    assigned_to: Optional[str] = "Unassigned"
    notes: Optional[str] = None
    is_synthetic: bool = True

class SecurityAlertCreate(SecurityAlertBase):
    pass

class SecurityAlertUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None
    risk_score: Optional[int] = None

class SecurityAlertResponse(SecurityAlertBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Incident schemas
class IncidentBase(BaseModel):
    incident_number: str
    title: str
    summary: str
    severity: str
    status: str
    lead_analyst: str
    affected_assets_count: int
    containment_action: Optional[str] = None
    is_synthetic: bool = True

class IncidentResponse(IncidentBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Dashboard Summary & Analytics schemas
class SeverityCounts(BaseModel):
    critical: int
    high: int
    medium: int
    low: int

class StatusCounts(BaseModel):
    open: int
    investigating: int
    resolved: int
    dismissed: int

class MetricTrendPoint(BaseModel):
    time: str
    critical: int
    high: int
    medium: int
    low: int

class CategoryBreakdown(BaseModel):
    name: str
    count: int

class MitreTacticBreakdown(BaseModel):
    tactic: str
    count: int

class DashboardOverviewResponse(BaseModel):
    security_score: int
    total_events_today: int
    active_threats: int
    open_alerts: int
    resolved_today: int
    severity_breakdown: SeverityCounts
    status_breakdown: StatusCounts
    hourly_threat_trend: List[MetricTrendPoint]
    top_categories: List[CategoryBreakdown]
    mitre_tactics: List[MitreTacticBreakdown]
    data_mode: str = "SYNTHETIC_DEMO_DATA"
