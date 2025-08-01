# Hourly Rate Management Module - Technical Specification

## 1. Executive Summary

This document outlines the technical specifications for implementing a comprehensive hourly rate management module within the HRMS payroll system. The module will support Saudi Arabian Riyal (SAR) currency, comply with Saudi labor laws, and provide real-time calculation capabilities for monthly salary equivalents.

## 2. System Overview

### 2.1 Purpose
The Hourly Rate Management Module enables organizations to:
- Configure and manage hourly wage structures
- Calculate overtime compensation according to Saudi labor law
- Provide real-time monthly salary equivalents
- Maintain audit trails for rate changes
- Ensure compliance with minimum wage requirements

### 2.2 Scope
- Hourly wage configuration and management
- Standard hours administration
- Overtime multiplier calculations
- Real-time monthly equivalent calculations
- Data validation and error handling
- Integration with existing payroll systems

## 3. Core Requirements

### 3.1 Hourly Wage System

#### 3.1.1 Data Structure
```typescript
interface HourlyRate {
  id: string;
  employeeId: string;
  hourlyWage: number; // SAR per hour
  effectiveDate: string; // ISO 8601 format
  endDate?: string; // ISO 8601 format
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'draft' | 'active' | 'expired' | 'suspended';
  notes?: string;
}
```

#### 3.1.2 Validation Rules
- **Minimum Wage**: 18.00 SAR/hour (Saudi minimum wage compliance)
- **Maximum Wage**: 500.00 SAR/hour (system constraint)
- **Precision**: 2 decimal places maximum
- **Currency**: Saudi Arabian Riyal (SAR) only
- **Required Fields**: hourlyWage, employeeId, effectiveDate

#### 3.1.3 Business Rules
- Hourly rates must be approved by HR Manager or above
- Rate changes require 7-day notice period
- Historical rates must be preserved for audit purposes
- Overlapping rate periods are not allowed for the same employee

### 3.2 Standard Hours Configuration

#### 3.2.1 System Configuration
```typescript
interface StandardHoursConfig {
  id: string;
  standardHoursPerMonth: number; // Default: 176
  workingDaysPerMonth: number; // Default: 22
  hoursPerDay: number; // Default: 8
  lastModified: string;
  modifiedBy: string;
  effectiveDate: string;
}
```

#### 3.2.2 Administrative Override
- **Range**: 120-220 hours per month
- **Default**: 176 hours per month (22 days × 8 hours)
- **Access Level**: System Administrator only
- **Change Approval**: Requires CEO approval for modifications
- **Impact Assessment**: System must calculate impact on all active employees

#### 3.2.3 Validation Rules
```typescript
const validateStandardHours = (hours: number): ValidationResult => {
  if (hours < 120) return { valid: false, error: "Minimum 120 hours required" };
  if (hours > 220) return { valid: false, error: "Maximum 220 hours allowed" };
  if (hours % 0.5 !== 0) return { valid: false, error: "Hours must be in 0.5 increments" };
  return { valid: true };
};
```

### 3.3 Overtime Multiplier Options

#### 3.3.1 Multiplier Structure
```typescript
interface OvertimeMultiplier {
  id: string;
  name: string;
  nameAr: string;
  multiplier: number;
  description: string;
  isDefault: boolean;
  saudiLaborLawCompliant: boolean;
}

const OVERTIME_MULTIPLIERS: OvertimeMultiplier[] = [
  {
    id: 'regular',
    name: 'Regular Time',
    nameAr: 'الوقت العادي',
    multiplier: 1.00,
    description: 'Standard hourly rate',
    isDefault: true,
    saudiLaborLawCompliant: true
  },
  {
    id: 'time_quarter',
    name: 'Time and Quarter',
    nameAr: 'الوقت وربع',
    multiplier: 1.25,
    description: '25% premium over standard rate',
    isDefault: false,
    saudiLaborLawCompliant: true
  },
  {
    id: 'time_half',
    name: 'Time and Half',
    nameAr: 'الوقت ونصف',
    multiplier: 1.50,
    description: '50% premium over standard rate (Saudi law minimum)',
    isDefault: false,
    saudiLaborLawCompliant: true
  },
  {
    id: 'double_time',
    name: 'Double Time',
    nameAr: 'الوقت المضاعف',
    multiplier: 2.00,
    description: '100% premium over standard rate',
    isDefault: false,
    saudiLaborLawCompliant: true
  }
];
```

