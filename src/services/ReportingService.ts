import { AttendanceReport, ReportTemplate, GeneratedReport } from '../types/attendance';
import { AttendanceService } from './AttendanceService';
import { PayrollService } from './PayrollService';
import { ComplianceService } from './ComplianceService';

export class ReportingService {
  private static readonly REPORT_TEMPLATES_KEY = 'report_templates';
  private static readonly GENERATED_REPORTS_KEY = 'generated_reports';

  /**
   * Initialize default report templates
   */
  static initializeReportTemplates(): void {
    const existingTemplates = this.getReportTemplates();
    if (existingTemplates.length === 0) {
      const defaultTemplates: ReportTemplate[] = [
        {
          id: 'attendance_summary',
          name: 'Attendance Summary Report',
          description: 'Comprehensive attendance report with hours and statistics',
          reportType: 'attendance',
          parameters: {
            includeOvertimeAnalysis: true,
            includeAbsenceDetails: true,
            groupByDepartment: true
          },
          isActive: true,
          createdBy: 'system',
          createdAt: new Date()
        },
        {
          id: 'payroll_summary',
          name: 'Payroll Summary Report',
          description: 'Detailed payroll calculations and summaries',
          reportType: 'payroll',
          parameters: {
            includeTaxBreakdown: true,
            includeDeductions: true,
            groupByDepartment: false
          },
          isActive: true,
          createdBy: 'system',
          createdAt: new Date()
        },
        {
          id: 'compliance_audit',
          name: 'Compliance Audit Report',
          description: 'Compliance violations and audit trail report',
          reportType: 'compliance',
          parameters: {
            includeSeverityBreakdown: true,
            includeRecommendations: true,
            includeAuditTrail: true
          },
          isActive: true,
          createdBy: 'system',
          createdAt: new Date()
        }
      ];

      localStorage.setItem(this.REPORT_TEMPLATES_KEY, JSON.stringify(defaultTemplates));
    }
  }

  /**
   * Generate attendance summary report for date range
   * @param startDate - Report start date
   * @param endDate - Report end date
   * @param departmentId - Optional department filter
   * @param employees - Employee list with details
   * @returns Promise<AttendanceReport[]>
   */
  static async generateAttendanceReport(
    startDate: string, 
    endDate: string, 
    departmentId?: string,
    employees: Array<{id: string, name: string, department: string}> = []
  ): Promise<AttendanceReport[]> {
    try {
      const reports: AttendanceReport[] = [];

      for (const employee of employees) {
        if (departmentId && employee.department !== departmentId) continue;

        const stats = AttendanceService.calculateAttendanceStats(employee.id, startDate, endDate);
        
        const report: AttendanceReport = {
          employeeId: employee.id,
          employeeName: employee.name,
          department: employee.department,
          totalHours: stats.totalHours,
          regularHours: stats.regularHours,
          overtimeHours: stats.overtimeHours,
          absentDays: stats.absentDays,
          lateDays: this.calculateLateDays(employee.id, startDate, endDate),
          attendanceRate: stats.attendanceRate
        };

        reports.push(report);
      }

      return reports.sort((a, b) => a.employeeName.localeCompare(b.employeeName));

    } catch (error) {
      console.error('Generate attendance report failed:', error);
      return [];
    }
  }

  /**
   * Generate overtime analysis report
   * @param startDate - Analysis start date
   * @param endDate - Analysis end date
   * @param employees - Employee list
   * @returns Promise<OvertimeAnalysis>
   */
  static async generateOvertimeReport(
    startDate: string, 
    endDate: string,
    employees: Array<{id: string, name: string, hourlyRate: number}> = []
  ): Promise<{
    period: { startDate: string; endDate: string };
    summary: {
      totalOvertimeHours: number;
      totalOvertimeCost: number;
      averageOvertimePerEmployee: number;
      employeesWithOvertime: number;
    };
    employeeBreakdown: Array<{
      employeeId: string;
      employeeName: string;
      overtimeHours: number;
      overtimeCost: number;
      overtimeRate: number;
    }>;
    recommendations: string[];
  }> {
    try {
      const employeeBreakdown = [];
      let totalOvertimeHours = 0;
      let totalOvertimeCost = 0;
      let employeesWithOvertime = 0;

      for (const employee of employees) {
        const stats = AttendanceService.calculateAttendanceStats(employee.id, startDate, endDate);
        
        if (stats.overtimeHours > 0) {
          employeesWithOvertime++;
          const overtimeCost = stats.overtimeHours * employee.hourlyRate * 1.5;
          totalOvertimeHours += stats.overtimeHours;
          totalOvertimeCost += overtimeCost;

          employeeBreakdown.push({
            employeeId: employee.id,
            employeeName: employee.name,
            overtimeHours: stats.overtimeHours,
            overtimeCost: Number(overtimeCost.toFixed(2)),
            overtimeRate: employee.hourlyRate * 1.5
          });
        }
      }

      const averageOvertimePerEmployee = employees.length > 0 ? totalOvertimeHours / employees.length : 0;

      // Generate recommendations
      const recommendations = [];
      if (averageOvertimePerEmployee > 10) {
        recommendations.push('Consider hiring additional staff to reduce overtime dependency');
      }
      if (employeesWithOvertime / employees.length > 0.5) {
        recommendations.push('More than 50% of employees are working overtime - review workload distribution');
      }
      if (totalOvertimeCost > 50000) {
        recommendations.push('High overtime costs detected - analyze cost-benefit of additional hiring');
      }

      return {
        period: { startDate, endDate },
        summary: {
          totalOvertimeHours: Number(totalOvertimeHours.toFixed(2)),
          totalOvertimeCost: Number(totalOvertimeCost.toFixed(2)),
          averageOvertimePerEmployee: Number(averageOvertimePerEmployee.toFixed(2)),
          employeesWithOvertime
        },
        employeeBreakdown: employeeBreakdown.sort((a, b) => b.overtimeHours - a.overtimeHours),
        recommendations
      };

    } catch (error) {
      console.error('Generate overtime report failed:', error);
      throw error;
    }
  }

