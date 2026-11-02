/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Monetra Visual Style Authentication Screen
 * Complete Login & Signup with Role-Based Scopes & Fast Demo Presets
 */

import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  Building,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  KeyRound,
  Layers,
  GraduationCap,
  Users,
  Award
} from 'lucide-react';
import { useAuth, DEFAULT_AUTH_USERS } from '../../context/AuthContext';
import { UserRole, SignupFormData } from '../../types/auth';

const AVAILABLE_BRANDS = [
  'Nestlé',
  'Mondelez',
  'Unilever',
  'ITC Limited',
  'Haldiram\'s',
  'Britannia',
  'PepsiCo',
  'Dabur'
];

const AVAILABLE_REGIONS = [
  'North India',
  'West India',
  'South India',
  'East India',
  'Central India',
  'Pan-India'
];

interface AuthScreenProps {
  onSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const { login, signup, fastLogin, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState<string>('admin@loveinstore.com');
  const [signInPassword, setSignInPassword] = useState<string>('password123');
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Sign Up Form State
  const [signupForm, setSignupForm] = useState<SignupFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'senior_trainer',
    organization: 'LoveInStore Operations',
    assignedRegions: ['North India'],
    assignedBrands: ['Nestlé', 'Mondelez'],
    agreeTerms: true
  });

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    if (!signInEmail.trim() || !signInPassword) {
      setErrorMessage('Please enter both your work email and password.');
      return;
    }

    const res = await login({
      email: signInEmail,
      password: signInPassword,
      rememberMe
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
    } else {
      if (onSuccess) onSuccess();
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    if (!signupForm.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!signupForm.email.trim()) {
      setErrorMessage('Please enter your corporate email address.');
      return;
    }
    if (!signupForm.password) {
      setErrorMessage('Please create a secure password.');
      return;
    }
    if (signupForm.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setErrorMessage('The passwords entered do not match.');
      return;
    }
    if (signupForm.assignedBrands.length === 0) {
      setErrorMessage('Please select at least one assigned FMCG client brand.');
      return;
    }
    if (!signupForm.agreeTerms) {
      setErrorMessage('Please accept the LoveInStore Field Compliance and Operational Terms.');
      return;
    }

    const res = await signup(signupForm);

    if (!res.success) {
      setErrorMessage(res.error || 'Registration failed.');
    } else {
      setSuccessNotice('Account successfully created! Loading workspace...');
      if (onSuccess) onSuccess();
    }
  };

  const toggleBrand = (brand: string) => {
    setSignupForm(prev => {
      const exists = prev.assignedBrands.includes(brand);
      if (exists) {
        if (prev.assignedBrands.length === 1) return prev; // keep at least 1
        return { ...prev, assignedBrands: prev.assignedBrands.filter(b => b !== brand) };
      } else {
        return { ...prev, assignedBrands: [...prev.assignedBrands, brand] };
      }
    });
  };

  const toggleRegion = (region: string) => {
    setSignupForm(prev => {
      const exists = prev.assignedRegions.includes(region);
      if (exists) {
        if (prev.assignedRegions.length === 1) return prev;
        return { ...prev, assignedRegions: prev.assignedRegions.filter(r => r !== region) };
      } else {
        return { ...prev, assignedRegions: [...prev.assignedRegions, region] };
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F1F2F5] text-[#17191B] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 font-sans antialiased">
      {/* Background ambient accents */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(23,25,27,0.1)] border border-[#E3E6E8] bg-white">
        
        {/* Left / Hero Branding Panel (Monetra Deep Surface #101411) */}
        <div className="lg:col-span-5 bg-[#101411] p-8 sm:p-10 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#A6F52F]/10 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#A6F52F]/5 blur-2xl pointer-events-none rounded-full" />

          {/* Top Brand Bar */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#A6F52F] flex items-center justify-center text-[#101411] font-black text-xl shadow-[0_0_20px_rgba(166,245,47,0.3)]">
                L
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight block">
                  LOVEINSTORE
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A6F52F] block">
                  Learn Operations
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1A211A] text-[#A6F52F] border border-[#293629]">
                <Shield className="w-3.5 h-3.5" />
                Enterprise Field Auth v1.0
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Retail execution & field training intelligence.
              </h1>
              <p className="text-xs text-[#B8C0B8] leading-relaxed">
                Centralized operations for trainers, supervisors, program leads, and 10,000+ FMCG retail field merchandisers across India.
              </p>
            </div>
          </div>

          {/* Middle Metric Highlights */}
          <div className="my-8 space-y-3 relative z-10">
            <div className="p-3.5 rounded-2xl bg-[#1A211A] border border-[#293629] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#101411] flex items-center justify-center text-[#A6F52F]">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-[#73777D] uppercase font-semibold">Active Merchandisers</p>
                  <p className="text-sm font-bold text-white tabular-nums">12,480 Active</p>
                </div>
              </div>
              <span className="text-[10px] text-[#A6F52F] font-bold bg-[#A6F52F]/10 px-2 py-0.5 rounded-full">
                +14% MoM
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#1A211A] border border-[#293629] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#101411] flex items-center justify-center text-[#A6F52F]">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-[#73777D] uppercase font-semibold">National Readiness Index</p>
                  <p className="text-sm font-bold text-[#A6F52F] tabular-nums">84.2% Certified</p>
                </div>
              </div>
              <span className="text-[10px] text-[#B8C0B8]">Audited</span>
            </div>
          </div>

          {/* Bottom Fast-Login Personas Picker */}
          <div className="relative z-10 pt-4 border-t border-[#1A211A]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#73777D] mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A6F52F]" />
              Quick 1-Click Fast Login:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  fastLogin('platform_admin');
                  if (onSuccess) onSuccess();
                }}
                className="px-2.5 py-1.5 bg-[#1A211A] hover:bg-[#293629] text-left rounded-xl border border-[#293629] transition-all cursor-pointer group"
              >
                <p className="text-[11px] font-semibold text-white group-hover:text-[#A6F52F] truncate">
                  Platform Admin
                </p>
                <p className="text-[9px] text-[#73777D] truncate">Pooja Verma (HQ)</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  fastLogin('program_manager');
                  if (onSuccess) onSuccess();
                }}
                className="px-2.5 py-1.5 bg-[#1A211A] hover:bg-[#293629] text-left rounded-xl border border-[#293629] transition-all cursor-pointer group"
              >
                <p className="text-[11px] font-semibold text-white group-hover:text-[#A6F52F] truncate">
                  Program Manager
                </p>
                <p className="text-[9px] text-[#73777D] truncate">Priya Deshmukh (West)</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  fastLogin('senior_trainer');
                  if (onSuccess) onSuccess();
                }}
                className="px-2.5 py-1.5 bg-[#1A211A] hover:bg-[#293629] text-left rounded-xl border border-[#293629] transition-all cursor-pointer group"
              >
                <p className="text-[11px] font-semibold text-white group-hover:text-[#A6F52F] truncate">
                  Senior Trainer
                </p>
                <p className="text-[9px] text-[#73777D] truncate">Vikram Malhotra</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  fastLogin('trainee');
                  if (onSuccess) onSuccess();
                }}
                className="px-2.5 py-1.5 bg-[#1A211A] hover:bg-[#293629] text-left rounded-xl border border-[#293629] transition-all cursor-pointer group"
              >
                <p className="text-[11px] font-semibold text-white group-hover:text-[#A6F52F] truncate">
                  Field Merchandiser
                </p>
                <p className="text-[9px] text-[#73777D] truncate">Rahul Sharma</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right / Interactive Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-10 bg-white flex flex-col justify-center">
          {/* Segmented Control Pill Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="bg-[#ECEEF0] p-1 rounded-full flex items-center">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setErrorMessage(null);
                }}
                className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'signin'
                    ? 'bg-[#101411] text-white shadow-xs'
                    : 'text-[#73777D] hover:text-[#17191B]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setErrorMessage(null);
                }}
                className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-[#101411] text-white shadow-xs'
                    : 'text-[#73777D] hover:text-[#17191B]'
                }`}
              >
                Create Account
              </button>
            </div>

            <span className="text-[11px] text-[#A1A5AA] font-mono hidden sm:inline">
              LoveInStore Security
            </span>
          </div>

          {/* Feedback Banners */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-[#FDF0F0] border border-[#FAD2D2] text-[#E56C6C] text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {successNotice && (
            <div className="mb-5 p-3.5 rounded-2xl bg-[#E9FBD1] border border-[#C6F586] text-[#17191B] text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#17191B]" />
              <div className="flex-1 font-semibold">{successNotice}</div>
            </div>
          )}

          {/* SIGN IN TAB */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-[#17191B]">
                  Welcome back to LIS Learn
                </h2>
                <p className="text-xs text-[#73777D] mt-1">
                  Enter your assigned LoveInStore staff credentials to access operational controls.
                </p>
              </div>

              {/* Work Email */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-[#17191B] block">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A1A5AA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={e => setSignInEmail(e.target.value)}
                    placeholder="name@loveinstore.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F8F9F8] rounded-full border border-[#ECEEF0] text-xs font-medium text-[#17191B] focus:outline-none focus:border-[#A6F52F] focus:ring-2 focus:ring-[#A6F52F]/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#17191B] block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSignInPassword('password123');
                      setErrorMessage(null);
                    }}
                    className="text-[11px] font-medium text-[#73777D] hover:text-[#17191B] transition-colors cursor-pointer"
                  >
                    Auto-fill demo password
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A1A5AA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={e => setSignInPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#F8F9F8] rounded-full border border-[#ECEEF0] text-xs font-medium text-[#17191B] focus:outline-none focus:border-[#A6F52F] focus:ring-2 focus:ring-[#A6F52F]/20 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A1A5AA] hover:text-[#17191B] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#101411] border-[#ECEEF0] focus:ring-[#A6F52F]"
                  />
                  <span className="text-xs font-medium text-[#73777D]">
                    Remember workstation session
                  </span>
                </label>
                <span className="text-xs text-[#A1A5AA] font-mono">
                  Default: password123
                </span>
              </div>

              {/* Submit Pill Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-6 rounded-full bg-[#A6F52F] hover:bg-[#97E327] text-[#101411] font-bold text-xs tracking-tight shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="inline-block animate-spin mr-2">⟳</span>
                  ) : null}
                  <span>Sign In to Learn Operations</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Preset Selector */}
              <div className="pt-4 border-t border-[#ECEEF0]">
                <p className="text-[11px] font-medium text-[#73777D] mb-2 text-center">
                  Or select a demo email to load automatically:
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {DEFAULT_AUTH_USERS.slice(0, 4).map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setSignInEmail(u.email);
                        setSignInPassword('password123');
                        setErrorMessage(null);
                      }}
                      className="px-2.5 py-1 bg-[#F8F9F8] hover:bg-[#ECEEF0] text-[10px] font-medium text-[#17191B] rounded-full border border-[#ECEEF0] transition-colors cursor-pointer"
                    >
                      {u.name.split(' ')[0]} ({u.role.replace('_', ' ')})
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* SIGN UP TAB */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-[#17191B]">
                  Register Staff / Trainer Profile
                </h2>
                <p className="text-xs text-[#73777D] mt-1">
                  Create a new operational account with specific FMCG brand scopes and territory roles.
                </p>
              </div>

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#17191B] block">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#A1A5AA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={signupForm.name}
                      onChange={e => setSignupForm({ ...signupForm, name: e.target.value })}
                      placeholder="e.g. Ramesh Joshi"
                      className="w-full pl-10 pr-4 py-2 bg-[#F8F9F8] rounded-full border border-[#ECEEF0] text-xs font-medium text-[#17191B] focus:outline-none focus:border-[#A6F52F] focus:ring-2 focus:ring-[#A6F52F]/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#17191B] block">
                    Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#A1A5AA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={signupForm.email}
                      onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
                      placeholder="ramesh.j@partner.com"
                      className="w-full pl-10 pr-4 py-2 bg-[#F8F9F8] rounded-full border border-[#ECEEF0] text-xs font-medium text-[#17191B] focus:outline-none focus:border-[#A6F52F] focus:ring-2 focus:ring-[#A6F52F]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Phone & Org */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#17191B] block">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#A1A5AA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={signupForm.phone}
                      onChange={e => setSignupForm({ ...signupForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2 bg-[#F8F9F8] rounded-full border border-[#ECEEF0] text-xs font-medium text-[#17191B] focus:outline-none focus:border-[#A6F52F] focus:ring-2 focus:ring-[#A6F52F]/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#17191B] block">
                    Organization / Agency
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#A1A5AA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={signupForm.organization}
                      onChange={e => setSignupForm({ ...signupForm, organization: e.target.value })}
                      placeholder="LoveInStore Partner Agency"
                      className="w-full pl-10 pr-4 py-2 bg-[#F8F9F8] rounded-full border border-[#ECEEF0] text-xs font-medium text-[#17191B] focus:outline-none focus:border-[#A6F52F] focus:ring-2 focus:ring-[#A6F52F]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Operational Role Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#17191B] block">
                  Operational Role (RBAC Scope) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { role: 'trainer', title: 'Trainer', desc: 'Batches, Sessions & Attendance' },
                    { role: 'senior_trainer', title: 'Senior Trainer', desc: 'Programs, Q&A & Retraining' },
                    { role: 'program_manager', title: 'Program Lead', desc: 'Regional assignments & KPIs' },
                    { role: 'platform_admin', title: 'Admin', desc: 'Master controls & Policies' },
                    { role: 'store_auditor', title: 'Store Auditor', desc: 'Checklists & Shelf Audits' },
                    { role: 'trainee', title: 'Trainee', desc: 'Assigned Courses & Scores' }
                  ].map(item => {
                    const isSelected = signupForm.role === item.role;
                    return (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => setSignupForm({ ...signupForm, role: item.role as UserRole })}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#101411] text-white border-[#101411]'
                            : 'bg-[#F8F9F8] hover:bg-[#ECEEF0] text-[#17191B] border-[#ECEEF0]'
                        }`}
                      >
                        <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#A6F52F]' : 'text-[#17191B]'}`}>
                          {item.title}
                        </p>
                        <p className={`text-[10px] mt-0.5 leading-tight ${isSelected ? 'text-[#B8C0B8]' : 'text-[#73777D]'}`}>
                          {item.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Assigned Brands (Pill Multi-select) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#17191B] block">
                  Assigned FMCG Client Brands * (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_BRANDS.map(brand => {
                    const selected = signupForm.assignedBrands.includes(brand);
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => toggleBrand(brand)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                          selected
                            ? 'bg-[#101411] text-[#A6F52F] border-[#101411]'
                            : 'bg-white text-[#73777D] border-[#ECEEF0] hover:border-[#CBD0D5]'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '}{brand}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Assigned Regions */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#17191B] block">
                  Assigned Operating Region(s) *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_REGIONS.map(reg => {
                    const selected = signupForm.assignedRegions.includes(reg);
                    return (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => toggleRegion(reg)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                          selected
                            ? 'bg-[#E9FBD1] text-[#17191B] font-semibold border-[#A6F52F]'
                            : 'bg-white text-[#73777D] border-[#ECEEF0] hover:border-[#CBD0D5]'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '}{reg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#17191B] block">
                    Create Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={signupForm.password}
                    onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-2 bg-[#F8F9F8] rounded-full border border-[#ECEEF0] text-xs font-medium text-[#17191B] focus:outline-none focus:border-[#A6F52F] focus:ring-2 focus:ring-[#A6F52F]/20 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#17191B] block">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={signupForm.confirmPassword}
                    onChange={e => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    placeholder="Repeat password"
                    className="w-full px-4 py-2 bg-[#F8F9F8] rounded-full border border-[#ECEEF0] text-xs font-medium text-[#17191B] focus:outline-none focus:border-[#A6F52F] focus:ring-2 focus:ring-[#A6F52F]/20 font-mono"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={signupForm.agreeTerms}
                    onChange={e => setSignupForm({ ...signupForm, agreeTerms: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded text-[#101411] border-[#ECEEF0] focus:ring-[#A6F52F]"
                  />
                  <span className="text-[11px] text-[#73777D] leading-tight">
                    I acknowledge that training sessions, employee certifications, and field assessment data are logged under LoveInStore FMCG operational audit standards.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-6 rounded-full bg-[#A6F52F] hover:bg-[#97E327] text-[#101411] font-bold text-xs tracking-tight shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="inline-block animate-spin mr-2">⟳</span>
                  ) : null}
                  <span>Complete Registration & Access Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer Branding Info */}
      <div className="mt-6 text-center text-xs text-[#73777D] space-y-1">
        <p className="flex items-center justify-center gap-2">
          <span className="font-semibold text-[#17191B]">LoveInStore Learn Management Web Panel</span>
          <span>·</span>
          <span>Enterprise Training Operations</span>
        </p>
        <p className="text-[11px] text-[#A1A5AA]">
          Secure multi-brand retail operations architecture · Monetra Visual Style
        </p>
      </div>
    </div>
  );
};
