/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LoveInStore Learn - Trainer Management Web Panel
 * Domain Types & Interfaces according to Specification v1.0
 */

export type UserRole = 'trainer' | 'senior_trainer' | 'program_manager' | 'platform_admin';

export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  assignedRegions: string[];
  assignedBrands: string[];
  assignedPrograms: string[];
  activeStatus: boolean;
  totalSessionsConducted: number;
  totalEmployeesTrained: number;
}

export type Designation = 
  | 'Merchandiser'
  | 'Promoter'
  | 'Supervisor'
  | 'Program Manager'
  | 'Store Auditor'
  | 'Field Team Lead';

export type EmployeeStatus = 'Active' | 'Onboarding' | 'Notice' | 'On Leave';

export type ReadinessStatus = 'Training Ready' | 'In Training' | 'Untrained' | 'Needs Attention' | 'Exempt';

export interface Employee {
  id: string; // e.g., EMP-10023
  name: string;
  email: string;
  phone: string;
  designation: Designation;
  brand: string; // e.g., Haldiram's, Cadbury, Unilever, Nestle
  programName: string; // business program/project
  region: string;
  state: string;
  city: string;
  territory: string;
  supervisorName: string;
  joiningDate: string;
  employeeStatus: EmployeeStatus;
  currentReadiness: ReadinessStatus;
  readinessCriteriaOutstanding?: string[];
  activeAssignmentCount: number;
  completedProgramCount: number;
}

export type ProgramCategory = 
  | 'Onboarding'
  | 'Product'
  | 'Application'
  | 'Operational'
  | 'Compliance'
  | 'Refresher';

export type ProgramStatus = 'Draft' | 'In Review' | 'Published' | 'Active' | 'Paused' | 'Superseded' | 'Archived';

export type DeliveryMode = 'physical' | 'digital' | 'hybrid';

export interface LearningModule {
  id: string;
  programId: string;
  sequence: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  isMandatory: boolean;
  deliveryMode: DeliveryMode;
  linkedResourceIds: string[];
  hasKnowledgeCheck: boolean;
  quizPassingScore?: number;
}

export interface TrainingProgramVersion {
  versionId: string;
  versionNumber: string; // e.g. "v2.0"
  effectiveDate: string;
  changeSummary: string;
  status: ProgramStatus;
  modules: LearningModule[];
  passingScore: number; // percentage, e.g., 80
  maxAssessmentAttempts: number;
  requiresPracticalFollowUp: boolean;
  requiresCertification: boolean;
  certificateValidityDays?: number;
}

export interface TrainingProgram {
  id: string; // e.g., PRG-001
  name: string;
  code: string;
  description: string;
  category: ProgramCategory;
  brandAssociation: string;
  targetDesignations: Designation[];
  trainingObjectives: string[];
  prerequisites: string[];
  currentVersion: string;
  versions: TrainingProgramVersion[];
  deliveryModes: DeliveryMode[];
  ownerTrainerId: string;
  status: ProgramStatus;
  createdAt: string;
  updatedAt: string;
}

export type ResourceType = 'pdf' | 'video' | 'presentation' | 'sop' | 'image' | 'link';

export type ResourceCategory = 
  | 'Standard Operating Procedures'
  | 'Product Materials'
  | 'Brand Guidelines'
  | 'Demonstration Videos'
  | 'Planograms'
  | 'Assessment Guides';

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  tags: string[];
  fileName?: string;
  fileSize?: string;
  fileUrl?: string; // preview or safe reference
  durationMinutes?: number;
  version: string;
  uploadedBy: string;
  uploadDate: string;
  associatedPrograms: string[];
  accessRole: 'all' | 'trainer_only' | 'restricted';
}

export type AssignmentLifecycleStatus = 
  | 'Draft'
  | 'Pending Approval'
  | 'Assigned'
  | 'In Progress'
  | 'Assessment Pending'
  | 'Follow-up Pending'
  | 'Completed'
  | 'Training Ready'
  | 'Failed'
  | 'On Hold'
  | 'Cancelled'
  | 'Withdrawn'
  | 'Re-training Required';

export type AssignmentSource = 'manual' | 'bulk' | 'program_rule' | 'onboarding' | 're-training';

export interface TrainingAssignment {
  id: string; // e.g., ASG-2024-001
  employeeId: string;
  employeeName: string;
  employeeDesignation: Designation;
  employeeBrand: string;
  programId: string;
  programName: string;
  programVersion: string;
  trainerId: string;
  trainerName: string;
  batchId?: string;
  batchName?: string;
  assignmentSource: AssignmentSource;
  assignedDate: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  deliveryMode: DeliveryMode;
  status: AssignmentLifecycleStatus;
  progressPercent: number;
  completedDate?: string;
  approvalStatus: 'Approved' | 'Pending' | 'Rejected' | 'Not Required';
  approvalNotes?: string;
  isReadyForField: boolean;
  cancellationReason?: string;
  linkedSessionIds: string[];
  linkedAssessmentAttemptIds: string[];
  linkedFollowUpIds: string[];
  linkedImprovementPlanIds: string[];
  certificateId?: string;
}

