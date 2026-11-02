/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Authentication Types & Interfaces
 */

export type UserRole = 
  | 'platform_admin' 
  | 'program_manager' 
  | 'senior_trainer' 
  | 'trainer' 
  | 'trainee' 
  | 'store_auditor';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl: string;
  organization: string;
  designation: string;
  employeeId?: string;
  assignedRegions: string[];
  assignedBrands: string[];
  assignedPrograms: string[];
  joinedDate: string;
  lastLoginAt: string;
  isCustomAccount?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  organization: string;
  assignedRegions: string[];
  assignedBrands: string[];
  agreeTerms: boolean;
}

export interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupFormData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  fastLogin: (role: UserRole) => void;
  updateProfile: (updates: Partial<AuthUser>) => void;
  usersList: AuthUser[];
}
