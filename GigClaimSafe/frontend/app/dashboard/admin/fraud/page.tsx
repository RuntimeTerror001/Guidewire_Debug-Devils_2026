'use client';
import { FaExclamationTriangle, FaCheckCircle, FaClock } from 'react-icons/fa';

export default function FraudMonitor() {
  const fraudCases = [
    { id: 'FRD-001', worker: 'Ravi Kumar', type: 'GPS Spoofing', severity: 'HIGH', status: 'BLOCKED' },
    { id: 'FRD-002', worker: 'Neha Sharma', type: 'Duplicate Claim', severity: 'MEDIUM', status: 'REVIEWING' },
    { id: 'FRD-003', worker: 'Aman Singh', type: 'Rapid Requests', severity: 'LOW', status: 'CLEARED' },
    { id: 'FRD-004', worker: 'Priya S', type: 'Location Anomaly', severity: 'HIGH', status: 'BLOCKED' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Fraud Monitor</h1>
          <p className="text-slate-600">Real-time fraud detection and case management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-slate-600 text-sm font-medium">Blocked Claims</p>
            <p className="text-3xl font-bold text-red-600 mt-2">24</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-slate-600 text-sm font-medium">Under Review</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">8</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <p className="text-slate-600 text-sm font-medium">Approved</p>
            <p className="text-3xl font-bold text-green-600 mt-2">1,208</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-slate-600 text-sm font-medium">Risk Score Avg</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">42.3%</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Active Fraud Cases</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Case ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Worker</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Fraud Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Severity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {fraudCases.map((case_, idx) => (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-mono text-indigo-600">{case_.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{case_.worker}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{case_.type}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        case_.severity === 'HIGH' ? 'bg-red-100 text-red-800' :
                        case_.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {case_.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 w-fit ${
                        case_.status === 'BLOCKED' ? 'bg-red-100 text-red-800' :
                        case_.status === 'REVIEWING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {case_.status === 'BLOCKED' ? <FaExclamationTriangle /> : <FaCheckCircle />}
                        {case_.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
