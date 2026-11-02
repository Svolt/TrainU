/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Complete Follow-up & Audit Modal
 * Implements Section 14 Follow-up Management & Outcomes
 */

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { FollowUpRecord, FollowUpOutcome } from '../../types';
import { Badge } from '../common/Badge';
import { CheckCircle2, AlertTriangle, ShieldCheck, Camera, FileCheck } from 'lucide-react';

interface CompleteFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  followUpId: string | null;
}

export const CompleteFollowUpModal: React.FC<CompleteFollowUpModalProps> = ({
  isOpen,
  onClose,
  followUpId
}) => {
  const { followUps, completeFollowUp, currentTrainer, showToast } = useApp();

  const followUp = followUps.find(f => f.id === followUpId);

  const [outcome, setOutcome] = useState<FollowUpOutcome>('Satisfactory');
  const [observation, setObservation] = useState('');
  const [feedback, setFeedback] = useState('');
  const [checklist, setChecklist] = useState<{ id: string; task: string; checked: boolean }[]>([]);

  React.useEffect(() => {
    if (followUp) {
      setChecklist(followUp.checklistItems.map(c => ({ ...c, checked: true })));
      setObservation(
        followUp.trainerObservation ||
        `Store audit conducted on-site. Verified planogram facing, shelf strips, and FIFO rotation compliance.`
      );
      setFeedback(
        followUp.employeeFeedback ||
        `Trainee confirmed understanding of the 4-tier layout and feels ready for independent store execution.`
      );
    }
  }, [followUp]);

  if (!followUp) return null;

  const handleToggleChecklist = (id: string) => {
    setChecklist(prev =>
      prev.map(c => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  };

  const handleFinalize = () => {
    if (!observation.trim()) {
      showToast('Please provide trainer observation notes.', 'error');
      return;
    }

    completeFollowUp(
      followUp.id,
      outcome,
      observation.trim(),
      feedback.trim(),
      '/assets/proof/verified_shelf_audit.jpg'
    );

    if (outcome === 'Satisfactory') {
      showToast(
        `Follow-up ${followUp.id} finalized as SATISFACTORY! ${followUp.employeeName} is now Training Ready.`,
        'success'
      );
    } else {
      showToast(`Follow-up finalized with outcome: ${outcome}. Employee flagged for attention.`, 'info');
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Conduct Follow-up Audit: ${followUp.id}`}
      subtitle={`${followUp.employeeName} (${followUp.employeeDesignation} · ${followUp.employeeBrand}) · Program: ${followUp.programName}`}
      maxWidth="2xl"
      footer={
        <div className="flex justify-end gap-2.5 w-full text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#ECEEF0] rounded-full text-[#17191B] hover:bg-[#F8F9F8] font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleFinalize}
            className="monetra-btn-primary px-5 py-2 text-xs cursor-pointer"
          >
            Finalize Follow-up Outcome
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-xs text-[#17191B]">
        <div className="p-3.5 bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0] flex items-center justify-between">
          <div>
            <span className="font-bold text-[#17191B] block">
              Method: {followUp.method} ({followUp.type.replace('_', ' ')})
            </span>
            <span className="text-[11px] text-[#73777D] tabular-nums">
              Scheduled Date: {followUp.scheduledDate} · Due: {followUp.dueDate}
            </span>
          </div>
          <Badge variant={followUp.status === 'Overdue' ? 'red' : 'amber'} size="sm">
            {followUp.status}
          </Badge>
        </div>

        {/* Audit Checklist */}
        <div>
          <label className="block font-bold text-[#17191B] mb-1.5 uppercase text-[10px] tracking-wider">
            Verification Checklist Items
          </label>
          <div className="space-y-1.5 bg-[#F8F9F8] p-3 rounded-xl border border-[#ECEEF0]">
            {checklist.map(item => (
              <label key={item.id} className="flex items-center gap-2 p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggleChecklist(item.id)}
                  className="rounded text-[#101411] accent-[#101411] cursor-pointer"
                />
                <span className={`text-xs ${item.checked ? 'text-[#17191B] font-medium' : 'text-[#73777D]'}`}>
                  {item.task}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Outcome Selector */}
        <div>
          <label className="block font-bold text-[#17191B] mb-1.5 uppercase text-[10px] tracking-wider">
            Follow-up Outcome *
          </label>
          <select
            value={outcome}
            onChange={e => setOutcome(e.target.value as FollowUpOutcome)}
            className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 font-semibold text-[#17191B] focus:border-[#17191B] focus:bg-white transition-colors cursor-pointer"
          >
            <option value="Satisfactory">Satisfactory (Field Ready / Verified)</option>
            <option value="Improvement Required">Improvement Required (Action Needed)</option>
            <option value="Additional Training Required">Additional Training Required (Re-training)</option>
            <option value="Unable to Contact">Unable to Contact</option>
            <option value="Reschedule Required">Reschedule Required</option>
            <option value="Not Applicable">Not Applicable</option>
          </select>
          {outcome === 'Satisfactory' && (
            <p className="mt-1 text-[11px] text-emerald-700 font-medium">
              &check; Selecting Satisfactory will update employee training readiness to "Training Ready".
            </p>
          )}
        </div>

        {/* Trainer Observation */}
        <div>
          <label className="block font-bold text-[#17191B] mb-1 uppercase text-[10px] tracking-wider">
            Trainer Field Observation & Audit Remarks *
          </label>
          <textarea
            rows={3}
            value={observation}
            onChange={e => setObservation(e.target.value)}
            placeholder="Document planogram execution fidelity, shelf share, FIFO compliance..."
            className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] placeholder-[#73777D] focus:bg-white focus:border-[#17191B] transition-colors"
          />
        </div>

        {/* Employee Feedback */}
        <div>
          <label className="block font-bold text-[#17191B] mb-1 uppercase text-[10px] tracking-wider">
            Employee Trainee Feedback
          </label>
          <input
            type="text"
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Feedback from employee on operational challenges..."
            className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] placeholder-[#73777D] focus:bg-white focus:border-[#17191B] transition-colors"
          />
        </div>
      </div>
    </Modal>
  );
};
