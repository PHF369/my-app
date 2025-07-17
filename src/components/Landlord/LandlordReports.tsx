import React, { useState } from 'react';
import { Property, DOCUMENT_TYPES } from '../../types';
import { FileText, Download, TrendingUp, Building, Zap, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';

interface LandlordReportsProps {
  properties: Property[];
}

const LandlordReports: React.FC<LandlordReportsProps> = ({ properties }) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'epc-report'>('dashboard');

  // Calculate summary statistics
  const stats = {
    totalProperties: properties.length,
    averageEPCScore: Math.round(
      properties.reduce((sum, property) => {
        const epcDoc = property.complianceDocuments.find(doc => doc.documentType === 'epc-certificate');
        return sum + (epcDoc?.epcScore || 0);
      }, 0) / properties.length
    ),
    complianceRate: Math.round(
      (properties.filter(p => p.motStatus === 'passed').length / properties.length) * 100
    ),
    totalDocuments: properties.reduce((sum, property) => sum + property.complianceDocuments.length, 0)
  };

  const reportTypes = [
    {
      id: 'portfolio-overview',
      title: 'Portfolio Overview',
      description: 'Complete overview of all properties and their status',
      icon: Building,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 'compliance-report',
      title: 'Compliance Report',
      description: 'MOT status and compliance tracking across properties',
      icon: FileText,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 'epc-report',
      title: 'EPC Performance Report',
      description: 'Energy performance analysis and ratings overview',
      icon: Zap,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      id: 'document-expiry',
      title: 'Document Expiry Report',
      description: 'Track certificate expiration dates and renewals',
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      id: 'maintenance-report',
      title: 'Maintenance Report',
      description: 'Property maintenance issues and action items',
      icon: Activity,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      id: 'financial-report',
      title: 'Financial Report',
      description: 'Cost analysis and budget tracking for properties',
      icon: BarChart3,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20'
    }
  ];

  const handleGenerateReport = (reportType: string) => {
    if (reportType === 'epc-report') {
      setCurrentView('epc-report');
    } else {
      setCurrentView(reportType as any);
    }
  };

  const handleDownloadReport = (reportType: string) => {
    // Simulate download by creating a simple text file
    const reportData = generateMockReportData(reportType);
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateMockReportData = (reportType: string) => {
    const timestamp = new Date().toLocaleString();
    switch (reportType) {
      case 'portfolio-overview':
        return `Portfolio Overview Report - Generated: ${timestamp}\n\nTotal Properties: ${properties.length}\nPassed MOTs: ${properties.filter(p => p.motStatus === 'passed').length}\nFailed MOTs: ${properties.filter(p => p.motStatus === 'failed').length}\nNeeds Review: ${properties.filter(p => p.motStatus === 'needs-review').length}\n\nProperty List:\n${properties.map(p => `- ${p.address} (${p.type}) - Status: ${p.motStatus}`).join('\n')}`;
      case 'compliance-report':
        return `Compliance Report - Generated: ${timestamp}\n\nCompliance Summary:\n${properties.map(p => `${p.address}: ${p.motStatus.toUpperCase()}`).join('\n')}`;
      case 'document-expiry':
        const expiringDocs = properties.flatMap(p => 
          p.complianceDocuments.filter(doc => {
            if (!doc.expiryDate) return false;
            const daysUntilExpiry = Math.ceil((new Date(doc.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return daysUntilExpiry <= 90;
          }).map(doc => `${p.address}: ${doc.originalName} - Expires: ${doc.expiryDate}`)
        );
        return `Document Expiry Report - Generated: ${timestamp}\n\nExpiring Documents:\n${expiringDocs.join('\n')}`;
      default:
        return `${reportType} Report - Generated: ${timestamp}\n\nThis is a mock report for demonstration purposes.`;
    }
  };

  const showFeatureModal = (featureName: string) => {
    alert(`${featureName} feature is under development. This will be available in a future update.`);
  };

  if (currentView === 'epc-report') {
    return <EPCReportViewer properties={properties} onBack={() => setCurrentView('dashboard')} />;
  }

  // Handle other report types
  if (currentView !== 'dashboard') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {reportTypes.find(r => r.id === currentView)?.title || 'Report'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {reportTypes.find(r => r.id === currentView)?.description || 'Report details'}
            </p>
          </div>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Reports
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Report Preview</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This report contains data from {properties.length} properties in your portfolio.
            </p>
            <div className="space-y-4 max-w-md mx-auto">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <pre className="text-sm text-left whitespace-pre-wrap">
                  {generateMockReportData(currentView).substring(0, 200)}...
                </pre>
              </div>
              <button
                onClick={() => handleDownloadReport(currentView)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Download Full Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Generate comprehensive reports for your property portfolio</p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProperties}</p>
            </div>
            <Building className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg EPC Score</p>
              <p className="text-2xl font-bold text-orange-600">{stats.averageEPCScore}</p>
            </div>
            <Zap className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Compliance Rate</p>
              <p className="text-2xl font-bold text-green-600">{stats.complianceRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Documents</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalDocuments}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Report Actions</h2>
            <button 
              onClick={() => showFeatureModal('Create Custom Report')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Create Custom Report</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button 
              onClick={() => showFeatureModal('Export All Data')}
              className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left"
            >
              <Download className="w-6 h-6 text-green-500 mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white">Export All Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Download complete portfolio data</p>
            </button>
            <button 
              onClick={() => showFeatureModal('Schedule Reports')}
              className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left"
            >
              <Calendar className="w-6 h-6 text-purple-500 mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white">Schedule Reports</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Set up automated reporting</p>
            </button>
            <button 
              onClick={() => showFeatureModal('Analytics Dashboard')}
              className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors text-left"
            >
              <PieChart className="w-6 h-6 text-indigo-500 mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-white">Analytics Dashboard</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View detailed analytics</p>
            </button>
          </div>
        </div>
      </div>

      {/* Available Reports */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Available Reports</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Generate detailed reports for different aspects of your portfolio
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <div key={report.id} className={`p-6 ${report.bgColor} rounded-lg border border-gray-200 dark:border-gray-700`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-8 h-8 ${report.color}`} />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{report.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleGenerateReport(report.id)}
                      className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium border border-gray-200 dark:border-gray-600"
                    >
                      View Report
                    </button>
                    <button 
                      onClick={() => handleDownloadReport(report.id)}
                      className="px-4 py-2 bg-gray-900 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-500 transition-colors text-sm font-medium flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// EPC Report Viewer Component (moved from LandlordDashboard)
const EPCReportViewer: React.FC<{ properties: Property[]; onBack: () => void }> = ({ properties, onBack }) => {
  const [sortBy, setSortBy] = useState<'address' | 'rating' | 'score' | 'expiry'>('address');
  const [filterRating, setFilterRating] = useState<string>('all');

  // Get all EPC documents
  const epcDocuments = properties.flatMap(property => 
    property.complianceDocuments
      .filter(doc => doc.documentType === 'epc-certificate')
      .map(doc => ({
        ...doc,
        propertyAddress: property.address,
        propertyType: property.type
      }))
  );

  // Filter and sort EPC documents
  const filteredAndSortedDocs = epcDocuments
    .filter(doc => filterRating === 'all' || doc.epcRating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (a.epcRating || 'Z').localeCompare(b.epcRating || 'Z');
        case 'score':
          return (b.epcScore || 0) - (a.epcScore || 0);
        case 'expiry':
          return new Date(a.expiryDate || '').getTime() - new Date(b.expiryDate || '').getTime();
        default:
          return a.propertyAddress.localeCompare(b.propertyAddress);
      }
    });

  // Calculate summary statistics
  const summary = {
    totalProperties: epcDocuments.length,
    averageScore: Math.round(epcDocuments.reduce((sum, doc) => sum + (doc.epcScore || 0), 0) / epcDocuments.length),
    ratingDistribution: epcDocuments.reduce((acc, doc) => {
      const rating = doc.epcRating || 'Unknown';
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'A': return 'bg-green-600 text-white';
      case 'B': return 'bg-green-500 text-white';
      case 'C': return 'bg-yellow-500 text-white';
      case 'D': return 'bg-orange-500 text-white';
      case 'E': return 'bg-red-500 text-white';
      case 'F': return 'bg-red-600 text-white';
      case 'G': return 'bg-red-700 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 92) return 'text-green-600';
    if (score >= 81) return 'text-green-500';
    if (score >= 69) return 'text-yellow-500';
    if (score >= 55) return 'text-orange-500';
    if (score >= 39) return 'text-red-500';
    if (score >= 21) return 'text-red-600';
    return 'text-red-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EPC Portfolio Report</h1>
          <p className="text-gray-600 dark:text-gray-400">Energy Performance Certificate overview for all properties</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back to Reports
        </button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalProperties}</p>
            </div>
            <Building className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average EPC Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(summary.averageScore)}`}>{summary.averageScore}</p>
            </div>
            <Zap className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Most Common Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Object.entries(summary.ratingDistribution).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rating Distribution</h3>
        <div className="grid grid-cols-7 gap-2">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(rating => (
            <div key={rating} className="text-center">
              <div className={`w-12 h-12 rounded-lg ${getRatingColor(rating)} flex items-center justify-center font-bold text-lg mx-auto mb-2`}>
                {rating}
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{summary.ratingDistribution[rating] || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">properties</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Property Details</h3>
          <div className="flex space-x-4">
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Ratings</option>
              {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(rating => (
                <option key={rating} value={rating}>Rating {rating}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="address">Sort by Address</option>
              <option value="rating">Sort by Rating</option>
              <option value="score">Sort by Score</option>
              <option value="expiry">Sort by Expiry</option>
            </select>
          </div>
        </div>
      </div>

      {/* EPC Documents Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">EPC Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issued</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expires</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedDocs.map((doc) => {
                const daysUntilExpiry = doc.expiryDate ? 
                  Math.ceil((new Date(doc.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
                  null;
                const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 365; // 1 year notice for EPC
                
                return (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{doc.propertyAddress}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{doc.originalName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white capitalize">{doc.propertyType}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(doc.epcRating || 'Unknown')}`}>
                        {doc.epcRating || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${getScoreColor(doc.epcScore || 0)}`}>
                        {doc.epcScore || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {isExpiringSoon ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                          Expires in {daysUntilExpiry} days
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Valid
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAndSortedDocs.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No EPC certificates found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filterRating !== 'all' ? 'Try adjusting your filter criteria' : 'Upload EPC certificates to see them here'}
          </p>
        </div>
      )}
    </div>
  );
};

export default LandlordReports;