  /**
   * Generate department productivity report
   * @param departmentId - Department ID
   * @param period - Reporting period
   * @param employees - Department employees
   * @returns Promise<ProductivityReport>
   */
  static async generateProductivityReport(
    departmentId: string, 
    period: string,
    employees: Array<{id: string, name: string, hourlyRate: number}> = []
  ): Promise<{
    department: string;
    period: string;
    metrics: {
      totalEmployees: number;
      averageHoursPerEmployee: number;
      attendanceRate: number;
      productivityScore: number;
    };
    topPerformers: Array<{
      employeeId: string;
      employeeName: string;
      hoursWorked: number;
      attendanceRate: number;
      productivityScore: number;
    }>;
    insights: string[];
  }> {
    try {
      const [startDate, endDate] = this.parsePeriod(period);
      const employeeStats = [];
      let totalHours = 0;
      let totalAttendanceRate = 0;

      for (const employee of employees) {
        const stats = AttendanceService.calculateAttendanceStats(employee.id, startDate, endDate);
        totalHours += stats.totalHours;
        totalAttendanceRate += stats.attendanceRate;

        employeeStats.push({
          employeeId: employee.id,
          employeeName: employee.name,
          hoursWorked: stats.totalHours,
          attendanceRate: stats.attendanceRate,
          productivityScore: this.calculateProductivityScore(stats)
        });
      }

      const averageHoursPerEmployee = employees.length > 0 ? totalHours / employees.length : 0;
      const averageAttendanceRate = employees.length > 0 ? totalAttendanceRate / employees.length : 0;
      const productivityScore = this.calculateDepartmentProductivityScore(employeeStats);

      const topPerformers = employeeStats
        .sort((a, b) => b.productivityScore - a.productivityScore)
        .slice(0, 5);

      const insights = this.generateProductivityInsights(employeeStats, averageAttendanceRate);

      return {
        department: departmentId,
        period,
        metrics: {
          totalEmployees: employees.length,
          averageHoursPerEmployee: Number(averageHoursPerEmployee.toFixed(2)),
          attendanceRate: Number(averageAttendanceRate.toFixed(2)),
          productivityScore: Number(productivityScore.toFixed(2))
        },
        topPerformers,
        insights
      };

    } catch (error) {
      console.error('Generate productivity report failed:', error);
      throw error;
    }
  }

  /**
   * Export report to various formats
   * @param reportData - Report data
   * @param format - Export format (PDF, Excel, CSV)
   * @param templateId - Report template ID
   * @returns Promise<string> - File content as string
   */
  static async exportReport(
    reportData: any, 
    format: 'pdf' | 'excel' | 'csv', 
    templateId?: string
  ): Promise<string> {
    try {
      switch (format) {
        case 'csv':
          return this.exportToCSV(reportData);
        case 'excel':
          return this.exportToExcel(reportData);
        case 'pdf':
          return this.exportToPDF(reportData, templateId);
        default:
          throw new Error('Unsupported export format');
      }

    } catch (error) {
      console.error('Export report failed:', error);
      throw error;
    }
  }

