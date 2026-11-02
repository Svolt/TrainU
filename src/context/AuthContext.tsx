/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Authentication Context & Session Engine
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, AuthContextType, LoginCredentials, SignupFormData, UserRole } from '../types/auth';

const STORAGE_KEY_AUTH_USER = 'lis_learn_active_session_v1';
const STORAGE_KEY_USERS_DB = 'lis_learn_registered_users_v1';
const STORAGE_KEY_PASSWORDS_DB = 'lis_learn_passwords_v1';

// Seed initial system users
export const DEFAULT_AUTH_USERS: AuthUser[] = [
  {
    id: 'usr-admin-01',
    name: 'Pooja Verma',
    email: 'admin@loveinstore.com',
    phone: '+91 98110 44552',
    role: 'platform_admin',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    organization: 'LoveInStore India Pvt Ltd',
    designation: 'VP - Operations & Learning Systems',
    employeeId: 'LIS-HQ-001',
    assignedRegions: ['North India', 'West India', 'South India', 'East India'],
    assignedBrands: ['Nestlé', 'Mondelez', 'Unilever', 'ITC', 'Haldiram\'s', 'Britannia', 'PepsiCo'],
    assignedPrograms: ['National Onboarding 2025', 'Golden Store Execution', 'FMCG Compliance'],
    joinedDate: '2023-01-15',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'usr-pm-02',
    name: 'Priya Deshmukh',
    email: 'priya.deshmukh@loveinstore.com',
    phone: '+91 98201 33490',
    role: 'program_manager',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    organization: 'LoveInStore India Pvt Ltd',
    designation: 'Operations Program Manager - West',
    employeeId: 'LIS-HQ-014',
    assignedRegions: ['West India', 'Central India'],
    assignedBrands: ['Mondelez', 'ITC', 'Haldiram\'s'],
    assignedPrograms: ['Modern Trade Execution', 'Merchandiser Field Certification'],
    joinedDate: '2023-06-10',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'usr-st-03',
    name: 'Vikram Malhotra',
    email: 'vikram.malhotra@loveinstore.com',
    phone: '+91 99100 22345',
    role: 'senior_trainer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    organization: 'LoveInStore India Pvt Ltd',
    designation: 'Lead Regional Field Trainer',
    employeeId: 'LIS-TR-102',
    assignedRegions: ['North India'],
    assignedBrands: ['Nestlé', 'PepsiCo', 'Britannia'],
    assignedPrograms: ['Chilled Dairy Standards', 'Shelf Share Auditing'],
    joinedDate: '2023-09-01',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'usr-tr-04',
    name: 'Ananya Sen',
    email: 'ananya.sen@loveinstore.com',
    phone: '+91 98305 66781',
    role: 'trainer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    organization: 'LoveInStore India Pvt Ltd',
    designation: 'Field Operations Trainer',
    employeeId: 'LIS-TR-204',
    assignedRegions: ['East India'],
    assignedBrands: ['Unilever', 'Haldiram\'s'],
    assignedPrograms: ['General Trade Basics', 'Secondary Display Compliance'],
    joinedDate: '2024-02-18',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'usr-te-05',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@loveinstore.com',
    phone: '+91 98101 23456',
    role: 'trainee',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    organization: 'LoveInStore Field Force',
    designation: 'Modern Trade Merchandiser',
    employeeId: 'EMP-10023',
    assignedRegions: ['North India'],
    assignedBrands: ['Nestlé'],
    assignedPrograms: ['FMCG Merchandising Onboarding', 'Shelf Stacking Standard'],
    joinedDate: '2024-08-01',
    lastLoginAt: new Date().toISOString()
  }
];

