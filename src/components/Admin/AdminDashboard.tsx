import React from 'react';
import { Users, Building, FileText, TrendingUp, AlertTriangle, CheckCircle, Clock, Plus, Download, UserPlus } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-500', change: '+12%' },
    { label: 'Properties', value: '456', icon: Building, color: 'text-emerald-500', change: '+8%' },
    { label: 'Inspections', value: '2,890', icon: FileText, color: 'text-orange-500', change: '+15%' },
    { label: 'Compliance Rate', value: '87%', icon: CheckCircle, color: 'text-green-500', change: '+3%' }
  ];

  const recentActivity = [
    { type: 'inspection', message: 'New inspection completed at 123 Main St', time: '2 hours ago', status: 'success' },
    { type: 'user', message: 'New landlord registered: John Smith', time: '4 hours ago', status: 'info' },
    { type: 'alert', message: 'MOT overdue: 456 Oak Ave', time: '6 hours ago', status: 'warning' },
    { type: 'system', message: 'System backup completed', time: '1 day ago', status: 'success' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'inspection': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'user': return <Users className="w-5 h-5 text-emerald-500" />;
      case 'alert': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'system': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 dark:bg-green-900';
      case 'warning': return 'bg-orange-100 dark:bg-orange-900';
      case 'info': return 'bg-blue-100 dark:bg-blue-900';
      default: return 'bg-gray-100 dark:bg-gray-900';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">System overview and management tools</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">{stat.change}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentActivity.map((activity, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Health</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Server Status</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">65%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Last Backup</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => console.log('Add User clicked')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add User</span>
              </button>
              <button 
                onClick={() => console.log('Add Property clicked')}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Property</span>
              </button>
              <button 
                onClick={() => console.log('Create Report clicked')}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Create Report</span>
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => console.log('Manage Users clicked')}
              className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Manage Users</span>
            </button>
            <button 
              onClick={() => console.log('Manage Properties clicked')}
              className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
            >
              <Building className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Properties</span>
            </button>
            <button 
              onClick={() => console.log('View Reports clicked')}
              className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
            >
              <FileText className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Reports</span>
            </button>
            <button 
              onClick={() => console.log('View Analytics clicked')}
              className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;