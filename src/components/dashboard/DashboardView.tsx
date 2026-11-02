/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Monetra Visual Style System - Operations Dashboard View
 * Implements Section 4 Dashboard Requirements with Monetra visual language
 */

import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  GraduationCap,
  Calendar,
  Award,
  AlertTriangle,
  ClockAlert,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { DemoStoryBanner } from '../common/DemoStoryBanner';
import { NavTabId } from '../common/Sidebar';

interface DashboardViewProps {
  onNavigateTab: (tab: NavTabId, filterParams?: any) => void;
  onOpenEmployee: (empId: string, initialTab?: string) => void;
  onTakeAttendance: (sessionId: string) => void;
  onCompleteFollowUp: (followUpId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenEmployee,
  onTakeAttendance,
  onCompleteFollowUp
}) => {
  const {
    kpis,
    currentTrainer,
    sessions,
    followUps,
    employees,
    timelineEvents
  } = useApp();

  const [brandFilter, setBrandFilter] = useState('All');
  const [dateRange, setDateRange] = useState('All Time');

  // Filtered upcoming sessions
  const upcomingSessions = sessions
    .filter(s => s.status === 'Scheduled' || s.status === 'Rescheduled')
    .slice(0, 3);

  // Follow-ups requiring action (Overdue or Due Today)
  const urgentFollowUps = followUps
    .filter(f => f.status === 'Overdue' || f.status === 'Due')
    .slice(0, 4);

  // Attention employees
  const attentionEmployees = employees
    .filter(e => e.currentReadiness === 'Needs Attention')
    .slice(0, 4);

  // Program status distribution
  const readyCount = employees.filter(e => e.currentReadiness === 'Training Ready').length;
  const inTrainingCount = employees.filter(e => e.currentReadiness === 'In Training').length;
  const untrainedCount = employees.filter(e => e.currentReadiness === 'Untrained').length;
  const needsAttentionCount = employees.filter(e => e.currentReadiness === 'Needs Attention').length;

  return (
    <div className="space-y-6">
      {/* Required Demo Scenario Highlight Banner */}
      <DemoStoryBanner onOpenEmployee={onOpenEmployee} />

      {/* Scope & Date Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#ECEEF0] shadow-[0_2px_10px_rgba(25,35,45,0.035)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#17191B]">
          <Filter className="w-4 h-4 text-[#73777D]" />
          <span className="font-semibold text-[#17191B]">Operational Scope:</span>
          <span className="text-[#73777D] font-normal">{currentTrainer.assignedRegions.join(', ')} Region</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[#73777D]">Brand:</span>
            <select
              value={brandFilter}
              onChange={e => setBrandFilter(e.target.value)}
              className="bg-[#F8F9F8] border border-[#ECEEF0] rounded-full px-3 py-1.5 text-[#17191B] font-medium focus:outline-hidden focus:border-[#A6F52F] cursor-pointer"
            >
              <option value="All">All Authorised Brands</option>
              <option value="Haldiram's">Haldiram's (FMCG)</option>
              <option value="Cadbury">Cadbury (Confectionery)</option>
              <option value="Nestle">Nestle</option>
              <option value="Hindustan Unilever">Hindustan Unilever</option>
              <option value="ITC Limited">ITC Limited</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#73777D]">Period:</span>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="bg-[#F8F9F8] border border-[#ECEEF0] rounded-full px-3 py-1.5 text-[#17191B] font-medium focus:outline-hidden focus:border-[#A6F52F] cursor-pointer"
            >
              <option value="All Time">Current Active Deployment</option>
              <option value="This Month">Current Month</option>
              <option value="Q4 Festive">Q4 Festive Campaign</option>
            </select>
          </div>
        </div>
      </div>

      {/* 10 Section 4 KPI Cards - Monetra Visual Language */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* KPI 1 */}
        <div
          onClick={() => onNavigateTab('employees')}
          className="bg-white p-4.5 rounded-2xl border border-[#ECEEF0] hover:border-[#DFE2E5] shadow-[0_2px_10px_rgba(25,35,45,0.035)] hover:shadow-[0_6px_20px_rgba(25,35,45,0.055)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#73777D] mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#73777D]">Assigned Emps</span>
            <div className="w-7 h-7 rounded-full bg-[#F3F4F3] flex items-center justify-center group-hover:bg-[#E9FBD1] transition-colors">
              <Users className="w-3.5 h-3.5 text-[#17191B]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#17191B] tabular-nums tracking-tight">{kpis.assignedEmployeesCount}</div>
          <p className="text-[11px] text-[#73777D] mt-1 flex items-center justify-between">
            <span>Active assignments</span>
            <ArrowUpRight className="w-3 h-3 text-[#A1A5AA] group-hover:text-[#17191B]" />
          </p>
        </div>

        {/* KPI 2 */}
        <div
          onClick={() => onNavigateTab('employees')}
          className="bg-white p-4.5 rounded-2xl border border-[#ECEEF0] hover:border-[#DFE2E5] shadow-[0_2px_10px_rgba(25,35,45,0.035)] hover:shadow-[0_6px_20px_rgba(25,35,45,0.055)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#73777D] mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#73777D]">Emps Trained</span>
            <div className="w-7 h-7 rounded-full bg-[#E9FBD1] flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-[#226732]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#17191B] tabular-nums tracking-tight">{kpis.employeesTrainedCount}</div>
          <p className="text-[11px] text-[#73777D] mt-1 flex items-center justify-between">
            <span>Passed & verified</span>
            <ArrowUpRight className="w-3 h-3 text-[#A1A5AA] group-hover:text-[#17191B]" />
          </p>
        </div>

        {/* KPI 3 */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="bg-white p-4.5 rounded-2xl border border-[#ECEEF0] hover:border-[#DFE2E5] shadow-[0_2px_10px_rgba(25,35,45,0.035)] hover:shadow-[0_6px_20px_rgba(25,35,45,0.055)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#73777D] mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#73777D]">Completion Rate</span>
            <div className="w-7 h-7 rounded-full bg-[#F3F4F3] flex items-center justify-center group-hover:bg-[#E9FBD1] transition-colors">
              <TrendingUp className="w-3.5 h-3.5 text-[#17191B]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#17191B] tabular-nums tracking-tight">{kpis.trainingCompletionRate}%</div>
          <p className="text-[11px] text-[#73777D] mt-1 flex items-center justify-between">
            <span>Completed / Due</span>
            <ArrowUpRight className="w-3 h-3 text-[#A1A5AA] group-hover:text-[#17191B]" />
          </p>
        </div>

        {/* KPI 4 */}
        <div
          onClick={() => onNavigateTab('sessions')}
          className="bg-white p-4.5 rounded-2xl border border-[#ECEEF0] hover:border-[#DFE2E5] shadow-[0_2px_10px_rgba(25,35,45,0.035)] hover:shadow-[0_6px_20px_rgba(25,35,45,0.055)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#73777D] mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#73777D]">Sessions Sched</span>
            <div className="w-7 h-7 rounded-full bg-[#EDF5FD] flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-[#2C6FB5]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#17191B] tabular-nums tracking-tight">{kpis.sessionsScheduledCount}</div>
          <p className="text-[11px] text-[#73777D] mt-1 flex items-center justify-between">
            <span>Upcoming calendar</span>
            <ArrowUpRight className="w-3 h-3 text-[#A1A5AA] group-hover:text-[#17191B]" />
          </p>
        </div>

        {/* KPI 5 */}
        <div
          onClick={() => onNavigateTab('sessions')}
          className="bg-white p-4.5 rounded-2xl border border-[#ECEEF0] hover:border-[#DFE2E5] shadow-[0_2px_10px_rgba(25,35,45,0.035)] hover:shadow-[0_6px_20px_rgba(25,35,45,0.055)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#73777D] mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#73777D]">Sessions Done</span>
            <div className="w-7 h-7 rounded-full bg-[#E9FBD1] flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-[#226732]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#17191B] tabular-nums tracking-tight">{kpis.sessionsCompletedCount}</div>
          <p className="text-[11px] text-[#73777D] mt-1 flex items-center justify-between">
            <span>Attendance finalized</span>
            <ArrowUpRight className="w-3 h-3 text-[#A1A5AA] group-hover:text-[#17191B]" />
          </p>
        </div>

        {/* KPI 6 */}
        <div
          onClick={() => onNavigateTab('assessments')}
          className="bg-white p-4.5 rounded-2xl border border-[#ECEEF0] hover:border-[#DFE2E5] shadow-[0_2px_10px_rgba(25,35,45,0.035)] hover:shadow-[0_6px_20px_rgba(25,35,45,0.055)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#73777D] mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#73777D]">Pass Rate</span>
            <div className="w-7 h-7 rounded-full bg-[#F4EFFB] flex items-center justify-center">
              <Award className="w-3.5 h-3.5 text-[#7143A6]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#17191B] tabular-nums tracking-tight">{kpis.attemptPassRate}%</div>
          <p className="text-[10px] text-[#73777D] mt-1 flex items-center justify-between truncate">
            <span>Att: {kpis.attemptPassRate}% · Emp: {kpis.employeePassRate}%</span>
            <ArrowUpRight className="w-3 h-3 text-[#A1A5AA] group-hover:text-[#17191B]" />
          </p>
        </div>

        {/* KPI 7 */}
        <div
          onClick={() => onNavigateTab('followups')}
          className="bg-white p-4.5 rounded-2xl border border-[#ECEEF0] hover:border-[#DFE2E5] shadow-[0_2px_10px_rgba(25,35,45,0.035)] hover:shadow-[0_6px_20px_rgba(25,35,45,0.055)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#73777D] mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A66708]">Follow-ups Due</span>
            <div className="w-7 h-7 rounded-full bg-[#FEF5E7] flex items-center justify-center">
              <ClockAlert className="w-3.5 h-3.5 text-[#A66708]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#A66708] tabular-nums tracking-tight">{kpis.followUpsDueCount}</div>
          <p className="text-[11px] text-[#73777D] mt-1 flex items-center justify-between">
            <span>Due today or sooner</span>
            <ArrowUpRight className="w-3 h-3 text-[#A1A5AA] group-hover:text-[#A66708]" />
          </p>
        </div>

        {/* KPI 8 */}
        <div
          onClick={() => onNavigateTab('followups')}
          className={`p-4.5 rounded-2xl border transition-all cursor-pointer group shadow-[0_2px_10px_rgba(25,35,45,0.035)] hover:shadow-[0_6px_20px_rgba(25,35,45,0.055)] ${
            kpis.overdueFollowUpsCount > 0 
              ? 'bg-[#FDF0F0] border-[#FACACA]' 
              : 'bg-white border-[#ECEEF0]'
          }`}
        >
          <div className="flex items-center justify-between text-[#73777D] mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D84B4B]">Overdue Follow-up</span>
            <div className="w-7 h-7 rounded-full bg-[#FDF0F0] flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-[#D84B4B]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#D84B4B] tabular-nums tracking-tight">{kpis.overdueFollowUpsCount}</div>
          <p className="text-[11px] text-[#D84B4B] mt-1 flex items-center justify-between font-medium">
            <span>High priority audit</span>
            <ArrowUpRight className="w-3 h-3 text-[#D84B4B]" />
          </p>
        </div>

        {/* KPI 9 */}
        <div
          onClick={() => onNavigateTab('employees')}
          className={`p-4.5 rounded-2xl border transition-all cursor-pointer group shadow-[0_2px_10px_rgba(25,35,45,0.035)] hover:shadow-[0_6px_20px_rgba(25,35,45,0.055)] ${
            kpis.employeesRequiringAttentionCount > 0 
              ? 'bg-[#FEF5E7]/50 border-[#FCE1B6]' 
              : 'bg-white border-[#ECEEF0]'
          }`}
        >
          <div className="flex items-center justify-between text-[#73777D] mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A66708]">Needs Attention</span>
            <div className="w-7 h-7 rounded-full bg-[#FEF5E7] flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-[#A66708]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#A66708] tabular-nums tracking-tight">{kpis.employeesRequiringAttentionCount}</div>
          <p className="text-[11px] text-[#A66708] mt-1 flex items-center justify-between">
            <span>Gaps / Retakes</span>
            <ArrowUpRight className="w-3 h-3 text-[#A66708]" />
          </p>
        </div>

        {/* KPI 10 */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="bg-white p-4.5 rounded-2xl border border-[#ECEEF0] hover:border-[#DFE2E5] shadow-[0_2px_10px_rgba(25,35,45,0.035)] hover:shadow-[0_6px_20px_rgba(25,35,45,0.055)] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#73777D] mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#226732]">Field Readiness</span>
            <div className="w-7 h-7 rounded-full bg-[#E9FBD1] flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-[#226732]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#226732] tabular-nums tracking-tight">{kpis.readinessRate}%</div>
          <p className="text-[11px] text-[#73777D] mt-1 flex items-center justify-between">
            <span>{readyCount} of {employees.length} ready</span>
            <ArrowUpRight className="w-3 h-3 text-[#A1A5AA] group-hover:text-[#226732]" />
          </p>
        </div>
      </div>

      {/* Main Grid: Upcoming Sessions & Follow-up Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions List */}
        <div className="bg-white rounded-2xl border border-[#ECEEF0] shadow-[0_2px_10px_rgba(25,35,45,0.035)] overflow-hidden">
          <div className="p-4.5 border-b border-[#ECEEF0] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#17191B]" />
              <h3 className="font-bold text-[#17191B] text-sm tracking-tight">Upcoming Training Sessions</h3>
            </div>
            <button
              onClick={() => onNavigateTab('sessions')}
              className="text-xs text-[#17191B] hover:text-[#73777D] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              View Calendar &rarr;
            </button>
          </div>

          <div className="divide-y divide-[#ECEEF0]">
            {upcomingSessions.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#73777D]">
                No upcoming training sessions scheduled.
              </div>
            ) : (
              upcomingSessions.map(session => (
                <div key={session.id} className="p-4 hover:bg-[#F8F9F8] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-[#17191B]">{session.title}</span>
                      <Badge size="sm" variant={session.isOnline ? 'purple' : 'blue'}>
                        {session.sessionType}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#73777D]">
                      {session.programName} · {session.date} ({session.startTime} - {session.endTime})
                    </p>
                    <p className="text-[11px] text-[#A1A5AA] flex items-center gap-1 mt-1 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{session.venueOrLink}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onTakeAttendance(session.id)}
                      className="px-4 py-1.5 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] rounded-full text-xs font-semibold shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer"
                    >
                      Take Attendance
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actionable Follow-up Queue & Overdue Alerts */}
        <div className="bg-white rounded-2xl border border-[#ECEEF0] shadow-[0_2px_10px_rgba(25,35,45,0.035)] overflow-hidden">
          <div className="p-4.5 border-b border-[#ECEEF0] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ClockAlert className="w-4 h-4 text-[#A66708]" />
              <h3 className="font-bold text-[#17191B] text-sm tracking-tight">Actionable Follow-ups & Audits</h3>
            </div>
            <button
              onClick={() => onNavigateTab('followups')}
              className="text-xs text-[#17191B] hover:text-[#73777D] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              All Follow-ups &rarr;
            </button>
          </div>

          <div className="divide-y divide-[#ECEEF0]">
            {urgentFollowUps.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#73777D]">
                No pending or overdue follow-ups for your assigned scope!
              </div>
            ) : (
              urgentFollowUps.map(flw => (
                <div key={flw.id} className="p-4 hover:bg-[#F8F9F8] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-[#17191B]">{flw.employeeName}</span>
                      <span className="text-[10px] text-[#73777D] font-mono">({flw.employeeId})</span>
                      <Badge size="sm" variant={flw.status === 'Overdue' ? 'red' : 'amber'}>
                        {flw.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#73777D]">
                      {flw.method} · {flw.type.replace('_', ' ')} · Due: <span className="font-semibold text-[#17191B]">{flw.dueDate}</span>
                    </p>
                    <p className="text-[10px] text-[#A1A5AA] mt-0.5">
                      Program: {flw.programName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onCompleteFollowUp(flw.id)}
                      className="px-4 py-1.5 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] rounded-full text-xs font-semibold shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer"
                    >
                      Conduct Audit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Secondary Grid: Attention Queue & Training Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employees Requiring Attention */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#ECEEF0] shadow-[0_2px_10px_rgba(25,35,45,0.035)] overflow-hidden">
          <div className="p-4.5 border-b border-[#ECEEF0] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D84B4B]" />
              <div>
                <h3 className="font-bold text-[#17191B] text-sm">Employees Requiring Operational Attention</h3>
                <p className="text-[11px] text-[#73777D]">Failed assessments, overdue audits, or active improvement plans</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('employees')}
              className="text-xs text-[#17191B] hover:text-[#73777D] font-semibold cursor-pointer"
            >
              Directory &rarr;
            </button>
          </div>

          <div className="divide-y divide-[#ECEEF0]">
            {attentionEmployees.map(emp => (
              <div
                key={emp.id}
                onClick={() => onOpenEmployee(emp.id)}
                className="p-4 hover:bg-[#F8F9F8] transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs text-[#17191B]">{emp.name}</span>
                    <span className="text-[11px] text-[#73777D] font-mono">{emp.id}</span>
                    <Badge size="sm" variant="red">Needs Attention</Badge>
                  </div>
                  <p className="text-[11px] text-[#73777D]">
                    {emp.designation} · {emp.brand} ({emp.city}, {emp.state})
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(emp.readinessCriteriaOutstanding || []).map((crit, idx) => (
                      <span key={idx} className="text-[10px] bg-[#FDF0F0] text-[#D84B4B] px-2 py-0.5 rounded-full border border-[#FACACA] font-medium">
                        {crit}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#A1A5AA] shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Readiness & Lifecycle Distribution - Monetra Data Viz Style */}
        <div className="bg-white p-5 rounded-2xl border border-[#ECEEF0] shadow-[0_2px_10px_rgba(25,35,45,0.035)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#17191B] text-sm tracking-tight">Training Readiness Ratio</h3>
            <span className="text-xs font-semibold text-[#73777D] bg-[#F8F9F8] px-2.5 py-1 rounded-full border border-[#ECEEF0]">
              {employees.length} Total
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Ready (Highlighted with Monetra Lime Accent!) */}
            <div>
              <div className="flex justify-between font-semibold mb-1.5">
                <span className="text-[#17191B] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#A6F52F]" />
                  Training Ready (Field Certified)
                </span>
                <span className="text-[#17191B] font-bold tabular-nums">
                  {readyCount} ({Math.round((readyCount / employees.length) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#F0F1F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#A6F52F] rounded-full transition-all duration-500" style={{ width: `${(readyCount / employees.length) * 100}%` }} />
              </div>
            </div>

            {/* In Training */}
            <div>
              <div className="flex justify-between font-medium mb-1.5">
                <span className="text-[#73777D] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4D91D8]" />
                  In Training / Active Curriculum
                </span>
                <span className="text-[#17191B] tabular-nums">{inTrainingCount} ({Math.round((inTrainingCount / employees.length) * 100)}%)</span>
              </div>
              <div className="w-full h-2 bg-[#F0F1F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#4D91D8] rounded-full" style={{ width: `${(inTrainingCount / employees.length) * 100}%` }} />
              </div>
            </div>

            {/* Needs Attention */}
            <div>
              <div className="flex justify-between font-medium mb-1.5">
                <span className="text-[#73777D] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E56C6C]" />
                  Needs Attention / Knowledge Gap
                </span>
                <span className="text-[#17191B] tabular-nums">{needsAttentionCount} ({Math.round((needsAttentionCount / employees.length) * 100)}%)</span>
              </div>
              <div className="w-full h-2 bg-[#F0F1F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#E56C6C] rounded-full" style={{ width: `${(needsAttentionCount / employees.length) * 100}%` }} />
              </div>
            </div>

            {/* Untrained */}
            <div>
              <div className="flex justify-between font-medium mb-1.5">
                <span className="text-[#73777D] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#A1A5AA]" />
                  Untrained / Onboarding Backlog
                </span>
                <span className="text-[#17191B] tabular-nums">{untrainedCount} ({Math.round((untrainedCount / employees.length) * 100)}%)</span>
              </div>
              <div className="w-full h-2 bg-[#F0F1F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#A1A5AA] rounded-full" style={{ width: `${(untrainedCount / employees.length) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#ECEEF0]">
            <h4 className="text-[11px] font-bold text-[#A1A5AA] uppercase tracking-wider mb-2.5">
              Recent Trainer Activity
            </h4>
            <div className="space-y-2.5 text-[11px] text-[#73777D]">
              {timelineEvents.slice(0, 3).map(evt => (
                <div key={evt.id} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#A6F52F] mt-1.5 shrink-0" />
                  <div className="flex-1 truncate">
                    <span className="font-semibold text-[#17191B]">{evt.title}</span>
                    <p className="text-[10px] text-[#A1A5AA] truncate">{evt.actorName} · {new Date(evt.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
