// Enhanced HRMS Types for Employee Management Module

// Core Employee Profile with Complete Information
export interface EmployeeProfile {
  id: string;
  employeeId: string;
  personalInfo: PersonalInformation;
  professionalInfo: ProfessionalInformation;
  emergencyContacts: EmergencyContact[];
  documents: EmployeeDocument[];
  photo?: string;
  digitalSignature?: string;
  customFields: Record<string, any>;
  status: 'active' | 'inactive' | 'on-leave' | 'terminated';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
}

export interface PersonalInformation {
  firstName: string;
  lastName: string;
  fullName: string;
  fullNameAr?: string;
  dateOfBirth: string;
  nationality: string;
  nationalId: string;
  passportNumber?: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  gender: 'male' | 'female';
  religion?: string;
  bloodType?: string;
  personalEmail?: string;
  personalPhone: string;
  homeAddress: Address;
  languages: Language[];
}

export interface ProfessionalInformation {
  jobTitle: string;
  jobTitleAr?: string;
  departmentId: string;
  teamId?: string;
  managerId?: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  workLocation: string;
  hireDate: string;
  probationEndDate?: string;
  contractEndDate?: string;
  workEmail: string;
  workPhone?: string;
  salaryInfo: SalaryInformation;
  workSchedule: WorkSchedule;
  reportingStructure: ReportingStructure;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: Address;
  isPrimary: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Language {
  language: string;
  proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
  certified?: boolean;
}

export interface SalaryInformation {
  baseSalary: number;
  currency: string;
  payFrequency: 'monthly' | 'bi-weekly' | 'weekly';
  allowances: Allowance[];
  benefits: Benefit[];
  taxInfo: TaxInformation;
}

export interface Allowance {
  type: string;
  amount: number;
  isRecurring: boolean;
  effectiveDate: string;
  endDate?: string;
}

export interface Benefit {
  type: string;
  description: string;
  value?: number;
  provider?: string;
  effectiveDate: string;
  endDate?: string;
}

export interface TaxInformation {
  taxId: string;
  taxBracket: string;
  exemptions: number;
  additionalWithholding?: number;
}

export interface WorkSchedule {
  scheduleType: 'standard' | 'flexible' | 'shift' | 'remote';
  workingDays: number[];
  startTime: string;
  endTime: string;
  breakDuration: number;
  overtimeEligible: boolean;
}

export interface ReportingStructure {
  directReports: string[];
  reportsTo: string;
  dotLineReports: string[];
  approvalAuthority: ApprovalAuthority[];
}

export interface ApprovalAuthority {
  type: string;
  limit?: number;
  conditions?: string[];
}

// Organizational Structure
export interface Department {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  headOfDepartment: string;
  parentDepartmentId?: string;
  costCenter: string;
  location: string;
  budget?: number;
  employeeCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  nameAr?: string;
  departmentId: string;
  teamLeaderId: string;
  description: string;
  objectives: string[];
  members: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationalChart {
  id: string;
  name: string;
  structure: OrgNode[];
  effectiveDate: string;
  version: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface OrgNode {
  id: string;
  employeeId?: string;
  positionTitle: string;
  level: number;
  parentId?: string;
  children: string[];
  isVacant: boolean;
}

// Employee Lifecycle Management
export interface OnboardingWorkflow {
  id: string;
  employeeId: string;
  templateId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  startDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  tasks: OnboardingTask[];
  assignedTo: string;
  progress: number;
  notes?: string;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  category: 'documentation' | 'training' | 'equipment' | 'access' | 'orientation';
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies: string[];
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
  attachments?: string[];
}

export interface PositionTransfer {
  id: string;
  employeeId: string;
  fromPosition: PositionInfo;
  toPosition: PositionInfo;
  transferType: 'promotion' | 'lateral' | 'demotion' | 'department-change';
  effectiveDate: string;
  reason: string;
  approvedBy: string;
  approvedAt: Date;
  salaryChange?: SalaryChange;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes?: string;
}

export interface PositionInfo {
  jobTitle: string;
  departmentId: string;
  teamId?: string;
  managerId?: string;
  location: string;
  salaryGrade: string;
}

export interface SalaryChange {
  oldSalary: number;
  newSalary: number;
  changePercentage: number;
  effectiveDate: string;
  reason: string;
}

export interface OffboardingProcess {
  id: string;
  employeeId: string;
  initiatedBy: string;
  terminationType: 'resignation' | 'termination' | 'retirement' | 'contract-end';
  lastWorkingDay: string;
  reason: string;
  exitInterview: ExitInterview;
  checklist: OffboardingTask[];
  finalSettlement: FinalSettlement;
  status: 'initiated' | 'in-progress' | 'completed';
  completedAt?: Date;
}

export interface ExitInterview {
  id: string;
  conductedBy: string;
  conductedAt: Date;
  feedback: ExitFeedback;
  recommendations: string[];
  overallRating: number;
  wouldRehire: boolean;
  notes: string;
}

export interface ExitFeedback {
  jobSatisfaction: number;
  managementRating: number;
  workEnvironment: number;
  careerDevelopment: number;
  compensation: number;
  workLifeBalance: number;
  reasonForLeaving: string[];
  suggestions: string;
}

export interface OffboardingTask {
  id: string;
  title: string;
  category: 'equipment' | 'access' | 'documentation' | 'handover' | 'clearance';
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'completed';
  completedAt?: Date;
  notes?: string;
}

export interface FinalSettlement {
  finalSalary: number;
  unusedLeave: number;
  bonuses: number;
  deductions: number;
  totalAmount: number;
  paymentDate: string;
  paymentMethod: string;
  approvedBy: string;
}

// Performance and Development
export interface PerformanceGoal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  category: 'individual' | 'team' | 'organizational';
  type: 'quantitative' | 'qualitative';
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  weight: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  progress: number;
  milestones: GoalMilestone[];
  createdBy: string;
  createdAt: Date;
}

export interface GoalMilestone {
  id: string;
  title: string;
  targetDate: string;
  status: 'pending' | 'completed' | 'overdue';
  completedAt?: Date;
  notes?: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  reviewPeriod: {
    startDate: string;
    endDate: string;
  };
  reviewType: 'annual' | 'mid-year' | 'probation' | 'project-based';
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  scheduledDate: string;
  completedDate?: string;
  ratings: PerformanceRating[];
  goals: PerformanceGoal[];
  feedback: ReviewFeedback;
  developmentPlan: DevelopmentPlan;
  overallRating: number;
  recommendations: string[];
}

export interface PerformanceRating {
  competency: string;
  rating: number;
  maxRating: number;
  comments?: string;
  evidence?: string[];
}

export interface ReviewFeedback {
  strengths: string[];
  areasForImprovement: string[];
  achievements: string[];
  challenges: string[];
  managerComments: string;
  employeeComments?: string;
}

export interface DevelopmentPlan {
  objectives: string[];
  trainingNeeds: TrainingNeed[];
  careerPath: string;
  mentorAssignment?: string;
  timeline: string;
  budget?: number;
}

export interface TrainingNeed {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  priority: 'low' | 'medium' | 'high';
  suggestedTraining: string[];
  deadline?: string;
}

export interface SkillAssessment {
  id: string;
  employeeId: string;
  assessorId: string;
  assessmentDate: Date;
  skills: SkillRating[];
  overallScore: number;
  certifications: Certification[];
  recommendations: string[];
  nextAssessmentDate: string;
}

export interface SkillRating {
  skillName: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  maxLevel: number;
  evidence?: string[];
  lastUpdated: Date;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  status: 'active' | 'expired' | 'pending' | 'revoked';
}

// Document Management
export interface EmployeeDocument {
  id: string;
  employeeId: string;
  name: string;
  type: DocumentType;
  category: 'personal' | 'professional' | 'legal' | 'medical' | 'training';
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadDate: Date;
  uploadedBy: string;
  expiryDate?: string;
  isConfidential: boolean;
  accessLevel: 'public' | 'hr-only' | 'manager-only' | 'restricted';
  version: number;
  parentDocumentId?: string;
  tags: string[];
  metadata: DocumentMetadata;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
}

export type DocumentType = 
  | 'passport' | 'visa' | 'iqama' | 'national-id'
  | 'contract' | 'offer-letter' | 'job-description'
  | 'certificate' | 'diploma' | 'license'
  | 'medical-report' | 'vaccination-record'
  | 'performance-review' | 'disciplinary-action'
  | 'training-certificate' | 'safety-training'
  | 'bank-details' | 'tax-documents'
  | 'other';

export interface DocumentMetadata {
  description?: string;
  keywords: string[];
  confidentialityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  retentionPeriod?: number;
  legalRequirement: boolean;
  auditTrail: DocumentAuditEntry[];
}

export interface DocumentAuditEntry {
  action: 'uploaded' | 'viewed' | 'downloaded' | 'modified' | 'deleted';
  performedBy: string;
  performedAt: Date;
  ipAddress?: string;
  notes?: string;
}

// Workflow and Approval System
export interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  triggerEvent: string;
  steps: ApprovalStep[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface ApprovalStep {
  stepNumber: number;
  approverRole: string;
  approverIds?: string[];
  isRequired: boolean;
  timeoutDays?: number;
  escalationRule?: EscalationRule;
  conditions?: ApprovalCondition[];
}

export interface EscalationRule {
  escalateAfterDays: number;
  escalateTo: string[];
  notificationTemplate: string;
}

export interface ApprovalCondition {
  field: string;
  operator: 'equals' | 'greater-than' | 'less-than' | 'contains';
  value: any;
}

export interface ApprovalRequest {
  id: string;
  workflowId: string;
  requestType: string;
  requestedBy: string;
  requestedFor: string;
  requestData: any;
  currentStep: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  submittedAt: Date;
  completedAt?: Date;
  approvalHistory: ApprovalHistory[];
  comments?: string;
}

export interface ApprovalHistory {
  stepNumber: number;
  approver: string;
  action: 'approved' | 'rejected' | 'delegated';
  actionDate: Date;
  comments?: string;
  timeToDecision: number;
}

// Analytics and Reporting
export interface EmployeeAnalytics {
  totalEmployees: number;
  activeEmployees: number;
  newHires: number;
  terminations: number;
  turnoverRate: number;
  averageTenure: number;
  departmentDistribution: DepartmentStats[];
  ageDistribution: AgeGroup[];
  genderDistribution: GenderStats;
  nationalityDistribution: NationalityStats[];
  performanceDistribution: PerformanceStats;
  trainingMetrics: TrainingMetrics;
}

export interface DepartmentStats {
  departmentId: string;
  departmentName: string;
  employeeCount: number;
  averageAge: number;
  averageTenure: number;
  turnoverRate: number;
  performanceScore: number;
}

export interface AgeGroup {
  range: string;
  count: number;
  percentage: number;
}

export interface GenderStats {
  male: number;
  female: number;
  other: number;
  malePercentage: number;
  femalePercentage: number;
}

export interface NationalityStats {
  nationality: string;
  count: number;
  percentage: number;
}

export interface PerformanceStats {
  excellent: number;
  good: number;
  satisfactory: number;
  needsImprovement: number;
  averageRating: number;
}

export interface TrainingMetrics {
  totalTrainingHours: number;
  averageHoursPerEmployee: number;
  completionRate: number;
  trainingBudgetUtilization: number;
  topTrainingCategories: TrainingCategory[];
}

export interface TrainingCategory {
  category: string;
  hours: number;
  participants: number;
  averageRating: number;
}

// Search and Filter Types
export interface EmployeeSearchFilters {
  searchTerm: string;
  department?: string;
  team?: string;
  jobTitle?: string;
  manager?: string;
  status?: string;
  hireDate?: {
    from: string;
    to: string;
  };
  salary?: {
    min: number;
    max: number;
  };
  skills?: string[];
  certifications?: string[];
  location?: string;
  employmentType?: string;
}

export interface EmployeeSearchResult {
  employee: EmployeeProfile;
  relevanceScore: number;
  matchedFields: string[];
  highlights: Record<string, string>;
}

// Notification and Communication
export interface EmployeeNotification {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'system' | 'hr' | 'manager' | 'training' | 'compliance';
  actionRequired: boolean;
  actionUrl?: string;
  scheduledAt?: Date;
  sentAt?: Date;
  readAt?: Date;
  status: 'scheduled' | 'sent' | 'delivered' | 'read' | 'failed';
  metadata?: any;
}

export type NotificationType = 
  | 'document-expiry' | 'performance-review-due' | 'training-reminder'
  | 'birthday' | 'work-anniversary' | 'probation-ending'
  | 'contract-renewal' | 'goal-deadline' | 'approval-request'
  | 'policy-update' | 'system-maintenance';

// Compliance and Audit
export interface ComplianceCheck {
  id: string;
  employeeId: string;
  checkType: string;
  status: 'compliant' | 'non-compliant' | 'pending' | 'expired';
  lastChecked: Date;
  nextCheckDue: Date;
  findings: ComplianceFinding[];
  remedialActions: RemedialAction[];
  checkedBy: string;
}

export interface ComplianceFinding {
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence?: string[];
  regulatoryReference?: string;
}

export interface RemedialAction {
  action: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  completedAt?: Date;
  notes?: string;
}

export interface AuditTrail {
  id: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'read' | 'update' | 'delete';
  performedBy: string;
  performedAt: Date;
  changes?: FieldChange[];
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

export interface FieldChange {
  field: string;
  oldValue: any;
  newValue: any;
  changeReason?: string;
}

// Integration and API Types
export interface HRMSIntegration {
  payrollSystem: PayrollIntegration;
  timeTracking: TimeTrackingIntegration;
  learningManagement: LMSIntegration;
  recruitmentSystem: ATSIntegration;
  backgroundCheck: BackgroundCheckIntegration;
}

export interface PayrollIntegration {
  syncEmployeeData: boolean;
  syncSalaryChanges: boolean;
  syncBenefits: boolean;
  lastSyncDate: Date;
  syncStatus: 'active' | 'error' | 'disabled';
}

export interface TimeTrackingIntegration {
  syncAttendance: boolean;
  syncLeaveRequests: boolean;
  syncOvertimeApprovals: boolean;
  lastSyncDate: Date;
  syncStatus: 'active' | 'error' | 'disabled';
}

export interface LMSIntegration {
  syncTrainingRecords: boolean;
  syncCertifications: boolean;
  syncSkillAssessments: boolean;
  lastSyncDate: Date;
  syncStatus: 'active' | 'error' | 'disabled';
}

export interface ATSIntegration {
  syncCandidateData: boolean;
  syncHiringDecisions: boolean;
  syncOnboardingTasks: boolean;
  lastSyncDate: Date;
  syncStatus: 'active' | 'error' | 'disabled';
}

export interface BackgroundCheckIntegration {
  autoRequestChecks: boolean;
  syncResults: boolean;
  complianceAlerts: boolean;
  lastSyncDate: Date;
  syncStatus: 'active' | 'error' | 'disabled';
}

// Configuration and Settings
export interface HRMSConfiguration {
  organizationSettings: OrganizationSettings;
  securitySettings: SecuritySettings;
  notificationSettings: NotificationSettings;
  workflowSettings: WorkflowSettings;
  integrationSettings: IntegrationSettings;
}

export interface OrganizationSettings {
  companyName: string;
  companyNameAr?: string;
  fiscalYearStart: string;
  workingDays: number[];
  standardWorkHours: number;
  overtimePolicy: OvertimePolicy;
  leavePolicy: LeavePolicy;
  probationPeriod: number;
  retirementAge: number;
}

export interface OvertimePolicy {
  eligibleRoles: string[];
  maxDailyHours: number;
  maxWeeklyHours: number;
  approvalRequired: boolean;
  multiplier: number;
}

export interface LeavePolicy {
  annualLeaveEntitlement: number;
  sickLeaveEntitlement: number;
  maternityLeave: number;
  paternityLeave: number;
  carryOverLimit: number;
  encashmentAllowed: boolean;
}

export interface SecuritySettings {
  passwordPolicy: PasswordPolicy;
  sessionTimeout: number;
  maxLoginAttempts: number;
  twoFactorRequired: boolean;
  dataEncryption: boolean;
  auditLogging: boolean;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expiryDays: number;
  historyCount: number;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  reminderSettings: ReminderSettings;
  escalationSettings: EscalationSettings;
}

export interface ReminderSettings {
  documentExpiry: number;
  performanceReview: number;
  goalDeadline: number;
  trainingDue: number;
  probationEnding: number;
}

export interface EscalationSettings {
  approvalTimeout: number;
  escalationLevels: number;
  autoEscalate: boolean;
  skipWeekends: boolean;
}

export interface WorkflowSettings {
  autoApprovalLimits: Record<string, number>;
  delegationRules: DelegationRule[];
  holidayCalendar: string[];
  businessHours: BusinessHours;
}

export interface DelegationRule {
  fromRole: string;
  toRole: string;
  conditions: string[];
  isActive: boolean;
}

export interface BusinessHours {
  startTime: string;
  endTime: string;
  timezone: string;
  workingDays: number[];
}

export interface IntegrationSettings {
  apiEndpoints: Record<string, string>;
  authenticationMethods: Record<string, string>;
  syncFrequency: Record<string, number>;
  errorHandling: ErrorHandlingConfig;
}

export interface ErrorHandlingConfig {
  retryAttempts: number;
  retryDelay: number;
  fallbackMethods: string[];
  alertThreshold: number;
}