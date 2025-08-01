import { AuditLogEntry, ComplianceRule, ComplianceViolation } from '../types/attendance';

export class ComplianceService {
  private static readonly AUDIT_LOG_KEY = 'audit_log';
  private static readonly COMPLIANCE_RULES_KEY = 'compliance_rules';
  private static readonly VIOLATIONS_KEY = 'compliance_violations';

  /**
   * Initialize default compliance rules
   */
  static initializeComplianceRules(): void {
    const existingRules = this.getComplianceRules();
    if (existingRules.length === 0) {
      const defaultRules: ComplianceRule[] = [
        {
          id: 'max_daily_hours',
          name: 'Maximum Daily Hours',
          description: 'Employees cannot work more than 12 hours per day',
          ruleType: 'daily_hours',
          parameters: { maxHours: 12 },
          isActive: true,
          severity: 'high',
          createdAt: new Date()
        },
        {
          id: 'max_weekly_hours',
          name: 'Maximum Weekly Hours',
          description: 'Employees cannot work more than 48 hours per week',
          ruleType: 'weekly_hours',
          parameters: { maxHours: 48 },
          isActive: true,
          severity: 'critical',
          createdAt: new Date()
        },
        {
          id: 'min_break_time',
          name: 'Minimum Break Time',
          description: 'Employees must take at least 30 minutes break for shifts over 6 hours',
          ruleType: 'break_time',
          parameters: { minBreakMinutes: 30, triggerHours: 6 },
          isActive: true,
          severity: 'medium',
          createdAt: new Date()
        },
        {
          id: 'consecutive_days',
          name: 'Maximum Consecutive Days',
          description: 'Employees cannot work more than 6 consecutive days',
          ruleType: 'consecutive_days',
          parameters: { maxDays: 6 },
          isActive: true,
          severity: 'high',
          createdAt: new Date()
        }
      ];

      localStorage.setItem(this.COMPLIANCE_RULES_KEY, JSON.stringify(defaultRules));
    }
  }

  /**
   * Log audit trail for data changes
   * @param tableName - Database table name
   * @param recordId - Record identifier
   * @param action - Type of action performed
   * @param oldValues - Previous values
   * @param newValues - New values
   * @param userId - User making change
   * @returns Promise<void>
   */
  static async logAuditTrail(
    tableName: string,
    recordId: string,
    action: 'INSERT' | 'UPDATE' | 'DELETE',
    oldValues?: any,
    newValues?: any,
    userId?: string
  ): Promise<void> {
    try {
      const auditEntry: AuditLogEntry = {
        id: this.generateId(),
        tableName,
        recordId,
        action,
        oldValues,
        newValues,
        changedBy: userId,
        changedAt: new Date(),
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent
      };

      const auditLog = this.getAuditLog();
      auditLog.push(auditEntry);
      
      // Keep only recent entries (last 10000)
      if (auditLog.length > 10000) {
        auditLog.splice(0, auditLog.length - 10000);
      }

      localStorage.setItem(this.AUDIT_LOG_KEY, JSON.stringify(auditLog));

    } catch (error) {
      console.error('Audit logging failed:', error);
    }
  }

  /**
   * Check compliance rules against attendance data
   * @param employeeId - Employee ID
   * @param date - Date to check
   * @returns Promise<ComplianceViolation[]>
   */
  static async checkCompliance(employeeId: string, date: string): Promise<ComplianceViolation[]> {
    try {
      const rules = this.getComplianceRules().filter(r => r.isActive);
      const violations: ComplianceViolation[] = [];

      for (const rule of rules) {
        const violation = await this.checkRule(rule, employeeId, date);
        if (violation) {
          violations.push(violation);
        }
      }

      // Save violations
      if (violations.length > 0) {
        const existingViolations = this.getComplianceViolations();
        existingViolations.push(...violations);
        localStorage.setItem(this.VIOLATIONS_KEY, JSON.stringify(existingViolations));
      }

      return violations;

    } catch (error) {
      console.error('Compliance check failed:', error);
      return [];
    }
  }

  /**
   * Generate compliance report for audit
   * @param startDate - Report start date
   * @param endDate - Report end date
   * @param ruleTypes - Types of rules to include
   * @returns Promise<ComplianceReport>
   */
  static async generateComplianceReport(
    startDate: string, 
    endDate: string, 
    ruleTypes?: string[]
  ): Promise<{
    period: { startDate: string; endDate: string };
    summary: {
      totalViolations: number;
      openViolations: number;
      resolvedViolations: number;
      complianceRate: number;
    };
    violationsByRule: Array<{
      ruleName: string;
      count: number;
      severity: string;
    }>;
    violationsBySeverity: Array<{
      severity: string;
      count: number;
    }>;
    recommendations: string[];
  }> {
    try {
      const violations = this.getComplianceViolations().filter(v => {
        const violationDate = new Date(v.violationDate);
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (violationDate < start || violationDate > end) return false;
        if (ruleTypes && ruleTypes.length > 0) {
          const rule = this.getComplianceRules().find(r => r.id === v.ruleId);
          return rule && ruleTypes.includes(rule.ruleType);
        }
        return true;
      });

      const rules = this.getComplianceRules();
      const totalViolations = violations.length;
      const openViolations = violations.filter(v => v.status === 'open').length;
      const resolvedViolations = violations.filter(v => v.status === 'resolved').length;
      const complianceRate = totalViolations > 0 ? ((totalViolations - openViolations) / totalViolations) * 100 : 100;

      const violationsByRule = rules.map(rule => ({
        ruleName: rule.name,
        count: violations.filter(v => v.ruleId === rule.id).length,
        severity: rule.severity
      })).filter(item => item.count > 0);

      const violationsBySeverity = ['low', 'medium', 'high', 'critical'].map(severity => ({
        severity,
        count: violations.filter(v => v.severity === severity).length
      })).filter(item => item.count > 0);

      const recommendations = this.generateRecommendations(violations, rules);

      return {
        period: { startDate, endDate },
        summary: {
          totalViolations,
          openViolations,
          resolvedViolations,
          complianceRate: Number(complianceRate.toFixed(2))
        },
        violationsByRule,
        violationsBySeverity,
        recommendations
      };

    } catch (error) {
      console.error('Generate compliance report failed:', error);
      throw error;
    }
  }

