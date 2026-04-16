def calculate_risk(city, earnings, hours):
    # Tier 1 Cities: High Risk (Mumbai, Delhi)
    # Tier 2: Medium (Bangalore)
    risk_base = 0.4
    if city in ['Mumbai', 'Delhi']:
        risk_base = 0.7
    
    score = (risk_base * 0.4) + (earnings / 10000 * 0.3) + (hours / 60 * 0.3)
    score = min(max(score, 0.1), 0.9)
    
    label = "Low"
    if score > 0.6: label = "High"
    elif score > 0.35: label = "Moderate"
    
    return score, label
