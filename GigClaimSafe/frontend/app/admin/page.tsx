'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [fraudLog, setFraudLog] = useState<any[]>([]);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.adminStats(), api.adminFraudLog(), api.adminForecast()])
      .then(([statsData, fraudData, forecastData]) => {
        setStats(statsData);
        setFraudLog(fraudData);
        setForecast(forecastData);
      })
      .catch((error: any) => toast.error(error.message || 'Unable to load admin dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50">Loading admin panel…</div>;
  }

  return (
    <div className="space-y-8 pb-24">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-surface">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Admin Operations</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-950">Platform health & fraud oversight</h1>
        <p className="mt-3 text-slate-600">Review active policies, payouts, and suspicious claims across the network.</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-4">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-surface">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Workers enrolled</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950">{stats?.total_workers || 0}</p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-surface">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Active policies</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950">{stats?.active_policies || 0}</p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-surface">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Premium collected</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950">{stats ? formatCurrency(stats.premium_collected) : '₹0'}</p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-surface">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Loss ratio</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950">{stats?.loss_ratio || 0}%</p>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-surface">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">Forecast</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Disruption risk by city</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Live feed</span>
          </div>
          <div className="space-y-4">
            {forecast.map((item) => (
              <div key={item.city} className="rounded-3xl border border-slate-200 p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-slate-900">{item.city}</p>
                  <span className="text-sm text-slate-500">{item.disruption_risk}</span>
                </div>
                <div className="mt-3 text-sm text-slate-600">Expected claims: {item.expected_claims}</div>
                <div className="mt-2 text-sm text-slate-600">Estimated liability: {formatCurrency(item.estimated_liability)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-surface">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">Fraud ledger</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Suspicious claims</h2>
            </div>
            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">Alerts</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-[0.2em] text-[12px]">
                <tr>
                  <th className="px-4 py-4">Claim ID</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Fraud score</th>
                  <th className="px-4 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {fraudLog.map((claim) => (
                  <tr key={claim.id}>
                    <td className="px-4 py-4 font-mono text-slate-900">{claim.id}</td>
                    <td className="px-4 py-4 font-semibold text-slate-900">{claim.fraud_status}</td>
                    <td className="px-4 py-4 text-slate-700">{(claim.fraud_score * 100).toFixed(0)}%</td>
                    <td className="px-4 py-4 text-slate-500">{new Date(claim.filed_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
