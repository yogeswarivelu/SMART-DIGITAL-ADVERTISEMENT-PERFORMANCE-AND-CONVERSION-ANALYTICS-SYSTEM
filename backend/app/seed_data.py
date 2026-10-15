from datetime import datetime, timedelta, timezone
import random
from sqlalchemy.orm import Session
from .models import SecurityEvent, SecurityAlert, Incident

def seed_database(db: Session):
    # Check if data already exists
    existing_alerts = db.query(SecurityAlert).first()
    if existing_alerts:
        return

    now = datetime.now(timezone.utc)

    # 1. Seed Incidents
    incidents_data = [
        {
            "incident_number": "INC-2026-001",
            "title": "[DEMO] Multi-Stage Credential Stuffing & Lateral Movement",
            "summary": "Coordinated attack originating from multiple ASN proxies attempting dictionary attacks against OAuth microservices followed by attempted privilege escalation on cluster node.",
            "severity": "Critical",
            "status": "Active",
            "lead_analyst": "Sarah Chen (Senior SOC Lead)",
            "affected_assets_count": 4,
            "containment_action": "Revoked session tokens, applied IP blocklist to WAF, isolated auth-pod-4a.",
            "created_at": now - timedelta(hours=2, minutes=15),
            "is_synthetic": True,
        },
        {
            "incident_number": "INC-2026-002",
            "title": "[DEMO] Unusual Data Egress Spike via Simulated Storage API",
            "summary": "Large abnormal volume outbound transfer exceeding baseline threshold by 340% toward external unverified endpoint.",
            "severity": "High",
            "status": "Contained",
            "lead_analyst": "CloudShield AI Engine (Auto-Action)",
            "affected_assets_count": 2,
            "containment_action": "Egress bandwidth throttled, egress security group policy updated.",
            "created_at": now - timedelta(hours=6, minutes=40),
            "is_synthetic": True,
        },
        {
            "incident_number": "INC-2026-003",
            "title": "[DEMO] Suspicious Service Account IAM Policy Modification",
            "summary": "Unauthorized elevation of permissions granting wildcard administrator privileges to dev-cicd service worker account.",
            "severity": "High",
            "status": "Resolved",
            "lead_analyst": "Marcus Vance (Cloud Security)",
            "affected_assets_count": 1,
            "containment_action": "Policy rollback executed automatically, API key rotated.",
            "created_at": now - timedelta(days=1, hours=3),
            "is_synthetic": True,
        },
        {
            "incident_number": "INC-2026-004",
            "title": "[DEMO] Distributed Reconnaissance & Kubernetes API Port Scan",
            "summary": "Sequential port enumeration targeting internal management ports 6443 and 2379 from untrusted subnet.",
            "severity": "Medium",
            "status": "Contained",
            "lead_analyst": "Elena Rostova (SOC Analyst II)",
            "affected_assets_count": 3,
            "containment_action": "Subnet ingress tightened, ingress firewall rule reinforced.",
            "created_at": now - timedelta(days=1, hours=10),
            "is_synthetic": True,
        }
    ]

    for inc in incidents_data:
        db.add(Incident(**inc))

    # 2. Seed Alerts
    alerts_data = [
        {
            "title": "[DEMO] Brute Force SSH Authentication Anomaly",
            "description": "Exceeded failure threshold with 450 failed SSH authentication attempts within 60 seconds targeting jump-host-01.",
            "severity": "Critical",
            "status": "Open",
            "category": "Credential Compromise",
            "risk_score": 92,
            "mitre_tactic": "Credential Access",
            "assigned_to": "Sarah Chen",
            "notes": "Originating IP 198.51.100.42 identified in known botnet threat intel feeds.",
            "created_at": now - timedelta(minutes=18),
            "updated_at": now - timedelta(minutes=15),
            "is_synthetic": True,
        },
        {
            "title": "[DEMO] Unauthorized Secret Access via Kubernetes API",
            "description": "Attempt to query database connection credentials secret from pod without appropriate RBAC cluster role binding.",
            "severity": "Critical",
            "status": "Investigating",
            "category": "Privilege Escalation",
            "risk_score": 88,
            "mitre_tactic": "Privilege Escalation",
            "assigned_to": "Elena Rostova",
            "notes": "Pod namespace: staging-payment-processor. Reviewing service account role bindings.",
            "created_at": now - timedelta(minutes=45),
            "updated_at": now - timedelta(minutes=30),
            "is_synthetic": True,
        },
        {
            "title": "[DEMO] High Volume Anomalous Outbound Data Transfer",
            "description": "Internal analytics engine initiated outbound TCP flow of 4.2 GB to external IP 203.0.113.88 over port 443.",
            "severity": "High",
            "status": "Open",
            "category": "Data Loss Prevention",
            "risk_score": 79,
            "mitre_tactic": "Exfiltration",
            "assigned_to": "Unassigned",
            "notes": "Traffic exceeded 3-sigma standard deviation for this service baseline.",
            "created_at": now - timedelta(hours=1, minutes=10),
            "updated_at": now - timedelta(hours=1, minutes=10),
            "is_synthetic": True,
        },
        {
            "title": "[DEMO] Potential SQL Injection in Search Gateway Endpoint",
            "description": "Detected boolean-based SQL injection payload pattern (' OR 1=1 --) in URL parameter '?filter_id='.",
            "severity": "High",
            "status": "Investigating",
            "category": "Network Intrusion",
            "risk_score": 74,
            "mitre_tactic": "Initial Access",
            "assigned_to": "AI SOC Auto-Pilot",
            "notes": "WAF blocked the request. Inspecting if payload bypassed front-end caching layer.",
            "created_at": now - timedelta(hours=2, minutes=25),
            "updated_at": now - timedelta(hours=2),
            "is_synthetic": True,
        },
        {
            "title": "[DEMO] Public Exposure of Mock Storage Bucket",
            "description": "Synthetic storage bucket policy modified with Read access granted to All Authenticated Users.",
            "severity": "High",
            "status": "Resolved",
            "category": "Cloud Misconfiguration",
            "risk_score": 71,
            "mitre_tactic": "Defense Evasion",
            "assigned_to": "Marcus Vance",
            "notes": "CloudShield automated posture engine reverted bucket policy to private.",
            "created_at": now - timedelta(hours=4),
            "updated_at": now - timedelta(hours=3, minutes=45),
            "is_synthetic": True,
        },
        {
            "title": "[DEMO] Rapid Port Enumeration from Subnet 10.0.4.0/24",
            "description": "Host scanned 1024 privileged ports across 12 microservice instances within 3 minutes.",
            "severity": "Medium",
            "status": "Open",
            "category": "Network Intrusion",
            "risk_score": 58,
            "mitre_tactic": "Discovery",
            "assigned_to": "Unassigned",
            "notes": "Synthetic internal scanner test or unauthorized probe.",
            "created_at": now - timedelta(hours=5),
            "updated_at": now - timedelta(hours=5),
            "is_synthetic": True,
        },
        {
            "title": "[DEMO] Expired TLS Certificate on Internal GRPC Route",
            "description": "Mutual TLS certificate expired on internal telemetry collector ingress interface.",
            "severity": "Medium",
            "status": "Resolved",
            "category": "Cloud Misconfiguration",
            "risk_score": 45,
            "mitre_tactic": "Defense Evasion",
            "assigned_to": "Marcus Vance",
            "notes": "Cert-manager auto-renewal triggered and verified.",
            "created_at": now - timedelta(hours=8),
            "updated_at": now - timedelta(hours=7, minutes=30),
            "is_synthetic": True,
        },
        {
            "title": "[DEMO] Failed Multi-Factor Authentication Surge",
            "description": "Single user account triggered 8 consecutive MFA push notification rejections.",
            "severity": "Medium",
            "status": "Investigating",
            "category": "Credential Compromise",
            "risk_score": 52,
            "mitre_tactic": "Initial Access",
            "assigned_to": "Sarah Chen",
            "notes": "Target account: j.miller@enterprise.demo. Contacted user out-of-band.",
            "created_at": now - timedelta(hours=9, minutes=15),
            "updated_at": now - timedelta(hours=8, minutes=50),
            "is_synthetic": True,
        },
        {
            "title": "[DEMO] Non-Standard Port Connection Attempt",
            "description": "Egress connection initiated toward destination port 6667 (IRC) from web frontend worker.",
            "severity": "Low",
            "status": "Resolved",
            "category": "Malware",
            "risk_score": 38,
            "mitre_tactic": "Command and Control",
            "assigned_to": "AI SOC Auto-Pilot",
            "notes": "Connection dropped by egress filter. Container scanned: clean.",
            "created_at": now - timedelta(hours=14),
            "updated_at": now - timedelta(hours=13),
            "is_synthetic": True,
        },
        {
            "title": "[DEMO] Routine Baseline Port Probe by Registered Scanner",
            "description": "Scheduled internal security assessment port probe executed within scheduled maintenance window.",
            "severity": "Low",
            "status": "Dismissed",
            "category": "Network Intrusion",
            "risk_score": 20,
            "mitre_tactic": "Discovery",
            "assigned_to": "Elena Rostova",
            "notes": "Verified against change management authorization ticket CHG-8921.",
            "created_at": now - timedelta(hours=18),
            "updated_at": now - timedelta(hours=17),
            "is_synthetic": True,
        }
    ]

    for alert in alerts_data:
        db.add(SecurityAlert(**alert))

    # 3. Seed Security Events (realistic stream)
    event_templates = [
        {"type": "Unauthorized API Call", "sev": "Critical", "action": "Blocked", "res": "iam-admin-controller", "det": "Attempt to assume IAM role 'ClusterAdmin' without token signing."},
        {"type": "SSH Brute Force", "sev": "Critical", "action": "Blocked", "res": "bastion-jump-node-01", "det": "Exceeded failure threshold: 24 login attempts from untrusted subnet."},
        {"type": "SQL Injection Pattern Detected", "sev": "High", "action": "Blocked", "res": "api-gateway-edge", "det": "WAF signature 942100 matched in HTTP query string."},
        {"type": "Abnormal Data Egress Volume", "sev": "High", "action": "Quarantined", "res": "s3-mock-data-lake", "det": "Transfer rate reached 450 MB/s exceeding normal standard baseline."},
        {"type": "Kubernetes RBAC Secret Query", "sev": "High", "action": "Flagged", "res": "k8s-cluster-core", "det": "Unauthorized 'get' request on secrets in 'production' namespace."},
        {"type": "Internal Port Scan", "sev": "Medium", "action": "Monitored", "res": "vpc-internal-router", "det": "SYN packets sent to ports 22, 80, 443, 8080, 8443 on internal target."},
        {"type": "MFA Challenge Failure", "sev": "Medium", "action": "Alerted", "res": "auth-service-v2", "det": "5 consecutive failed TOTP codes provided for administrative user."},
        {"type": "TLS Certificate Expired", "sev": "Medium", "action": "Alerted", "res": "metrics-collector", "det": "Internal certificate handshake failed due to expiration."},
        {"type": "Suspicious User-Agent Header", "sev": "Low", "action": "Monitored", "res": "web-frontend-ingress", "det": "Request observed with User-Agent header matching 'sqlmap/1.7#stable'."},
        {"type": "DNS Query to Newly Registered Domain", "sev": "Low", "action": "Logged", "res": "dns-resolver-internal", "det": "Query for lookup-sync-cdn24.xyz registered 12 hours ago."},
        {"type": "Container Image Scan Cleared", "sev": "Low", "action": "Logged", "res": "container-registry", "det": "Image build sha256:7f3a9 passed security vulnerability scan with 0 CVEs."},
        {"type": "Security Policy Hot-Reloaded", "sev": "Low", "action": "Logged", "res": "cloudshield-daemon", "det": "Firewall and egress rulesets reloaded without errors."}
    ]

    source_ips = ["198.51.100.42", "203.0.113.88", "192.0.2.14", "10.0.1.15", "10.0.4.88", "172.16.20.5", "198.51.100.99"]
    dest_ips = ["10.0.0.10", "10.0.2.50", "10.0.1.200", "10.0.3.15", "10.0.0.1"]

    for i in range(40):
        tmpl = event_templates[i % len(event_templates)]
        evt_time = now - timedelta(minutes=i * 18 + random.randint(1, 10))
        db.add(SecurityEvent(
            timestamp=evt_time,
            event_type=f"[DEMO] {tmpl['type']}",
            severity=tmpl["sev"],
            source_ip=source_ips[i % len(source_ips)],
            destination_ip=dest_ips[i % len(dest_ips)],
            resource_name=tmpl["res"],
            action_taken=tmpl["action"],
            details=tmpl["det"],
            is_synthetic=True
        ))

    db.commit()
