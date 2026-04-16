'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Shield, FileText, DollarSign } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';
import DisruptionBanner from '../../components/DisruptionBanner';
import RiskBadge from '../../components/RiskBadge';
import StatCard from '../../components/StatCard';

const colorMap = {
  APPROVED: '#10b981',
  PENDING: '#fbbf24',
  REJECTED: '#ef4444',
};

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function DashboardPage() {
  const router = useRouter();
  const { user: authUser, isAuthenticated, loading: authLoading } = useAuth();
  const user = authUser;
  const [claims, setClaims] = useState<any[]>([]);
  const [monitor, setMonitor] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        setMonitor(monitorData.cities || []);
      })
      .catch((error) => {
        toast.error(error.message || 'Unable to load dashboard');
      })
      .finally(() => setLoading(false));
  }, [authUser, isAuthenticated, authLoading, router]);

  const userCityStatus = useMemo(() => monitor.find((city) => city.city === authUser?.city), [monitor, authUser]);
  const claimRows = useMemo(
    () => claims.map((claim) => ({
      ...claim,
      date: new Date(claim.filed_at).toLocaleDateString('en-IN'),
    })),
    [claims],
  );

  const barData = useMemo(() => {
    return Array.from({ length: 4 }, (_, index) => ({
      week: `W${index + 1}`,
      earnings: user?.weekly_earnings || 0,
      loss: Math.round((index + 1) * 120 * (index % 2 === 0 ? 1 : 0.7)),
    }));
  }, [user]);

  const pieData = useMemo(() => {
    const counts = { APPROVED: 0, PENDING: 0, REJECTED: 0 };
    claims.forEach((claim) => counts[claim.status]++);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [claims]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50">Loading dashboard…</div>;
  }

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-surface">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Good morning, {user?.name}</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950">{user?.platform} • {user?.city}</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">View plan</button>
            <button onClick={() => router.push('/claims')} className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">File a claim</button>
          </div>
        </div>
      </header>

      {userCityStatus?.status === 'ACTIVE' ? (
        <DisruptionBanner
          city={authUser.city}
          triggerType={userCityStatus.rain_prob > 60 ? 'Rain' : userCityStatus.aqi > 200 ? 'AQI' : 'Temperature'}
          value={userCityStatus.rain_prob || userCityStatus.aqi || userCityStatus.temperature}
          onClaim={() => router.push('/claims')}
        />
      ) : null}

      <section className="grid gap-6 xl:grid-cols-4">
        <StatCard title="Risk Score" value={user?.risk_score.toFixed(2)} subtitle="Current exposure level" icon={Shield} color="bg-indigo-600" />
        <StatCard title="Active Plan" value={user?.plan_type || 'None'} subtitle={`${user?.coverage_amount ? '₹' + user?.coverage_amount : 'No plan selected'}`} icon={FileText} color="bg-slate-600" />
        <StatCard title="Weekly Coverage" value={formatCurrency(user?.coverage_amount || 0)} subtitle="Max payable amount" icon={DollarSign} color="bg-emerald-600" />
        <StatCard title="Claims This Month" value={String(claims.length)} subtitle="Total claim activity" icon={FileText} color="bg-amber-500" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-surface">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Earnings vs Disruption Loss</p>
            </div>
            <p className="text-sm text-slate-500">Weekly snapshot</p>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="week" tick={{ fill: '#64748b' }} />
                <YAxis tick={{ fill: '#64748b' }} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="earnings" name="Earnings" fill="#4f46e5" radius={[10, 10, 0, 0]} />
                <Bar dataKey="loss" name="Loss" fill="#f59e0b" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-surface">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Claims Breakdown</p>
          <div className="mt-8 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={110} paddingAngle={4}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={colorMap[entry.name as keyof typeof colorMap]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-surface">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Recent Activity</p>
          <p className="text-sm text-slate-500">Latest 5 claims</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Fraud</th>
                <th className="px-4 py-4">Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {claimRows.slice(0, 5).map((claim) => (
                <tr key={claim.id}>
                  <td className="px-4 py-5 text-sm text-slate-700">{claim.date}</td>
                  <td className="px-4 py-5 text-sm font-semibold text-slate-900">{claim.status}</td>
                  <td className="px-4 py-5 text-sm text-slate-700">{claim.fraud_status}</td>
                  <td className="px-4 py-5 text-sm text-slate-700">{formatCurrency(claim.payout_amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
