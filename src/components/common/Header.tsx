/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Monetra Visual Style System - Top Navigation Header
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  RotateCcw,
  Plus,
  ChevronDown,
  Check,
  Shield,
  Sparkles,
  LogOut,
  User,
  Settings as SettingsIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { NavTabId } from './Sidebar';
import { Badge } from './Badge';

interface HeaderProps {
  activeTab: NavTabId;
  onOpenMobileSidebar: () => void;
  onNavigateTab: (tab: NavTabId) => void;
  onOpenQuickAssign: () => void;
  onOpenQuickSession: () => void;
  onOpenQuickFollowUp: () => void;
  onOpenEmployeeDetail: (empId: string) => void;
  onOpenProfile?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileSidebar,
  onNavigateTab,
  onOpenQuickAssign,
  onOpenQuickSession,
  onOpenQuickFollowUp,
  onOpenEmployeeDetail,
  onOpenProfile,
  onSignOut
}) => {
  const { currentUser, logout, fastLogin, usersList } = useAuth();
  const {
    currentTrainer,
    setCurrentTrainerId,
    trainers,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    resetToDefaultData,
    employees,
    programs,
    sessions,
    policies,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const quickRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) {
        setShowQuickActions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifs = notifications.filter(n => !n.read);

  // Filtered search results
  const filteredEmployees = searchQuery.trim()
    ? employees.filter(e => 
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const filteredPrograms = searchQuery.trim()
    ? programs.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const filteredSessions = searchQuery.trim()
    ? sessions.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasSearchResults = filteredEmployees.length > 0 || filteredPrograms.length > 0 || filteredSessions.length > 0;

  const tabTitles: Record<NavTabId, string> = {
    overview: 'Operations Dashboard & KPIs',
    employees: 'Employee Directory & Training Profiles',
    programs: 'Training Programs & Curriculum',
    resources: 'Learning Modules & Resource Library',
    sessions: 'Batches & Scheduled Sessions',
    assessments: 'Assessments, Question Bank & Evaluations',
    followups: 'Operational Follow-ups & Practical Audits',
    improvement: 'Knowledge Gaps & Improvement Plans',
    certifications: 'Certification Registry & Issuance',
    communication: 'Communication & Bulk Announcements',
    history: 'Training History & System Audit Trail',
    reports: 'Operational Reports & Analytics',
    settings: 'Trainer Profile & Configurable Business Policies'
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#ECEEF0] px-4 sm:px-6 flex items-center justify-between shadow-[0_2px_10px_rgba(25,35,45,0.035)]">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-[#73777D] hover:text-[#17191B] hover:bg-[#F3F4F3] rounded-full cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <nav className="flex items-center gap-1.5 text-[11px] text-[#73777D] mb-0.5">
            <span>LoveInStore</span>
            <span>/</span>
            <span className="capitalize font-medium text-[#17191B]">{activeTab}</span>
          </nav>
          <h1 className="text-base font-bold text-[#17191B] tracking-tight leading-none truncate max-w-xs md:max-w-md">
            {tabTitles[activeTab]}
          </h1>
        </div>
      </div>

      {/* Center: Monetra Pill Global Search */}
      <div ref={searchRef} className="relative flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-[#A1A5AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder="Search employee (e.g. Rahul Sharma), program, session..."
            className="w-full bg-[#F8F9F8] hover:bg-[#F3F4F3] focus:bg-white text-xs pl-9 pr-4 py-2 border border-[#ECEEF0] rounded-full focus:outline-hidden focus:ring-2 focus:ring-[#A6F52F]/40 focus:border-[#A6F52F] transition-all text-[#17191B] placeholder-[#A1A5AA]"
          />
        </div>

        {/* Global Search Popover */}
        {showSearchResults && searchQuery.trim() && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_10px_35px_rgba(25,35,45,0.08)] border border-[#ECEEF0] py-2 z-50 max-h-96 overflow-y-auto">
            {!hasSearchResults ? (
              <div className="p-4 text-center text-xs text-[#73777D]">
                No matching employees, programs, or sessions found.
              </div>
            ) : (
              <div className="divide-y divide-[#ECEEF0] text-xs">
                {filteredEmployees.length > 0 && (
                  <div className="p-2">
                    <p className="px-2 py-1 text-[10px] font-semibold text-[#A1A5AA] uppercase tracking-wider">
                      Employees
                    </p>
                    {filteredEmployees.map(emp => (
                      <button
                        key={emp.id}
                        onClick={() => {
                          onOpenEmployeeDetail(emp.id);
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-2 hover:bg-[#F8F9F8] rounded-xl flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <span className="font-semibold text-[#17191B]">{emp.name}</span>
                          <span className="ml-2 text-[10px] text-[#73777D]">
                            {emp.id} · {emp.designation} · {emp.brand}
                          </span>
                        </div>
                        <Badge size="sm" variant={emp.currentReadiness === 'Training Ready' ? 'green' : 'blue'}>
                          {emp.currentReadiness}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}

                {filteredPrograms.length > 0 && (
                  <div className="p-2">
                    <p className="px-2 py-1 text-[10px] font-semibold text-[#A1A5AA] uppercase tracking-wider">
                      Programs
                    </p>
                    {filteredPrograms.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onNavigateTab('programs');
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-2 hover:bg-[#F8F9F8] rounded-xl flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <span className="font-semibold text-[#17191B]">{p.name}</span>
                          <span className="ml-2 text-[10px] text-[#73777D]">{p.code} ({p.currentVersion})</span>
                        </div>
                        <Badge size="sm" variant="slate">{p.brandAssociation}</Badge>
                      </button>
                    ))}
                  </div>
                )}

                {filteredSessions.length > 0 && (
                  <div className="p-2">
                    <p className="px-2 py-1 text-[10px] font-semibold text-[#A1A5AA] uppercase tracking-wider">
                      Sessions
                    </p>
                    {filteredSessions.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          onNavigateTab('sessions');
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-2 hover:bg-[#F8F9F8] rounded-xl flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <span className="font-semibold text-[#17191B]">{s.title}</span>
                          <span className="ml-2 text-[10px] text-[#73777D]">{s.date} · {s.sessionType}</span>
                        </div>
                        <Badge size="sm" variant={s.status === 'Completed' ? 'green' : 'amber'}>{s.status}</Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Monetra Primary Action Pill Button */}
        <div ref={quickRef} className="relative">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="flex items-center gap-1.5 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] text-xs font-semibold px-4 py-2 rounded-full shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick Action</span>
            <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
          </button>

          {showQuickActions && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-[0_10px_35px_rgba(25,35,45,0.08)] border border-[#ECEEF0] p-1.5 z-50 text-xs">
              <button
                onClick={() => {
                  onOpenQuickAssign();
                  setShowQuickActions(false);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-[#F8F9F8] text-[#17191B] rounded-xl flex items-center gap-2 cursor-pointer font-medium"
              >
                <div className="w-2 h-2 rounded-full bg-[#A6F52F]" />
                Assign Training
              </button>
              <button
                onClick={() => {
                  onOpenQuickSession();
                  setShowQuickActions(false);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-[#F8F9F8] text-[#17191B] rounded-xl flex items-center gap-2 cursor-pointer font-medium"
              >
                <div className="w-2 h-2 rounded-full bg-[#4D91D8]" />
                Schedule Session
              </button>
              <button
                onClick={() => {
                  onOpenQuickFollowUp();
                  setShowQuickActions(false);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-[#F8F9F8] text-[#17191B] rounded-xl flex items-center gap-2 cursor-pointer font-medium"
              >
                <div className="w-2 h-2 rounded-full bg-[#E9A84C]" />
                Schedule Follow-up Audit
              </button>
              <div className="border-t border-[#ECEEF0] my-1" />
              <button
                onClick={() => {
                  onNavigateTab('programs');
                  setShowQuickActions(false);
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-[#F8F9F8] text-[#17191B] rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-[#4DBB70]" />
                Create Training Program
              </button>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 text-[#73777D] hover:text-[#17191B] hover:bg-[#F3F4F3] rounded-full transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E56C6C] rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_10px_35px_rgba(25,35,45,0.08)] border border-[#ECEEF0] z-50 overflow-hidden">
              <div className="p-3.5 border-b border-[#ECEEF0] flex items-center justify-between bg-[#F8F9F8]">
                <span className="text-xs font-bold text-[#17191B]">
                  Operational Alerts ({unreadNotifs.length} new)
                </span>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-[#2C6FB5] hover:underline font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-[#ECEEF0] text-xs">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-[#73777D]">No notifications.</div>
                ) : (
                  notifications.slice(0, 6).map(n => (
                    <div
                      key={n.id}
                      className={`p-3 transition-colors ${n.read ? 'bg-white' : 'bg-[#E9FBD1]/30'} hover:bg-[#F8F9F8]`}
                      onClick={() => markNotificationRead(n.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`font-semibold text-xs ${n.read ? 'text-[#73777D]' : 'text-[#17191B]'}`}>
                          {n.title}
                        </p>
                        {n.priority === 'high' && (
                          <Badge variant="red" size="sm">Urgent</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-[#73777D] mt-1 leading-relaxed">
                        {n.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-[#A1A5AA]">
                        <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {n.actionUrl && (
                          <button
                            onClick={() => {
                              onNavigateTab(n.actionUrl?.replace('/', '') as NavTabId);
                              setShowNotifMenu(false);
                            }}
                            className="text-[#2C6FB5] hover:underline font-medium cursor-pointer"
                          >
                            Open module &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2.5 border-t border-[#ECEEF0] text-center bg-[#F8F9F8]">
                <button
                  onClick={() => {
                    onNavigateTab('communication');
                    setShowNotifMenu(false);
                  }}
                  className="text-xs text-[#2C6FB5] font-semibold cursor-pointer"
                >
                  View Notification Centre
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Role & User Auth Dropdown */}
        <div ref={roleRef} className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 bg-[#F8F9F8] hover:bg-[#F3F4F3] rounded-full text-xs font-medium text-[#17191B] transition-colors border border-[#ECEEF0] cursor-pointer"
            title="User Profile & Account Settings"
          >
            <div className="relative">
              <img
                src={currentUser?.avatarUrl || currentTrainer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser?.name || currentTrainer.name}
                className="w-6 h-6 rounded-full object-cover border border-[#A6F52F]"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#A6F52F] border border-white" />
            </div>
            <div className="text-left hidden md:block">
              <span className="font-semibold text-[#17191B] truncate max-w-[110px] block leading-tight">
                {currentUser?.name || currentTrainer.name}
              </span>
              <span className="text-[10px] text-[#73777D] block leading-none capitalize">
                {(currentUser?.role || currentTrainer.role).replace('_', ' ')}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#73777D]" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_10px_35px_rgba(25,35,45,0.08)] border border-[#ECEEF0] p-3 z-50 text-xs">
              {/* User Identity Header */}
              <div className="px-2 py-2 bg-[#F8F9F8] rounded-xl border border-[#ECEEF0] mb-2 flex items-center gap-3">
                <img
                  src={currentUser?.avatarUrl || currentTrainer.avatarUrl}
                  alt={currentUser?.name || currentTrainer.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#A6F52F]"
                />
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-[#17191B] truncate">
                    {currentUser?.name || currentTrainer.name}
                  </p>
                  <p className="text-[11px] text-[#73777D] truncate">
                    {currentUser?.email || currentTrainer.email}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] font-semibold bg-[#E9FBD1] text-[#17191B] px-2 py-0.5 rounded-full capitalize">
                      {(currentUser?.role || currentTrainer.role).replace('_', ' ')}
                    </span>
                    <span className="text-[9px] text-[#A1A5AA] font-mono">
                      {currentUser?.employeeId || 'LIS-USER'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile & Security button */}
              {onOpenProfile && (
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleMenu(false);
                    onOpenProfile();
                  }}
                  className="w-full text-left px-3 py-2 text-[#17191B] hover:bg-[#F8F9F8] rounded-xl flex items-center justify-between font-medium cursor-pointer transition-colors mb-1"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#73777D]" />
                    <span>My Profile & Credentials</span>
                  </div>
                  <span className="text-[10px] text-[#A1A5AA]">Edit →</span>
                </button>
              )}

              {/* Role & Trainer Switcher Dropdown (For RBAC testing) */}
              <div className="px-2 py-1.5 border-t border-[#ECEEF0] my-1">
                <p className="text-[10px] font-semibold uppercase text-[#A1A5AA] tracking-wider mb-1">
                  Switch Active Persona (Fast Login / RBAC)
                </p>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {usersList.slice(0, 5).map(u => {
                    const isCurrent = currentUser?.id === u.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          fastLogin(u.role);
                          setCurrentTrainerId(u.id);
                          setShowRoleMenu(false);
                          showToast(`Switched active session to ${u.name} (${u.role.replace('_', ' ')})`, 'info');
                        }}
                        className={`w-full text-left p-1.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                          isCurrent ? 'bg-[#E9FBD1] text-[#17191B] font-medium' : 'hover:bg-[#F8F9F8] text-[#73777D]'
                        }`}
                      >
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#17191B] truncate text-[11px]">{u.name}</span>
                            {isCurrent && <Check className="w-3 h-3 text-[#17191B] shrink-0" />}
                          </div>
                          <p className="text-[9px] text-[#73777D] capitalize truncate">
                            {u.role.replace('_', ' ')} · {u.assignedBrands[0]}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reset seed data button */}
              <div className="pt-2 border-t border-[#ECEEF0] space-y-1">
                <button
                  onClick={() => {
                    resetToDefaultData();
                    showToast('Seed data and history reset to default.', 'info');
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-[#73777D] hover:text-[#17191B] hover:bg-[#F8F9F8] rounded-xl flex items-center gap-2 font-medium cursor-pointer text-[11px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Seed Data & Clear History
                </button>

                {/* Sign Out Button */}
                <button
                  onClick={() => {
                    setShowRoleMenu(false);
                    logout();
                    if (onSignOut) onSignOut();
                    showToast('You have signed out of your session.', 'info');
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-[#E56C6C] hover:bg-[#FDF0F0] rounded-xl flex items-center gap-2 font-semibold cursor-pointer text-[11px] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out of Workstation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
