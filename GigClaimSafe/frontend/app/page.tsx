import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Activity, MapPin } from 'lucide-react';

const stats = [
  { label: 'Workers Eligible', value: '12M+', detail: 'Modern gig workers covered' },
  { label: '₹0 Manual Claims', value: 'Automated claims', detail: 'Paperless and instant' },
  { label: '< 5 sec Payout', value: 'Fast UPI transfer', detail: 'Immediate settlement' },
  { label: '8 Cities Covered', value: 'Hyperlocal risk', detail: 'Mumbai to Ahmedabad' },
];

const plans = [
  {
    name: 'Basic',
    price: '₹20/week',
    coverage: '₹1,000',
    features: ['Rain disruption coverage', 'AQI coverage', 'Heat coverage', 'Instant UPI payout', 'Fraud protection'],
  },
  {
    name: 'Standard',
    price: '₹35/week',
    coverage: '₹2,000',
    features: ['Rain disruption coverage', 'AQI coverage', 'Heat coverage', 'Instant UPI payout', 'Fraud protection', 'Priority processing'],
    popular: true,
  },
  {
    name: 'Premium',
    price: '₹50/week',
    coverage: '₹3,500',
    features: ['Rain disruption coverage', 'AQI coverage', 'Heat coverage', 'Instant UPI payout', 'Fraud protection', 'Priority processing', '24/7 support'],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-7xl px-8 pt-10">
        <header className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              Parametric payouts for gig delivery workers
            </div>
            <div className="max-w-2xl space-y-6">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Your Earnings. Protected. Automatically.</h1>
              <p className="text-xl text-slate-600">Parametric insurance built for 12M+ delivery workers in India with live disruption detection, fraud intelligence, and instant UPI payout.</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/onboard" className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">
              Get Protected <ArrowRight className="ml-3 h-4 w-4" />
            </Link>
            <Link href="/dashboard" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-50">
              View Demo
            </Link>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-20">
          {stats.map((item) => (
            <div key={item.label} className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-surface">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
              <p className="mt-4 text-4xl font-bold text-slate-950">{item.value}</p>
              <p className="mt-3 text-sm text-slate-500">{item.detail}</p>
            </div>
          ))}
        </section>

        <section className="rounded-[2rem] bg-white p-10 shadow-surface mb-20">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">How it works</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">Three steps to protected income</h2>
            </div>
            <p className="text-sm text-slate-500">Auto-detect disruptions, validate claims, and settle through UPI.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { icon: <MapPin className="h-6 w-6 text-indigo-600" />, title: 'Register in 60 seconds', description: 'Add your profile, city, earnings and UPI to lock in coverage.' },
              { icon: <Activity className="h-6 w-6 text-indigo-600" />, title: 'Disruption auto-detected', description: 'Real-time rain, AQI and temperature feeds trigger eligible claims.' },
              { icon: <Sparkles className="h-6 w-6 text-indigo-600" />, title: 'Money in UPI instantly', description: 'Approved claims settle directly to your account with no paperwork.' },
            ].map((step) => (
              <div key={step.title} className="rounded-3xl border border-slate-200 p-6">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">{step.icon}</div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-3 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Plans</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">Choose your protection plan</h2>
            </div>
            <p className="text-sm text-slate-500">Every plan is optimized for gig earnings and fast digital payouts.</p>
          </div>
          <div className="grid gap-6 xl:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-[2rem] border p-8 shadow-sm ${plan.popular ? 'border-indigo-500/20 bg-indigo-50' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-950">{plan.name}</h3>
                    {plan.popular && <span className="mt-2 inline-flex rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">Most Popular</span>}
                  </div>
                  <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{plan.price}</div>
                </div>
                <p className="mt-7 text-3xl font-bold text-slate-950">{plan.coverage}</p>
                <ul className="mt-8 space-y-4 text-slate-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/plans" className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-indigo-700">
                  Activate Plan
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
