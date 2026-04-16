PAYOUT_RATES = {
    "Basic":    {"RAIN": 500,  "AQI": 300,  "TEMP": 200},
    "Standard": {"RAIN": 1000, "AQI": 600,  "TEMP": 400},
    "Premium":  {"RAIN": 1750, "AQI": 1050, "TEMP": 700},
}


def process_claim(policy, trigger_type: str, fraud_status: str) -> tuple[str, int]:
    if fraud_status == "BLOCKED":
        return "REJECTED", 0

    trigger_value = PAYOUT_RATES.get(policy.plan_type, {}).get(trigger_type, 0)
    remaining = max(policy.coverage_amount - policy.used_amount, 0)
    payout = min(trigger_value, remaining)
    status = "APPROVED" if payout > 0 else "REJECTED"
    return status, payout
