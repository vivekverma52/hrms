# Active Manpower Module - Comprehensive Technical Specification

## 1. Executive Summary

This document provides the complete technical specification for implementing a sophisticated Active Manpower module within the HRMS workforce management system. The module transforms traditional manpower management into a data-driven, profit-optimized operation with real-time analytics, automated workflows, and comprehensive financial intelligence.

## 2. System Architecture Overview

### 2.1 Technology Stack
- **Frontend**: React 18 with TypeScript for type-safe development
- **Build System**: Vite for optimized performance and fast development
- **Styling**: Tailwind CSS for responsive, modern UI design
- **Icons**: Lucide React for consistent iconography
- **Charts**: Chart.js with React Chart.js 2 for interactive data visualization
- **State Management**: Custom useLocalStorage hook + React state for real-time updates
- **Data Persistence**: Local Storage with automatic JSON serialization

### 2.2 Architecture Principles
- **Modular Design**: Reusable components with clear separation of concerns
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures
- **Real-time Updates**: Live data synchronization across all components
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Performance**: Optimized rendering with memoization and efficient data management

## 3. Core Data Structures

### 3.1 Employee Management
```typescript
interface Employee {
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

interface EmployeeDocument {
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
```

### 3.2 Project Management
```typescript
interface ManpowerProject {
  id: string;
  name: string;
  client: string;
  contractor: string;
  location: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
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

interface ProjectStatusEntry {
  id: string;
  projectId: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  progress: number;
  notes?: string;
  updatedBy: string;
  updatedAt: Date;
  followUp?: ProjectFollowUp;
  attachments?: string[];
  impactAssessment?: string;
}

interface ProjectFollowUp {
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
```

### 3.3 Attendance & Financial Tracking
```typescript
interface AttendanceRecord {
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

interface FinancialCalculation {
  laborCost: number;      // Company expense
  revenue: number;        // Client billing
  profit: number;         // Revenue - Labor Cost
  profitMargin: number;   // (Profit / Revenue) × 100
  regularPay: number;
  overtimePay: number;
  totalHours: number;
  effectiveRate: number;
}
```

### 3.4 Invoice Management
```typescript
interface ClientInvoice {
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

interface InvoiceItem {
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

interface SalaryInvoice {
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
```

## 4. Financial Intelligence System

### 4.1 Dual-Rate Architecture
The system implements a sophisticated dual-rate structure that provides complete financial transparency:

```typescript
// Financial Calculation Engine
const calculateFinancials = (
  regularHours: number,
  overtimeHours: number,
  hourlyRate: number,    // What company pays employee
  actualRate: number     // What company bills client
): FinancialCalculation => {
  // Labor cost calculation (company expense)
  const regularPay = regularHours * hourlyRate;
  const overtimePay = overtimeHours * hourlyRate * 1.5;
  const laborCost = regularPay + overtimePay;

  // Revenue calculation (client billing)
  const regularRevenue = regularHours * actualRate;
  const overtimeRevenue = overtimeHours * actualRate * 1.5;
  const revenue = regularRevenue + overtimeRevenue;

  // Profit calculation
  const profit = revenue - laborCost;
  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

  const totalHours = regularHours + overtimeHours;
  const effectiveRate = totalHours > 0 ? revenue / totalHours : 0;

  return {
    laborCost: Number(laborCost.toFixed(2)),
    revenue: Number(revenue.toFixed(2)),
    profit: Number(profit.toFixed(2)),
    profitMargin: Number(profitMargin.toFixed(2)),
    regularPay: Number(regularPay.toFixed(2)),
    overtimePay: Number(overtimePay.toFixed(2)),
    totalHours,
    effectiveRate: Number(effectiveRate.toFixed(2))
  };
};
```

### 4.2 Real-time Profit Intelligence
- **Live Calculations**: Instant profit margin updates as attendance is recorded
- **Margin Optimization**: AI-driven recommendations for rate adjustments
- **Cost Analysis**: Detailed breakdown of labor costs vs. revenue generation
- **Performance Metrics**: Revenue per hour, profit per employee, utilization rates

## 5. Component Architecture

