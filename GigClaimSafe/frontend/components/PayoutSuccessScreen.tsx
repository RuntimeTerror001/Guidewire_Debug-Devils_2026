'use client';

interface PayoutSuccessScreenProps {
  amount: number;
  upiId: string;
  txnId: string;
  onClose: () => void;
}

export default function PayoutSuccessScreen({ amount, upiId, txnId, onClose }: PayoutSuccessScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-6 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-5xl text-emerald-600">✓</div>
        <h2 className="text-4xl font-bold text-slate-950">Payment Successful!</h2>
        <p className="mt-4 text-slate-600">Your payout has been settled to your UPI account.</p>
        <div className="mt-8 space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-left">
          <div className="flex justify-between text-sm text-slate-500">Amount</div>
          <div className="text-3xl font-semibold text-slate-950">₹{amount.toLocaleString('en-IN')}</div>
          <div className="mt-4 flex justify-between text-sm text-slate-500">UPI ID</div>
          <div className="text-slate-800">{upiId}</div>
          <div className="mt-4 flex justify-between text-sm text-slate-500">Transaction</div>
          <div className="text-slate-800">{txnId}</div>
        </div>
        <button onClick={onClose} className="mt-10 inline-flex rounded-full bg-indigo-600 px-8 py-4 text-white transition hover:bg-indigo-700">
          Close
        </button>
      </div>
    </div>
  );
}
