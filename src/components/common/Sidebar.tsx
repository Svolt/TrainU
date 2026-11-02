/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Monetra Visual Style System - Left Navigation Sidebar
 */

import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FolderArchive,
  CalendarDays,
  FileCheck2,
  ClockAlert,
  Flame,
  Award,
  BellRing,
  History,
  BarChart3,
  Settings,
  Shield,
  Layers,
  Sparkles,
  LogOut,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export type NavTabId = 
  | 'overview'
  | 'employees'
  | 'programs'
  | 'resources'
  | 'sessions'
  | 'assessments'
  | 'followups'
  | 'improvement'
  | 'certifications'
  | 'communication'
  | 'history'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenProfile?: () => void;
  onSignOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  onOpenProfile,
  onSignOut
}) => {
  const { kpis, currentTrainer, followUps, improvementPlans } = useApp();
  const { currentUser, logout } = useAuth();

  const overdueCount = followUps.filter(f => f.status === 'Overdue').length;
  const activePlansCount = improvementPlans.filter(p => p.status === 'Open' || p.status === 'In Progress').length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'employees', label: 'My Employees', icon: Users, badge: kpis.employeesRequiringAttentionCount > 0 ? `${kpis.employeesRequiringAttentionCount}` : null, badgeColor: 'bg-[#E56C6C] text-white' },
    { id: 'programs', label: 'Training Programs', icon: GraduationCap, badge: null },
    { id: 'resources', label: 'Learning Resources', icon: FolderArchive, badge: null },
    { id: 'sessions', label: 'Batches & Sessions', icon: CalendarDays, badge: kpis.sessionsScheduledCount > 0 ? `${kpis.sessionsScheduledCount}` : null, badgeColor: 'bg-[#293629] text-[#A6F52F] border border-[#A6F52F]/30' },
    { id: 'assessments', label: 'Assessments', icon: FileCheck2, badge: null },
    { id: 'followups', label: 'Follow-ups', icon: ClockAlert, badge: overdueCount > 0 ? `${overdueCount}` : kpis.followUpsDueCount > 0 ? `${kpis.followUpsDueCount}` : null, badgeColor: overdueCount > 0 ? 'bg-[#E56C6C] text-white' : 'bg-[#E9A84C] text-[#17191B]' },
    { id: 'improvement', label: 'Improvement & Re-train', icon: Flame, badge: activePlansCount > 0 ? `${activePlansCount}` : null, badgeColor: 'bg-[#E9A84C] text-[#17191B]' },
    { id: 'certifications', label: 'Certifications', icon: Award, badge: null },
    { id: 'communication', label: 'Communication', icon: BellRing, badge: null },
    { id: 'history', label: 'History & Audit', icon: History, badge: null },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Profile & Policies', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#101411]/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container in Monetra Dark Material (#101411) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#101411] text-[#B8C0B8] flex flex-col transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] border-r border-[#1A211A] lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#1A211A] bg-[#101411]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#A6F52F] flex items-center justify-center text-[#17191B] font-extrabold text-sm shadow-xs">
              M
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight block leading-tight">
                LOVEINSTORE
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A6F52F] block">
                Learn Operations
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-[#1A211A] text-[#A6F52F] border border-[#293629] px-2 py-0.5 rounded-full font-mono font-medium">
            v1.0
          </span>
        </div>

        {/* Current User Auth Card */}
        <div
          onClick={onOpenProfile}
          className={`p-3 mx-3 my-2.5 bg-[#1A211A] rounded-xl border border-[#293629] transition-all ${
            onOpenProfile ? 'cursor-pointer hover:border-[#A6F52F]/40 hover:bg-[#202720]' : ''
          }`}
          title={onOpenProfile ? 'Click to view & edit profile' : undefined}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={currentUser?.avatarUrl || currentTrainer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser?.name || currentTrainer.name}
                className="w-8 h-8 rounded-full object-cover border border-[#A6F52F]"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#A6F52F] border border-[#101411]" />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-white truncate leading-tight">
                {currentUser?.name || currentTrainer.name}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Shield className="w-3 h-3 text-[#A6F52F] shrink-0" />
                <span className="text-[10px] text-[#B8C0B8] truncate capitalize">
                  {(currentUser?.role || currentTrainer.role).replace('_', ' ')}
                </span>
              </div>
            </div>
            {onOpenProfile && (
              <span className="text-[10px] text-[#A6F52F] opacity-70 hover:opacity-100">
                Edit
              </span>
            )}
          </div>
          <div className="mt-2 pt-2 border-t border-[#293629] flex items-center justify-between text-[10px] text-[#B8C0B8]">
            <span className="truncate">
              Brand: {currentUser?.assignedBrands?.[0] || currentTrainer.assignedBrands[0]}
            </span>
            <span className="text-[#A6F52F] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A6F52F]" />
              Online
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-none">
          <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-[#73777D] uppercase">
            Operations Modules
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id as NavTabId);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-full text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-[#A6F52F] text-[#17191B] font-semibold shadow-xs'
                    : 'text-[#B8C0B8] hover:bg-[#1A211A] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#17191B]' : 'text-[#73777D] group-hover:text-[#B8C0B8]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
                      isActive ? 'bg-[#17191B] text-[#A6F52F]' : item.badgeColor || 'bg-[#1A211A]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-[#1A211A] bg-[#101411] text-[11px] text-[#73777D] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#A6F52F]" />
            <span className="text-[#B8C0B8]">FMCG Execution</span>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              if (onSignOut) onSignOut();
            }}
            className="flex items-center gap-1 text-[10px] text-[#E56C6C] hover:text-[#f87171] hover:bg-[#1A211A] px-2 py-1 rounded-full font-medium transition-colors cursor-pointer"
            title="Sign out of current workstation session"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
