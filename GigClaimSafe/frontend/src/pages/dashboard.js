import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import RiskBadge from '../components/RiskBadge';
import { userAPI, riskAPI, policyAPI, claimsAPI, payoutsAPI } from '../lib/api';

export default function Dashboard() {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);
  const [riskProfile, setRiskProfile] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [claims, setClaims] = useState([]);
  const [payoutTotal, setPayoutTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userRes = await userAPI.getUser(userId);
      setUser(userRes.data);

      const riskRes = await riskAPI.getRiskScore(userId);
      setRiskProfile(riskRes.data);

      const policyRes = await policyAPI.getActivePolicy(userId);
      setPolicy(policyRes.data);

      const claimsRes = await claimsAPI.getUserClaims(userId);
      setClaims(claimsRes.data);

      const payoutRes = await payoutsAPI.getTotalPayouts(userId);
      setPayoutTotal(payoutRes.data.total_payouts);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Your Dashboard</h1>

        {error && <Alert type="danger" message={error} />}

        {!user && (
          <Card>
            <form onSubmit={handleFetchUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">User ID</label>
                <input
                  type="number"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your User ID"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load Dashboard'}
              </button>
            </form>
          </Card>
        )}

        {user && (
          <div className="space-y-6">
            {/* User Info */}
            <Card>
              <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}! 👋</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Platform</p>
                  <p className="font-semibold">{user.platform}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">City</p>
                  <p className="font-semibold">{user.city}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Weekly Earnings</p>
                  <p className="font-semibold">₹{user.weekly_earnings}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Work Hours</p>
                  <p className="font-semibold">{user.work_hours}h/week</p>
                </div>
              </div>
            </Card>

            {/* Risk Profile */}
            {riskProfile && (
              <Card>
                <h3 className="text-xl font-bold mb-4">Risk Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm">Overall Risk Score</p>
                    <div className="text-4xl font-bold text-blue-600 mt-2">
                      {(riskProfile.risk_score * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Risk Level</p>
                    <div className="mt-2">
                      <RiskBadge level={riskProfile.risk_level} />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className="text-lg font-semibold mt-2">
                      {riskProfile.risk_level === 'low'
                        ? '✓ Low risk - Good coverage available'
                        : riskProfile.risk_level === 'medium'
                        ? '! Medium risk - Standard plans recommended'
                        : '⚠️ High risk - Premium protection advised'}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Policy */}
            {policy && (
              <Card>
                <h3 className="text-xl font-bold mb-4">Active Policy</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Plan Type</p>
                    <p className="font-semibold text-lg capitalize">{policy.plan_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Coverage Amount</p>
                    <p className="font-semibold text-lg">₹{policy.coverage_amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Monthly Premium</p>
                    <p className="font-semibold text-lg">₹{policy.premium}</p>
                  </div>
                </div>
              </Card>
            )}

            {!policy && (
              <Alert type="warning" message="No active policy. Please select a plan to get covered." />
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <p className="text-gray-600 text-sm">Total Claims</p>
                <p className="text-4xl font-bold text-blue-600">{claims.length}</p>
              </Card>
              <Card>
                <p className="text-gray-600 text-sm">Total Payouts</p>
                <p className="text-4xl font-bold text-green-600">₹{payoutTotal}</p>
              </Card>
              <Card>
                <p className="text-gray-600 text-sm">Member Since</p>
                <p className="text-lg font-semibold">{new Date(user.created_at).toLocaleDateString()}</p>
              </Card>
            </div>

            {/* Recent Claims */}
            <Card>
              <h3 className="text-xl font-bold mb-4">Recent Claims</h3>
              {claims.length === 0 ? (
                <p className="text-gray-500">No claims yet</p>
              ) : (
                <div className="space-y-2">
                  {claims.slice(0, 5).map((claim) => (
                    <div key={claim.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-semibold">{claim.trigger_reason}</p>
                        <p className="text-sm text-gray-600">{new Date(claim.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{claim.payout_amount}</p>
                        <p className="text-sm capitalize text-blue-600">{claim.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <button
              onClick={() => setUser(null)}
              className="w-full btn-secondary"
            >
              Load Different User
            </button>
          </div>
        )}
      </main>
    </>
  );
}