#### 3.3.2 Saudi Labor Law Compliance
- **Regular Hours**: 1-176 hours = 1.0x multiplier
- **Overtime Hours**: 177+ hours = minimum 1.5x multiplier (Saudi law requirement)
- **Holiday Work**: 2.0x multiplier (Friday/Saturday work)
- **Night Shift**: Additional 25% premium (1.25x base multiplier)

### 3.4 Real-time Monthly Calculation

#### 3.4.1 Calculation Formula
```typescript
interface MonthlyCalculation {
  regularHours: number;
  overtimeHours: number;
  regularPay: number;
  overtimePay: number;
  totalMonthlyEquivalent: number;
  effectiveHourlyRate: number;
}

const calculateMonthlyEquivalent = (
  hourlyRate: number,
  standardHours: number,
  overtimeHours: number = 0,
  overtimeMultiplier: number = 1.5
): MonthlyCalculation => {
  const regularPay = hourlyRate * standardHours;
  const overtimePay = hourlyRate * overtimeHours * overtimeMultiplier;
  const totalMonthlyEquivalent = regularPay + overtimePay;
  const totalHours = standardHours + overtimeHours;
  const effectiveHourlyRate = totalHours > 0 ? totalMonthlyEquivalent / totalHours : 0;

  return {
    regularHours: standardHours,
    overtimeHours,
    regularPay: Number(regularPay.toFixed(2)),
    overtimePay: Number(overtimePay.toFixed(2)),
    totalMonthlyEquivalent: Number(totalMonthlyEquivalent.toFixed(2)),
    effectiveHourlyRate: Number(effectiveHourlyRate.toFixed(2))
  };
};
```

#### 3.4.2 Display Format
```typescript
const formatSARCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Example output: "٤٬٤٠٠٫٠٠ ر.س."
```

## 4. Data Validation Rules

### 4.1 Input Validation
```typescript
interface ValidationRule {
  field: string;
  type: 'required' | 'range' | 'format' | 'custom';
  rule: any;
  message: string;
  messageAr: string;
}

const VALIDATION_RULES: ValidationRule[] = [
  {
    field: 'hourlyWage',
    type: 'range',
    rule: { min: 18.00, max: 500.00 },
    message: 'Hourly wage must be between 18.00 and 500.00 SAR',
    messageAr: 'يجب أن يكون الأجر بالساعة بين ١٨٫٠٠ و ٥٠٠٫٠٠ ريال'
  },
  {
    field: 'standardHours',
    type: 'range',
    rule: { min: 120, max: 220 },
    message: 'Standard hours must be between 120 and 220 hours per month',
    messageAr: 'يجب أن تكون الساعات القياسية بين ١٢٠ و ٢٢٠ ساعة شهرياً'
  },
  {
    field: 'overtimeMultiplier',
    type: 'custom',
    rule: (value: number) => [1.0, 1.25, 1.5, 2.0].includes(value),
    message: 'Overtime multiplier must be 1.0, 1.25, 1.5, or 2.0',
    messageAr: 'يجب أن يكون مضاعف العمل الإضافي ١٫٠ أو ١٫٢٥ أو ١٫٥ أو ٢٫٠'
  }
];
```

### 4.2 Business Logic Validation
```typescript
const validateHourlyRateChange = (
  currentRate: HourlyRate,
  newRate: Partial<HourlyRate>
): ValidationResult => {
  const errors: string[] = [];

  // Check minimum wage compliance
  if (newRate.hourlyWage && newRate.hourlyWage < 18.00) {
    errors.push('Hourly wage below Saudi minimum wage (18.00 SAR)');
  }

  // Check for significant rate increases (>50%)
  if (newRate.hourlyWage && currentRate.hourlyWage) {
    const increasePercentage = ((newRate.hourlyWage - currentRate.hourlyWage) / currentRate.hourlyWage) * 100;
    if (increasePercentage > 50) {
      errors.push('Rate increase exceeds 50% - requires additional approval');
    }
  }

  // Check effective date
  if (newRate.effectiveDate) {
    const effectiveDate = new Date(newRate.effectiveDate);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7); // 7-day notice period

    if (effectiveDate < minDate) {
      errors.push('Effective date must be at least 7 days in the future');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
```

## 5. Currency Formatting Standards

