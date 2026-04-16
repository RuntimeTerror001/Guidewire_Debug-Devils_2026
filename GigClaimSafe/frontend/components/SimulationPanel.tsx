'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronUp, CloudRain, Wind, Thermometer, X } from 'lucide-react';
import { api } from '../lib/api';

const triggers = [
  { label: 'Rain', type: 'RAIN', icon: CloudRain, threshold: 60 },
  { label: 'AQI', type: 'AQI', icon: Wind, threshold: 200 },
  { label: 'Heat', type: 'TEMP', icon: Thermometer, threshold: 42 },
];

export default function SimulationPanel() {
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState('Mumbai');
  const [type, setType] = useState('RAIN');
  const [loading, setLoading] = useState(false);

  const handleTrigger = async () => {
    setLoading(true);
    try {
      const trigger = triggers.find((item) => item.type === type);
      await api.adminTrigger({
        city,
        trigger_type: type,
        trigger_value: trigger?.threshold ?? 100,
        threshold: trigger?.threshold ?? 100,
      });
      toast.success('Disruption Triggered!');
    } catch (err) {
      toast.error('Unable to trigger disruption');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <button
        onClick={() => setOpen((state) => !state)}
        className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30 transition hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <ChevronUp className="h-6 w-6 rotate-180" />}
      </button>

      {open && (
        <div className="mt-4 w-80 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-surface">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Admin Simulation</p>
              <h3 className="text-xl font-semibold text-slate-950">Trigger a disruption</h3>
            </div>
          </div>

          <label className="block text-sm font-semibold text-slate-700">City</label>
          <select value={city} onChange={(event) => setCity(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500">
            {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad'].map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <label className="mt-4 block text-sm font-semibold text-slate-700">Trigger Type</label>
          <select value={type} onChange={(event) => setType(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-indigo-500">
            {triggers.map((item) => (
              <option key={item.type} value={item.type}>{item.label}</option>
            ))}
          </select>

          <button
            onClick={handleTrigger}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Triggering...' : 'Trigger Disruption'}
          </button>
        </div>
      )}
    </div>
  );
}
