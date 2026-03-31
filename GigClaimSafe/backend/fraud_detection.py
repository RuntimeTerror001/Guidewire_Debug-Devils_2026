import random
from datetime import datetime

def detect_fraud(user_id: int, db=None, location_at_claim: str = None, user_location_city: str = None) -> float:
    """
    Detect potential fraud in a claim.
    Returns: fraud_score (float between 0 and 1)
    """
    fraud_score = 0.0
    reasons = []
    
    # Check 1: Location mismatch (simplified simulation - 10% chance)
    if location_at_claim and user_location_city:
        if location_at_claim.lower() != user_location_city.lower():
            fraud_score += 0.2
            reasons.append("Location mismatch detected")
    
    # Check 2: Duplicate claim check (simulated - in real app, check DB)
    duplicate_probability = random.uniform(0, 1)
    if duplicate_probability < 0.05:  # 5% chance of duplicate detection
        fraud_score += 0.3
        reasons.append("Potential duplicate claim detected")
    
    # Check 3: Unusual claim timing (simulated)
    hour = datetime.now().hour
    if hour < 6 or hour > 23:  # Unusual hours
        fraud_score += 0.1
        reasons.append("Claim submitted at unusual time")
    
    # Check 4: High frequency claims (simulated - in real app, check DB)
    high_frequency = random.uniform(0, 1) < 0.03  # 3% chance
    if high_frequency:
        fraud_score += 0.25
        reasons.append("Unusually high claim frequency detected")
    
    return min(1.0, fraud_score)

def calculate_fraud_risk_level(fraud_score: float) -> str:
    """Return fraud risk level based on score."""
    if fraud_score < 0.3:
        return "low"
    elif fraud_score < 0.6:
        return "medium"
    else:
        return "high"
