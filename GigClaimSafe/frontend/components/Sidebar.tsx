'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-context';
import {
  Home,
  UserPlus,
  Clipboard,
  CloudRain,
  FileText,
  Wallet,
  ShieldCheck,
  Users,
  BarChart3,
  LogOut,
  User,
} from 'lucide-react';

const workerItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Insurance Plans', href: '/plans', icon: Clipboard },
  { label: 'Disruption Monitor', href: '/monitor', icon: CloudRain },
  { label: 'Claims', href: '/claims', icon: FileText },
  { label: 'Payouts', href: '/payout', icon: Wallet },
];

const adminItems = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: Home },
  { label: 'All Workers', href: '/dashboard/admin/workers', icon: Users },
  { label: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
  { label: 'Fraud Monitor', href: '/dashboard/admin/fraud', icon: ShieldCheck },
  { label: 'System Control', href: '/dashboard/admin/control', icon: CloudRain },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, isAdmin, loading } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  // Don't show sidebar on auth pages
  if (pathname.startsWith('/auth')) {
    return null;
  }

  // Skip login prompt on protected dashboard pages (auth check is in progress)
  const isProtectedDashboard = pathname.startsWith('/dashboard');
  
  // Show login prompt if not authenticated AND not on a protected dashboard page
  if (!isAuthenticated && !isProtectedDashboard && !loading) {
    return (
      <aside className="fixed left-0 top-0 z-50 h-full w-64 border-r border-slate-200 bg-white px-6 py-8">
        <div className="mb-12 flex flex-col gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200/50">
            <span className="text-xl font-bold">G</span>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">GigClaimSafe</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">Insurance Platform</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
          <p className="text-sm font-semibold text-slate-900 mb-4">Welcome to GigClaimSafe</p>
          <p className="text-xs text-slate-500 mb-4">Please sign in to access your dashboard.</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <User className="h-4 w-4" />
            Sign In
          </Link>
        </div>
      </aside>
    );
  }

  const items = isAdmin ? adminItems : workerItems;

  return (
    <aside className="fixed left-0 top-0 z-50 h-full w-64 border-r border-slate-200 bg-white px-6 py-8">
      <div className="mb-12 flex flex-col gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200/50">
          <span className="text-xl font-bold">G</span>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">GigClaimSafe</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">Insurance Platform</p>
          {user && (
            <p className="mt-1 text-sm text-slate-600">
              Welcome, {user.name}
              {isAdmin && <span className="ml-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">ADMIN</span>}
            </p>
          )}
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100/60' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </nav>

      <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 shadow-sm">
        <p className="font-semibold text-slate-900">
          {isAdmin ? 'Admin Panel' : 'Worker Dashboard'}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          {isAdmin
            ? 'Monitor claims, payouts, and fraud health in one place.'
            : 'Manage your insurance, claims, and payouts.'
          }
        </p>
      </div>
    </aside>
  );
}
