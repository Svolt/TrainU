/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Operations State & Context Engine
 * Implements centralized operational state, auditable mutations & policy management
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Trainer,
  Employee,
  TrainingProgram,
  LearningResource,
  TrainingAssignment,
  TrainingBatch,
  TrainingSession,
  Question,
  Assessment,
  AssessmentAttempt,
  FollowUpRecord,
  ImprovementPlan,
  Certification,
  TrainingEvent,
  AuditLog,
  NotificationItem,
  Announcement,
  ConfigurablePolicies,
  AttendanceStatus,
  FollowUpOutcome
} from '../types';
import {
  seedTrainers,
  seedEmployees,
  seedPrograms,
  seedResources,
  seedBatches,
  seedSessions,
  seedQuestions,
  seedAssessments,
  seedAssessmentAttempts,
  seedFollowUps,
  seedImprovementPlans,
  seedCertificates,
  seedAssignments,
  seedTimelineEvents,
  seedAuditLogs,
  seedNotifications,
  seedAnnouncements,
  initialPolicies
} from '../data/seedData';

interface DashboardKPIs {
  assignedEmployeesCount: number;
  employeesTrainedCount: number;
  trainingCompletionRate: number;
  sessionsScheduledCount: number;
  sessionsCompletedCount: number;
  attemptPassRate: number;
  employeePassRate: number;
  followUpsDueCount: number;
  overdueFollowUpsCount: number;
  employeesRequiringAttentionCount: number;
  readinessRate: number;
}

interface AppContextType {
  // Active User / Trainer Context
  currentTrainer: Trainer;
  setCurrentTrainerId: (id: string) => void;
  trainers: Trainer[];

  // Configurable Policies (Appendix B)
  policies: ConfigurablePolicies;
  updatePolicies: (updates: Partial<ConfigurablePolicies>) => void;

