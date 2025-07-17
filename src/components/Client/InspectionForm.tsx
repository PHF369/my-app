import React, { useState } from 'react';
import { ComplianceDocument } from '../../types';
import MOTChecklistForm from './MOTChecklistForm';
import MOTReportViewer from '../Reports/MOTReportViewer';
import { MOTRecord } from '../../types';

interface InspectionFormProps {
  onSubmit: (motRecord: MOTRecord) => void;
  onDocumentUpload?: (document: ComplianceDocument) => void;
}

const InspectionForm: React.FC<InspectionFormProps> = ({ onSubmit, onDocumentUpload }) => {
  const [currentView, setCurrentView] = useState<'inspection' | 'report'>('inspection');
  const [completedMOT, setCompletedMOT] = useState<{ motRecord: MOTRecord; property: any } | null>(null);

  const handleSave = (motRecord: MOTRecord) => {
    console.log('Saving MOT progress:', motRecord);
    // In a real app, this would save to backend
  };

  const handleGenerateReport = (motRecord: MOTRecord, property: any) => {
    setCompletedMOT({ motRecord, property });
    setCurrentView('report');
  };

  const handleSaveAsDocument = () => {
    if (!completedMOT || !onDocumentUpload) return;

    // Show success message
    alert('MOT Report saved as document successfully!');

    // Create a compliance document for the MOT report
    const motDocument: ComplianceDocument = {
      id: `mot-report-${Date.now()}`,
      propertyId: completedMOT.property.id,
      filename: `mot-report-${completedMOT.property.address.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`,
      originalName: `MOT Report - ${completedMOT.property.address} - ${new Date().toLocaleDateString()}`,
      url: '#', // In real app, this would be generated PDF URL
      uploadedByUserId: completedMOT.motRecord.inspectorId,
      uploadedAt: new Date().toISOString(),
      documentType: 'mot-report',
      accessRoles: ['admin', 'landlord', 'client'],
      tags: ['mot', 'inspection', 'report'],
      fileSize: 1024000, // Mock file size
      mimeType: 'application/pdf',
      isArchived: false,
      version: 1,
      description: `MOT inspection report completed on ${new Date().toLocaleDateString()}`
    };

    onDocumentUpload(motDocument);
    
    // Submit the MOT record
    onSubmit(completedMOT.motRecord);
  };

  const handleBackToInspection = () => {
    setCurrentView('inspection');
    setCompletedMOT(null);
  };

  if (currentView === 'report' && completedMOT) {
    return (
      <MOTReportViewer
        motRecord={completedMOT.motRecord}
        property={completedMOT.property}
        onSaveAsDocument={handleSaveAsDocument}
        onBack={handleBackToInspection}
      />
    );
  }

  return (
    <MOTChecklistForm
      onSubmit={onSubmit}
      onSave={handleSave}
      onGenerateReport={handleGenerateReport}
    />
  );
};

export default InspectionForm;