  /**
   * Schedule automatic report generation
   * @param templateId - Report template ID
   * @param schedule - Cron-like schedule expression
   * @param recipients - Email recipients
   * @returns Promise<void>
   */
  static async scheduleReport(
    templateId: string, 
    schedule: string, 
    recipients: string[]
  ): Promise<void> {
    try {
      // In a real implementation, this would integrate with a job scheduler
      console.log(`Report scheduled: ${templateId}, Schedule: ${schedule}, Recipients: ${recipients.join(', ')}`);
      
      // Store schedule configuration
      const scheduleConfig = {
        templateId,
        schedule,
        recipients,
        createdAt: new Date()
      };

      // Save to local storage for demo
      const schedules = JSON.parse(localStorage.getItem('scheduled_reports') || '[]');
      schedules.push(scheduleConfig);
      localStorage.setItem('scheduled_reports', JSON.stringify(schedules));

    } catch (error) {
      console.error('Schedule report failed:', error);
      throw error;
    }
  }

  // Private helper methods
  private static calculateLateDays(employeeId: string, startDate: string, endDate: string): number {
    // Simplified calculation - in real implementation would check against schedule
    const records = AttendanceService.getEmployeeAttendance(employeeId, startDate, endDate);
    return records.filter(r => {
      return r.lateArrival > 0; // Check if employee was late
    }).length;
  }

  private static calculateProductivityScore(stats: any): number {
    // Simple productivity calculation based on attendance and hours
    const attendanceWeight = 0.6;
    const hoursWeight = 0.4;
    
    const attendanceScore = Math.min(stats.attendanceRate, 100);
    const hoursScore = Math.min((stats.averageHoursPerDay / 8) * 100, 100);
    
    return (attendanceScore * attendanceWeight) + (hoursScore * hoursWeight);
  }

  private static calculateDepartmentProductivityScore(employeeStats: any[]): number {
    if (employeeStats.length === 0) return 0;
    const totalScore = employeeStats.reduce((sum, emp) => sum + emp.productivityScore, 0);
    return totalScore / employeeStats.length;
  }

  private static generateProductivityInsights(employeeStats: any[], averageAttendanceRate: number): string[] {
    const insights = [];

    if (averageAttendanceRate > 95) {
      insights.push('Excellent attendance rate - department is performing well');
    } else if (averageAttendanceRate < 85) {
      insights.push('Low attendance rate - investigate causes and implement improvement measures');
    }

    const lowPerformers = employeeStats.filter(emp => emp.productivityScore < 70).length;
    if (lowPerformers > 0) {
      insights.push(`${lowPerformers} employees have low productivity scores - consider additional training or support`);
    }

    const highPerformers = employeeStats.filter(emp => emp.productivityScore > 90).length;
    if (highPerformers > 0) {
      insights.push(`${highPerformers} employees are high performers - consider recognition or advancement opportunities`);
    }

    return insights;
  }

  private static parsePeriod(period: string): [string, string] {
    // Simple period parsing - in real implementation would handle various formats
    const today = new Date();
    let startDate: Date;
    let endDate: Date = new Date(today);

    switch (period) {
      case 'week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 3);
        break;
      default:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
    }

    return [
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    ];
  }

  private static exportToCSV(reportData: any): string {
    if (Array.isArray(reportData)) {
      if (reportData.length === 0) return '';
      
      const headers = Object.keys(reportData[0]);
      const rows = reportData.map(item => 
        headers.map(header => `"${String(item[header]).replace(/"/g, '""')}"`).join(',')
      );
      
      return [headers.join(','), ...rows].join('\n');
    }
    
    return JSON.stringify(reportData, null, 2);
  }

  private static exportToExcel(reportData: any): string {
    // Simplified Excel export - in real implementation would use a library like xlsx
    return this.exportToCSV(reportData);
  }

  private static exportToPDF(reportData: any, templateId?: string): string {
    // Simplified PDF export - in real implementation would use a PDF library
    const template = templateId ? this.getReportTemplates().find(t => t.id === templateId) : null;
    
    let content = `ATTENDANCE REPORT\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Template: ${template?.name || 'Default'}\n\n`;
    
    if (Array.isArray(reportData)) {
      reportData.forEach((item, index) => {
        content += `Record ${index + 1}:\n`;
        Object.entries(item).forEach(([key, value]) => {
          content += `  ${key}: ${value}\n`;
        });
        content += '\n';
      });
    } else {
      content += JSON.stringify(reportData, null, 2);
    }
    
    return content;
  }

  private static getReportTemplates(): ReportTemplate[] {
    try {
      const templates = localStorage.getItem(this.REPORT_TEMPLATES_KEY);
      return templates ? JSON.parse(templates) : [];
    } catch (error) {
      console.error('Error loading report templates:', error);
      return [];
    }
  }

  private static getGeneratedReports(): GeneratedReport[] {
    try {
      const reports = localStorage.getItem(this.GENERATED_REPORTS_KEY);
      return reports ? JSON.parse(reports) : [];
    } catch (error) {
      console.error('Error loading generated reports:', error);
      return [];
    }
  }

  private static generateId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}