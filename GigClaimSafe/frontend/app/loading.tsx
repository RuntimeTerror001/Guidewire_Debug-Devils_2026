export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="inline-flex items-center gap-3 rounded-3xl bg-white px-7 py-5 shadow-surface">
        <div className="h-4 w-4 animate-pulse rounded-full bg-indigo-600" />
        <p className="text-sm font-semibold text-slate-700">Loading dashboard…</p>
      </div>
    </div>
  );
}
