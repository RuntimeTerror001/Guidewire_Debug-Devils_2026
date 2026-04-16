import { FaCheckCircle, FaQrcode } from 'react-icons/fa';
import { useEffect, useState } from 'react';

export default function PayoutScreen({ data, onClose }) {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const pieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: ['#6366f1', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 4)]
    }));
    setConfetti(pieces);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-0">
      <div className="absolute inset-0 bg-[#0a0f1d]/90 backdrop-blur-2xl" onClick={onClose} />
      
      {/* Confetti Container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map((p) => (
          <div 
            key={p.id}
            className="confetti-piece"
            style={{ 
              left: `${p.left}%`, 
              animationDelay: `${p.delay}s`,
              backgroundColor: p.color
            }}
          />
        ))}
      </div>

      <div className="relative bg-[#1e293b] w-full max-w-sm rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in duration-500">
        <div className="bg-emerald-500 p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FaCheckCircle className="text-[12rem] -mr-12 -mt-12" />
          </div>
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-5xl" />
          </div>
          <h2 className="text-4xl font-black tracking-tighter mb-2">Payout Sent!</h2>
          <p className="text-white/80 font-bold uppercase tracking-widest text-xs">Instantly Transferred to UPI</p>
        </div>

        <div className="p-10 space-y-8">
          <div className="text-center">
            <p className="text-5xl font-black tracking-tighter text-white">₹{data.amount}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Total Recovery</p>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-bold uppercase">Transaction ID</span>
              <span className="text-white font-mono font-bold tracking-tight">{data.txnId}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-bold uppercase">Status</span>
              <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full font-black">PROCESSED</span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all text-sm uppercase tracking-widest"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
