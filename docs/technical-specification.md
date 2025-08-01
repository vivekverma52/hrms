# Active Manpower Module - Technical Specification Document

## 1. Executive Summary

This document outlines the complete technical specification for implementing a comprehensive Active Manpower module within the HRMS workforce management system. The module transforms traditional manpower management into a sophisticated, data-driven operation with real-time analytics, automated workflows, and profit optimization capabilities.

## 2. System Architecture Overview

### 2.1 Technology Stack
- **Frontend**: React 18 with TypeScript
- **Build System**: Vite for optimized performance
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React for consistent iconography
- **Charts**: Chart.js with React Chart.js 2
- **State Management**: React hooks with Local Storage persistence
- **Data Persistence**: Custom useLocalStorage hook

### 2.2 Architecture Principles
- **Modular Design**: Reusable components with clear separation of concerns
- **Type Safety**: Comprehensive TypeScript interfaces
- **Real-time Updates**: Live data synchronization across components
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Performance**: Optimized rendering and data management

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
  hourlyRate: number;    // Company cost (what company pays)
  actualRate: number;    // Client billing rate (what company charges)
  projectId?: string;
  documents: EmployeeDocument[];
  createdAt: Date;
  updatedAt: Date;
}

interface EmployeeDocument {
  id: string;
  name: string;
  type: 'passport' | 'visa' | 'iqama' | 'contract' | 'certificate' | 'medical' | 'other';
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  expiryDate?: string;
  notes?: string;
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
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  statusHistory: ProjectStatusEntry[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectStatusEntry {
  id: string;
  projectId: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  notes?: string;
  updatedBy: string;
  updatedAt: Date;
  followUp?: ProjectFollowUp;
}
```

### 3.3 Financial System
```typescript
interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  hoursWorked: number;
  overtime: number;
  createdAt: Date;
  updatedAt: Date;
}

interface FinancialCalculation {
  laborCost: number;      // (regularHours × hourlyRate) + (overtimeHours × hourlyRate × 1.5)
  revenue: number;        // (regularHours × actualRate) + (overtimeHours × actualRate × 1.5)
  profit: number;         // revenue - laborCost
  profitMargin: number;   // (profit / revenue) × 100
}
```

## 4. Component Architecture

### 4.1 Dashboard Components
- **GlobalCommandCenter**: Real-time workforce metrics
- **ProjectIntelligenceHub**: Project-specific analytics
- **MetricCard**: KPI display with gradient styling
- **ProfitTrendChart**: 5-week financial trend analysis
- **PerformanceHeatmap**: Color-coded project visualization

### 4.2 Management Components
- **EmployeeManagement**: Complete workforce directory
- **ProjectManagement**: Lifecycle tracking with status history
- **AttendanceTracking**: Time tracking with financial calculations
- **InvoiceManagement**: Client and salary invoicing
- **ProfitIntelligence**: Advanced financial analytics

### 4.3 Utility Components
- **ActionableInsights**: AI-driven recommendations
- **DocumentManager**: File upload and expiry tracking
- **FollowUpSystem**: Automated workflow management
- **ReportGenerator**: Custom report creation

## 5. Financial Intelligence System

### 5.1 Dual-Rate Architecture
The system implements a sophisticated dual-rate structure:
- **Cost Basis (hourlyRate)**: What the company pays employees
- **Revenue Basis (actualRate)**: What the company bills clients
- **Profit Calculation**: Real-time margin analysis

### 5.2 Real-time Calculations
```typescript
const calculateFinancials = (
  regularHours: number,
  overtimeHours: number,
  hourlyRate: number,
  actualRate: number
): FinancialCalculation => {
  const laborCost = (regularHours * hourlyRate) + (overtimeHours * hourlyRate * 1.5);
  const revenue = (regularHours * actualRate) + (overtimeHours * actualRate * 1.5);
  const profit = revenue - laborCost;
  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
  
  return { laborCost, revenue, profit, profitMargin };
};
```

## 6. Data Visualization Strategy

### 6.1 Chart Components
- **Profit Trend Charts**: Interactive financial trend analysis
- **Attendance Charts**: Visual attendance patterns
- **Nationality Distribution**: Workforce diversity analytics
- **Performance Heatmaps**: Project performance visualization

### 6.2 Business Intelligence
- KPI dashboards with progress tracking
- Comparative project analysis
- Trend identification and pattern recognition
- Predictive insights for optimization

## 7. Workflow Management

### 7.1 Project Lifecycle
- Complete tracking from proposal to completion
- Status history with comprehensive audit trails
- Automated follow-up management
- Progress visualization with completion indicators

### 7.2 Follow-up System
- Automated reminders via email/push notifications
- Priority-based action tracking
- Overdue detection with alerts
- Completion tracking with notes

## 8. Implementation Phases

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

## 9. Quality Assurance

### 9.1 Testing Strategy
- Unit tests for financial calculations
- Integration tests for component interactions
- End-to-end tests for complete workflows
- Performance testing for real-time updates

### 9.2 Success Metrics
- 99.9% accuracy in financial calculations
- <100ms response time for real-time updates
- 80% reduction in manual processes
- Mobile and desktop responsive design
- Intuitive interface requiring minimal training

## 10. Security & Compliance

### 10.1 Data Security
- Encrypted local storage for sensitive data
- Role-based access control
- Audit trails for all operations
- Document security with access logging

### 10.2 Compliance Features
- Saudi labor law compliance
- VAT calculation accuracy (15%)
- Document expiry tracking
- Professional reporting formats

This specification provides the foundation for a world-class workforce intelligence platform that maximizes profitability while ensuring operational excellence and regulatory compliance.