### 5.1 SAR Display Format
```typescript
class SARFormatter {
  private static readonly LOCALE = 'ar-SA';
  private static readonly CURRENCY = 'SAR';

  static formatAmount(amount: number, showSymbol: boolean = true): string {
    const formatter = new Intl.NumberFormat(this.LOCALE, {
      style: showSymbol ? 'currency' : 'decimal',
      currency: this.CURRENCY,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return formatter.format(amount);
  }

  static formatCompact(amount: number): string {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M SAR`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K SAR`;
    }
    return this.formatAmount(amount);
  }

  static parseAmount(input: string): number {
    // Remove currency symbols and Arabic numerals
    const cleaned = input.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
  }
}
```

### 5.2 Input Formatting
```typescript
const formatHourlyRateInput = (value: string): string => {
  // Remove non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limit to 2 decimal places
  if (parts[1] && parts[1].length > 2) {
    return parts[0] + '.' + parts[1].substring(0, 2);
  }
  
  return cleaned;
};
```

## 6. User Interface Specifications

### 6.1 Rate Configuration Interface
```typescript
interface HourlyRateFormProps {
  employee: Employee;
  currentRate?: HourlyRate;
  onSave: (rate: HourlyRate) => Promise<void>;
  onCancel: () => void;
  isReadOnly?: boolean;
}

// Component structure:
// 1. Employee Information Header
// 2. Current Rate Display (if exists)
// 3. New Rate Configuration Form
//    - Hourly Wage Input (SAR)
//    - Effective Date Picker
//    - Overtime Multiplier Selection
//    - Notes/Comments
// 4. Real-time Calculation Display
// 5. Action Buttons (Save, Cancel, Preview)
```

### 6.2 Calculation Display Component
```typescript
interface CalculationDisplayProps {
  hourlyRate: number;
  standardHours: number;
  overtimeHours?: number;
  overtimeMultiplier?: number;
  isArabic?: boolean;
}

// Display elements:
// - Regular Pay Calculation
// - Overtime Pay Calculation (if applicable)
// - Total Monthly Equivalent
// - Effective Hourly Rate
// - Breakdown Chart/Visual
```

## 7. Error Handling

### 7.1 Client-Side Error Handling
```typescript
enum HourlyRateErrorCode {
  INVALID_WAGE = 'INVALID_WAGE',
  BELOW_MINIMUM = 'BELOW_MINIMUM',
  ABOVE_MAXIMUM = 'ABOVE_MAXIMUM',
  INVALID_DATE = 'INVALID_DATE',
  INSUFFICIENT_NOTICE = 'INSUFFICIENT_NOTICE',
  UNAUTHORIZED = 'UNAUTHORIZED',
  CONCURRENT_MODIFICATION = 'CONCURRENT_MODIFICATION'
}

interface HourlyRateError {
  code: HourlyRateErrorCode;
  message: string;
  messageAr: string;
  field?: string;
  severity: 'error' | 'warning' | 'info';
}

const ERROR_MESSAGES: Record<HourlyRateErrorCode, HourlyRateError> = {
  [HourlyRateErrorCode.BELOW_MINIMUM]: {
    code: HourlyRateErrorCode.BELOW_MINIMUM,
    message: 'Hourly wage cannot be below Saudi minimum wage (18.00 SAR)',
    messageAr: 'لا يمكن أن يكون الأجر بالساعة أقل من الحد الأدنى السعودي (١٨٫٠٠ ريال)',
    field: 'hourlyWage',
    severity: 'error'
  },
  // ... other error definitions
};
```

### 7.2 Server-Side Error Handling
```typescript
class HourlyRateService {
  async validateAndSaveRate(rate: HourlyRate): Promise<ServiceResult<HourlyRate>> {
    try {
      // Validation
      const validation = await this.validateRate(rate);
      if (!validation.valid) {
        return {
          success: false,
          errors: validation.errors,
          data: null
        };
      }

      // Business rule checks
      const businessValidation = await this.validateBusinessRules(rate);
      if (!businessValidation.valid) {
        return {
          success: false,
          errors: businessValidation.errors,
          data: null
        };
      }

      // Save to database
      const savedRate = await this.repository.save(rate);
      
      // Audit logging
      await this.auditService.logRateChange(rate);

      return {
        success: true,
        data: savedRate,
        errors: []
      };

    } catch (error) {
      return {
        success: false,
        errors: [{ code: 'SYSTEM_ERROR', message: 'System error occurred' }],
        data: null
      };
    }
  }
}
```

## 8. Integration Points

