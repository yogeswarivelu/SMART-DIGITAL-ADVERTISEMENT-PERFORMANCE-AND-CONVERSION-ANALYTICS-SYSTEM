from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from datetime import datetime, timezone
from .database import Base

def utc_now():
    return datetime.now(timezone.utc)

class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=utc_now, index=True)
    event_type = Column(String(100), nullable=False, index=True)
    severity = Column(String(20), nullable=False, index=True)  # Critical, High, Medium, Low, Info
    source_ip = Column(String(50), nullable=False)
    destination_ip = Column(String(50), nullable=False)
    resource_name = Column(String(100), nullable=False)
    action_taken = Column(String(50), nullable=False)  # Blocked, Monitored, Quarantined, Alerted
    details = Column(Text, nullable=True)
    is_synthetic = Column(Boolean, default=True)


class SecurityAlert(Base):
    __tablename__ = "security_alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(20), nullable=False, index=True)  # Critical, High, Medium, Low
    status = Column(String(30), default="Open", index=True)    # Open, Investigating, Resolved, Dismissed
    category = Column(String(100), nullable=False, index=True)
    risk_score = Column(Integer, default=50)                   # 1-100
    mitre_tactic = Column(String(100), nullable=True)
    assigned_to = Column(String(100), default="Unassigned")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, index=True)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
    is_synthetic = Column(Boolean, default=True)


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_number = Column(String(50), unique=True, index=True)
    title = Column(String(200), nullable=False)
    summary = Column(Text, nullable=False)
    severity = Column(String(20), nullable=False)
    status = Column(String(30), default="Active")              # Active, Contained, Resolved
    lead_analyst = Column(String(100), default="AI SOC Auto-Pilot")
    affected_assets_count = Column(Integer, default=1)
    containment_action = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    is_synthetic = Column(Boolean, default=True)