  // Master Data & Collections
  employees: Employee[];
  programs: TrainingProgram[];
  resources: LearningResource[];
  batches: TrainingBatch[];
  sessions: TrainingSession[];
  assignments: TrainingAssignment[];
  assessments: Assessment[];
  questions: Question[];
  attempts: AssessmentAttempt[];
  followUps: FollowUpRecord[];
  improvementPlans: ImprovementPlan[];
  certificates: Certification[];
  timelineEvents: TrainingEvent[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  announcements: Announcement[];

  // Computed KPIs
  kpis: DashboardKPIs;

  // Operational Actions & Workflows
  assignTraining: (data: {
    employeeIds: string[];
    programId: string;
    programVersion?: string;
    priority: 'High' | 'Medium' | 'Low';
    reason: string;
    dueDate: string;
    batchId?: string;
    forceReenroll?: boolean;
  }) => { success: boolean; message: string; createdCount: number; skippedIds: string[] };

  createProgram: (newProgram: Partial<TrainingProgram>) => void;
  createBatch: (newBatch: Partial<TrainingBatch>) => void;
  createSession: (newSession: Partial<TrainingSession>, participantIds: string[]) => { success: boolean; message: string };
  markSessionAttendance: (
    sessionId: string,
    records: {
      employeeId: string;
      status: AttendanceStatus;
      checkInTime?: string;
      checkOutTime?: string;
      latenessMinutes?: number;
      absenceReason?: string;
      trainerRemarks?: string;
    }[]
  ) => void;
  correctAttendance: (
    sessionId: string,
    employeeId: string,
    newStatus: AttendanceStatus,
    reason: string
  ) => void;
  completeFollowUp: (
    followUpId: string,
    outcome: FollowUpOutcome,
    trainerObservation: string,
    employeeFeedback: string,
    evidenceAttachment?: string
  ) => void;
  createFollowUp: (data: Partial<FollowUpRecord>) => void;
  createImprovementPlan: (plan: Partial<ImprovementPlan>) => void;
  closeImprovementPlan: (planId: string, closureReason: string) => void;
  recordReassessmentAttempt: (data: {
    assignmentId: string;
    assessmentId: string;
    employeeId: string;
    score: number;
    maxScore: number;
    status: 'Passed' | 'Failed';
    feedback: string;
  }) => void;
  issueCertificate: (data: {
    employeeId: string;
    programId: string;
    scoreAchieved: number;
  }) => void;
  revokeCertificate: (certId: string, reason: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'sentAt' | 'sentBy'>) => void;
  addLearningResource: (resource: Omit<LearningResource, 'id' | 'uploadDate'>) => void;
  resetToDefaultData: () => void;
  toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'LIS_LEARN_DATA_V1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state with localStorage support for seamless testing
  const [trainers] = useState<Trainer[]>(seedTrainers);
  const [currentTrainerId, setCurrentTrainerId] = useState<string>('TRN-101');
  const [policies, setPolicies] = useState<ConfigurablePolicies>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_POLICIES`);
    return saved ? JSON.parse(saved) : initialPolicies;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_EMPLOYEES`);
    return saved ? JSON.parse(saved) : seedEmployees;
  });

  const [programs, setPrograms] = useState<TrainingProgram[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_PROGRAMS`);
    return saved ? JSON.parse(saved) : seedPrograms;
  });

  const [resources, setResources] = useState<LearningResource[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_RESOURCES`);
    return saved ? JSON.parse(saved) : seedResources;
  });

  const [batches, setBatches] = useState<TrainingBatch[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_BATCHES`);
    return saved ? JSON.parse(saved) : seedBatches;
  });

  const [sessions, setSessions] = useState<TrainingSession[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_SESSIONS`);
    return saved ? JSON.parse(saved) : seedSessions;
  });

  const [assignments, setAssignments] = useState<TrainingAssignment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ASSIGNMENTS`);
    return saved ? JSON.parse(saved) : seedAssignments;
  });

  const [assessments] = useState<Assessment[]>(seedAssessments);
  const [questions] = useState<Question[]>(seedQuestions);

  const [attempts, setAttempts] = useState<AssessmentAttempt[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ATTEMPTS`);
    return saved ? JSON.parse(saved) : seedAssessmentAttempts;
  });

  const [followUps, setFollowUps] = useState<FollowUpRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_FOLLOWUPS`);
    return saved ? JSON.parse(saved) : seedFollowUps;
  });

  const [improvementPlans, setImprovementPlans] = useState<ImprovementPlan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_IMPROVEMENTS`);
    return saved ? JSON.parse(saved) : seedImprovementPlans;
  });

  const [certificates, setCertificates] = useState<Certification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_CERTIFICATES`);
    return saved ? JSON.parse(saved) : seedCertificates;
  });

  const [timelineEvents, setTimelineEvents] = useState<TrainingEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_TIMELINE`);
    return saved ? JSON.parse(saved) : seedTimelineEvents;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_AUDIT`);
    return saved ? JSON.parse(saved) : seedAuditLogs;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_NOTIFS`);
    return saved ? JSON.parse(saved) : seedNotifications;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ANNOUNCEMENTS`);
    return saved ? JSON.parse(saved) : seedAnnouncements;
  });

  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' }[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Current active trainer profile
  const currentTrainer = trainers.find(t => t.id === currentTrainerId) || trainers[0];

  // Auto-sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_POLICIES`, JSON.stringify(policies));
    localStorage.setItem(`${STORAGE_KEY}_EMPLOYEES`, JSON.stringify(employees));
    localStorage.setItem(`${STORAGE_KEY}_PROGRAMS`, JSON.stringify(programs));
    localStorage.setItem(`${STORAGE_KEY}_RESOURCES`, JSON.stringify(resources));
    localStorage.setItem(`${STORAGE_KEY}_BATCHES`, JSON.stringify(batches));
    localStorage.setItem(`${STORAGE_KEY}_SESSIONS`, JSON.stringify(sessions));
    localStorage.setItem(`${STORAGE_KEY}_ASSIGNMENTS`, JSON.stringify(assignments));
    localStorage.setItem(`${STORAGE_KEY}_ATTEMPTS`, JSON.stringify(attempts));
    localStorage.setItem(`${STORAGE_KEY}_FOLLOWUPS`, JSON.stringify(followUps));
    localStorage.setItem(`${STORAGE_KEY}_IMPROVEMENTS`, JSON.stringify(improvementPlans));
    localStorage.setItem(`${STORAGE_KEY}_CERTIFICATES`, JSON.stringify(certificates));
    localStorage.setItem(`${STORAGE_KEY}_TIMELINE`, JSON.stringify(timelineEvents));
    localStorage.setItem(`${STORAGE_KEY}_AUDIT`, JSON.stringify(auditLogs));
    localStorage.setItem(`${STORAGE_KEY}_NOTIFS`, JSON.stringify(notifications));
    localStorage.setItem(`${STORAGE_KEY}_ANNOUNCEMENTS`, JSON.stringify(announcements));
  }, [
    policies, employees, programs, resources, batches, sessions,
    assignments, attempts, followUps, improvementPlans, certificates,
    timelineEvents, auditLogs, notifications, announcements
  ]);

  // Compute Live Dashboard KPIs (Section 4)
  const activeAssignments = assignments.filter(a => a.status !== 'Cancelled' && a.status !== 'Withdrawn');
  const assignedEmployeesDistinct = new Set(activeAssignments.map(a => a.employeeId)).size;
  const trainedEmployeesDistinct = new Set(assignments.filter(a => a.status === 'Completed' || a.status === 'Training Ready').map(a => a.employeeId)).size;
  
  const completedAssignmentsCount = assignments.filter(a => a.status === 'Completed' || a.status === 'Training Ready').length;
  const totalEligibleAssignments = assignments.filter(a => a.status !== 'Draft' && a.status !== 'Cancelled').length;
  const trainingCompletionRate = totalEligibleAssignments > 0 ? Math.round((completedAssignmentsCount / totalEligibleAssignments) * 100) : 0;

  const sessionsScheduledCount = sessions.filter(s => s.status === 'Scheduled' || s.status === 'Rescheduled').length;
  const sessionsCompletedCount = sessions.filter(s => s.status === 'Completed').length;

  const passedAttempts = attempts.filter(a => a.status === 'Passed').length;
  const totalEvaluatedAttempts = attempts.filter(a => a.status === 'Passed' || a.status === 'Failed').length;
  const attemptPassRate = totalEvaluatedAttempts > 0 ? Math.round((passedAttempts / totalEvaluatedAttempts) * 100) : 0;

  const employeesPassed = new Set(attempts.filter(a => a.status === 'Passed').map(a => a.employeeId)).size;
  const employeesAttempted = new Set(attempts.map(a => a.employeeId)).size;
  const employeePassRate = employeesAttempted > 0 ? Math.round((employeesPassed / employeesAttempted) * 100) : 0;

  const followUpsDueCount = followUps.filter(f => f.status === 'Due').length;
  const overdueFollowUpsCount = followUps.filter(f => f.status === 'Overdue').length;

  const employeesRequiringAttentionCount = employees.filter(e => e.currentReadiness === 'Needs Attention').length;

  const readyEmployeesCount = employees.filter(e => e.currentReadiness === 'Training Ready').length;
  const readinessRate = employees.length > 0 ? Math.round((readyEmployeesCount / employees.length) * 100) : 0;

  const kpis: DashboardKPIs = {
    assignedEmployeesCount: assignedEmployeesDistinct,
    employeesTrainedCount: trainedEmployeesDistinct,
    trainingCompletionRate,
    sessionsScheduledCount,
    sessionsCompletedCount,
    attemptPassRate,
    employeePassRate,
    followUpsDueCount,
    overdueFollowUpsCount,
    employeesRequiringAttentionCount,
    readinessRate
  };

  const updatePolicies = (updates: Partial<ConfigurablePolicies>) => {
    setPolicies(prev => {
      const next = { ...prev, ...updates };
      // Audit entry for policy modification
      const auditEntry: AuditLog = {
        id: `AUD-${Date.now()}`,
        entityType: 'Policy',
        entityId: 'SYSTEM-POLICIES',
        eventType: 'BUSINESS_POLICY_MODIFIED',
        actorId: currentTrainer.id,
        actorName: currentTrainer.name,
        actorRole: currentTrainer.role,
        timestamp: new Date().toISOString(),
        previousValue: JSON.stringify(prev),
        newValue: JSON.stringify(next),
        reason: 'Trainer/Admin updated operational business policies in Settings'
      };
      setAuditLogs(logs => [auditEntry, ...logs]);
      return next;
    });
  };

  // Assign training with validation, duplicate check, and audit
  const assignTraining = ({
    employeeIds,
    programId,
    programVersion,
    priority,
    reason,
    dueDate,
    batchId,
    forceReenroll = false
  }: {
    employeeIds: string[];
    programId: string;
    programVersion?: string;
    priority: 'High' | 'Medium' | 'Low';
    reason: string;
    dueDate: string;
    batchId?: string;
    forceReenroll?: boolean;
  }) => {
    const prog = programs.find(p => p.id === programId);
    if (!prog) {
      return { success: false, message: 'Program not found.', createdCount: 0, skippedIds: [] };
    }

    const versionToUse = programVersion || prog.currentVersion;
    const newAssignments: TrainingAssignment[] = [];
    const skippedIds: string[] = [];
    const newEvents: TrainingEvent[] = [];
    const nowIso = new Date().toISOString();

    employeeIds.forEach(empId => {
      const emp = employees.find(e => e.id === empId);
      if (!emp) return;

      // Check active duplicate assignment rule
      const hasActive = assignments.some(
        a => a.employeeId === empId && a.programId === programId &&
        ['Assigned', 'In Progress', 'Assessment Pending', 'Follow-up Pending'].includes(a.status)
      );

      if (hasActive && !forceReenroll) {
        skippedIds.push(empId);
        return;
      }

      const assignmentId = `ASG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const batchObj = batches.find(b => b.id === batchId);

      const newAsg: TrainingAssignment = {
        id: assignmentId,
        employeeId: emp.id,
        employeeName: emp.name,
        employeeDesignation: emp.designation,
        employeeBrand: emp.brand,
        programId: prog.id,
        programName: prog.name,
        programVersion: versionToUse,
        trainerId: currentTrainer.id,
        trainerName: currentTrainer.name,
        batchId: batchId,
        batchName: batchObj ? batchObj.name : undefined,
        assignmentSource: employeeIds.length > 1 ? 'bulk' : 'manual',
        assignedDate: nowIso.split('T')[0],
        dueDate: dueDate,
        priority: priority,
        reason: reason,
        deliveryMode: prog.deliveryModes[0] || 'hybrid',
        status: policies.assignmentApprovalPolicy === 'manager_approval' && currentTrainer.role !== 'program_manager' 
          ? 'Pending Approval' 
          : 'Assigned',
        progressPercent: 10,
        approvalStatus: policies.assignmentApprovalPolicy === 'manager_approval' ? 'Pending' : 'Approved',
        isReadyForField: false,
        linkedSessionIds: [],
        linkedAssessmentAttemptIds: [],
        linkedFollowUpIds: [],
        linkedImprovementPlanIds: []
      };

      newAssignments.push(newAsg);

      // Training Journey timeline event
      newEvents.push({
        id: `EVT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        employeeId: emp.id,
        timestamp: nowIso,
        eventType: 'assignment_created',
        title: `Assigned: ${prog.name} (${versionToUse})`,
        description: `Priority: ${priority}. Due by ${dueDate}. Assigned by ${currentTrainer.name}. Reason: ${reason}`,
        actorName: currentTrainer.name,
        actorRole: currentTrainer.role
      });
    });

    if (newAssignments.length > 0) {
      setAssignments(prev => [...newAssignments, ...prev]);
      setTimelineEvents(prev => [...newEvents, ...prev]);

      // Update employee activeAssignmentCount & readiness if Untrained
      setEmployees(prev => prev.map(emp => {
        const matchingCreated = newAssignments.find(a => a.employeeId === emp.id);
        if (matchingCreated) {
          return {
            ...emp,
            activeAssignmentCount: emp.activeAssignmentCount + 1,
            currentReadiness: emp.currentReadiness === 'Untrained' ? 'In Training' : emp.currentReadiness,
            readinessCriteriaOutstanding: ['Course completion & assessment in progress']
          };
        }
        return emp;
      }));

      // Audit log
      const audit: AuditLog = {
        id: `AUD-${Date.now()}`,
        entityType: 'Assignment',
        entityId: newAssignments.map(a => a.id).join(', '),
        eventType: 'ASSIGNMENT_CREATED',
        actorId: currentTrainer.id,
        actorName: currentTrainer.name,
        actorRole: currentTrainer.role,
        timestamp: nowIso,
        newValue: `${newAssignments.length} employee(s) assigned to ${prog.name}`,
        reason: reason
      };
      setAuditLogs(prev => [audit, ...prev]);

      // Add Notification
      const notif: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        title: 'New Training Assignments Created',
        message: `${newAssignments.length} employee(s) were assigned to ${prog.name}. Due on ${dueDate}.`,
        type: 'assignment',
        priority: priority === 'High' ? 'high' : 'normal',
        timestamp: nowIso,
        read: false,
        actionUrl: '/employees',
        channel: 'In-App',
        deliveryStatus: 'Delivered'
      };
      setNotifications(prev => [notif, ...prev]);
    }

    return {
      success: newAssignments.length > 0,
      message: newAssignments.length > 0 
        ? `Successfully assigned ${newAssignments.length} employee(s).` 
        : `All selected employees already have active assignments for this program.`,
      createdCount: newAssignments.length,
      skippedIds
    };
  };

  const createProgram = (data: Partial<TrainingProgram>) => {
    const newProg: TrainingProgram = {
      id: `PRG-${Math.floor(100 + Math.random() * 900)}`,
      name: data.name || 'Untitled Training Program',
      code: data.code || `PRG-${Math.floor(1000 + Math.random() * 9000)}`,
      description: data.description || '',
      category: data.category || 'Product',
      brandAssociation: data.brandAssociation || "Haldiram's",
      targetDesignations: data.targetDesignations || ['Merchandiser'],
      trainingObjectives: data.trainingObjectives || [],
      prerequisites: data.prerequisites || [],
      currentVersion: 'v1.0',
      versions: [
        {
          versionId: `VER-${Date.now()}`,
          versionNumber: 'v1.0',
          effectiveDate: new Date().toISOString().split('T')[0],
          changeSummary: 'Initial release',
          status: 'Active',
          modules: data.versions?.[0]?.modules || [],
          passingScore: data.versions?.[0]?.passingScore || 80,
          maxAssessmentAttempts: data.versions?.[0]?.maxAssessmentAttempts || 3,
          requiresPracticalFollowUp: true,
          requiresCertification: true
        }
      ],
      deliveryModes: data.deliveryModes || ['hybrid'],
      ownerTrainerId: currentTrainer.id,
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPrograms(prev => [newProg, ...prev]);

    const audit: AuditLog = {
      id: `AUD-${Date.now()}`,
      entityType: 'Program',
      entityId: newProg.id,
      eventType: 'PROGRAM_CREATED',
      actorId: currentTrainer.id,
      actorName: currentTrainer.name,
      actorRole: currentTrainer.role,
      timestamp: new Date().toISOString(),
      newValue: newProg.name,
      reason: 'Trainer created new operational training program'
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const createBatch = (data: Partial<TrainingBatch>) => {
    const newBatch: TrainingBatch = {
      id: `BATCH-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      code: data.code || `B-${Math.floor(100 + Math.random() * 900)}`,
      name: data.name || 'New Training Batch',
      programId: data.programId || programs[0].id,
      programName: data.programName || programs[0].name,
      programVersion: data.programVersion || 'v1.0',
      trainerId: currentTrainer.id,
      trainerName: currentTrainer.name,
      mode: data.mode || 'hybrid',
      capacity: data.capacity || 20,
      enrolledCount: (data.participantEmployeeIds || []).length,
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || new Date().toISOString().split('T')[0],
      location: data.location || 'Training Hub',
      status: 'Planned',
      participantEmployeeIds: data.participantEmployeeIds || [],
      completionRatePercent: 0
    };

    setBatches(prev => [newBatch, ...prev]);
  };

  const createSession = (data: Partial<TrainingSession>, participantIds: string[]) => {
    // Conflict check
    const hasConflict = sessions.some(s => 
      s.trainerId === (data.trainerId || currentTrainer.id) &&
      s.date === data.date &&
      s.startTime === data.startTime &&
      s.status !== 'Cancelled'
    );

    if (hasConflict) {
      return {
        success: false,
        message: `Trainer schedule conflict: Trainer is already booked for another session on ${data.date} at ${data.startTime}.`
      };
    }

    const participants: Employee[] = employees.filter(e => participantIds.includes(e.id));
    const attendanceRecords = participants.map(emp => ({
      employeeId: emp.id,
      employeeName: emp.name,
      employeeDesignation: emp.designation,
      status: 'Not Recorded' as AttendanceStatus,
      markedByTrainerId: currentTrainer.id,
      updatedAt: new Date().toISOString()
    }));

    const newSession: TrainingSession = {
      id: `SES-${Math.floor(200 + Math.random() * 800)}`,
      title: data.title || 'Practical Training Session',
      programId: data.programId || programs[0].id,
      programName: data.programName || programs[0].name,
      moduleId: data.moduleId,
      moduleTitle: data.moduleTitle,
      batchId: data.batchId,
      batchName: data.batchName,
      sessionType: data.sessionType || 'classroom',
      trainerId: data.trainerId || currentTrainer.id,
      trainerName: data.trainerName || currentTrainer.name,
      date: data.date || new Date().toISOString().split('T')[0],
      startTime: data.startTime || '10:00',
      endTime: data.endTime || '12:00',
      timezone: 'Asia/Kolkata (IST)',
      venueOrLink: data.venueOrLink || 'LoveInStore Hub',
      isOnline: Boolean(data.isOnline),
      capacity: data.capacity || 20,
      participantCount: participantIds.length,
      status: 'Scheduled',
      agenda: data.agenda || '',
      requiredMaterials: data.requiredMaterials || ['Official LIS ID & Apron'],
      preSessionInstructions: data.preSessionInstructions,
      attendanceFinalized: false,
      attendanceRecords: attendanceRecords
    };

    setSessions(prev => [newSession, ...prev]);

    // Timeline events
    const nowIso = new Date().toISOString();
    const sessionEvents: TrainingEvent[] = participants.map(emp => ({
      id: `EVT-${Date.now()}-${emp.id}`,
      employeeId: emp.id,
      timestamp: nowIso,
      eventType: 'session_scheduled',
      title: `Session Scheduled: ${newSession.title}`,
      description: `Date: ${newSession.date} at ${newSession.startTime}. Venue/Link: ${newSession.venueOrLink}. Facilitator: ${newSession.trainerName}`,
      actorName: currentTrainer.name,
      actorRole: currentTrainer.role
    }));
    setTimelineEvents(prev => [...sessionEvents, ...prev]);

    return {
      success: true,
      message: `Session "${newSession.title}" scheduled successfully with ${participantIds.length} participant(s).`
    };
  };

  const markSessionAttendance = (
    sessionId: string,
    records: {
      employeeId: string;
      status: AttendanceStatus;
      checkInTime?: string;
      checkOutTime?: string;
      latenessMinutes?: number;
      absenceReason?: string;
      trainerRemarks?: string;
    }[]
  ) => {
    const nowIso = new Date().toISOString();
    setSessions(prev => prev.map(s => {
      if (s.id !== sessionId) return s;

      const updatedRecords = records.map(r => {
        const emp = employees.find(e => e.id === r.employeeId);
        return {
          employeeId: r.employeeId,
          employeeName: emp ? emp.name : 'Unknown',
          employeeDesignation: emp ? emp.designation : 'Merchandiser',
          status: r.status,
          checkInTime: r.checkInTime || (r.status === 'Present' ? '10:00' : undefined),
          checkOutTime: r.checkOutTime || (r.status === 'Present' ? '12:00' : undefined),
          latenessMinutes: r.latenessMinutes,
          absenceReason: r.absenceReason,
          trainerRemarks: r.trainerRemarks,
          markedByTrainerId: currentTrainer.id,
          updatedAt: nowIso
        };
      });

      return {
        ...s,
        status: 'Completed',
        attendanceFinalized: true,
        attendanceRecords: updatedRecords
      };
    }));

    // Generate timeline events for each employee
    const newEvents: TrainingEvent[] = records.map(r => ({
      id: `EVT-${Date.now()}-${r.employeeId}`,
      employeeId: r.employeeId,
      timestamp: nowIso,
      eventType: 'attendance_marked',
      title: `Attendance Recorded: ${r.status}`,
      description: `Status: ${r.status}. Remarks: ${r.trainerRemarks || r.absenceReason || 'N/A'}. Session: ${sessionId}`,
      actorName: currentTrainer.name,
      actorRole: currentTrainer.role
    }));
    setTimelineEvents(prev => [...newEvents, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: `AUD-${Date.now()}`,
      entityType: 'Attendance',
      entityId: sessionId,
      eventType: 'ATTENDANCE_MARKED',
      actorId: currentTrainer.id,
      actorName: currentTrainer.name,
      actorRole: currentTrainer.role,
      timestamp: nowIso,
      newValue: `Finalized attendance for ${records.length} participants in session ${sessionId}`,
      reason: 'Trainer finalized post-session attendance register'
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const correctAttendance = (
    sessionId: string,
    employeeId: string,
    newStatus: AttendanceStatus,
    reason: string
  ) => {
    let previousStatus: AttendanceStatus = 'Not Recorded';
    const nowIso = new Date().toISOString();

    setSessions(prev => prev.map(s => {
      if (s.id !== sessionId) return s;

      const updatedRecords = s.attendanceRecords.map(rec => {
        if (rec.employeeId !== employeeId) return rec;
        previousStatus = rec.status;

        const correction = {
          previousStatus: rec.status,
          newStatus: newStatus,
          reason: reason,
          changedBy: currentTrainer.name,
          timestamp: nowIso
        };

        return {
          ...rec,
          status: newStatus,
          updatedAt: nowIso,
          trainerRemarks: `Corrected: ${reason}`,
          correctionHistory: [...(rec.correctionHistory || []), correction]
        };
      });

      return {
        ...s,
        attendanceRecords: updatedRecords
      };
    }));

    // Mandatory auditable log
    const audit: AuditLog = {
      id: `AUD-${Date.now()}`,
      entityType: 'Attendance',
      entityId: `${sessionId}-${employeeId}`,
      eventType: 'ATTENDANCE_CORRECTION',
      actorId: currentTrainer.id,
      actorName: currentTrainer.name,
      actorRole: currentTrainer.role,
      timestamp: nowIso,
      previousValue: previousStatus,
      newValue: newStatus,
      reason: reason
    };
    setAuditLogs(prev => [audit, ...prev]);

    // Timeline event
    const emp = employees.find(e => e.id === employeeId);
    if (emp) {
      const evt: TrainingEvent = {
        id: `EVT-${Date.now()}`,
        employeeId: emp.id,
        timestamp: nowIso,
        eventType: 'attendance_marked',
        title: `Attendance Corrected: ${newStatus}`,
        description: `Correction from ${previousStatus} to ${newStatus}. Reason: ${reason}. Author: ${currentTrainer.name}`,
        actorName: currentTrainer.name,
        actorRole: currentTrainer.role
      };
      setTimelineEvents(prev => [evt, ...prev]);
    }
  };

  const completeFollowUp = (
    followUpId: string,
    outcome: FollowUpOutcome,
    trainerObservation: string,
    employeeFeedback: string,
    evidenceAttachment?: string
  ) => {
    const nowIso = new Date().toISOString();
    let linkedEmployeeId = '';
    let linkedAssignmentId = '';

    setFollowUps(prev => prev.map(f => {
      if (f.id !== followUpId) return f;
      linkedEmployeeId = f.employeeId;
      linkedAssignmentId = f.assignmentId;

      return {
        ...f,
        status: 'Completed',
        outcome: outcome,
        trainerObservation: trainerObservation,
        employeeFeedback: employeeFeedback,
        completedAt: nowIso,
        completedByTrainerName: currentTrainer.name,
        evidenceAttachments: evidenceAttachment ? [evidenceAttachment] : f.evidenceAttachments
      };
    }));

    // If satisfactory, evaluate if employee has completed training & assessment
    if (outcome === 'Satisfactory') {
      // Mark assignment as Training Ready
      setAssignments(prev => prev.map(a => {
        if (a.id === linkedAssignmentId || (linkedEmployeeId && a.employeeId === linkedEmployeeId && a.status === 'Follow-up Pending')) {
          return {
            ...a,
            status: 'Training Ready',
            progressPercent: 100,
            completedDate: nowIso.split('T')[0],
            isReadyForField: true
          };
        }
        return a;
      }));

      // Update Employee readiness
      setEmployees(prev => prev.map(e => {
        if (e.id === linkedEmployeeId) {
          return {
            ...e,
            currentReadiness: 'Training Ready',
            readinessCriteriaOutstanding: [],
            completedProgramCount: e.completedProgramCount + 1
          };
        }
        return e;
      }));

      // Timeline event
      const readyEvent: TrainingEvent = {
        id: `EVT-${Date.now()}-RDY`,
        employeeId: linkedEmployeeId,
        timestamp: nowIso,
        eventType: 'readiness_updated',
        title: 'Status Updated: Training Ready',
        description: `Practical follow-up completed with Satisfactory rating. Candidate approved for field operations.`,
        actorName: currentTrainer.name,
        actorRole: currentTrainer.role
      };
      setTimelineEvents(prev => [readyEvent, ...prev]);
    } else if (outcome === 'Improvement Required' || outcome === 'Additional Training Required') {
      // Mark employee as Needs Attention
      setEmployees(prev => prev.map(e => {
        if (e.id === linkedEmployeeId) {
          return {
            ...e,
            currentReadiness: 'Needs Attention',
            readinessCriteriaOutstanding: [`Follow-up outcome: ${outcome}`, 'Improvement plan required']
          };
        }
        return e;
      }));
    }

    // Timeline Event
    const followUpEvent: TrainingEvent = {
      id: `EVT-${Date.now()}`,
      employeeId: linkedEmployeeId,
      timestamp: nowIso,
      eventType: 'followup_completed',
      title: `Follow-up Completed: ${outcome}`,
      description: `Observation: ${trainerObservation}. Feedback: ${employeeFeedback}`,
      actorName: currentTrainer.name,
      actorRole: currentTrainer.role
    };
    setTimelineEvents(prev => [followUpEvent, ...prev]);

    // Audit Log
    const audit: AuditLog = {
      id: `AUD-${Date.now()}`,
      entityType: 'FollowUp',
      entityId: followUpId,
      eventType: 'FOLLOWUP_FINALIZATION',
      actorId: currentTrainer.id,
      actorName: currentTrainer.name,
      actorRole: currentTrainer.role,
      timestamp: nowIso,
      newValue: `Completed with outcome: ${outcome}`,
      reason: trainerObservation
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const createFollowUp = (data: Partial<FollowUpRecord>) => {
    const emp = employees.find(e => e.id === data.employeeId);
    const newFollowUp: FollowUpRecord = {
      id: `FLW-${Math.floor(800 + Math.random() * 200)}`,
      employeeId: data.employeeId || employees[0].id,
      employeeName: emp ? emp.name : 'Unknown',
      employeeDesignation: emp ? emp.designation : 'Merchandiser',
      employeeBrand: emp ? emp.brand : "Haldiram's",
      assignmentId: data.assignmentId || assignments[0].id,
      programName: data.programName || programs[0].name,
      ownerTrainerId: currentTrainer.id,
      ownerTrainerName: currentTrainer.name,
      type: data.type || 'field_verification',
      scheduledDate: data.scheduledDate || new Date().toISOString().split('T')[0],
      dueDate: data.dueDate || new Date().toISOString().split('T')[0],
      method: data.method || 'Physical Store Visit',
      priority: data.priority || 'Medium',
      checklistItems: data.checklistItems || [
        { id: 'c1', task: 'Review shelf planogram alignment', checked: false },
        { id: 'c2', task: 'Check stock FIFO rotation', checked: false }
      ],
      status: 'Scheduled'
    };

    setFollowUps(prev => [newFollowUp, ...prev]);
  };

  const createImprovementPlan = (data: Partial<ImprovementPlan>) => {
    const emp = employees.find(e => e.id === data.employeeId);
    const newPlan: ImprovementPlan = {
      id: `IP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      employeeId: data.employeeId || employees[0].id,
      employeeName: emp ? emp.name : 'Unknown',
      employeeDesignation: emp ? emp.designation : 'Merchandiser',
      originatingAssignmentId: data.originatingAssignmentId || assignments[0].id,
      originatingReason: data.originatingReason || 'Failed Assessment',
      identifiedGaps: data.identifiedGaps || ['Practical Execution Gap'],
      problemDescription: data.problemDescription || '',
      severity: data.severity || 'Moderate',
      assignedTrainerId: currentTrainer.id,
      assignedTrainerName: currentTrainer.name,
      targetCompletionDate: data.targetCompletionDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      actions: data.actions || [],
      reTrainingSessionRequired: Boolean(data.reTrainingSessionRequired),
      reAssessmentRequired: Boolean(data.reAssessmentRequired),
      verificationChecklist: data.verificationChecklist || [
        { id: 'v1', label: 'Remedial coaching attended', passed: false },
        { id: 'v2', label: 'Re-assessment passed', passed: false }
      ],
      status: 'Open'
    };

    setImprovementPlans(prev => [newPlan, ...prev]);

    // Timeline event
    if (emp) {
      const evt: TrainingEvent = {
        id: `EVT-${Date.now()}`,
        employeeId: emp.id,
        timestamp: new Date().toISOString(),
        eventType: 'improvement_plan_opened',
        title: `Improvement Plan Created: ${newPlan.id}`,
        description: `Gaps identified: ${newPlan.identifiedGaps.join(', ')}. Target: ${newPlan.targetCompletionDate}`,
        actorName: currentTrainer.name,
        actorRole: currentTrainer.role
      };
      setTimelineEvents(prev => [evt, ...prev]);

      // Update employee status to Needs Attention
      setEmployees(prev => prev.map(e => e.id === emp.id ? {
        ...e,
        currentReadiness: 'Needs Attention',
        readinessCriteriaOutstanding: [`Improvement Plan ${newPlan.id} active`, ...newPlan.identifiedGaps]
      } : e));
    }
  };

  const closeImprovementPlan = (planId: string, closureReason: string) => {
    const nowIso = new Date().toISOString();
    let empId = '';

    setImprovementPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      empId = p.employeeId;
      return {
        ...p,
        status: 'Closed',
        closureReason: closureReason,
        closedAt: nowIso,
        closedBy: currentTrainer.name,
        verificationChecklist: p.verificationChecklist.map(v => ({ ...v, passed: true }))
      };
    }));

    if (empId) {
      // Timeline event
      const evt: TrainingEvent = {
        id: `EVT-${Date.now()}`,
        employeeId: empId,
        timestamp: nowIso,
        eventType: 'improvement_plan_closed',
        title: `Improvement Plan ${planId} Closed`,
        description: `Outcome: Gaps successfully verified and resolved. Reason: ${closureReason}`,
        actorName: currentTrainer.name,
        actorRole: currentTrainer.role
      };
      setTimelineEvents(prev => [evt, ...prev]);

      // Check if employee has other outstanding items; if not, set to Training Ready
      setEmployees(prev => prev.map(e => {
        if (e.id === empId) {
          return {
            ...e,
            currentReadiness: 'Training Ready',
            readinessCriteriaOutstanding: []
          };
        }
        return e;
      }));
    }

    const audit: AuditLog = {
      id: `AUD-${Date.now()}`,
      entityType: 'ImprovementPlan',
      entityId: planId,
      eventType: 'IMPROVEMENT_PLAN_CLOSURE',
      actorId: currentTrainer.id,
      actorName: currentTrainer.name,
      actorRole: currentTrainer.role,
      timestamp: nowIso,
      previousValue: 'Open/In Progress',
      newValue: 'Closed',
      reason: closureReason
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const recordReassessmentAttempt = (data: {
    assignmentId: string;
    assessmentId: string;
    employeeId: string;
    score: number;
    maxScore: number;
    status: 'Passed' | 'Failed';
    feedback: string;
  }) => {
    const nowIso = new Date().toISOString();
    const existingAttempts = attempts.filter(a => a.employeeId === data.employeeId && a.assessmentId === data.assessmentId);
    const attemptNumber = existingAttempts.length + 1;
    const asm = assessments.find(a => a.id === data.assessmentId);
    const emp = employees.find(e => e.id === data.employeeId);

    const newAttempt: AssessmentAttempt = {
      id: `ATT-${Math.floor(500 + Math.random() * 500)}`,
      assessmentId: data.assessmentId,
      assessmentTitle: asm ? asm.title : 'Assessment',
      employeeId: data.employeeId,
      employeeName: emp ? emp.name : 'Unknown',
      assignmentId: data.assignmentId,
      attemptNumber: attemptNumber,
      startTime: nowIso,
      submittedTime: nowIso,
      score: data.score,
      maxScore: data.maxScore,
      percentage: Math.round((data.score / data.maxScore) * 100),
      status: data.status,
      evaluatorId: currentTrainer.id,
      evaluatorName: currentTrainer.name,
      answers: [],
      topicKnowledgeGaps: data.status === 'Failed' ? ['Reassessment topic review needed'] : [],
      trainerComments: data.feedback,
      canReattempt: data.status === 'Failed' && attemptNumber < (asm?.maxAttempts || 3)
    };

    setAttempts(prev => [...prev, newAttempt]);

    // Timeline event
    if (emp) {
      const evt: TrainingEvent = {
        id: `EVT-${Date.now()}`,
        employeeId: emp.id,
        timestamp: nowIso,
        eventType: 'assessment_evaluated',
        title: `Assessment Attempt #${attemptNumber}: ${data.status.toUpperCase()}`,
        description: `Score: ${data.score}/${data.maxScore} (${newAttempt.percentage}%). Evaluated by ${currentTrainer.name}.`,
        actorName: currentTrainer.name,
        actorRole: currentTrainer.role
      };
      setTimelineEvents(prev => [evt, ...prev]);
    }
  };

  const issueCertificate = ({
    employeeId,
    programId,
    scoreAchieved
  }: {
    employeeId: string;
    programId: string;
    scoreAchieved: number;
  }) => {
    const emp = employees.find(e => e.id === employeeId);
    const prog = programs.find(p => p.id === programId);
    if (!emp || !prog) return;

    const certId = `CERT-${prog.code.substring(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();
    const expiryDate = new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0];

    const newCert: Certification = {
      id: certId,
      certificateNumber: `LIS-CERT-${new Date().getFullYear()}-${certId}`,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeDesignation: emp.designation,
      programId: prog.id,
      programName: prog.name,
      programVersion: prog.currentVersion,
      issueDate: nowIso.split('T')[0],
      expiryDate: expiryDate,
      issuedByTrainerName: `${currentTrainer.name} (${currentTrainer.role === 'senior_trainer' ? 'Senior Trainer' : 'Lead Trainer'})`,
      status: 'Issued',
      verificationCode: `VRF-${Math.floor(1000 + Math.random() * 9000)}-${emp.region.toUpperCase()}`,
      scoreAchieved: scoreAchieved
    };

    setCertificates(prev => [newCert, ...prev]);

    // Timeline event
    const evt: TrainingEvent = {
      id: `EVT-${Date.now()}`,
      employeeId: emp.id,
      timestamp: nowIso,
      eventType: 'certificate_issued',
      title: `Certificate Issued: ${newCert.certificateNumber}`,
      description: `Program: ${prog.name}. Issued by ${currentTrainer.name}. Valid until ${expiryDate}.`,
      actorName: currentTrainer.name,
      actorRole: currentTrainer.role
    };
    setTimelineEvents(prev => [evt, ...prev]);

    // Audit log
    const audit: AuditLog = {
      id: `AUD-${Date.now()}`,
      entityType: 'Certification',
      entityId: newCert.id,
      eventType: 'CERTIFICATE_ISSUED',
      actorId: currentTrainer.id,
      actorName: currentTrainer.name,
      actorRole: currentTrainer.role,
      timestamp: nowIso,
      newValue: `Issued certificate ${newCert.certificateNumber} to ${emp.name}`,
      reason: 'All program passing criteria and follow-up verifications met'
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const revokeCertificate = (certId: string, reason: string) => {
    const nowIso = new Date().toISOString();
    let empId = '';
    let certNum = '';

    setCertificates(prev => prev.map(c => {
      if (c.id !== certId) return c;
      empId = c.employeeId;
      certNum = c.certificateNumber;
      return {
        ...c,
        status: 'Revoked',
        revokedAt: nowIso,
        revokedBy: currentTrainer.name,
        revocationReason: reason
      };
    }));

    if (empId) {
      const evt: TrainingEvent = {
        id: `EVT-${Date.now()}`,
        employeeId: empId,
        timestamp: nowIso,
        eventType: 'certificate_revoked',
        title: `Certificate Revoked: ${certNum}`,
        description: `Reason: ${reason}. Authorized by ${currentTrainer.name}.`,
        actorName: currentTrainer.name,
        actorRole: currentTrainer.role
      };
      setTimelineEvents(prev => [evt, ...prev]);

      // Revert employee readiness
      setEmployees(prev => prev.map(e => e.id === empId ? {
        ...e,
        currentReadiness: 'Needs Attention',
        readinessCriteriaOutstanding: ['Certificate revoked due to audit non-compliance']
      } : e));
    }

    const audit: AuditLog = {
      id: `AUD-${Date.now()}`,
      entityType: 'Certification',
      entityId: certId,
      eventType: 'CERTIFICATE_REVOCATION',
      actorId: currentTrainer.id,
      actorName: currentTrainer.name,
      actorRole: currentTrainer.role,
      timestamp: nowIso,
      previousValue: 'Issued',
      newValue: 'Revoked',
      reason: reason
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const createAnnouncement = (data: Omit<Announcement, 'id' | 'sentAt' | 'sentBy'>) => {
    const newAnc: Announcement = {
      id: `ANC-${Math.floor(100 + Math.random() * 900)}`,
      ...data,
      sentBy: `${currentTrainer.name} (${currentTrainer.role})`,
      sentAt: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnc, ...prev]);
  };

  const addLearningResource = (data: Omit<LearningResource, 'id' | 'uploadDate'>) => {
    const newRes: LearningResource = {
      id: `RES-${Math.floor(100 + Math.random() * 900)}`,
      ...data,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setResources(prev => [newRes, ...prev]);
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setPolicies(initialPolicies);
    setEmployees(seedEmployees);
    setPrograms(seedPrograms);
    setResources(seedResources);
    setBatches(seedBatches);
    setSessions(seedSessions);
    setAssignments(seedAssignments);
    setAttempts(seedAssessmentAttempts);
    setFollowUps(seedFollowUps);
    setImprovementPlans(seedImprovementPlans);
    setCertificates(seedCertificates);
    setTimelineEvents(seedTimelineEvents);
    setAuditLogs(seedAuditLogs);
    setNotifications(seedNotifications);
    setAnnouncements(seedAnnouncements);
  };

  return (
    <AppContext.Provider
      value={{
        currentTrainer,
        setCurrentTrainerId,
        trainers,
        policies,
        updatePolicies,
        employees,
        programs,
        resources,
        batches,
        sessions,
        assignments,
        assessments,
        questions,
        attempts,
        followUps,
        improvementPlans,
        certificates,
        timelineEvents,
        auditLogs,
        notifications,
        announcements,
        kpis,
        assignTraining,
        createProgram,
        createBatch,
        createSession,
        markSessionAttendance,
        correctAttendance,
        completeFollowUp,
        createFollowUp,
        createImprovementPlan,
        closeImprovementPlan,
        recordReassessmentAttempt,
        issueCertificate,
        revokeCertificate,
        markNotificationRead,
        markAllNotificationsRead,
        createAnnouncement,
        addLearningResource,
        resetToDefaultData,
        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
