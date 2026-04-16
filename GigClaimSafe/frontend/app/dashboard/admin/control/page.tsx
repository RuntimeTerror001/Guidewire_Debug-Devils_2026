'use client';
import { FaToggleOn, FaToggleOff, FaCogs, FaServer, FaShieldAlt, FaDatabase } from 'react-icons/fa';
import { useState } from 'react';

export default function SystemControl() {
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [fraudDetectionEnabled, setFraudDetectionEnabled] = useState(true);
  const [payoutAutomationEnabled, setPayoutAutomationEnabled] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const controls = [
    {
      id: 1,
      name: 'Fraud Detection Engine',
      description: 'Automatic detection of GPS spoofing and location anomalies',
      enabled: fraudDetectionEnabled,
      toggle: setFraudDetectionEnabled,
      icon: FaShieldAlt,
      color: 'indigo'
    },
    {
      id: 2,
      name: 'Automated Payouts',
      description: 'Enable automatic payout processing for approved claims',
      enabled: payoutAutomationEnabled,
      toggle: setPayoutAutomationEnabled,
      icon: FaDatabase,
      color: 'green'
    },
    {
      id: 3,
      name: 'Real-time Alerts',
      description: 'Send notifications for critical events and fraud attempts',
      enabled: alertsEnabled,
      toggle: setAlertsEnabled,
      icon: FaCogs,
      color: 'red'
    },
    {
      id: 4,
      name: 'Worker Automation',
      description: 'Automate worker assignment and task distribution',
      enabled: automationEnabled,
      toggle: setAutomationEnabled,
      icon: FaServer,
      color: 'blue'
    }
  ];

  const systemStatus = [
    { service: 'Database', status: 'ONLINE', uptime: '99.98%' },
    { service: 'API Server', status: 'ONLINE', uptime: '99.95%' },
    { service: 'Cache Layer', status: 'ONLINE', uptime: '99.99%' },
    { service: 'Notification Service', status: 'ONLINE', uptime: '99.92%' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">System Control</h1>
          <p className="text-slate-600">Manage system settings and automation controls</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
            <p className="text-slate-600 text-sm font-medium">System Health</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">98.6%</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <p className="text-slate-600 text-sm font-medium">Active Services</p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">4/4</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <p className="text-slate-600 text-sm font-medium">Enabled Controls</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">3/4</p>
          </div>
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
            <p className="text-slate-600 text-sm font-medium">Avg Response Time</p>
            <p className="text-3xl font-bold text-cyan-600 mt-2">145ms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Automation Controls</h2>
            </div>
            <div className="p-6 space-y-4">
              {controls.map((control) => {
                const IconComponent = control.icon;
                return (
                  <div key={control.id} className="flex items-start justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg bg-${control.color}-100 text-${control.color}-600 mt-1`}>
                        <IconComponent size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{control.name}</h3>
                        <p className="text-sm text-slate-600">{control.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => control.toggle(!control.enabled)}
                      className="ml-4"
                      aria-label={`Toggle ${control.name}`}
                    >
                      {control.enabled ? (
                        <FaToggleOn size={32} className="text-green-500" />
                      ) : (
                        <FaToggleOff size={32} className="text-slate-300" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Services Status</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Service</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Uptime</th>
                  </tr>
                </thead>
                <tbody>
                  {systemStatus.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="px-6 py-4 text-sm text-slate-900">{item.service}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center gap-2 w-fit">
                          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.uptime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">System Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Max Workers</label>
              <input type="number" value="500" readOnly className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Max Claims Per Worker</label>
              <input type="number" value="100" readOnly className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Fraud Detection Threshold</label>
              <input type="number" value="75" readOnly className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Payout Limit (₹)</label>
              <input type="number" value="500000" readOnly className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
