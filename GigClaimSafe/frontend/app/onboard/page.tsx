'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';
import RiskBadge from '../../components/RiskBadge';

const platforms = ['Swiggy', 'Zomato', 'Blinkit', 'Zepto', 'Dunzo', 'Other'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad'];

export default function OnboardPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', name: '', platform: '', city: '', weekly_earnings: '', work_hours: '', upi_id: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [riskBreakdown, setRiskBreakdown] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const formattedPremium = useMemo(() => {
    return profile ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(profile.risk_score * 10000) : '';
  }, [profile]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.email.trim()) nextErrors.email = 'Email is required';
    if (!form.password || form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    if (!form.name.trim()) nextErrors.name = 'Full name is required';
    if (!form.platform) nextErrors.platform = 'Select a platform';
    if (!form.city) nextErrors.city = 'Select a city';
    if (!form.weekly_earnings || Number(form.weekly_earnings) <= 0) nextErrors.weekly_earnings = 'Enter a valid amount';
    if (!form.work_hours || Number(form.work_hours) <= 0) nextErrors.work_hours = 'Enter work hours';
    if (!form.upi_id.trim()) nextErrors.upi_id = 'UPI ID is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.register({
        email: form.email,
        password: form.password,
        name: form.name,
        platform: form.platform,
        city: form.city,
        weekly_earnings: Number(form.weekly_earnings),
        work_hours: Number(form.work_hours),
        upi_id: form.upi_id,
      });
      localStorage.setItem('authToken', response.access_token);
      setProfile(response.user);
      toast.success('Registration successful! Welcome to GigClaimSafe!');
      setTimeout(() => router.push('/dashboard'), 500);
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-64px)] gap-10 xl:grid-cols-[1.3fr_1fr]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-surface">
        <div className="mb-8 space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Register Worker</p>
          <h1 className="text-3xl font-bold text-slate-950">Get protected in under a minute</h1>
          <p className="text-slate-600">Sign up with your details and receive an instant risk score with plan recommendations.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              Email
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500" />
              {errors.email ? <p className="text-xs text-red-600">{errors.email}</p> : null}
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Password
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500" />
              {errors.password ? <p className="text-xs text-red-600">{errors.password}</p> : null}
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              Full Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500" />
              {errors.name ? <p className="text-xs text-red-600">{errors.name}</p> : null}
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Delivery Platform
              <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500">
                <option value="">Select platform</option>
                {platforms.map((platform) => <option key={platform} value={platform}>{platform}</option>)}
              </select>
              {errors.platform ? <p className="text-xs text-red-600">{errors.platform}</p> : null}
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              City
              <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500">
                <option value="">Select city</option>
                {cities.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
              {errors.city ? <p className="text-xs text-red-600">{errors.city}</p> : null}
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Weekly Earnings
              <input type="number" value={form.weekly_earnings} onChange={(e) => setForm({ ...form, weekly_earnings: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500" />
              {errors.weekly_earnings ? <p className="text-xs text-red-600">{errors.weekly_earnings}</p> : null}
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              Work Hours per Week
              <input type="number" value={form.work_hours} onChange={(e) => setForm({ ...form, work_hours: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500" />
              {errors.work_hours ? <p className="text-xs text-red-600">{errors.work_hours}</p> : null}
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              UPI ID
              <input value={form.upi_id} onChange={(e) => setForm({ ...form, upi_id: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500" />
              {errors.upi_id ? <p className="text-xs text-red-600">{errors.upi_id}</p> : null}
            </label>
          </div>

          <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Registering...' : 'Submit and View Risk'}
          </button>
        </form>
      </section>

      <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-surface">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Why register?</p>
          <ul className="space-y-4 text-slate-600">
            {['Secure your income with parametric cover', 'Instant claim eligibility with no paperwork', 'Real-time fraud protection on every payout'].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {profile ? (
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Risk profile</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{profile.name}</p>
                <p className="text-sm text-slate-500">{profile.platform} • {profile.city}</p>
              </div>
              <RiskBadge label={profile.risk_label} score={profile.risk_score} />
            </div>
            <div className="mt-8 rounded-[1.5rem] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="text-sm text-slate-500">Risk Score</p>
                <p className="text-3xl font-semibold text-slate-950">{profile.risk_score.toFixed(2)}</p>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700" style={{ width: `${profile.risk_score * 100}%` }} />
              </div>
              <div className="mt-6 space-y-3 text-sm text-slate-600">
                {riskBreakdown && Object.entries(riskBreakdown).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span>{key}</span>
                    <span>{value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => router.push('/plans')} className="mt-6 w-full rounded-xl bg-indigo-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-indigo-700">
              Choose a Plan →
            </button>
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-slate-600">
            <p className="text-sm font-semibold text-slate-950">Start registration to see your risk profile.</p>
            <p className="mt-3 text-sm">A strong score helps you pick the right plan for your city and earnings.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
