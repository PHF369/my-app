import React from 'react';
import { Property, DOCUMENT_TYPES } from '../../types';
import { Building, AlertTriangle, CheckCircle, Clock, Calendar, Bell, Eye, ArrowLeft } from 'lucide-react';

interface LandlordDashboardProps {
  properties: Property[];
  onViewProperty: (property: Property) => void;
}

const LandlordDashboard: React.FC<LandlordDashboardProps> = ({ properties, onViewProperty }) => {
  const [currentView, setCurrentView] = React.useState<'dashboard' | 'expiring-docs' | 'all-properties'>('dashboard');
  const [selectedDocuments, setSelectedDocuments] = React.useState<any[]>([]);

  // Get all expiring documents across all properties
  const getExpiringDocuments = () => {
    const now = new Date();
    const noticeDate = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90 days from now
    
    const expiringDocs: Array<ComplianceDocument & { propertyAddress: string; daysUntilExpiry: number }> = [];
    
    properties.forEach(property => {
      property.complianceDocuments.forEach(doc => {
        if (doc.expiryDate) {
          const expiryDate = new Date(doc.expiryDate);
          const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysUntilExpiry <= 90 && daysUntilExpiry >= 0) {
            expiringDocs.push({
              ...doc,
              propertyAddress: property.address,
              daysUntilExpiry
            });
          }
        }
      });
    });
    
    return expiringDocs.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  };

  const expiringDocuments = getExpiringDocuments();

  const stats = [
    { label: 'Total Properties', value: '15', icon: Building, color: 'text-blue-500' },
    { label: 'MOT Passed', value: '12', icon: CheckCircle, color: 'text-green-500' },
    { label: 'Need Review', value: '2', icon: Clock, color: 'text-orange-500' },
    { label: 'Failed', value: '1', icon: AlertTriangle, color: 'text-red-500' }
  ];

  const getDocumentIcon = (documentType: string) => {
    const docType = DOCUMENT_TYPES[documentType as keyof typeof DOCUMENT_TYPES];
    return docType ? docType.icon : '📄';
  };

  const getExpiryUrgency = (daysUntilExpiry: number) => {
    if (daysUntilExpiry <= 7) return { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-200', border: 'border-red-200 dark:border-red-700' };
    if (daysUntilExpiry <= 30) return { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-800 dark:text-orange-200', border: 'border-orange-200 dark:border-orange-700' };
    return { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-200', border: 'border-yellow-200 dark:border-yellow-700' };
  };

  const handleViewAllExpiringDocuments = () => {
    setSelectedDocuments(expiringDocuments);
    setCurrentView('expiring-docs');
  };

  const handleViewAllProperties = () => {
    setCurrentView('all-properties');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedDocuments([]);
  };

  if (currentView === 'expiring-docs') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expiring Documents</h1>
          <p className="text-gray-600 dark:text-gray-400">All documents expiring within the next 90 days</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {selectedDocuments.map((doc) => {
              const urgency = getExpiryUrgency(doc.daysUntilExpiry);
              return (
                <div key={doc.id} className={`p-6 ${urgency.bg} border-l-4 ${urgency.border}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{getDocumentIcon(doc.documentType)}</span>
                      <div>
                        <h3 className={`font-semibold ${urgency.text}`}>
                          {DOCUMENT_TYPES[doc.documentType as keyof typeof DOCUMENT_TYPES]?.label || doc.documentType}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{doc.propertyAddress}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${urgency.text}`}>
                        {doc.daysUntilExpiry === 0 ? 'Expires Today' : 
                         doc.daysUntilExpiry === 1 ? 'Expires Tomorrow' :
                         `${doc.daysUntilExpiry} days left`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Expires: {new Date(doc.expiryDate!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'all-properties') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Properties</h1>
          <p className="text-gray-600 dark:text-gray-400">Complete list of your property portfolio</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {properties.map((property) => {
              const statusBadge = getStatusBadge(property.motStatus);
              const issueCount = getIssueCount(property);
              return (
                <div key={property.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getTypeIcon(property.type)}</div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{property.address}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Last updated: {new Date(property.lastUpdated).toLocaleDateString()} • 
                          Next due: {new Date(property.nextDue).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {issueCount > 0 && (
                        <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-full text-xs font-medium">
                          {issueCount} issues
                        </span>
                      )}
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusBadge.bg} flex items-center space-x-1`}>
                        <span>{statusBadge.icon}</span>
                        <span>{property.motStatus.replace('-', ' ')}</span>
                      </span>
                      <button onClick={() => onViewProperty(property)} className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return { bg: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: '✅' };
      case 'failed':
        return { bg: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: '❌' };
      case 'needs-review':
        return { bg: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', icon: '⚠️' };
      default:
        return { bg: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', icon: '⏳' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'house': return '🏠';
      case 'flat': return '🏢';
      case 'bungalow': return '🏘️';
      default: return '🏠';
    }
  };

  const getIssueCount = (property: Property) => {
    // Calculate issues from MOT history or other sources
    return property.motHistory.reduce((total, mot) => total + mot.summary.faultItems + mot.summary.criticalIssues, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Property Portfolio</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor your properties and track MOT compliance</p>
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

      {/* Expiring Documents Alert */}
      {expiringDocuments.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Expiring Certificates</h2>
              <span className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-2 py-1 rounded-full text-xs font-medium">
                {expiringDocuments.length} expiring
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {expiringDocuments.slice(0, 5).map((doc) => {
              const urgency = getExpiryUrgency(doc.daysUntilExpiry);
              return (
                <div key={doc.id} className={`p-4 ${urgency.bg} border-l-4 ${urgency.border}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getDocumentIcon(doc.documentType)}</span>
                      <div>
                        <h3 className={`font-medium ${urgency.text}`}>
                          {DOCUMENT_TYPES[doc.documentType as keyof typeof DOCUMENT_TYPES]?.label || doc.documentType}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{doc.propertyAddress}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${urgency.text}`}>
                        {doc.daysUntilExpiry === 0 ? 'Expires Today' : 
                         doc.daysUntilExpiry === 1 ? 'Expires Tomorrow' :
                         `${doc.daysUntilExpiry} days left`}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Expires: {new Date(doc.expiryDate!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {expiringDocuments.length > 5 && (
            <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={handleViewAllExpiringDocuments}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              >
                View all {expiringDocuments.length} expiring documents
              </button>
            </div>
          )}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Properties</h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
          {properties.slice(0, 5).map((property) => {
            const statusBadge = getStatusBadge(property.motStatus);
            const issueCount = getIssueCount(property);
            return (
              <div key={property.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getTypeIcon(property.type)}</div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{property.address}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Last updated: {new Date(property.lastUpdated).toLocaleDateString()} • 
                        Next due: {new Date(property.nextDue).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {issueCount > 0 && (
                      <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-full text-xs font-medium">
                        {issueCount} issues
                      </span>
                    )}
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusBadge.bg} flex items-center space-x-1`}>
                      <span>{statusBadge.icon}</span>
                      <span>{property.motStatus.replace('-', ' ')}</span>
                    </span>
                    <button onClick={() => onViewProperty(property)} className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {properties.length > 5 && (
            <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={handleViewAllProperties}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              >
                View all {properties.length} properties
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming MOT Due Dates</h3>
          <div className="space-y-3">
            {(() => {
              const upcomingMOTs = properties
                .map(property => ({
                  ...property,
                  daysUntilDue: Math.ceil((new Date(property.nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                }))
                .filter(property => property.daysUntilDue <= 30 && property.daysUntilDue > 0)
                .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
                .slice(0, 3);

              if (upcomingMOTs.length === 0) {
                return (
                  <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400">No MOTs due in the next 30 days</p>
                  </div>
                );
              }

              return upcomingMOTs.map(property => {
                const urgencyColor = property.daysUntilDue <= 7 ? 'orange' : 'yellow';
                return (
                  <div key={property.id} className={`flex items-center justify-between p-3 bg-${urgencyColor}-50 dark:bg-${urgencyColor}-900/20 rounded-lg`}>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{property.address}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Due in {property.daysUntilDue} day{property.daysUntilDue !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Calendar className={`w-5 h-5 text-${urgencyColor}-500`} />
                  </div>
                );
              });
            })()}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Portfolio Performance</h3>
          <div className="space-y-4">
            {(() => {
              const passedProperties = properties.filter(p => p.motStatus === 'passed').length;
              const complianceRate = properties.length > 0 ? Math.round((passedProperties / properties.length) * 100) : 0;
              const totalIssues = properties.reduce((total, property) => 
                total + property.motHistory.reduce((motTotal, mot) => 
                  motTotal + mot.summary.faultItems + mot.summary.criticalIssues, 0), 0);
              const averageRating = properties.length > 0 ? 
                (properties.reduce((sum, property) => {
                  const rating = property.motStatus === 'passed' ? 5 : 
                                property.motStatus === 'needs-review' ? 3 : 
                                property.motStatus === 'failed' ? 1 : 2;
                  return sum + rating;
                }, 0) / properties.length).toFixed(1) : '0.0';

              return (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Compliance Rate</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${complianceRate}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{complianceRate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average Rating</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{averageRating}/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Issues</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{totalIssues}</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;