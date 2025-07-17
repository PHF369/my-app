import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ComplianceDocument, Property, DOCUMENT_TYPES } from '../../types';
import { hasPermission, canAccessDocument } from '../../utils/permissions';
import { Upload, Download, Eye, Trash2, Calendar, AlertTriangle, FileText, Plus, Search, Filter } from 'lucide-react';

interface DocumentManagerProps {
  property: Property;
  onDocumentUpload: (document: ComplianceDocument) => void;
  onDocumentDelete: (documentId: string) => void;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ 
  property, 
  onDocumentUpload, 
  onDocumentDelete 
}) => {
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'type' | 'expiry'>('date');

  if (!user) return null;

  const canUpload = hasPermission(user, 'documents', 'create');
  const canDelete = hasPermission(user, 'documents', 'delete');
  const canDownload = hasPermission(user, 'documents', 'download');

  const filteredDocuments = property.complianceDocuments
    .filter(doc => canAccessDocument(user, doc.accessRoles))
    .filter(doc => {
      const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.originalName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || doc.documentType === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.originalName.localeCompare(b.originalName);
        case 'type':
          return a.documentType.localeCompare(b.documentType);
        case 'expiry':
          if (!a.expiryDate && !b.expiryDate) return 0;
          if (!a.expiryDate) return 1;
          if (!b.expiryDate) return -1;
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        default:
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
    });

  const getExpiryStatus = (document: ComplianceDocument) => {
    if (!document.expiryDate) return null;
    
    const expiryDate = new Date(document.expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: 'expired', days: Math.abs(daysUntilExpiry) };
    if (daysUntilExpiry <= 30) return { status: 'expiring', days: daysUntilExpiry };
    return { status: 'valid', days: daysUntilExpiry };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedDocumentType) return;

    // In a real app, this would upload to a storage service
    const newDocument: ComplianceDocument = {
      id: `doc-${Date.now()}`,
      propertyId: property.id,
      filename: `${Date.now()}-${file.name}`,
      originalName: file.name,
      url: URL.createObjectURL(file), // In real app, this would be the uploaded file URL
      uploadedByUserId: user.id,
      uploadedAt: new Date().toISOString(),
      documentType: selectedDocumentType as ComplianceDocument['documentType'],
      accessRoles: user.role === 'admin' ? ['admin', 'landlord', 'client'] : ['admin', 'landlord'],
      tags: [],
      fileSize: file.size,
      mimeType: file.type,
      isArchived: false,
      version: 1
    };

    onDocumentUpload(newDocument);
    setShowUploadModal(false);
    setSelectedDocumentType('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    return '📁';
  };

  const handleViewDocument = (document: ComplianceDocument) => {
    if (document.url.startsWith('blob:') || document.url.startsWith('http')) {
      window.open(document.url, '_blank');
    } else {
      alert('Document preview not available for this file type.');
    }
  };

  const handleDownloadDocument = (document: ComplianceDocument) => {
    const a = document.createElement('a');
    a.href = document.url;
    a.download = document.originalName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Compliance Documents</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Secure storage for property compliance certificates and documents
          </p>
        </div>
        {canUpload && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        )}
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Types</option>
            {Object.entries(DOCUMENT_TYPES).map(([key, type]) => (
              <option key={key} value={key}>{type.label}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="type">Sort by Type</option>
            <option value="expiry">Sort by Expiry</option>
          </select>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((document) => {
          const documentType = DOCUMENT_TYPES[document.documentType];
          const expiryStatus = getExpiryStatus(document);
          
          return (
            <div key={document.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{documentType.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {documentType.label}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      v{document.version}
                    </p>
                  </div>
                </div>
                {expiryStatus && (
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    expiryStatus.status === 'expired' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : expiryStatus.status === 'expiring'
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {expiryStatus.status === 'expired' 
                      ? `Expired ${expiryStatus.days}d ago`
                      : expiryStatus.status === 'expiring'
                      ? `${expiryStatus.days}d left`
                      : 'Valid'
                    }
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-900 dark:text-white font-medium truncate">
                  {document.originalName}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatFileSize(document.fileSize)}</span>
                  <span>{getDocumentIcon(document.mimeType)}</span>
                  <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
                </div>
                {document.expiryDate && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>Expires: {new Date(document.expiryDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewDocument(document)}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                    title="View document"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {canDownload && (
                    <button 
                      onClick={() => handleDownloadDocument(document)}
                      className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                      title="Download document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  {canDelete && (
                    <button 
                      onClick={() => onDocumentDelete(document.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {document.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No documents found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Upload your first compliance document to get started'
            }
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upload Compliance Document
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Document Type
                </label>
                <select
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select document type...</option>
                  {Object.entries(DOCUMENT_TYPES).map(([key, type]) => (
                    <option key={key} value={key}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select File
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  disabled={!selectedDocumentType}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF (Max 10MB)
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedDocumentType('');
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManager;