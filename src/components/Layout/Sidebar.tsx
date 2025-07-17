import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Home, Building, Users, Settings, FileText, BarChart3, Calendar } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'client':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'inspection', label: 'New Inspection', icon: FileText },
          { id: 'history', label: 'History', icon: Calendar },
        ];
      case 'landlord':
        return [
          { id: 'dashboard', label: 'Portfolio', icon: Building },
          { id: 'properties', label: 'Properties', icon: Home },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'properties', label: 'Properties', icon: Building },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-700 z-50">
      <nav className="px-2 py-1">
        <ul className="flex justify-around items-center max-w-md mx-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors min-w-0 ${
                    currentView === item.id
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-800 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-xs font-medium truncate max-w-16 leading-tight">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;