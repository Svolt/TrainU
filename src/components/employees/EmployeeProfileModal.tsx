/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Comprehensive Employee Training Profile
 * Implements Section 5 Employee Profile Tabs (10 tabs) & Actions
 */

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Employee, TrainingEvent } from '../../types';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import {
  User,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  AlertTriangle,
  History,
  FileText,
  ListTodo,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Plus,
  Download,
  AlertCircle
} from 'lucide-react';

interface EmployeeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string | null;
  initialTab?: string;
  onOpenCertificateModal: (certId: string) => void;
  onOpenAssignModal: (empId: string) => void;
  onOpenScheduleFollowUp: (empId: string) => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  initialTab = 'journey',
  onOpenCertificateModal,
  onOpenAssignModal,
  onOpenScheduleFollowUp
}) => {
  const {
    employees,
    assignments,
    sessions,
    attempts,
    followUps,
    improvementPlans,
    certificates,
    timelineEvents,
    auditLogs,
    currentTrainer
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [trainerNotes, setTrainerNotes] = useState<string[]>([
    'Trainee demonstrated high engagement during FMCG retail simulations.',
    'Punctual on morning beat check-ins.'
  ]);
  const [newNote, setNewNote] = useState('');

  if (!employeeId) return null;
  const employee = employees.find(e => e.id === employeeId);
  if (!employee) return null;

  // Filter linked operational records
  const empAssignments = assignments.filter(a => a.employeeId === employee.id);
  const empAttempts = attempts.filter(a => a.employeeId === employee.id);
  const empFollowUps = followUps.filter(f => f.employeeId === employee.id);
  const empImprovementPlans = improvementPlans.filter(p => p.employeeId === employee.id);
  const empCertificates = certificates.filter(c => c.employeeId === employee.id);
  const empTimeline = timelineEvents
    .filter(e => e.employeeId === employee.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Collect session attendances
  const sessionRecords: {
    sessionId: string;
    sessionTitle: string;
    date: string;
    status: string;
    latenessMinutes?: number;
    absenceReason?: string;
    trainerRemarks?: string;
  }[] = [];

  sessions.forEach(s => {
    const rec = s.attendanceRecords.find(r => r.employeeId === employee.id);
    if (rec) {
      sessionRecords.push({
        sessionId: s.id,
        sessionTitle: s.title,
        date: s.date,
        status: rec.status,
        latenessMinutes: rec.latenessMinutes,
        absenceReason: rec.absenceReason,
        trainerRemarks: rec.trainerRemarks
      });
    }
  });

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setTrainerNotes(prev => [newNote.trim(), ...prev]);
    setNewNote('');
  };

  const handleExportJourney = () => {
    const lines = [
      `LOVEINSTORE LEARN - EMPLOYEE TRAINING RECORD`,
      `Employee: ${employee.name} (${employee.id})`,
      `Designation: ${employee.designation} | Brand: ${employee.brand}`,
      `Readiness Status: ${employee.currentReadiness}`,
      `Exported: ${new Date().toLocaleString()}`,
      `----------------------------------------`,
      `CHRONOLOGICAL TRAINING JOURNEY:`,
      ...empTimeline.map(e => `[${e.timestamp}] ${e.title} - ${e.description} (By: ${e.actorName})`),
      `----------------------------------------`,
      `CERTIFICATES:`,
      ...empCertificates.map(c => `${c.certificateNumber} (${c.programName}) - Status: ${c.status}`)
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `training_record_${employee.id}.txt`;
    a.click();
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'journey', label: 'Training Journey' },
    { id: 'assignments', label: `Assignments (${empAssignments.length})` },
    { id: 'sessions', label: `Sessions (${sessionRecords.length})` },
    { id: 'assessments', label: `Assessments (${empAttempts.length})` },
    { id: 'followups', label: `Follow-ups (${empFollowUps.length})` },
    { id: 'improvements', label: `Improvement (${empImprovementPlans.length})` },
    { id: 'certificates', label: `Certificates (${empCertificates.length})` },
    { id: 'notes', label: 'Notes & Evidence' },
    { id: 'audit', label: 'Audit Log' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F8F9F8] border border-[#ECEEF0] text-[#17191B] flex items-center justify-center font-bold text-base">
            {employee.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#17191B]">{employee.name}</span>
              <span className="text-xs font-mono text-[#A1A5AA] tabular-nums font-medium">{employee.id}</span>
              <Badge variant={getStatusBadgeVariant(employee.currentReadiness)} size="sm" dot>
                {employee.currentReadiness}
              </Badge>
            </div>
            <p className="text-xs text-[#73777D] font-normal">
              {employee.designation} · {employee.brand} · {employee.territory}, {employee.city}
            </p>
          </div>
        </div>
      }
      maxWidth="5xl"
      footer={
        <div className="flex items-center justify-between w-full text-xs">
          <button
            onClick={handleExportJourney}
            className="flex items-center gap-1.5 px-4 py-2 border border-[#ECEEF0] rounded-full text-[#17191B] hover:bg-[#F8F9F8] font-medium cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#73777D]" />
            Export Training Dossier
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onOpenScheduleFollowUp(employee.id);
                onClose();
              }}
              className="px-4 py-2 border border-[#ECEEF0] bg-white text-[#17191B] hover:bg-[#F8F9F8] rounded-full font-medium cursor-pointer transition-colors"
            >
              Schedule Follow-up Audit
            </button>
            <button
              onClick={() => {
                onOpenAssignModal(employee.id);
                onClose();
              }}
              className="px-5 py-2 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] rounded-full font-semibold cursor-pointer transition-colors"
            >
              Assign Program
            </button>
          </div>
        </div>
      }
    >
      {/* 10 Navigation Tabs - Monetra Segmented Pill Bar */}
      <div className="overflow-x-auto scrollbar-none pb-2 mb-5">
        <div className="p-1 bg-[#F8F9F8] border border-[#ECEEF0] rounded-full inline-flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-1.5 px-3.5 text-xs font-medium whitespace-nowrap rounded-full transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#17191B] text-white shadow-soft'
                  : 'text-[#73777D] hover:text-[#17191B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4 text-xs text-[#17191B]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[#F8F9F8] p-4 rounded-2xl border border-[#ECEEF0]">
              <span className="text-[10px] font-semibold uppercase text-[#A1A5AA] tracking-wider">Designation & Brand</span>
              <p className="text-sm font-semibold text-[#17191B] mt-1">{employee.designation}</p>
              <p className="text-[#73777D]">{employee.brand}</p>
              <p className="text-[11px] text-[#A1A5AA] mt-1">Project: {employee.programName}</p>
            </div>

            <div className="bg-[#F8F9F8] p-4 rounded-2xl border border-[#ECEEF0]">
              <span className="text-[10px] font-semibold uppercase text-[#A1A5AA] tracking-wider">Territory & Reporting</span>
              <p className="text-sm font-semibold text-[#17191B] mt-1">{employee.city}, {employee.state}</p>
              <p className="text-[#73777D]">{employee.territory}</p>
              <p className="text-[11px] text-[#A1A5AA] mt-1">Supervisor: {employee.supervisorName}</p>
            </div>

            <div className="bg-[#F8F9F8] p-4 rounded-2xl border border-[#ECEEF0]">
              <span className="text-[10px] font-semibold uppercase text-[#A1A5AA] tracking-wider">Tenure & Employment</span>
              <p className="text-sm font-semibold text-[#17191B] mt-1">{employee.employeeStatus}</p>
              <p className="text-[#73777D] tabular-nums">Joined: {employee.joiningDate}</p>
              <p className="text-[11px] text-[#A1A5AA] mt-1 tabular-nums">Programs Completed: {employee.completedProgramCount}</p>
            </div>
          </div>

          {/* Training Readiness Criteria Checklist */}
          <div className="p-4 bg-white rounded-2xl border border-[#ECEEF0] shadow-soft">
            <h4 className="font-semibold text-[#17191B] text-sm mb-2 flex items-center justify-between">
              <span>Field Readiness Operational Criteria</span>
              <Badge variant={getStatusBadgeVariant(employee.currentReadiness)} size="sm">
                {employee.currentReadiness}
              </Badge>
            </h4>

            {employee.currentReadiness === 'Training Ready' ? (
              <div className="p-3 bg-[#E9FBD1] rounded-xl border border-[#A6F52F]/40 text-[#17191B] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4DBB70] shrink-0" />
                <span>
                  All operational conditions fulfilled: Curriculum completed, physical/online session attended, assessment passed &ge; 80%, practical follow-up verified satisfactory, and active certificate issued.
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-[#73777D]">
                  Criteria still outstanding before field clearance:
                </p>
                <div className="space-y-1.5">
                  {(employee.readinessCriteriaOutstanding && employee.readinessCriteriaOutstanding.length > 0
                    ? employee.readinessCriteriaOutstanding
                    : ['Module completion in progress', 'Practical store follow-up required']
                  ).map((crit, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 bg-[#F8F9F8] rounded-xl border border-[#ECEEF0] text-[#17191B] text-xs font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#E9A84C] shrink-0" />
                      <span>{crit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Training Journey (Visual Chronological Timeline) */}
      {activeTab === 'journey' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#17191B] uppercase tracking-wider">
              Chronological Employee Journey ({empTimeline.length} Events)
            </h4>
            <span className="text-[11px] text-[#A1A5AA]">Immutable Audit Trail</span>
          </div>

          {empTimeline.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#A1A5AA] bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0]">
              No journey events recorded yet. Assign a training program to begin.
            </div>
          ) : (
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#ECEEF0]">
              {empTimeline.map((evt, idx) => {
                let dotColor = 'bg-[#17191B]';
                if (evt.eventType.includes('evaluated') && evt.title.includes('FAILED')) dotColor = 'bg-[#E56C6C]';
                if (evt.eventType.includes('readiness') || (evt.eventType.includes('evaluated') && evt.title.includes('PASSED'))) dotColor = 'bg-[#A6F52F]';
                if (evt.eventType.includes('improvement')) dotColor = 'bg-[#E9A84C]';

                return (
                  <div key={evt.id || idx} className="relative group">
                    {/* Circle */}
                    <div className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 border-white ring-2 ring-[#ECEEF0] ${dotColor}`} />

                    <div className="bg-[#F8F9F8] p-4 rounded-2xl border border-[#ECEEF0] hover:border-[#DFE2E5] transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <span className="font-semibold text-xs text-[#17191B]">{evt.title}</span>
                        <span className="text-[10px] text-[#A1A5AA] font-mono tabular-nums">
                          {new Date(evt.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-[#73777D] leading-relaxed">
                        {evt.description}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#A1A5AA] pt-2 border-t border-[#ECEEF0]">
                        <span>Actor: <strong className="text-[#17191B] font-medium">{evt.actorName}</strong> ({evt.actorRole})</span>
                        <span className="font-mono tabular-nums">{evt.id}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Assignments */}
      {activeTab === 'assignments' && (
        <div className="space-y-3">
          {empAssignments.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#A1A5AA] bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0]">
              No training assignments for this employee.
            </div>
          ) : (
            empAssignments.map(asg => (
              <div key={asg.id} className="p-4 bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0] space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-semibold text-xs text-[#17191B]">{asg.programName}</h5>
                    <p className="text-[11px] text-[#73777D]">
                      ID: {asg.id} · Version: {asg.programVersion} · Mode: {asg.deliveryMode}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(asg.status)} size="sm">
                    {asg.status}
                  </Badge>
                </div>

                <div className="w-full bg-[#ECEEF0] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#A6F52F] h-full rounded-full" style={{ width: `${asg.progressPercent}%` }} />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#73777D] pt-1">
                  <span>Priority: <strong className="text-[#17191B] font-medium">{asg.priority}</strong> | Due: <strong className="text-[#17191B] font-medium tabular-nums">{asg.dueDate}</strong></span>
                  <span>Trainer: <strong className="text-[#17191B] font-medium">{asg.trainerName}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Sessions & Attendance */}
      {activeTab === 'sessions' && (
        <div className="space-y-3">
          {sessionRecords.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#A1A5AA] bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0]">
              No sessions scheduled or attended yet.
            </div>
          ) : (
            sessionRecords.map((s, idx) => (
              <div key={idx} className="p-4 bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0] flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-semibold text-[#17191B]">{s.sessionTitle}</h5>
                  <p className="text-[11px] text-[#73777D] tabular-nums">
                    Session: {s.sessionId} · Date: {s.date}
                  </p>
                  {s.trainerRemarks && (
                    <p className="text-[11px] text-[#73777D] mt-1 italic">
                      Remarks: "{s.trainerRemarks}"
                    </p>
                  )}
                  {s.absenceReason && (
                    <p className="text-[11px] text-[#E56C6C] mt-1">
                      Absence reason: {s.absenceReason}
                    </p>
                  )}
                </div>
                <Badge variant={getStatusBadgeVariant(s.status)} size="sm">
                  {s.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 5: Assessments */}
      {activeTab === 'assessments' && (
        <div className="space-y-3">
          {empAttempts.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#A1A5AA] bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0]">
              No assessment attempts recorded for this employee.
            </div>
          ) : (
            empAttempts.map(att => (
              <div key={att.id} className="p-4 bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0] space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-semibold text-[#17191B]">{att.assessmentTitle}</h5>
                    <p className="text-[11px] text-[#73777D]">
                      Attempt #{att.attemptNumber} · ID: {att.id} · Evaluated by {att.evaluatorName}
                    </p>
                  </div>
                  <Badge variant={att.status === 'Passed' ? 'green' : 'red'} size="sm">
                    {att.status} ({att.percentage}%)
                  </Badge>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#ECEEF0]">
                  <div className="flex justify-between font-medium text-[#17191B] tabular-nums">
                    <span>Score: {att.score} / {att.maxScore} marks</span>
                    <span>Result: {att.percentage}%</span>
                  </div>
                  {att.trainerComments && (
                    <p className="text-[11px] text-[#73777D] mt-1">
                      <strong>Trainer Feedback:</strong> {att.trainerComments}
                    </p>
                  )}
                  {att.topicKnowledgeGaps.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[#ECEEF0] flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-[#E56C6C] font-semibold">Identified Gaps:</span>
                      {att.topicKnowledgeGaps.map((gap, i) => (
                        <span key={i} className="text-[10px] bg-[#E56C6C]/10 text-[#E56C6C] px-2 py-0.5 rounded-full border border-[#E56C6C]/20 font-medium">
                          {gap}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 6: Follow-ups */}
      {activeTab === 'followups' && (
        <div className="space-y-3">
          {empFollowUps.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#A1A5AA] bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0]">
              No follow-up audits scheduled.
            </div>
          ) : (
            empFollowUps.map(f => (
              <div key={f.id} className="p-4 bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-[#17191B]">{f.method} · {f.type.replace('_', ' ')}</h5>
                    <p className="text-[11px] text-[#73777D] tabular-nums">
                      ID: {f.id} · Due: {f.dueDate} · Trainer: {f.ownerTrainerName}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(f.status)} size="sm">
                    {f.status} {f.outcome ? `(${f.outcome})` : ''}
                  </Badge>
                </div>

                {/* Checklist */}
                <div className="bg-white p-3 rounded-xl border border-[#ECEEF0] space-y-1.5">
                  <p className="font-semibold text-[11px] text-[#17191B] uppercase tracking-wider">Audit Checklist</p>
                  {f.checklistItems.map(c => (
                    <div key={c.id} className="flex items-center gap-2 text-[#73777D]">
                      <input type="checkbox" checked={c.checked} readOnly className="rounded accent-[#17191B] cursor-default" />
                      <span>{c.task}</span>
                    </div>
                  ))}
                </div>

                {f.trainerObservation && (
                  <p className="text-[11px] text-[#73777D] bg-white p-3 rounded-xl border border-[#ECEEF0]">
                    <strong className="text-[#17191B]">Observation:</strong> {f.trainerObservation}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 7: Improvement Plans */}
      {activeTab === 'improvements' && (
        <div className="space-y-3">
          {empImprovementPlans.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#A1A5AA] bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0]">
              No active or closed improvement plans.
            </div>
          ) : (
            empImprovementPlans.map(plan => (
              <div key={plan.id} className="p-4 bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0] text-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-semibold text-[#17191B]">Plan {plan.id} - {plan.originatingReason}</h5>
                    <p className="text-[11px] text-[#73777D] tabular-nums">
                      Assigned Trainer: {plan.assignedTrainerName} · Target: {plan.targetCompletionDate}
                    </p>
                  </div>
                  <Badge variant={plan.status === 'Closed' ? 'green' : 'amber'} size="sm">
                    {plan.status}
                  </Badge>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#ECEEF0]">
                  <p className="text-[#17191B] font-semibold mb-1">Problem Description:</p>
                  <p className="text-[#73777D] text-[11px] leading-relaxed">{plan.problemDescription}</p>

                  <div className="mt-3 space-y-1.5">
                    <p className="text-[11px] font-semibold text-[#17191B] uppercase tracking-wider">Corrective Milestones ({plan.actions.length})</p>
                    {plan.actions.map(act => (
                      <div key={act.id} className="flex items-center justify-between p-2 bg-[#F8F9F8] rounded-xl border border-[#ECEEF0] text-[11px]">
                        <span className="text-[#17191B] font-medium">{act.title}</span>
                        <Badge variant={act.status === 'Completed' ? 'green' : 'amber'} size="sm">
                          {act.status}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {plan.closureReason && (
                    <div className="mt-3 p-2.5 bg-[#E9FBD1] rounded-xl border border-[#A6F52F]/40 text-[#17191B] text-[11px]">
                      <strong>Closure Note:</strong> {plan.closureReason} (Closed by {plan.closedBy})
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 8: Certifications */}
      {activeTab === 'certificates' && (
        <div className="space-y-3">
          {empCertificates.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#A1A5AA] bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0]">
              No certifications issued yet.
            </div>
          ) : (
            empCertificates.map(cert => (
              <div key={cert.id} className="p-4 bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E9FBD1] text-[#17191B] flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-[#17191B]">{cert.programName}</h5>
                    <p className="text-[11px] text-[#73777D] font-mono tabular-nums">
                      #{cert.certificateNumber} · Score: {cert.scoreAchieved}%
                    </p>
                    <p className="text-[10px] text-[#A1A5AA] tabular-nums">
                      Valid: {cert.issueDate} to {cert.expiryDate} · Issued by {cert.issuedByTrainerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(cert.status)} size="sm">
                    {cert.status}
                  </Badge>
                  <button
                    onClick={() => onOpenCertificateModal(cert.id)}
                    className="px-4 py-1.5 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View & Print
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 9: Notes & Evidence */}
      {activeTab === 'notes' && (
        <div className="space-y-4 text-xs">
          <div className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Add trainer observation or field verification remark..."
              className="flex-1 bg-[#F8F9F8] border border-[#ECEEF0] rounded-full px-4 py-2 text-xs text-[#17191B] focus:bg-white focus:border-[#A6F52F] focus:outline-hidden"
            />
            <button
              onClick={handleAddNote}
              className="px-5 py-2 bg-[#A6F52F] hover:bg-[#95E622] text-[#17191B] rounded-full font-semibold cursor-pointer transition-colors"
            >
              Add Note
            </button>
          </div>

          <div className="space-y-2">
            {trainerNotes.map((note, idx) => (
              <div key={idx} className="p-3 bg-[#F8F9F8] rounded-2xl border border-[#ECEEF0] text-[#17191B] flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-[#73777D] mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p>{note}</p>
                  <span className="text-[10px] text-[#A1A5AA]">Logged by {currentTrainer.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 10: Audit Log */}
      {activeTab === 'audit' && (
        <div className="space-y-2 text-xs">
          <p className="text-[11px] text-[#73777D] mb-2">
            System audit records referencing employee {employee.id} and associated training entities:
          </p>
          <div className="divide-y divide-[#ECEEF0] border border-[#ECEEF0] rounded-2xl overflow-hidden bg-white">
            {auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <span className="font-semibold text-[#17191B]">{log.eventType}</span>
                  <span className="text-[#73777D] ml-2">({log.entityType}: {log.entityId})</span>
                  <p className="text-[11px] text-[#73777D] mt-0.5">
                    Reason: {log.reason}
                  </p>
                </div>
                <div className="text-right text-[10px] text-[#A1A5AA] font-mono tabular-nums">
                  <p>{log.actorName} ({log.actorRole})</p>
                  <p>{new Date(log.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};
