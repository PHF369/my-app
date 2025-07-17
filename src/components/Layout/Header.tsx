import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, LogOut, Bell, User } from 'lucide-react';

interface HeaderProps {
  onNavigateToDashboard: () => void;
  onViewNotifications: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToDashboard, onViewNotifications }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'client': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'landlord': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'admin': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onNavigateToDashboard}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MM</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Melhado</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Property - Maintenance Overview Tracker</p>
              </div>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            <button 
              onClick={onViewNotifications}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900 dark:text-white">{user?.name}</div>
                  <div className="text-gray-500 dark:text-gray-400">{user?.email}</div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user?.role || '')}`}>
                {user?.role?.toUpperCase()}
              </span>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;