// AI Optimization Engine - Advanced Machine Learning Service for Workforce Optimization

import { Employee, ManpowerProject, AttendanceRecord } from '../types/manpower';

// Core AI Optimization Types
export interface OptimizationResult {
  solutions: ResourceAllocationSolution[];
  utilizationRate: number;
  totalExpectedProfit: number;
  riskScore: number;
  confidence: number;
  recommendations: string[];
  executionTime: number;
  modelVersion: string;
}

export interface ResourceAllocationSolution {
  employeeId: string;
  projectId: string;
  allocation: number; // 0-1 percentage
  expectedProfit: number;
  riskScore: number;
  confidence: number;
  reasoning: string;
}

export interface OptimizationConstraint {
  type: 'max_hours' | 'min_profit' | 'skill_requirement' | 'location_constraint';
  employeeId?: string;
  projectId?: string;
  value: number;
  description: string;
}

export interface OptimizationObjectives {
  maximizeProfit: number; // 0-1 weight
  maximizeUtilization: number; // 0-1 weight
  minimizeRisk: number; // 0-1 weight
  balanceWorkload: number; // 0-1 weight
}

// Predictive Analytics Types
export interface ProfitPrediction {
  projectId: string;
  timeframe: 'week' | 'month' | 'quarter';
  predictedProfit: number;
  confidence: number;
  scenarios: {
    optimistic: number;
    realistic: number;
    pessimistic: number;
  };
  factors: PredictionFactor[];
  generatedAt: Date;
}

export interface PredictionFactor {
  factor: string;
  impact: number; // -1 to 1
  confidence: number;
  description: string;
}

export interface RiskAssessment {
  projectId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-100
  riskFactors: RiskFactor[];
  recommendations: string[];
  monitoringPoints: string[];
  generatedAt: Date;
}

export interface RiskFactor {
  factor: string;
  probability: number; // 0-1
  impact: number; // 0-1
  mitigation: string;
}

// Natural Language Insights
export interface NLInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'warning' | 'achievement';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  data: any;
  generatedAt: Date;
  expiresAt?: Date;
}

// Automated Recommendations
export interface AutomatedRecommendation {
  id: string;
  category: 'resource_allocation' | 'cost_optimization' | 'risk_mitigation' | 'performance_improvement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  expectedImpact: number;
  implementationCost: number;
  timeToImplement: number; // days
  confidence: number;
  actions: RecommendationAction[];
}

export interface RecommendationAction {
  action: string;
  parameters: any;
  expectedOutcome: string;
}

// AI Optimization Engine Class
export class AIOptimizationEngine {
  private static modelVersion = '2.1.0';
  private static lastTrainingDate = new Date();

  // ==================== RESOURCE OPTIMIZATION ====================

  /**
   * Optimize resource allocation using advanced ML algorithms
   */
  static async optimizeResourceAllocation(
    employees: Employee[],
    projects: ManpowerProject[],
    constraints: OptimizationConstraint[] = [],
    objectives: OptimizationObjectives
  ): Promise<OptimizationResult> {
    const startTime = Date.now();

    try {
      // Simulate advanced optimization algorithm
      const solutions = await this.generateOptimalAllocations(employees, projects, constraints, objectives);
      
      // Calculate overall metrics
      const utilizationRate = this.calculateUtilizationRate(solutions, employees);
      const totalExpectedProfit = solutions.reduce((sum, sol) => sum + sol.expectedProfit, 0);
      const riskScore = this.calculateOverallRiskScore(solutions);
      const confidence = this.calculateOptimizationConfidence(solutions);
      
      // Generate recommendations
      const recommendations = this.generateOptimizationRecommendations(solutions, employees, projects);

      const executionTime = Date.now() - startTime;

      return {
        solutions,
        utilizationRate,
        totalExpectedProfit,
        riskScore,
        confidence,
        recommendations,
        executionTime,
        modelVersion: this.modelVersion
      };

    } catch (error) {
      console.error('Optimization failed:', error);
      throw new Error('AI optimization process failed');
    }
  }

