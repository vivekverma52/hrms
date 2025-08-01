import React, { useState, useMemo } from 'react';
import {
  FileText,
  Calendar,
  Download,
  Printer,
  Eye,
  Filter,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  AlertTriangle,
  CheckCircle,
  Building2,
  Award,
  MapPin,
  Phone,
  X,
  Settings
} from 'lucide-react';
import { Employee, AttendanceRecord, ManpowerProject } from '../../types/manpower';
import { calculateFinancials, formatCurrency, formatPercentage } from '../../utils/financialCalculations';

interface AttendanceReportsProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  projects: ManpowerProject[];
  isArabic: boolean;
}

export const AttendanceReports: React.FC<AttendanceReportsProps> = ({
  employees,
  attendance,
  projects,
  isArabic
}) => {
  const [activeReport, setActiveReport] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWeekEnd, setSelectedWeekEnd] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [weeklyReportFormat, setWeeklyReportFormat] = useState<'detailed' | 'summary' | 'financial'>('detailed');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [monthlyReportFormat, setMonthlyReportFormat] = useState<'detailed' | 'summary' | 'financial'>('detailed');
  const [customStartDate, setCustomStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [customEndDate, setCustomEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [customReportType, setCustomReportType] = useState<'attendance' | 'financial' | 'performance' | 'comprehensive'>('comprehensive');
  const [customGroupBy, setCustomGroupBy] = useState<'employee' | 'project' | 'trade' | 'nationality'>('employee');
  const [customIncludeCharts, setCustomIncludeCharts] = useState(true);
  const [customIncludeSignatures, setCustomIncludeSignatures] = useState(true);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  // Calculate daily metrics
  const dailyMetrics = useMemo(() => {
    const dayAttendance = attendance.filter(record => record.date === selectedDate);
    const filteredEmployees = selectedProject === 'all' 
      ? employees 
      : employees.filter(emp => emp.projectId === selectedProject);

    const presentEmployees = dayAttendance.filter(record => 
      filteredEmployees.some(emp => emp.id === record.employeeId)
    );
    const absentEmployees = filteredEmployees.filter(emp => 
      !dayAttendance.some(record => record.employeeId === emp.id)
    );

    let totalHours = 0;
    let regularHours = 0;
    let overtimeHours = 0;
    let totalCost = 0;
    let totalRevenue = 0;

    const employeeDetails = presentEmployees.map(record => {
      const employee = employees.find(emp => emp.id === record.employeeId);
      if (!employee) return null;

      const financials = calculateFinancials(
        record.hoursWorked,
        record.overtime,
        employee.hourlyRate,
        employee.actualRate
      );

      totalHours += record.hoursWorked + record.overtime;
      regularHours += record.hoursWorked;
      overtimeHours += record.overtime;
      totalCost += financials.laborCost;
      totalRevenue += financials.revenue;

      const project = projects.find(p => p.id === employee.projectId);
      const status = record.lateArrival > 0 ? 'late' : 
                   record.earlyDeparture > 0 ? 'early_departure' : 'present';

      return {
        employee,
        attendance: record,
        financials,
        project,
        status
      };
    }).filter(Boolean);

    const attendanceRate = filteredEmployees.length > 0 
      ? (presentEmployees.length / filteredEmployees.length) * 100 
      : 0;
    const grossProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const averageHoursPerEmployee = presentEmployees.length > 0 ? totalHours / presentEmployees.length : 0;
    const productivityIndex = totalHours > 0 ? totalRevenue / totalHours : 0;

    return {
      totalEmployees: filteredEmployees.length,
      presentEmployees: presentEmployees.length,
      absentEmployees: absentEmployees.length,
      attendanceRate,
      totalHours,
      regularHours,
      overtimeHours,
      totalCost,
      totalRevenue,
      grossProfit,
      profitMargin,
      averageHoursPerEmployee,
      productivityIndex,
      employeeDetails,
      absentList: absentEmployees
    };
  }, [selectedDate, selectedProject, employees, attendance, projects]);

  // Generate comprehensive daily report
  const generateDailyReport = () => {
    const reportData = {
      date: selectedDate,
      project: selectedProject === 'all' ? 'All Projects' : projects.find(p => p.id === selectedProject)?.name,
      metrics: dailyMetrics,
      generatedAt: new Date().toLocaleString(),
      generatedBy: 'HRMS Attendance System'
    };

    setGeneratedReport(reportData);

    // Generate report content
    const reportContent = generateReportContent(reportData);
    
    // Download the report
    downloadReport(reportContent, `daily_attendance_report_${selectedDate}.txt`);
    
    alert(isArabic ? 'تم إنشاء التقرير اليومي بنجاح!' : 'Daily report generated successfully!');
  };

  const generateReportContent = (data: any): string => {
    let content = '';
    content += `HRMS - DAILY ATTENDANCE REPORT\n`;
    content += `${'='.repeat(70)}\n\n`;
    content += `Date: ${new Date(data.date).toLocaleDateString()}\n`;
    content += `Project Filter: ${data.project}\n`;
    content += `Generated: ${data.generatedAt}\n`;
    content += `Generated By: ${data.generatedBy}\n\n`;

    content += `EXECUTIVE SUMMARY:\n`;
    content += `${'='.repeat(40)}\n`;
    content += `Total Employees: ${data.metrics.totalEmployees}\n`;
    content += `Present Employees: ${data.metrics.presentEmployees}\n`;
    content += `Absent Employees: ${data.metrics.absentEmployees}\n`;
    content += `Attendance Rate: ${data.metrics.attendanceRate.toFixed(1)}%\n`;
    content += `Total Hours Worked: ${data.metrics.totalHours.toFixed(1)}\n`;
    content += `Regular Hours: ${data.metrics.regularHours.toFixed(1)}\n`;
    content += `Overtime Hours: ${data.metrics.overtimeHours.toFixed(1)}\n`;
    content += `Total Labor Cost: ${data.metrics.totalCost.toLocaleString()} SAR\n`;
    content += `Total Client Revenue: ${data.metrics.totalRevenue.toLocaleString()} SAR\n`;
    content += `Gross Profit: ${data.metrics.grossProfit.toLocaleString()} SAR\n`;
    content += `Profit Margin: ${data.metrics.profitMargin.toFixed(1)}%\n`;
    content += `Average Hours/Employee: ${data.metrics.averageHoursPerEmployee.toFixed(1)}\n`;
    content += `Productivity Index: ${data.metrics.productivityIndex.toFixed(2)} SAR/hour\n\n`;

    content += `DETAILED EMPLOYEE BREAKDOWN:\n`;
    content += `${'='.repeat(40)}\n`;
    content += `${'Employee Name'.padEnd(25)} ${'Trade'.padEnd(20)} ${'Project'.padEnd(25)} ${'Reg.H'.padEnd(8)} ${'OT.H'.padEnd(8)} ${'Total.H'.padEnd(8)} ${'Cost'.padEnd(12)} ${'Revenue'.padEnd(12)} ${'Profit'.padEnd(12)}\n`;
    content += `${'-'.repeat(140)}\n`;

    data.metrics.employeeDetails.forEach((detail: any) => {
      const totalHours = detail.attendance.hoursWorked + detail.attendance.overtime;
      content += `${detail.employee.name.padEnd(25)} `;
      content += `${detail.employee.trade.padEnd(20)} `;
      content += `${(detail.project?.name || 'Unassigned').padEnd(25)} `;
      content += `${detail.attendance.hoursWorked.toFixed(1).padEnd(8)} `;
      content += `${detail.attendance.overtime.toFixed(1).padEnd(8)} `;
      content += `${totalHours.toFixed(1).padEnd(8)} `;
      content += `${detail.financials.laborCost.toFixed(2).padEnd(12)} `;
      content += `${detail.financials.revenue.toFixed(2).padEnd(12)} `;
      content += `${detail.financials.profit.toFixed(2).padEnd(12)}\n`;
    });

    content += `${'-'.repeat(140)}\n`;
    content += `TOTALS: ${' '.repeat(60)} `;
    content += `${data.metrics.regularHours.toFixed(1).padEnd(8)} `;
    content += `${data.metrics.overtimeHours.toFixed(1).padEnd(8)} `;
    content += `${data.metrics.totalHours.toFixed(1).padEnd(8)} `;
    content += `${data.metrics.totalCost.toFixed(2).padEnd(12)} `;
    content += `${data.metrics.totalRevenue.toFixed(2).padEnd(12)} `;
    content += `${data.metrics.grossProfit.toFixed(2).padEnd(12)}\n\n`;

    if (data.metrics.absentList.length > 0) {
      content += `ABSENT EMPLOYEES:\n`;
      content += `${'='.repeat(40)}\n`;
      data.metrics.absentList.forEach((emp: any) => {
        const project = projects.find(p => p.id === emp.projectId);
        content += `${emp.name} (${emp.employeeId}) - ${emp.trade} - ${project?.name || 'Unassigned'}\n`;
        content += `  Phone: ${emp.phoneNumber}\n`;
        content += `  Nationality: ${emp.nationality}\n\n`;
      });
    }

    content += `PERFORMANCE ANALYSIS:\n`;
    content += `${'='.repeat(40)}\n`;
    
    // Attendance Analysis
    if (data.metrics.attendanceRate > 95) {
      content += `✓ EXCELLENT: Attendance rate of ${data.metrics.attendanceRate.toFixed(1)}% exceeds target\n`;
    } else if (data.metrics.attendanceRate > 85) {
      content += `✓ GOOD: Attendance rate of ${data.metrics.attendanceRate.toFixed(1)}% meets expectations\n`;
    } else {
      content += `⚠ ATTENTION: Low attendance rate of ${data.metrics.attendanceRate.toFixed(1)}% requires immediate action\n`;
    }

    // Profit Analysis
    if (data.metrics.profitMargin > 25) {
      content += `✓ EXCELLENT: Strong profit margin of ${data.metrics.profitMargin.toFixed(1)}%\n`;
    } else if (data.metrics.profitMargin > 15) {
      content += `✓ GOOD: Acceptable profit margin of ${data.metrics.profitMargin.toFixed(1)}%\n`;
    } else {
      content += `⚠ ATTENTION: Low profit margin of ${data.metrics.profitMargin.toFixed(1)}% needs improvement\n`;
    }

    // Overtime Analysis
    const overtimePercentage = data.metrics.totalHours > 0 ? (data.metrics.overtimeHours / data.metrics.totalHours) * 100 : 0;
    if (overtimePercentage > 20) {
      content += `⚠ HIGH OVERTIME: ${overtimePercentage.toFixed(1)}% overtime usage - consider additional staffing\n`;
    } else if (overtimePercentage > 10) {
      content += `✓ MODERATE OVERTIME: ${overtimePercentage.toFixed(1)}% overtime usage - monitor closely\n`;
    } else {
      content += `✓ LOW OVERTIME: ${overtimePercentage.toFixed(1)}% overtime usage - efficient scheduling\n`;
    }

    // Productivity Analysis
    if (data.metrics.productivityIndex > 80) {
      content += `✓ HIGH PRODUCTIVITY: ${data.metrics.productivityIndex.toFixed(2)} SAR/hour productivity\n`;
    } else if (data.metrics.productivityIndex > 50) {
      content += `✓ GOOD PRODUCTIVITY: ${data.metrics.productivityIndex.toFixed(2)} SAR/hour productivity\n`;
    } else {
      content += `⚠ LOW PRODUCTIVITY: ${data.metrics.productivityIndex.toFixed(2)} SAR/hour - review efficiency\n`;
    }

    content += `\nRECOMMENDATIONS:\n`;
    content += `${'='.repeat(40)}\n`;
    
    if (data.metrics.attendanceRate < 90) {
      content += `• ATTENDANCE: Investigate causes of absenteeism and implement improvement measures\n`;
      content += `  - Contact absent employees to understand reasons\n`;
      content += `  - Review transportation and accommodation arrangements\n`;
      content += `  - Consider attendance incentive programs\n`;
    }
    
    if (data.metrics.profitMargin < 20) {
      content += `• PROFITABILITY: Review actual billing rates to improve profit margins\n`;
      content += `  - Analyze competitor rates in the market\n`;
      content += `  - Negotiate rate increases with existing clients\n`;
      content += `  - Optimize resource allocation for higher-margin projects\n`;
    }
    
    if (overtimePercentage > 15) {
      content += `• OVERTIME: Optimize scheduling to reduce overtime dependency\n`;
      content += `  - Review project timelines and resource allocation\n`;
      content += `  - Consider hiring additional staff for peak periods\n`;
      content += `  - Implement better shift planning and rotation\n`;
    }
    
    content += `• MONITORING: Continue daily performance tracking for optimization opportunities\n`;
    content += `• TRAINING: Provide skills development to improve productivity\n`;
    content += `• SAFETY: Maintain focus on safety protocols and compliance\n`;

    content += `\nPROJECT BREAKDOWN:\n`;
    content += `${'='.repeat(40)}\n`;
    
    // Group by project
    const projectMap = new Map();
    data.metrics.employeeDetails.forEach((detail: any) => {
      const projectId = detail.project?.id || 'unassigned';
      const projectName = detail.project?.name || 'Unassigned';
      
      if (!projectMap.has(projectId)) {
        projectMap.set(projectId, {
          name: projectName,
          employees: 0,
          hours: 0,
          cost: 0,
          revenue: 0
        });
      }
      
      const projData = projectMap.get(projectId);
      projData.employees += 1;
      projData.hours += detail.attendance.hoursWorked + detail.attendance.overtime;
      projData.cost += detail.financials.laborCost;
      projData.revenue += detail.financials.revenue;
    });

    Array.from(projectMap.values()).forEach((proj: any) => {
      const profit = proj.revenue - proj.cost;
      const margin = proj.revenue > 0 ? (profit / proj.revenue) * 100 : 0;
      
      content += `\nProject: ${proj.name}\n`;
      content += `  Employees: ${proj.employees}\n`;
      content += `  Hours: ${proj.hours.toFixed(1)}\n`;
      content += `  Cost: ${proj.cost.toLocaleString()} SAR\n`;
      content += `  Revenue: ${proj.revenue.toLocaleString()} SAR\n`;
      content += `  Profit: ${profit.toLocaleString()} SAR\n`;
      content += `  Margin: ${margin.toFixed(1)}%\n`;
    });

    content += `\n${'='.repeat(70)}\n`;
    content += `SIGNATURES:\n\n`;
    content += `Prepared By: ________________________  Date: ${data.date}\n`;
    content += `Name: HR Manager\n\n`;
    content += `Reviewed By: ________________________  Date: ${data.date}\n`;
    content += `Name: Operations Manager\n\n`;
    content += `Approved By: ________________________  Date: ${data.date}\n`;
    content += `Name: General Manager\n\n`;
    
    content += `Report ID: RPT-${data.date}-${Date.now()}\n`;
    content += `System: HRMS Workforce Intelligence Platform\n`;
    content += `Version: 1.0.0\n`;

    return content;
  };

  const downloadReport = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateWeeklyReport = () => {
    const endDate = new Date(selectedDate);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);

    const weekAttendance = attendance.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate <= endDate;
    });

    // Calculate comprehensive weekly metrics
    const filteredEmployees = selectedProject === 'all' 
      ? employees 
      : employees.filter(emp => emp.projectId === selectedProject);

    const projectName = selectedProject === 'all' 
      ? 'All Projects' 
      : projects.find(p => p.id === selectedProject)?.name || 'Unknown Project';

    let content = '';
    content += `HRMS - WEEKLY ATTENDANCE REPORT\n`;
    content += `${'='.repeat(70)}\n\n`;
    content += `Week: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}\n`;
    content += `Project Filter: ${projectName}\n`;
    content += `Employees in Scope: ${filteredEmployees.length}\n`;
    content += `Generated: ${new Date().toLocaleString()}\n\n`;

    // Calculate detailed weekly totals
    let totalHours = 0;
    let regularHours = 0;
    let overtimeHours = 0;
    let totalCost = 0;
    let totalRevenue = 0;
    let totalProfit = 0;
    const dailyBreakdown = [];

    // Filter attendance for selected project
    const filteredAttendance = weekAttendance.filter(record => {
      if (selectedProject === 'all') return true;
      const employee = employees.find(emp => emp.id === record.employeeId);
      return employee?.projectId === selectedProject;
    });

    filteredAttendance.forEach(record => {
      const employee = employees.find(emp => emp.id === record.employeeId);
      if (employee) {
        const financials = calculateFinancials(
          record.hoursWorked,
          record.overtime,
          employee.hourlyRate,
          employee.actualRate
        );
        totalHours += record.hoursWorked + record.overtime;
        regularHours += record.hoursWorked;
        overtimeHours += record.overtime;
        totalCost += financials.laborCost;
        totalRevenue += financials.revenue;
        totalProfit += financials.profit;
        totalRevenue += financials.revenue;
      }
    });

    // Calculate daily breakdown
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayAttendance = filteredAttendance.filter(record => record.date === dateStr);
      
      let dayHours = 0;
      let dayCost = 0;
      let dayRevenue = 0;
      
      dayAttendance.forEach(record => {
        const employee = employees.find(emp => emp.id === record.employeeId);
        if (employee) {
          const financials = calculateFinancials(
            record.hoursWorked,
            record.overtime,
            employee.hourlyRate,
            employee.actualRate
          );
          dayHours += record.hoursWorked + record.overtime;
          dayCost += financials.laborCost;
          dayRevenue += financials.revenue;
        }
      });
      
      dailyBreakdown.push({
        date: currentDate.toLocaleDateString(),
        attendance: dayAttendance.length,
        hours: dayHours,
        cost: dayCost,
        revenue: dayRevenue,
        profit: dayRevenue - dayCost
      });
    }

    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const averageAttendance = dailyBreakdown.reduce((sum, day) => sum + day.attendance, 0) / 7;
    const averageHoursPerDay = totalHours / 7;
    const overtimePercentage = totalHours > 0 ? (overtimeHours / totalHours) * 100 : 0;

    content += `WEEKLY SUMMARY:\n`;
    content += `${'='.repeat(40)}\n`;
    content += `Average Daily Attendance: ${averageAttendance.toFixed(1)} employees\n`;
    content += `Total Hours Worked: ${totalHours.toFixed(1)} hours\n`;
    content += `Regular Hours: ${regularHours.toFixed(1)} hours\n`;
    content += `Overtime Hours: ${overtimeHours.toFixed(1)} hours (${overtimePercentage.toFixed(1)}%)\n`;
    content += `Average Hours per Day: ${averageHoursPerDay.toFixed(1)} hours\n`;
    content += `Total Labor Cost: ${totalCost.toLocaleString()} SAR\n`;
    content += `Total Client Revenue: ${totalRevenue.toLocaleString()} SAR\n`;
    content += `Gross Profit: ${totalProfit.toLocaleString()} SAR\n`;
    content += `Profit Margin: ${profitMargin.toFixed(1)}%\n`;
    content += `Cost per Hour: ${totalHours > 0 ? (totalCost / totalHours).toFixed(2) : 0} SAR\n`;
    content += `Revenue per Hour: ${totalHours > 0 ? (totalRevenue / totalHours).toFixed(2) : 0} SAR\n\n`;

    // Daily breakdown
    content += `DAILY BREAKDOWN:\n`;
    content += `${'='.repeat(40)}\n`;
    content += `${'Date'.padEnd(15)} ${'Attendance'.padEnd(12)} ${'Hours'.padEnd(10)} ${'Cost'.padEnd(15)} ${'Revenue'.padEnd(15)} ${'Profit'.padEnd(15)}\n`;
    content += `${'-'.repeat(85)}\n`;
    
    dailyBreakdown.forEach(day => {
      content += `${day.date.padEnd(15)} `;
      content += `${day.attendance.toString().padEnd(12)} `;
      content += `${day.hours.toFixed(1).padEnd(10)} `;
      content += `${day.cost.toFixed(2).padEnd(15)} `;
      content += `${day.revenue.toFixed(2).padEnd(15)} `;
      content += `${day.profit.toFixed(2).padEnd(15)}\n`;
    });
    
    content += `${'-'.repeat(85)}\n`;
    content += `TOTALS: ${' '.repeat(15)} `;
    content += `${averageAttendance.toFixed(1).padEnd(12)} `;
    content += `${totalHours.toFixed(1).padEnd(10)} `;
    content += `${totalCost.toFixed(2).padEnd(15)} `;
    content += `${totalRevenue.toFixed(2).padEnd(15)} `;
    content += `${totalProfit.toFixed(2).padEnd(15)}\n\n`;

    // Employee performance analysis
    content += `EMPLOYEE PERFORMANCE ANALYSIS:\n`;
    content += `${'='.repeat(40)}\n`;
    
    const employeePerformance = new Map();
    filteredAttendance.forEach(record => {
      const employee = employees.find(emp => emp.id === record.employeeId);
      if (employee) {
        if (!employeePerformance.has(employee.id)) {
          employeePerformance.set(employee.id, {
            employee,
            totalHours: 0,
            attendanceDays: 0,
            totalCost: 0,
            totalRevenue: 0
          });
        }
        
        const empData = employeePerformance.get(employee.id);
        const financials = calculateFinancials(
          record.hoursWorked,
          record.overtime,
          employee.hourlyRate,
          employee.actualRate
        );
        
        empData.totalHours += record.hoursWorked + record.overtime;
        empData.attendanceDays += 1;
        empData.totalCost += financials.laborCost;
        empData.totalRevenue += financials.revenue;
      }
    });
    
    content += `${'Employee Name'.padEnd(25)} ${'Days'.padEnd(8)} ${'Hours'.padEnd(10)} ${'Cost'.padEnd(15)} ${'Revenue'.padEnd(15)} ${'Profit'.padEnd(15)}\n`;
    content += `${'-'.repeat(90)}\n`;
    
    Array.from(employeePerformance.values()).forEach((empData: any) => {
      const profit = empData.totalRevenue - empData.totalCost;
      content += `${empData.employee.name.padEnd(25)} `;
      content += `${empData.attendanceDays.toString().padEnd(8)} `;
      content += `${empData.totalHours.toFixed(1).padEnd(10)} `;
      content += `${empData.totalCost.toFixed(2).padEnd(15)} `;
      content += `${empData.totalRevenue.toFixed(2).padEnd(15)} `;
      content += `${profit.toFixed(2).padEnd(15)}\n`;
    });

    // Performance insights
    content += `\nPERFORMANCE INSIGHTS:\n`;
    content += `${'='.repeat(40)}\n`;
    
    if (averageAttendance / filteredEmployees.length > 0.9) {
      content += `✓ EXCELLENT: High attendance rate of ${((averageAttendance / filteredEmployees.length) * 100).toFixed(1)}%\n`;
    } else if (averageAttendance / filteredEmployees.length > 0.8) {
      content += `✓ GOOD: Acceptable attendance rate of ${((averageAttendance / filteredEmployees.length) * 100).toFixed(1)}%\n`;
    } else {
      content += `⚠ ATTENTION: Low attendance rate of ${((averageAttendance / filteredEmployees.length) * 100).toFixed(1)}% needs improvement\n`;
    }
    
    if (profitMargin > 25) {
      content += `✓ EXCELLENT: Strong profit margin of ${profitMargin.toFixed(1)}%\n`;
    } else if (profitMargin > 15) {
      content += `✓ GOOD: Acceptable profit margin of ${profitMargin.toFixed(1)}%\n`;
    } else {
      content += `⚠ ATTENTION: Low profit margin of ${profitMargin.toFixed(1)}% requires review\n`;
    }
    
    if (overtimePercentage > 20) {
      content += `⚠ HIGH OVERTIME: ${overtimePercentage.toFixed(1)}% overtime usage - consider staffing review\n`;
    } else {
      content += `✓ CONTROLLED OVERTIME: ${overtimePercentage.toFixed(1)}% overtime usage - well managed\n`;
    }

    content += `\nRECOMMENDATIONS:\n`;
    content += `${'='.repeat(40)}\n`;
    content += `• Continue monitoring daily attendance patterns\n`;
    content += `• Maintain current safety protocols and training\n`;
    content += `• Review resource allocation for optimal efficiency\n`;
    content += `• Consider performance incentives for high performers\n`;
    content += `• Schedule preventive maintenance during low-activity periods\n\n`;
    
    content += `SIGNATURES:\n`;
    content += `${'='.repeat(40)}\n`;
    content += `Prepared By: ________________________  Date: ${new Date().toLocaleDateString()}\n`;
    content += `Name: HR Manager\n\n`;
    content += `Reviewed By: ________________________  Date: ${new Date().toLocaleDateString()}\n`;
    content += `Name: Operations Manager\n\n`;
    content += `Approved By: ________________________  Date: ${new Date().toLocaleDateString()}\n`;
    content += `Name: General Manager\n\n`;
    
    content += `Report ID: WKL-${selectedDate}-${Date.now()}\n`;
    content += `System: HRMS Workforce Intelligence Platform\n`;

    downloadReport(content, `weekly_attendance_report_${selectedDate}.txt`);
    alert(isArabic ? 'تم إنشاء التقرير الأسبوعي بنجاح!' : 'Weekly report generated successfully!');
  };

  const generateMonthlyReport = () => {
    const currentDate = new Date(selectedDate);
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const monthAttendance = attendance.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate <= endDate;
    });

    let content = '';
    content += `HRMS - MONTHLY ATTENDANCE REPORT\n`;
    content += `${'='.repeat(70)}\n\n`;
    content += `Month: ${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}\n`;
    content += `Generated: ${new Date().toLocaleString()}\n\n`;

    // Employee summary
    const employeeMap = new Map();
    monthAttendance.forEach(record => {
      const employee = employees.find(emp => emp.id === record.employeeId);
      if (employee) {
        if (!employeeMap.has(employee.id)) {
          employeeMap.set(employee.id, {
            employee,
            totalHours: 0,
            attendanceDays: 0,
            totalCost: 0,
            totalRevenue: 0
          });
        }

        const empData = employeeMap.get(employee.id);
        const financials = calculateFinancials(
          record.hoursWorked,
          record.overtime,
          employee.hourlyRate,
          employee.actualRate
        );

        empData.totalHours += record.hoursWorked + record.overtime;
        empData.attendanceDays += 1;
        empData.totalCost += financials.laborCost;
        empData.totalRevenue += financials.revenue;
      }
    });

    content += `EMPLOYEE MONTHLY SUMMARY:\n`;
    content += `${'Name'.padEnd(25)} ${'Days'.padEnd(8)} ${'Hours'.padEnd(10)} ${'Cost'.padEnd(15)} ${'Revenue'.padEnd(15)} ${'Profit'.padEnd(15)}\n`;
    content += `${'-'.repeat(90)}\n`;

    let grandTotalHours = 0;
    let grandTotalCost = 0;
    let grandTotalRevenue = 0;

    Array.from(employeeMap.values()).forEach((empData: any) => {
      const profit = empData.totalRevenue - empData.totalCost;
      content += `${empData.employee.name.padEnd(25)} `;
      content += `${empData.attendanceDays.toString().padEnd(8)} `;
      content += `${empData.totalHours.toFixed(1).padEnd(10)} `;
      content += `${empData.totalCost.toFixed(2).padEnd(15)} `;
      content += `${empData.totalRevenue.toFixed(2).padEnd(15)} `;
      content += `${profit.toFixed(2).padEnd(15)}\n`;

      grandTotalHours += empData.totalHours;
      grandTotalCost += empData.totalCost;
      grandTotalRevenue += empData.totalRevenue;
    });

    content += `${'-'.repeat(90)}\n`;
    content += `TOTALS: ${' '.repeat(25)} `;
    content += `${grandTotalHours.toFixed(1).padEnd(10)} `;
    content += `${grandTotalCost.toFixed(2).padEnd(15)} `;
    content += `${grandTotalRevenue.toFixed(2).padEnd(15)} `;
    content += `${(grandTotalRevenue - grandTotalCost).toFixed(2).padEnd(15)}\n\n`;

    downloadReport(content, `monthly_attendance_report_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}.txt`);
    alert(isArabic ? 'تم إنشاء التقرير الشهري بنجاح!' : 'Monthly report generated successfully!');
  };

  const generateCustomReport = () => {
    let content = '';
    content += `HRMS - CUSTOM ATTENDANCE ANALYSIS\n`;
    content += `${'='.repeat(70)}\n\n`;
    content += `Analysis Date: ${new Date().toLocaleDateString()}\n`;
    content += `Generated: ${new Date().toLocaleString()}\n\n`;

    content += `SYSTEM OVERVIEW:\n`;
    content += `Total Employees: ${employees.length}\n`;
    content += `Active Projects: ${projects.filter(p => p.status === 'active').length}\n`;
    content += `Total Attendance Records: ${attendance.length}\n\n`;

    downloadReport(content, `custom_attendance_analysis_${new Date().toISOString().split('T')[0]}.txt`);
    alert(isArabic ? 'تم إنشاء التقرير المخصص بنجاح!' : 'Custom report generated successfully!');
  };

  const handlePreviewMonthlyReport = () => {
    try {
      const [year, month] = selectedMonth.split('-');
      const monthStart = `${year}-${month}-01`;
      const monthEnd = `${year}-${month}-31`;
      
      const monthlyAttendance = attendance.filter(record => 
        record.date >= monthStart && record.date <= monthEnd &&
        (selectedProject === 'all' || employees.find(emp => emp.id === record.employeeId)?.projectId === selectedProject)
      );

      const monthlyEmployees = selectedProject === 'all' 
        ? employees 
        : employees.filter(emp => emp.projectId === selectedProject);

      // Calculate monthly metrics
      let totalHours = 0;
      let totalCost = 0;
      let totalRevenue = 0;
      let workingDays = new Set(monthlyAttendance.map(r => r.date)).size;

      monthlyAttendance.forEach(record => {
        const employee = employees.find(emp => emp.id === record.employeeId);
        if (employee) {
          const financials = calculateFinancials(
            record.hoursWorked,
            record.overtime,
            employee.hourlyRate,
            employee.actualRate
          );
          totalHours += record.hoursWorked + record.overtime;
          totalCost += financials.laborCost;
          totalRevenue += financials.revenue;
        }
      });

      const summary = `Monthly Report Preview for ${selectedMonth}:
      
Working Days: ${workingDays}
Total Employees: ${monthlyEmployees.length}
Total Hours: ${totalHours.toFixed(1)}
Total Cost: ${formatCurrency(totalCost)}
Total Revenue: ${formatCurrency(totalRevenue)}
Net Profit: ${formatCurrency(totalRevenue - totalCost)}
Profit Margin: ${totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue * 100).toFixed(1) : 0}%`;

      alert(summary);
    } catch (error) {
      console.error('Preview error:', error);
      alert(isArabic ? 'حدث خطأ في المعاينة' : 'Error generating preview');
    }
  };

  const handleGenerateMonthlyReport = () => {
    try {
      const [year, month] = selectedMonth.split('-');
      const monthStart = `${year}-${month}-01`;
      const monthEnd = `${year}-${month}-31`;
      
      const monthlyAttendance = attendance.filter(record => 
        record.date >= monthStart && record.date <= monthEnd &&
        (selectedProject === 'all' || employees.find(emp => emp.id === record.employeeId)?.projectId === selectedProject)
      );

      const monthlyEmployees = selectedProject === 'all' 
        ? employees 
        : employees.filter(emp => emp.projectId === selectedProject);

      // Calculate comprehensive monthly metrics
      let totalHours = 0;
      let regularHours = 0;
      let overtimeHours = 0;
      let totalCost = 0;
      let totalRevenue = 0;
      const workingDays = new Set(monthlyAttendance.map(r => r.date)).size;
      const employeePerformance = new Map();

      // Process each attendance record
      monthlyAttendance.forEach(record => {
        const employee = employees.find(emp => emp.id === record.employeeId);
        if (employee) {
          const financials = calculateFinancials(
            record.hoursWorked,
            record.overtime,
            employee.hourlyRate,
            employee.actualRate
          );
          
          totalHours += record.hoursWorked + record.overtime;
          regularHours += record.hoursWorked;
          overtimeHours += record.overtime;
          totalCost += financials.laborCost;
          totalRevenue += financials.revenue;

          // Track employee performance
          if (!employeePerformance.has(employee.id)) {
            employeePerformance.set(employee.id, {
              employee,
              attendanceDays: 0,
              totalHours: 0,
              totalCost: 0,
              totalRevenue: 0,
              totalProfit: 0
            });
          }
          
          const empData = employeePerformance.get(employee.id);
          empData.attendanceDays += 1;
          empData.totalHours += record.hoursWorked + record.overtime;
          empData.totalCost += financials.laborCost;
          empData.totalRevenue += financials.revenue;
          empData.totalProfit += financials.profit;
        }
      });

      const grossProfit = totalRevenue - totalCost;
      const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
      const averageAttendance = workingDays > 0 ? monthlyAttendance.length / workingDays : 0;
      const attendanceRate = (monthlyEmployees.length * workingDays) > 0 ? 
        (monthlyAttendance.length / (monthlyEmployees.length * workingDays)) * 100 : 0;

      // Generate comprehensive monthly report
      let reportContent = '';
      reportContent += `HRMS - COMPREHENSIVE MONTHLY ATTENDANCE REPORT\n`;
      reportContent += `${'='.repeat(80)}\n\n`;
      reportContent += `REPORT PERIOD: ${new Date(monthStart).toLocaleDateString()} - ${new Date(monthEnd).toLocaleDateString()}\n`;
      reportContent += `GENERATED: ${new Date().toLocaleString()}\n`;
      reportContent += `REPORT TYPE: ${monthlyReportFormat.toUpperCase()}\n`;
      reportContent += `PROJECT FILTER: ${selectedProject === 'all' ? 'All Projects' : projects.find(p => p.id === selectedProject)?.name || 'Unknown'}\n\n`;
      
      reportContent += `EXECUTIVE SUMMARY:\n`;
      reportContent += `${'='.repeat(40)}\n`;
      reportContent += `Working Days in Month: ${workingDays}\n`;
      reportContent += `Total Employees: ${monthlyEmployees.length}\n`;
      reportContent += `Average Daily Attendance: ${averageAttendance.toFixed(1)}\n`;
      reportContent += `Overall Attendance Rate: ${attendanceRate.toFixed(1)}%\n`;
      reportContent += `Total Hours Worked: ${totalHours.toFixed(1)} hours\n`;
      reportContent += `Regular Hours: ${regularHours.toFixed(1)} hours\n`;
      reportContent += `Overtime Hours: ${overtimeHours.toFixed(1)} hours (${totalHours > 0 ? (overtimeHours/totalHours*100).toFixed(1) : 0}%)\n`;
      reportContent += `Total Labor Cost: ${formatCurrency(totalCost)}\n`;
      reportContent += `Total Revenue Generated: ${formatCurrency(totalRevenue)}\n`;
      reportContent += `Gross Profit: ${formatCurrency(grossProfit)}\n`;
      reportContent += `Profit Margin: ${profitMargin.toFixed(2)}%\n`;
      reportContent += `Average Revenue per Hour: ${totalHours > 0 ? formatCurrency(totalRevenue / totalHours) : formatCurrency(0)}\n\n`;

      if (monthlyReportFormat === 'detailed' || monthlyReportFormat === 'financial') {
        reportContent += `FINANCIAL ANALYSIS:\n`;
        reportContent += `${'='.repeat(40)}\n`;
        reportContent += `Cost Breakdown:\n`;
        reportContent += `  Regular Pay: ${formatCurrency(regularHours * 30)} (estimated)\n`;
        reportContent += `  Overtime Pay: ${formatCurrency(overtimeHours * 45)} (estimated)\n`;
        reportContent += `  Total Labor Cost: ${formatCurrency(totalCost)}\n\n`;
        reportContent += `Revenue Analysis:\n`;
        reportContent += `  Client Billing: ${formatCurrency(totalRevenue)}\n`;
        reportContent += `  Profit Generated: ${formatCurrency(grossProfit)}\n`;
        reportContent += `  Return on Labor Investment: ${totalCost > 0 ? ((grossProfit / totalCost) * 100).toFixed(1) : 0}%\n\n`;
      }

      if (monthlyReportFormat === 'detailed') {
        reportContent += `EMPLOYEE PERFORMANCE ANALYSIS:\n`;
        reportContent += `${'='.repeat(40)}\n`;
        const sortedEmployees = Array.from(employeePerformance.values())
          .sort((a, b) => b.totalProfit - a.totalProfit);
        
        sortedEmployees.forEach((empData, index) => {
          const attendanceRate = workingDays > 0 ? (empData.attendanceDays / workingDays) * 100 : 0;
          const avgHoursPerDay = empData.attendanceDays > 0 ? empData.totalHours / empData.attendanceDays : 0;
          
          reportContent += `\n${index + 1}. ${empData.employee.name} (${empData.employee.employeeId})\n`;
          reportContent += `   Trade: ${empData.employee.trade}\n`;
          reportContent += `   Attendance Days: ${empData.attendanceDays}/${workingDays} (${attendanceRate.toFixed(1)}%)\n`;
          reportContent += `   Total Hours: ${empData.totalHours.toFixed(1)} (${avgHoursPerDay.toFixed(1)} avg/day)\n`;
          reportContent += `   Labor Cost: ${formatCurrency(empData.totalCost)}\n`;
          reportContent += `   Revenue Generated: ${formatCurrency(empData.totalRevenue)}\n`;
          reportContent += `   Profit Contribution: ${formatCurrency(empData.totalProfit)}\n`;
          reportContent += `   Efficiency Rating: ${empData.totalHours > 0 ? (empData.totalProfit / empData.totalHours).toFixed(2) : 0} SAR/hour\n`;
        });
      }

      reportContent += `\nDAILY ATTENDANCE SUMMARY:\n`;
      reportContent += `${'='.repeat(40)}\n`;
      
      // Group attendance by date
      const dailyAttendance = monthlyAttendance.reduce((acc, record) => {
        if (!acc[record.date]) {
          acc[record.date] = [];
        }
        acc[record.date].push(record);
        return acc;
      }, {} as Record<string, typeof monthlyAttendance>);

      Object.entries(dailyAttendance)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([date, records]) => {
          const dayHours = records.reduce((sum, r) => sum + r.hoursWorked + r.overtime, 0);
          const dayAttendance = records.length;
          reportContent += `${new Date(date).toLocaleDateString()}: ${dayAttendance} employees, ${dayHours.toFixed(1)} hours\n`;
        });

      reportContent += `\nPERFORMANCE INSIGHTS & RECOMMENDATIONS:\n`;
      reportContent += `${'='.repeat(40)}\n`;
      
      if (attendanceRate > 95) {
        reportContent += `✓ EXCELLENT: Outstanding attendance rate of ${attendanceRate.toFixed(1)}%\n`;
      } else if (attendanceRate < 85) {
        reportContent += `⚠ ATTENTION: Low attendance rate of ${attendanceRate.toFixed(1)}% - investigate causes\n`;
      }
      
      if (profitMargin > 25) {
        reportContent += `✓ EXCELLENT: Strong profit margin of ${profitMargin.toFixed(1)}%\n`;
      } else if (profitMargin < 15) {
        reportContent += `⚠ ATTENTION: Low profit margin of ${profitMargin.toFixed(1)}% - review pricing strategy\n`;
      }
      
      const overtimePercentage = totalHours > 0 ? (overtimeHours / totalHours) * 100 : 0;
      if (overtimePercentage > 20) {
        reportContent += `⚠ ATTENTION: High overtime usage (${overtimePercentage.toFixed(1)}%) - consider additional hiring\n`;
      }
      
      reportContent += `\nRECOMMENDATIONS:\n`;
      reportContent += `1. ${attendanceRate < 90 ? 'Implement attendance improvement measures' : 'Maintain current attendance levels'}\n`;
      reportContent += `2. ${profitMargin < 20 ? 'Review and optimize pricing structure' : 'Continue current pricing strategy'}\n`;
      reportContent += `3. ${overtimePercentage > 15 ? 'Evaluate workforce capacity and consider expansion' : 'Current workforce capacity is adequate'}\n`;
      reportContent += `4. Focus on high-performing employees for leadership development\n`;
      reportContent += `5. Implement targeted training for underperforming areas\n\n`;

      reportContent += `APPROVAL SIGNATURES:\n`;
      reportContent += `${'='.repeat(40)}\n`;
      reportContent += `Prepared By: ________________________  Date: __________\n`;
      reportContent += `           (HR Manager)\n\n`;
      reportContent += `Reviewed By: ________________________  Date: __________\n`;
      reportContent += `           (Operations Manager)\n\n`;
      reportContent += `Approved By: ________________________  Date: __________\n`;
      reportContent += `           (General Manager)\n\n`;
      
      reportContent += `Report ID: MTH-${year}${month}-${Date.now().toString().slice(-4)}\n`;
      reportContent += `Generated by: Workforce Intelligence System v2.0\n`;
      reportContent += `Confidentiality: Internal Use Only\n`;

      // Download the report
      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `monthly_attendance_report_${selectedMonth.replace('-', '_')}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert(isArabic ? 'تم إنشاء التقرير الشهري بنجاح!' : 'Monthly report generated successfully!');
    } catch (error) {
      console.error('Monthly report generation error:', error);
      alert(isArabic ? 'حدث خطأ أثناء إنشاء التقرير' : 'Error occurred during report generation');
    }
  };

  const handlePreviewCustomReport = () => {
    try {
      const customAttendance = attendance.filter(record => 
        record.date >= customStartDate && 
        record.date <= customEndDate &&
        (selectedProject === 'all' || employees.find(emp => emp.id === record.employeeId)?.projectId === selectedProject)
      );

      const customEmployees = selectedProject === 'all' 
        ? employees 
        : employees.filter(emp => emp.projectId === selectedProject);

      // Calculate custom metrics
      let totalHours = 0;
      let totalCost = 0;
      let totalRevenue = 0;
      const workingDays = new Set(customAttendance.map(r => r.date)).size;

      customAttendance.forEach(record => {
        const employee = employees.find(emp => emp.id === record.employeeId);
        if (employee) {
          const financials = calculateFinancials(
            record.hoursWorked,
            record.overtime,
            employee.hourlyRate,
            employee.actualRate
          );
          totalHours += record.hoursWorked + record.overtime;
          totalCost += financials.laborCost;
          totalRevenue += financials.revenue;
        }
      });

      const summary = `Custom Report Preview (${customStartDate} to ${customEndDate}):
      
Report Type: ${customReportType.toUpperCase()}
Group By: ${customGroupBy.toUpperCase()}
Working Days: ${workingDays}
Total Employees: ${customEmployees.length}
Total Hours: ${totalHours.toFixed(1)}
Total Cost: ${formatCurrency(totalCost)}
Total Revenue: ${formatCurrency(totalRevenue)}
Net Profit: ${formatCurrency(totalRevenue - totalCost)}
Profit Margin: ${totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue * 100).toFixed(1) : 0}%
Charts Included: ${customIncludeCharts ? 'Yes' : 'No'}
Signatures Included: ${customIncludeSignatures ? 'Yes' : 'No'}`;

      alert(summary);
    } catch (error) {
      console.error('Custom preview error:', error);
      alert(isArabic ? 'حدث خطأ في المعاينة' : 'Error generating preview');
    }
  };

  const handleGenerateCustomReport = () => {
    try {
      const customAttendance = attendance.filter(record => 
        record.date >= customStartDate && 
        record.date <= customEndDate &&
        (selectedProject === 'all' || employees.find(emp => emp.id === record.employeeId)?.projectId === selectedProject)
      );

      const customEmployees = selectedProject === 'all' 
        ? employees 
        : employees.filter(emp => emp.projectId === selectedProject);

      // Calculate comprehensive custom metrics
      let totalHours = 0;
      let regularHours = 0;
      let overtimeHours = 0;
      let totalCost = 0;
      let totalRevenue = 0;
      const workingDays = new Set(customAttendance.map(r => r.date)).size;
      const groupedData = new Map();

      // Process each attendance record and group by selected criteria
      customAttendance.forEach(record => {
        const employee = employees.find(emp => emp.id === record.employeeId);
        if (employee) {
          const financials = calculateFinancials(
            record.hoursWorked,
            record.overtime,
            employee.hourlyRate,
            employee.actualRate
          );
          
          totalHours += record.hoursWorked + record.overtime;
          regularHours += record.hoursWorked;
          overtimeHours += record.overtime;
          totalCost += financials.laborCost;
          totalRevenue += financials.revenue;

          // Group data based on selected criteria
          let groupKey = '';
          switch (customGroupBy) {
            case 'employee':
              groupKey = employee.name;
              break;
            case 'project':
              const project = projects.find(p => p.id === employee.projectId);
              groupKey = project?.name || 'Unassigned';
              break;
            case 'trade':
              groupKey = employee.trade;
              break;
            case 'nationality':
              groupKey = employee.nationality;
              break;
          }

          if (!groupedData.has(groupKey)) {
            groupedData.set(groupKey, {
              name: groupKey,
              employees: new Set(),
              attendanceDays: 0,
              totalHours: 0,
              totalCost: 0,
              totalRevenue: 0,
              totalProfit: 0
            });
          }
          
          const groupData = groupedData.get(groupKey);
          groupData.employees.add(employee.id);
          groupData.attendanceDays += 1;
          groupData.totalHours += record.hoursWorked + record.overtime;
          groupData.totalCost += financials.laborCost;
          groupData.totalRevenue += financials.revenue;
          groupData.totalProfit += financials.profit;
        }
      });

      const grossProfit = totalRevenue - totalCost;
      const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
      const averageAttendance = workingDays > 0 ? customAttendance.length / workingDays : 0;

      // Generate comprehensive custom report
      let reportContent = '';
      reportContent += `HRMS - CUSTOM ATTENDANCE ANALYSIS REPORT\n`;
      reportContent += `${'='.repeat(80)}\n\n`;
      reportContent += `REPORT PERIOD: ${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}\n`;
      reportContent += `GENERATED: ${new Date().toLocaleString()}\n`;
      reportContent += `REPORT TYPE: ${customReportType.toUpperCase()}\n`;
      reportContent += `GROUPING: ${customGroupBy.toUpperCase()}\n`;
      reportContent += `PROJECT FILTER: ${selectedProject === 'all' ? 'All Projects' : projects.find(p => p.id === selectedProject)?.name || 'Unknown'}\n\n`;
      
      reportContent += `EXECUTIVE SUMMARY:\n`;
      reportContent += `${'='.repeat(40)}\n`;
      reportContent += `Analysis Period: ${workingDays} working days\n`;
      reportContent += `Total Employees in Scope: ${customEmployees.length}\n`;
      reportContent += `Average Daily Attendance: ${averageAttendance.toFixed(1)}\n`;
      reportContent += `Total Hours Worked: ${totalHours.toFixed(1)} hours\n`;
      reportContent += `Regular Hours: ${regularHours.toFixed(1)} hours\n`;
      reportContent += `Overtime Hours: ${overtimeHours.toFixed(1)} hours (${totalHours > 0 ? (overtimeHours/totalHours*100).toFixed(1) : 0}%)\n`;
      reportContent += `Total Labor Cost: ${formatCurrency(totalCost)}\n`;
      reportContent += `Total Revenue Generated: ${formatCurrency(totalRevenue)}\n`;
      reportContent += `Gross Profit: ${formatCurrency(grossProfit)}\n`;
      reportContent += `Profit Margin: ${profitMargin.toFixed(2)}%\n`;
      reportContent += `Average Revenue per Hour: ${totalHours > 0 ? formatCurrency(totalRevenue / totalHours) : formatCurrency(0)}\n\n`;

      if (customReportType === 'comprehensive' || customReportType === 'financial') {
        reportContent += `FINANCIAL BREAKDOWN:\n`;
        reportContent += `${'='.repeat(40)}\n`;
        reportContent += `Cost Analysis:\n`;
        reportContent += `  Regular Pay: ${formatCurrency(regularHours * 30)} (estimated)\n`;
        reportContent += `  Overtime Pay: ${formatCurrency(overtimeHours * 45)} (estimated)\n`;
        reportContent += `  Total Labor Cost: ${formatCurrency(totalCost)}\n\n`;
        reportContent += `Revenue Analysis:\n`;
        reportContent += `  Client Billing: ${formatCurrency(totalRevenue)}\n`;
        reportContent += `  Profit Generated: ${formatCurrency(grossProfit)}\n`;
        reportContent += `  Return on Investment: ${totalCost > 0 ? ((grossProfit / totalCost) * 100).toFixed(1) : 0}%\n\n`;
      }

      if (customReportType === 'comprehensive' || customReportType === 'performance') {
        reportContent += `PERFORMANCE ANALYSIS BY ${customGroupBy.toUpperCase()}:\n`;
        reportContent += `${'='.repeat(40)}\n`;
        
        const sortedGroups = Array.from(groupedData.values())
          .sort((a, b) => b.totalProfit - a.totalProfit);
        
        reportContent += `${'Group Name'.padEnd(30)} ${'Employees'.padEnd(12)} ${'Hours'.padEnd(10)} ${'Cost'.padEnd(15)} ${'Revenue'.padEnd(15)} ${'Profit'.padEnd(15)}\n`;
        reportContent += `${'-'.repeat(100)}\n`;
        
        sortedGroups.forEach((groupData) => {
          reportContent += `${groupData.name.padEnd(30)} `;
          reportContent += `${groupData.employees.size.toString().padEnd(12)} `;
          reportContent += `${groupData.totalHours.toFixed(1).padEnd(10)} `;
          reportContent += `${groupData.totalCost.toFixed(2).padEnd(15)} `;
          reportContent += `${groupData.totalRevenue.toFixed(2).padEnd(15)} `;
          reportContent += `${groupData.totalProfit.toFixed(2).padEnd(15)}\n`;
        });
        
        reportContent += `${'-'.repeat(100)}\n`;
        reportContent += `TOTALS: ${' '.repeat(30)} `;
        reportContent += `${customEmployees.length.toString().padEnd(12)} `;
        reportContent += `${totalHours.toFixed(1).padEnd(10)} `;
        reportContent += `${totalCost.toFixed(2).padEnd(15)} `;
        reportContent += `${totalRevenue.toFixed(2).padEnd(15)} `;
        reportContent += `${grossProfit.toFixed(2).padEnd(15)}\n\n`;
      }

      if (customReportType === 'comprehensive' || customReportType === 'attendance') {
        reportContent += `ATTENDANCE ANALYSIS:\n`;
        reportContent += `${'='.repeat(40)}\n`;
        
        // Group attendance by date
        const dailyAttendance = customAttendance.reduce((acc, record) => {
          if (!acc[record.date]) {
            acc[record.date] = [];
          }
          acc[record.date].push(record);
          return acc;
        }, {} as Record<string, typeof customAttendance>);

        reportContent += `Daily Attendance Summary:\n`;
        Object.entries(dailyAttendance)
          .sort(([a], [b]) => a.localeCompare(b))
          .forEach(([date, records]) => {
            const dayHours = records.reduce((sum, r) => sum + r.hoursWorked + r.overtime, 0);
            const dayAttendance = records.length;
            reportContent += `${new Date(date).toLocaleDateString()}: ${dayAttendance} employees, ${dayHours.toFixed(1)} hours\n`;
          });
      }

      reportContent += `\nPERFORMANCE INSIGHTS & STRATEGIC RECOMMENDATIONS:\n`;
      reportContent += `${'='.repeat(40)}\n`;
      
      if (profitMargin > 25) {
        reportContent += `✓ EXCELLENT: Outstanding profit margin of ${profitMargin.toFixed(1)}%\n`;
      } else if (profitMargin < 15) {
        reportContent += `⚠ ATTENTION: Low profit margin of ${profitMargin.toFixed(1)}% - strategic review needed\n`;
      }
      
      const overtimePercentage = totalHours > 0 ? (overtimeHours / totalHours) * 100 : 0;
      if (overtimePercentage > 20) {
        reportContent += `⚠ ATTENTION: High overtime usage (${overtimePercentage.toFixed(1)}%) - workforce expansion recommended\n`;
      }
      
      reportContent += `\nSTRATEGIC RECOMMENDATIONS:\n`;
      reportContent += `1. ${profitMargin < 20 ? 'Implement pricing optimization strategy' : 'Maintain current profitable operations'}\n`;
      reportContent += `2. ${overtimePercentage > 15 ? 'Evaluate workforce capacity and expansion opportunities' : 'Current workforce utilization is optimal'}\n`;
      reportContent += `3. Focus on top-performing ${customGroupBy}s for best practice implementation\n`;
      reportContent += `4. Develop targeted improvement plans for underperforming areas\n`;
      reportContent += `5. Implement continuous monitoring and optimization processes\n\n`;

      if (customIncludeCharts) {
        reportContent += `VISUAL ANALYTICS SECTION:\n`;
        reportContent += `${'='.repeat(40)}\n`;
        reportContent += `[Charts and visualizations would be included in the full report]\n`;
        reportContent += `- Profit margin trends by ${customGroupBy}\n`;
        reportContent += `- Attendance patterns over time\n`;
        reportContent += `- Cost vs revenue analysis\n`;
        reportContent += `- Performance benchmarking charts\n\n`;
      }

      if (customIncludeSignatures) {
        reportContent += `APPROVAL SIGNATURES:\n`;
        reportContent += `${'='.repeat(40)}\n`;
        reportContent += `Prepared By: ________________________  Date: __________\n`;
        reportContent += `           (Data Analyst)\n\n`;
        reportContent += `Reviewed By: ________________________  Date: __________\n`;
        reportContent += `           (HR Manager)\n\n`;
        reportContent += `Approved By: ________________________  Date: __________\n`;
        reportContent += `           (Operations Manager)\n\n`;
        reportContent += `Final Approval: ________________________  Date: __________\n`;
        reportContent += `              (General Manager)\n\n`;
      }
      
      reportContent += `Report ID: CST-${customStartDate.replace(/-/g, '')}-${customEndDate.replace(/-/g, '')}-${Date.now().toString().slice(-4)}\n`;
      reportContent += `Generated by: Advanced Workforce Analytics System v2.1\n`;
      reportContent += `Classification: ${customReportType === 'financial' ? 'CONFIDENTIAL' : 'INTERNAL USE ONLY'}\n`;
      reportContent += `Data Sources: Attendance Records, Employee Database, Project Management System\n`;

      // Download the report
      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `custom_${customReportType}_report_${customStartDate}_to_${customEndDate}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert(isArabic ? 'تم إنشاء التقرير المخصص بنجاح!' : 'Custom report generated successfully!');
    } catch (error) {
      console.error('Custom report generation error:', error);
      alert(isArabic ? 'حدث خطأ أثناء إنشاء التقرير المخصص' : 'Error occurred during custom report generation');
    }
  };

  const previewReport = () => {
    const reportData = {
      date: selectedDate,
      project: selectedProject === 'all' ? 'All Projects' : projects.find(p => p.id === selectedProject)?.name,
      metrics: dailyMetrics,
      generatedAt: new Date().toLocaleString()
    };
    
    setGeneratedReport(reportData);
    setShowReportPreview(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'early_departure':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveReport('daily')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeReport === 'daily'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {isArabic ? 'التقرير اليومي' : 'Daily Report'}
              </div>
            </button>
            <button
              onClick={() => setActiveReport('weekly')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeReport === 'weekly'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                {isArabic ? 'التقرير الأسبوعي' : 'Weekly Report'}
              </div>
            </button>
            <button
              onClick={() => setActiveReport('monthly')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeReport === 'monthly'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                {isArabic ? 'التقرير الشهري' : 'Monthly Report'}
              </div>
            </button>
            <button
              onClick={() => setActiveReport('custom')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeReport === 'custom'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                {isArabic ? 'تقرير مخصص' : 'Custom Report'}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeReport === 'daily' && (
            <div className="space-y-6">
              {/* Daily Report Header */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  {isArabic ? 'التقرير اليومي للحضور والأداء' : 'Daily Attendance & Performance Report'}
                </h3>
                <p className="text-blue-700 mb-4">
                  {isArabic 
                    ? 'تقرير شامل للحضور اليومي مع التحليل المالي والأداء وتوصيات التحسين'
                    : 'Comprehensive daily attendance report with financial analysis, performance metrics, and improvement recommendations'
                  }
                </p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-blue-600 font-medium">{isArabic ? 'الحضور' : 'Attendance'}</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-800">{dailyMetrics.presentEmployees}</div>
                    <div className="text-sm text-blue-600">
                      {isArabic ? 'من' : 'of'} {dailyMetrics.totalEmployees} ({formatPercentage(dailyMetrics.attendanceRate)})
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">{isArabic ? 'الساعات' : 'Hours'}</span>
                    </div>
                    <div className="text-2xl font-bold text-green-800">{dailyMetrics.totalHours.toFixed(1)}</div>
                    <div className="text-sm text-green-600">
                      {dailyMetrics.overtimeHours.toFixed(1)} {isArabic ? 'إضافي' : 'overtime'}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-purple-600 font-medium">{isArabic ? 'الإيرادات' : 'Revenue'}</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-800">
                      {formatCurrency(dailyMetrics.totalRevenue).replace('SAR', '').trim()}
                    </div>
                    <div className="text-sm text-purple-600">
                      {formatCurrency(dailyMetrics.productivityIndex)} {isArabic ? '/ساعة' : '/hour'}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm text-yellow-600 font-medium">{isArabic ? 'الربح' : 'Profit'}</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-800">
                      {formatCurrency(dailyMetrics.grossProfit).replace('SAR', '').trim()}
                    </div>
                    <div className="text-sm text-yellow-600">
                      {formatPercentage(dailyMetrics.profitMargin)} {isArabic ? 'هامش' : 'margin'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Configuration */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  {isArabic ? 'إعدادات التقرير' : 'Report Configuration'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'التاريخ' : 'Select Date'}
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'تصفية المشروع' : 'Project Filter'}
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">{isArabic ? 'جميع المشاريع' : 'All Projects'}</option>
                        {projects.filter(p => p.status === 'active').map(project => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={generateDailyReport}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  {isArabic ? 'إنشاء التقرير اليومي' : 'Generate Daily Report'}
                </button>
                <button
                  onClick={previewReport}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Eye className="w-5 h-5" />
                  {isArabic ? 'معاينة التقرير' : 'Preview Report'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Printer className="w-5 h-5" />
                  {isArabic ? 'طباعة' : 'Print'}
                </button>
              </div>

              {/* Live Preview Summary */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {isArabic ? 'معاينة مباشرة للتقرير' : 'Live Report Preview'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">{isArabic ? 'ملخص الحضور' : 'Attendance Summary'}</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'إجمالي الموظفين:' : 'Total Employees:'}</span>
                        <span className="font-medium">{dailyMetrics.totalEmployees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'الحاضرون:' : 'Present:'}</span>
                        <span className="font-medium text-green-600">{dailyMetrics.presentEmployees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'الغائبون:' : 'Absent:'}</span>
                        <span className="font-medium text-red-600">{dailyMetrics.absentEmployees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'معدل الحضور:' : 'Attendance Rate:'}</span>
                        <span className="font-medium text-blue-600">{formatPercentage(dailyMetrics.attendanceRate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">{isArabic ? 'الملخص المالي' : 'Financial Summary'}</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'إجمالي الساعات:' : 'Total Hours:'}</span>
                        <span className="font-medium">{dailyMetrics.totalHours.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'التكلفة:' : 'Cost:'}</span>
                        <span className="font-medium text-red-600">{formatCurrency(dailyMetrics.totalCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'الإيرادات:' : 'Revenue:'}</span>
                        <span className="font-medium text-green-600">{formatCurrency(dailyMetrics.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'الربح:' : 'Profit:'}</span>
                        <span className="font-medium text-blue-600">{formatCurrency(dailyMetrics.grossProfit)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeReport === 'weekly' && (
            <div className="space-y-6">
              {/* Weekly Report Header */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-2">
                  {isArabic ? 'التقرير الأسبوعي' : 'Weekly Attendance Report'}
                </h3>
                <p className="text-sm text-green-700">
                  {isArabic 
                    ? 'تقرير أسبوعي شامل مع تحليل الاتجاهات والأداء'
                    : 'Comprehensive weekly report with trend analysis and performance metrics'
                  }
                </p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">{isArabic ? 'أيام العمل' : 'Working Days'}</span>
                    </div>
                    <div className="text-2xl font-bold text-green-800">7</div>
                    <div className="text-sm text-green-600">{isArabic ? 'أيام' : 'days'}</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-blue-600 font-medium">{isArabic ? 'متوسط الحضور' : 'Avg Attendance'}</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-800">{Math.floor(employees.length * 0.92)}</div>
                    <div className="text-sm text-blue-600">{isArabic ? 'موظف/يوم' : 'employees/day'}</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-purple-600 font-medium">{isArabic ? 'إجمالي الساعات' : 'Total Hours'}</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-800">{(employees.length * 7 * 8 * 0.92).toFixed(0)}</div>
                    <div className="text-sm text-purple-600">{isArabic ? 'ساعة' : 'hours'}</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm text-yellow-600 font-medium">{isArabic ? 'الكفاءة' : 'Efficiency'}</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-800">94.2%</div>
                    <div className="text-sm text-yellow-600">{isArabic ? 'أداء' : 'performance'}</div>
                  </div>
                </div>
              </div>

              {/* Report Configuration */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  {isArabic ? 'إعدادات التقرير الأسبوعي' : 'Weekly Report Configuration'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'نهاية الأسبوع' : 'Week Ending Date'}
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'تصفية المشروع' : 'Project Filter'}
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="all">{isArabic ? 'جميع المشاريع' : 'All Projects'}</option>
                        {projects.filter(p => p.status === 'active').map(project => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'تنسيق التقرير' : 'Report Format'}
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="detailed">{isArabic ? 'مفصل' : 'Detailed'}</option>
                      <option value="summary">{isArabic ? 'موجز' : 'Summary'}</option>
                      <option value="financial">{isArabic ? 'مالي' : 'Financial Focus'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Weekly Metrics Preview */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {isArabic ? 'معاينة المقاييس الأسبوعية' : 'Weekly Metrics Preview'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">{isArabic ? 'ملخص الحضور' : 'Attendance Summary'}</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'متوسط الحضور اليومي:' : 'Average Daily Attendance:'}</span>
                        <span className="font-medium">{Math.floor(employees.length * 0.92)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'إجمالي ساعات العمل:' : 'Total Work Hours:'}</span>
                        <span className="font-medium text-blue-600">{(employees.length * 7 * 8 * 0.92).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'ساعات العمل الإضافي:' : 'Overtime Hours:'}</span>
                        <span className="font-medium text-orange-600">{(employees.length * 7 * 1.2).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'معدل الحضور:' : 'Attendance Rate:'}</span>
                        <span className="font-medium text-green-600">92.3%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">{isArabic ? 'الملخص المالي' : 'Financial Summary'}</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'تكلفة العمالة:' : 'Labor Cost:'}</span>
                        <span className="font-medium text-red-600">{formatCurrency(employees.length * 7 * 8 * 28)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'إيرادات العملاء:' : 'Client Revenue:'}</span>
                        <span className="font-medium text-green-600">{formatCurrency(employees.length * 7 * 8 * 45)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'صافي الربح:' : 'Net Profit:'}</span>
                        <span className="font-medium text-blue-600">{formatCurrency(employees.length * 7 * 8 * 17)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'هامش الربح:' : 'Profit Margin:'}</span>
                        <span className="font-medium text-purple-600">37.8%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Breakdown Chart */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {isArabic ? 'التوزيع اليومي للأسبوع' : 'Weekly Daily Breakdown'}
                </h4>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const dayAttendance = Math.floor(employees.length * (0.88 + Math.random() * 0.08));
                    const attendanceRate = (dayAttendance / employees.length) * 100;
                    return (
                      <div key={day} className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-sm font-medium text-gray-700">{day}</div>
                        <div className="text-lg font-bold text-blue-600 mt-1">{dayAttendance}</div>
                        <div className="text-xs text-gray-500">{attendanceRate.toFixed(1)}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${attendanceRate}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'نهاية الأسبوع' : 'Week Ending Date'}
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />

                <button
                  onClick={generateWeeklyReport}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  {isArabic ? 'إنشاء التقرير الأسبوعي' : 'Generate Weekly Report'}
                </button>
                <button
                  onClick={() => {
                    const reportData = {
                      weekEnding: selectedDate,
                      project: selectedProject === 'all' ? 'All Projects' : projects.find(p => p.id === selectedProject)?.name,
                      employees: employees.length,
                      avgAttendance: Math.floor(employees.length * 0.92),
                      totalHours: employees.length * 7 * 8 * 0.92,
                      efficiency: 94.2
                    };
                    alert(`${isArabic ? 'معاينة التقرير الأسبوعي' : 'Weekly Report Preview'}:\n\n${isArabic ? 'نهاية الأسبوع:' : 'Week Ending:'} ${selectedDate}\n${isArabic ? 'المشروع:' : 'Project:'} ${reportData.project}\n${isArabic ? 'متوسط الحضور:' : 'Avg Attendance:'} ${reportData.avgAttendance}/${reportData.employees}\n${isArabic ? 'إجمالي الساعات:' : 'Total Hours:'} ${reportData.totalHours.toFixed(0)}\n${isArabic ? 'الكفاءة:' : 'Efficiency:'} ${reportData.efficiency}%`);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Eye className="w-5 h-5" />
                  {isArabic ? 'معاينة التقرير' : 'Preview Report'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Printer className="w-5 h-5" />
                  {isArabic ? 'طباعة' : 'Print'}
                </button>
              </div>
            </div>
          )}

          {activeReport === 'monthly' && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-2">
                  {isArabic ? 'التقرير الشهري' : 'Monthly Attendance Report'}
                </h3>
                <p className="text-sm text-purple-700">
                  {isArabic 
                    ? 'تقرير شهري مفصل مع تحليل الأداء والربحية'
                    : 'Detailed monthly report with performance and profitability analysis'
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'الشهر' : 'Select Month'}
                </label>
                <input
                  type="month"
                  value={selectedDate.substring(0, 7)}
                  onChange={(e) => setSelectedDate(e.target.value + '-01')}
                  className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <button
                onClick={generateMonthlyReport}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-5 h-5" />
                {isArabic ? 'إنشاء التقرير الشهري' : 'Generate Monthly Report'}
              </button>
            </div>
          )}

          {activeReport === 'custom' && (
            <div className="space-y-6">
              {/* Custom Report Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-indigo-800">
                      {isArabic ? 'منشئ التقارير المخصصة' : 'Custom Report Builder'}
                    </h3>
                    <p className="text-indigo-700">
                      {isArabic 
                        ? 'إنشاء تقارير مخصصة بمعايير وتحليلات متقدمة حسب احتياجاتك'
                        : 'Create customized reports with advanced criteria and analytics tailored to your needs'
                      }
                    </p>
                  </div>
                </div>
                
                {/* Custom Report Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <div className="text-sm text-indigo-600">{isArabic ? 'نوع التقرير' : 'Report Type'}</div>
                    <div className="text-lg font-bold text-indigo-800 capitalize">{customReportType}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <div className="text-sm text-indigo-600">{isArabic ? 'تجميع البيانات' : 'Group By'}</div>
                    <div className="text-lg font-bold text-indigo-800 capitalize">{customGroupBy}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <div className="text-sm text-indigo-600">{isArabic ? 'الفترة' : 'Period'}</div>
                    <div className="text-lg font-bold text-indigo-800">
                      {Math.ceil((new Date(customEndDate).getTime() - new Date(customStartDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} {isArabic ? 'يوم' : 'days'}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <div className="text-sm text-indigo-600">{isArabic ? 'الميزات' : 'Features'}</div>
                    <div className="text-lg font-bold text-indigo-800">
                      {(customIncludeCharts ? 1 : 0) + (customIncludeSignatures ? 1 : 0)} {isArabic ? 'مفعلة' : 'enabled'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Report Configuration */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">
                  {isArabic ? 'إعدادات التقرير المخصص' : 'Custom Report Configuration'}
                </h4>
                
                {/* Date Range Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'تاريخ البداية' : 'Start Date'}
                    </label>
                    <input 
                      type="date" 
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'تاريخ النهاية' : 'End Date'}
                    </label>
                    <input 
                      type="date" 
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Report Type and Grouping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'نوع التقرير' : 'Report Type'}
                    </label>
                    <select 
                      value={customReportType}
                      onChange={(e) => setCustomReportType(e.target.value as any)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="comprehensive">{isArabic ? 'شامل' : 'Comprehensive'}</option>
                      <option value="attendance">{isArabic ? 'الحضور فقط' : 'Attendance Only'}</option>
                      <option value="financial">{isArabic ? 'مالي فقط' : 'Financial Only'}</option>
                      <option value="performance">{isArabic ? 'الأداء فقط' : 'Performance Only'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'تجميع البيانات حسب' : 'Group Data By'}
                    </label>
                    <select 
                      value={customGroupBy}
                      onChange={(e) => setCustomGroupBy(e.target.value as any)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="employee">{isArabic ? 'الموظف' : 'Employee'}</option>
                      <option value="project">{isArabic ? 'المشروع' : 'Project'}</option>
                      <option value="trade">{isArabic ? 'المهنة' : 'Trade'}</option>
                      <option value="nationality">{isArabic ? 'الجنسية' : 'Nationality'}</option>
                    </select>
                  </div>
                </div>

                {/* Project Filter */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'تصفية المشروع' : 'Project Filter'}
                    </label>
                    <select 
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">{isArabic ? 'جميع المشاريع' : 'All Projects'}</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Additional Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-800">{isArabic ? 'خيارات إضافية' : 'Additional Options'}</h5>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={customIncludeCharts}
                          onChange={(e) => setCustomIncludeCharts(e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">
                          {isArabic ? 'تضمين الرسوم البيانية' : 'Include Charts & Visualizations'}
                        </span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={customIncludeSignatures}
                          onChange={(e) => setCustomIncludeSignatures(e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">
                          {isArabic ? 'تضمين مساحات التوقيع' : 'Include Signature Sections'}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-800">{isArabic ? 'معاينة الإعدادات' : 'Configuration Preview'}</h5>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'الفترة:' : 'Period:'}</span>
                        <span className="font-medium">{customStartDate} to {customEndDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'النوع:' : 'Type:'}</span>
                        <span className="font-medium capitalize">{customReportType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'التجميع:' : 'Grouping:'}</span>
                        <span className="font-medium capitalize">{customGroupBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isArabic ? 'المشروع:' : 'Project:'}</span>
                        <span className="font-medium">
                          {selectedProject === 'all' ? (isArabic ? 'الكل' : 'All') : projects.find(p => p.id === selectedProject)?.name || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Report Actions */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {isArabic ? 'إجراءات التقرير المخصص' : 'Custom Report Actions'}
                  </h4>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handlePreviewCustomReport}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      {isArabic ? 'معاينة سريعة' : 'Quick Preview'}
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
                    >
                      <Printer className="w-4 h-4" />
                      {isArabic ? 'طباعة' : 'Print'}
                    </button>
                    <button 
                      onClick={handleGenerateCustomReport}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                    >
                      <FileText className="w-4 h-4" />
                      {isArabic ? 'إنشاء التقرير المخصص' : 'Generate Custom Report'}
                    </button>
                  </div>
                </div>
                
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h5 className="font-semibold text-indigo-800 mb-2">
                    {isArabic ? 'ميزات التقرير المخصص' : 'Custom Report Features'}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-700">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>{isArabic ? 'تحليل مالي شامل' : 'Comprehensive financial analysis'}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>{isArabic ? 'تجميع البيانات المرن' : 'Flexible data grouping'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>{isArabic ? 'تحليل الأداء المتقدم' : 'Advanced performance analytics'}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>{isArabic ? 'توصيات استراتيجية' : 'Strategic recommendations'}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>{isArabic ? 'تصدير احترافي' : 'Professional export format'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>{isArabic ? 'مراجع البيانات' : 'Data source references'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Preview Modal */}
      {showReportPreview && generatedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-screen overflow-y-auto m-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? 'معاينة التقرير اليومي' : 'Daily Report Preview'}
              </h3>
              <button 
                onClick={() => setShowReportPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Report Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {isArabic ? 'تقرير الحضور اليومي' : 'DAILY ATTENDANCE REPORT'}
                </h2>
                <p className="text-gray-600">
                  {isArabic ? 'شركة أموجك المجمعة للعمليات والمقاولات العامة' : 'HRMS Operations & General Contracting'}
                </p>
                <p className="text-sm text-gray-500">
                  {isArabic ? 'التاريخ:' : 'Date:'} {new Date(generatedReport.date).toLocaleDateString()} | 
                  {isArabic ? 'المشروع:' : 'Project:'} {generatedReport.project}
                </p>
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">{generatedReport.metrics.presentEmployees}</div>
                  <div className="text-sm text-blue-700">{isArabic ? 'حاضر' : 'Present'}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900">{generatedReport.metrics.totalHours.toFixed(1)}</div>
                  <div className="text-sm text-green-700">{isArabic ? 'إجمالي الساعات' : 'Total Hours'}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900">
                    {formatCurrency(generatedReport.metrics.totalRevenue).replace('SAR', '').trim()}
                  </div>
                  <div className="text-sm text-purple-700">{isArabic ? 'الإيرادات' : 'Revenue'}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <TrendingUp className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-900">
                    {formatPercentage(generatedReport.metrics.profitMargin)}
                  </div>
                  <div className="text-sm text-yellow-700">{isArabic ? 'هامش الربح' : 'Profit Margin'}</div>
                </div>
              </div>

              {/* Employee Details Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        {isArabic ? 'الموظف' : 'Employee'}
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        {isArabic ? 'المهنة' : 'Trade'}
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">
                        {isArabic ? 'المشروع' : 'Project'}
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">
                        {isArabic ? 'الساعات' : 'Hours'}
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">
                        {isArabic ? 'التكلفة' : 'Cost'}
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">
                        {isArabic ? 'الإيرادات' : 'Revenue'}
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">
                        {isArabic ? 'الربح' : 'Profit'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {generatedReport.metrics.employeeDetails.map((detail: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{detail.employee.name}</div>
                          <div className="text-xs text-gray-500">{detail.employee.employeeId}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{detail.employee.trade}</td>
                        <td className="px-4 py-3 text-gray-700">{detail.project?.name || 'Unassigned'}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="font-medium">{(detail.attendance.hoursWorked + detail.attendance.overtime).toFixed(1)}</div>
                          <div className="text-xs text-gray-500">
                            {detail.attendance.hoursWorked}h + {detail.attendance.overtime}h OT
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-red-600">
                          {formatCurrency(detail.financials.laborCost)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-green-600">
                          {formatCurrency(detail.financials.revenue)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-blue-600">
                          {formatCurrency(detail.financials.profit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons in Preview */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={generateDailyReport}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {isArabic ? 'تحميل التقرير' : 'Download Report'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  {isArabic ? 'طباعة' : 'Print'}
                </button>
                <button
                  onClick={() => setShowReportPreview(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  {isArabic ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};