import React, { useState, useContext, createContext, ReactNode } from 'react';

export interface User {
  role: 'admin' | 'employee';
}

export interface AuthContextType {
  user: User | null;
  login: (role: 'admin' | 'employee') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const login = (role: 'admin' | 'employee') => {
    console.log('LoginFunction called', role);
    setUser({ role });
    console.log('LoginFunction called', role);
  };
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
