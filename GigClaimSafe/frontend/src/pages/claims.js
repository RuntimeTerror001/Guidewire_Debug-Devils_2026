import { useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import { claimsAPI } from '../lib/api';

export default function Claims() {
  const [userId, setUserId] = useState('');
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleFetchClaims = async (e) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await claimsAPI.getUserClaims(userId);
      setClaims(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch claims');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      approved: 'bg-blue-50 text-blue-700 border-blue-200',
      paid: 'bg-green-50 text-green-700 border-green-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const filteredClaims = filterStatus === 'all' ? claims : claims.filter((c) => c.status === filterStatus);

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Claims Management</h1>

        {error && <Alert type="danger" message={error} />}

        <Card className="mb-8">
          <form onSubmit={handleFetchClaims} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your User ID</label>
              <input
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
                placeholder="Enter your User ID"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'View My Claims'}
            </button>
          </form>
        </Card>

        {claims.length > 0 && (
          <>
            <div className="mb-6 flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                All ({claims.length})
              </button>
              {['pending', 'approved', 'paid', 'rejected'].map((status) => {
                const count = claims.filter((c) => c.status === status).length;
                return (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize ${
                      filterStatus === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {status} ({count})
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              {filteredClaims.map((claim) => (
                <Card key={claim.id}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">Claim #{claim.id}</h3>
                      <p className="text-gray-600 text-sm">
                        {new Date(claim.created_at).toLocaleDateString()} at{' '}
                        {new Date(claim.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className={`border rounded-lg px-3 py-1 text-sm font-semibold capitalize ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b">
                    <div>
                      <p className="text-gray-600 text-sm">Trigger Reason</p>
                      <p className="font-semibold">{claim.trigger_reason}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Payout Amount</p>
                      <p className="text-xl font-bold text-green-600">₹{claim.payout_amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Fraud Status</p>
                      {claim.fraud_flag ? (
                        <p className="text-red-600 font-semibold">🚩 Flagged</p>
                      ) : (
                        <p className="text-green-600 font-semibold">✓ Clear</p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Fraud Score</p>
                      <p className="font-semibold">{(claim.fraud_score * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  {claim.fraud_flag && (
                    <Alert type="warning" message="This claim has been flagged for fraud risk and may require additional review." />
                  )}
                </Card>
              ))}
            </div>
          </>
        )}

        {userId && claims.length === 0 && !loading && (
          <Card>
            <p className="text-gray-500 text-center py-12">No claims found for this user.</p>
          </Card>
        )}

        <Card className="mt-12">
          <h3 className="text-xl font-bold mb-4">Claims Process</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</div>
              <div>
                <h4 className="font-semibold">Disruption Detected</h4>
                <p className="text-gray-600 text-sm">Weather, AQI, or temperature triggers met</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</div>
              <div>
                <h4 className="font-semibold">Claim Filed</h4>
                <p className="text-gray-600 text-sm">You can file a claim for the disruption event</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</div>
              <div>
                <h4 className="font-semibold">Fraud Check</h4>
                <p className="text-gray-600 text-sm">AI system checks for fraud patterns</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">4</div>
              <div>
                <h4 className="font-semibold">Instant Payout</h4>
                <p className="text-gray-600 text-sm">Approved claims paid immediately</p>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