export type BatchStatus = 'Draft' | 'Planned' | 'Active' | 'Completed' | 'Closed' | 'Cancelled' | 'Archived';

export interface TrainingBatch {
  id: string; // e.g., BATCH-2024-01
  code: string;
  name: string;
  programId: string;
  programName: string;
  programVersion: string;
  trainerId: string;
  trainerName: string;
  mode: DeliveryMode;
  capacity: number;
  enrolledCount: number;
  startDate: string;
  endDate: string;
  location: string;
  status: BatchStatus;
  participantEmployeeIds: string[];
  completionRatePercent: number;
}

export type SessionType = 'classroom' | 'online' | 'field/practical' | 'self-learning review' | 'hybrid';
export type SessionStatus = 'Draft' | 'Scheduled' | 'Rescheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'No-show/Not Conducted';

export type AttendanceStatus = 'Not Recorded' | 'Present' | 'Late' | 'Absent' | 'Excused';

export interface SessionAttendanceRecord {
  employeeId: string;
  employeeName: string;
  employeeDesignation: Designation;
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  latenessMinutes?: number;
  absenceReason?: string;
  trainerRemarks?: string;
  markedByTrainerId: string;
  updatedAt: string;
  correctionHistory?: {
    previousStatus: AttendanceStatus;
    newStatus: AttendanceStatus;
    reason: string;
    changedBy: string;
    timestamp: string;
  }[];
}

export interface TrainingSession {
  id: string; // e.g., SES-101
  title: string;
  programId: string;
  programName: string;
  moduleId?: string;
  moduleTitle?: string;
  batchId?: string;
  batchName?: string;
  sessionType: SessionType;
  trainerId: string;
  trainerName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  timezone: string;
  venueOrLink: string;
  isOnline: boolean;
  capacity: number;
  participantCount: number;
  status: SessionStatus;
  agenda: string;
  requiredMaterials: string[];
  preSessionInstructions?: string;
  attendanceFinalized: boolean;
  attendanceRecords: SessionAttendanceRecord[];
  actualStartTime?: string;
  actualEndTime?: string;
  sessionNotes?: string;
  attachments?: string[];
}

export type QuestionType = 'single_choice' | 'multi_choice' | 'true_false' | 'descriptive';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  topic: string;
  type: QuestionType;
  text: string;
  options?: QuestionOption[];
  correctOptionIds: string[];
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  rubricNotes?: string;
}

export interface Assessment {
  id: string;
  title: string;
  programId: string;
  programName: string;
  version: string;
  durationMinutes: number;
  totalMarks: number;
  passingScorePercent: number;
  maxAttempts: number;
  questionIds: string[];
  randomizeQuestions: boolean;
  isPublished: boolean;
}

export type AttemptStatus = 'Started' | 'Submitted' | 'Under Evaluation' | 'Passed' | 'Failed' | 'Invalidated';

export interface AssessmentAnswer {
  questionId: string;
  questionText: string;
  selectedOptionIds: string[];
  descriptiveText?: string;
  isCorrect?: boolean;
  scoreAwarded: number;
  evaluatorFeedback?: string;
}

export interface AssessmentAttempt {
  id: string; // e.g., ATT-501
  assessmentId: string;
  assessmentTitle: string;
  employeeId: string;
  employeeName: string;
  assignmentId: string;
  attemptNumber: number;
  startTime: string;
  submittedTime: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: AttemptStatus;
  evaluatorId: string;
  evaluatorName: string;
  answers: AssessmentAnswer[];
  topicKnowledgeGaps: string[];
  trainerComments?: string;
  canReattempt: boolean;
}

export type FollowUpType = 
  | 'understanding_check'
  | 'knowledge_retention'
  | 'field_verification'
  | 'performance_review'
  | 'document_check'
  | 'refresher_check';

export type FollowUpStatus = 'Scheduled' | 'Due' | 'In Progress' | 'Completed' | 'Overdue' | 'Rescheduled' | 'Cancelled';

export type FollowUpOutcome = 
  | 'Satisfactory'
  | 'Improvement Required'
  | 'Additional Training Required'
  | 'Unable to Contact'
  | 'Reschedule Required'
  | 'Not Applicable';

