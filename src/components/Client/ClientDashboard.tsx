import React, { useState } from 'react';
import { Calendar, FileText, Clock, CheckCircle, AlertCircle, ArrowLeft, X } from 'lucide-react';

interface ClientDashboardProps {
  onStartInspection: () => void;
}

interface MockInspection {
  id: string;
  address: string;
  date: string;
  status: 'completed' | 'pending';
  rooms: number;
  details: {
    totalItems: number;
    completedItems: number;
    okItems: number;
    faultItems: number;
    actionNeededItems: number;
    criticalIssues: number;
  };
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ onStartInspection }) => {
  const [selectedInspection, setSelectedInspection] = useState<MockInspection | null>(null);
  const [showInspectionModal, setShowInspectionModal] = useState(false);

  const recentInspections: MockInspection[] = [
    {
      id: '1',
      address: '123 Main St, London SW1A 1AA',
      date: '2024-01-15',
      status: 'completed',
      rooms: 5,
      details: {
        totalItems: 25,
        completedItems: 25,
        okItems: 20,
        faultItems: 3,
        actionNeededItems: 2,
        criticalIssues: 0
      }
    },
    {
      id: '2',
      address: '456 Oak Ave, Manchester M1 1AA',
      date: '2024-01-12',
      status: 'pending',
      rooms: 3,
      details: {
        totalItems: 18,
        completedItems: 12,
        okItems: 10,
        faultItems: 1,
        actionNeededItems: 1,
        criticalIssues: 0
      }
    }
  ];

  const stats = [
    { label: 'Total Inspections', value: '12', icon: FileText, color: 'text-blue-500' },
    { label: 'This Month', value: '3', icon: Calendar, color: 'text-emerald-500' },
    { label: 'Pending Reviews', value: '2', icon: Clock, color: 'text-orange-500' },
    { label: 'Completed', value: '10', icon: CheckCircle, color: 'text-green-500' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleViewDetails = (inspection: MockInspection) => {
    setSelectedInspection(inspection);
    setShowInspectionModal(true);
  };

  const handleCloseModal = () => {
    setSelectedInspection(null);
    setShowInspectionModal(false);
  };

  const renderInspectionModal = () => {
    if (!selectedInspection || !showInspectionModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inspection Details</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">{selectedInspection.address}</p>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedInspection.status)}`}>
                  {selectedInspection.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Inspection Date</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedInspection.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rooms Inspected</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedInspection.rooms}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {Math.round((selectedInspection.details.completedItems / selectedInspection.details.totalItems) * 100)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedInspection.details.okItems}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">OK Items</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{selectedInspection.details.faultItems}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Faults</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{selectedInspection.details.actionNeededItems}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Action Needed</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedInspection.details.criticalIssues}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Critical Issues</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inspector Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your property inspections and track progress</p>
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
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Inspections</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentInspections.map((inspection) => (
            <div key={inspection.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{inspection.address}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {inspection.rooms} rooms • {new Date(inspection.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(inspection.status)}`}>
                    {inspection.status}
                  </span>
                  <button 
                    onClick={() => handleViewDetails(inspection)}
                    className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Ready to start a new inspection?</h3>
            <p className="text-blue-100 mt-1">Complete property MOT checks with our guided process</p>
          </div>
          <button 
            onClick={onStartInspection}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Start Inspection
          </button>
        </div>
      </div>
      </div>
      {renderInspectionModal()}
    </>
  );
};

export default ClientDashboard;