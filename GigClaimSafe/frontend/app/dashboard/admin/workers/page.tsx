'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../lib/auth-context';
import { api, AdminUser } from '../../../../lib/api';
import { toast } from 'react-hot-toast';
import {
  Users,
  Search,
  Filter,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  FileText,
  Calendar,
  MapPin,
  Briefcase
} from 'lucide-react';

interface WorkerStats {
  totalWorkers: number;
  activeWorkers: number;
  totalPremium: number;
  totalPayouts: number;
  avgRiskScore: number;
  highRiskWorkers: number;
}

export default function AdminWorkersPage() {
  const { user } = useAuth();
  const [workers, setWorkers] = useState<AdminUser[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<WorkerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    if (user?.role === 'admin') {
      loadWorkers();
      loadStats();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortWorkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workers, searchTerm, filterRole, filterRisk, sortBy]);

  const loadWorkers = async () => {
    try {
      const data = await api.adminGetWorkers();
      setWorkers(data);
    } catch (error: any) {
      toast.error('Failed to load workers');
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await api.adminStats();
      setStats({
        totalWorkers: statsData.total_workers,
        activeWorkers: statsData.active_policies,
        totalPremium: statsData.premium_collected,
        totalPayouts: statsData.total_payouts,
        avgRiskScore: 0.5, // We'll calculate this from workers data
        highRiskWorkers: 0
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const filterAndSortWorkers = () => {
    let filtered = workers.filter(worker => {
      const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           worker.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           worker.platform.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === 'all' || worker.role === filterRole;

      let matchesRisk = true;
      if (filterRisk === 'high') matchesRisk = worker.risk_score > 0.7;
      else if (filterRisk === 'medium') matchesRisk = worker.risk_score >= 0.4 && worker.risk_score <= 0.7;
      else if (filterRisk === 'low') matchesRisk = worker.risk_score < 0.4;

      return matchesSearch && matchesRole && matchesRisk;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'risk_score':
          return b.risk_score - a.risk_score;
        case 'total_payouts':
          return b.total_payouts - a.total_payouts;
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    setFilteredWorkers(filtered);

    // Update stats
    if (stats) {
      const highRiskCount = filtered.filter(w => w.risk_score > 0.7).length;
      const avgRisk = filtered.length > 0 ? filtered.reduce((sum, w) => sum + w.risk_score, 0) / filtered.length : 0;
      setStats(prev => prev ? { ...prev, highRiskWorkers: highRiskCount, avgRiskScore: avgRisk } : null);
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 0.7) return 'text-red-600 bg-red-50';
    if (score > 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getRiskIcon = (score: number) => {
    if (score > 0.7) return <TrendingUp className="h-4 w-4" />;
    if (score > 0.4) return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Worker Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all registered workers</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">{stats?.totalWorkers || 0}</span>
              <span className="text-sm text-gray-600">Total Workers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Workers</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeWorkers || 0}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Premium</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats?.totalPremium?.toLocaleString() || 0}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payouts</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats?.totalPayouts?.toLocaleString() || 0}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk Workers</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.highRiskWorkers || 0}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search workers by name, email, city, or platform..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="worker">Workers</option>
              <option value="admin">Admins</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="risk_score">Sort by Risk Score</option>
              <option value="total_payouts">Sort by Payouts</option>
              <option value="created_at">Sort by Join Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Workers ({filteredWorkers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Worker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Financials
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-700">
                            {worker.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                        <div className="text-sm text-gray-500">{worker.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {worker.platform}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {worker.city}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(worker.risk_score)}`}>
                      {getRiskIcon(worker.risk_score)}
                      {(worker.risk_score * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{worker.risk_label}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ₹{worker.weekly_earnings.toLocaleString()}/week
                    </div>
                    <div className="text-sm text-gray-500">
                      {worker.total_payouts > 0 ? `₹${worker.total_payouts.toLocaleString()} paid` : 'No payouts'}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{worker.total_claims} claims</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(worker.created_at).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWorkers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No workers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}