  /**
   * Get audit trail for specific record
   * @param tableName - Table name
   * @param recordId - Record ID
   * @returns Promise<AuditLogEntry[]>
   */
  static async getAuditTrail(tableName: string, recordId: string): Promise<AuditLogEntry[]> {
    try {
      const auditLog = this.getAuditLog();
      return auditLog
        .filter(entry => entry.tableName === tableName && entry.recordId === recordId)
        .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());

    } catch (error) {
      console.error('Get audit trail failed:', error);
      return [];
    }
  }

  /**
   * Monitor real-time compliance status
   * @returns Promise<ComplianceStatus>
   */
  static async getComplianceStatus(): Promise<{
    openViolations: number;
    criticalViolations: number;
    complianceRate: number;
    recentViolations: ComplianceViolation[];
    trendDirection: 'improving' | 'stable' | 'declining';
  }> {
    try {
      const violations = this.getComplianceViolations();
      const openViolations = violations.filter(v => v.status === 'open').length;
      const criticalViolations = violations.filter(v => v.severity === 'critical' && v.status === 'open').length;
      
      const totalChecks = violations.length + 1000; // Simulate total compliance checks
      const complianceRate = ((totalChecks - openViolations) / totalChecks) * 100;

      const recentViolations = violations
        .filter(v => {
          const violationDate = new Date(v.violationDate);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return violationDate >= weekAgo;
        })
        .slice(0, 10);

      // Simple trend calculation
      const thisWeekViolations = recentViolations.length;
      const lastWeekViolations = violations.filter(v => {
        const violationDate = new Date(v.violationDate);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return violationDate >= twoWeeksAgo && violationDate < weekAgo;
      }).length;

      let trendDirection: 'improving' | 'stable' | 'declining' = 'stable';
      if (thisWeekViolations < lastWeekViolations) trendDirection = 'improving';
      else if (thisWeekViolations > lastWeekViolations) trendDirection = 'declining';

      return {
        openViolations,
        criticalViolations,
        complianceRate: Number(complianceRate.toFixed(2)),
        recentViolations,
        trendDirection
      };

    } catch (error) {
      console.error('Get compliance status failed:', error);
      throw error;
    }
  }

  // Private helper methods
  private static async checkRule(rule: ComplianceRule, employeeId: string, date: string): Promise<ComplianceViolation | null> {
    // Implementation would depend on rule type
    // This is a simplified example
    return null;
  }

  private static generateRecommendations(violations: ComplianceViolation[], rules: ComplianceRule[]): string[] {
    const recommendations: string[] = [];

    const criticalViolations = violations.filter(v => v.severity === 'critical');
    if (criticalViolations.length > 0) {
      recommendations.push('Address critical violations immediately to ensure regulatory compliance');
    }

    const frequentRules = violations.reduce((acc, v) => {
      acc[v.ruleId] = (acc[v.ruleId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(frequentRules).forEach(([ruleId, count]) => {
      if (count > 5) {
        const rule = rules.find(r => r.id === ruleId);
        if (rule) {
          recommendations.push(`Review and strengthen controls for: ${rule.name}`);
        }
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('Compliance status is good - continue monitoring');
    }

    return recommendations;
  }

  private static getAuditLog(): AuditLogEntry[] {
    try {
      const log = localStorage.getItem(this.AUDIT_LOG_KEY);
      return log ? JSON.parse(log) : [];
    } catch (error) {
      console.error('Error loading audit log:', error);
      return [];
    }
  }

  private static getComplianceRules(): ComplianceRule[] {
    try {
      const rules = localStorage.getItem(this.COMPLIANCE_RULES_KEY);
      return rules ? JSON.parse(rules) : [];
    } catch (error) {
      console.error('Error loading compliance rules:', error);
      return [];
    }
  }

  private static getComplianceViolations(): ComplianceViolation[] {
    try {
      const violations = localStorage.getItem(this.VIOLATIONS_KEY);
      return violations ? JSON.parse(violations) : [];
    } catch (error) {
      console.error('Error loading compliance violations:', error);
      return [];
    }
  }

  private static async getClientIP(): Promise<string> {
    // In a real implementation, this would get the actual client IP
    return '192.168.1.100';
  }

  private static generateId(): string {
    return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}