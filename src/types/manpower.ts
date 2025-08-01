// Core Employee Interface
export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  trade: string;
  nationality: string;
  phoneNumber: string;
  hourlyRate: number;    // Company cost (what company pays employee)
  actualRate: number;    // Client billing rate (what company charges)
  projectId?: string;
  documents: EmployeeDocument[];
  status: 'active' | 'inactive' | 'on-leave';
  skills: string[];
  certifications: string[];
  performanceRating: number;
  emergencyContact?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Document Management
export interface EmployeeDocument {
  id: string;
  employeeId: string;
  name: string;
  type: 'passport' | 'visa' | 'iqama' | 'contract' | 'certificate' | 'medical' | 'other';
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  expiryDate?: string;
  notes?: string;
  isExpired: boolean;
  daysUntilExpiry?: number;
}

// Manpower Project Structure
export interface ManpowerProject {
  id: string;
  name: string;
  client: string;
  contractor: string;
  location: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'active' | 'hold' | 'finished';
  progress: number;
  statusHistory: ProjectStatusEntry[];
  description?: string;
  requirements: string[];
  deliverables: string[];
  riskLevel: 'low' | 'medium' | 'high';
  profitMargin: number;
  createdAt: Date;
  updatedAt: Date;
}

// Project Status Tracking
export interface ProjectStatusEntry {
  id: string;
  projectId: string;
  status: 'active' | 'hold' | 'finished';
  progress: number;
  notes?: string;
  updatedBy: string;
  updatedAt: Date;
  followUp?: ProjectFollowUp;
  attachments?: string[];
  impactAssessment?: string;
  statusChangeReason?: string;
  previousStatus?: 'active' | 'hold' | 'finished';
}

// Follow-up Management
export interface ProjectFollowUp {
  id: string;
  statusEntryId: string;
  isRequired: boolean;
  followUpDate: string;
  followUpTime: string;
  reminderPreference: 'email' | 'push' | 'both';
  actionDescription: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isCompleted: boolean;
  completedAt?: Date;
  completedBy?: string;
  completionNotes?: string;
  escalationLevel: number;
}

// Attendance & Time Tracking
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  projectId: string;
  date: string;
  hoursWorked: number;
  overtime: number;
  breakTime: number;
  lateArrival: number;
  earlyDeparture: number;
  location?: string;
  weatherConditions?: string;
  approvedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Financial Calculations
export interface FinancialCalculation {
  laborCost: number;      // Company expense
  revenue: number;        // Client billing
  profit: number;         // Revenue - Labor Cost
  profitMargin: number;   // (Profit / Revenue) × 100
  regularPay: number;
  overtimePay: number;
  totalHours: number;
  effectiveRate: number;
}

// Invoice Management
export interface ClientInvoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  dateFrom: string;
  dateTo: string;
  issueDate: string;
  dueDate: string;
  vatPercentage: number;
  subtotal: number;
  vatAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'pending' | 'paid' | 'overdue';
  paymentDate?: string;
  items: InvoiceItem[];
  notes?: string;
  paymentTerms: string;
}

export interface InvoiceItem {
  employeeId: string;
  employeeName: string;
  trade: string;
  hoursWorked: number;
  overtimeHours: number;
  hourlyRate: number;    // Hidden from client - internal cost
  actualRate: number;    // Client billing rate
  amount: number;        // Based on actual rate
  description: string;
}

// Salary Invoice for Employees
export interface SalaryInvoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  employeeId: string;
  dateFrom: string;
  dateTo: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  deductions: number;
  total: number;
  status: 'draft' | 'sent' | 'pending' | 'paid';
  paymentDate?: string;
  items: SalaryInvoiceItem[];
  signature?: string;
}

export interface SalaryInvoiceItem {
  description: string;
  hoursWorked: number;
  overtimeHours: number;
  hourlyRate: number;    // Employee compensation rate
  amount: number;
  date: string;
}

// Profit Reporting
export interface ProfitReport {
  id: string;
  title: string;
  type: 'project' | 'company' | 'period' | 'employee';
  projectId?: string;
  employeeId?: string;
  dateFrom: string;
  dateTo: string;
  totalRevenue: number;
  totalCosts: number;
  totalProfits: number;
  profitMargin: number;
  employeeCount: number;
  totalHours: number;
  breakdown: ProfitBreakdownItem[];
  insights: string[];
  recommendations: string[];
  createdAt: Date;
  createdBy: string;
}

