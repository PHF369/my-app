import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Property, ComplianceDocument, MOTRecord } from '../../types';
import { hasPermission } from '../../utils/permissions';
import DocumentManager from '../Documents/DocumentManager';
import { ArrowLeft, Calendar, MapPin, Home, FileText, History, Settings, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface PropertyDetailProps {
  property: Property;
  onBack: () => void;
  onDocumentUpload: (document: ComplianceDocument) => void;
  onDocumentDelete: (documentId: string) => void;
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({
  property,
  onBack,
  onDocumentUpload,
  onDocumentDelete
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'history' | 'settings'>('overview');

  if (!user) return null;

  const canEdit = hasPermission(user, 'properties', 'update');
  const canViewDocuments = hasPermission(user, 'documents', 'read');

  const getStatusIcon = (status: Property['motStatus']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'needs-review': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'overdue': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: Property['motStatus']) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1";
    switch (status) {
      case 'passed':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      case 'needs-review':
        return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200`;
      case 'overdue':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  const getPropertyTypeIcon = (type: Property['type']) => {
    switch (type) {
      case 'house': return '🏠';
      case 'flat': return '🏢';
      case 'bungalow': return '🏘️';
      default: return '🏠';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    ...(canViewDocuments ? [{ id: 'documents' as const, label: 'Documents', icon: FileText }] : []),
    { id: 'history', label: 'MOT History', icon: History },
    ...(canEdit ? [{ id: 'settings' as const, label: 'Settings', icon: Settings }] : [])
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Property Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{getPropertyTypeIcon(property.type)}</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{property.address}</h2>
              <p className="text-gray-600 dark:text-gray-400 capitalize">{property.type}</p>
            </div>
          </div>
          <div className={getStatusBadge(property.motStatus)}>
            {getStatusIcon(property.motStatus)}
            <span>{property.motStatus.replace('-', ' ').toUpperCase()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date(property.lastUpdated).toLocaleDateString()}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Next Due</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date(property.nextDue).toLocaleDateString()}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Home className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rooms</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {property.rooms.length}
            </p>
          </div>
        </div>
      </div>

      {/* Recent MOT Summary */}
      {property.motHistory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Latest MOT Results</h3>
          {(() => {
            const latestMOT = property.motHistory[0];
            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{latestMOT.summary.okItems}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">OK Items</div>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{latestMOT.summary.faultItems}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Faults</div>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{latestMOT.summary.actionNeededItems}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Action Needed</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{latestMOT.summary.criticalIssues}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Critical Issues</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Compliance Documents Summary */}
      {canViewDocuments && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Document Status</h3>
            <button
              onClick={() => setActiveTab('documents')}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {property.complianceDocuments.filter(doc => !doc.expiryDate || new Date(doc.expiryDate) > new Date()).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Valid Documents</div>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {property.complianceDocuments.filter(doc => {
                  if (!doc.expiryDate) return false;
                  const daysUntilExpiry = Math.ceil((new Date(doc.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
                }).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Expiring Soon</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">MOT History</h3>
      {property.motHistory.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No MOT history</h3>
          <p className="text-gray-600 dark:text-gray-400">
            MOT inspections will appear here once completed
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {property.motHistory.map((mot) => (
            <div key={mot.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    MOT Inspection - {new Date(mot.startedAt).toLocaleDateString()}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Inspector: {mot.inspectorId} • Status: {mot.status}
                  </p>
                </div>
                <div className={getStatusBadge(mot.overallResult as Property['motStatus'])}>
                  {getStatusIcon(mot.overallResult as Property['motStatus'])}
                  <span>{mot.overallResult.replace('-', ' ').toUpperCase()}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-xl font-bold text-green-600">{mot.summary.okItems}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">OK</div>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-xl font-bold text-red-600">{mot.summary.faultItems}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Faults</div>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-xl font-bold text-orange-600">{mot.summary.actionNeededItems}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Action Needed</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">{mot.summary.criticalIssues}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Critical</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Property Settings</h3>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">Property settings and configuration options will be available here.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Properties</span>
        </button>

        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="w-5 h-5 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{property.address}</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300 dark:text-gray-300 dark:hover:text-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'documents' && canViewDocuments && (
          <DocumentManager
            property={property}
            onDocumentUpload={onDocumentUpload}
            onDocumentDelete={onDocumentDelete}
          />
        )}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'settings' && canEdit && renderSettings()}
      </div>
    </div>
  );
};

export default PropertyDetail;