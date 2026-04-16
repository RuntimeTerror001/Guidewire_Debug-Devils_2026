'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  FaShieldAlt, FaUsers, FaMoneyBillWave, FaChartPie, FaExclamationTriangle, 
  FaTerminal, FaSkullCrossbones, FaMicrochip, FaGlobe, FaSearch, FaUser,
  FaMapMarkerAlt, FaClock, FaRupeeSign, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import FraudBadge from '../../../components/FraudBadge';
import SimulationPanel from '../../../components/SimulationPanel';
import { api, AdminUser } from '../../../lib/api';

export default function AdminDashboard() {
  const [workers, setWorkers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAdminSetup = async () => {
      try {
        const response = await api.checkAdminExists();
        if (!response.admin_exists) {
          router.push('/auth/setup');
          return;
        }
      } catch (error) {
        console.error('Failed to check admin status:', error);
        router.push('/auth/setup');
        return;
      }
    };

    const fetchWorkers = async () => {
      try {
        const data = await api.adminGetWorkers();
        setWorkers(data);
      } catch (error) {
        console.error('Failed to fetch workers:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminSetup();
    fetchWorkers();
  }, [router]);

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = [
    { name: '00:00', claims: 12, fraud: 2 },
    { name: '04:00', claims: 8, fraud: 1 },
    { name: '08:00', claims: 45, fraud: 5 },
    { name: '12:00', claims: 85, fraud: 12 },
    { name: '16:00', claims: 65, fraud: 8 },
    { name: '20:00', claims: 50, fraud: 4 },
  ];

  return (
    <div className="min-h-screen bg-[#050810] text-[#94a3b8] selection:bg-indigo-500/30">
      <SimulationPanel />

      {/* Industrial Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 lg:w-72 border-r border-white/5 bg-[#0a0f1d] flex flex-col z-[100]">
        <div className="p-8 mb-10 border-b border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <FaTerminal className="text-xl" />
          </div>
          <span className="font-heading font-black text-white text-2xl italic tracking-tighter hidden lg:block">COMMAND</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { label: 'Infrastructure', icon: <FaGlobe />, active: true },
            { label: 'Fraud Engine', icon: <FaSkullCrossbones /> },
            { label: 'Risk Models', icon: <FaMicrochip /> },
            { label: 'Network', icon: <FaShieldAlt /> },
            { label: 'Underwriting', icon: <FaUsers /> },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all ${item.active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/10' : 'hover:bg-white/5 hover:text-white'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className="font-black text-[10px] uppercase tracking-widest hidden lg:block">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 p-1">
              <div className="w-full h-full bg-slate-800 rounded-full" />
            </div>
            <div className="hidden lg:block">
              <p className="text-[10px] font-black uppercase text-white tracking-widest leading-none mb-1">Oper: ADM-902</p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Sys-Priv: ROOT</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-20 lg:ml-72 p-8 lg:p-12">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-16">
          <div>
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-indigo-400 font-black text-[8px] uppercase tracking-widest mb-4">
              SEC_LEVEL: 10/10 • REGION: GLOBAL_SOUTH
            </div>
            <h1 className="text-5xl font-heading font-black tracking-tighter text-white mb-2 italic uppercase">System Integrity Over-watch</h1>
            <p className="font-bold text-sm tracking-tight text-slate-500">Continuous risk-modeling of urban disruption events across 12,400 grid points.</p>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <input 
                className="bg-slate-900/50 border border-white/5 rounded-2xl pl-12 pr-6 py-3 text-xs w-full lg:w-64 focus:border-indigo-500/50 outline-none transition-all" 
                placeholder="Search workers..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-white text-black font-black text-[10px] px-8 py-3 rounded-2xl uppercase tracking-widest hover:bg-slate-200 transition-all">Export Logs</button>
          </div>
        </header>

        {/* Global KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Active Liabilities', val: '₹42,85,900', icon: <FaMoneyBillWave />, sub: '+12.4% vs last 24h' },
            { label: 'Node Integrity', val: '99.98%', icon: <FaShieldAlt />, sub: 'All clusters optimal' },
            { label: 'Risk Surface', val: '45.2 km²', icon: <FaGlobe />, sub: 'Mumbai, Delhi Active' },
            { label: 'Fraud Intercept', val: '₹8,25,000', icon: <FaSkullCrossbones />, sub: '24 events blocked' },
          ].map((kpi, i) => (
            <div key={i} className="admin-card p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors text-6xl">
                {kpi.icon}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#64748b] mb-4">{kpi.label}</p>
              <h3 className="text-3xl font-heading font-black text-white italic tracking-tighter mb-2">{kpi.val}</h3>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Performance Mesh */}
          <div className="lg:col-span-2 admin-card p-10 rounded-[2.5rem]">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Throughput Analytics</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Claims</div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase"><span className="w-2 h-2 rounded-full bg-red-500" /> Fraud</div>
              </div>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="adminGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 900}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 900}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '12px', fontSize: '10px' }}
                    itemStyle={{ fontWeight: 900, textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="claims" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#adminGradient)" />
                  <Area type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Risk Stack */}
          <div className="admin-card p-10 rounded-[2.5rem]">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-10">Risk Propagation</h3>
            <div className="space-y-8">
              {[
                { city: 'Mumbai', value: 92, status: 'CRITICAL' },
                { city: 'Delhi', value: 65, status: 'WARNING' },
                { city: 'Bangalore', value: 12, status: 'OPTIMAL' },
                { city: 'Chennai', value: 8, status: 'OPTIMAL' },
              ].map((region, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-tight italic">{region.city}</p>
                      <p className={`text-[8px] font-black uppercase tracking-widest ${region.value > 80 ? 'text-red-500' : 'text-slate-500'}`}>{region.status}</p>
                    </div>
                    <span className="text-[10px] font-black font-mono text-slate-500">{region.value}/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${region.value > 80 ? 'bg-red-500' : region.value > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${region.value}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 p-6 glass rounded-2xl border-white/5 bg-red-500/5">
              <p className="text-[10px] font-black uppercase text-red-500 tracking-widest mb-2 flex items-center gap-2">
                <FaExclamationTriangle className="animate-pulse" /> Automatic Halt Trigger
              </p>
              <p className="text-[10px] font-bold text-slate-500 leading-relaxed">System will auto-reject low-confidence claims if liability exceeds ₹5M in single region.</p>
            </div>
          </div>
        </div>

        {/* Intelligence Ledger */}
        <div className="admin-card rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
            <div className="flex items-center gap-4">
              <FaTerminal className="text-indigo-500" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Fraud Forensics Hub</h3>
            </div>
            <div className="flex gap-4">
              <span className="text-[9px] font-black border border-white/10 px-3 py-1 rounded-full text-slate-500 uppercase">Live: 1,420 PPS</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-black/40 border-b border-white/5">
                  <th className="px-8 py-6">Trace ID</th>
                  <th className="px-8 py-6">Subject Node</th>
                  <th className="px-8 py-6">Anomaly Type</th>
                  <th className="px-8 py-6">Integrity Score</th>
                  <th className="px-8 py-6">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/10">
                {[
                  { id: 'TRC-9201', node: 'MUM-801', anomaly: 'GPS_SPOOF', score: 0.12, result: 'BLOCKED' },
                  { id: 'TRC-9244', node: 'DEL-202', anomaly: 'VELOCITY', score: 0.35, result: 'SUSPENDED' },
                  { id: 'TRC-9252', node: 'MUM-901', anomaly: 'CLEAN', score: 0.98, result: 'PROCESSED' },
                  { id: 'TRC-9261', node: 'BLR-102', anomaly: 'CLEAN', score: 0.99, result: 'PROCESSED' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6 font-mono text-[10px] font-black text-indigo-400">{row.id}</td>
                    <td className="px-8 py-6 font-black text-xs text-white uppercase tracking-tighter">{row.node}</td>
                    <td className="px-8 py-6">
                      <FraudBadge status={row.anomaly as 'CLEAN' | 'SUSPICIOUS' | 'BLOCKED'} />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <span className="font-black font-mono text-[10px] text-white">{(row.score * 100).toFixed(0)}%</span>
                        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${row.score > 0.8 ? 'bg-emerald-500' : row.score > 0.4 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${row.score * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black tracking-widest ${row.result === 'BLOCKED' ? 'bg-red-500/10 text-red-500' : row.result === 'PROCESSED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-400'}`}>
                        {row.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workers Management Hub */}
        <div className="admin-card rounded-[2.5rem] overflow-hidden mt-12">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
            <div className="flex items-center gap-4">
              <FaUsers className="text-indigo-500" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Worker Network Control</h3>
            </div>
            <div className="flex gap-4">
              <span className="text-[9px] font-black border border-white/10 px-3 py-1 rounded-full text-slate-500 uppercase">
                Total: {workers.length} Nodes
              </span>
              <span className="text-[9px] font-black border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-500 uppercase">
                Active: {workers.filter(w => w.is_active).length}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-500 text-sm">Loading worker network...</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-black/40 border-b border-white/5">
                    <th className="px-8 py-6">Worker ID</th>
                    <th className="px-8 py-6">Identity</th>
                    <th className="px-8 py-6">Platform</th>
                    <th className="px-8 py-6">Location</th>
                    <th className="px-8 py-6">Risk Profile</th>
                    <th className="px-8 py-6">Activity</th>
                    <th className="px-8 py-6">Financial</th>
                    <th className="px-8 py-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-black/10">
                  {filteredWorkers.map((worker) => (
                    <tr key={worker.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6 font-mono text-[10px] font-black text-indigo-400">
                        WKR-{worker.id.toString().padStart(4, '0')}
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <p className="font-black text-xs text-white uppercase tracking-tighter">{worker.name}</p>
                          <p className="text-[9px] font-bold text-slate-500">{worker.email}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                          {worker.platform}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-slate-600 text-xs" />
                          <span className="font-black text-xs text-white uppercase tracking-tighter">{worker.city}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-black font-mono text-[10px] text-white">
                              {(worker.risk_score * 100).toFixed(0)}%
                            </span>
                            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  worker.risk_score > 0.7 ? 'bg-red-500' : 
                                  worker.risk_score > 0.4 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${worker.risk_score * 100}%` }} 
                              />
                            </div>
                          </div>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                            worker.risk_label === 'High' ? 'bg-red-500/10 text-red-500' :
                            worker.risk_label === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {worker.risk_label}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FaClock className="text-slate-600 text-xs" />
                            <span className="font-black text-[10px] text-white">{worker.work_hours}h/week</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-slate-500">
                              {worker.total_claims} claims • ₹{worker.total_payouts.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FaRupeeSign className="text-emerald-500 text-xs" />
                            <span className="font-black text-[10px] text-white">
                              ₹{worker.weekly_earnings.toLocaleString()}/week
                            </span>
                          </div>
                          {worker.active_policy && (
                            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
                              {worker.active_policy}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          {worker.is_active ? (
                            <FaCheckCircle className="text-emerald-500" />
                          ) : (
                            <FaTimesCircle className="text-red-500" />
                          )}
                          <span className={`text-[9px] font-black uppercase tracking-widest ${
                            worker.is_active ? 'text-emerald-500' : 'text-red-500'
                          }`}>
                            {worker.is_active ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