### 5.1 Dashboard Components
```typescript
// Global Command Center
interface GlobalDashboardProps {
  totalWorkforce: number;
  activeProjects: number;
  aggregateHours: number;
  crossProjectRevenue: number;
  realTimeProfits: number;
  productivityIndex: number;
  utilizationRate: number;
  averageProfitMargin: number;
}

// Project Intelligence Hub
interface ProjectDashboardProps {
  projectId: string;
  projectWorkforce: number;
  clientBilling: number;
  realTimeProfit: number;
  laborCosts: number;
  productivity: number;
  workerEfficiency: number;
  attendanceRate: number;
  overtimePercentage: number;
}
```

### 5.2 Chart Components
```typescript
// Profit Trend Visualization
interface ProfitTrendChartProps {
  data: ProfitTrendData[];
  isArabic?: boolean;
}

// Attendance Pattern Analysis
interface AttendanceChartProps {
  data: AttendancePattern[];
  isArabic?: boolean;
}

// Workforce Diversity Analytics
interface NationalityChartProps {
  data: NationalityData[];
  isArabic?: boolean;
}
```

## 6. Data Management System

### 6.1 Local Storage Hook
```typescript
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};
```

### 6.2 Workforce Data Hook
```typescript
export const useWorkforceData = () => {
  // Core data storage
  const [employees, setEmployees] = useLocalStorage<Employee[]>('workforce_employees', []);
  const [projects, setProjects] = useLocalStorage<ManpowerProject[]>('workforce_projects', []);
  const [attendance, setAttendance] = useLocalStorage<AttendanceRecord[]>('workforce_attendance', []);
  
  // Real-time dashboard metrics calculation
  const getDashboardMetrics = useCallback((): DashboardMetrics => {
    // Implementation details...
  }, [employees, projects, attendance]);

  // CRUD operations and calculations
  return {
    employees, projects, attendance,
    addEmployee, updateEmployee, deleteEmployee,
    addProject, updateProject,
    addAttendanceRecord, addBulkAttendance,
    getDashboardMetrics, getProjectMetrics,
    calculateProjectFinancials, exportData
  };
};
```

## 7. User Interface Specifications

### 7.1 Dashboard Layout
```typescript
// Global Command Center Layout
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  <MetricCard 
    title="Total Workforce"
    value={metrics.totalWorkforce}
    icon={Users}
    gradient="from-blue-50 to-blue-100"
    borderColor="border-blue-200"
  />
  <MetricCard 
    title="Real-Time Profits"
    value={formatCurrency(metrics.realTimeProfits)}
    icon={DollarSign}
    gradient="from-green-50 to-green-100"
    borderColor="border-green-200"
  />
  // Additional metric cards...
</div>
```

### 7.2 Employee Management Interface
```typescript
// Employee List with Advanced Filtering
<div className="space-y-6">
  <SearchAndFilter 
    searchTerm={searchTerm}
    onSearchChange={setSearchTerm}
    filters={filters}
    onFilterChange={setFilters}
    uniqueNationalities={uniqueNationalities}
    uniqueTrades={uniqueTrades}
    projects={projects}
  />
  
  <EmployeeTable 
    employees={filteredEmployees}
    projects={projects}
    onEdit={handleEditEmployee}
    onDelete={handleDeleteEmployee}
    onView={setSelectedEmployee}
  />
</div>
```

## 8. Financial Intelligence Implementation

### 8.1 Real-time Calculations
```typescript
// Project Financial Metrics
const calculateProjectFinancials = (
  projectId: string, 
  dateFrom?: string, 
  dateTo?: string
): FinancialCalculation => {
  const projectAttendance = attendance.filter(record => {
    const employee = employees.find(emp => emp.id === record.employeeId);
    const matchesProject = employee?.projectId === projectId;
    
    if (!dateFrom || !dateTo) return matchesProject;
    
    const recordDate = new Date(record.date);
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    
    return matchesProject && recordDate >= fromDate && recordDate <= toDate;
  });

  let totalLaborCost = 0;
  let totalRevenue = 0;
  let totalHours = 0;

  projectAttendance.forEach(record => {
    const employee = employees.find(emp => emp.id === record.employeeId);
    if (employee) {
      const financials = calculateFinancials(
        record.hoursWorked,
        record.overtime,
        employee.hourlyRate,
        employee.actualRate
      );
      totalLaborCost += financials.laborCost;
      totalRevenue += financials.revenue;
      totalHours += record.hoursWorked + record.overtime;
    }
  });

  const profit = totalRevenue - totalLaborCost;
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
  const effectiveRate = totalHours > 0 ? totalRevenue / totalHours : 0;

  return {
    laborCost: totalLaborCost,
    revenue: totalRevenue,
    profit,
    profitMargin,
    regularPay: totalLaborCost * 0.8,
    overtimePay: totalLaborCost * 0.2,
    totalHours,
    effectiveRate
  };
};
```