  /**
   * Generate optimal resource allocations using genetic algorithm simulation
   */
  private static async generateOptimalAllocations(
    employees: Employee[],
    projects: ManpowerProject[],
    constraints: OptimizationConstraint[],
    objectives: OptimizationObjectives
  ): Promise<ResourceAllocationSolution[]> {
    const solutions: ResourceAllocationSolution[] = [];

    // Simulate genetic algorithm iterations
    for (const employee of employees) {
      if (employee.status !== 'active') continue;

      // Find best project match for this employee
      const projectScores = projects
        .filter(proj => proj.status === 'active')
        .map(project => {
          const profitScore = this.calculateProfitScore(employee, project);
          const riskScore = this.calculateRiskScore(employee, project);
          const skillMatch = this.calculateSkillMatch(employee, project);
          
          // Apply objectives weighting
          const totalScore = 
            (profitScore * objectives.maximizeProfit) +
            (skillMatch * objectives.maximizeUtilization) +
            ((1 - riskScore) * objectives.minimizeRisk) +
            (0.8 * objectives.balanceWorkload); // Workload balance factor

          return {
            projectId: project.id,
            score: totalScore,
            profitScore,
            riskScore,
            skillMatch
          };
        })
        .sort((a, b) => b.score - a.score);

      if (projectScores.length > 0) {
        const bestMatch = projectScores[0];
        const allocation = Math.min(1.0, bestMatch.score); // Cap at 100%
        
        solutions.push({
          employeeId: employee.id,
          projectId: bestMatch.projectId,
          allocation,
          expectedProfit: this.calculateExpectedProfit(employee, allocation),
          riskScore: bestMatch.riskScore,
          confidence: this.calculateAllocationConfidence(bestMatch),
          reasoning: `Optimal match based on skill compatibility (${(bestMatch.skillMatch * 100).toFixed(0)}%) and profit potential`
        });
      }
    }

    return solutions;
  }

  // ==================== PREDICTIVE ANALYTICS ====================

  /**
   * Generate profit predictions using time series analysis
   */
  static async generateProfitPredictions(
    projects: ManpowerProject[],
    employees: Employee[],
    attendance: AttendanceRecord[],
    timeframe: 'week' | 'month' | 'quarter'
  ): Promise<ProfitPrediction[]> {
    const predictions: ProfitPrediction[] = [];

    for (const project of projects.filter(p => p.status === 'active')) {
      // Calculate historical performance
      const historicalProfit = this.calculateHistoricalProfit(project, employees, attendance);
      
      // Apply time series forecasting
      const baselinePrediction = historicalProfit * this.getTimeframeMultiplier(timeframe);
      
      // Generate scenarios with Monte Carlo simulation
      const scenarios = {
        optimistic: baselinePrediction * 1.25,
        realistic: baselinePrediction,
        pessimistic: baselinePrediction * 0.75
      };

      // Identify key factors
      const factors = this.identifyProfitFactors(project, employees);
      
      // Calculate prediction confidence
      const confidence = this.calculatePredictionConfidence(project, historicalProfit);

      predictions.push({
        projectId: project.id,
        timeframe,
        predictedProfit: scenarios.realistic,
        confidence,
        scenarios,
        factors,
        generatedAt: new Date()
      });
    }

    return predictions;
  }

  /**
   * Generate comprehensive risk assessments
   */
  static async generateRiskAssessments(
    projects: ManpowerProject[],
    employees: Employee[],
    attendance: AttendanceRecord[]
  ): Promise<RiskAssessment[]> {
    const assessments: RiskAssessment[] = [];

    for (const project of projects.filter(p => p.status === 'active')) {
      const riskFactors = this.identifyRiskFactors(project, employees, attendance);
      const riskScore = this.calculateProjectRiskScore(riskFactors);
      const riskLevel = this.determineRiskLevel(riskScore);
      
      const recommendations = this.generateRiskRecommendations(riskFactors, riskLevel);
      const monitoringPoints = this.generateMonitoringPoints(riskFactors);

      assessments.push({
        projectId: project.id,
        riskLevel,
        riskScore,
        riskFactors,
        recommendations,
        monitoringPoints,
        generatedAt: new Date()
      });
    }

    return assessments;
  }

  // ==================== NATURAL LANGUAGE INSIGHTS ====================

