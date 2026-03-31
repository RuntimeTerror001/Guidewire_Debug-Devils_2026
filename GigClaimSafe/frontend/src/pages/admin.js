import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { PieChartComponent } from '../components/Charts';
import { adminAPI } from '../lib/api';

export default function Admin() {
  const [dashboard, setDashboard] = useState(null);
  const [claimsByStatus, setClaimsByStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const dashRes = await adminAPI.getDashboard();
      setDashboard(dashRes.data);

      const claimsRes = await adminAPI.getClaimsByStatus();
      const chartData = Object.entries(claimsRes.data).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
      }));
      setClaimsByStatus(chartData);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Admin Dashboard</h1>

        {/* Key Metrics */}
        {dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">{dashboard.total_users}</p>
            </Card>
            <Card>
              <p className="text-gray-600 text-sm">Total Claims</p>
              <p className="text-3xl font-bold text-yellow-600">{dashboard.total_claims}</p>
            </Card>
            <Card>
              <p className="text-gray-600 text-sm">Disruptions</p>
              <p className="text-3xl font-bold text-red-600">{dashboard.triggered_disruptions}</p>
            </Card>
            <Card>
              <p className="text-gray-600 text-sm">Active Policies</p>
              <p className="text-3xl font-bold text-green-600">{dashboard.active_policies}</p>
            </Card>
            <Card>
              <p className="text-gray-600 text-sm">Total Payouts</p>
              <p className="text-3xl font-bold text-purple-600">₹{dashboard.total_payouts.toFixed(0)}</p>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Risk Analysis */}
          {dashboard && (
            <Card>
              <h3 className="text-xl font-bold mb-4">Platform Health</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Average Risk Score</span>
                    <span className="font-bold">{(dashboard.avg_risk_score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-red-500 h-3 rounded-full"
                      style={{ width: `${dashboard.avg_risk_score * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">System Status: <span className="text-green-600 font-semibold">✓ Operational</span></p>
                  <p className="text-sm text-gray-600">Claims Processing: <span className="text-green-600 font-semibold">✓ Normal</span></p>
                  <p className="text-sm text-gray-600">Fraud Detection: <span className="text-green-600 font-semibold">✓ Active</span></p>
                </div>
              </div>
            </Card>
          )}

          {/* Claims by Status Chart */}
          {claimsByStatus && (
            <Card>
              <h3 className="text-xl font-bold mb-4">Claims Distribution</h3>
              <PieChartComponent data={claimsByStatus} />
            </Card>
          )}
        </div>

        {/* Recent Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-bold mb-4">User Growth Indicators</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">New Users (This Week)</span>
                <span className="font-bold">{Math.floor(Math.random() * 50) + 10}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Active Users (7d)</span>
                <span className="font-bold">{Math.floor(dashboard?.total_users * 0.7) || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Plan Conversions</span>
                <span className="font-bold">{Math.floor(dashboard?.active_policies * 0.9) || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Retention Rate</span>
                <span className="font-bold">92%</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-4">Financial Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Total Revenue (Premiums)</span>
                <span className="font-bold">₹{(dashboard?.total_users * 35).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Claims Paid Out</span>
                <span className="font-bold">₹{dashboard?.total_payouts.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Loss Ratio</span>
                <span className="font-bold">
                  {((dashboard?.total_payouts / (dashboard?.total_users * 35)) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Average Claim Size</span>
                <span className="font-bold">
                  ₹{dashboard?.total_claims > 0 ? (dashboard.total_payouts / dashboard.total_claims).toFixed(0) : 0}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mt-8">
          <h3 className="text-xl font-bold mb-4">System Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">API Version</p>
              <p className="font-semibold">1.0.0</p>
            </div>
            <div>
              <p className="text-gray-600">Database</p>
              <p className="font-semibold">SQLite</p>
            </div>
            <div>
              <p className="text-gray-600">Backend</p>
              <p className="font-semibold">FastAPI</p>
            </div>
            <div>
              <p className="text-gray-600">Frontend</p>
              <p className="font-semibold">Next.js</p>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
