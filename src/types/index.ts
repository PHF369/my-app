export interface User {
  id: string;
  email: string;
  role: 'client' | 'landlord' | 'admin';
  name: string;
  avatar?: string;
  permissions: Permission[];
}

export interface Permission {
  resource: 'properties' | 'inspections' | 'documents' | 'users' | 'reports';
  actions: ('create' | 'read' | 'update' | 'delete' | 'download')[];
  scope?: 'own' | 'assigned' | 'all';
}

export interface Property {
  id: string;
  address: string;
  type: 'house' | 'flat' | 'bungalow';
  landlordId: string;
  motStatus: 'passed' | 'failed' | 'needs-review' | 'pending' | 'overdue';
  lastUpdated: string;
  nextDue: string;
  rooms: Room[];
  assignedInspector?: string;
  complianceDocuments: ComplianceDocument[];
  motHistory: MOTRecord[];
}

export interface Room {
  id: string;
  name: string;
  type: 'kitchen' | 'bedroom' | 'bathroom' | 'living-room' | 'loft' | 'garden' | 'hallway' | 'dining-room' | 'utility' | 'conservatory' | 'office' | 'other';
  inspections: Inspection[];
  lastInspected?: string;
  checklistItems: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  roomId?: string;
  label: string;
  description: string;
  category: 'general' | 'kitchen' | 'bedroom' | 'bathroom' | 'living-room' | 'loft' | 'garden' | 'safety' | 'electrical' | 'plumbing' | 'heating';
  type: 'boolean' | 'text' | 'media' | 'count' | 'dropdown';
  required: boolean;
  status: 'ok' | 'fault' | 'action-needed' | 'not-applicable' | 'pending';
  notes: string;
  mediaFiles: MediaFile[];
  value?: string | number;
  options?: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastChecked?: string;
  checkedBy?: string;
  // Three main inspection focus areas
  visualEvidence: {
    applicable: boolean;
    files: MediaFile[];
  };
  fixtures: {
    applicable: boolean;
    count: number;
    type: string;
    options?: string[];
  };
  damageOrWear: {
    present: boolean;
    notes: string;
    files: MediaFile[];
  };
}

