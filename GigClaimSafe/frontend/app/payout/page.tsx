'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function PayoutPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem('gigclaimsafe_user');
    if (!stored) {
      router.push('/onboard');
      return;
    }
    const id = Number(stored);
    setUserId(id);
    api.getPayouts(id)
      .then(setPayouts)
      .catch((error: any) => toast.error(error.message || 'Unable to load payouts'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50">Loading payouts…</div>;
  }

  return (
    <div className="space-y-8 pb-24">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-surface">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">UPI Payout History</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-950">Verify your settlement timeline</h1>
        <p className="mt-3 text-slate-600">All approved claims are settled instantly via UPI and tracked here.</p>
      </header>

      {payouts.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-surface text-center">
          <p className="text-xl font-semibold text-slate-950">No payouts found yet.</p>
          <p className="mt-3 text-slate-600">Submit a claim from the Claims page to trigger your first payout.</p>
          <button onClick={() => router.push('/claims')} className="mt-8 rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white transition hover:bg-indigo-700">
            File a claim
          </button>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          {payouts.slice(0, 3).map((payout) => (
            <div key={payout.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-surface">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{new Date(payout.initiated_at).toLocaleDateString('en-IN')}</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950">{formatCurrency(payout.amount)}</h2>
              <p className="mt-3 text-slate-600">Txn ID: <span className="font-mono text-slate-900">{payout.txn_id}</span></p>
              <p className="mt-2 text-sm text-slate-500">Status: <span className="font-semibold text-slate-900">{payout.status}</span></p>
              <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                Payout settled to your linked UPI account automatically.
              </div>
            </div>
          ))}
        </div>
      )}

      {payouts.length > 0 && (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-surface">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Full payout ledger</p>
            <button onClick={() => router.push('/claims')} className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
              Review claims
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Txn ID</th>
                  <th className="px-4 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payouts.map((payout) => (
                  <tr key={payout.id}>
                    <td className="px-4 py-4">{new Date(payout.initiated_at).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-4">{formatCurrency(payout.amount)}</td>
                    <td className="px-4 py-4 font-mono text-slate-900">{payout.txn_id}</td>
                    <td className="px-4 py-4 font-semibold text-slate-900">{payout.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
