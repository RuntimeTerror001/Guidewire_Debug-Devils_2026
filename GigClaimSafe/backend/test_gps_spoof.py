"""
GPS Spoofing Detection Test Script
Tests the GPS spoofing detection in claim submissions.
"""
import requests
import sys
import time

API_BASE = "http://localhost:8000"

def test_gps_spoof_detection():
    print("=" * 60)
    print("GPS SPOOFING DETECTION - AUTOMATED TEST")
    print("=" * 60)

    passed = 0
    failed = 0

    # Step 1: Register a test user in Mumbai
    print("\n[SETUP] Registering test user in Mumbai...")
    res = requests.post(f"{API_BASE}/register", json={
        "name": "GPS Test User",
        "platform": "Uber",
        "city": "Mumbai",
        "weekly_earnings": 8000,
        "work_hours": 40
    })
    assert res.status_code == 201, f"Registration failed: {res.text}"
    user_id = res.json()["id"]
    print(f"  ✓ User ID: {user_id}")

    # Step 2: Select a plan
    print("[SETUP] Selecting plan...")
    res = requests.post(f"{API_BASE}/select-plan", json={
        "user_id": user_id,
        "plan_type": "standard"
    })
    assert res.status_code == 201, f"Plan selection failed: {res.text}"
    print(f"  ✓ Plan selected: {res.json()['plan_type']}")

    # ============================================================
    # TEST 1: Claim with MATCHING GPS (Mumbai coords → Mumbai city)
    # ============================================================
    print("\n" + "-" * 60)
    print("TEST 1: Matching GPS (Mumbai coords → Mumbai declared)")
    print("-" * 60)
    res = requests.post(f"{API_BASE}/trigger-claim", json={
        "user_id": user_id,
        "trigger_reason": "Heavy Rain",
        "lat": 19.076,
        "lng": 72.877,
        "city_declared": "Mumbai"
    })
    data = res.json()
    print(f"  Status: {res.status_code}")
    print(f"  Fraud Flag: {data.get('fraud_flag')}")
    print(f"  Fraud Score: {data.get('fraud_score')}")
    print(f"  GPS Spoof: {data.get('gps_spoof', 'None')}")
    print(f"  Lat: {data.get('lat')}, Lng: {data.get('lng')}")
    print(f"  City Declared: {data.get('city_declared')}")

    if data.get("gps_spoof") is None:
        print("  ✅ PASS — No GPS spoof flag (coordinates match Mumbai)")
        passed += 1
    else:
        print("  ❌ FAIL — Should NOT have GPS spoof flag")
        failed += 1

    # Re-select plan (previous claim may have used it)
    requests.post(f"{API_BASE}/select-plan", json={
        "user_id": user_id,
        "plan_type": "premium"
    })

    # ============================================================
    # TEST 2: Claim with MISMATCHED GPS (Delhi coords → Mumbai city)
    # ============================================================
    print("\n" + "-" * 60)
    print("TEST 2: Mismatched GPS (Delhi coords → Mumbai declared)")
    print("-" * 60)
    res = requests.post(f"{API_BASE}/trigger-claim", json={
        "user_id": user_id,
        "trigger_reason": "Heavy Rain",
        "lat": 28.6139,
        "lng": 77.2090,
        "city_declared": "Mumbai"
    })
    data = res.json()
    print(f"  Status: {res.status_code}")
    print(f"  Fraud Flag: {data.get('fraud_flag')}")
    print(f"  Fraud Score: {data.get('fraud_score')}")
    print(f"  GPS Spoof: {data.get('gps_spoof')}")

    gps_spoof = data.get("gps_spoof")
    if gps_spoof and gps_spoof.get("fraud_type") == "GPS_SPOOF":
        print(f"  Confidence: {gps_spoof['confidence_score']}")
        print(f"  Distance: {gps_spoof.get('distance_km')} km")
        print("  ✅ PASS — GPS_SPOOF detected correctly")
        passed += 1
    else:
        print("  ❌ FAIL — Should have GPS_SPOOF flag")
        failed += 1

    # Re-select plan
    requests.post(f"{API_BASE}/select-plan", json={
        "user_id": user_id,
        "plan_type": "basic"
    })

    # ============================================================
    # TEST 3: Claim WITHOUT GPS data (backward compatibility)
    # ============================================================
    print("\n" + "-" * 60)
    print("TEST 3: No GPS data (backward compatibility)")
    print("-" * 60)
    res = requests.post(f"{API_BASE}/trigger-claim", json={
        "user_id": user_id,
        "trigger_reason": "AQI Spike"
    })
    data = res.json()
    print(f"  Status: {res.status_code}")
    print(f"  Fraud Flag: {data.get('fraud_flag')}")
    print(f"  Lat: {data.get('lat')}, Lng: {data.get('lng')}")

    if res.status_code == 201:
        print("  ✅ PASS — Backward compatible (no crash without GPS)")
        passed += 1
    else:
        print("  ❌ FAIL — Should work without GPS data")
        failed += 1

    # ============================================================
    # TEST 4: Check /admin/fraud-flags endpoint
    # ============================================================
    print("\n" + "-" * 60)
    print("TEST 4: Admin fraud-flags endpoint")
    print("-" * 60)
    res = requests.get(f"{API_BASE}/admin/fraud-flags")
    flags = res.json()
    print(f"  Status: {res.status_code}")
    print(f"  Fraud Flags found: {len(flags)}")

    gps_spoof_flags = [f for f in flags if f.get("fraud_type") == "GPS_SPOOF"]
    if len(gps_spoof_flags) >= 1:
        for f in gps_spoof_flags:
            print(f"    - Claim #{f['claim_id']}: {f['fraud_type']} (confidence: {f['confidence_score']})")
        print("  ✅ PASS — GPS_SPOOF flags stored correctly")
        passed += 1
    else:
        print("  ❌ FAIL — No GPS_SPOOF flags found")
        failed += 1

    # ============================================================
    # SUMMARY
    # ============================================================
    print("\n" + "=" * 60)
    print(f"RESULTS: {passed} passed, {failed} failed out of {passed + failed} tests")
    print("=" * 60)

    return failed == 0


if __name__ == "__main__":
    try:
        # Quick health check
        r = requests.get(f"{API_BASE}/health", timeout=3)
        if r.status_code != 200:
            print("❌ Server not healthy")
            sys.exit(1)
    except requests.ConnectionError:
        print("❌ Cannot connect to server. Start it with: python main.py")
        sys.exit(1)

    success = test_gps_spoof_detection()
    sys.exit(0 if success else 1)