export interface ProfitBreakdownItem {
  category: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  hours: number;
  employees: number;
}

// Project Proposal System
export interface ProjectProposal {
  id: string;
  name: string;
  description: string;           // 200-300 words requirement
  expectedTimeline: string;
  requiredResources: string[];
  estimatedBudget: number;
  keyObjectives: string[];
  deliverables: string[];
  teamMembers: ProjectTeamMember[];
  riskAssessment: RiskAssessment;
  status: 'draft' | 'pending-approval' | 'approved' | 'rejected' | 'transferred';
  submittedBy: string;
  submittedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  transferredProjectId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ProjectTeamMember {
  employeeId: string;
  role: string;
  responsibility: string;
  allocation: number; // Percentage
}

export interface RiskAssessment {
  level: 'low' | 'medium' | 'high';
  factors: string[];
  mitigationStrategies: string[];
  contingencyPlans: string[];
}

// Dashboard Metrics
export interface DashboardMetrics {
  totalWorkforce: number;
  activeProjects: number;
  aggregateHours: number;
  crossProjectRevenue: number;
  realTimeProfits: number;
  productivityIndex: number;
  utilizationRate: number;
  averageProfitMargin: number;
}

export interface ProjectMetrics {
  projectWorkforce: number;
  clientBilling: number;
  realTimeProfit: number;
  laborCosts: number;
  productivity: number;
  workerEfficiency: number;
  attendanceRate: number;
  overtimePercentage: number;
}

// Analytics & Insights
export interface WorkforceAnalytics {
  nationalityDistribution: NationalityData[];
  tradeDistribution: TradeData[];
  performanceMetrics: PerformanceData[];
  attendancePatterns: AttendancePattern[];
  profitTrends: ProfitTrendData[];
}

export interface NationalityData {
  nationality: string;
  count: number;
  percentage: number;
  averageRate: number;
  totalHours: number;
}

export interface TradeData {
  trade: string;
  count: number;
  averageHourlyRate: number;
  averageActualRate: number;
  profitMargin: number;
  demand: 'high' | 'medium' | 'low';
}

export interface PerformanceData {
  employeeId: string;
  name: string;
  efficiency: number;
  attendance: number;
  quality: number;
  safety: number;
  overall: number;
}

export interface AttendancePattern {
  date: string;
  totalHours: number;
  overtime: number;
  attendance: number;
  efficiency: number;
}

export interface ProfitTrendData {
  week: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
  projects: number;
  employees: number;
}

// Actionable Insights
export interface ActionableInsight {
  id: string;
  type: 'optimization' | 'alert' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'financial' | 'operational' | 'safety' | 'efficiency';
  actionRequired: boolean;
  deadline?: string;
  estimatedBenefit?: number;
  implementationCost?: number;
  priority: number;
  status: 'new' | 'acknowledged' | 'in-progress' | 'completed' | 'dismissed';
}

// Search and Filter Types
export interface SearchFilters {
  searchTerm: string;
  nationality?: string;
  trade?: string;
  project?: string;
  status?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  rateRange?: {
    min: number;
    max: number;
  };
}

// Export and Reporting
export interface ReportConfig {
  type: 'attendance' | 'financial' | 'employee' | 'project' | 'profit';
  format: 'pdf' | 'excel' | 'csv';
  dateRange: {
    from: string;
    to: string;
  };
  includeCharts: boolean;
  includeSignatures: boolean;
  groupBy?: 'employee' | 'project' | 'trade' | 'nationality';
  filters?: SearchFilters;
}

// Notification System
export interface NotificationConfig {
  documentExpiry: {
    enabled: boolean;
    daysBeforeExpiry: number;
    recipients: string[];
  };
  projectDeadlines: {
    enabled: boolean;
    daysBeforeDeadline: number;
    recipients: string[];
  };
  followUpReminders: {
    enabled: boolean;
    reminderIntervals: number[];
    escalationLevels: string[];
  };
  profitAlerts: {
    enabled: boolean;
    marginThreshold: number;
    recipients: string[];
  };
}