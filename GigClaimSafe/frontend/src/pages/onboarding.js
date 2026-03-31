import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import { userAPI, riskAPI, policyAPI } from '../lib/api';

export default function Onboarding() {
  const [formData, setFormData] = useState({
    name: '',
    platform: 'Uber',
    city: 'Mumbai',
    weekly_earnings: 8000,
    work_hours: 40,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userId, setUserId] = useState(null);
  const [riskProfile, setRiskProfile] = useState(null);
  const [error, setError] = useState(null);

  const platforms = ['Uber', 'Ola', 'Swiggy', 'ZomatoFood', 'Blinkit', 'Dunzo'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: isNaN(value) ? value : parseFloat(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Register user
      const userRes = await userAPI.register(formData);
      const userId = userRes.data.id;
      setUserId(userId);

      // Get risk profile
      const riskRes = await riskAPI.getRiskScore(userId);
      setRiskProfile(riskRes.data);

      setSubmitted(true);
      setFormData({
        name: '',
        platform: 'Uber',
        city: 'Mumbai',
        weekly_earnings: 8000,
        work_hours: 40,
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Join GigClaimSafe</h1>
        
        {error && <Alert type="danger" message={error} />}

        {!submitted ? (
          <Card>
            <h2 className="text-2xl font-bold mb-6">Register as a Gig Worker</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Platform</label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {platforms.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Weekly Earnings (₹)</label>
                  <input
                    type="number"
                    name="weekly_earnings"
                    value={formData.weekly_earnings}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Weekly Work Hours</label>
                  <input
                    type="number"
                    name="work_hours"
                    value={formData.work_hours}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Register & Generate Risk Profile'}
              </button>
            </form>
          </Card>
        ) : (
          <div className="space-y-6 fade-in">
            <Alert type="success" message="✓ Registration Successful!" />

            <Card>
              <h2 className="text-2xl font-bold mb-4">Your Risk Profile</h2>
              {riskProfile && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Risk Score</p>
                      <p className="text-3xl font-bold">{(riskProfile.risk_score * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Risk Level</p>
                      <p className="text-3xl font-bold capitalize">{riskProfile.risk_level}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Risk Factors</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>City Base Risk:</span>
                        <span className="font-medium">{(riskProfile.factors.city_base * 100).toFixed(1)}%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Weather Factor:</span>
                        <span className="font-medium">{(riskProfile.factors.weather_factor * 100).toFixed(1)}%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Pollution Factor:</span>
                        <span className="font-medium">{(riskProfile.factors.pollution_factor * 100).toFixed(1)}%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Work Intensity:</span>
                        <span className="font-medium">{(riskProfile.factors.work_intensity * 100).toFixed(1)}%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Earnings Factor:</span>
                        <span className="font-medium">{(riskProfile.factors.earnings_factor * 100).toFixed(1)}%</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
                    <p className="text-sm text-blue-900">
                      <strong>Your User ID: {userId}</strong>
                    </p>
                    <p className="text-sm text-blue-800 mt-2">
                      Save this ID to check your dashboard and select insurance plans.
                    </p>
                  </div>
                </div>
              )}
            </Card>

            <button
              onClick={() => {
                setSubmitted(false);
              }}
              className="w-full btn-secondary"
            >
              Register Another Worker
            </button>
          </div>
        )}
      </main>
    </>
  );
}
