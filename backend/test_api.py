import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.seed_data import seed_database

@pytest.fixture(scope="session", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    db.close()

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["mode"] == "SYNTHETIC_DEMO_DATA"

def test_overview_metrics():
    response = client.get("/api/overview")
    assert response.status_code == 200
    data = response.json()
    assert "security_score" in data
    assert "severity_breakdown" in data
    assert "hourly_threat_trend" in data
    assert "mitre_tactics" in data
    assert len(data["hourly_threat_trend"]) > 0
    assert data["data_mode"] == "SYNTHETIC_DEMO_DATA"

def test_get_alerts():
    response = client.get("/api/alerts")
    assert response.status_code == 200
    alerts = response.json()
    assert len(alerts) >= 10
    assert alerts[0]["is_synthetic"] is True

def test_filter_alerts():
    response = client.get("/api/alerts?severity=Critical")
    assert response.status_code == 200
    alerts = response.json()
    for alert in alerts:
        assert alert["severity"] == "Critical"

def test_quick_resolve_alert():
    # Fetch first open alert
    response = client.get("/api/alerts?status=Open")
    assert response.status_code == 200
    alerts = response.json()
    assert len(alerts) > 0
    target_id = alerts[0]["id"]

    # Quick resolve
    resolve_res = client.post(f"/api/alerts/{target_id}/quick-resolve")
    assert resolve_res.status_code == 200
    updated = resolve_res.json()
    assert updated["status"] == "Resolved"

def test_get_events():
    response = client.get("/api/events?limit=10")
    assert response.status_code == 200
    events = response.json()
    assert len(events) <= 10
    assert events[0]["resource_name"] is not None

def test_get_incidents():
    response = client.get("/api/incidents")
    assert response.status_code == 200
    incidents = response.json()
    assert len(incidents) >= 4
