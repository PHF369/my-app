import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import ClientDashboard from './components/Client/ClientDashboard';
import InspectionForm from './components/Client/InspectionForm';
import { MOTRecord, ComplianceDocument } from './types';
import LandlordDashboard from './components/Landlord/LandlordDashboard';
import LandlordProperties from './components/Landlord/LandlordProperties';
import LandlordReports from './components/Landlord/LandlordReports';
import AdminDashboard from './components/Admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [propertyDocuments, setPropertyDocuments] = useState<ComplianceDocument[]>([]);
  
  // Landlord-specific state
  const [properties, setProperties] = useState([
    {
      id: '1',
      address: '123 Main St, London SW1A 1AA',
      type: 'house' as const,
      landlordId: 'landlord-1',
      motStatus: 'passed' as const,
      lastUpdated: '2024-01-15',
      nextDue: '2024-07-15',
      issues: 0,
      rooms: [
        { id: 'room-1', name: 'Kitchen', type: 'kitchen' as const, inspections: [], checklistItems: [] },
        { id: 'room-2', name: 'Living Room', type: 'living-room' as const, inspections: [], checklistItems: [] },
        { id: 'room-3', name: 'Bedroom 1', type: 'bedroom' as const, inspections: [], checklistItems: [] },
        { id: 'room-4', name: 'Bedroom 2', type: 'bedroom' as const, inspections: [], checklistItems: [] },
        { id: 'room-5', name: 'Bathroom', type: 'bathroom' as const, inspections: [], checklistItems: [] },
        { id: 'room-6', name: 'Hallway', type: 'hallway' as const, inspections: [], checklistItems: [] }
      ],
      complianceDocuments: [
        {
          id: 'doc-1',
          propertyId: '1',
          filename: 'epc-123-main-st.pdf',
          originalName: 'EPC Certificate - 123 Main St',
          url: '#',
          uploadedByUserId: 'landlord-1',
          uploadedAt: '2023-01-15T00:00:00Z',
          documentType: 'epc-certificate' as const,
          expiryDate: '2033-01-15',
          epcRating: 'B' as const,
          epcScore: 82,
          accessRoles: ['admin', 'landlord', 'client'] as const,
          tags: ['epc', 'energy', 'certificate'],
          fileSize: 1024000,
          mimeType: 'application/pdf',
          isArchived: false,
          version: 1
        },
        {
          id: 'doc-2',
          propertyId: '1',
          filename: 'gas-safety-123-main-st.pdf',
          originalName: 'Gas Safety Certificate - 123 Main St',
          url: '#',
          uploadedAt: '2024-01-15T00:00:00Z',
          documentType: 'gas-safety',
          expiryDate: '2025-01-15',
          accessRoles: ['admin', 'landlord', 'client'],
          tags: ['gas', 'safety', 'certificate'],
          fileSize: 512000,
          mimeType: 'application/pdf',
          isArchived: false,
          version: 1
        },
        {
          id: 'doc-3',
          propertyId: '1',
          filename: 'electrical-123-main-st.pdf',
          originalName: 'Electrical Installation Report - 123 Main St',
          url: '#',
          uploadedByUserId: 'landlord-1',
          uploadedAt: '2019-06-15T00:00:00Z',
          documentType: 'electrical-report',
          expiryDate: '2024-06-15',
          accessRoles: ['admin', 'landlord', 'client'],
          tags: ['electrical', 'safety', 'report'],
          fileSize: 2048000,
          mimeType: 'application/pdf',
          isArchived: false,
          version: 1
        }
      ],
      motHistory: []
    },
    {
      id: '2',
      address: '456 Oak Ave, Manchester M1 1AA',
      type: 'flat',
      landlordId: 'landlord-1',
      motStatus: 'needs-review',
      lastUpdated: '2024-01-12',
      nextDue: '2024-07-12',
      rooms: [
        { id: 'room-7', name: 'Kitchen', type: 'kitchen', inspections: [], checklistItems: [] },
        { id: 'room-8', name: 'Living Room', type: 'living-room', inspections: [], checklistItems: [] },
        { id: 'room-9', name: 'Bedroom', type: 'bedroom', inspections: [], checklistItems: [] },
        { id: 'room-10', name: 'Bathroom', type: 'bathroom', inspections: [], checklistItems: [] }
      ],
      assignedInspector: 'inspector-2',
      complianceDocuments: [
        {
          id: 'doc-4',
          propertyId: '2',
          filename: 'epc-456-oak-ave.pdf',
          originalName: 'EPC Certificate - 456 Oak Ave',
          url: '#',
          uploadedByUserId: 'landlord-1',
          uploadedAt: '2022-03-10T00:00:00Z',
          documentType: 'epc-certificate',
          expiryDate: '2032-03-10',
          epcRating: 'C',
          epcScore: 68,
          accessRoles: ['admin', 'landlord', 'client'],
          tags: ['epc', 'energy', 'certificate'],
          fileSize: 1024000,
          mimeType: 'application/pdf',
          isArchived: false,
          version: 1
        },
        {
          id: 'doc-5',
          propertyId: '2',
          filename: 'gas-safety-456-oak-ave.pdf',
          originalName: 'Gas Safety Certificate - 456 Oak Ave',
          url: '#',
          uploadedByUserId: 'landlord-1',
          uploadedAt: '2024-02-01T00:00:00Z',
          documentType: 'gas-safety',
          expiryDate: '2024-04-01',
          accessRoles: ['admin', 'landlord', 'client'],
          tags: ['gas', 'safety', 'certificate'],
          fileSize: 512000,
          mimeType: 'application/pdf',
          isArchived: false,
          version: 1
        }
      ],
      motHistory: []
    },
    {
      id: '3',
      address: '789 Pine Rd, Birmingham B1 1AA',
      type: 'bungalow',
      landlordId: 'landlord-1',
      motStatus: 'failed',
      lastUpdated: '2024-01-10',
      nextDue: '2024-07-10',
      rooms: [
        { id: 'room-11', name: 'Kitchen', type: 'kitchen', inspections: [], checklistItems: [] },
        { id: 'room-12', name: 'Living Room', type: 'living-room', inspections: [], checklistItems: [] },
        { id: 'room-13', name: 'Bedroom 1', type: 'bedroom', inspections: [], checklistItems: [] },
        { id: 'room-14', name: 'Bedroom 2', type: 'bedroom', inspections: [], checklistItems: [] },
        { id: 'room-15', name: 'Bathroom', type: 'bathroom', inspections: [], checklistItems: [] }
      ],
      assignedInspector: 'inspector-3',
      complianceDocuments: [
        {
          id: 'doc-6',
          propertyId: '3',
          filename: 'epc-789-pine-rd.pdf',
          originalName: 'EPC Certificate - 789 Pine Rd',
          url: '#',
          uploadedByUserId: 'landlord-1',
          uploadedAt: '2021-08-20T00:00:00Z',
          documentType: 'epc-certificate',
          expiryDate: '2031-08-20',
          epcRating: 'D',
          epcScore: 55,
          accessRoles: ['admin', 'landlord', 'client'],
          tags: ['epc', 'energy', 'certificate'],
          fileSize: 1024000,
          mimeType: 'application/pdf',
          isArchived: false,
          version: 1
        },
        {
          id: 'doc-7',
          propertyId: '3',
          filename: 'insurance-789-pine-rd.pdf',
          originalName: 'Property Insurance - 789 Pine Rd',
          url: '#',
          uploadedByUserId: 'landlord-1',
          uploadedAt: '2024-01-01T00:00:00Z',
          documentType: 'insurance',
          expiryDate: '2024-03-01',
          accessRoles: ['admin', 'landlord'],
          tags: ['insurance', 'property'],
          fileSize: 256000,
          mimeType: 'application/pdf',
          isArchived: false,
          version: 1
        }
      ],
      motHistory: []
    }
  ]);
  
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">MM</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const handleDocumentUpload = (document: ComplianceDocument) => {
    setPropertyDocuments(prev => [...prev, document]);
    console.log('Document uploaded:', document);
    // In real app, this would save to backend
  };

  const handleLandlordDocumentUpload = (document: ComplianceDocument) => {
    setProperties(prev => prev.map(property => 
      property.id === document.propertyId 
        ? { ...property, complianceDocuments: [...property.complianceDocuments, document] }
        : property
    ));
  };

  const handleLandlordDocumentDelete = (documentId: string) => {
    setProperties(prev => prev.map(property => ({
      ...property,
      complianceDocuments: property.complianceDocuments.filter(doc => doc.id !== documentId)
    })));
  };

  const handleAddProperty = (newProperty: Property) => {
    setProperties(prev => [...prev, newProperty]);
  };

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyDetail(true);
  };

  const handleBackFromProperty = () => {
    setShowPropertyDetail(false);
    setSelectedProperty(null);
  };
  const renderContent = () => {
    switch (user.role) {
      case 'client':
        switch (currentView) {
          case 'inspection':
            return <InspectionForm 
              onSubmit={(motRecord: MOTRecord) => {
              console.log('MOT submitted:', motRecord);
              // In real app, submit to backend and show success message
              setCurrentView('dashboard');
              }} 
              onDocumentUpload={handleDocumentUpload}
            />;
          case 'history':
            return <div className="p-6"><h2 className="text-xl font-bold">Inspection History</h2></div>;
          case 'notifications':
            return (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Urgent Actions & Notifications</h2>
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 dark:text-red-200">Overdue Inspection</h3>
                    <p className="text-red-600 dark:text-red-300">Property at 456 Oak Ave requires immediate inspection</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">Certificate Expiring</h3>
                    <p className="text-orange-600 dark:text-orange-300">Gas safety certificate expires in 5 days</p>
                  </div>
                </div>
              </div>
            );
          default:
            return <ClientDashboard onStartInspection={() => setCurrentView('inspection')} />;
        }
      case 'landlord':
        switch (currentView) {
          case 'properties':
            return (
              <LandlordProperties
                properties={properties}
                selectedProperty={selectedProperty}
                showPropertyDetail={showPropertyDetail}
                onViewProperty={handleViewProperty}
                onBackFromProperty={handleBackFromProperty}
                onDocumentUpload={handleLandlordDocumentUpload}
                onDocumentDelete={handleLandlordDocumentDelete}
                onAddProperty={handleAddProperty}
              />
            );
          case 'reports':
            return <LandlordReports properties={properties} />;
          case 'settings':
            return (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Landlord Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Settings</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                        Update Profile Information
                      </button>
                      <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                        Change Password
                      </button>
                      <button className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                        Manage Notifications
                      </button>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Property Settings</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                        Default Inspection Settings
                      </button>
                      <button className="w-full text-left p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors">
                        Document Templates
                      </button>
                      <button className="w-full text-left p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                        Compliance Reminders
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          case 'notifications':
            return (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Urgent Actions & Notifications</h2>
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 dark:text-red-200">Certificate Expired</h3>
                    <p className="text-red-600 dark:text-red-300">Gas safety certificate for 789 Pine Rd has expired</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">MOT Due Soon</h3>
                    <p className="text-orange-600 dark:text-orange-300">3 properties require MOT inspection within 30 days</p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Document Renewal</h3>
                    <p className="text-yellow-600 dark:text-yellow-300">EPC certificates need renewal for 2 properties</p>
                  </div>
                </div>
              </div>
            );
          default:
            return <LandlordDashboard properties={properties} onViewProperty={handleViewProperty} />;
        }
      case 'admin':
        switch (currentView) {
          case 'users':
            return <div className="p-6"><h2 className="text-xl font-bold">User Management</h2></div>;
          case 'properties':
            return <div className="p-6"><h2 className="text-xl font-bold">Property Management</h2></div>;
          case 'reports':
            return <div className="p-6"><h2 className="text-xl font-bold">System Reports</h2></div>;
          case 'settings':
            return (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">System Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Configuration</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                        General Settings
                      </button>
                      <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                        Email Configuration
                      </button>
                      <button className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                        Backup Settings
                      </button>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security & Audit</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                        Security Settings
                      </button>
                      <button className="w-full text-left p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                        Audit Logs
                      </button>
                      <button className="w-full text-left p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                        Access Control
                      </button>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Maintenance</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors">
                        Database Maintenance
                      </button>
                      <button className="w-full text-left p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                        System Updates
                      </button>
                      <button className="w-full text-left p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors">
                        Performance Monitoring
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          case 'notifications':
            return (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">System Notifications & Alerts</h2>
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 dark:text-red-200">System Alert</h3>
                    <p className="text-red-600 dark:text-red-300">Database backup failed - requires immediate attention</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">User Activity</h3>
                    <p className="text-orange-600 dark:text-orange-300">15 new user registrations pending approval</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">System Update</h3>
                    <p className="text-blue-600 dark:text-blue-300">New system update available for deployment</p>
                  </div>
                </div>
              </div>
            );
          default:
            return <AdminDashboard />;
        }
      default:
        return <div className="p-6"><h2 className="text-xl font-bold">Dashboard</h2></div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
      <Header onNavigateToDashboard={() => setCurrentView('dashboard')} onViewNotifications={() => setCurrentView('notifications')} />
      <div className="flex-1 flex flex-col min-h-0">
        <main className="flex-1 overflow-y-auto pb-20">
          <div className="p-4 md:p-6">
            {renderContent()}
          </div>
        </main>
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;