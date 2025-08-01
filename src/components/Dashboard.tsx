import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Truck, FileText, AlertTriangle, Calendar, DollarSign, CheckCircle, Building2, Target, BarChart3, PieChart, Activity, ArrowUp, ArrowDown, Eye, RefreshCw, Download, Filter, Settings, Shield, UserCheck, Calculator, Briefcase, Clock, Award, MapPin, Phone, Mail, Globe, Zap, TrendingUp as TrendingRight, UserPlus, UserMinus, GraduationCap, HardHat, Wrench, Star, Brain } from 'lucide-react';
import { NotificationCenter } from './notifications/NotificationCenter';
import { useNotifications } from '../hooks/useNotifications';

interface DashboardProps {
  isArabic: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ isArabic }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  
  // Notification system integration
  const {
    notifications,
    unreadCount,
    sendNotification
  } = useNotifications({ userId: 'current_user' });

  // Executive Summary Metrics
  const executiveSummary = {
    totalRevenue: 8400000,
    monthlyGrowth: 16.7,
    netProfit: 1980000,
    profitMargin: 23.6,
    activeContracts: 24,
    totalEmployees: 186,
    vehicleFleet: 47,
    operationalEfficiency: 94.2,
    clientSatisfaction: 4.7,
    safetyScore: 96.8
  };

  // Financial Department Metrics
  const financialMetrics = {
    revenue: {
      current: 8400000,
      previous: 7200000,
      growth: 16.7,
      target: 9000000
    },
    profit: {
      current: 1980000,
      previous: 1650000,
      growth: 20.0,
      margin: 23.6
    },
    cashFlow: {
      current: 2150000,
      previous: 1890000,
      growth: 13.8
    },
    expenses: {
      current: 6420000,
      previous: 5550000,
      growth: 15.7
    },
    accountsReceivable: 2800000,
    accountsPayable: 1650000,
    vatCollected: 1260000,
    profitability: 94.2
  };

  // Sales & Marketing Metrics
  const salesMetrics = {
    leadsGenerated: {
      current: 47,
      previous: 38,
      growth: 23.7
    },
    conversionRate: {
      current: 32.1,
      previous: 28.5,
      growth: 12.6
    },
    customerAcquisitionCost: {
      current: 12500,
      previous: 15200,
      growth: -17.8
    },
    contractsWon: {
      current: 15,
      previous: 11,
      growth: 36.4
    },
    pipelineValue: 4200000,
    averageDealSize: 280000,
    salesCycleLength: 45,
    clientRetentionRate: 91.3
  };

  // Operations Department Metrics
  const operationsMetrics = {
    projectEfficiency: {
      current: 94.2,
      previous: 89.1,
      growth: 5.7
    },
    workforceUtilization: {
      current: 87.3,
      previous: 82.8,
      growth: 5.4
    },
    fleetUtilization: {
      current: 91.5,
      previous: 88.2,
      growth: 3.7
    },
    safetyScore: {
      current: 96.8,
      previous: 94.2,
      growth: 2.8
    },
    activeProjects: 24,
    completedProjects: 42,
    onTimeDelivery: 89.5,
    qualityScore: 95.2
  };

  // Enhanced Manpower Department Metrics
  const manpowerMetrics = {
    totalWorkforce: {
      current: 186,
      previous: 175,
      growth: 6.3,
      target: 200
    },
    activeWorkers: {
      current: 175,
      previous: 168,
      growth: 4.2
    },
    skillCategories: {
      skilled: {
        count: 78,
        percentage: 41.9,
        growth: 8.3,
        avgSalary: 4200
      },
      semiSkilled: {
        count: 65,
        percentage: 34.9,
        growth: 5.1,
        avgSalary: 3200
      },
      general: {
        count: 43,
        percentage: 23.1,
        growth: 3.8,
        avgSalary: 2400
      }
    },
    recruitment: {
      newHires: {
        current: 12,
        previous: 8,
        growth: 50.0
      },
      turnoverRate: {
        current: 8.5,
        previous: 12.3,
        growth: -30.9
      },
      timeToHire: {
        current: 18,
        previous: 24,
        growth: -25.0
      },
      costPerHire: {
        current: 2800,
        previous: 3200,
        growth: -12.5
      }
    },
    training: {
      totalHours: {
        current: 2340,
        previous: 1980,
        growth: 18.2
      },
      completionRate: {
        current: 89.5,
        previous: 84.2,
        growth: 6.3
      },
      certifications: {
        current: 156,
        previous: 142,
        growth: 9.9
      },
      trainingCost: {
        current: 45000,
        previous: 38000,
        growth: 18.4
      }
    },
    performance: {
      excellentRating: {
        count: 67,
        percentage: 36.0
      },
      goodRating: {
        count: 89,
        percentage: 47.8
      },
      averageRating: {
        count: 25,
        percentage: 13.4
      },
      needsImprovement: {
        count: 5,
        percentage: 2.7
      }
    },
    attendance: {
      averageAttendance: {
        current: 94.8,
        previous: 92.1,
        growth: 2.9
      },
      punctuality: {
        current: 91.2,
        previous: 88.7,
        growth: 2.8
      },
      absenteeism: {
        current: 5.2,
        previous: 7.9,
        growth: -34.2
      },
      overtime: {
        current: 156,
        previous: 142,
        growth: 9.9
      }
    },
    compliance: {
      iqamaStatus: {
        valid: 171,
        expiringSoon: 15,
        expired: 0,
        complianceRate: 92.0
      },
      gosiRegistration: {
        registered: 186,
        pending: 0,
        complianceRate: 100.0
      },
      medicalInsurance: {
        covered: 182,
        pending: 4,
        complianceRate: 97.8
      },
      safetyTraining: {
        completed: 165,
        pending: 18,
        overdue: 3,
        complianceRate: 88.7
      }
    },
    deployment: {
      byClient: [
        { client: 'Saudi Aramco', clientAr: 'أرامكو السعودية', workers: 78, utilization: 94.2 },
        { client: 'SABIC Industries', clientAr: 'صناعات سابك', workers: 52, utilization: 89.1 },
        { client: 'NEOM Development', clientAr: 'تطوير نيوم', workers: 45, utilization: 91.8 },
        { client: 'Internal Projects', clientAr: 'مشاريع داخلية', workers: 11, utilization: 85.5 }
      ],
      byLocation: [
        { location: 'Riyadh Region', locationAr: 'منطقة الرياض', workers: 68, percentage: 36.6 },
        { location: 'Eastern Province', locationAr: 'المنطقة الشرقية', workers: 89, percentage: 47.8 },
        { location: 'Tabuk Province', locationAr: 'منطقة تبوك', workers: 29, percentage: 15.6 }
      ]
    },
    payroll: {
      totalPayroll: {
        current: 425000,
        previous: 398000,
        growth: 6.8
      },
      averageSalary: {
        current: 2285,
        previous: 2274,
        growth: 0.5
      },
      overtimeCost: {
        current: 15600,
        previous: 12800,
        growth: 21.9
      },
      benefits: {
        current: 34000,
        previous: 31800,
        growth: 6.9
      }
    }
  };

  // HR Department Metrics
  const hrMetrics = {
    totalEmployees: {
      current: 186,
      previous: 175,
      growth: 6.3
    },
    employeeTurnover: {
      current: 8.5,
      previous: 12.3,
      growth: -30.9
    },
    trainingHours: {
      current: 2340,
      previous: 1980,
      growth: 18.2
    },
    complianceScore: {
      current: 96,
      previous: 92,
      growth: 4.3
    },
    newHires: 12,
    iqamaRenewals: 15,
    gosiCompliance: 100,
    employeeSatisfaction: 4.6
  };

  // Fleet Management Metrics
  const fleetMetrics = {
    totalVehicles: {
      current: 47,
      previous: 44,
      growth: 6.8
    },
    utilization: {
      current: 91.5,
      previous: 88.2,
      growth: 3.7
    },
    maintenanceCost: {
      current: 125000,
      previous: 142000,
      growth: -12.0
    },
    fuelEfficiency: {
      current: 8.2,
      previous: 7.8,
      growth: 5.1
    },
    activeVehicles: 43,
    maintenanceScheduled: 8,
    breakdownIncidents: 2,
    averageAge: 3.2
  };

  // Customer Metrics
  const customerMetrics = {
    customerLifetimeValue: {
      current: 2850000,
      previous: 2420000,
      growth: 17.8
    },
    customerSatisfaction: {
      current: 4.7,
      previous: 4.4,
      growth: 6.8
    },
    contractRenewalRate: {
      current: 91.3,
      previous: 87.6,
      growth: 4.2
    },
    churnRate: {
      current: 8.7,
      previous: 12.4,
      growth: -29.8
    },
    totalClients: 24,
    newClients: 3,
    activeContracts: 24,
    contractValue: 12400000
  };

  // Compliance & Risk Metrics
  const complianceMetrics = {
    zatcaCompliance: 100,
    gosiCompliance: 100,
    qiwaCompliance: 92,
    molCompliance: 100,
    safetyIncidents: 0,
    auditScore: 96.5,
    riskLevel: 'Low',
    certificationStatus: 'Current'
  };

  // Recent Activities
  const recentActivities = [
    {
      titleEn: 'Major contract signed with NEOM',
      titleAr: 'توقيع عقد كبير مع نيوم',
      value: '2.1M SAR',
      time: '2 hours ago',
      type: 'contract',
      impact: 'high',
      department: 'Sales'
    },
    {
      titleEn: 'Fleet utilization reached 91.5%',
      titleAr: 'وصل استغلال الأسطول إلى 91.5%',
      value: '+3.7%',
      time: '4 hours ago',
      type: 'operations',
      impact: 'medium',
      department: 'Fleet'
    },
    {
      titleEn: 'Monthly payroll processed',
      titleAr: 'تم معالجة رواتب الشهر',
      value: '425K SAR',
      time: '1 day ago',
      type: 'finance',
      impact: 'medium',
      department: 'HR'
    },
    {
      titleEn: 'Safety score improved to 96.8%',
      titleAr: 'تحسن نقاط السلامة إلى 96.8%',
      value: '+2.8%',
      time: '2 days ago',
      type: 'safety',
      impact: 'high',
      department: 'Operations'
    },
    {
      titleEn: 'New lead from Aramco subsidiary',
      titleAr: 'عميل محتمل جديد من شركة تابعة لأرامكو',
      value: '850K SAR',
      time: '3 days ago',
      type: 'lead',
      impact: 'high',
      department: 'Sales'
    }
  ];

  // Upcoming Alerts
  const upcomingAlerts = [
    {
      titleEn: 'SABIC contract renewal due',
      titleAr: 'تجديد عقد سابك مستحق',
      date: 'Dec 20, 2024',
      priority: 'high',
      value: '850K SAR',
      department: 'Sales'
    },
    {
      titleEn: '15 Iqama renewals required',
      titleAr: 'مطلوب تجديد 15 إقامة',
      date: 'Dec 25, 2024',
      priority: 'medium',
      value: '15 employees',
      department: 'HR'
    },
    {
      titleEn: 'Vehicle maintenance scheduled',
      titleAr: 'صيانة مركبات مجدولة',
      date: 'Dec 22, 2024',
      priority: 'low',
      value: '8 vehicles',
      department: 'Fleet'
    },
    {
      titleEn: 'ZATCA compliance report due',
      titleAr: 'تقرير امتثال زاتكا مستحق',
      date: 'Dec 30, 2024',
      priority: 'high',
      value: 'Q4 Report',
      department: 'Finance'
    }
  ];

  // Department Performance Summary
  const departmentPerformance = [
    {
      name: 'Sales & Marketing',
      nameAr: 'المبيعات والتسويق',
      score: 92,
      trend: 'up',
      kpis: [
        { metric: 'Lead Conversion', value: '32.1%', change: '+12.6%' },
        { metric: 'Pipeline Value', value: '4.2M SAR', change: '+18.5%' },
        { metric: 'New Contracts', value: '15', change: '+36.4%' }
      ]
    },
    {
      name: 'Operations',
      nameAr: 'العمليات',
      score: 94,
      trend: 'up',
      kpis: [
        { metric: 'Project Efficiency', value: '94.2%', change: '+5.7%' },
        { metric: 'On-time Delivery', value: '89.5%', change: '+4.2%' },
        { metric: 'Quality Score', value: '95.2%', change: '+2.1%' }
      ]
    },
    {
      name: 'Finance',
      nameAr: 'المالية',
      score: 96,
      trend: 'up',
      kpis: [
        { metric: 'Profit Margin', value: '23.6%', change: '+2.1%' },
        { metric: 'Cash Flow', value: '2.15M SAR', change: '+13.8%' },
        { metric: 'Cost Control', value: '94.2%', change: '+3.5%' }
      ]
    },
    {
      name: 'Human Resources',
      nameAr: 'الموارد البشرية',
      score: 89,
      trend: 'up',
      kpis: [
        { metric: 'Employee Retention', value: '91.5%', change: '+4.2%' },
        { metric: 'Training Hours', value: '2,340', change: '+18.2%' },
        { metric: 'Compliance Score', value: '96%', change: '+4.3%' }
      ]
    },
    {
      name: 'Manpower Management',
      nameAr: 'إدارة القوى العاملة',
      score: 91,
      trend: 'up',
      kpis: [
        { metric: 'Workforce Utilization', value: '87.3%', change: '+5.4%' },
        { metric: 'Skill Development', value: '89.5%', change: '+6.3%' },
        { metric: 'Safety Compliance', value: '96.8%', change: '+2.8%' }
      ]
    },
    {
      name: 'Fleet Management',
      nameAr: 'إدارة الأسطول',
      score: 91,
      trend: 'up',
      kpis: [
        { metric: 'Fleet Utilization', value: '91.5%', change: '+3.7%' },
        { metric: 'Maintenance Cost', value: '125K SAR', change: '-12.0%' },
        { metric: 'Fuel Efficiency', value: '8.2 L/100km', change: '+5.1%' }
      ]
    }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const formatCurrency = (amount: number) => {
    return (amount / 1000000).toFixed(1) + 'M SAR';
  };

  const formatPercentage = (value: number) => {
    return value.toFixed(1) + '%';
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
  };

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'Sales': return <Target className="w-4 h-4" />;
      case 'Operations': return <Briefcase className="w-4 h-4" />;
      case 'Finance': return <DollarSign className="w-4 h-4" />;
      case 'HR': return <UserCheck className="w-4 h-4" />;
      case 'Fleet': return <Truck className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const MetricCard = ({ title, titleAr, value, previousValue, growth, icon: Icon, color, suffix = '' }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${getGrowthColor(growth)}`}>
          {getGrowthIcon(growth)}
          {Math.abs(growth).toFixed(1)}%
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {typeof value === 'number' && value > 1000000 ? formatCurrency(value) : value.toLocaleString()}{suffix}
      </h3>
      <p className="text-gray-600 font-medium">
        {isArabic ? titleAr : title}
      </p>
      <div className="mt-2 text-xs text-gray-500">
        {isArabic ? 'السابق:' : 'Previous:'} {typeof previousValue === 'number' && previousValue > 1000000 ? formatCurrency(previousValue) : previousValue.toLocaleString()}{suffix}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header with Notifications */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isArabic ? 'مركز القيادة العالمي' : 'Global Command Center'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isArabic ? 'ذكاء القوى العاملة في الوقت الفعلي' : 'Real-time Workforce Intelligence'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationCenter 
            isArabic={isArabic} 
            currentUserId="current_user"
          />
          <div className="text-sm text-gray-500">
            {isArabic ? 'آخر تحديث:' : 'Last updated:'} {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isArabic ? 'لوحة تحكم الرئيس التنفيذي المتقدمة' : 'Advanced CEO Executive Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isArabic ? 'نظرة شاملة على جميع الأقسام والمؤشرات الرئيسية' : 'Comprehensive overview of all departments and key performance indicators'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">{isArabic ? 'جميع الأقسام' : 'All Departments'}</option>
            <option value="sales">{isArabic ? 'المبيعات' : 'Sales'}</option>
            <option value="operations">{isArabic ? 'العمليات' : 'Operations'}</option>
            <option value="finance">{isArabic ? 'المالية' : 'Finance'}</option>
            <option value="hr">{isArabic ? 'الموارد البشرية' : 'HR'}</option>
            <option value="manpower">{isArabic ? 'القوى العاملة' : 'Manpower'}</option>
            <option value="fleet">{isArabic ? 'الأسطول' : 'Fleet'}</option>
          </select>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="current-month">{isArabic ? 'الشهر الحالي' : 'Current Month'}</option>
            <option value="last-month">{isArabic ? 'الشهر الماضي' : 'Last Month'}</option>
            <option value="quarter">{isArabic ? 'الربع الحالي' : 'Current Quarter'}</option>
            <option value="year">{isArabic ? 'السنة الحالية' : 'Current Year'}</option>
          </select>
          <button 
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {isArabic ? 'تحديث' : 'Refresh'}
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            {isArabic ? 'تصدير' : 'Export'}
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          {isArabic ? 'الملخص التنفيذي' : 'Executive Summary'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div>
            <h3 className="text-green-100 text-sm font-medium mb-2">
              {isArabic ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
            </h3>
            <div className="text-3xl font-bold">{formatCurrency(executiveSummary.totalRevenue)}</div>
            <div className="text-green-200 text-sm flex items-center gap-1 mt-1">
              <ArrowUp className="w-3 h-3" />
              {executiveSummary.monthlyGrowth}% {isArabic ? 'نمو' : 'growth'}
            </div>
          </div>
          <div>
            <h3 className="text-green-100 text-sm font-medium mb-2">
              {isArabic ? 'هامش الربح' : 'Profit Margin'}
            </h3>
            <div className="text-3xl font-bold">{executiveSummary.profitMargin}%</div>
            <div className="text-green-200 text-sm">
              {formatCurrency(executiveSummary.netProfit)} {isArabic ? 'ربح' : 'profit'}
            </div>
          </div>
          <div>
            <h3 className="text-green-100 text-sm font-medium mb-2">
              {isArabic ? 'العقود النشطة' : 'Active Contracts'}
            </h3>
            <div className="text-3xl font-bold">{executiveSummary.activeContracts}</div>
            <div className="text-green-200 text-sm">
              {executiveSummary.totalEmployees} {isArabic ? 'موظف منتشر' : 'employees deployed'}
            </div>
          </div>
          <div>
            <h3 className="text-green-100 text-sm font-medium mb-2">
              {isArabic ? 'كفاءة العمليات' : 'Operations Efficiency'}
            </h3>
            <div className="text-3xl font-bold">{executiveSummary.operationalEfficiency}%</div>
            <div className="text-green-200 text-sm">
              {isArabic ? 'رضا العملاء' : 'Client satisfaction'} {executiveSummary.clientSatisfaction}/5.0
            </div>
          </div>
          <div>
            <h3 className="text-green-100 text-sm font-medium mb-2">
              {isArabic ? 'نقاط السلامة' : 'Safety Score'}
            </h3>
            <div className="text-3xl font-bold">{executiveSummary.safetyScore}%</div>
            <div className="text-green-200 text-sm">
              {isArabic ? 'أسطول' : 'Fleet'} {executiveSummary.vehicleFleet} {isArabic ? 'مركبة' : 'vehicles'}
            </div>
          </div>
        </div>
      </div>

      {/* Department Performance Overview */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          {isArabic ? 'أداء الأقسام' : 'Department Performance'}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {departmentPerformance.map((dept, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  {isArabic ? dept.nameAr : dept.name}
                </h3>
                <div className="flex items-center gap-1">
                  <div className={`text-2xl font-bold ${dept.score >= 90 ? 'text-green-600' : dept.score >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {dept.score}
                  </div>
                  <div className="text-sm text-gray-500">%</div>
                </div>
              </div>
              <div className="space-y-2">
                {dept.kpis.map((kpi, kpiIndex) => (
                  <div key={kpiIndex} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{kpi.metric}:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{kpi.value}</span>
                      <span className={`text-xs ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comprehensive Manpower Department Metrics */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          {isArabic ? 'مؤشرات إدارة القوى العاملة الشاملة' : 'Comprehensive Manpower Management Metrics'}
        </h2>
        
        {/* Workforce Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <MetricCard
            title="Total Workforce"
            titleAr="إجمالي القوى العاملة"
            value={manpowerMetrics.totalWorkforce.current}
            previousValue={manpowerMetrics.totalWorkforce.previous}
            growth={manpowerMetrics.totalWorkforce.growth}
            icon={Users}
            color="bg-blue-500"
          />
          <MetricCard
            title="Active Workers"
            titleAr="العمال النشطون"
            value={manpowerMetrics.activeWorkers.current}
            previousValue={manpowerMetrics.activeWorkers.previous}
            growth={manpowerMetrics.activeWorkers.growth}
            icon={UserCheck}
            color="bg-green-500"
          />
          <MetricCard
            title="Workforce Utilization"
            titleAr="استغلال القوى العاملة"
            value={operationsMetrics.workforceUtilization.current}
            previousValue={operationsMetrics.workforceUtilization.previous}
            growth={operationsMetrics.workforceUtilization.growth}
            icon={Target}
            color="bg-purple-500"
            suffix="%"
          />
          <MetricCard
            title="Average Attendance"
            titleAr="متوسط الحضور"
            value={manpowerMetrics.attendance.averageAttendance.current}
            previousValue={manpowerMetrics.attendance.averageAttendance.previous}
            growth={manpowerMetrics.attendance.averageAttendance.growth}
            icon={Calendar}
            color="bg-orange-500"
            suffix="%"
          />
        </div>

        {/* Skill Categories Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isArabic ? 'تصنيف المهارات' : 'Skill Categories Breakdown'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <HardHat className="w-8 h-8 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">{isArabic ? 'عمالة ماهرة' : 'Skilled Workers'}</h4>
                  <p className="text-sm text-blue-700">{manpowerMetrics.skillCategories.skilled.count} workers</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">{isArabic ? 'النسبة:' : 'Percentage:'}</span>
                  <span className="font-medium">{manpowerMetrics.skillCategories.skilled.percentage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">{isArabic ? 'متوسط الراتب:' : 'Avg Salary:'}</span>
                  <span className="font-medium">{manpowerMetrics.skillCategories.skilled.avgSalary} SAR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">{isArabic ? 'النمو:' : 'Growth:'}</span>
                  <span className="font-medium text-green-600">+{manpowerMetrics.skillCategories.skilled.growth}%</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Wrench className="w-8 h-8 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">{isArabic ? 'عمالة نصف ماهرة' : 'Semi-Skilled Workers'}</h4>
                  <p className="text-sm text-green-700">{manpowerMetrics.skillCategories.semiSkilled.count} workers</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">{isArabic ? 'النسبة:' : 'Percentage:'}</span>
                  <span className="font-medium">{manpowerMetrics.skillCategories.semiSkilled.percentage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">{isArabic ? 'متوسط الراتب:' : 'Avg Salary:'}</span>
                  <span className="font-medium">{manpowerMetrics.skillCategories.semiSkilled.avgSalary} SAR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">{isArabic ? 'النمو:' : 'Growth:'}</span>
                  <span className="font-medium text-green-600">+{manpowerMetrics.skillCategories.semiSkilled.growth}%</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-8 h-8 text-yellow-600" />
                <div>
                  <h4 className="font-semibold text-yellow-900">{isArabic ? 'عمالة عامة' : 'General Workers'}</h4>
                  <p className="text-sm text-yellow-700">{manpowerMetrics.skillCategories.general.count} workers</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-700">{isArabic ? 'النسبة:' : 'Percentage:'}</span>
                  <span className="font-medium">{manpowerMetrics.skillCategories.general.percentage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-700">{isArabic ? 'متوسط الراتب:' : 'Avg Salary:'}</span>
                  <span className="font-medium">{manpowerMetrics.skillCategories.general.avgSalary} SAR</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-700">{isArabic ? 'النمو:' : 'Growth:'}</span>
                  <span className="font-medium text-green-600">+{manpowerMetrics.skillCategories.general.growth}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recruitment & Training Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              {isArabic ? 'مؤشرات التوظيف' : 'Recruitment Metrics'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">{manpowerMetrics.recruitment.newHires.current}</div>
                <div className="text-sm text-blue-700">{isArabic ? 'توظيف جديد' : 'New Hires'}</div>
                <div className="text-xs text-green-600">+{manpowerMetrics.recruitment.newHires.growth}%</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">{manpowerMetrics.recruitment.turnoverRate.current}%</div>
                <div className="text-sm text-green-700">{isArabic ? 'معدل الدوران' : 'Turnover Rate'}</div>
                <div className="text-xs text-green-600">{manpowerMetrics.recruitment.turnoverRate.growth}%</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-600">{manpowerMetrics.recruitment.timeToHire.current}</div>
                <div className="text-sm text-purple-700">{isArabic ? 'أيام التوظيف' : 'Days to Hire'}</div>
                <div className="text-xs text-green-600">{manpowerMetrics.recruitment.timeToHire.growth}%</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-600">{(manpowerMetrics.recruitment.costPerHire.current / 1000).toFixed(1)}K</div>
                <div className="text-sm text-orange-700">{isArabic ? 'تكلفة التوظيف' : 'Cost per Hire'}</div>
                <div className="text-xs text-green-600">{manpowerMetrics.recruitment.costPerHire.growth}%</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-green-600" />
              {isArabic ? 'مؤشرات التدريب' : 'Training Metrics'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">{(manpowerMetrics.training.totalHours.current / 1000).toFixed(1)}K</div>
                <div className="text-sm text-green-700">{isArabic ? 'ساعات التدريب' : 'Training Hours'}</div>
                <div className="text-xs text-green-600">+{manpowerMetrics.training.totalHours.growth}%</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">{manpowerMetrics.training.completionRate.current}%</div>
                <div className="text-sm text-blue-700">{isArabic ? 'معدل الإكمال' : 'Completion Rate'}</div>
                <div className="text-xs text-green-600">+{manpowerMetrics.training.completionRate.growth}%</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-600">{manpowerMetrics.training.certifications.current}</div>
                <div className="text-sm text-purple-700">{isArabic ? 'الشهادات' : 'Certifications'}</div>
                <div className="text-xs text-green-600">+{manpowerMetrics.training.certifications.growth}%</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-600">{(manpowerMetrics.training.trainingCost.current / 1000).toFixed(0)}K</div>
                <div className="text-sm text-yellow-700">{isArabic ? 'تكلفة التدريب' : 'Training Cost'}</div>
                <div className="text-xs text-green-600">+{manpowerMetrics.training.trainingCost.growth}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance & Compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              {isArabic ? 'تقييم الأداء' : 'Performance Ratings'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{isArabic ? 'ممتاز:' : 'Excellent:'}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${manpowerMetrics.performance.excellentRating.percentage}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{manpowerMetrics.performance.excellentRating.count} ({manpowerMetrics.performance.excellentRating.percentage}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{isArabic ? 'جيد:' : 'Good:'}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${manpowerMetrics.performance.goodRating.percentage}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{manpowerMetrics.performance.goodRating.count} ({manpowerMetrics.performance.goodRating.percentage}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{isArabic ? 'متوسط:' : 'Average:'}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${manpowerMetrics.performance.averageRating.percentage}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{manpowerMetrics.performance.averageRating.count} ({manpowerMetrics.performance.averageRating.percentage}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{isArabic ? 'يحتاج تحسين:' : 'Needs Improvement:'}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: `${manpowerMetrics.performance.needsImprovement.percentage}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{manpowerMetrics.performance.needsImprovement.count} ({manpowerMetrics.performance.needsImprovement.percentage}%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              {isArabic ? 'حالة الامتثال' : 'Compliance Status'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span className="text-sm text-gray-700">{isArabic ? 'الإقامات:' : 'Iqama Status:'}</span>
                <span className="font-medium text-green-600">{manpowerMetrics.compliance.iqamaStatus.complianceRate}%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span className="text-sm text-gray-700">{isArabic ? 'التأمينات:' : 'GOSI Registration:'}</span>
                <span className="font-medium text-blue-600">{manpowerMetrics.compliance.gosiRegistration.complianceRate}%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                <span className="text-sm text-gray-700">{isArabic ? 'التأمين الطبي:' : 'Medical Insurance:'}</span>
                <span className="font-medium text-purple-600">{manpowerMetrics.compliance.medicalInsurance.complianceRate}%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <span className="text-sm text-gray-700">{isArabic ? 'تدريب السلامة:' : 'Safety Training:'}</span>
                <span className="font-medium text-yellow-600">{manpowerMetrics.compliance.safetyTraining.complianceRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workforce Deployment */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            {isArabic ? 'توزيع القوى العاملة' : 'Workforce Deployment'}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">{isArabic ? 'حسب العميل' : 'By Client'}</h4>
              <div className="space-y-2">
                {manpowerMetrics.deployment.byClient.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{isArabic ? client.clientAr : client.client}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{client.workers} workers</span>
                      <span className="text-xs text-green-600">{client.utilization}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">{isArabic ? 'حسب الموقع' : 'By Location'}</h4>
              <div className="space-y-2">
                {manpowerMetrics.deployment.byLocation.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{isArabic ? location.locationAr : location.location}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{location.workers} workers</span>
                      <span className="text-xs text-blue-600">{location.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          {isArabic ? 'المؤشرات المالية' : 'Financial Metrics'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            titleAr="إجمالي الإيرادات"
            value={financialMetrics.revenue.current}
            previousValue={financialMetrics.revenue.previous}
            growth={financialMetrics.revenue.growth}
            icon={TrendingUp}
            color="bg-green-500"
          />
          <MetricCard
            title="Net Profit"
            titleAr="صافي الربح"
            value={financialMetrics.profit.current}
            previousValue={financialMetrics.profit.previous}
            growth={financialMetrics.profit.growth}
            icon={Target}
            color="bg-blue-500"
          />
          <MetricCard
            title="Cash Flow"
            titleAr="التدفق النقدي"
            value={financialMetrics.cashFlow.current}
            previousValue={financialMetrics.cashFlow.previous}
            growth={financialMetrics.cashFlow.growth}
            icon={Activity}
            color="bg-purple-500"
          />
          <MetricCard
            title="Operating Expenses"
            titleAr="المصروفات التشغيلية"
            value={financialMetrics.expenses.current}
            previousValue={financialMetrics.expenses.previous}
            growth={financialMetrics.expenses.growth}
            icon={BarChart3}
            color="bg-red-500"
          />
        </div>
      </div>

      {/* Sales & Operations Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Metrics */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            {isArabic ? 'مؤشرات المبيعات' : 'Sales Metrics'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Leads Generated"
              titleAr="العملاء المحتملون"
              value={salesMetrics.leadsGenerated.current}
              previousValue={salesMetrics.leadsGenerated.previous}
              growth={salesMetrics.leadsGenerated.growth}
              icon={Users}
              color="bg-indigo-500"
            />
            <MetricCard
              title="Conversion Rate"
              titleAr="معدل التحويل"
              value={salesMetrics.conversionRate.current}
              previousValue={salesMetrics.conversionRate.previous}
              growth={salesMetrics.conversionRate.growth}
              icon={TrendingUp}
              color="bg-green-500"
              suffix="%"
            />
            <MetricCard
              title="Pipeline Value"
              titleAr="قيمة الأعمال المحتملة"
              value={salesMetrics.pipelineValue}
              previousValue={salesMetrics.pipelineValue * 0.85}
              growth={17.6}
              icon={DollarSign}
              color="bg-yellow-500"
            />
            <MetricCard
              title="Contracts Won"
              titleAr="العقود المكتسبة"
              value={salesMetrics.contractsWon.current}
              previousValue={salesMetrics.contractsWon.previous}
              growth={salesMetrics.contractsWon.growth}
              icon={CheckCircle}
              color="bg-emerald-500"
            />
          </div>
        </div>

        {/* Operations Metrics */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            {isArabic ? 'مؤشرات العمليات' : 'Operations Metrics'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Project Efficiency"
              titleAr="كفاءة المشاريع"
              value={operationsMetrics.projectEfficiency.current}
              previousValue={operationsMetrics.projectEfficiency.previous}
              growth={operationsMetrics.projectEfficiency.growth}
              icon={Target}
              color="bg-purple-500"
              suffix="%"
            />
            <MetricCard
              title="Workforce Utilization"
              titleAr="استغلال القوى العاملة"
              value={operationsMetrics.workforceUtilization.current}
              previousValue={operationsMetrics.workforceUtilization.previous}
              growth={operationsMetrics.workforceUtilization.growth}
              icon={Users}
              color="bg-blue-500"
              suffix="%"
            />
            <MetricCard
              title="Fleet Utilization"
              titleAr="استغلال الأسطول"
              value={operationsMetrics.fleetUtilization.current}
              previousValue={operationsMetrics.fleetUtilization.previous}
              growth={operationsMetrics.fleetUtilization.growth}
              icon={Truck}
              color="bg-indigo-500"
              suffix="%"
            />
            <MetricCard
              title="Safety Score"
              titleAr="نقاط السلامة"
              value={operationsMetrics.safetyScore.current}
              previousValue={operationsMetrics.safetyScore.previous}
              growth={operationsMetrics.safetyScore.growth}
              icon={Shield}
              color="bg-green-500"
              suffix="%"
            />
          </div>
        </div>
      </div>

      {/* HR & Fleet Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HR Metrics */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-orange-600" />
            {isArabic ? 'مؤشرات الموارد البشرية' : 'HR Metrics'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Total Employees"
              titleAr="إجمالي الموظفين"
              value={hrMetrics.totalEmployees.current}
              previousValue={hrMetrics.totalEmployees.previous}
              growth={hrMetrics.totalEmployees.growth}
              icon={Users}
              color="bg-orange-500"
            />
            <MetricCard
              title="Employee Turnover"
              titleAr="معدل دوران الموظفين"
              value={hrMetrics.employeeTurnover.current}
              previousValue={hrMetrics.employeeTurnover.previous}
              growth={hrMetrics.employeeTurnover.growth}
              icon={TrendingDown}
              color="bg-red-500"
              suffix="%"
            />
            <MetricCard
              title="Training Hours"
              titleAr="ساعات التدريب"
              value={hrMetrics.trainingHours.current}
              previousValue={hrMetrics.trainingHours.previous}
              growth={hrMetrics.trainingHours.growth}
              icon={Award}
              color="bg-purple-500"
            />
            <MetricCard
              title="Compliance Score"
              titleAr="نقاط الامتثال"
              value={hrMetrics.complianceScore.current}
              previousValue={hrMetrics.complianceScore.previous}
              growth={hrMetrics.complianceScore.growth}
              icon={Shield}
              color="bg-green-500"
              suffix="%"
            />
          </div>
        </div>

        {/* Fleet Metrics */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-600" />
            {isArabic ? 'مؤشرات الأسطول' : 'Fleet Metrics'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="Total Vehicles"
              titleAr="إجمالي المركبات"
              value={fleetMetrics.totalVehicles.current}
              previousValue={fleetMetrics.totalVehicles.previous}
              growth={fleetMetrics.totalVehicles.growth}
              icon={Truck}
              color="bg-indigo-500"
            />
            <MetricCard
              title="Fleet Utilization"
              titleAr="استغلال الأسطول"
              value={fleetMetrics.utilization.current}
              previousValue={fleetMetrics.utilization.previous}
              growth={fleetMetrics.utilization.growth}
              icon={Activity}
              color="bg-blue-500"
              suffix="%"
            />
            <MetricCard
              title="Maintenance Cost"
              titleAr="تكلفة الصيانة"
              value={fleetMetrics.maintenanceCost.current}
              previousValue={fleetMetrics.maintenanceCost.previous}
              growth={fleetMetrics.maintenanceCost.growth}
              icon={Settings}
              color="bg-yellow-500"
              suffix=" SAR"
            />
            <MetricCard
              title="Fuel Efficiency"
              titleAr="كفاءة الوقود"
              value={fleetMetrics.fuelEfficiency.current}
              previousValue={fleetMetrics.fuelEfficiency.previous}
              growth={fleetMetrics.fuelEfficiency.growth}
              icon={Zap}
              color="bg-green-500"
              suffix=" L/100km"
            />
          </div>
        </div>
      </div>

      {/* Compliance & Risk Dashboard */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          {isArabic ? 'لوحة الامتثال والمخاطر' : 'Compliance & Risk Dashboard'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">ZATCA</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-900">{complianceMetrics.zatcaCompliance}%</div>
            <div className="text-sm text-green-700">{isArabic ? 'متوافق' : 'Compliant'}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">GOSI</span>
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-900">{complianceMetrics.gosiCompliance}%</div>
            <div className="text-sm text-blue-700">{isArabic ? 'متوافق' : 'Compliant'}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-800">QIWA</span>
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-900">{complianceMetrics.qiwaCompliance}%</div>
            <div className="text-sm text-yellow-700">{isArabic ? 'يحتاج متابعة' : 'Needs Attention'}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-800">{isArabic ? 'المخاطر' : 'Risk Level'}</span>
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-900">{complianceMetrics.riskLevel}</div>
            <div className="text-sm text-purple-700">{complianceMetrics.auditScore}% {isArabic ? 'نقاط التدقيق' : 'Audit Score'}</div>
          </div>
        </div>
      </div>

      {/* Recent Activities & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            {isArabic ? 'الأنشطة الأخيرة' : 'Recent Activities'}
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  activity.impact === 'high' ? 'bg-green-500' : 
                  activity.impact === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getDepartmentIcon(activity.department)}
                    <span className="text-xs text-gray-500 font-medium">{activity.department}</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {isArabic ? activity.titleAr : activity.titleEn}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-green-600">{activity.value}</span>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Alerts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            {isArabic ? 'التنبيهات القادمة' : 'Upcoming Alerts'}
          </h2>
          <div className="space-y-4">
            {upcomingAlerts.map((alert, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
                <div className={`w-3 h-3 rounded-full ${
                  alert.priority === 'high' ? 'bg-red-500' :
                  alert.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getDepartmentIcon(alert.department)}
                    <span className="text-xs text-gray-500 font-medium">{alert.department}</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {isArabic ? alert.titleAr : alert.titleEn}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    <span className="text-sm text-gray-500">{alert.date}</span>
                    <span className="text-sm font-semibold text-blue-600">{alert.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Targets */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          {isArabic ? 'الأهداف والإنجازات' : 'Performance Targets & Achievements'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3">
              {isArabic ? 'الهدف الشهري للإيرادات' : 'Monthly Revenue Target'}
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-green-900">
                {formatCurrency(financialMetrics.revenue.current)}
              </span>
              <span className="text-sm text-green-700">
                / {formatCurrency(financialMetrics.revenue.target)}
              </span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(financialMetrics.revenue.current / financialMetrics.revenue.target) * 100}%` }}
              ></div>
            </div>
            <div className="text-sm text-green-700 mt-2">
              {((financialMetrics.revenue.current / financialMetrics.revenue.target) * 100).toFixed(1)}% {isArabic ? 'مكتمل' : 'completed'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3">
              {isArabic ? 'هدف كفاءة العمليات' : 'Operations Efficiency Target'}
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-blue-900">
                {operationsMetrics.projectEfficiency.current}%
              </span>
              <span className="text-sm text-blue-700">/ 95%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(operationsMetrics.projectEfficiency.current / 95) * 100}%` }}
              ></div>
            </div>
            <div className="text-sm text-blue-700 mt-2">
              {((operationsMetrics.projectEfficiency.current / 95) * 100).toFixed(1)}% {isArabic ? 'مكتمل' : 'completed'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-3">
              {isArabic ? 'هدف رضا العملاء' : 'Customer Satisfaction Target'}
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-purple-900">
                {customerMetrics.customerSatisfaction.current}/5.0
              </span>
              <span className="text-sm text-purple-700">/ 4.8</span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${(customerMetrics.customerSatisfaction.current / 4.8) * 100}%` }}
              ></div>
            </div>
            <div className="text-sm text-purple-700 mt-2">
              {((customerMetrics.customerSatisfaction.current / 4.8) * 100).toFixed(1)}% {isArabic ? 'مكتمل' : 'completed'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-3">
              {isArabic ? 'هدف استغلال الأسطول' : 'Fleet Utilization Target'}
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-yellow-900">
                {fleetMetrics.utilization.current}%
              </span>
              <span className="text-sm text-yellow-700">/ 90%</span>
            </div>
            <div className="w-full bg-yellow-200 rounded-full h-2">
              <div 
                className="bg-yellow-600 h-2 rounded-full" 
                style={{ width: `${(fleetMetrics.utilization.current / 90) * 100}%` }}
              ></div>
            </div>
            <div className="text-sm text-yellow-700 mt-2">
              {((fleetMetrics.utilization.current / 90) * 100).toFixed(1)}% {isArabic ? 'مكتمل' : 'completed'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};