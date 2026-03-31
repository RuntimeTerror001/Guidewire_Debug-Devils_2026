import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import { disruptionAPI, claimsAPI } from '../lib/api';

export default function Disruptions() {
  const [userId, setUserId] = useState('');
  const [disruptions, setDisruptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [claimMessage, setClaimMessage] = useState(null);

  const fetchDisruptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await disruptionAPI.getAllDisruptions();
      setDisruptions(res.data);
    } catch (err) {
      setError('Failed to load disruption data');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerClaim = async (city, reason) => {
    setClaimMessage(null);
    if (!userId) {
      setError('Please enter your User ID');
      return;
    }

    try {
      await claimsAPI.triggerClaim({
        user_id: parseInt(userId),
        trigger_reason: reason,
      });
      setClaimMessage(`✓ Claim triggered for ${reason}!`);
      fetchDisruptions();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to trigger claim');
    }
  };

  useEffect(() => {
    fetchDisruptions();
    const interval = setInterval(fetchDisruptions, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Disruption Monitor</h1>

        {error && <Alert type="danger" message={error} />}
        {claimMessage && <Alert type="success" message={claimMessage} />}

        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <label className="block text-sm font-medium mb-2">Your User ID (for triggering claims)</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your User ID"
          />
        </div>

        <button
          onClick={fetchDisruptions}
          disabled={loading}
          className="mb-8 btn-primary disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : '🔄 Refresh Monitor'}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(disruptions).map(([city, data]) => (
            <Card key={city}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{city}</h2>
                  {data.disruption_triggered && (
                    <div className="mt-2 inline-block pulse">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        ⚠️ DISRUPTION DETECTED
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Rain Probability</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${data.weather_rain_probability * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{(data.weather_rain_probability * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Air Quality Index (AQI)</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{ width: `${Math.min(data.aqi / 500, 1) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{data.aqi.toFixed(0)}</span>
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Temperature</p>
                  <p className="text-3xl font-bold text-red-600">{data.temperature.toFixed(1)}°C</p>
                </div>
              </div>

              {data.disruption_triggered && (
                <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                  <h3 className="font-semibold text-red-900 mb-2">Triggers:</h3>
                  <ul className="space-y-1">
                    {data.trigger_reasons.map((reason, idx) => (
                      <li key={idx} className="text-sm text-red-800">
                        • {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.disruption_triggered && (
                <button
                  onClick={() =>
                    handleTriggerClaim(city, data.trigger_reasons[0] || 'Disruption')
                  }
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  📋 File Claim for Disruption
                </button>
              )}
            </Card>
          ))}
        </div>

        <Card className="mt-12">
          <h3 className="text-xl font-bold mb-4">How Disruption Monitoring Works</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>1. Real-time Monitoring:</strong> We track weather, air quality, and temperature across all major cities.
            </p>
            <p>
              <strong>2. Automatic Triggers:</strong> When disruption conditions are met, our parametric system automatically flags eligible claims.
            </p>
            <p>
              <strong>3. Instant Processing:</strong> Once a disruption is detected and claim is filed, payouts are processed within hours.
            </p>
            <p>
              <strong>4. No Documentation Needed:</strong> Unlike traditional insurance, parametric insurance requires no claim documents.
            </p>
          </div>
        </Card>
      </main>
    </>
  );
}
