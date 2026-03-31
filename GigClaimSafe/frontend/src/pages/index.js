import Link from 'next/link';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-pink-500 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">🛡️ GigClaimSafe</h1>
            <p className="text-xl md:text-2xl mb-8">
              AI-Powered Parametric Insurance for Gig Delivery Workers
            </p>
            <p className="text-lg mb-12 opacity-90">
              Instant payouts when weather, pollution, or temperature disrupts your deliveries.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/onboarding">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                  Get Started
                </button>
              </Link>
              <Link href="/plans">
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors">
                  View Plans
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto py-20 px-4">
          <h2 className="text-4xl font-bold mb-12 text-center gradient-text">Why GigClaimSafe?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Instant Payouts</h3>
              <p className="text-gray-600">
                Parametric insurance triggers automatically when weather or AQI thresholds are met. No waiting for claim approvals.
              </p>
            </Card>

            <Card>
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Risk Scoring</h3>
              <p className="text-gray-600">
                Our ML model analyzes city risk, weather patterns, and work intensity to create accurate risk profiles.
              </p>
            </Card>

            <Card>
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Fraud Detection</h3>
              <p className="text-gray-600">
                Advanced fraud detection keeps premiums low while protecting the insurance pool from bad actors.
              </p>
            </Card>

            <Card>
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Real-Time Monitoring</h3>
              <p className="text-gray-600">
                Monitor weather, AQI, and temperature disruptions in real-time for your city and nearby regions.
              </p>
            </Card>

            <Card>
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Affordable Plans</h3>
              <p className="text-gray-600">
                Starting from just ₹20/month for Basic coverage, scaled to your earnings and risk profile.
              </p>
            </Card>

            <Card>
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-bold mb-2">No Documentation</h3>
              <p className="text-gray-600">
                Unlike traditional insurance, no need to submit documents or prove losses for parametric claims.
              </p>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gray-50 py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center gradient-text">How It Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Register & Get Risk Profile</h3>
                  <p className="text-gray-700">
                    Tell us about your work (platform, city, earnings, hours). Our AI calculates your personalized risk score.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Choose Your Plan</h3>
                  <p className="text-gray-700">
                    Select Basic (₹20), Standard (₹35), or Premium (₹50) coverage based on your needs.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Monitor Disruptions</h3>
                  <p className="text-gray-700">
                    Our system tracks weather, AQI, and temperature 24/7 across all major cities.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Automatic Payout</h3>
                  <p className="text-gray-700">
                    When disruption is detected, your claim is filed and payout is processed instantly - no paperwork needed!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-pink-500 to-blue-600 text-white py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Protected?</h2>
            <p className="text-lg mb-8">
              Join thousands of gig workers who are already protected with GigClaimSafe.
            </p>
            <Link href="/onboarding">
              <button className="bg-white text-pink-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
                Start Free Registration Today
              </button>
            </Link>
          </div>
        </section>

        {/* Plans Preview */}
        <section className="max-w-6xl mx-auto py-20 px-4">
          <h2 className="text-4xl font-bold mb-12 text-center gradient-text">Our Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Basic',
                price: '₹20',
                coverage: '₹1,000',
                icon: '🔵',
              },
              {
                name: 'Standard',
                price: '₹35',
                coverage: '₹2,000',
                icon: '🟣',
                popular: true,
              },
              {
                name: 'Premium',
                price: '₹50',
                coverage: '₹3,500',
                icon: '🟡',
              },
            ].map((plan) => (
              <Card key={plan.name} className={plan.popular ? 'ring-2 ring-pink-500' : ''}>
                <div className="text-4xl mb-4">{plan.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {plan.name === 'Basic'
                    ? 'Perfect for occasional workers'
                    : plan.name === 'Standard'
                    ? 'Most popular choice'
                    : 'Maximum protection'}
                </p>
                <div className="mb-6">
                  <p className="text-gray-600 text-sm">From</p>
                  <p className="text-3xl font-bold">{plan.price}</p>
                  <p className="text-gray-600 text-sm">Coverage up to {plan.coverage}</p>
                </div>
                <Link href="/plans">
                  <button className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-pink-600 text-white hover:bg-pink-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                    View Details →
                  </button>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4">GigClaimSafe</h3>
                <p className="text-gray-400">Parametric insurance for gig delivery workers.</p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/onboarding"><span className="hover:text-white cursor-pointer">Register</span></Link></li>
                  <li><Link href="/plans"><span className="hover:text-white cursor-pointer">Plans</span></Link></li>
                  <li><Link href="/disruptions"><span className="hover:text-white cursor-pointer">Monitor</span></Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><span className="hover:text-white cursor-pointer">Contact Us</span></li>
                  <li><span className="hover:text-white cursor-pointer">FAQ</span></li>
                  <li><span className="hover:text-white cursor-pointer">Privacy Policy</span></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
              <p>&copy; 2024 GigClaimSafe. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
