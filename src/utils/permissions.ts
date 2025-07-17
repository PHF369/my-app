import { User, Permission } from '../types';

export const DEFAULT_PERMISSIONS: Record<string, Permission[]> = {
  client: [
    { resource: 'inspections', actions: ['create', 'read', 'update'], scope: 'assigned' },
    { resource: 'properties', actions: ['read'], scope: 'assigned' },
    { resource: 'documents', actions: ['read'], scope: 'assigned' }
  ],
  landlord: [
    { resource: 'properties', actions: ['create', 'read', 'update'], scope: 'own' },
    { resource: 'inspections', actions: ['read'], scope: 'own' },
    { resource: 'documents', actions: ['create', 'read', 'update', 'delete', 'download'], scope: 'own' },
    { resource: 'reports', actions: ['read'], scope: 'own' }
  ],
  admin: [
    { resource: 'properties', actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
    { resource: 'inspections', actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
    { resource: 'documents', actions: ['create', 'read', 'update', 'delete', 'download'], scope: 'all' },
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'], scope: 'all' },
    { resource: 'reports', actions: ['create', 'read', 'update', 'delete'], scope: 'all' }
  ]
};

export const hasPermission = (
  user: User,
  resource: Permission['resource'],
  action: Permission['actions'][0],
  scope?: Permission['scope']
): boolean => {
  if (!user || !user.permissions) return false;

  const permission = user.permissions.find(p => p.resource === resource);
  if (!permission) return false;

  const hasAction = permission.actions.includes(action);
  if (!hasAction) return false;

  if (scope && permission.scope !== 'all' && permission.scope !== scope) {
    return false;
  }

  return true;
};

export const canAccessDocument = (
  user: User,
  documentAccessRoles: string[]
): boolean => {
  if (!user) return false;
  return documentAccessRoles.includes(user.role);
};

export const getPermissionLabel = (resource: string, action: string): string => {
  const labels: Record<string, Record<string, string>> = {
    properties: {
      create: 'Add Properties',
      read: 'View Properties',
      update: 'Edit Properties',
      delete: 'Delete Properties'
    },
    inspections: {
      create: 'Create Inspections',
      read: 'View Inspections',
      update: 'Edit Inspections',
      delete: 'Delete Inspections'
    },
    documents: {
      create: 'Upload Documents',
      read: 'View Documents',
      update: 'Edit Documents',
      delete: 'Delete Documents',
      download: 'Download Documents'
    },
    users: {
      create: 'Add Users',
      read: 'View Users',
      update: 'Edit Users',
      delete: 'Delete Users'
    },
    reports: {
      create: 'Create Reports',
      read: 'View Reports',
      update: 'Edit Reports',
      delete: 'Delete Reports'
    }
  };

  return labels[resource]?.[action] || `${action} ${resource}`;
};