### 8.2 Profit Intelligence Analytics
```typescript
// Actionable Insights Generation
const generateInsights = (): ActionableInsight[] => {
  const insights: ActionableInsight[] = [];
  const metrics = getDashboardMetrics();

  // Utilization optimization
  if (metrics.utilizationRate < 85) {
    insights.push({
      type: 'optimization',
      title: 'Workforce Utilization Below Target',
      description: `Current utilization rate is ${metrics.utilizationRate.toFixed(1)}%. Consider reassigning unassigned workers to active projects.`,
      impact: 'high',
      category: 'operational',
      actionRequired: true,
      estimatedBenefit: 50000,
      implementationCost: 5000,
      priority: 1
    });
  }

  // Profit margin alerts
  if (metrics.averageProfitMargin < 20) {
    insights.push({
      type: 'alert',
      title: 'Low Profit Margin Alert',
      description: `Average profit margin is ${metrics.averageProfitMargin.toFixed(1)}%. Review actual rates and optimize cost structure.`,
      impact: 'high',
      category: 'financial',
      actionRequired: true,
      priority: 2
    });
  }

  return insights;
};
```

## 9. Chart and Visualization System

### 9.1 Chart Components
- **Profit Trend Charts**: Interactive financial trend analysis
- **Attendance Charts**: Visual attendance patterns
- **Nationality Distribution**: Workforce diversity analytics
- **Performance Heatmaps**: Project performance visualization

### 9.2 Business Intelligence
- KPI dashboards with progress tracking
- Comparative project analysis
- Trend identification and pattern recognition
- Predictive insights for optimization

## 10. Workflow Management

### 10.1 Project Lifecycle
- Complete tracking from proposal to completion
- Status history with comprehensive audit trails
- Automated follow-up management
- Progress visualization with completion indicators

### 10.2 Follow-up System
- Automated reminders via email/push notifications
- Priority-based action tracking
- Overdue detection with alerts
- Completion tracking with notes

## 11. Implementation Phases

### Phase 1: Core Infrastructure (Weeks 1-2)
- Data structures and TypeScript interfaces
- Basic component architecture
- Local storage implementation
- Sample data system

### Phase 2: Dashboard & Analytics (Weeks 3-4)
- Global command center implementation
- Project intelligence hub
- Chart components integration
- Real-time calculation engine

### Phase 3: Management Systems (Weeks 5-6)
- Employee management with document system
- Project management with status tracking
- Attendance tracking with financial calculations
- Invoice management system

### Phase 4: Intelligence & Optimization (Weeks 7-8)
- Profit intelligence center
- Actionable insights system
- Advanced reporting capabilities
- Workflow automation

## 12. Quality Assurance

### 12.1 Testing Strategy
- Unit tests for financial calculations
- Integration tests for component interactions
- End-to-end tests for complete workflows
- Performance testing for real-time updates

### 12.2 Success Metrics
- 99.9% accuracy in financial calculations
- <100ms response time for real-time updates
- 80% reduction in manual processes
- Mobile and desktop responsive design
- Intuitive interface requiring minimal training

## 13. Security & Compliance

### 13.1 Data Security
- Encrypted local storage for sensitive data
- Role-based access control
- Audit trails for all operations
- Document security with access logging

### 13.2 Compliance Features
- Saudi labor law compliance
- VAT calculation accuracy (15%)
- Document expiry tracking
- Professional reporting formats

This specification provides the foundation for a world-class workforce intelligence platform that maximizes profitability while ensuring operational excellence and regulatory compliance.