const DEFAULT_PASSWORDS: Record<string, string> = {
  'admin@loveinstore.com': 'password123',
  'priya.deshmukh@loveinstore.com': 'password123',
  'vikram.malhotra@loveinstore.com': 'password123',
  'ananya.sen@loveinstore.com': 'password123',
  'rahul.sharma@loveinstore.com': 'password123'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH_USER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    // Default logged in as Platform Admin for immediate rich experience
    return DEFAULT_AUTH_USERS[0];
  });

  const [usersList, setUsersList] = useState<AuthUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS_DB);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_AUTH_USERS;
  });

  const [passwordsMap, setPasswordsMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PASSWORDS_DB);
      if (saved) {
        return { ...DEFAULT_PASSWORDS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_PASSWORDS;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync users list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(usersList));
    } catch {
      // ignore
    }
  }, [usersList]);

  // Sync passwords to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PASSWORDS_DB, JSON.stringify(passwordsMap));
    } catch {
      // ignore
    }
  }, [passwordsMap]);

  // Sync active user session to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_AUTH_USER);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400)); // Smooth UX transition

    const normalizedEmail = credentials.email.trim().toLowerCase();
    const user = usersList.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      setIsLoading(false);
      return {
        success: false,
        error: `No account found with ${credentials.email}. Please register or check for typos.`
      };
    }

    const expectedPassword = passwordsMap[normalizedEmail] || 'password123';
    // For ease of demo use, any demo account accepts 'password123' or their set password
    const isPasswordCorrect = credentials.password === expectedPassword || credentials.password === 'password123' || credentials.password === 'admin123';

    if (!isPasswordCorrect) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Incorrect password. (Tip: Demo accounts use "password123")'
      };
    }

    const updatedUser: AuthUser = {
      ...user,
      lastLoginAt: new Date().toISOString()
    };

    setCurrentUser(updatedUser);
    setUsersList(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    setIsLoading(false);

    return { success: true };
  };

  const signup = async (data: SignupFormData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500)); // Smooth UX transition

    const normalizedEmail = data.email.trim().toLowerCase();

    // Check duplicate email
    if (usersList.some(u => u.email.toLowerCase() === normalizedEmail)) {
      setIsLoading(false);
      return {
        success: false,
        error: `An account with email ${data.email} already exists. Please log in instead.`
      };
    }

    if (data.password.length < 6) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Password must be at least 6 characters long.'
      };
    }

    if (data.password !== data.confirmPassword) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Passwords do not match. Please re-enter.'
      };
    }

    // Role-specific designations
    const designationMap: Record<UserRole, string> = {
      platform_admin: 'Platform Administrator',
      program_manager: 'Regional Program Operations Lead',
      senior_trainer: 'Senior Field Capability Lead',
      trainer: 'Field Operations Trainer',
      trainee: 'Field Merchandiser Trainee',
      store_auditor: 'Modern Trade Store Auditor'
    };

    // Avatar generation
    const avatarPresets = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
    ];
    const randomAvatar = avatarPresets[Math.floor(Math.random() * avatarPresets.length)];

    const newUser: AuthUser = {
      id: `usr-custom-${Date.now()}`,
      name: data.name.trim(),
      email: normalizedEmail,
      phone: data.phone.trim() || '+91 98000 00000',
      role: data.role,
      avatarUrl: randomAvatar,
      organization: data.organization.trim() || 'LoveInStore Partner Ecosystem',
      designation: designationMap[data.role] || 'Operations Specialist',
      employeeId: `LIS-${Math.floor(1000 + Math.random() * 9000)}`,
      assignedRegions: data.assignedRegions.length > 0 ? data.assignedRegions : ['Pan-India'],
      assignedBrands: data.assignedBrands.length > 0 ? data.assignedBrands : ['Nestlé', 'Mondelez'],
      assignedPrograms: ['Field Onboarding 2025'],
      joinedDate: new Date().toISOString().split('T')[0],
      lastLoginAt: new Date().toISOString(),
      isCustomAccount: true
    };

    // Save password
    setPasswordsMap(prev => ({
      ...prev,
      [normalizedEmail]: data.password
    }));

    // Save user
    setUsersList(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsLoading(false);

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const fastLogin = (role: UserRole) => {
    const targetUser = usersList.find(u => u.role === role) || DEFAULT_AUTH_USERS.find(u => u.role === role) || DEFAULT_AUTH_USERS[0];
    const updated = {
      ...targetUser,
      lastLoginAt: new Date().toISOString()
    };
    setCurrentUser(updated);
  };

  const updateProfile = (updates: Partial<AuthUser>) => {
    if (!currentUser) return;
    const updated: AuthUser = {
      ...currentUser,
      ...updates
    };
    setCurrentUser(updated);
    setUsersList(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        signup,
        logout,
        fastLogin,
        updateProfile,
        usersList
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
