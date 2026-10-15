from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base, SessionLocal
from .seed_data import seed_database
from .routers import overview, alerts, events, incidents

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database tables exist and seed demo data
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown logic if needed

app = FastAPI(
    title="CloudShield AI Security API",
    description="Cybersecurity Detection, Threat Analytics, and Alert Management API (Synthetic Demo Mode)",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(overview.router)
app.include_router(alerts.router)
app.include_router(events.router)
app.include_router(incidents.router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "CloudShield AI Backend",
        "mode": "SYNTHETIC_DEMO_DATA",
        "database": "SQLite",
        "version": "1.0.0"
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to CloudShield AI Backend API",
        "documentation": "/docs",
        "mode": "SYNTHETIC_DEMO_DATA"
    }
