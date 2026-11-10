import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../lib/types';
import { db } from '../lib/database';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  registerClient: (data: { fullName: string; businessName: string; email: string; phone: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRoleForDemo: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'nunc_active_auth_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default to Super Admin for immediate testing convenience if desired, or null
    return {
      id: 'usr-admin-1',
      email: 'admin@nuncbusinesssolutions.ph',
      fullName: 'NUNC Super Administrator',
      businessName: 'NUNC Business Solutions',
      phone: '09161669188',
      role: 'super_admin',
      departmentId: 'dept-1',
      createdAt: '2026-11-01T00:00:00Z',
      status: 'active'
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  const login = async (email: string, preferredRole?: UserRole): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const snapshot = db.getSnapshot();

    // Check staff/admin roster
    const staffMatch = snapshot.staff.find(s => s.email.toLowerCase() === cleanEmail);
    if (staffMatch) {
      const profile: UserProfile = {
        id: staffMatch.userId || staffMatch.id,
        email: staffMatch.email,
        fullName: staffMatch.fullName,
        businessName: 'NUNC Business Solutions',
        phone: staffMatch.phone,
        role: staffMatch.role,
        departmentId: staffMatch.departmentId,
        createdAt: '2026-11-01T00:00:00Z',
        status: staffMatch.status === 'inactive' ? 'suspended' : 'active'
      };
      setUser(profile);
      return { success: true };
    }

    // Check client roster
    const clientMatch = snapshot.clients.find(c => c.email.toLowerCase() === cleanEmail);
    if (clientMatch) {
      const profile: UserProfile = {
        id: clientMatch.id,
        email: clientMatch.email,
        fullName: clientMatch.fullName,
        businessName: clientMatch.businessName,
        phone: clientMatch.phone,
        role: 'client',
        createdAt: clientMatch.createdAt,
        status: 'active'
      };
      setUser(profile);
      return { success: true };
    }

    // Fallback: if preferredRole is provided or new client
    const fallbackProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      fullName: cleanEmail.split('@')[0],
      role: preferredRole || 'client',
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    setUser(fallbackProfile);
    return { success: true };
  };

  const registerClient = async (data: { fullName: string; businessName: string; email: string; phone: string }): Promise<{ success: boolean; error?: string }> => {
    const current = db.getSnapshot();
    const exists = current.clients.some(c => c.email.toLowerCase() === data.email.trim().toLowerCase());
    if (exists) {
      return { success: false, error: 'An account with this email address already exists. Please log in.' };
    }

    const newClientId = `cli-${Date.now()}`;
    const newClientRecord = {
      id: newClientId,
      userId: `usr-${Date.now()}`,
      fullName: data.fullName,
      businessName: data.businessName,
      email: data.email.trim().toLowerCase(),
      phone: data.phone,
      totalBilledPhp: 0,
      totalPaidPhp: 0,
      totalBilledUsd: 0,
      totalPaidUsd: 0,
      activeProjectsCount: 0,
      createdAt: new Date().toISOString()
    };

    // Add to clients list
    current.clients.push(newClientRecord);
    localStorage.setItem('nunc_business_solutions_db_v1', JSON.stringify(current));
    window.dispatchEvent(new Event('nunc_db_updated'));

    const profile: UserProfile = {
      id: newClientId,
      email: newClientRecord.email,
      fullName: newClientRecord.fullName,
      businessName: newClientRecord.businessName,
      phone: newClientRecord.phone,
      role: 'client',
      createdAt: newClientRecord.createdAt,
      status: 'active'
    };
    setUser(profile);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const switchRoleForDemo = (newRole: UserRole) => {
    if (newRole === 'super_admin') {
      setUser({
        id: 'usr-admin-1',
        email: 'admin@nuncbusinesssolutions.ph',
        fullName: 'NUNC Super Administrator',
        businessName: 'NUNC Business Solutions',
        phone: '09161669188',
        role: 'super_admin',
        departmentId: 'dept-1',
        createdAt: '2026-11-01T00:00:00Z',
        status: 'active'
      });
    } else if (newRole === 'staff') {
      setUser({
        id: 'usr-staff-2',
        email: 'staff.carl@nuncbusinesssolutions.ph',
        fullName: 'Carl Mendoza',
        businessName: 'NUNC Business Solutions',
        phone: '09175551234',
        role: 'staff',
        departmentId: 'dept-2',
        positionId: 'Senior Full-Stack Engineer',
        createdAt: '2026-11-01T00:00:00Z',
        status: 'active'
      });
    } else {
      setUser({
        id: 'cli-apex',
        email: 'client.acme@example.com',
        fullName: 'David Ramos',
        businessName: 'Apex Logistics Corporation',
        phone: '09171234567',
        role: 'client',
        createdAt: '2026-11-02T00:00:00Z',
        status: 'active'
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: Boolean(user),
        login,
        registerClient,
        logout,
        switchRoleForDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