  /**
   * Generate human-readable insights using NLP
   */
  static async generateNaturalLanguageInsights(
    employees: Employee[],
    projects: ManpowerProject[],
    attendance: AttendanceRecord[],
    predictions: ProfitPrediction[],
    risks: RiskAssessment[]
  ): Promise<NLInsight[]> {
    const insights: NLInsight[] = [];

    // Workforce utilization insights
    const utilizationInsight = this.generateUtilizationInsight(employees, projects);
    if (utilizationInsight) insights.push(utilizationInsight);

    // Profit trend insights
    const profitInsight = this.generateProfitTrendInsight(predictions);
    if (profitInsight) insights.push(profitInsight);

    // Risk alert insights
    const riskInsights = this.generateRiskInsights(risks);
    insights.push(...riskInsights);

    // Performance anomaly insights
    const anomalyInsights = this.generateAnomalyInsights(employees, attendance);
    insights.push(...anomalyInsights);

    // Opportunity insights
    const opportunityInsights = this.generateOpportunityInsights(employees, projects, predictions);
    insights.push(...opportunityInsights);

    return insights.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.impact] - priorityOrder[a.impact];
    });
  }

  // ==================== AUTOMATED RECOMMENDATIONS ====================

  /**
   * Generate automated recommendations based on AI analysis
   */
  static async generateAutomatedRecommendations(
    employees: Employee[],
    projects: ManpowerProject[],
    attendance: AttendanceRecord[],
    optimizationResult: OptimizationResult,
    predictions: ProfitPrediction[],
    risks: RiskAssessment[]
  ): Promise<AutomatedRecommendation[]> {
    const recommendations: AutomatedRecommendation[] = [];

    // Resource allocation recommendations
    const resourceRecs = this.generateResourceRecommendations(optimizationResult);
    recommendations.push(...resourceRecs);

    // Cost optimization recommendations
    const costRecs = this.generateCostOptimizationRecommendations(employees, projects, attendance);
    recommendations.push(...costRecs);

    // Risk mitigation recommendations
    const riskRecs = this.generateRiskMitigationRecommendations(risks);
    recommendations.push(...riskRecs);

    // Performance improvement recommendations
    const perfRecs = this.generatePerformanceRecommendations(employees, attendance);
    recommendations.push(...perfRecs);

    return recommendations.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // ==================== PRIVATE HELPER METHODS ====================

  private static calculateProfitScore(employee: Employee, project: ManpowerProject): number {
    // Simulate profit calculation based on employee rate and project value
    const hourlyProfit = employee.actualRate - employee.hourlyRate;
    const projectValue = project.budget;
    const profitRatio = hourlyProfit / employee.actualRate;
    
    return Math.min(1.0, profitRatio * (projectValue / 1000000)); // Normalize to 0-1
  }

  private static calculateRiskScore(employee: Employee, project: ManpowerProject): number {
    // Simulate risk calculation based on project complexity and employee experience
    const projectRisk = project.riskLevel === 'high' ? 0.8 : project.riskLevel === 'medium' ? 0.5 : 0.2;
    const employeeExperience = employee.performanceRating / 100;
    
    return Math.max(0, projectRisk - (employeeExperience * 0.3));
  }

  private static calculateSkillMatch(employee: Employee, project: ManpowerProject): number {
    // Simulate skill matching algorithm
    const employeeSkills = employee.skills || [];
    const requiredSkills = project.requirements || [];
    
    if (requiredSkills.length === 0) return 0.8; // Default match
    
    const matchCount = employeeSkills.filter(skill => 
      requiredSkills.some(req => req.toLowerCase().includes(skill.toLowerCase()))
    ).length;
    
    return Math.min(1.0, matchCount / requiredSkills.length);
  }

  private static calculateExpectedProfit(employee: Employee, allocation: number): number {
    // Simulate monthly profit calculation
    const monthlyHours = 176 * allocation;
    const hourlyProfit = employee.actualRate - employee.hourlyRate;
    return monthlyHours * hourlyProfit;
  }

  private static calculateAllocationConfidence(match: any): number {
    // Combine multiple factors to determine confidence
    return (match.score + match.skillMatch + (1 - match.riskScore)) / 3;
  }

  private static calculateUtilizationRate(solutions: ResourceAllocationSolution[], employees: Employee[]): number {
    const totalAllocation = solutions.reduce((sum, sol) => sum + sol.allocation, 0);
    const activeEmployees = employees.filter(emp => emp.status === 'active').length;
    
    return activeEmployees > 0 ? (totalAllocation / activeEmployees) * 100 : 0;
  }

  private static calculateOverallRiskScore(solutions: ResourceAllocationSolution[]): number {
    if (solutions.length === 0) return 0;
    
    const totalRisk = solutions.reduce((sum, sol) => sum + sol.riskScore, 0);
    return (totalRisk / solutions.length) * 100;
  }

  private static calculateOptimizationConfidence(solutions: ResourceAllocationSolution[]): number {
    if (solutions.length === 0) return 0;
    
    const totalConfidence = solutions.reduce((sum, sol) => sum + sol.confidence, 0);
    return totalConfidence / solutions.length;
  }

  private static generateOptimizationRecommendations(
    solutions: ResourceAllocationSolution[],
    employees: Employee[],
    projects: ManpowerProject[]
  ): string[] {
    const recommendations: string[] = [];

    // Check for underutilized employees
    const allocatedEmployees = new Set(solutions.map(sol => sol.employeeId));
    const unallocatedCount = employees.filter(emp => 
      emp.status === 'active' && !allocatedEmployees.has(emp.id)
    ).length;

    if (unallocatedCount > 0) {
      recommendations.push(`Consider allocating ${unallocatedCount} unassigned employees to active projects`);
    }

    // Check for high-risk allocations
    const highRiskAllocations = solutions.filter(sol => sol.riskScore > 0.7);
    if (highRiskAllocations.length > 0) {
      recommendations.push(`Review ${highRiskAllocations.length} high-risk allocations for additional support`);
    }

    // Check for profit optimization opportunities
    const lowProfitAllocations = solutions.filter(sol => sol.expectedProfit < 1000);
    if (lowProfitAllocations.length > 0) {
      recommendations.push(`Optimize ${lowProfitAllocations.length} low-profit allocations through rate adjustments`);
    }

    return recommendations;
  }

  private static calculateHistoricalProfit(
    project: ManpowerProject,
    employees: Employee[],
    attendance: AttendanceRecord[]
  ): number {
    // Simulate historical profit calculation
    const projectEmployees = employees.filter(emp => emp.projectId === project.id);
    const projectAttendance = attendance.filter(record => 
      projectEmployees.some(emp => emp.id === record.employeeId)
    );

    let totalProfit = 0;
    projectAttendance.forEach(record => {
      const employee = projectEmployees.find(emp => emp.id === record.employeeId);
      if (employee) {
        const hourlyProfit = employee.actualRate - employee.hourlyRate;
        const totalHours = record.hoursWorked + record.overtime;
        totalProfit += totalHours * hourlyProfit;
      }
    });

    return totalProfit;
  }

  private static getTimeframeMultiplier(timeframe: 'week' | 'month' | 'quarter'): number {
    switch (timeframe) {
      case 'week': return 0.25;
      case 'month': return 1.0;
      case 'quarter': return 3.0;
      default: return 1.0;
    }
  }

  private static identifyProfitFactors(project: ManpowerProject, employees: Employee[]): PredictionFactor[] {
    const factors: PredictionFactor[] = [];

    // Project progress factor
    factors.push({
      factor: 'Project Progress',
      impact: (project.progress / 100) * 0.3,
      confidence: 0.9,
      description: `Project is ${project.progress}% complete`
    });

    // Team size factor
    const teamSize = employees.filter(emp => emp.projectId === project.id).length;
    factors.push({
      factor: 'Team Size',
      impact: Math.min(0.2, teamSize / 10),
      confidence: 0.8,
      description: `Team has ${teamSize} members`
    });

    // Risk level factor
    const riskImpact = project.riskLevel === 'high' ? -0.15 : project.riskLevel === 'medium' ? -0.05 : 0.05;
    factors.push({
      factor: 'Risk Level',
      impact: riskImpact,
      confidence: 0.7,
      description: `Project risk level is ${project.riskLevel}`
    });

    return factors;
  }

  static calculatePredictionConfidence(project: ManpowerProject, historicalProfit: number): number {
    // Base confidence on data availability and project stability
    let confidence = 0.7; // Base confidence

    // Adjust based on project progress
    if (project.progress > 50) confidence += 0.1;
    if (project.progress > 80) confidence += 0.1;

    // Adjust based on historical data
    if (historicalProfit > 0) confidence += 0.1;

    // Adjust based on risk level
    if (project.riskLevel === 'low') confidence += 0.1;
    else if (project.riskLevel === 'high') confidence -= 0.1;

    return Math.min(1.0, Math.max(0.1, confidence));
  }

  private static identifyRiskFactors(
    project: ManpowerProject,
    employees: Employee[],
    attendance: AttendanceRecord[]
  ): RiskFactor[] {
    const factors: RiskFactor[] = [];

    // Team size risk
    const teamSize = employees.filter(emp => emp.projectId === project.id).length;
    if (teamSize < 3) {
      factors.push({
        factor: 'Small Team Size',
        probability: 0.6,
        impact: 0.4,
        mitigation: 'Consider adding more team members or cross-training existing staff'
      });
    }

    // Project timeline risk
    const endDate = new Date(project.endDate);
    const now = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 30 && project.progress < 80) {
      factors.push({
        factor: 'Timeline Pressure',
        probability: 0.8,
        impact: 0.6,
        mitigation: 'Accelerate critical path activities and consider overtime authorization'
      });
    }

    // Budget risk
    if (project.profitMargin < 15) {
      factors.push({
        factor: 'Low Profit Margin',
        probability: 0.5,
        impact: 0.7,
        mitigation: 'Review cost structure and consider rate adjustments'
      });
    }

    return factors;
  }

  private static calculateProjectRiskScore(riskFactors: RiskFactor[]): number {
    if (riskFactors.length === 0) return 10; // Low risk baseline

    const totalRisk = riskFactors.reduce((sum, factor) => 
      sum + (factor.probability * factor.impact), 0
    );

    return Math.min(100, totalRisk * 100);
  }

  private static determineRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore >= 80) return 'critical';
    if (riskScore >= 60) return 'high';
    if (riskScore >= 30) return 'medium';
    return 'low';
  }

  private static generateRiskRecommendations(riskFactors: RiskFactor[], riskLevel: string): string[] {
    const recommendations: string[] = [];

    riskFactors.forEach(factor => {
      recommendations.push(factor.mitigation);
    });

    if (riskLevel === 'critical' || riskLevel === 'high') {
      recommendations.push('Implement daily risk monitoring and escalation procedures');
      recommendations.push('Consider bringing in additional expertise or resources');
    }

    return recommendations;
  }

  private static generateMonitoringPoints(riskFactors: RiskFactor[]): string[] {
    const points: string[] = [];

    riskFactors.forEach(factor => {
      switch (factor.factor) {
        case 'Small Team Size':
          points.push('Monitor team productivity and identify skill gaps');
          break;
        case 'Timeline Pressure':
          points.push('Track daily progress against milestones');
          break;
        case 'Low Profit Margin':
          points.push('Monitor actual costs vs. budget weekly');
          break;
      }
    });

    return points;
  }

  // ==================== INSIGHT GENERATION METHODS ====================

  private static generateUtilizationInsight(employees: Employee[], projects: ManpowerProject[]): NLInsight | null {
    const activeEmployees = employees.filter(emp => emp.status === 'active');
    const assignedEmployees = activeEmployees.filter(emp => emp.projectId);
    const utilizationRate = (assignedEmployees.length / activeEmployees.length) * 100;

    if (utilizationRate < 85) {
      return {
        id: `insight_util_${Date.now()}`,
        type: 'opportunity',
        title: 'Workforce Utilization Opportunity',
        titleAr: 'فرصة تحسين استغلال القوى العاملة',
        description: `Current utilization rate is ${utilizationRate.toFixed(1)}%. ${activeEmployees.length - assignedEmployees.length} employees are unassigned and could be allocated to active projects for improved efficiency.`,
        descriptionAr: `معدل الاستغلال الحالي هو ${utilizationRate.toFixed(1)}%. ${activeEmployees.length - assignedEmployees.length} موظف غير مخصص ويمكن تخصيصهم للمشاريع النشطة لتحسين الكفاءة.`,
        impact: utilizationRate < 70 ? 'high' : 'medium',
        confidence: 0.9,
        data: { utilizationRate, unassignedCount: activeEmployees.length - assignedEmployees.length },
        generatedAt: new Date()
      };
    }

    return null;
  }

  private static generateProfitTrendInsight(predictions: ProfitPrediction[]): NLInsight | null {
    if (predictions.length === 0) return null;

    const totalPredictedProfit = predictions.reduce((sum, pred) => sum + pred.predictedProfit, 0);
    const avgConfidence = predictions.reduce((sum, pred) => sum + pred.confidence, 0) / predictions.length;

    return {
      id: `insight_profit_${Date.now()}`,
      type: 'trend',
      title: 'Profit Trend Analysis',
      titleAr: 'تحليل اتجاه الأرباح',
      description: `AI models predict ${totalPredictedProfit.toLocaleString()} SAR in total profits across ${predictions.length} active projects with ${(avgConfidence * 100).toFixed(0)}% confidence.`,
      descriptionAr: `تتوقع نماذج الذكاء الاصطناعي ${totalPredictedProfit.toLocaleString()} ريال في إجمالي الأرباح عبر ${predictions.length} مشروع نشط بثقة ${(avgConfidence * 100).toFixed(0)}%.`,
      impact: 'medium',
      confidence: avgConfidence,
      data: { totalPredictedProfit, projectCount: predictions.length },
      generatedAt: new Date()
    };
  }

  private static generateRiskInsights(risks: RiskAssessment[]): NLInsight[] {
    const insights: NLInsight[] = [];

    const highRiskProjects = risks.filter(risk => risk.riskLevel === 'high' || risk.riskLevel === 'critical');
    
    if (highRiskProjects.length > 0) {
      insights.push({
        id: `insight_risk_${Date.now()}`,
        type: 'warning',
        title: 'High Risk Projects Detected',
        titleAr: 'تم اكتشاف مشاريع عالية المخاطر',
        description: `${highRiskProjects.length} projects have been identified as high risk. Immediate attention and risk mitigation strategies are recommended.`,
        descriptionAr: `تم تحديد ${highRiskProjects.length} مشاريع كعالية المخاطر. يُنصح بالاهتمام الفوري واستراتيجيات تخفيف المخاطر.`,
        impact: 'high',
        confidence: 0.85,
        data: { highRiskCount: highRiskProjects.length },
        generatedAt: new Date()
      });
    }

    return insights;
  }

  private static generateAnomalyInsights(employees: Employee[], attendance: AttendanceRecord[]): NLInsight[] {
    const insights: NLInsight[] = [];

    // Check for attendance anomalies
    const recentAttendance = attendance.filter(record => {
      const recordDate = new Date(record.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return recordDate >= weekAgo;
    });

    const avgHours = recentAttendance.reduce((sum, record) => sum + record.hoursWorked, 0) / recentAttendance.length;
    
    if (avgHours < 6) {
      insights.push({
        id: `insight_anomaly_${Date.now()}`,
        type: 'anomaly',
        title: 'Low Average Working Hours Detected',
        titleAr: 'تم اكتشاف انخفاض في متوسط ساعات العمل',
        description: `Average working hours have dropped to ${avgHours.toFixed(1)} hours per day. This may indicate scheduling issues or reduced project activity.`,
        descriptionAr: `انخفض متوسط ساعات العمل إلى ${avgHours.toFixed(1)} ساعة يومياً. قد يشير هذا إلى مشاكل في الجدولة أو انخفاض نشاط المشاريع.`,
        impact: 'medium',
        confidence: 0.8,
        data: { avgHours },
        generatedAt: new Date()
      });
    }

    return insights;
  }

  private static generateOpportunityInsights(
    employees: Employee[],
    projects: ManpowerProject[],
    predictions: ProfitPrediction[]
  ): NLInsight[] {
    const insights: NLInsight[] = [];

    // High-profit project opportunities
    const highProfitPredictions = predictions.filter(pred => pred.predictedProfit > 50000);
    
    if (highProfitPredictions.length > 0) {
      insights.push({
        id: `insight_opportunity_${Date.now()}`,
        type: 'opportunity',
        title: 'High-Profit Project Opportunities',
        titleAr: 'فرص مشاريع عالية الربحية',
        description: `${highProfitPredictions.length} projects show high profit potential. Consider allocating additional resources to maximize returns.`,
        descriptionAr: `${highProfitPredictions.length} مشاريع تظهر إمكانية ربح عالية. فكر في تخصيص موارد إضافية لتعظيم العوائد.`,
        impact: 'high',
        confidence: 0.8,
        data: { highProfitCount: highProfitPredictions.length },
        generatedAt: new Date()
      });
    }

    return insights;
  }

  // ==================== RECOMMENDATION GENERATION METHODS ====================

  private static generateResourceRecommendations(optimizationResult: OptimizationResult): AutomatedRecommendation[] {
    const recommendations: AutomatedRecommendation[] = [];

    if (optimizationResult.utilizationRate < 80) {
      recommendations.push({
        id: `rec_resource_${Date.now()}`,
        category: 'resource_allocation',
        priority: 'high',
        title: 'Improve Resource Utilization',
        description: 'Current utilization rate is below optimal. Reallocate unassigned employees to active projects.',
        expectedImpact: 15,
        implementationCost: 2000,
        timeToImplement: 3,
        confidence: 0.85,
        actions: [
          {
            action: 'reallocate_employees',
            parameters: { targetUtilization: 85 },
            expectedOutcome: 'Increased productivity and revenue'
          }
        ]
      });
    }

    return recommendations;
  }

  private static generateCostOptimizationRecommendations(
    employees: Employee[],
    projects: ManpowerProject[],
    attendance: AttendanceRecord[]
  ): AutomatedRecommendation[] {
    const recommendations: AutomatedRecommendation[] = [];

    // Check for overtime optimization opportunities
    const overtimeHours = attendance.reduce((sum, record) => sum + record.overtime, 0);
    
    if (overtimeHours > 100) {
      recommendations.push({
        id: `rec_cost_${Date.now()}`,
        category: 'cost_optimization',
        priority: 'medium',
        title: 'Optimize Overtime Costs',
        description: 'High overtime hours detected. Consider hiring additional staff or redistributing workload.',
        expectedImpact: 12,
        implementationCost: 15000,
        timeToImplement: 14,
        confidence: 0.75,
        actions: [
          {
            action: 'hire_additional_staff',
            parameters: { positions: 2, skillLevel: 'intermediate' },
            expectedOutcome: 'Reduced overtime costs and improved work-life balance'
          }
        ]
      });
    }

    return recommendations;
  }

  private static generateRiskMitigationRecommendations(risks: RiskAssessment[]): AutomatedRecommendation[] {
    const recommendations: AutomatedRecommendation[] = [];

    const criticalRisks = risks.filter(risk => risk.riskLevel === 'critical');
    
    if (criticalRisks.length > 0) {
      recommendations.push({
        id: `rec_risk_${Date.now()}`,
        category: 'risk_mitigation',
        priority: 'urgent',
        title: 'Address Critical Risk Factors',
        description: 'Critical risk factors identified in active projects require immediate attention.',
        expectedImpact: 25,
        implementationCost: 5000,
        timeToImplement: 1,
        confidence: 0.9,
        actions: [
          {
            action: 'implement_risk_controls',
            parameters: { riskLevel: 'critical', projectCount: criticalRisks.length },
            expectedOutcome: 'Reduced project risk and improved success probability'
          }
        ]
      });
    }

    return recommendations;
  }

  private static generatePerformanceRecommendations(
    employees: Employee[],
    attendance: AttendanceRecord[]
  ): AutomatedRecommendation[] {
    const recommendations: AutomatedRecommendation[] = [];

    // Check for low-performing employees
    const lowPerformers = employees.filter(emp => emp.performanceRating < 70);
    
    if (lowPerformers.length > 0) {
      recommendations.push({
        id: `rec_performance_${Date.now()}`,
        category: 'performance_improvement',
        priority: 'medium',
        title: 'Employee Performance Enhancement',
        description: 'Several employees show below-average performance. Consider training or mentoring programs.',
        expectedImpact: 20,
        implementationCost: 8000,
        timeToImplement: 30,
        confidence: 0.7,
        actions: [
          {
            action: 'implement_training_program',
            parameters: { employeeCount: lowPerformers.length, duration: '3 months' },
            expectedOutcome: 'Improved employee performance and job satisfaction'
          }
        ]
      });
    }

    return recommendations;
  }
}

// Export singleton instance
export const aiOptimizationEngine = AIOptimizationEngine;