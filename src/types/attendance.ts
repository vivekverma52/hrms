// Comprehensive Attendance Management Types

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  hoursWorked: number;
  overtimeHours: number;
  breakTime: number;
  lateArrival: number;
  earlyDeparture: number;
  location?: string;
  weatherConditions?: string;
  notes?: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkSchedule {
  id: string;
  name: string;
  description?: string;
  scheduleType: 'fixed' | 'flexible' | 'shift';
  startTime?: string;
  endTime?: string;
  breakDuration: number; // minutes
  workDays: number[]; // 1=Monday, 7=Sunday
  hoursPerWeek: number;
  overtimeThreshold: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeSchedule {
  id: string;
  employeeId: string;
  scheduleId: string;
  effectiveDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ScheduleException {
  id: string;
  scheduleId?: string;
  employeeId?: string;
  exceptionDate: string;
  exceptionType: 'holiday' | 'vacation' | 'sick' | 'personal' | 'company';
  isPaid: boolean;
  description?: string;
  createdAt: Date;
}

export interface LeaveType {
  id: string;
  name: string;
  description?: string;
  maxDaysPerYear?: number;
  requiresApproval: boolean;
  advanceNoticeDays: number;
  isPaid: boolean;
  carryOverAllowed: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requestedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  allocatedDays: number;
  usedDays: number;
  pendingDays: number;
  remainingDays: number;
  carryOverDays: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayrollPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  payDate: string;
  status: 'draft' | 'processing' | 'approved' | 'paid';
  totalEmployees: number;
  totalHours: number;
  totalAmount: number;
  createdBy: string;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayrollCalculation {
  id: string;
  payrollPeriodId: string;
  employeeId: string;
  regularHours: number;
  overtimeHours: number;
  holidayHours: number;
  sickHours: number;
  vacationHours: number;
  regularPay: number;
  overtimePay: number;
  holidayPay: number;
  bonusAmount: number;
  deductionAmount: number;
  grossPay: number;
  taxAmount: number;
  netPay: number;
  calculationDate: Date;
}

export interface AuditLogEntry {
  id: string;
  tableName: string;
  recordId: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  oldValues?: any;
  newValues?: any;
  changedBy?: string;
  changedAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface ComplianceRule {
  id: string;
  name: string;
  description?: string;
  ruleType: string;
  parameters: any;
  isActive: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
}

export interface ComplianceViolation {
  id: string;
  ruleId: string;
  employeeId?: string;
  violationDate: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'acknowledged' | 'resolved' | 'dismissed';
  resolvedBy?: string;
  resolvedAt?: Date;
  resolutionNotes?: string;
  createdAt: Date;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  subject?: string;
  bodyTemplate: string;
  variables?: any;
  isActive: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  templateId?: string;
  recipientId: string;
  type: 'email' | 'push' | 'sms' | 'in-app';
  subject?: string;
  message: string;
  data?: any;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  scheduledAt: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  errorMessage?: string;
  retryCount: number;
  createdAt: Date;
}

export interface AttendanceReport {
  employeeId: string;
  employeeName: string;
  department: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  absentDays: number;
  lateDays: number;
  attendanceRate: number;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  reportType: string;
  parameters: any;
  scheduleConfig?: any;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface GeneratedReport {
  id: string;
  templateId?: string;
  name: string;
  reportType: string;
  parameters: any;
  filePath?: string;
  fileSize?: number;
  status: 'generating' | 'completed' | 'failed';
  generatedBy: string;
  generatedAt: Date;
  expiresAt?: Date;
}

// Configuration Constants
export const ATTENDANCE_CONFIG = {
  // Time tracking settings
  OVERTIME_THRESHOLD: 40, // hours per week
  OVERTIME_MULTIPLIER: 1.5,
  BREAK_DURATION: 30, // minutes
  GRACE_PERIOD: 15, // minutes for late clock-in
  
  // Location settings
  LOCATION_RADIUS: 100, // meters for geofencing
  LOCATION_REQUIRED: true,
  
  // Payroll settings
  PAY_FREQUENCY: 'bi-weekly' as const, // weekly, bi-weekly, monthly
  TAX_RATE: 0.15, // 15% default tax rate
  
  // Notification settings
  REMINDER_INTERVALS: [15, 30, 60], // minutes before shift
  MAX_RETRY_ATTEMPTS: 3,
  
  // Report settings
  REPORT_RETENTION_DAYS: 2555, // 7 years
  EXPORT_FORMATS: ['pdf', 'excel', 'csv'] as const,
  
  // Security settings
  SESSION_TIMEOUT: 480, // minutes (8 hours)
  PASSWORD_EXPIRY_DAYS: 90,
  MAX_LOGIN_ATTEMPTS: 5
};