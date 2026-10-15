from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from ..database import get_db
from ..models import SecurityAlert
from ..schemas import SecurityAlertResponse, SecurityAlertCreate, SecurityAlertUpdate

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.get("", response_model=List[SecurityAlertResponse])
def get_alerts(
    severity: Optional[str] = Query(None, description="Filter by severity: Critical, High, Medium, Low"),
    status: Optional[str] = Query(None, description="Filter by status: Open, Investigating, Resolved, Dismissed"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in title or description"),
    db: Session = Depends(get_db)
):
    query = db.query(SecurityAlert)

    if severity and severity != "All":
        query = query.filter(SecurityAlert.severity == severity)
    if status and status != "All":
        query = query.filter(SecurityAlert.status == status)
    if category and category != "All":
        query = query.filter(SecurityAlert.category == category)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (SecurityAlert.title.ilike(search_pattern)) | 
            (SecurityAlert.description.ilike(search_pattern)) |
            (SecurityAlert.notes.ilike(search_pattern))
        )

    # Order by severity priority and created_at descending
    return query.order_by(SecurityAlert.created_at.desc()).all()


@router.get("/{alert_id}", response_model=SecurityAlertResponse)
def get_alert_by_id(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(SecurityAlert).filter(SecurityAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert


@router.patch("/{alert_id}", response_model=SecurityAlertResponse)
def update_alert(alert_id: int, update_data: SecurityAlertUpdate, db: Session = Depends(get_db)):
    alert = db.query(SecurityAlert).filter(SecurityAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    if update_data.status is not None:
        alert.status = update_data.status
    if update_data.assigned_to is not None:
        alert.assigned_to = update_data.assigned_to
    if update_data.notes is not None:
        alert.notes = update_data.notes
    if update_data.risk_score is not None:
        alert.risk_score = update_data.risk_score

    alert.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(alert)
    return alert


@router.post("", response_model=SecurityAlertResponse, status_code=201)
def create_alert(alert_in: SecurityAlertCreate, db: Session = Depends(get_db)):
    alert = SecurityAlert(
        title=alert_in.title,
        description=alert_in.description,
        severity=alert_in.severity,
        status=alert_in.status,
        category=alert_in.category,
        risk_score=alert_in.risk_score,
        mitre_tactic=alert_in.mitre_tactic,
        assigned_to=alert_in.assigned_to or "Unassigned",
        notes=alert_in.notes or "",
        is_synthetic=True
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


@router.post("/{alert_id}/quick-resolve", response_model=SecurityAlertResponse)
def quick_resolve_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(SecurityAlert).filter(SecurityAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.status = "Resolved"
    alert.notes = (alert.notes or "") + "\n[Auto] Resolved via CloudShield Quick Response."
    alert.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(alert)
    return alert