### 8.1 Payroll System Integration
```typescript
interface PayrollIntegration {
  // Calculate monthly payroll for hourly employee
  calculateMonthlyPayroll(
    employeeId: string,
    month: string,
    actualHours: number
  ): Promise<PayrollCalculation>;

  // Get effective hourly rate for date
  getEffectiveHourlyRate(
    employeeId: string,
    date: string
  ): Promise<HourlyRate>;

  // Bulk calculation for payroll processing
  calculateBulkPayroll(
    employees: string[],
    month: string
  ): Promise<PayrollCalculation[]>;
}
```

### 8.2 Time Tracking Integration
```typescript
interface TimeTrackingIntegration {
  // Import actual hours worked
  importActualHours(
    employeeId: string,
    startDate: string,
    endDate: string
  ): Promise<TimeEntry[]>;

  // Calculate overtime hours
  calculateOvertimeHours(
    timeEntries: TimeEntry[],
    standardHours: number
  ): OvertimeCalculation;
}
```

## 9. Security Considerations

### 9.1 Access Control
```typescript
enum Permission {
  VIEW_HOURLY_RATES = 'hourly_rates:view',
  CREATE_HOURLY_RATES = 'hourly_rates:create',
  UPDATE_HOURLY_RATES = 'hourly_rates:update',
  DELETE_HOURLY_RATES = 'hourly_rates:delete',
  APPROVE_HOURLY_RATES = 'hourly_rates:approve',
  CONFIGURE_SYSTEM = 'system:configure'
}

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  'hr_manager': [
    Permission.VIEW_HOURLY_RATES,
    Permission.CREATE_HOURLY_RATES,
    Permission.UPDATE_HOURLY_RATES,
    Permission.APPROVE_HOURLY_RATES
  ],
  'payroll_clerk': [
    Permission.VIEW_HOURLY_RATES,
    Permission.CREATE_HOURLY_RATES
  ],
  'system_admin': [
    ...Object.values(Permission)
  ]
};
```

### 9.2 Data Encryption
```typescript
interface EncryptionConfig {
  // Encrypt sensitive rate data
  encryptHourlyRate(rate: HourlyRate): EncryptedHourlyRate;
  
  // Decrypt for authorized users
  decryptHourlyRate(
    encryptedRate: EncryptedHourlyRate,
    userPermissions: Permission[]
  ): HourlyRate;
  
  // Audit trail encryption
  encryptAuditLog(log: AuditLogEntry): EncryptedAuditLog;
}
```

## 10. Testing Scenarios

### 10.1 Unit Tests
```typescript
describe('HourlyRateCalculations', () => {
  test('should calculate correct monthly equivalent for standard hours', () => {
    const result = calculateMonthlyEquivalent(25.00, 176);
    expect(result.totalMonthlyEquivalent).toBe(4400.00);
  });

  test('should calculate overtime correctly with 1.5x multiplier', () => {
    const result = calculateMonthlyEquivalent(25.00, 176, 20, 1.5);
    expect(result.overtimePay).toBe(750.00);
    expect(result.totalMonthlyEquivalent).toBe(5150.00);
  });

  test('should validate minimum wage compliance', () => {
    const validation = validateHourlyWage(15.00);
    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain('Below minimum wage');
  });
});
```

### 10.2 Integration Tests
```typescript
describe('HourlyRateService Integration', () => {
  test('should save hourly rate with audit trail', async () => {
    const rate = createTestHourlyRate();
    const result = await hourlyRateService.saveRate(rate);
    
    expect(result.success).toBe(true);
    
    const auditLogs = await auditService.getLogsForEmployee(rate.employeeId);
    expect(auditLogs).toHaveLength(1);
    expect(auditLogs[0].action).toBe('RATE_CREATED');
  });

  test('should prevent concurrent modifications', async () => {
    const rate = createTestHourlyRate();
    
    // Simulate concurrent updates
    const [result1, result2] = await Promise.all([
      hourlyRateService.updateRate(rate.id, { hourlyWage: 30.00 }),
      hourlyRateService.updateRate(rate.id, { hourlyWage: 35.00 })
    ]);
    
    expect([result1.success, result2.success]).toContain(false);
  });
});
```

