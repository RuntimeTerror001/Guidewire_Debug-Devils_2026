'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';
import SimulationPanel from '../../components/SimulationPanel';

export default function MonitorPage() {
  const [monitor, setMonitor] = useState<any[]>([]);
  const [thresholds, setThresholds] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonitor = async () => {
      try {
        const data = await api.getMonitor();
        setMonitor(data.cities || []);
        setThresholds(data.thresholds || null);
      } catch (error: any) {
        toast.error(error.message || 'Unable to load monitor');
      } finally {
        setLoading(false);
      }
    };

    fetchMonitor();
    const interval = setInterval(fetchMonitor, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50">Loading monitor…</div>;
  }

  return (
    <div className="space-y-8 pb-24">
      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-surface">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Live Disruption Monitor</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-950">Real-time environmental conditions across all covered cities</h1>
      </header>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {monitor.map((city) => {
          const active = city.status === 'ACTIVE';
          return (
            <div key={city.city} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-surface">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{city.city}</p>
                  <p className="text-sm text-slate-400">{city.state}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${active ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {active ? '⚠️ Disruption Active' : '✅ Normal'}
                </span>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Rain Probability</p>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div style={{ width: `${city.rain_prob}%` }} className="h-full rounded-full bg-indigo-500" />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{city.rain_prob}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">AQI</p>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div style={{ width: `${Math.min(city.aqi, 300) / 3}%` }} className="h-full rounded-full bg-amber-500" />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{city.aqi}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Temperature</p>
                  <p className="text-slate-700 font-semibold">{city.temperature}°C</p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-surface">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Threshold Reference</p>
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-4">Condition</th>
                <th className="px-5 py-4">Normal</th>
                <th className="px-5 py-4">Warning</th>
                <th className="px-5 py-4">Critical</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Rain', '<40%', '40-60%', '>60%'],
                ['AQI', '<100', '100-200', '>200'],
                ['Temp', '10-40°', '40-42°', '>42°'],
              ].map(([condition, normal, warning, critical]) => (
                <tr key={condition} className="border-t border-slate-200">
                  <td className="px-5 py-4 font-semibold text-slate-900">{condition}</td>
                  <td className="px-5 py-4">{normal}</td>
                  <td className="px-5 py-4">{warning}</td>
                  <td className="px-5 py-4">{critical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <SimulationPanel />
    </div>
  );
}
