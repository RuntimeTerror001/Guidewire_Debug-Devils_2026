'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaChartBar, FaChartLine, FaChartPie } from 'react-icons/fa';

export default function AnalyticsDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Analytics Dashboard</h1>
          <p className="text-slate-600">Comprehensive analytics and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Claims</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">1,240</p>
              </div>
              <FaChartBar className="text-4xl text-indigo-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Approved Rate</p>
                <p className="text-3xl font-bold text-green-600 mt-2">87.5%</p>
              </div>
              <FaChartPie className="text-4xl text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Avg Payout Time</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">2.3 sec</p>
              </div>
              <FaChartLine className="text-4xl text-slate-600 opacity-20" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Monthly Trends</h2>
          <div className="h-64 bg-slate-100 rounded flex items-center justify-center">
            <p className="text-slate-500">Analytics chart will display here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
