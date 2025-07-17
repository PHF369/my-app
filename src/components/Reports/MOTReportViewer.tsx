import React from 'react';
import { MOTRecord, Property, ChecklistItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Download, FileText, Calendar, User, Home, CheckCircle, AlertTriangle, Clock, Camera } from 'lucide-react';

interface MOTReportViewerProps {
  motRecord: MOTRecord;
  property: Property;
  onSaveAsDocument: () => void;
  onBack: () => void;
}

const MOTReportViewer: React.FC<MOTReportViewerProps> = ({
  motRecord,
  property,
  onSaveAsDocument,
  onBack
}) => {
  const { user } = useAuth();

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'ok': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'fault': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'action-needed': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'not-applicable': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ChecklistItem['status']) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1";
    switch (status) {
      case 'ok':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case 'fault':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      case 'action-needed':
        return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200`;
      case 'not-applicable':
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  const getPriorityBadge = (priority: ChecklistItem['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getOverallResult = () => {
    if (motRecord.summary.criticalIssues > 0) return { status: 'FAILED', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' };
    if (motRecord.summary.faultItems > 0) return { status: 'NEEDS REVIEW', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' };
    return { status: 'PASSED', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' };
  };

  const generalItems = motRecord.checklistItems.filter(item => !item.roomId);
  const roomItems = motRecord.checklistItems.filter(item => item.roomId);
  
  const roomsWithItems = property.rooms.map(room => ({
    ...room,
    items: roomItems.filter(item => item.roomId === room.id)
  })).filter(room => room.items.length > 0);

  const result = getOverallResult();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MOT Inspection Report</h1>
            <p className="text-gray-600 dark:text-gray-400">Property MOT Assessment</p>
          </div>
          <div className={`px-4 py-2 rounded-lg ${result.bg}`}>
            <span className={`text-lg font-bold ${result.color}`}>{result.status}</span>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Home className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Property Address</p>
                <p className="font-medium text-gray-900 dark:text-white">{property.address}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Property Type</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">{property.type}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Inspection Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(motRecord.startedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Inspector</p>
                <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{motRecord.summary.okItems}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">OK Items</div>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{motRecord.summary.faultItems}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Faults</div>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{motRecord.summary.actionNeededItems}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Action Needed</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{motRecord.summary.criticalIssues}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Critical Issues</div>
          </div>
        </div>
      </div>

      {/* General Property Checks */}
      {generalItems.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">General Property Checks</h2>
          <div className="space-y-4">
            {generalItems.map(item => (
              <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.label}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(item.priority)}`}>
                        {item.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                  <div className={getStatusBadge(item.status)}>
                    {getStatusIcon(item.status)}
                    <span>{item.status.replace('-', ' ').toUpperCase()}</span>
                  </div>
                </div>
                
                {item.notes && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item.notes}</p>
                  </div>
                )}

                {/* Visual Evidence */}
                {item.visualEvidence.applicable && item.visualEvidence.files.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
                      <Camera className="w-4 h-4" />
                      <span>Visual Evidence</span>
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {item.visualEvidence.files.map(file => (
                        <img
                          key={file.id}
                          src={file.url}
                          alt={file.filename}
                          className="w-full h-16 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Damage/Wear Evidence */}
                {item.damageOrWear.present && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">Damage/Wear Noted:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{item.damageOrWear.notes}</p>
                    {item.damageOrWear.files.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {item.damageOrWear.files.map(file => (
                          <img
                            key={file.id}
                            src={file.url}
                            alt={file.filename}
                            className="w-full h-16 object-cover rounded border border-red-200"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Room-by-Room Breakdown */}
      {roomsWithItems.map(room => (
        <div key={room.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{room.name}</h2>
          <div className="space-y-4">
            {room.items.map(item => (
              <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.label}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(item.priority)}`}>
                        {item.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                  <div className={getStatusBadge(item.status)}>
                    {getStatusIcon(item.status)}
                    <span>{item.status.replace('-', ' ').toUpperCase()}</span>
                  </div>
                </div>
                
                {item.notes && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item.notes}</p>
                  </div>
                )}

                {/* Fixtures Information */}
                {item.fixtures.applicable && item.fixtures.count > 0 && (
                  <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                      Fixtures: {item.fixtures.count} {item.fixtures.type.replace('-', ' ')}
                    </p>
                  </div>
                )}

                {/* Visual Evidence */}
                {item.visualEvidence.applicable && item.visualEvidence.files.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
                      <Camera className="w-4 h-4" />
                      <span>Visual Evidence</span>
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {item.visualEvidence.files.map(file => (
                        <img
                          key={file.id}
                          src={file.url}
                          alt={file.filename}
                          className="w-full h-16 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Damage/Wear Evidence */}
                {item.damageOrWear.present && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">Damage/Wear Noted:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{item.damageOrWear.notes}</p>
                    {item.damageOrWear.files.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {item.damageOrWear.files.map(file => (
                          <img
                            key={file.id}
                            src={file.url}
                            alt={file.filename}
                            className="w-full h-16 object-cover rounded border border-red-200"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back to Inspection
        </button>
        <div className="space-x-4">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={onSaveAsDocument}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>Save as Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MOTReportViewer;