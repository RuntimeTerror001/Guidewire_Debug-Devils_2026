import { useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Alert from '../components/Alert';
import { policyAPI } from '../lib/api';

export default function Plans() {
  const [userId, setUserId] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      premium: '₹20',
      coverage: '₹1,000',
      features: [
        '✓ Weather disruption coverage',
        '✓ AQI-based protection',
        '✓ 24/7 claim support',
        '✗ Premium support',
      ],
      color: 'blue',
    },
    {
      id: 'standard',
      name: 'Standard',
      premium: '₹35',
      coverage: '₹2,000',
      features: [
        '✓ All Basic features',
        '✓ Temperature extremes coverage',
        '✓ Priority claim processing',
        '✗ Health consulting',
      ],
      color: 'pink',
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      premium: '₹50',
      coverage: '₹3,500',
      features: [
        '✓ All Standard features',
        '✓ Emergency medical coverage',
        '✓ Personal health consulting',
        '✓ Family protection add-on',
      ],
      color: 'purple',
    },
  ];

  const handleSelectPlan = async (plan) => {
    setError(null);
    setMessage(null);

    if (!userId) {
      setError('Please enter your User ID');
      return;
    }

    setLoading(true);
    try {
      await policyAPI.selectPlan({
        user_id: parseInt(userId),
        plan_type: plan.id,
      });
      setMessage(`✓ Successfully activated ${plan.name} plan!`);
      setSelectedPlan(plan.id);
      setUserId('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to select plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Insurance Plans</h1>
          <p className="text-gray-600">Choose the perfect protection plan for your gig work</p>
        </div>

        {error && <Alert type="danger" message={error} />}
        {message && <Alert type="success" message={message} />}

        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <label className="block text-sm font-medium mb-2">Select Your User ID</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your User ID to activate a plan"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${plan.popular ? 'ring-2 ring-pink-500 md:scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    POPULAR
                  </span>
                </div>
              )}

              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="mb-4">
                <p className="text-gray-600 text-sm">Monthly Premium</p>
                <p className="text-3xl font-bold text-blue-600">{plan.premium}</p>
              </div>

              <div className="mb-6 pb-6 border-b">
                <p className="text-gray-600 text-sm">Coverage Amount</p>
                <p className="text-2xl font-bold">{plan.coverage}</p>
              </div>

              <ul className="space-y-2 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-sm">
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={loading || selectedPlan === plan.id}
                className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                  selectedPlan === plan.id
                    ? 'bg-green-600 text-white cursor-default'
                    : plan.popular
                    ? 'btn-secondary'
                    : 'btn-primary'
                } disabled:opacity-50`}
              >
                {selectedPlan === plan.id ? '✓ Active' : 'Select This Plan'}
              </button>
            </Card>
          ))}
        </div>

        <Card className="mt-12">
          <h3 className="text-xl font-bold mb-4">Why Choose GigClaimSafe?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">⚡ Instant Processing</h4>
              <p className="text-gray-600">Claims approved within minutes, not days</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🎯 Parametric Insurance</h4>
              <p className="text-gray-600">Payouts triggered automatically when disruption occurs</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🔒 Fraud Protection</h4>
              <p className="text-gray-600">AI-powered fraud detection keeps premiums low</p>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
