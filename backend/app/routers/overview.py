from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone
from typing import List
from ..database import get_db
from ..models import SecurityEvent, SecurityAlert, Incident
from ..schemas import (
    DashboardOverviewResponse,
    SeverityCounts,
    StatusCounts,
    MetricTrendPoint,
    CategoryBreakdown,
    MitreTacticBreakdown
)

router = APIRouter(prefix="/api/overview", tags=["Overview"])

@router.get("", response_model=DashboardOverviewResponse)
def get_dashboard_overview(db: Session = Depends(get_db)):
    # Calculate security posture score based on alert severities and statuses
    open_critical = db.query(SecurityAlert).filter(
        SecurityAlert.severity == "Critical",
        SecurityAlert.status.in_(["Open", "Investigating"])
    ).count()

    open_high = db.query(SecurityAlert).filter(
        SecurityAlert.severity == "High",
        SecurityAlert.status.in_(["Open", "Investigating"])
    ).count()

    open_medium = db.query(SecurityAlert).filter(
        SecurityAlert.severity == "Medium",
        SecurityAlert.status.in_(["Open", "Investigating"])
    ).count()

    # Base score 98 minus penalties for uncontained threats
    posture_score = max(10, 98 - (open_critical * 8) - (open_high * 4) - (open_medium * 1))

    total_events_today = db.query(SecurityEvent).count()
    active_threats = open_critical + open_high
    open_alerts_count = db.query(SecurityAlert).filter(SecurityAlert.status == "Open").count()
    resolved_today_count = db.query(SecurityAlert).filter(SecurityAlert.status == "Resolved").count()

    # Severity breakdown across alerts
    sev_counts = SeverityCounts(
        critical=db.query(SecurityAlert).filter(SecurityAlert.severity == "Critical").count(),
        high=db.query(SecurityAlert).filter(SecurityAlert.severity == "High").count(),
        medium=db.query(SecurityAlert).filter(SecurityAlert.severity == "Medium").count(),
        low=db.query(SecurityAlert).filter(SecurityAlert.severity == "Low").count()
    )

    # Status breakdown
    stat_counts = StatusCounts(
        open=db.query(SecurityAlert).filter(SecurityAlert.status == "Open").count(),
        investigating=db.query(SecurityAlert).filter(SecurityAlert.status == "Investigating").count(),
        resolved=db.query(SecurityAlert).filter(SecurityAlert.status == "Resolved").count(),
        dismissed=db.query(SecurityAlert).filter(SecurityAlert.status == "Dismissed").count()
    )

    # Hourly threat trend (synthetic aggregated distribution over the last 6 time buckets)
    now = datetime.now(timezone.utc)
    trend_points: List[MetricTrendPoint] = []
    labels = ["-10h", "-8h", "-6h", "-4h", "-2h", "Current"]
    mock_distribution = [
        (1, 2, 4, 8),
        (2, 3, 6, 7),
        (1, 4, 5, 9),
        (3, 5, 7, 12),
        (2, 6, 9, 14),
        (open_critical, open_high, open_medium, 10)
    ]

    for lbl, (crit, hi, med, lo) in zip(labels, mock_distribution):
        trend_points.append(
            MetricTrendPoint(
                time=lbl,
                critical=crit,
                high=hi,
                medium=med,
                low=lo
            )
        )

    # Top categories
    category_rows = db.query(
        SecurityAlert.category, func.count(SecurityAlert.id)
    ).group_by(SecurityAlert.category).all()
    top_categories = [CategoryBreakdown(name=row[0], count=row[1]) for row in category_rows]

    # MITRE ATT&CK tactics
    tactic_rows = db.query(
        SecurityAlert.mitre_tactic, func.count(SecurityAlert.id)
    ).filter(SecurityAlert.mitre_tactic.isnot(None)).group_by(SecurityAlert.mitre_tactic).all()
    mitre_tactics = [MitreTacticBreakdown(tactic=row[0], count=row[1]) for row in tactic_rows]

    return DashboardOverviewResponse(
        security_score=posture_score,
        total_events_today=total_events_today,
        active_threats=active_threats,
        open_alerts=open_alerts_count,
        resolved_today=resolved_today_count,
        severity_breakdown=sev_counts,
        status_breakdown=stat_counts,
        hourly_threat_trend=trend_points,
        top_categories=top_categories,
        mitre_tactics=mitre_tactics,
        data_mode="SYNTHETIC_DEMO_DATA"
    )
