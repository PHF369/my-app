import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { DEFAULT_PERMISSIONS } from '../utils/permissions';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  { 
    id: '1', 
    email: 'client@demo.com', 
    role: 'client', 
    name: 'John Inspector',
    permissions: DEFAULT_PERMISSIONS.client
  },
  { 
    id: '2', 
    email: 'landlord@demo.com', 
    role: 'landlord', 
    name: 'Sarah Property',
    permissions: DEFAULT_PERMISSIONS.landlord
  },
  { 
    id: '3', 
    email: 'admin@demo.com', 
    role: 'admin', 
    name: 'Mike Admin',
    permissions: DEFAULT_PERMISSIONS.admin
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('melhado-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      localStorage.setItem('melhado-user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('melhado-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};