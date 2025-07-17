import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChecklistItem, MOTRecord, Property, Room, ROOM_CHECKLIST_TEMPLATES, GENERAL_PROPERTY_CHECKS } from '../../types';
import { Camera, Upload, Save, CheckCircle, AlertTriangle, Clock, FileText, Home, Building, Mountain, Plus, X, Check, Image } from 'lucide-react';

interface MOTChecklistFormProps {
  property?: Property;
  onSubmit: (motRecord: MOTRecord) => void;
  onSave: (motRecord: MOTRecord) => void;
  onGenerateReport?: (motRecord: MOTRecord, property: Property) => void;
}

const MOTChecklistForm: React.FC<MOTChecklistFormProps> = ({ property, onSubmit, onSave, onGenerateReport }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(property || null);
  const [motRecord, setMOTRecord] = useState<MOTRecord | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string>('general');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showRemoveRoomConfirmModal, setShowRemoveRoomConfirmModal] = useState(false);
  const [roomToRemoveId, setRoomToRemoveId] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<Room['type']>('other');

  // Update room name when room type changes
  const handleRoomTypeChange = (type: Room['type']) => {
    setNewRoomType(type);
    if (type !== 'other') {
      // Auto-populate room name based on type
      const roomTypeLabel = roomTypes.find(rt => rt.id === type)?.label || '';
      setNewRoomName(roomTypeLabel);
    } else {
      // Clear name for custom input
      setNewRoomName('');
    }
  };

  const propertyTypes = [
    { id: 'house', label: 'House', icon: Home },
    { id: 'flat', label: 'Flat', icon: Building },
    { id: 'bungalow', label: 'Bungalow', icon: Mountain }
  ];

  const roomTypes = [
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'bedroom', label: 'Bedroom' },
    { id: 'bathroom', label: 'Bathroom' },
    { id: 'living-room', label: 'Living Room' },
    { id: 'hallway', label: 'Hallway' },
    { id: 'dining-room', label: 'Dining Room' },
    { id: 'utility', label: 'Utility Room' },
    { id: 'conservatory', label: 'Conservatory' },
    { id: 'office', label: 'Office' },
    { id: 'loft', label: 'Loft' },
    { id: 'garden', label: 'Garden' },
    { id: 'other', label: 'Other' }
  ];

  useEffect(() => {
    if (selectedProperty) {
      initializeMOTRecord();
    }
  }, [selectedProperty]);

  const initializeMOTRecord = () => {
    if (!selectedProperty || !user) return;

    const items: ChecklistItem[] = [];

    // Add general property checks
    GENERAL_PROPERTY_CHECKS.forEach(item => {
      items.push({
        id: `general-${Date.now()}-${Math.random()}`,
        label: item.label,
        description: item.description,
        category: item.category as ChecklistItem['category'],
        type: item.type as ChecklistItem['type'],
        required: item.required,
        status: 'pending',
        notes: '',
        mediaFiles: [],
        options: item.options,
        priority: item.priority as ChecklistItem['priority'],
        visualEvidence: {
          applicable: item.hasVisualEvidence || false,
          files: []
        },
        fixtures: {
          applicable: item.hasFixtures || false,
          count: 0,
          type: item.fixturesType || '',
          options: item.fixturesOptions
        },
        damageOrWear: {
          present: false,
          notes: '',
          files: []
        }
      });
    });

    // Add room-specific checks
    selectedProperty.rooms.forEach(room => {
      const roomTemplate = ROOM_CHECKLIST_TEMPLATES[room.type] || ROOM_CHECKLIST_TEMPLATES.other;
      roomTemplate.forEach(item => {
        items.push({
          id: `${room.id}-${Date.now()}-${Math.random()}`,
          roomId: room.id,
          label: item.label,
          description: item.description,
          category: item.category as ChecklistItem['category'],
          type: item.type as ChecklistItem['type'],
          required: item.required,
          status: 'pending',
          notes: '',
          mediaFiles: [],
          options: item.options,
          priority: item.priority as ChecklistItem['priority'],
          visualEvidence: {
            applicable: item.hasVisualEvidence || false,
            files: []
          },
          fixtures: {
            applicable: item.hasFixtures || false,
            count: 0,
            type: item.fixturesType || '',
            options: item.fixturesOptions
          },
          damageOrWear: {
            present: item.hasDamageOrWear || false,
            notes: '',
            files: []
          }
        });
      });
    });

    setChecklistItems(items);

    const newMOTRecord: MOTRecord = {
      id: `mot-${Date.now()}`,
      propertyId: selectedProperty.id,
      inspectorId: user.id,
      startedAt: new Date().toISOString(),
      status: 'in-progress',
      overallResult: 'needs-review',
      checklistItems: items,
      summary: {
        totalItems: items.length,
        completedItems: 0,
        okItems: 0,
        faultItems: 0,
        actionNeededItems: 0,
        criticalIssues: 0
      }
    };

    setMOTRecord(newMOTRecord);
  };

  const addRoom = () => {
    if (!selectedProperty || !newRoomName.trim()) return;

    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: newRoomName.trim(),
      type: newRoomType,
      inspections: [],
      checklistItems: []
    };

    const updatedProperty = {
      ...selectedProperty,
      rooms: [...selectedProperty.rooms, newRoom]
    };

    setSelectedProperty(updatedProperty);

    // Add checklist items for the new room
    const roomTemplate = ROOM_CHECKLIST_TEMPLATES[newRoomType] || ROOM_CHECKLIST_TEMPLATES.other;
    const newItems: ChecklistItem[] = [];

    roomTemplate.forEach(item => {
      newItems.push({
        id: `${newRoom.id}-${Date.now()}-${Math.random()}`,
        roomId: newRoom.id,
        label: item.label,
        description: item.description,
        category: item.category as ChecklistItem['category'],
        type: item.type as ChecklistItem['type'],
        required: item.required,
        status: 'pending',
        notes: '',
        mediaFiles: [],
        options: item.options,
        priority: item.priority as ChecklistItem['priority'],
        visualEvidence: {
          applicable: item.hasVisualEvidence || false,
          files: []
        },
        fixtures: {
          applicable: item.hasFixtures || false,
          count: 0,
          type: item.fixturesType || '',
          options: item.fixturesOptions
        },
        damageOrWear: {
          present: item.hasDamageOrWear || false,
          notes: '',
          files: []
        }
      });
    });

    setChecklistItems(prev => [...prev, ...newItems]);

    if (motRecord) {
      const updatedItems = [...motRecord.checklistItems, ...newItems];
      const summary = calculateSummary(updatedItems);

      setMOTRecord({
        ...motRecord,
        checklistItems: updatedItems,
        summary
      });
    }

    setShowAddRoomModal(false);
    setNewRoomName('');
    setNewRoomType('other');
  };

  const handleRemoveRoom = (roomId: string) => {
    setRoomToRemoveId(roomId);
    setShowRemoveRoomConfirmModal(true);
  };

  const confirmRemoveRoom = () => {
    if (!roomToRemoveId || !selectedProperty) return;

    // Remove room from property
    const updatedProperty = {
      ...selectedProperty,
      rooms: selectedProperty.rooms.filter(room => room.id !== roomToRemoveId)
    };
    setSelectedProperty(updatedProperty);

    // Remove associated checklist items
    const updatedChecklistItems = checklistItems.filter(item => item.roomId !== roomToRemoveId);
    setChecklistItems(updatedChecklistItems);

    // Update MOT record if it exists
    if (motRecord) {
      const updatedMOTItems = motRecord.checklistItems.filter(item => item.roomId !== roomToRemoveId);
      const summary = calculateSummary(updatedMOTItems);

      setMOTRecord({
        ...motRecord,
        checklistItems: updatedMOTItems,
        summary
      });
    }

    // If current room is being removed, switch to general
    if (currentRoom === roomToRemoveId) {
      setCurrentRoom('general');
    }

    // Reset modal state
    setRoomToRemoveId(null);
    setShowRemoveRoomConfirmModal(false);
  };

  const cancelRemoveRoom = () => {
    setRoomToRemoveId(null);
    setShowRemoveRoomConfirmModal(false);
  };

  const updateChecklistItem = (itemId: string, updates: Partial<ChecklistItem>) => {
    setChecklistItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));

    if (motRecord) {
      const updatedItems = motRecord.checklistItems.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      );

      const summary = calculateSummary(updatedItems);

      setMOTRecord({
        ...motRecord,
        checklistItems: updatedItems,
        summary
      });
    }
  };

  const calculateSummary = (items: ChecklistItem[]) => {
    const completedItems = items.filter(item => item.status !== 'pending').length;
    const okItems = items.filter(item => item.status === 'ok').length;
    const faultItems = items.filter(item => item.status === 'fault').length;
    const actionNeededItems = items.filter(item => item.status === 'action-needed').length;
    const criticalIssues = items.filter(item => 
      (item.status === 'fault' || item.status === 'action-needed') && item.priority === 'critical'
    ).length;

    return {
      totalItems: items.length,
      completedItems,
      okItems,
      faultItems,
      actionNeededItems,
      criticalIssues
    };
  };

  const handlePropertyTypeSelect = (type: string) => {
    // In a real app, this would create or select a property
    const mockProperty: Property = {
      id: `prop-${Date.now()}`,
      address: '',
      type: type as Property['type'],
      landlordId: 'landlord-1',
      motStatus: 'pending',
      lastUpdated: new Date().toISOString(),
      nextDue: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      rooms: [],
      complianceDocuments: [],
      motHistory: []
    };
    setSelectedProperty(mockProperty);
    setCurrentStep(1);
  };

  const handleAddressSubmit = (address: string) => {
    if (selectedProperty) {
      setSelectedProperty({ ...selectedProperty, address });
      setCurrentStep(2);
    }
  };

  const getRoomsAndGeneral = () => {
    const rooms = selectedProperty?.rooms || [];
    return [
      { id: 'general', name: 'General Property', type: 'general' as const },
      ...rooms
    ];
  };

  const getRoomItems = (roomId: string) => {
    if (roomId === 'general') {
      return checklistItems.filter(item => !item.roomId);
    }
    return checklistItems.filter(item => item.roomId === roomId);
  };

  const getRoomProgress = (roomId: string) => {
    const items = getRoomItems(roomId);
    const completed = items.filter(item => item.status !== 'pending').length;
    return items.length > 0 ? (completed / items.length) * 100 : 0;
  };

  const handleSaveProgress = () => {
    if (!motRecord) return;
    
    // Show success message
    setSaveMessage('Progress saved successfully!');
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setSaveMessage('');
    }, 3000);
    
    // Call the original onSave prop
    onSave(motRecord);
  };

  const handleFileUpload = (itemId: string, isVisualEvidence: boolean = true) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const mediaFile = {
          id: `media-${Date.now()}`,
          url,
          type: 'image' as const,
          filename: file.name,
          uploadedAt: new Date().toISOString(),
          fileSize: file.size,
          mimeType: file.type,
          checklistItemId: itemId
        };

        updateChecklistItem(itemId, (prev) => {
          if (isVisualEvidence) {
            return {
              visualEvidence: {
                ...prev.visualEvidence,
                files: [...prev.visualEvidence.files, mediaFile]
              }
            };
          } else {
            return {
              damageOrWear: {
                ...prev.damageOrWear,
                files: [...prev.damageOrWear.files, mediaFile]
              }
            };
          }
        });
      }
    };
    input.click();
  };

  const handleTakePhoto = (itemId: string, isVisualEvidence: boolean = true) => {
    // For demo purposes, we'll use the same file input but with camera capture preference
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // This suggests using the rear camera on mobile devices
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const mediaFile = {
          id: `media-${Date.now()}`,
          url,
          type: 'image' as const,
          filename: `photo-${Date.now()}.jpg`,
          uploadedAt: new Date().toISOString(),
          fileSize: file.size,
          mimeType: file.type,
          checklistItemId: itemId
        };

        updateChecklistItem(itemId, (prev) => {
          if (isVisualEvidence) {
            return {
              visualEvidence: {
                ...prev.visualEvidence,
                files: [...prev.visualEvidence.files, mediaFile]
              }
            };
          } else {
            return {
              damageOrWear: {
                ...prev.damageOrWear,
                files: [...prev.damageOrWear.files, mediaFile]
              }
            };
          }
        });
      }
    };
    input.click();
  };

  const getOverallProgress = () => {
    if (!motRecord) return 0;
    return motRecord.summary.totalItems > 0 
      ? (motRecord.summary.completedItems / motRecord.summary.totalItems) * 100 
      : 0;
  };

  const handleSubmitMOT = () => {
    if (!motRecord) return;

    const finalRecord: MOTRecord = {
      ...motRecord,
      completedAt: new Date().toISOString(),
      status: 'completed',
      submittedAt: new Date().toISOString(),
      overallResult: motRecord.summary.criticalIssues > 0 ? 'failed' : 
                    motRecord.summary.faultItems > 0 ? 'needs-review' : 'passed'
    };

    if (onGenerateReport && selectedProperty) {
      onGenerateReport(finalRecord, selectedProperty);
    } else {
      onSubmit(finalRecord);
    }
  };

  const renderPropertyTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select Property Type</h2>
        <p className="text-gray-600 dark:text-gray-400">Choose the type of property for MOT inspection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {
          propertyTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handlePropertyTypeSelect(type.id)}
                className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
              >
                <Icon className="w-12 h-12 mx-auto mb-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{type.label}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select this property type to begin MOT inspection
                </p>
              </button>
            );
          })
        }
      </div>
    </div>
  );

  const renderChecklistItem = (item: ChecklistItem) => {
    return (
      <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">{item.label}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              item.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
              item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            }`}>
              {item.priority.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Status Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <div className="flex space-x-2">
            {['ok', 'fault', 'action-needed', 'not-applicable'].map(status => (
              <button
                key={status}
                onClick={() => updateChecklistItem(item.id, { status: status as ChecklistItem['status'] })}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.status === status
                    ? status === 'ok' ? 'bg-green-500 text-white' :
                      status === 'fault' ? 'bg-red-500 text-white' :
                      status === 'action-needed' ? 'bg-orange-500 text-white' :
                      'bg-gray-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {status.replace('-', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
          <textarea
            value={item.notes}
            onChange={(e) => updateChecklistItem(item.id, { notes: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            rows={3}
            placeholder="Add any additional notes..."
          />
        </div>

        {/* Visual Evidence */}
        {item.visualEvidence.applicable && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Visual Evidence</label>
            <div className="flex space-x-2 mb-2">
              <button
                onClick={() => handleTakePhoto(item.id, true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo</span>
              </button>
              <button
                onClick={() => handleFileUpload(item.id, true)}
                className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
              </button>
            </div>
            {item.visualEvidence.files.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {item.visualEvidence.files.map(file => (
                  <div key={file.id} className="relative">
                    <img
                      src={file.url}
                      alt={file.filename}
                      className="w-full h-16 object-cover rounded border"
                    />
                    <button
                      onClick={() => updateChecklistItem(item.id, {
                        visualEvidence: {
                          ...item.visualEvidence,
                          files: item.visualEvidence.files.filter(f => f.id !== file.id)
                        }
                      })}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Fixtures */}
        {item.fixtures.applicable && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fixtures ({item.fixtures.type.replace('-', ' ')})
            </label>
            <input
              type="number"
              value={item.fixtures.count}
              onChange={(e) => updateChecklistItem(item.id, {
                fixtures: { ...item.fixtures, count: parseInt(e.target.value) || 0 }
              })}
              className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              min="0"
            />
          </div>
        )}

        {/* Damage/Wear */}
        <div className="mb-4">
          <label className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={item.damageOrWear.present}
              onChange={(e) => updateChecklistItem(item.id, {
                damageOrWear: { ...item.damageOrWear, present: e.target.checked }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Damage or wear present</span>
          </label>
          
          {item.damageOrWear.present && (
            <div className="space-y-2">
              <textarea
                value={item.damageOrWear.notes}
                onChange={(e) => updateChecklistItem(item.id, {
                  damageOrWear: { ...item.damageOrWear, notes: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                rows={2}
                placeholder="Describe the damage or wear..."
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleTakePhoto(item.id, false)}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  <Camera className="w-4 h-4" />
                  <span>Photo Evidence</span>
                </button>
                <button
                  onClick={() => handleFileUpload(item.id, false)}
                  className="flex items-center space-x-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Evidence</span>
                </button>
              </div>
              {item.damageOrWear.files.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {item.damageOrWear.files.map(file => (
                    <div key={file.id} className="relative">
                      <img
                        src={file.url}
                        alt={file.filename}
                        className="w-full h-16 object-cover rounded border border-red-200"
                      />
                      <button
                        onClick={() => updateChecklistItem(item.id, {
                          damageOrWear: {
                            ...item.damageOrWear,
                            files: item.damageOrWear.files.filter(f => f.id !== file.id)
                          }
                        })}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderInspectionInterface = () => {
    if (!selectedProperty || !motRecord) return null;

    const roomsAndGeneral = getRoomsAndGeneral();
    const currentRoomItems = getRoomItems(currentRoom);
    const currentRoomData = roomsAndGeneral.find(r => r.id === currentRoom);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MOT Inspection</h1>
              <p className="text-gray-600 dark:text-gray-400">{selectedProperty.address}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
              <div className="text-2xl font-bold text-blue-600">{Math.round(getOverallProgress())}%</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${getOverallProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Room Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Inspection Areas</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAddRoomModal(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Room</span>
              </button>
              <button
                onClick={handleSaveProgress}
                className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Progress</span>
              </button>
            </div>
          </div>
          
          {saveMessage && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-200">{saveMessage}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {roomsAndGeneral.map(room => {
              const progress = getRoomProgress(room.id);
              const isActive = currentRoom === room.id;
              return (
                <button
                  key={room.id}
                  onClick={() => setCurrentRoom(room.id)}
                  className={`p-3 rounded-lg border transition-colors relative ${
                    isActive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-sm font-medium truncate">{room.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {Math.round(progress)}% complete
                  </div>
                  {room.id !== 'general' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveRoom(room.id);
                      }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Room Checklist */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {currentRoomData?.name} Checklist
          </h2>
          
          {currentRoomItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No checklist items for this area.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentRoomItems.map(renderChecklistItem)}
            </div>
          )}
        </div>

        {/* Submit Button */}
        {motRecord.summary.completedItems === motRecord.summary.totalItems && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Inspection Complete!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                All checklist items have been completed. You can now generate the final report.
              </p>
              <button
                onClick={handleSubmitMOT}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Generate MOT Report
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Main render logic
  if (currentStep === 0) {
    return renderPropertyTypeSelection();
  }

  if (currentStep === 1) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Property Address</h2>
          <p className="text-gray-600 dark:text-gray-400">Enter the full address of the property to inspect</p>
        </div>

        <div className="max-w-md mx-auto">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const address = formData.get('address') as string;
            if (address.trim()) {
              handleAddressSubmit(address.trim());
            }
          }}>
            <textarea
              name="address"
              placeholder="Enter property address..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              rows={3}
              required
            />
            <button
              type="submit"
              className="w-full mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Continue to Inspection
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return renderInspectionInterface();
  }

  return null;
};

export default MOTChecklistForm;