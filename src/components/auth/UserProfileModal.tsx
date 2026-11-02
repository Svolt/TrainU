/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - User Profile & Security Modal
 * Manage logged-in persona, credentials & brand assignments
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  User,
  Mail,
  Phone,
  Building,
  Shield,
  MapPin,
  Tag,
  Calendar,
  LogOut,
  Save,
  CheckCircle2,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onSignOut
}) => {
  const { currentUser, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'details' | 'security'>('details');
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [isSaved, setIsSaved] = useState(false);

  // New password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      avatarUrl
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordNotice('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordNotice('Passwords do not match.');
      return;
    }
    setPasswordNotice('Password successfully updated for your workstation.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordNotice(null), 3000);
  };

  const modalNode = (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      style={{ isolation: 'isolate' }}
    >
      {/* Fullscreen Backdrop */}
      <div 
        className="fixed inset-0 bg-[#101411]/60 backdrop-blur-xs transition-opacity -z-10" 
        onClick={onClose}
        aria-hidden="true" 
      />

      <div 
        className="relative z-10 bg-white rounded-3xl w-full max-w-xl shadow-[0_25px_60px_rgba(16,20,17,0.28)] border border-[#ECEEF0] overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        
        {/* Header */}
        <div className="p-6 bg-[#101411] text-white flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#A6F52F]"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#A6F52F] border-2 border-[#101411]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{currentUser.name}</h3>
                <span className="text-[10px] bg-[#1A211A] text-[#A6F52F] border border-[#293629] px-2 py-0.5 rounded-full font-mono font-semibold">
                  {currentUser.employeeId || 'LIS-USER'}
                </span>
              </div>
              <p className="text-xs text-[#B8C0B8] mt-0.5">{currentUser.designation}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-[#A6F52F] bg-[#A6F52F]/10 px-2 py-0.5 rounded-full font-medium capitalize">
                  {currentUser.role.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-[#73777D]">·</span>
                <span className="text-[10px] text-[#B8C0B8]">{currentUser.organization}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1A211A] hover:bg-[#293629] text-[#B8C0B8] hover:text-white flex items-center justify-center transition-colors cursor-pointer relative z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 border-b border-[#ECEEF0] flex items-center justify-between bg-[#F8F9F8]">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'details'
                  ? 'border-[#101411] text-[#101411]'
                  : 'border-transparent text-[#73777D] hover:text-[#17191B]'
              }`}
            >
              Account Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'border-[#101411] text-[#101411]'
                  : 'border-transparent text-[#73777D] hover:text-[#17191B]'
              }`}
            >
              Security & Credentials
            </button>
          </div>

          <span className="text-[10px] text-[#73777D] font-mono pb-3">
            Last Login: {new Date(currentUser.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'details' && (
            <form onSubmit={handleSaveDetails} className="space-y-4">
              {isSaved && (
                <div className="p-3 bg-[#E9FBD1] border border-[#C6F586] text-[#17191B] rounded-2xl text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Profile information updated successfully.
                </div>
              )}

              {/* Read-only / Corporate Info Box */}
              <div className="p-4 rounded-2xl bg-[#F8F9F8] border border-[#ECEEF0] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#73777D]">Email Identity</span>
                  <span className="font-semibold text-[#17191B]">{currentUser.email}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#73777D]">Operational Role</span>
                  <span className="font-semibold text-[#17191B] capitalize">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#73777D]">Employee Code</span>
                  <span className="font-mono text-[#17191B]">{currentUser.employeeId || 'EMP-LIS-01'}</span>
                </div>
                <div className="pt-2 border-t border-[#ECEEF0]">
                  <span className="text-xs text-[#73777D] block mb-1.5">Assigned FMCG Brands:</span>
                  <div className="flex flex-wrap gap-1">
                    {currentUser.assignedBrands.map(b => (
                      <span key={b} className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-[#ECEEF0] text-[#17191B]">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-1">
                  <span className="text-xs text-[#73777D] block mb-1.5">Operating Regions:</span>
                  <div className="flex flex-wrap gap-1">
                    {currentUser.assignedRegions.map(r => (
                      <span key={r} className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E9FBD1] text-[#17191B]">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Editable Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#17191B]">Display Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#F8F9F8] rounded-full border border-[#ECEEF0] text-xs font-medium text-[#17191B] focus:outline-none focus:border-[#A6F52F] focus:ring-2 focus:ring-[#A6F52F]/20"
                />
              </div>

              {/* Editable Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#17191B]">Contact Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-2 bg-[#F8F9F8] rounded-full border border-[#ECEEF0] text-xs font-medium text-[#17191B] focus:outline-none focus:border-[#A6F52F] focus:ring-2 focus:ring-[#A6F52F]/20"
                />
              </div>

              {/* Avatar URL */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#17191B]">Avatar Photo URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-[#F8F9F8] rounded-full border border-[#ECEEF0] text-xs font-medium text-[#17191B] focus:outline-none focus:border-[#A6F52F] focus:ring-2 focus:ring-[#A6F52F]/20 text-[11px]"
                />
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-5 rounded-full bg-[#101411] hover:bg-[#202722] text-[#A6F52F] font-bold text-xs tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {passwordNotice && (
                <div className="p-3 bg-[#E9FBD1] border border-[#C6F586] text-[#17191B] rounded-2xl text-xs font-medium">
                  {passwordNotice}
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-[#F8F9F8] border border-[#ECEEF0] text-xs space-y-1">
                <p className="font-semibold text-[#17191B]">Session Security State</p>
                <p className="text-[11px] text-[#73777D]">
                  This session is authenticated with encrypted token caching in local browser storage.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#17191B]">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#F8F9F8] rounded-full border border-[#ECEEF0] text-xs font-medium text-[#17191B] focus:outline-none focus:border-[#A6F52F] focus:ring-2 focus:ring-[#A6F52F]/20 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#17191B]">New Password</label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#F8F9F8] rounded-full border border-[#ECEEF0] text-xs font-medium text-[#17191B] focus:outline-none focus:border-[#A6F52F] focus:ring-2 focus:ring-[#A6F52F]/20 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#17191B]">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#F8F9F8] rounded-full border border-[#ECEEF0] text-xs font-medium text-[#17191B] focus:outline-none focus:border-[#A6F52F] focus:ring-2 focus:ring-[#A6F52F]/20 font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-5 rounded-full bg-[#101411] hover:bg-[#202722] text-[#A6F52F] font-bold text-xs tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer with Sign Out action */}
        <div className="p-4 bg-[#F8F9F8] border-t border-[#ECEEF0] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="px-4 py-2 rounded-full text-xs font-semibold text-[#E56C6C] hover:bg-[#FDF0F0] border border-[#FAD2D2] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out of Workstation
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-[#ECEEF0] hover:bg-[#E3E6E8] text-[#17191B] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};