export interface MOTRecord {
  id: string;
  propertyId: string;
  inspectorId: string;
  startedAt: string;
  completedAt?: string;
  status: 'in-progress' | 'completed' | 'submitted' | 'approved' | 'rejected';
  overallResult: 'passed' | 'failed' | 'needs-review';
  checklistItems: ChecklistItem[];
  summary: {
    totalItems: number;
    completedItems: number;
    okItems: number;
    faultItems: number;
    actionNeededItems: number;
    criticalIssues: number;
  };
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface ComplianceDocument {
  id: string;
  propertyId: string;
  filename: string;
  originalName: string;
  url: string;
  uploadedByUserId: string;
  uploadedAt: string;
  documentType: 'gas-safety' | 'electrical-report' | 'epc-certificate' | 'fire-safety' | 'insurance' | 'tenancy-agreement' | 'inventory' | 'mot-report' | 'other';
  expiryDate?: string;
  epcRating?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  epcScore?: number;
  accessRoles: ('client' | 'landlord' | 'admin')[];
  tags: string[];
  fileSize: number;
  mimeType: string;
  isArchived: boolean;
  version: number;
  description?: string;
}

export interface Inspection {
  id: string;
  roomId: string;
  propertyId: string;
  inspectorId: string;
  timestamp: string;
  visualEvidence: {
    applicable: boolean;
    files: MediaFile[];
  };
  fixtures: {
    applicable: boolean;
    count: number;
    type: string;
  };
  damageOrWear: {
    present: boolean;
    notes: string;
    files: MediaFile[];
  };
  safetyChecks: SafetyCheck[];
  status: 'ok' | 'fault' | 'action-needed';
}

export interface SafetyCheck {
  id: string;
  type: 'fire-alarm' | 'smoke-detector' | 'carbon-monoxide' | 'boiler' | 'electrical' | 'gas' | 'water-pressure' | 'heating' | 'ventilation' | 'other';
  status: 'ok' | 'fault' | 'action-needed' | 'not-applicable';
  notes: string;
  lastChecked: string;
  nextDue?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video' | 'document';
  filename: string;
  uploadedAt: string;
  description?: string;
  fileSize: number;
  mimeType: string;
  checklistItemId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'mot-due' | 'inspection-complete' | 'issue-flagged' | 'document-expiry' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

// MOT Checklist Templates
export const ROOM_CHECKLIST_TEMPLATES = {
  kitchen: [
    {
      label: 'Kitchen Sink Condition',
      description: 'Check taps, drainage, and overall condition',
      category: 'kitchen' as const,
      type: 'dropdown' as const,
      options: ['Excellent', 'Good', 'Needs repair', 'Replace required'],
      required: true,
      priority: 'medium' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'taps',
      hasDamageOrWear: true
    },
    {
      label: 'Kitchen Appliances',
      description: 'Built-in appliances functionality',
      category: 'kitchen' as const,
      type: 'text' as const,
      required: false,
      priority: 'medium' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'appliances',
      hasDamageOrWear: true
    },
    {
      label: 'Electrical Sockets',
      description: 'Count and condition of electrical outlets',
      category: 'kitchen' as const,
      type: 'count' as const,
      required: true,
      priority: 'high' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'sockets',
      hasDamageOrWear: true
    },
    {
      label: 'Gas Safety (if applicable)',
      description: 'Gas connections and safety checks',
      category: 'kitchen' as const,
      type: 'dropdown' as const,
      options: ['Safe', 'Needs attention', 'Unsafe', 'Not applicable'],
      required: true,
      priority: 'critical' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'gas-connections',
      hasDamageOrWear: true
    },
    {
      label: 'Ventilation',
      description: 'Kitchen ventilation and extraction',
      category: 'kitchen' as const,
      type: 'dropdown' as const,
      options: ['Adequate', 'Poor', 'Not working'],
      required: true,
      priority: 'medium' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'ventilation',
      hasDamageOrWear: true
    },
    {
      label: 'Lighting',
      description: 'Kitchen lighting adequacy and functionality',
      category: 'kitchen' as const,
      type: 'boolean' as const,
      required: true,
      priority: 'medium' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'lights',
      hasDamageOrWear: true
    }
  ],
  bedroom: [
    {
      label: 'Window Condition',
      description: 'Windows, locks, and opening mechanisms',
      category: 'bedroom' as const,
      type: 'dropdown' as const,
      options: ['Excellent', 'Good', 'Needs attention', 'Poor'],
      required: true,
      priority: 'medium' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'windows',
      hasDamageOrWear: true
    },
    {
      label: 'Electrical Sockets',
      description: 'Count and condition of electrical outlets',
      category: 'bedroom' as const,
      type: 'count' as const,
      required: true,
      priority: 'medium' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'sockets',
      hasDamageOrWear: true
    },
    {
      label: 'Lighting',
      description: 'Bedroom lighting adequacy and functionality',
      category: 'bedroom' as const,
      type: 'boolean' as const,
      required: true,
      priority: 'medium' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'lights',
      hasDamageOrWear: true
    },
    {
      label: 'Heating',
      description: 'Radiator or heating system functionality',
      category: 'bedroom' as const,
      type: 'dropdown' as const,
      options: ['Working well', 'Adequate', 'Poor', 'Not working'],
      required: true,
      priority: 'medium' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'radiator',
      hasDamageOrWear: true
    },
    {
      label: 'Flooring Condition',
      description: 'Carpet, laminate, or other flooring condition',
      category: 'bedroom' as const,
      type: 'dropdown' as const,
      options: ['Excellent', 'Good', 'Fair', 'Poor', 'Needs replacement'],
      required: true,
      priority: 'low' as const,
      hasVisualEvidence: true,
      hasFixtures: false,
      hasDamageOrWear: true
    }
  ],
  bathroom: [
    {
      label: 'Toilet Functionality',
      description: 'Flush mechanism and overall condition',
      category: 'bathroom' as const,
      type: 'dropdown' as const,
      options: ['Working well', 'Minor issues', 'Major repair needed'],
      required: true,
      priority: 'high' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'toilet',
      hasDamageOrWear: true
    },
    {
      label: 'Bath/Shower Condition',
      description: 'Taps, drainage, and sealing',
      category: 'bathroom' as const,
      type: 'dropdown' as const,
      options: ['Excellent', 'Good', 'Needs attention', 'Poor'],
      required: true,
      priority: 'high' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'bath-shower',
      hasDamageOrWear: true
    },
    {
      label: 'Water Pressure',
      description: 'Hot and cold water pressure',
      category: 'bathroom' as const,
      type: 'dropdown' as const,
      options: ['Excellent', 'Good', 'Adequate', 'Poor'],
      required: true,
      priority: 'medium' as const,
      hasVisualEvidence: false,
      hasFixtures: true,
      fixturesType: 'taps',
      hasDamageOrWear: false
    },
    {
      label: 'Bathroom Ventilation',
      description: 'Extractor fan and natural ventilation',
      category: 'bathroom' as const,
      type: 'boolean' as const,
      required: true,
      priority: 'medium' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'ventilation',
      hasDamageOrWear: true
    },
    {
      label: 'Electrical Safety',
      description: 'Bathroom electrical installations safety',
      category: 'bathroom' as const,
      type: 'dropdown' as const,
      options: ['Safe', 'Needs attention', 'Unsafe'],
      required: true,
      priority: 'critical' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'electrical',
      hasDamageOrWear: true
    }
  ],
  'living-room': [
    {
      label: 'Window Condition',
      description: 'Windows, locks, and opening mechanisms',
      category: 'living-room' as const,
      type: 'dropdown' as const,
      options: ['Excellent', 'Good', 'Needs attention', 'Poor'],
      required: true,
      priority: 'medium' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'windows',
      hasDamageOrWear: true
    },
    {
      label: 'Electrical Sockets',
      description: 'Count and condition of electrical outlets',
      category: 'living-room' as const,
      type: 'count' as const,
      required: true,
      priority: 'medium' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'sockets',
      hasDamageOrWear: true
    },
    {
      label: 'Heating System',
      description: 'Radiator or heating system functionality',
      category: 'living-room' as const,
      type: 'dropdown' as const,
      options: ['Working well', 'Adequate', 'Poor', 'Not working'],
      required: true,
      priority: 'medium' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'radiator',
      hasDamageOrWear: true
    },
    {
      label: 'Flooring Condition',
      description: 'Carpet, laminate, or other flooring condition',
      category: 'living-room' as const,
      type: 'dropdown' as const,
      options: ['Excellent', 'Good', 'Fair', 'Poor', 'Needs replacement'],
      required: true,
      priority: 'low' as const,
      hasVisualEvidence: true,
      hasFixtures: false,
      hasDamageOrWear: true
    }
  ],
  hallway: [
    {
      label: 'Lighting',
      description: 'Hallway lighting adequacy and functionality',
      category: 'general' as const,
      type: 'boolean' as const,
      required: true,
      priority: 'medium' as const,
      hasVisualEvidence: true,
      hasFixtures: true,
      fixturesType: 'lights',
      hasDamageOrWear: true
    },
    {
      label: 'Flooring Condition',
      description: 'Carpet, laminate, or other flooring condition',
      category: 'general' as const,
      type: 'dropdown' as const,
      options: ['Excellent', 'Good', 'Fair', 'Poor', 'Needs replacement'],
      required: true,
      priority: 'low' as const,
      hasVisualEvidence: true,
      hasFixtures: false,
      hasDamageOrWear: true
    }
  ],
  other: [
    {
      label: 'General Condition',
      description: 'Overall condition of the space',
      category: 'general' as const,
      type: 'dropdown' as const,
      options: ['Excellent', 'Good', 'Fair', 'Poor'],
      required: true,
      priority: 'medium' as const,
      hasVisualEvidence: true,
      hasFixtures: false,
      hasDamageOrWear: true
    },
    {
      label: 'Safety Considerations',
      description: 'Any safety concerns or considerations',
      category: 'safety' as const,
      type: 'text' as const,
      required: false,
      priority: 'high' as const,
      hasVisualEvidence: true,
      hasFixtures: false,
      hasDamageOrWear: true
    }
  ]
};

// General property checks that apply to all properties
export const GENERAL_PROPERTY_CHECKS = [
  {
    label: 'Property Address Verification',
    description: 'Confirm property address matches records',
    category: 'general' as const,
    type: 'boolean' as const,
    required: true,
    priority: 'high' as const,
    hasVisualEvidence: true,
    hasFixtures: false,
    hasDamageOrWear: false
  },
  {
    label: 'External Property Condition',
    description: 'Overall external condition assessment',
    category: 'general' as const,
    type: 'dropdown' as const,
    options: ['Excellent', 'Good', 'Fair', 'Poor'],
    required: true,
    priority: 'medium' as const,
    hasVisualEvidence: true,
    hasFixtures: false,
    hasDamageOrWear: true
  },
  {
    label: 'Smoke Detectors',
    description: 'Test all smoke detection devices',
    category: 'safety' as const,
    type: 'dropdown' as const,
    options: ['All working', 'Some not working', 'None working', 'Not installed'],
    required: true,
    priority: 'critical' as const,
    hasVisualEvidence: true,
    hasFixtures: true,
    fixturesType: 'smoke-detectors',
    hasDamageOrWear: true
  },
  {
    label: 'Carbon Monoxide Detectors',
    description: 'Test CO detectors where required',
    category: 'safety' as const,
    type: 'dropdown' as const,
    options: ['All working', 'Some not working', 'None working', 'Not required'],
    required: true,
    priority: 'critical' as const,
    hasVisualEvidence: true,
    hasFixtures: true,
    fixturesType: 'co-detectors',
    hasDamageOrWear: true
  }
];

export const MOT_CHECKLIST_TEMPLATES = {
  house: [
    // General Property Checks
    {
      category: 'general',
      items: [
        { 
          label: 'Property Address Verification', 
          description: 'Confirm property address matches records', 
          type: 'boolean', 
          required: true, 
          priority: 'high',
          hasVisualEvidence: true,
          hasFixtures: false,
          hasDamageOrWear: false
        },
        { 
          label: 'External Property Condition', 
          description: 'Overall external condition assessment', 
          type: 'dropdown', 
          options: ['Excellent', 'Good', 'Fair', 'Poor'], 
          required: true, 
          priority: 'medium',
          hasVisualEvidence: true,
          hasFixtures: false,
          hasDamageOrWear: true
        },
        { 
          label: 'Garden/Outdoor Space', 
          description: 'Condition of garden, paths, and outdoor areas', 
          type: 'dropdown', 
          options: ['Well maintained', 'Adequate', 'Needs attention', 'Poor condition', 'Not applicable'], 
          required: false, 
          priority: 'low',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'outdoor-features',
          hasDamageOrWear: true
        },
        { 
          label: 'Parking/Access', 
          description: 'Vehicle access and parking availability', 
          type: 'text', 
          required: false, 
          priority: 'low',
          hasVisualEvidence: true,
          hasFixtures: false,
          hasDamageOrWear: true
        }
      ]
    },
    // Kitchen Checks
    {
      category: 'kitchen',
      items: [
        { 
          label: 'Kitchen Sink Condition', 
          description: 'Check taps, drainage, and overall condition', 
          type: 'dropdown', 
          options: ['Excellent', 'Good', 'Needs repair', 'Replace required'], 
          required: true, 
          priority: 'medium',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'taps',
          hasDamageOrWear: true
        },
        { 
          label: 'Kitchen Appliances', 
          description: 'Built-in appliances functionality', 
          type: 'text', 
          required: false, 
          priority: 'medium',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'appliances',
          hasDamageOrWear: true
        },
        { 
          label: 'Electrical Sockets', 
          description: 'Count and condition of electrical outlets', 
          type: 'count', 
          required: true, 
          priority: 'high',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'sockets',
          hasDamageOrWear: true
        },
        { 
          label: 'Gas Safety (if applicable)', 
          description: 'Gas connections and safety checks', 
          type: 'dropdown', 
          options: ['Safe', 'Needs attention', 'Unsafe', 'Not applicable'], 
          required: true, 
          priority: 'critical',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'gas-connections',
          hasDamageOrWear: true
        },
        { 
          label: 'Ventilation', 
          description: 'Kitchen ventilation and extraction', 
          type: 'dropdown', 
          options: ['Adequate', 'Poor', 'Not working'], 
          required: true, 
          priority: 'medium',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'ventilation',
          hasDamageOrWear: true
        },
        { 
          label: 'Lighting', 
          description: 'Kitchen lighting adequacy and functionality', 
          type: 'boolean', 
          required: true, 
          priority: 'medium',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'lights',
          hasDamageOrWear: true
        }
      ]
    },
    // Bathroom Checks
    {
      category: 'bathroom',
      items: [
        { 
          label: 'Toilet Functionality', 
          description: 'Flush mechanism and overall condition', 
          type: 'dropdown', 
          options: ['Working well', 'Minor issues', 'Major repair needed'], 
          required: true, 
          priority: 'high',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'toilet',
          hasDamageOrWear: true
        },
        { 
          label: 'Bath/Shower Condition', 
          description: 'Taps, drainage, and sealing', 
          type: 'dropdown', 
          options: ['Excellent', 'Good', 'Needs attention', 'Poor'], 
          required: true, 
          priority: 'high',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'bath-shower',
          hasDamageOrWear: true
        },
        { 
          label: 'Water Pressure', 
          description: 'Hot and cold water pressure', 
          type: 'dropdown', 
          options: ['Excellent', 'Good', 'Adequate', 'Poor'], 
          required: true, 
          priority: 'medium',
          hasVisualEvidence: false,
          hasFixtures: true,
          fixturesType: 'taps',
          hasDamageOrWear: false
        },
        { 
          label: 'Bathroom Ventilation', 
          description: 'Extractor fan and natural ventilation', 
          type: 'boolean', 
          required: true, 
          priority: 'medium',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'ventilation',
          hasDamageOrWear: true
        },
        { 
          label: 'Electrical Safety', 
          description: 'Bathroom electrical installations safety', 
          type: 'dropdown', 
          options: ['Safe', 'Needs attention', 'Unsafe'], 
          required: true, 
          priority: 'critical',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'electrical',
          hasDamageOrWear: true
        }
      ]
    },
    // Safety Checks
    {
      category: 'safety',
      items: [
        { 
          label: 'Smoke Detectors', 
          description: 'Test all smoke detection devices', 
          type: 'dropdown', 
          options: ['All working', 'Some not working', 'None working', 'Not installed'], 
          required: true, 
          priority: 'critical',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'smoke-detectors',
          hasDamageOrWear: true
        },
        { 
          label: 'Carbon Monoxide Detectors', 
          description: 'Test CO detectors where required', 
          type: 'dropdown', 
          options: ['All working', 'Some not working', 'None working', 'Not required'], 
          required: true, 
          priority: 'critical',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'co-detectors',
          hasDamageOrWear: true
        },
        { 
          label: 'Fire Extinguisher/Blanket', 
          description: 'Fire safety equipment availability', 
          type: 'boolean', 
          required: false, 
          priority: 'medium',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'fire-equipment',
          hasDamageOrWear: true
        },
        { 
          label: 'Emergency Exits', 
          description: 'Clear and accessible emergency exits', 
          type: 'boolean', 
          required: true, 
          priority: 'critical',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'exits',
          hasDamageOrWear: true
        },
        { 
          label: 'Electrical Safety Certificate', 
          description: 'Valid electrical safety documentation', 
          type: 'boolean', 
          required: true, 
          priority: 'critical',
          hasVisualEvidence: true,
          hasFixtures: false,
          hasDamageOrWear: false
        }
      ]
    },
    // Electrical Checks
    {
      category: 'electrical',
      items: [
        { 
          label: 'Consumer Unit/Fuse Box', 
          description: 'Main electrical panel condition and labeling', 
          type: 'dropdown', 
          options: ['Modern and safe', 'Adequate', 'Needs upgrade', 'Unsafe'], 
          required: true, 
          priority: 'critical',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'fuse-box',
          hasDamageOrWear: true
        },
        { 
          label: 'RCD Protection', 
          description: 'Residual Current Device functionality', 
          type: 'boolean', 
          required: true, 
          priority: 'critical',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'rcd',
          hasDamageOrWear: true
        },
        { 
          label: 'Socket Outlets', 
          description: 'Condition of electrical sockets throughout property', 
          type: 'dropdown', 
          options: ['All good', 'Some issues', 'Many issues'], 
          required: true, 
          priority: 'high',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'sockets',
          hasDamageOrWear: true
        },
        { 
          label: 'Light Switches', 
          description: 'Functionality of light switches', 
          type: 'dropdown', 
          options: ['All working', 'Some not working', 'Many not working'], 
          required: true, 
          priority: 'medium',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'switches',
          hasDamageOrWear: true
        },
        { 
          label: 'Outdoor Electrical', 
          description: 'External electrical installations', 
          type: 'dropdown', 
          options: ['Safe', 'Needs attention', 'Unsafe', 'Not applicable'], 
          required: false, 
          priority: 'medium',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'outdoor-electrical',
          hasDamageOrWear: true
        }
      ]
    },
    // Heating Checks
    {
      category: 'heating',
      items: [
        { 
          label: 'Boiler Condition', 
          description: 'Central heating boiler functionality and safety', 
          type: 'dropdown', 
          options: ['Excellent', 'Good', 'Needs service', 'Needs replacement'], 
          required: true, 
          priority: 'high',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'boiler',
          hasDamageOrWear: true
        },
        { 
          label: 'Radiators', 
          description: 'Heating radiators throughout property', 
          type: 'dropdown', 
          options: ['All working well', 'Some issues', 'Many not working'], 
          required: true, 
          priority: 'medium',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'radiators',
          hasDamageOrWear: true
        },
        { 
          label: 'Thermostat', 
          description: 'Heating control system', 
          type: 'boolean', 
          required: true, 
          priority: 'medium',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'thermostat',
          hasDamageOrWear: true
        },
        { 
          label: 'Hot Water System', 
          description: 'Hot water availability and temperature', 
          type: 'dropdown', 
          options: ['Excellent', 'Good', 'Adequate', 'Poor'], 
          required: true, 
          priority: 'high',
          hasVisualEvidence: true,
          hasFixtures: true,
          fixturesType: 'hot-water',
          hasDamageOrWear: true
        }
      ]
    }
  ],
  flat: [
    // Similar structure but adapted for flats
    {
      category: 'general',
      items: [
        { label: 'Flat Number/Floor Verification', description: 'Confirm flat details and floor level', type: 'text', required: true, priority: 'high' },
        { label: 'Communal Area Access', description: 'Access to communal areas and facilities', type: 'boolean', required: false, priority: 'low' },
        { label: 'Balcony/Terrace (if applicable)', description: 'Condition of private outdoor space', type: 'dropdown', options: ['Good condition', 'Needs attention', 'Safety concerns', 'Not applicable'], required: false, priority: 'medium' }
      ]
    }
    // ... other categories similar to house but adapted
  ],
  bungalow: [
    // Similar structure but adapted for bungalows
    {
      category: 'general',
      items: [
        { label: 'Single Level Access', description: 'Accessibility throughout single-level property', type: 'boolean', required: true, priority: 'medium' },
        { label: 'Roof Access/Condition', description: 'Roof accessibility and condition (if accessible)', type: 'dropdown', options: ['Good', 'Needs attention', 'Not accessible'], required: false, priority: 'low' }
      ]
    }
    // ... other categories
  ]
};

export const DOCUMENT_TYPES = {
  'gas-safety': { label: 'Gas Safety Certificate', icon: '🔥', required: true, renewalPeriod: 12 },
  'electrical-report': { label: 'Electrical Installation Report', icon: '⚡', required: true, renewalPeriod: 60 },
  'epc-certificate': { label: 'Energy Performance Certificate', icon: '🏠', required: true, renewalPeriod: 120 },
  'fire-safety': { label: 'Fire Safety Certificate', icon: '🚨', required: false, renewalPeriod: 12 },
  'insurance': { label: 'Property Insurance', icon: '🛡️', required: true, renewalPeriod: 12 },
  'tenancy-agreement': { label: 'Tenancy Agreement', icon: '📄', required: false, renewalPeriod: null },
  'inventory': { label: 'Property Inventory', icon: '📋', required: false, renewalPeriod: null },
  'mot-report': { label: 'MOT Inspection Report', icon: '📊', required: false, renewalPeriod: 6 },
  'other': { label: 'Other Document', icon: '📁', required: false, renewalPeriod: null }
};