export interface FollowUpRecord {
  id: string; // e.g., FLW-801
  employeeId: string;
  employeeName: string;
  employeeDesignation: Designation;
  employeeBrand: string;
  assignmentId: string;
  programName: string;
  ownerTrainerId: string;
  ownerTrainerName: string;
  type: FollowUpType;
  scheduledDate: string;
  dueDate: string;
  method: 'Physical Store Visit' | 'Phone Call' | 'Video Audit' | 'Manager Report';
  priority: 'High' | 'Medium' | 'Low';
  checklistItems: {
    id: string;
    task: string;
    checked: boolean;
  }[];
  employeeFeedback?: string;
  trainerObservation?: string;
  evidenceAttachments?: string[];
  status: FollowUpStatus;
  outcome?: FollowUpOutcome;
  completedAt?: string;
  completedByTrainerName?: string;
  nextAction?: string;
  nextFollowUpDate?: string;
  correctionLog?: {
    date: string;
    actor: string;
    note: string;
  }[];
}

export type ImprovementPlanStatus = 
  | 'Open'
  | 'In Progress'
  | 'Awaiting Verification'
  | 'Closed'
  | 'Escalated'
  | 'Cancelled';

export interface ImprovementAction {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  verifiedBy?: string;
}

export interface ImprovementPlan {
  id: string; // e.g., IP-2024-001
  employeeId: string;
  employeeName: string;
  employeeDesignation: Designation;
  originatingAssignmentId: string;
  originatingReason: 'Failed Assessment' | 'Incomplete Mandatory Learning' | 'Insufficient Attendance' | 'Unsuccessful Follow-up' | 'SOP Update';
  identifiedGaps: string[];
  problemDescription: string;
  severity: 'Critical' | 'Moderate' | 'Minor';
  assignedTrainerId: string;
  assignedTrainerName: string;
  targetCompletionDate: string;
  actions: ImprovementAction[];
  reTrainingSessionRequired: boolean;
  reTrainingSessionId?: string;
  reAssessmentRequired: boolean;
  newAttemptId?: string;
  verificationChecklist: { id: string; label: string; passed: boolean }[];
  status: ImprovementPlanStatus;
  closureReason?: string;
  closedAt?: string;
  closedBy?: string;
}

export type CertificateStatus = 'Pending' | 'Issued' | 'Expiring' | 'Expired' | 'Revoked' | 'Renewed';

export interface Certification {
  id: string; // e.g., CERT-HAL-8821
  certificateNumber: string;
  employeeId: string;
  employeeName: string;
  employeeDesignation: Designation;
  programId: string;
  programName: string;
  programVersion: string;
  issueDate: string;
  expiryDate: string;
  issuedByTrainerName: string;
  status: CertificateStatus;
  verificationCode: string;
  scoreAchieved: number;
  revocationReason?: string;
  revokedAt?: string;
  revokedBy?: string;
}

export interface TrainingEvent {
  id: string;
  employeeId: string;
  timestamp: string;
  eventType: 
    | 'assignment_created'
    | 'assignment_status_changed'
    | 'session_scheduled'
    | 'attendance_marked'
    | 'assessment_submitted'
    | 'assessment_evaluated'
    | 'followup_scheduled'
    | 'followup_completed'
    | 'improvement_plan_opened'
    | 'improvement_plan_closed'
    | 'certificate_issued'
    | 'certificate_revoked'
    | 'readiness_updated';
  title: string;
  description: string;
  actorName: string;
  actorRole: string;
  metadata?: Record<string, any>;
}

export interface AuditLog {
  id: string;
  entityType: 'Assignment' | 'Session' | 'Attendance' | 'Assessment' | 'FollowUp' | 'ImprovementPlan' | 'Certification' | 'Program' | 'Policy';
  entityId: string;
  eventType: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  timestamp: string;
  previousValue?: string;
  newValue?: string;
  reason: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'session' | 'assessment' | 'followup' | 'improvement' | 'certificate' | 'system';
  priority: 'high' | 'normal' | 'low';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  recipientEmployeeId?: string;
  channel: 'In-App' | 'SMS' | 'WhatsApp' | 'Email';
  deliveryStatus: 'Delivered' | 'Pending' | 'Failed';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Policy' | 'Training Schedule' | 'Compliance';
  targetBrands: string[];
  targetDesignations: string[];
  sentBy: string;
  sentAt: string;
  channels: ('In-App' | 'SMS' | 'WhatsApp')[];
  recipientCount: number;
  status: 'Sent' | 'Draft' | 'Scheduled';
}

export interface ConfigurablePolicies {
  programCreationPolicy: 'trainer' | 'manager_admin_only' | 'both_with_approval';
  assignmentApprovalPolicy: 'no_approval' | 'manager_approval' | 'conditional_by_brand';
  followUpOwnership: 'trainer_primary' | 'manager_shared' | 'supervisor_lead';
  employeeDataScope: 'combined_brand_location' | 'assigned_programs_only' | 'all_within_org';
}
