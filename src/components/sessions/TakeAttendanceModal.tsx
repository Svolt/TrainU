/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Session Attendance & Auditable Correction Modal
 * Implements Section 10 & 12 Attendance Management & Auditable Corrections
 */

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { TrainingSession, AttendanceStatus } from '../../types';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { CheckCircle2, Clock, AlertCircle, ShieldAlert, History } from 'lucide-react';

interface TakeAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string | null;
}

export const TakeAttendanceModal: React.FC<TakeAttendanceModalProps> = ({
  isOpen,
  onClose,
  sessionId
}) => {
  const { sessions, markSessionAttendance, correctAttendance, currentTrainer, showToast } = useApp();

  const session = sessions.find(s => s.id === sessionId);

  const [records, setRecords] = useState<{
    employeeId: string;
    employeeName: string;
    status: AttendanceStatus;
    checkInTime?: string;
    checkOutTime?: string;
    latenessMinutes?: number;
    absenceReason?: string;
    trainerRemarks?: string;
  }[]>([]);

  const [isCorrectionMode, setIsCorrectionMode] = useState(false);
  const [selectedCorrectionEmpId, setSelectedCorrectionEmpId] = useState('');
  const [correctionNewStatus, setCorrectionNewStatus] = useState<AttendanceStatus>('Present');
  const [correctionReason, setCorrectionReason] = useState('');

  useEffect(() => {
    if (session) {
      setRecords(
        session.attendanceRecords.map(r => ({
          employeeId: r.employeeId,
          employeeName: r.employeeName,
          status: r.status === 'Not Recorded' ? 'Present' : r.status,
          checkInTime: r.checkInTime || '10:00',
          checkOutTime: r.checkOutTime || '12:00',
          latenessMinutes: r.latenessMinutes || 0,
          absenceReason: r.absenceReason || '',
          trainerRemarks: r.trainerRemarks || ''
        }))
      );
    }
  }, [session]);

  if (!session) return null;

  const handleStatusChange = (empId: string, status: AttendanceStatus) => {
    setRecords(prev =>
      prev.map(r => (r.employeeId === empId ? { ...r, status } : r))
    );
  };

  const handleSaveAttendance = () => {
    markSessionAttendance(session.id, records);
    showToast(`Attendance finalized for ${records.length} participants in session ${session.title}!`, 'success');
    onClose();
  };

  const handleApplyCorrection = () => {
    if (!correctionReason.trim()) {
      showToast('A valid operational correction reason is mandatory for auditable compliance.', 'error');
      return;
    }

    correctAttendance(
      session.id,
      selectedCorrectionEmpId,
      correctionNewStatus,
      correctionReason.trim()
    );

    showToast('Attendance correction recorded in immutable audit log.', 'success');
    setIsCorrectionMode(false);
    setCorrectionReason('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>{isCorrectionMode ? 'Auditable Attendance Correction' : 'Session Attendance Register'}</span>
          <Badge variant={session.attendanceFinalized ? 'green' : 'amber'} size="sm">
            {session.attendanceFinalized ? 'Finalized' : 'Pending Finalization'}
          </Badge>
        </div>
      }
      subtitle={`${session.title} · ${session.date} (${session.startTime} - ${session.endTime}) · Facilitator: ${session.trainerName}`}
      maxWidth="4xl"
      footer={
        <div className="flex items-center justify-between w-full text-xs">
          <span className="text-[#73777D] tabular-nums">
            {records.filter(r => r.status === 'Present').length} Present,{' '}
            {records.filter(r => r.status === 'Late').length} Late,{' '}
            {records.filter(r => r.status === 'Absent').length} Absent
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#ECEEF0] rounded-full text-[#17191B] hover:bg-[#F8F9F8] font-medium cursor-pointer transition-colors"
            >
              Cancel
            </button>

            {!isCorrectionMode ? (
              <>
                {session.attendanceFinalized && (
                  <button
                    onClick={() => {
                      setIsCorrectionMode(true);
                      setSelectedCorrectionEmpId(records[0]?.employeeId || '');
                    }}
                    className="px-4 py-2 bg-white border border-[#ECEEF0] text-[#17191B] hover:bg-[#F8F9F8] rounded-full font-medium cursor-pointer transition-colors"
                  >
                    Log Correction
                  </button>
                )}
                <button
                  onClick={handleSaveAttendance}
                  className="px-5 py-2 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] rounded-full font-semibold cursor-pointer transition-colors"
                >
                  Finalize Attendance
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCorrectionMode(false)}
                  className="px-4 py-2 border border-[#ECEEF0] rounded-full text-[#17191B] hover:bg-[#F8F9F8] font-medium cursor-pointer transition-colors"
                >
                  Cancel Correction
                </button>
                <button
                  onClick={handleApplyCorrection}
                  className="px-5 py-2 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] rounded-full font-semibold cursor-pointer transition-colors"
                >
                  Commit Audited Correction
                </button>
              </div>
            )}
          </div>
        </div>
      }
    >
      {!isCorrectionMode ? (
        <div className="space-y-4 text-xs">
          <div className="divide-y divide-[#ECEEF0] border border-[#ECEEF0] rounded-2xl overflow-hidden bg-white">
            <div className="grid grid-cols-12 gap-2 bg-[#F8F9F8] p-3 font-semibold text-[#73777D] text-[11px] uppercase tracking-wider">
              <div className="col-span-4">Participant</div>
              <div className="col-span-4 text-center">Attendance Status</div>
              <div className="col-span-4">Lateness / Absence Remarks</div>
            </div>

            {records.map(r => (
              <div key={r.employeeId} className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-[#F8F9F8]">
                <div className="col-span-4">
                  <span className="font-semibold text-[#17191B] block">{r.employeeName}</span>
                  <span className="text-[10px] text-[#A1A5AA] font-mono tabular-nums">{r.employeeId}</span>
                </div>

                {/* Status selector */}
                <div className="col-span-4 flex items-center justify-center gap-1.5">
                  {(['Present', 'Late', 'Absent', 'Excused'] as AttendanceStatus[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(r.employeeId, st)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        r.status === st
                          ? st === 'Present'
                            ? 'bg-[#4DBB70] text-white shadow-soft'
                            : st === 'Late'
                            ? 'bg-[#4D91D8] text-white shadow-soft'
                            : st === 'Absent'
                            ? 'bg-[#E56C6C] text-white shadow-soft'
                            : 'bg-[#73777D] text-white shadow-soft'
                          : 'bg-[#F8F9F8] text-[#73777D] hover:text-[#17191B] border border-[#ECEEF0]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Details */}
                <div className="col-span-4 space-y-1">
                  {r.status === 'Late' && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#73777D]">Mins:</span>
                      <input
                        type="number"
                        value={r.latenessMinutes}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setRecords(prev => prev.map(rec => rec.employeeId === r.employeeId ? { ...rec, latenessMinutes: val } : rec));
                        }}
                        className="w-16 bg-[#F8F9F8] border border-[#ECEEF0] rounded-full px-2.5 py-0.5 text-xs text-[#17191B] tabular-nums"
                      />
                    </div>
                  )}

                  {r.status === 'Absent' && (
                    <input
                      type="text"
                      placeholder="Reason for absence..."
                      value={r.absenceReason}
                      onChange={e => {
                        const val = e.target.value;
                        setRecords(prev => prev.map(rec => rec.employeeId === r.employeeId ? { ...rec, absenceReason: val } : rec));
                      }}
                      className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-full px-3 py-1 text-xs text-[#17191B]"
                    />
                  )}

                  <input
                    type="text"
                    placeholder="Trainer remark / drill score..."
                    value={r.trainerRemarks}
                    onChange={e => {
                      const val = e.target.value;
                      setRecords(prev => prev.map(rec => rec.employeeId === r.employeeId ? { ...rec, trainerRemarks: val } : rec));
                    }}
                    className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-full px-3 py-1 text-[11px] text-[#17191B] placeholder-[#A1A5AA]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Auditable Correction Form */
        <div className="space-y-4 text-xs text-[#17191B]">
          <div className="p-3 bg-[#E9A84C]/10 rounded-2xl border border-[#E9A84C]/25 text-[#17191B] flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#E9A84C] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs text-[#17191B]">Section 12 Compliance: Audited Attendance Correction</p>
              <p className="text-[11px] text-[#73777D] mt-0.5">
                Attendance records are immutable historical events. Any post-finalization edit requires a mandatory justification and is attributed to {currentTrainer.name}.
              </p>
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#17191B] mb-1">Select Participant *</label>
            <select
              value={selectedCorrectionEmpId}
              onChange={e => setSelectedCorrectionEmpId(e.target.value)}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 font-medium text-[#17191B] cursor-pointer"
            >
              {session.attendanceRecords.map(r => (
                <option key={r.employeeId} value={r.employeeId}>
                  {r.employeeName} ({r.employeeId}) - Current: {r.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#17191B] mb-1">New Attendance Status *</label>
            <select
              value={correctionNewStatus}
              onChange={e => setCorrectionNewStatus(e.target.value as AttendanceStatus)}
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 font-medium text-[#17191B] cursor-pointer"
            >
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
              <option value="Excused">Excused</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#17191B] mb-1">
              Operational Justification / Reason * (Mandatory for Audit)
            </label>
            <textarea
              rows={3}
              value={correctionReason}
              onChange={e => setCorrectionReason(e.target.value)}
              placeholder="e.g. Employee verified attendance with supervisor sign-off sheet and depot GPS logs."
              className="w-full bg-[#F8F9F8] border border-[#ECEEF0] rounded-xl p-2.5 text-xs text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden"
            />
          </div>
        </div>
      )}
    </Modal>
  );
};
