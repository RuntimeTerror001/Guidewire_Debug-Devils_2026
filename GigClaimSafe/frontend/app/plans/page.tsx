'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';

const planIcons = {
  Basic: 'bg-slate-100 text-slate-900',
  Standard: 'bg-indigo-100 text-indigo-700',
  Premium: 'bg-emerald-100 text-emerald-700',
};

export default function PlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem('gigclaimsafe_user');
    if (!stored) {
      router.push('/onboard');
      return;
    }
    setUserId(Number(stored));
    api.getPlans().then(setPlans).catch(() => toast.error('Unable to fetch plans'));
  }, [router]);

  const handleSelect = async (planType: string) => {
    if (!userId) return;
    setLoading(true);
    try {
      await api.selectPlan({ user_id: userId, plan_type: planType });
      toast.success(`${planType} plan activated`);
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Plan activation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-surface">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Choose Your Protection Plan</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-950">Select a plan that fits your earnings.</h1>
      </header>
      <div className="grid gap-6 xl:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.plan_type} className={`rounded-[2rem] border p-8 shadow-sm ${plan.popular ? 'border-indigo-500/20 bg-indigo-50' : 'border-slate-200 bg-white'}`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{plan.plan_type}</p>
                {plan.popular && <span className="mt-3 inline-flex rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-semibold uppercase text-indigo-700">Most Popular</span>}
              </div>
              <div className={`rounded-3xl px-4 py-2 text-sm font-semibold ${planIcons[plan.plan_type]}`}>
                {plan.price}
              </div>
            </div>
            <p className="mt-8 text-3xl font-semibold text-slate-950">{plan.coverage_amount ? `₹${plan.coverage_amount}` : plan.coverage}</p>
            <ul className="mt-8 space-y-4 text-slate-600">
              {plan.features.map((feature: string) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => handleSelect(plan.plan_type)} disabled={loading} className="mt-8 w-full rounded-xl bg-indigo-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
              Activate Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
