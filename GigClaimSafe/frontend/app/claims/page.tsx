'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';
import FraudBadge from '../../components/FraudBadge';

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function ClaimsPage() {
  const router = useRouter();
  const { user: authUser, isAuthenticated, loading: authLoading } = useAuth();
  const [claims, setClaims] = useState<any[]>([]);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ upi: '', lat: '', lng: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (authUser?.role === 'admin') {
      router.push('/dashboard/admin');
      return;
    }

    // Load worker data
    Promise.all([api.getClaims(authUser.id), api.getMonitor()])
      .then(([claimsData, monitorData]) => {
        setClaims(claimsData);
        setActiveCity(monitorData.cities.find((city: any) => city.city === authUser.city && city.status === 'ACTIVE')?.city || null);
        setForm((current) => ({ ...current, upi: authUser.upi_id }));
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            setForm({ upi: authUser.upi_id, lat: position.coords.latitude.toFixed(4), lng: position.coords.longitude.toFixed(4) });
          });
        }
      })
      .catch((error) => toast.error(error.message || 'Unable to load claims'))
      .finally(() => setLoading(false));
  }, [router, authUser, isAuthenticated, authLoading]);

  const activeDisruption = useMemo(() => activeCity !== null, [activeCity]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authUser) return;
    if (!form.lat || !form.lng) {
      toast.error('Provide latitude and longitude');
      return;
    }

    setSubmitting(true);
    try {
      await api.triggerClaim({ user_id: authUser.id, lat: Number(form.lat), lng: Number(form.lng) });
      toast.success('Claim submitted. Redirecting to payout history...');
      const payouts = await api.getPayouts(authUser.id);
      const recent = payouts[0];
      if (recent) {
        window.sessionStorage.setItem('lastPayout', JSON.stringify(recent));
      }
      router.push('/payout');
    } catch (error: any) {
      toast.error(error.message || 'Claim submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50">Loading claims…</div>;
  }

  return (
    <div className="space-y-8 pb-24">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-surface">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">My Claims</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-950">View your claim journey</h1>
      </header>

      {activeDisruption ? (
        <div className="rounded-[2rem] border border-slate-200 bg-emerald-50 p-8 shadow-surface">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Disruption Active in {authUser.city}</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">You are eligible for a claim</h2>
            </div>
            <div className="rounded-3xl bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm">
              Active city: {authUser.city}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-6 md:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-700">
              UPI ID
              <input value={form.upi} readOnly className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Latitude
              <input value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Longitude
              <input value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500" />
            </label>
            <button type="submit" disabled={submitting} className="mt-4 rounded-xl bg-indigo-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-3">
              {submitting ? 'Submitting claim…' : 'Submit Claim'}
            </button>
          </form>
        </div>
      ) : (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-surface">
          <p className="text-sm font-medium text-slate-600">No active disruption in your city at the moment.</p>
          <p className="mt-4 text-slate-500">Check the Disruption Monitor to see live status and eligible claim notifications.</p>
        </div>
      )}

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-surface">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Recent claims</p>
          <p className="text-sm text-slate-500">All activity for your account</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Plan</th>
                <th className="px-4 py-4">Payout</th>
                <th className="px-4 py-4">Fraud</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {claims.map((claim) => (
                <tr key={claim.id}>
                  <td className="px-4 py-4">{new Date(claim.filed_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-4">{authUser.plan_type || 'N/A'}</td>
                  <td className="px-4 py-4">{formatCurrency(claim.payout_amount)}</td>
                  <td className="px-4 py-4"><FraudBadge status={claim.fraud_status} flags={claim.fraud_flags} /></td>
                  <td className="px-4 py-4 font-semibold text-slate-900">{claim.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
