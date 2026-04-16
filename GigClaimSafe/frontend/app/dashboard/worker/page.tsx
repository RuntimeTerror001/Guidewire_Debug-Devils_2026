'use client';
import { useState, useEffect } from 'react';
import DisruptionBanner from '../../../components/DisruptionBanner';
import PayoutScreen from '../../../components/PayoutScreen';
import { FaShieldAlt, FaBriefcase, FaWallet, FaCheckCircle, FaExclamationTriangle, FaChartLine, FaHistory, FaUserCircle, FaRocket } from 'react-icons/fa';

export default function WorkerDashboard() {
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [success, setSuccess] = useState(null);
  const [disruption, setDisruption] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisruption({ id: 102, type: 'RAIN', reason: 'Flash Flood Risk: Mumbai Ward 7', amount: 285 });
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleClaim = () => {
    setClaiming(true);
    setTimeout(() => {
      setClaiming(false);
      setSuccess({ amount: 285, txnId: 'GCS-' + Math.random().toString(36).substring(4).toUpperCase() });
      setDisruption(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#050810] text-slate-200">
      {/* Premium Header */}
      <header className="px-8 py-8 border-b border-white/5 bg-[#0a0f1d]/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <FaShieldAlt className="text-2xl" />
            </div>
            <div>
              <h1 className="font-heading font-black text-2xl tracking-tighter">PORTAL</h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Live Infrastructure</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="font-black text-sm text-white">Rahul Sahni</p>
              <p className="text-[10px] uppercase font-black text-[#94a3b8]">Coverage ID: #GCS-9021</p>
            </div>
            <div className="w-12 h-12 bg-slate-800 rounded-2xl border border-white/10 flex items-center justify-center text-2xl text-slate-500">
              <FaUserCircle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 relative">
        {/* Animated Banner Container */}
        <div className="mb-12">
          {disruption && <DisruptionBanner city="Mumbai" triggerType={disruption.type} value={disruption.amount} onClaim={handleClaim} />}
        </div>

        {/* Global Overlays */}
        {claiming && (
          <div className="fixed inset-0 z-[200] bg-[#050810]/90 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="relative w-32 h-32 mb-12">
              <div className="absolute inset-0 border-8 border-indigo-500/10 rounded-full" />
              <div className="absolute inset-0 border-8 border-t-indigo-500 rounded-full animate-spin" />
            </div>
            <h2 className="text-4xl font-heading font-black tracking-tighter mb-4 text-white">RECONCILIATION</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Running Multi-Factor Integrity Checks...</p>
          </div>
        )}
        {success && <PayoutScreen data={success} onClose={() => setSuccess(null)} />}

        {/* Dashboard Grid (Bento) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Main Earnings Card */}
          <div className="lg:col-span-2 glass p-10 rounded-[3.5rem] relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-all duration-700" />
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Earnings Protection</p>
                <h3 className="text-6xl font-heading font-black tracking-tighter text-white">₹1,250</h3>
              </div>
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-indigo-500 text-2xl animate-float">
                <FaWallet />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Recovered (May)</p>
                <p className="text-2xl font-black text-white">₹850</p>
              </div>
              <div className="bg-indigo-600/5 border border-indigo-500/10 p-6 rounded-3xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">Active Cap</p>
                <p className="text-2xl font-black text-white">₹3,500</p>
              </div>
            </div>
          </div>

          {/* Risk Intelligence Card */}
          <div className="glass p-10 rounded-[3.5rem] flex flex-col justify-between overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8">Risk Intelligence</h3>
            <div>
              <p className="text-5xl font-heading font-black tracking-tighter text-white mb-2">98.2%</p>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                <div className="h-full w-[98%] bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Trust Integrity Verified</p>
            </div>
          </div>

          {/* Status/Badge Card */}
          <div className="glass p-10 rounded-[3.5rem] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-[2rem] bg-indigo-600/20 text-indigo-500 flex items-center justify-center text-4xl mb-6 shadow-glow">
              <FaCheckCircle />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-[#94a3b8] mb-2">Coverage Tier</p>
            <p className="text-2xl font-heading font-black text-white italic tracking-widest">GOLD</p>
          </div>
        </div>

        {/* Secondary Info Layer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Recent Claims Feed */}
          <div className="md:col-span-2 glass p-10 rounded-[3.5rem]">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Session Ledger</h3>
              <button className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">Download Report</button>
            </div>
            <div className="space-y-6">
              {[
                { title: 'Monsoon Disruption Recovery', date: 'MAY 12, 2024', status: 'PAID', amount: '+ ₹285' },
                { title: 'Weekly Coverage Renewal', date: 'MAY 10, 2024', status: 'AUTO', amount: '- ₹75' },
                { title: 'Heatwave Support Credit', date: 'MAY 05, 2024', status: 'PAID', amount: '+ ₹150' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer border-b border-white/5 pb-6 last:border-0 last:pb-0">
                  <div className="flex gap-6 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-600/10 group-hover:text-indigo-500 transition-all">
                      <FaHistory className="text-slate-500 group-hover:text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-black text-white group-hover:text-indigo-300 transition-colors tracking-tight">{item.title}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black tracking-tighter text-xl ${item.amount.startsWith('+') ? 'text-emerald-500' : 'text-slate-300'}`}>{item.amount}</p>
                    <span className="text-[9px] font-black tracking-widest text-slate-500">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Trend Chart (Decorative/Small) */}
          <div className="glass p-10 rounded-[3.5rem] flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-2">Earnings Trend</h3>
              <p className="text-xs text-emerald-500 font-bold tracking-tight">+14% vs Last Week</p>
            </div>
            <div className="h-48 flex items-end gap-1 px-4">
              {[40, 70, 45, 90, 65, 80, 50, 60, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-600/20 rounded-t-lg relative group overflow-hidden">
                  <div className="absolute bottom-0 w-full bg-indigo-500 group-hover:bg-indigo-400 transition-all duration-1000" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
            <p className="text-[10px] font-black uppercase text-center text-slate-600 tracking-widest">Historical Performance</p>
          </div>
        </div>

        {/* Navigation/Action Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'File Claim', icon: <FaBriefcase />, color: 'slate' },
            { label: 'Audit Log', icon: <FaHistory />, color: 'slate' },
            { label: 'Intelligence', icon: <FaChartLine />, color: 'slate' },
            { label: 'Upgrade Coverage', icon: <FaShieldAlt />, color: 'indigo' },
          ].map((action, i) => (
            <button key={i} className={`p-10 rounded-[3rem] border border-white/5 transition-all group relative overflow-hidden flex flex-col items-center gap-6 ${action.color === 'indigo' ? 'bg-indigo-600 shadow-2xl shadow-indigo-600/20' : 'glass hover:bg-white/5'}`}>
              <div className={`text-4xl ${action.color === 'indigo' ? 'text-white' : 'text-indigo-500 group-hover:scale-110 transition-transform'}`}>
                {action.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${action.color === 'indigo' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                {action.label}
              </span>
              {action.color === 'indigo' && <div className="absolute top-0 right-0 p-4 opacity-10"><FaRocket className="text-6xl -rotate-45" /></div>}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
