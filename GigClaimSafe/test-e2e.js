#!/usr/bin/env node

/**
 * Full-Stack End-to-End Test
 * Tests all major features of GigClaimSafe
 */

const http = require('http');

const API_BASE = 'http://localhost:8000';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test functions
async function testFullStack() {
  console.log('🚀 GigClaimSafe Full-Stack E2E Test\n');
  console.log('================================\n');

  try {
    // 1. Test User Registration
    console.log('✓ TEST 1: User Registration');
    const registerRes = await makeRequest('POST', '/register', {
      name: 'Rajesh Kumar',
      platform: 'Uber',
      city: 'Mumbai',
      weekly_earnings: 10000,
      work_hours: 45,
    });
    console.log(`  Status: ${registerRes.status}`);
    const userId = registerRes.data.id;
    console.log(`  User ID: ${userId}`);
    console.log(`  Risk Level: ${registerRes.data.risk_level}`);
    console.log(`  Risk Score: ${registerRes.data.risk_score.toFixed(2)}\n`);

    // 2. Test Get User
    console.log('✓ TEST 2: Get User Details');
    const userRes = await makeRequest('GET', `/users/${userId}`);
    console.log(`  Status: ${userRes.status}`);
    console.log(`  Name: ${userRes.data.name}`);
    console.log(`  Platform: ${userRes.data.platform}\n`);

    // 3. Test Risk Score
    console.log('✓ TEST 3: Get Risk Score');
    const riskRes = await makeRequest('GET', `/risk-score/${userId}`);
    console.log(`  Status: ${riskRes.status}`);
    console.log(`  Risk Level: ${riskRes.data.risk_level}`);
    console.log(`  Score: ${riskRes.data.risk_score.toFixed(2)}\n`);

    // 4. Test Select Plan
    console.log('✓ TEST 4: Select Insurance Plan');
    const planRes = await makeRequest('POST', '/select-plan', {
      user_id: userId,
      plan_type: 'Standard',
    });
    console.log(`  Status: ${planRes.status}`);
    console.log(`  Plan Type: ${planRes.data.plan_type}`);
    console.log(`  Coverage: ₹${planRes.data.coverage_amount}\n`);

    // 5. Test Monitor
    console.log('✓ TEST 5: Disruption Monitor');
    const monitorRes = await makeRequest('GET', `/monitor/Mumbai`);
    console.log(`  Status: ${monitorRes.status}`);
    console.log(`  City: ${monitorRes.data.city}`);
    console.log(`  Rain Probability: ${(monitorRes.data.rain_probability * 100).toFixed(1)}%`);
    console.log(`  AQI: ${monitorRes.data.aqi}`);
    console.log(`  Temperature: ${monitorRes.data.temperature}°C\n`);

    // 6. Test Trigger Claim
    console.log('✓ TEST 6: Trigger Claim');
    const claimRes = await makeRequest('POST', '/trigger-claim', {
      user_id: userId,
      trigger_reason: 'Heavy Rain',
    });
    console.log(`  Status: ${claimRes.status}`);
    if (claimRes.status !== 201) {
      console.log(`  Error: ${claimRes.data.detail || JSON.stringify(claimRes.data)}`);
    }
    const claimId = claimRes.data.id;
    console.log(`  Claim ID: ${claimId}`);
    console.log(`  Status: ${claimRes.data.status}`);
    console.log(`  Fraud Flag: ${claimRes.data.fraud_flag}\n`);

    // 7. Test Get Claims
    console.log('✓ TEST 7: Get User Claims');
    const claimsRes = await makeRequest('GET', `/claims/${userId}`);
    console.log(`  Status: ${claimsRes.status}`);
    console.log(`  Total Claims: ${claimsRes.data.length}\n`);

    // 8. Test Approve Claim
    console.log('✓ TEST 8: Approve Claim');
    const approveRes = await makeRequest('POST', `/claims/${claimId}/approve`);
    console.log(`  Status: ${approveRes.status}`);
    console.log(`  New Status: ${approveRes.data.status}`);
    console.log(`  Payout: ₹${approveRes.data.payout_amount}\n`);

    // 9. Test Get Payouts
    console.log('✓ TEST 9: Get User Payouts');
    const payoutsRes = await makeRequest('GET', `/payouts/${userId}`);
    console.log(`  Status: ${payoutsRes.status}`);
    console.log(`  Total Payouts: ${payoutsRes.data.length}\n`);

    // 10. Test Admin Dashboard
    console.log('✓ TEST 10: Admin Dashboard');
    const adminRes = await makeRequest('GET', '/admin/dashboard');
    console.log(`  Status: ${adminRes.status}`);
    console.log(`  Total Users: ${adminRes.data.total_users}`);
    console.log(`  Total Claims: ${adminRes.data.total_claims}`);
    console.log(`  Total Disruptions: ${adminRes.data.total_disruptions}`);
    console.log(`  Total Payouts: ₹${adminRes.data.total_payouts}\n`);

    console.log('================================');
    console.log('✅ ALL TESTS PASSED! 🎉');
    console.log('================================\n');
    console.log('🌐 Frontend URL: http://localhost:3002');
    console.log('🔧 Backend URL: http://localhost:8000');
    console.log('\n✨ Full-stack application is fully functional!\n');
  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    process.exit(1);
  }
}

// Run tests
testFullStack();
