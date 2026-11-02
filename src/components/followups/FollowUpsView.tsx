/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Operational Follow-ups View
 * Implements Section 14 Follow-up Management
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FollowUpRecord, FollowUpStatus } from '../../types';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { CompleteFollowUpModal } from './CompleteFollowUpModal';
import {
  ClockAlert,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Search,
  Eye,
  Plus
} from 'lucide-react';

export const FollowUpsView: React.FC = () => {
  const { followUps } = useApp();

  const [activeTab, setActiveTab] = useState<'today' | 'overdue' | 'upcoming' | 'completed' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFollowUpId, setSelectedFollowUpId] = useState<string | null>(null);

  const todayCount = followUps.filter(f => f.status === 'Due').length;
  const overdueCount = followUps.filter(f => f.status === 'Overdue').length;
  const upcomingCount = followUps.filter(f => f.status === 'Scheduled').length;
  const completedCount = followUps.filter(f => f.status === 'Completed').length;

  const filteredFollowUps = followUps.filter(f => {
    let matchesTab = true;
    if (activeTab === 'today') matchesTab = f.status === 'Due';
    if (activeTab === 'overdue') matchesTab = f.status === 'Overdue';
    if (activeTab === 'upcoming') matchesTab = f.status === 'Scheduled';
    if (activeTab === 'completed') matchesTab = f.status === 'Completed';

    const matchesSearch =
      f.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.programName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Top Queues Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs bg-[#F8F9F8] p-1.5 rounded-full border border-[#ECEEF0]">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
              activeTab === 'today'
                ? 'bg-[#101411] text-[#A6F52F] shadow-xs font-semibold'
                : 'text-[#73777D] hover:text-[#17191B]'
            }`}
          >
            Today's Follow-ups ({todayCount})
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overdue'
                ? 'bg-rose-600 text-white shadow-xs font-semibold'
                : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Overdue ({overdueCount})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-[#101411] text-[#A6F52F] shadow-xs font-semibold'
                : 'text-[#73777D] hover:text-[#17191B]'
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-[#101411] text-[#A6F52F] shadow-xs font-semibold'
                : 'text-[#73777D] hover:text-[#17191B]'
            }`}
          >
            Completed Audits ({completedCount})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#101411] text-[#A6F52F] shadow-xs font-semibold'
                : 'text-[#73777D] hover:text-[#17191B]'
            }`}
          >
            All Follow-ups ({followUps.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#73777D] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search follow-up..."
            className="w-full bg-[#F8F9F8] border border-[#ECEEF0] text-xs pl-9 pr-3.5 py-2 rounded-full text-[#17191B] placeholder-[#73777D] focus:outline-hidden focus:border-[#17191B] focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Overdue Warning Callout if active and count > 0 */}
      {overdueCount > 0 && activeTab === 'overdue' && (
        <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200/90 text-rose-900 text-xs flex items-start gap-3 shadow-soft">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Urgent Operational Escalation Required</p>
            <p className="text-[11px] text-rose-800 mt-0.5 leading-relaxed">
              Open follow-ups whose due date has passed block field readiness validation. Priority store visit or supervisory review must be completed.
            </p>
          </div>
        </div>
      )}

      {/* Follow-up Cards */}
      <div className="space-y-3">
        {filteredFollowUps.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#ECEEF0] text-center text-xs text-[#73777D] shadow-soft">
            No follow-ups found in this queue.
          </div>
        ) : (
          filteredFollowUps.map(f => (
            <div
              key={f.id}
              className={`bg-white rounded-2xl border p-5 shadow-soft hover:shadow-md transition-all space-y-3.5 ${
                f.status === 'Overdue'
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-[#ECEEF0]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] bg-[#F8F9F8] border border-[#ECEEF0] px-2.5 py-0.5 rounded-full font-bold text-[#17191B]">
                    {f.id}
                  </span>
                  <span className="font-bold text-xs text-[#17191B]">{f.employeeName}</span>
                  <span className="text-[10px] text-[#73777D] font-mono">({f.employeeId})</span>
                  <Badge variant="blue" size="sm">
                    {f.employeeDesignation} · {f.employeeBrand}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(f.status)} size="sm">
                    {f.status} {f.outcome ? `· ${f.outcome}` : ''}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs text-[#73777D] bg-[#F8F9F8] p-3.5 rounded-xl border border-[#ECEEF0]">
                <div>
                  <span className="text-[#73777D] text-[10px] uppercase font-bold tracking-wider block">Method & Type</span>
                  <span className="font-semibold text-[#17191B]">{f.method}</span>
                  <p className="text-[11px] text-[#73777D] capitalize">{f.type.replace('_', ' ')}</p>
                </div>

                <div>
                  <span className="text-[#73777D] text-[10px] uppercase font-bold tracking-wider block">Program & Owner</span>
                  <span className="font-semibold text-[#17191B] truncate block">{f.programName}</span>
                  <p className="text-[11px] text-[#73777D]">Trainer: {f.ownerTrainerName}</p>
                </div>

                <div>
                  <span className="text-[#73777D] text-[10px] uppercase font-bold tracking-wider block">Schedule & Due Date</span>
                  <span className={`font-semibold tabular-nums ${f.status === 'Overdue' ? 'text-rose-600 font-bold' : 'text-[#17191B]'}`}>
                    Due: {f.dueDate}
                  </span>
                  <p className="text-[11px] text-[#73777D] tabular-nums">Scheduled: {f.scheduledDate}</p>
                </div>
              </div>

              {/* Checklist preview */}
              <div className="space-y-1.5">
                <p className="font-bold text-[10px] text-[#73777D] uppercase tracking-wider">Audit Checklist</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-[#17191B]">
                  {f.checklistItems.map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={item.checked} readOnly className="rounded text-[#101411] accent-[#101411]" />
                      <span className="truncate">{item.task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observation & Action */}
              <div className="pt-3 border-t border-[#ECEEF0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                {f.trainerObservation ? (
                  <p className="text-[11px] text-[#73777D] italic">
                    Observation: "{f.trainerObservation}"
                  </p>
                ) : (
                  <span className="text-[#73777D] text-[11px]">Audit not yet finalized.</span>
                )}

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => setSelectedFollowUpId(f.id)}
                    className="px-4 py-2 bg-[#101411] hover:bg-[#1A211A] text-[#A6F52F] rounded-full font-semibold shadow-xs transition-all cursor-pointer text-xs"
                  >
                    {f.status === 'Completed' ? 'Review Audit Evidence' : 'Conduct & Finalize Audit'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <CompleteFollowUpModal
        isOpen={Boolean(selectedFollowUpId)}
        onClose={() => setSelectedFollowUpId(null)}
        followUpId={selectedFollowUpId}
      />
    </div>
  );
};
