import { PayrollPeriod, PayrollCalculation } from '../types/attendance';
import { AttendanceService } from './AttendanceService';
import { LeaveService } from './LeaveService';
import { ATTENDANCE_CONFIG } from '../types/attendance';

export class PayrollService {
  private static readonly PAYROLL_PERIODS_KEY = 'payroll_periods';
  private static readonly PAYROLL_CALCULATIONS_KEY = 'payroll_calculations';

  /**
   * Create new payroll period
   * @param periodData - Payroll period information
   * @returns Promise<PayrollPeriod>
   */
  static async createPayrollPeriod(
    periodData: Omit<PayrollPeriod, 'id' | 'totalEmployees' | 'totalHours' | 'totalAmount' | 'createdAt' | 'updatedAt'>
  ): Promise<PayrollPeriod> {
    try {
      // Validate period dates
      const startDate = new Date(periodData.startDate);
      const endDate = new Date(periodData.endDate);
      const payDate = new Date(periodData.payDate);

      if (startDate >= endDate) {
        throw new Error('End date must be after start date');
      }

      if (payDate < endDate) {
        throw new Error('Pay date must be after period end date');
      }

      // Check for overlapping periods
      const existingPeriods = this.getPayrollPeriods();
      const overlapping = existingPeriods.some(period => {
        const pStart = new Date(period.startDate);
        const pEnd = new Date(period.endDate);
        return (startDate <= pEnd && endDate >= pStart);
      });

      if (overlapping) {
        throw new Error('Overlapping payroll period exists');
      }

      const payrollPeriod: PayrollPeriod = {
        ...periodData,
        id: this.generateId(),
        totalEmployees: 0,
        totalHours: 0,
        totalAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const periods = this.getPayrollPeriods();
      periods.push(payrollPeriod);
      localStorage.setItem(this.PAYROLL_PERIODS_KEY, JSON.stringify(periods));

      console.log('Payroll period created:', payrollPeriod);
      return payrollPeriod;

    } catch (error) {
      console.error('Create payroll period failed:', error);
      throw error;
    }
  }

  /**
   * Calculate payroll for all employees in period
   * @param payrollPeriodId - Payroll period ID
   * @param employees - List of employees to process
   * @returns Promise<PayrollCalculation[]>
   */
  static async calculatePayroll(
    payrollPeriodId: string,
    employees: Array<{id: string, name: string, hourlyRate: number, department: string}>
  ): Promise<PayrollCalculation[]> {
    try {
      const periods = this.getPayrollPeriods();
      const period = periods.find(p => p.id === payrollPeriodId);
      
      if (!period) {
        throw new Error('Payroll period not found');
      }

      const calculations: PayrollCalculation[] = [];

      for (const employee of employees) {
        const calculation = await this.calculateEmployeePay(
          employee.id,
          period.startDate,
          period.endDate,
          employee.hourlyRate
        );

        calculation.payrollPeriodId = payrollPeriodId;
        calculations.push(calculation);
      }

      // Save calculations
      const existingCalculations = this.getPayrollCalculations();
      const updatedCalculations = existingCalculations.filter(c => c.payrollPeriodId !== payrollPeriodId);
      updatedCalculations.push(...calculations);
      localStorage.setItem(this.PAYROLL_CALCULATIONS_KEY, JSON.stringify(updatedCalculations));

      // Update period totals
      const periodIndex = periods.findIndex(p => p.id === payrollPeriodId);
      periods[periodIndex] = {
        ...period,
        totalEmployees: calculations.length,
        totalHours: calculations.reduce((sum, c) => sum + c.regularHours + c.overtimeHours, 0),
        totalAmount: calculations.reduce((sum, c) => sum + c.grossPay, 0),
        updatedAt: new Date()
      };
      localStorage.setItem(this.PAYROLL_PERIODS_KEY, JSON.stringify(periods));

      console.log('Payroll calculated for period:', payrollPeriodId);
      return calculations;

    } catch (error) {
      console.error('Calculate payroll failed:', error);
      throw error;
    }
  }

  /**
   * Calculate employee pay for specific period
   * @param employeeId - Employee ID
   * @param startDate - Period start
   * @param endDate - Period end
   * @param hourlyRate - Employee hourly rate
   * @returns Promise<PayrollCalculation>
   */
  static async calculateEmployeePay(
    employeeId: string, 
    startDate: string, 
    endDate: string,
    hourlyRate: number
  ): Promise<PayrollCalculation> {
    try {
      // Get attendance records for period
      const attendanceRecords = AttendanceService.getEmployeeAttendance(employeeId, startDate, endDate);

      // Calculate hours
      const regularHours = attendanceRecords.reduce((sum, r) => sum + r.hoursWorked, 0);

      const overtimeHours = attendanceRecords.reduce((sum, r) => sum + r.overtimeHours, 0);

      // Get leave hours
      const leaveRequests = LeaveService.getEmployeeLeaveRequests(employeeId, new Date(startDate).getFullYear());
      const approvedLeave = leaveRequests.filter(r => 
        r.status === 'approved' &&
        new Date(r.startDate) >= new Date(startDate) &&
        new Date(r.endDate) <= new Date(endDate)
      );

      const vacationHours = approvedLeave
        .filter(r => r.leaveTypeId === 'annual')
        .reduce((sum, r) => sum + (r.totalDays * 8), 0);

      const sickHours = approvedLeave
        .filter(r => r.leaveTypeId === 'sick')
        .reduce((sum, r) => sum + (r.totalDays * 8), 0);

      // Calculate pay
      const regularPay = regularHours * hourlyRate;
      const overtimePay = overtimeHours * hourlyRate * ATTENDANCE_CONFIG.OVERTIME_MULTIPLIER;
      const holidayPay = 0; // Calculate based on holiday work
      const bonusAmount = 0; // Calculate based on performance bonuses
      const deductionAmount = 0; // Calculate based on deductions

      const grossPay = regularPay + overtimePay + holidayPay + bonusAmount - deductionAmount;
      const taxAmount = grossPay * ATTENDANCE_CONFIG.TAX_RATE;
      const netPay = grossPay - taxAmount;

      const calculation: PayrollCalculation = {
        id: this.generateId(),
        payrollPeriodId: '', // Will be set by caller
        employeeId,
        regularHours,
        overtimeHours,
        holidayHours: 0,
        sickHours,
        vacationHours,
        regularPay: Number(regularPay.toFixed(2)),
        overtimePay: Number(overtimePay.toFixed(2)),
        holidayPay: Number(holidayPay.toFixed(2)),
        bonusAmount: Number(bonusAmount.toFixed(2)),
        deductionAmount: Number(deductionAmount.toFixed(2)),
        grossPay: Number(grossPay.toFixed(2)),
        taxAmount: Number(taxAmount.toFixed(2)),
        netPay: Number(netPay.toFixed(2)),
        calculationDate: new Date()
      };

      return calculation;

    } catch (error) {
      console.error('Calculate employee pay failed:', error);
      throw error;
    }
  }

  /**
   * Export payroll data for external systems
   * @param payrollPeriodId - Payroll period ID
   * @param format - Export format
   * @returns Promise<string> - Export data as string
   */
  static async exportPayrollData(
    payrollPeriodId: string, 
    format: 'csv' | 'json' | 'xml'
  ): Promise<string> {
    try {
      const calculations = this.getPayrollCalculations().filter(c => c.payrollPeriodId === payrollPeriodId);
      const period = this.getPayrollPeriods().find(p => p.id === payrollPeriodId);

      if (!period) {
        throw new Error('Payroll period not found');
      }

      switch (format) {
        case 'csv':
          return this.exportToCSV(calculations, period);
        case 'json':
          return JSON.stringify({ period, calculations }, null, 2);
        case 'xml':
          return this.exportToXML(calculations, period);
        default:
          throw new Error('Unsupported export format');
      }

    } catch (error) {
      console.error('Export payroll data failed:', error);
      throw error;
    }
  }

  /**
   * Get payroll summary for period
   * @param payrollPeriodId - Payroll period ID
   * @returns PayrollSummary
   */
  static getPayrollSummary(payrollPeriodId: string): {
    period: PayrollPeriod | null;
    calculations: PayrollCalculation[];
    totals: {
      employees: number;
      regularHours: number;
      overtimeHours: number;
      grossPay: number;
      netPay: number;
      taxes: number;
    };
  } {
    const period = this.getPayrollPeriods().find(p => p.id === payrollPeriodId) || null;
    const calculations = this.getPayrollCalculations().filter(c => c.payrollPeriodId === payrollPeriodId);

    const totals = {
      employees: calculations.length,
      regularHours: calculations.reduce((sum, c) => sum + c.regularHours, 0),
      overtimeHours: calculations.reduce((sum, c) => sum + c.overtimeHours, 0),
      grossPay: calculations.reduce((sum, c) => sum + c.grossPay, 0),
      netPay: calculations.reduce((sum, c) => sum + c.netPay, 0),
      taxes: calculations.reduce((sum, c) => sum + c.taxAmount, 0)
    };

    return { period, calculations, totals };
  }

  // Private helper methods
  private static getPayrollPeriods(): PayrollPeriod[] {
    try {
      const periods = localStorage.getItem(this.PAYROLL_PERIODS_KEY);
      return periods ? JSON.parse(periods) : [];
    } catch (error) {
      console.error('Error loading payroll periods:', error);
      return [];
    }
  }

  private static getPayrollCalculations(): PayrollCalculation[] {
    try {
      const calculations = localStorage.getItem(this.PAYROLL_CALCULATIONS_KEY);
      return calculations ? JSON.parse(calculations) : [];
    } catch (error) {
      console.error('Error loading payroll calculations:', error);
      return [];
    }
  }

  private static exportToCSV(calculations: PayrollCalculation[], period: PayrollPeriod): string {
    const headers = [
      'Employee ID', 'Regular Hours', 'Overtime Hours', 'Holiday Hours',
      'Sick Hours', 'Vacation Hours', 'Regular Pay', 'Overtime Pay',
      'Holiday Pay', 'Bonus', 'Deductions', 'Gross Pay', 'Tax', 'Net Pay'
    ];

    const rows = calculations.map(calc => [
      calc.employeeId,
      calc.regularHours,
      calc.overtimeHours,
      calc.holidayHours,
      calc.sickHours,
      calc.vacationHours,
      calc.regularPay,
      calc.overtimePay,
      calc.holidayPay,
      calc.bonusAmount,
      calc.deductionAmount,
      calc.grossPay,
      calc.taxAmount,
      calc.netPay
    ]);

    return [
      `Payroll Period: ${period.name}`,
      `Period: ${period.startDate} to ${period.endDate}`,
      `Pay Date: ${period.payDate}`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  }

  private static exportToXML(calculations: PayrollCalculation[], period: PayrollPeriod): string {
    const xmlCalculations = calculations.map(calc => `
    <calculation>
      <employeeId>${calc.employeeId}</employeeId>
      <regularHours>${calc.regularHours}</regularHours>
      <overtimeHours>${calc.overtimeHours}</overtimeHours>
      <grossPay>${calc.grossPay}</grossPay>
      <netPay>${calc.netPay}</netPay>
    </calculation>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<payroll>
  <period>
    <id>${period.id}</id>
    <name>${period.name}</name>
    <startDate>${period.startDate}</startDate>
    <endDate>${period.endDate}</endDate>
    <payDate>${period.payDate}</payDate>
  </period>
  <calculations>${xmlCalculations}
  </calculations>
</payroll>`;
  }

  private static generateId(): string {
    return `payroll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}