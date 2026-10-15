from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import SecurityEvent
from ..schemas import SecurityEventResponse

router = APIRouter(prefix="/api/events", tags=["Events"])

@router.get("", response_model=List[SecurityEventResponse])
def get_security_events(
    severity: Optional[str] = Query(None, description="Filter by severity"),
    action_taken: Optional[str] = Query(None, description="Filter by action taken"),
    search: Optional[str] = Query(None, description="Search resource name, event type or IP"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(SecurityEvent)

    if severity and severity != "All":
        query = query.filter(SecurityEvent.severity == severity)
    if action_taken and action_taken != "All":
        query = query.filter(SecurityEvent.action_taken == action_taken)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            (SecurityEvent.event_type.ilike(pattern)) |
            (SecurityEvent.resource_name.ilike(pattern)) |
            (SecurityEvent.source_ip.ilike(pattern)) |
            (SecurityEvent.destination_ip.ilike(pattern)) |
            (SecurityEvent.details.ilike(pattern))
        )

    return query.order_by(SecurityEvent.timestamp.desc()).offset(offset).limit(limit).all()


@router.get("/{event_id}", response_model=SecurityEventResponse)
def get_event_by_id(event_id: int, db: Session = Depends(get_db)):
    event = db.query(SecurityEvent).filter(SecurityEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Security event not found")
    return event