### 10.3 User Acceptance Tests
```typescript
describe('User Acceptance Tests', () => {
  test('HR Manager can create and approve hourly rates', async () => {
    // Login as HR Manager
    await loginAs('hr_manager');
    
    // Navigate to hourly rate management
    await navigateTo('/hourly-rates');
    
    // Create new rate
    await fillForm({
      employeeId: 'EMP001',
      hourlyWage: 25.50,
      effectiveDate: '2024-01-01'
    });
    
    // Submit and approve
    await clickButton('Save');
    await clickButton('Approve');
    
    // Verify rate is active
    const rate = await getHourlyRate('EMP001');
    expect(rate.status).toBe('active');
    expect(rate.hourlyWage).toBe(25.50);
  });
});
```

## 11. Performance Considerations

### 11.1 Calculation Optimization
```typescript
// Memoized calculation for real-time updates
const useMemoizedCalculation = (
  hourlyRate: number,
  standardHours: number,
  overtimeHours: number,
  overtimeMultiplier: number
) => {
  return useMemo(() => {
    return calculateMonthlyEquivalent(
      hourlyRate,
      standardHours,
      overtimeHours,
      overtimeMultiplier
    );
  }, [hourlyRate, standardHours, overtimeHours, overtimeMultiplier]);
};
```

### 11.2 Database Optimization
```sql
-- Indexes for performance
CREATE INDEX idx_hourly_rates_employee_effective ON hourly_rates(employee_id, effective_date DESC);
CREATE INDEX idx_hourly_rates_status ON hourly_rates(status) WHERE status = 'active';
CREATE INDEX idx_hourly_rates_approval ON hourly_rates(approved_by, approved_at) WHERE approved_by IS NOT NULL;
```

## 12. Deployment Considerations

### 12.1 Database Migration
```sql
-- Create hourly_rates table
CREATE TABLE hourly_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id),
  hourly_wage DECIMAL(10,2) NOT NULL CHECK (hourly_wage >= 18.00),
  effective_date DATE NOT NULL,
  end_date DATE,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'expired', 'suspended')),
  notes TEXT,
  version INTEGER DEFAULT 1,
  CONSTRAINT no_overlapping_rates EXCLUDE USING gist (
    employee_id WITH =,
    daterange(effective_date, COALESCE(end_date, 'infinity'::date), '[)') WITH &&
  ) WHERE (status = 'active')
);
```

### 12.2 Configuration Management
```typescript
interface SystemConfiguration {
  defaultStandardHours: number;
  minimumWage: number;
  maximumWage: number;
  overtimeMultipliers: OvertimeMultiplier[];
  approvalWorkflow: boolean;
  auditRetentionDays: number;
}

const DEFAULT_CONFIG: SystemConfiguration = {
  defaultStandardHours: 176,
  minimumWage: 18.00,
  maximumWage: 500.00,
  overtimeMultipliers: OVERTIME_MULTIPLIERS,
  approvalWorkflow: true,
  auditRetentionDays: 2555 // 7 years
};
```

## 13. Monitoring and Alerting

### 13.1 System Metrics
```typescript
interface HourlyRateMetrics {
  totalActiveRates: number;
  averageHourlyWage: number;
  pendingApprovals: number;
  rateChangesLastMonth: number;
  complianceViolations: number;
  systemPerformance: {
    calculationLatency: number;
    errorRate: number;
    uptime: number;
  };
}
```

### 13.2 Alerts Configuration
```typescript
const ALERT_THRESHOLDS = {
  belowMinimumWage: {
    threshold: 18.00,
    severity: 'critical',
    action: 'block_save'
  },
  significantIncrease: {
    threshold: 50, // percentage
    severity: 'warning',
    action: 'require_additional_approval'
  },
  calculationLatency: {
    threshold: 500, // milliseconds
    severity: 'warning',
    action: 'log_performance_issue'
  }
};
```

---

## Conclusion

This technical specification provides a comprehensive framework for implementing a robust hourly rate management system that meets Saudi labor law requirements, ensures data integrity, and provides excellent user experience. The system is designed to be scalable, secure, and maintainable while providing real-time calculations and comprehensive audit capabilities.

**Key Implementation Priorities:**
1. Core calculation engine with real-time updates
2. Comprehensive validation and error handling
3. Saudi labor law compliance features
4. Secure data handling and audit trails
5. Intuitive user interface with bilingual support

**Estimated Implementation Timeline:**
- Phase 1 (Core Features): 4-6 weeks
- Phase 2 (Advanced Features): 2-3 weeks
- Phase 3 (Integration & Testing): 2-3 weeks
- Total: 8-12 weeks

This specification serves as the foundation for developing a world-class hourly rate management system that will enhance payroll accuracy and compliance while providing exceptional user experience.