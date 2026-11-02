/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Improvement Plans & Re-training View
 * Implements Section 15 Improvement Plans and Re-training
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImprovementPlan } from '../../types';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Flame, CheckCircle2, Clock, AlertTriangle, ShieldCheck, Plus, ExternalLink } from 'lucide-react';

export const ImprovementView: React.FC = () => {
  const { improvementPlans, closeImprovementPlan, currentTrainer, employees, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'open' | 'closed' | 'all'>('open');
  const [selectedPlanForClose, setSelectedPlanForClose] = useState<ImprovementPlan | null>(null);
  const [closureNote, setClosureNote] = useState('');

  const openCount = improvementPlans.filter(p => p.status === 'Open' || p.status === 'In Progress').length;
  const closedCount = improvementPlans.filter(p => p.status === 'Closed').length;

  const filteredPlans = improvementPlans.filter(p => {
    if (activeTab === 'open') return p.status === 'Open' || p.status === 'In Progress';
    if (activeTab === 'closed') return p.status === 'Closed';
    return true;
  });

  const handleConfirmClose = () => {
    if (!selectedPlanForClose) return;
    if (!closureNote.trim()) {
      showToast('Please state the operational verification reasons for closing this plan.', 'error');
      return;
    }

    closeImprovementPlan(selectedPlanForClose.id, closureNote.trim());
    showToast(`Improvement Plan ${selectedPlanForClose.id} successfully verified and closed!`, 'success');
    setSelectedPlanForClose(null);
    setClosureNote('');
  };

  return (
    <div className="space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs bg-[#F8F9F8] p-1.5 rounded-full border border-[#ECEEF0]">
          <button
            onClick={() => setActiveTab('open')}
            className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
              activeTab === 'open'
                ? 'bg-[#101411] text-[#A6F52F] shadow-xs font-semibold'
                : 'text-[#73777D] hover:text-[#17191B]'
            }`}
          >
            Active Knowledge Gap Plans ({openCount})
          </button>
          <button
            onClick={() => setActiveTab('closed')}
            className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
              activeTab === 'closed'
                ? 'bg-[#101411] text-[#A6F52F] shadow-xs font-semibold'
                : 'text-[#73777D] hover:text-[#17191B]'
            }`}
          >
            Closed & Verified Plans ({closedCount})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#101411] text-[#A6F52F] shadow-xs font-semibold'
                : 'text-[#73777D] hover:text-[#17191B]'
            }`}
          >
            All Plans ({improvementPlans.length})
          </button>
        </div>

        <span className="text-xs text-[#73777D] font-medium">
          Section 15: Gap Identified &rarr; Actions Assigned &rarr; Re-training &rarr; Reassessment &rarr; Practical Verification
        </span>
      </div>

      {/* Plan Cards */}
      <div className="space-y-4">
        {filteredPlans.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#ECEEF0] text-center text-xs text-[#73777D] shadow-soft">
            No improvement plans found.
          </div>
        ) : (
          filteredPlans.map(plan => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl border border-[#ECEEF0] p-5 shadow-soft hover:shadow-md transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECEEF0] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-[#F8F9F8] border border-[#ECEEF0] px-2.5 py-0.5 rounded-full font-bold text-[#17191B]">
                      {plan.id}
                    </span>
                    <h4 className="font-bold text-sm text-[#17191B]">
                      {plan.employeeName} ({plan.employeeDesignation})
                    </h4>
                    <span className="text-[#73777D] text-xs font-mono">({plan.employeeId})</span>
                  </div>
                  <p className="text-xs text-[#73777D] mt-0.5">
                    Trigger: <strong className="text-[#17191B]">{plan.originatingReason}</strong> · Trainer Lead: {plan.assignedTrainerName} · Target: <span className="tabular-nums">{plan.targetCompletionDate}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={plan.severity === 'Critical' ? 'red' : 'amber'} size="sm">
                    {plan.severity} Severity
                  </Badge>
                  <Badge variant={plan.status === 'Closed' ? 'green' : 'amber'} size="sm">
                    {plan.status}
                  </Badge>
                </div>
              </div>

              {/* Problem Statement & Identified Gaps */}
              <div className="bg-[#F8F9F8] p-4 rounded-xl border border-[#ECEEF0] text-xs space-y-2">
                <p className="font-bold text-[#17191B]">Problem Description & Gap Evidence:</p>
                <p className="text-[#73777D] leading-relaxed">{plan.problemDescription}</p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="font-bold text-[10px] text-[#73777D] uppercase tracking-wider">Gaps:</span>
                  {plan.identifiedGaps.map((gap, i) => (
                    <span key={i} className="bg-white text-rose-700 border border-rose-200 text-[10px] px-2.5 py-0.5 rounded-full font-medium">
                      {gap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Milestones */}
              <div className="space-y-2 text-xs">
                <h5 className="font-bold text-[#17191B] uppercase text-[10px] tracking-wider">
                  Corrective Milestones & Verification Steps ({plan.actions.length})
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {plan.actions.map(act => (
                    <div
                      key={act.id}
                      className="p-3 bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl flex items-start justify-between gap-2 shadow-xs"
                    >
                      <div>
                        <span className="font-semibold text-[#17191B] block text-xs">{act.title}</span>
                        <p className="text-[11px] text-[#73777D] mt-0.5">{act.description}</p>
                        <p className="text-[10px] text-[#73777D] mt-1 tabular-nums">Due: {act.targetDate}</p>
                      </div>
                      <Badge variant={act.status === 'Completed' ? 'green' : 'amber'} size="sm">
                        {act.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Closure Details or Action Button */}
              <div className="pt-3 border-t border-[#ECEEF0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                {plan.status === 'Closed' ? (
                  <div className="text-emerald-800 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="tabular-nums">Closed on {plan.closedAt?.split('T')[0]}: "{plan.closureReason}"</span>
                  </div>
                ) : (
                  <span className="text-amber-700 font-medium">
                    Awaiting remedial session & reassessment completion.
                  </span>
                )}

                {plan.status !== 'Closed' && (
                  <button
                    onClick={() => setSelectedPlanForClose(plan)}
                    className="px-4 py-2 bg-[#101411] hover:bg-[#1A211A] text-[#A6F52F] rounded-full font-semibold shadow-xs transition-all cursor-pointer text-xs self-end sm:self-auto"
                  >
                    Verify & Close Plan
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Verify & Close Modal */}
      {selectedPlanForClose && (
        <Modal
          isOpen={Boolean(selectedPlanForClose)}
          onClose={() => setSelectedPlanForClose(null)}
          title={`Verify & Close Improvement Plan: ${selectedPlanForClose.id}`}
          subtitle={`Employee: ${selectedPlanForClose.employeeName} (${selectedPlanForClose.employeeId})`}
          maxWidth="lg"
          footer={
            <div className="flex justify-end gap-2.5 w-full text-xs">
              <button
                type="button"
                onClick={() => setSelectedPlanForClose(null)}
                className="px-4 py-2 border border-[#ECEEF0] rounded-full text-[#17191B] hover:bg-[#F8F9F8] font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClose}
                className="monetra-btn-primary px-5 py-2 text-xs cursor-pointer"
              >
                Sign-off & Mark Resolved
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-[#17191B]">
            <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200/90 text-emerald-950">
              <p className="font-bold">Operational Verification Sign-off</p>
              <p className="text-[11px] mt-0.5 leading-relaxed text-emerald-900">
                Closing this improvement plan removes the employee from the Attention queue and updates their training readiness to Training Ready.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-[#17191B] mb-1.5 uppercase text-[10px] tracking-wider">
                Verification Checklist Confirmation
              </label>
              <div className="space-y-1.5 bg-[#F8F9F8] p-3 rounded-xl border border-[#ECEEF0]">
                {selectedPlanForClose.verificationChecklist.map(v => (
                  <div key={v.id} className="flex items-center gap-2 p-1">
                    <input type="checkbox" defaultChecked className="rounded text-[#101411] accent-[#101411] cursor-pointer" />
                    <span className="text-[#17191B]">{v.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#17191B] mb-1 uppercase text-[10px] tracking-wider">
                Closure Justification & Remedial Notes *
              </label>
              <textarea
                rows={3}
                value={closureNote}
                onChange={e => setClosureNote(e.target.value)}
                placeholder="State how candidate demonstrated mastery during re-test or field demonstration..."
                className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] placeholder-[#73777D] focus:bg-white focus:border-[#17191B] transition-colors"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
