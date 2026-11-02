/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Employee, ProgramCategory } from '../../types';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Badge } from '../common/Badge';

interface BulkAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployeeIds: string[];
  onSuccess: () => void;
}

export const BulkAssignModal: React.FC<BulkAssignModalProps> = ({
  isOpen,
  onClose,
  selectedEmployeeIds,
  onSuccess
}) => {
  const { employees, programs, batches, assignTraining, assignments, showToast } = useApp();

  const [selectedProgramId, setSelectedProgramId] = useState<string>(programs[0]?.id || '');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [reason, setReason] = useState<string>('Q4 Modern Trade FMCG Execution Rollout');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [forceReenroll, setForceReenroll] = useState<boolean>(false);
  const [step, setStep] = useState<'configure' | 'confirm'>('configure');

  const selectedEmployees: Employee[] = employees.filter(e => selectedEmployeeIds.includes(e.id));
  const selectedProgram = programs.find(p => p.id === selectedProgramId);

  // Check duplicate active assignments
  const duplicates = selectedEmployees.filter(emp => 
    assignments.some(a => 
      a.employeeId === emp.id && 
      a.programId === selectedProgramId &&
      ['Assigned', 'In Progress', 'Assessment Pending', 'Follow-up Pending'].includes(a.status)
    )
  );

  const handleAssign = () => {
    const result = assignTraining({
      employeeIds: selectedEmployeeIds,
      programId: selectedProgramId,
      programVersion: selectedProgram?.currentVersion,
      priority,
      reason,
      dueDate,
      batchId: selectedBatchId || undefined,
      forceReenroll
    });

    if (result.success) {
      showToast(`Successfully created ${result.createdCount} training assignment(s)!`, 'success');
      onSuccess();
      onClose();
    } else {
      showToast(result.message, 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 'configure' ? 'Assign Training Curriculum' : 'Review & Confirm Bulk Assignment'}
      subtitle={
        step === 'configure'
          ? `Select program, delivery rules, and target due date for ${selectedEmployees.length} employee(s).`
          : `Review recipient eligibility and duplicate checks before finalizing.`
      }
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-[#73777D] tabular-nums">
            {selectedEmployees.length} employee(s) selected
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#ECEEF0] text-xs font-medium text-[#17191B] hover:bg-[#F8F9F8] cursor-pointer transition-colors"
            >
              Cancel
            </button>
            {step === 'configure' ? (
              <button
                type="button"
                onClick={() => setStep('confirm')}
                disabled={!selectedProgramId || !dueDate || !reason.trim()}
                className="px-5 py-2 rounded-full bg-[#A6F52F] hover:bg-[#95E622] text-xs font-semibold text-[#17191B] disabled:opacity-50 cursor-pointer transition-colors"
              >
                Continue to Review &rarr;
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('configure')}
                  className="px-4 py-2 rounded-full border border-[#ECEEF0] text-xs font-medium text-[#17191B] hover:bg-[#F8F9F8] cursor-pointer transition-colors"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={handleAssign}
                  className="px-5 py-2 rounded-full bg-[#A6F52F] hover:bg-[#95E622] text-xs font-semibold text-[#17191B] cursor-pointer transition-colors"
                >
                  Confirm & Assign ({selectedEmployees.length})
                </button>
              </div>
            )}
          </div>
        </div>
      }
    >
      {step === 'configure' ? (
        <div className="space-y-4 text-xs text-[#17191B]">
          {/* Program Select */}
          <div>
            <label className="block font-medium text-[#17191B] mb-1">
              Select Training Program *
            </label>
            <select
              value={selectedProgramId}
              onChange={e => setSelectedProgramId(e.target.value)}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs font-medium text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden cursor-pointer"
            >
              {programs.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name} ({p.currentVersion}) · [{p.brandAssociation}]
                </option>
              ))}
            </select>
            {selectedProgram && (
              <p className="mt-1 text-[11px] text-[#73777D]">
                {selectedProgram.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block font-medium text-[#17191B] mb-1">
                Assignment Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs font-medium text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden cursor-pointer"
              >
                <option value="High">High (Immediate Deployment)</option>
                <option value="Medium">Medium (Standard Routine)</option>
                <option value="Low">Low (Self-Paced / Elective)</option>
              </select>
            </div>

            {/* Target Due Date */}
            <div>
              <label className="block font-medium text-[#17191B] mb-1">
                Target Completion Due Date *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs font-medium text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden cursor-pointer"
              />
            </div>
          </div>

          {/* Optional Batch */}
          <div>
            <label className="block font-medium text-[#17191B] mb-1">
              Associate with Training Batch (Optional)
            </label>
            <select
              value={selectedBatchId}
              onChange={e => setSelectedBatchId(e.target.value)}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs font-medium text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden cursor-pointer"
            >
              <option value="">No Batch / Individual Direct Assignment</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code}) · {b.location}
                </option>
              ))}
            </select>
          </div>

          {/* Assignment Reason */}
          <div>
            <label className="block font-medium text-[#17191B] mb-1">
              Operational Justification / Reason *
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g., Onboarding orientation, festive promotion preparation, supervisor audit mandate"
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs font-medium text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden"
            />
          </div>
        </div>
      ) : (
        /* Confirmation step */
        <div className="space-y-4 text-xs">
          {duplicates.length > 0 && (
            <div className="p-3 bg-[#E9A84C]/10 rounded-2xl border border-[#E9A84C]/25 text-[#17191B] flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-[#E9A84C] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs text-[#17191B]">
                  Duplicate Active Assignment Warning ({duplicates.length} Employee{duplicates.length > 1 ? 's' : ''})
                </p>
                <p className="text-[11px] text-[#73777D] mt-0.5">
                  The following employees already have an active assignment for this program:{' '}
                  {duplicates.map(d => `${d.name} (${d.id})`).join(', ')}.
                </p>
                <label className="flex items-center gap-2 mt-2 font-medium text-[#17191B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forceReenroll}
                    onChange={e => setForceReenroll(e.target.checked)}
                    className="rounded accent-[#17191B] cursor-pointer"
                  />
                  <span>Allow explicit re-enrolment / repeat-training for these employees</span>
                </label>
              </div>
            </div>
          )}

          <div className="bg-[#F8F9F8] rounded-2xl p-4 border border-[#ECEEF0]">
            <h4 className="font-semibold text-[#17191B] mb-1">Summary of Curriculum to Assign</h4>
            <p className="text-[#73777D]">
              <span className="font-medium text-[#17191B]">Program:</span> {selectedProgram?.name} ({selectedProgram?.currentVersion})
            </p>
            <p className="text-[#73777D]">
              <span className="font-medium text-[#17191B]">Brand Association:</span> {selectedProgram?.brandAssociation}
            </p>
            <p className="text-[#73777D]">
              <span className="font-medium text-[#17191B]">Priority:</span> {priority} | <span className="font-medium text-[#17191B]">Due:</span> {dueDate}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#17191B] mb-2">
              Selected Recipient Roster ({selectedEmployees.length})
            </h4>
            <div className="max-h-48 overflow-y-auto divide-y divide-[#ECEEF0] border border-[#ECEEF0] rounded-2xl">
              {selectedEmployees.map(emp => {
                const isDup = duplicates.some(d => d.id === emp.id);
                return (
                  <div key={emp.id} className="p-3 flex items-center justify-between bg-white text-xs">
                    <div>
                      <span className="font-medium text-[#17191B]">{emp.name}</span>
                      <span className="text-[#A1A5AA] text-[11px] ml-2 font-mono tabular-nums">
                        {emp.id} · {emp.designation} · {emp.brand}
                      </span>
                    </div>
                    {isDup ? (
                      <Badge variant="amber" size="sm">Duplicate Active</Badge>
                    ) : (
                      <Badge variant="green" size="sm">Eligible</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
