import React from 'react';
import { Property, ComplianceDocument } from '../../types';
import PropertyDetail from '../Property/PropertyDetail';
import { Plus, AlertTriangle, CheckCircle, Clock, X, Home, Building, Mountain } from 'lucide-react';

interface LandlordPropertiesProps {
  properties: Property[];
  selectedProperty: Property | null;
  showPropertyDetail: boolean;
  onViewProperty: (property: Property) => void;
  onBackFromProperty: () => void;
  onDocumentUpload: (document: ComplianceDocument) => void;
  onDocumentDelete: (documentId: string) => void;
  onAddProperty: (property: Property) => void;
}

interface NewPropertyForm {
  address: string;
  type: Property['type'];
}
const LandlordProperties: React.FC<LandlordPropertiesProps> = ({
  properties,
  selectedProperty,
  showPropertyDetail,
  onViewProperty,
  onBackFromProperty,
  onDocumentUpload,
  onDocumentDelete,
  onAddProperty
}) => {
  const [showAddPropertyForm, setShowAddPropertyForm] = React.useState(false);
  const [newProperty, setNewProperty] = React.useState<NewPropertyForm>({
    address: '',
    type: 'house'
  });

  const propertyTypes = [
    { id: 'house' as const, label: 'House', icon: Home },
    { id: 'flat' as const, label: 'Flat', icon: Building },
    { id: 'bungalow' as const, label: 'Bungalow', icon: Mountain }
  ];

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

  const handleAddProperty = () => {
    setShowAddPropertyForm(true);
  };

  const handleSubmitNewProperty = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProperty.address.trim()) return;

    // Create a new property
    const mockProperty: Property = {
      id: `prop-${Date.now()}`,
      address: newProperty.address.trim(),
      type: newProperty.type,
      landlordId: 'landlord-1',
      motStatus: 'pending',
      lastUpdated: new Date().toISOString(),
      nextDue: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 6 months from now
      rooms: [
        { id: `room-${Date.now()}-1`, name: 'Kitchen', type: 'kitchen', inspections: [], checklistItems: [] },
        { id: `room-${Date.now()}-2`, name: 'Living Room', type: 'living-room', inspections: [], checklistItems: [] },
        { id: `room-${Date.now()}-3`, name: 'Bedroom', type: 'bedroom', inspections: [], checklistItems: [] },
        { id: `room-${Date.now()}-4`, name: 'Bathroom', type: 'bathroom', inspections: [], checklistItems: [] }
      ],
      complianceDocuments: [],
      motHistory: []
    };

    // Add the property to the application state
    onAddProperty(mockProperty);
    
    // Reset form and close modal
    setNewProperty({ address: '', type: 'house' });
    setShowAddPropertyForm(false);
  };

  const handleCancelAddProperty = () => {
    setShowAddPropertyForm(false);
    setNewProperty({ address: '', type: 'house' });
  };

  if (showPropertyDetail && selectedProperty) {
    return (
      <PropertyDetail
        property={selectedProperty}
        onBack={onBackFromProperty}
        onDocumentUpload={onDocumentUpload}
        onDocumentDelete={onDocumentDelete}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Property Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your property portfolio and track compliance</p>
      </div>

      {/* Property Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{properties.length}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg">🏠</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">MOT Passed</p>
              <p className="text-2xl font-bold text-green-600">
                {properties.filter(p => p.motStatus === 'passed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Need Review</p>
              <p className="text-2xl font-bold text-orange-600">
                {properties.filter(p => p.motStatus === 'needs-review').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed</p>
              <p className="text-2xl font-bold text-red-600">
                {properties.filter(p => p.motStatus === 'failed').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Properties</h2>
            <button 
              onClick={handleAddProperty}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Property</span>
            </button>
          </div>
        </div>

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
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {property.rooms.length} rooms
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {property.complianceDocuments.length} documents
                        </span>
                      </div>
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
                    <button 
                      onClick={() => onViewProperty(property)}
                      className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {properties.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No properties yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get started by adding your first property to the system
          </p>
          <button 
            onClick={handleAddProperty}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Property</span>
          </button>
        </div>
      )}

      {/* Add Property Modal */}
      {showAddPropertyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Property</h3>
              <button
                onClick={handleCancelAddProperty}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitNewProperty} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Property Address
                </label>
                <textarea
                  value={newProperty.address}
                  onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                  placeholder="Enter the full property address..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Property Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {propertyTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setNewProperty({ ...newProperty, type: type.id })}
                        className={`p-3 border rounded-lg transition-colors ${
                          newProperty.type === type.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-1" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordProperties;