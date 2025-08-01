import React, { useState, useEffect } from 'react';
import {
  Brain,
  Target,
  TrendingUp,
  AlertTriangle,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  RefreshCw,
  Download,
  Play,
  Pause,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Shield,
  Lightbulb,
  Award,
  Eye,
  Edit,
  Save,
  X,
  Plus
} from 'lucide-react';
import { aiOptimizationEngine, OptimizationResult, ProfitPrediction, RiskAssessment, NLInsight } from '../../services/AIOptimizationEngine';
import { useWorkforceData } from '../../hooks/useWorkforceData';

interface AIOptimizationDashboardProps {
  isArabic: boolean;
}

export const AIOptimizationDashboard: React.FC<AIOptimizationDashboardProps> = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'optimization' | 'predictions' | 'insights' | 'models'>('overview');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [profitPredictions, setProfitPredictions] = useState<ProfitPrediction[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [nlInsights, setNlInsights] = useState<NLInsight[]>([]);
  const [showOptimizationSettings, setShowOptimizationSettings] = useState(false);

  const { employees, projects, attendance } = useWorkforceData();

  const [optimizationSettings, setOptimizationSettings] = useState({
    maximizeProfit: 0.4,
    maximizeUtilization: 0.3,
    minimizeRisk: 0.2,
    balanceWorkload: 0.1
  });

  // Load AI optimization data
  useEffect(() => {
    loadAIData();
  }, [employees, projects, attendance]);

  const loadAIData = async () => {
    try {
      // Generate profit predictions
      const predictions = await aiOptimizationEngine.generateProfitPredictions(
        projects,
        employees,
        attendance,
        'month'
      );
      setProfitPredictions(predictions);

      // Generate risk assessments
      const risks = await aiOptimizationEngine.generateRiskAssessments(
        projects,
        employees,
        attendance
      );
      setRiskAssessments(risks);

      // Generate natural language insights
      const insights = await aiOptimizationEngine.generateNaturalLanguageInsights(
        employees,
        projects,
        attendance,
        predictions,
        risks
      );
      setNlInsights(insights);

    } catch (error) {
      console.error('Error loading AI data:', error);
    }
  };

  const runOptimization = async () => {
    setIsOptimizing(true);
    try {
      const result = await aiOptimizationEngine.optimizeResourceAllocation(
        employees,
        projects,
        [], // No constraints for demo
        optimizationSettings
      );
      setOptimizationResult(result);
      
      // Generate automated recommendations
      const recommendations = await aiOptimizationEngine.generateAutomatedRecommendations(
        employees,
        projects,
        attendance,
        result,
        profitPredictions,
        riskAssessments
      );
      
      console.log('AI Optimization completed:', result);
      console.log('Automated recommendations:', recommendations);
      
    } catch (error) {
      console.error('Optimization failed:', error);
      alert(isArabic ? 'فشل في التحسين' : 'Optimization failed');
    } finally {
      setIsOptimizing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'anomaly':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'opportunity':
        return <Target className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-purple-600" />;
      default:
        return <Lightbulb className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-600" />
            {isArabic ? 'لوحة تحكم الذكاء الاصطناعي' : 'AI Optimization Dashboard'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isArabic ? 'تحسين القوى العاملة بالذكاء الاصطناعي مع التحليلات التنبؤية والتوصيات الآلية' : 'AI-powered workforce optimization with predictive analytics and automated recommendations'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowOptimizationSettings(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Settings className="w-4 h-4" />
            {isArabic ? 'إعدادات التحسين' : 'Optimization Settings'}
          </button>
          <button 
            onClick={loadAIData}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {isArabic ? 'تحديث البيانات' : 'Refresh Data'}
          </button>
          <button 
            onClick={runOptimization}
            disabled={isOptimizing}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {isOptimizing ? <Clock className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isOptimizing ? (isArabic ? 'جاري التحسين...' : 'Optimizing...') : (isArabic ? 'تشغيل التحسين' : 'Run Optimization')}
          </button>
        </div>
      </div>

      {/* AI Status Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-purple-800">
              {isArabic ? 'نظام الذكاء الاصطناعي نشط' : 'AI Optimization System Active'}
            </h3>
            <p className="text-sm text-purple-700">
              {isArabic 
                ? 'نماذج التعلم الآلي تعمل بكفاءة 87% مع تحليلات في الوقت الفعلي وتوصيات ذكية'
                : 'Machine learning models operating at 87% efficiency with real-time analytics and intelligent recommendations'
              }
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-purple-800">87%</div>
            <div className="text-sm text-purple-600">{isArabic ? 'كفاءة النموذج' : 'Model Efficiency'}</div>
          </div>
        </div>
      </div>

      {/* AI Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {optimizationResult ? `${optimizationResult.utilizationRate.toFixed(1)}%` : '0%'}
              </div>
              <div className="text-sm text-blue-700">{isArabic ? 'معدل الاستغلال المحسن' : 'Optimized Utilization'}</div>
            </div>
          </div>
          <div className="text-xs text-blue-600">
            {optimizationResult ? `+${(optimizationResult.utilizationRate - 75).toFixed(1)}%` : 'N/A'} {isArabic ? 'تحسن' : 'improvement'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {optimizationResult ? formatCurrency(optimizationResult.totalExpectedProfit) : formatCurrency(0)}
              </div>
              <div className="text-sm text-green-700">{isArabic ? 'الربح المتوقع' : 'Predicted Profit'}</div>
            </div>
          </div>
          <div className="text-xs text-green-600">
            {isArabic ? 'شهرياً' : 'Monthly projection'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">{nlInsights.length}</div>
              <div className="text-sm text-purple-700">{isArabic ? 'رؤى ذكية' : 'AI Insights'}</div>
            </div>
          </div>
          <div className="text-xs text-purple-600">
            {nlInsights.filter(insight => insight.impact === 'high' || insight.impact === 'critical').length} {isArabic ? 'عالي التأثير' : 'high impact'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-900">
                {optimizationResult ? `${optimizationResult.riskScore.toFixed(1)}%` : '0%'}
              </div>
              <div className="text-sm text-red-700">{isArabic ? 'نقاط المخاطر' : 'Risk Score'}</div>
            </div>
          </div>
          <div className="text-xs text-red-600">
            {riskAssessments.filter(risk => risk.riskLevel === 'high' || risk.riskLevel === 'critical').length} {isArabic ? 'مخاطر عالية' : 'high risks'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {isArabic ? 'نظرة عامة' : 'Overview'}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('optimization')}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'optimization'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                {isArabic ? 'تحسين الموارد' : 'Resource Optimization'}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('predictions')}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'predictions'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {isArabic ? 'التحليلات التنبؤية' : 'Predictive Analytics'}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'insights'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                {isArabic ? 'الرؤى الذكية' : 'AI Insights'}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('models')}
              className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'models'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                {isArabic ? 'نماذج التعلم الآلي' : 'ML Models'}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* AI System Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                  <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {isArabic ? 'حالة النظام' : 'System Status'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">{isArabic ? 'نماذج نشطة:' : 'Active Models:'}</span>
                      <span className="font-bold text-green-900">4</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">{isArabic ? 'دقة النموذج:' : 'Model Accuracy:'}</span>
                      <span className="font-bold text-green-900">87%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">{isArabic ? 'آخر تدريب:' : 'Last Training:'}</span>
                      <span className="font-bold text-green-900">{isArabic ? 'اليوم' : 'Today'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {isArabic ? 'أداء التحسين' : 'Optimization Performance'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">{isArabic ? 'تحسينات مكتملة:' : 'Optimizations Run:'}</span>
                      <span className="font-bold text-blue-900">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">{isArabic ? 'متوسط التحسن:' : 'Avg Improvement:'}</span>
                      <span className="font-bold text-blue-900">+18%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">{isArabic ? 'وقت المعالجة:' : 'Processing Time:'}</span>
                      <span className="font-bold text-blue-900">2.3s</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                  <h3 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    {isArabic ? 'التأثير المالي' : 'Financial Impact'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-700">{isArabic ? 'وفورات محققة:' : 'Savings Achieved:'}</span>
                      <span className="font-bold text-purple-900">{formatCurrency(245000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-700">{isArabic ? 'عائد الاستثمار:' : 'ROI:'}</span>
                      <span className="font-bold text-purple-900">340%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-700">{isArabic ? 'فترة الاسترداد:' : 'Payback Period:'}</span>
                      <span className="font-bold text-purple-900">{isArabic ? '3.2 شهر' : '3.2 months'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent AI Insights */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  {isArabic ? 'أحدث الرؤى الذكية' : 'Latest AI Insights'}
                </h3>
                <div className="space-y-3">
                  {nlInsights.slice(0, 3).map((insight) => (
                    <div key={insight.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {isArabic ? insight.titleAr : insight.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {isArabic ? insight.descriptionAr : insight.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getImpactColor(insight.impact)}`}>
                              {insight.impact}
                            </span>
                            <span className="text-xs text-gray-500">
                              {isArabic ? 'الثقة:' : 'Confidence:'} {(insight.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'optimization' && (
            <div className="space-y-6">
              {optimizationResult ? (
                <div className="space-y-6">
                  {/* Optimization Results Summary */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      {isArabic ? 'نتائج التحسين' : 'Optimization Results'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{optimizationResult.solutions.length}</div>
                        <div className="text-sm text-green-700">{isArabic ? 'تخصيصات محسنة' : 'Optimized Allocations'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{optimizationResult.utilizationRate.toFixed(1)}%</div>
                        <div className="text-sm text-blue-700">{isArabic ? 'معدل الاستغلال' : 'Utilization Rate'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{formatCurrency(optimizationResult.totalExpectedProfit)}</div>
                        <div className="text-sm text-purple-700">{isArabic ? 'الربح المتوقع' : 'Expected Profit'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{(optimizationResult.confidence * 100).toFixed(0)}%</div>
                        <div className="text-sm text-orange-700">{isArabic ? 'ثقة النموذج' : 'Model Confidence'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Resource Allocation Solutions */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {isArabic ? 'حلول تخصيص الموارد' : 'Resource Allocation Solutions'}
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {isArabic ? 'الموظف' : 'Employee'}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {isArabic ? 'المشروع' : 'Project'}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {isArabic ? 'التخصيص' : 'Allocation'}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {isArabic ? 'الربح المتوقع' : 'Expected Profit'}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {isArabic ? 'المخاطر' : 'Risk Score'}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {isArabic ? 'الثقة' : 'Confidence'}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {optimizationResult.solutions.map((solution, index) => {
                              const employee = employees.find(emp => emp.id === solution.employeeId);
                              const project = projects.find(proj => proj.id === solution.projectId);
                              
                              return (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-4 py-4 text-sm text-gray-900">
                                    {employee?.name || 'Unknown'}
                                  </td>
                                  <td className="px-4 py-4 text-sm text-gray-900">
                                    {project?.name || 'Unknown'}
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                      <div className="w-16 bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-blue-600 h-2 rounded-full" 
                                          style={{ width: `${solution.allocation * 100}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-sm font-medium">{(solution.allocation * 100).toFixed(0)}%</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 text-sm font-semibold text-green-600">
                                    {formatCurrency(solution.expectedProfit)}
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${
                                        solution.riskScore < 0.3 ? 'bg-green-500' :
                                        solution.riskScore < 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}></div>
                                      <span className="text-sm">{(solution.riskScore * 100).toFixed(0)}%</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 text-sm text-gray-900">
                                    {(solution.confidence * 100).toFixed(0)}%
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Optimization Recommendations */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">
                      {isArabic ? 'توصيات التحسين' : 'Optimization Recommendations'}
                    </h3>
                    <div className="space-y-2">
                      {optimizationResult.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-blue-700">{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {isArabic ? 'لم يتم تشغيل التحسين بعد' : 'No optimization run yet'}
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    {isArabic ? 'انقر على "تشغيل التحسين" لبدء تحليل الذكاء الاصطناعي' : 'Click "Run Optimization" to start AI analysis'}
                  </p>
                  <button 
                    onClick={runOptimization}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <Play className="w-5 h-5" />
                    {isArabic ? 'تشغيل التحسين الآن' : 'Run Optimization Now'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="space-y-6">
              {/* Profit Predictions */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    {isArabic ? 'توقعات الأرباح' : 'Profit Predictions'}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    {profitPredictions.map((prediction) => {
                      const project = projects.find(proj => proj.id === prediction.projectId);
                      return (
                        <div key={prediction.projectId} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">
                              {project?.name || 'Unknown Project'}
                            </h4>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                {formatCurrency(prediction.predictedProfit)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {isArabic ? 'ثقة:' : 'Confidence:'} {(prediction.confidence * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-sm text-gray-600">{isArabic ? 'متفائل' : 'Optimistic'}</div>
                              <div className="font-semibold text-green-600">
                                {formatCurrency(prediction.scenarios.optimistic)}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600">{isArabic ? 'واقعي' : 'Realistic'}</div>
                              <div className="font-semibold text-blue-600">
                                {formatCurrency(prediction.scenarios.realistic)}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600">{isArabic ? 'متشائم' : 'Pessimistic'}</div>
                              <div className="font-semibold text-red-600">
                                {formatCurrency(prediction.scenarios.pessimistic)}
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">{isArabic ? 'العوامل الرئيسية:' : 'Key Factors:'}</h5>
                            <div className="space-y-1">
                              {prediction.factors.map((factor, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                  <span className="text-gray-700">{factor.factor}</span>
                                  <span className={`font-medium ${factor.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {factor.impact > 0 ? '+' : ''}{(factor.impact * 100).toFixed(1)}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Risk Assessments */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-600" />
                    {isArabic ? 'تقييمات المخاطر' : 'Risk Assessments'}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    {riskAssessments.map((assessment) => {
                      const project = projects.find(proj => proj.id === assessment.projectId);
                      return (
                        <div key={assessment.projectId} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">
                              {project?.name || 'Unknown Project'}
                            </h4>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${getRiskLevelColor(assessment.riskLevel)}`}>
                                {assessment.riskLevel}
                              </span>
                              <div className="text-right">
                                <div className="text-lg font-bold text-red-600">
                                  {assessment.riskScore.toFixed(0)}%
                                </div>
                                <div className="text-sm text-gray-500">{isArabic ? 'نقاط المخاطر' : 'Risk Score'}</div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h5 className="font-medium text-gray-800 mb-2">{isArabic ? 'عوامل المخاطر:' : 'Risk Factors:'}</h5>
                              <div className="space-y-2">
                                {assessment.riskFactors.map((factor, index) => (
                                  <div key={index} className="bg-white rounded p-3">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium text-gray-900">{factor.factor}</span>
                                      <span className="text-sm text-red-600">
                                        {(factor.probability * 100).toFixed(0)}% × {(factor.impact * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{factor.mitigation}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {assessment.recommendations.length > 0 && (
                              <div>
                                <h5 className="font-medium text-gray-800 mb-2">{isArabic ? 'التوصيات:' : 'Recommendations:'}</h5>
                                <div className="space-y-1">
                                  {assessment.recommendations.map((rec, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                      <span className="text-sm text-gray-700">{rec}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic ? 'الرؤى الذكية المولدة بالذكاء الاصطناعي' : 'AI-Generated Intelligent Insights'}
                </h3>
                <div className="text-sm text-gray-500">
                  {nlInsights.length} {isArabic ? 'رؤية نشطة' : 'active insights'}
                </div>
              </div>

              <div className="grid gap-4">
                {nlInsights.map((insight) => (
                  <div key={insight.id} className={`rounded-lg p-6 border ${
                    insight.impact === 'critical' ? 'bg-red-50 border-red-200' :
                    insight.impact === 'high' ? 'bg-orange-50 border-orange-200' :
                    insight.impact === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        insight.impact === 'critical' ? 'bg-red-600' :
                        insight.impact === 'high' ? 'bg-orange-600' :
                        insight.impact === 'medium' ? 'bg-yellow-600' :
                        'bg-green-600'
                      }`}>
                        {getInsightIcon(insight.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {isArabic ? insight.titleAr : insight.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getImpactColor(insight.impact)}`}>
                              {insight.impact}
                            </span>
                            <span className="text-sm text-gray-500">
                              {(insight.confidence * 100).toFixed(0)}% {isArabic ? 'ثقة' : 'confidence'}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {isArabic ? insight.descriptionAr : insight.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {isArabic ? 'تم الإنشاء:' : 'Generated:'} {insight.generatedAt.toLocaleString()}
                          </span>
                          {insight.expiresAt && (
                            <span className="text-sm text-orange-600">
                              {isArabic ? 'ينتهي:' : 'Expires:'} {insight.expiresAt.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {nlInsights.length === 0 && (
                <div className="text-center py-12">
                  <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {isArabic ? 'لا توجد رؤى متاحة' : 'No insights available'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {isArabic ? 'قم بتشغيل التحسين لإنشاء رؤى ذكية' : 'Run optimization to generate intelligent insights'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'models' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {isArabic ? 'نماذج التعلم الآلي' : 'Machine Learning Models'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    {isArabic ? 'نموذج توقع الأرباح' : 'Profit Prediction Model'}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isArabic ? 'الخوارزمية:' : 'Algorithm:'}</span>
                      <span className="font-medium">Random Forest</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isArabic ? 'الدقة:' : 'Accuracy:'}</span>
                      <span className="font-medium text-green-600">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isArabic ? 'آخر تدريب:' : 'Last Training:'}</span>
                      <span className="font-medium">{isArabic ? 'اليوم' : 'Today'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isArabic ? 'التوقعات:' : 'Predictions:'}</span>
                      <span className="font-medium">{profitPredictions.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-600" />
                    {isArabic ? 'نموذج تقييم المخاطر' : 'Risk Assessment Model'}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isArabic ? 'الخوارزمية:' : 'Algorithm:'}</span>
                      <span className="font-medium">Neural Network</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isArabic ? 'الدقة:' : 'Accuracy:'}</span>
                      <span className="font-medium text-green-600">82%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isArabic ? 'آخر تدريب:' : 'Last Training:'}</span>
                      <span className="font-medium">{isArabic ? 'اليوم' : 'Today'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isArabic ? 'التقييمات:' : 'Assessments:'}</span>
                      <span className="font-medium">{riskAssessments.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    {isArabic ? 'نموذج توقع الطلب' : 'Demand Forecasting Model'}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isArabic ? 'الخوارزمية:' : 'Algorithm:'}</span>
                      <span className="font-medium">Time Series</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isArabic ? 'الدقة:' : 'Accuracy:'}</span>
                      <span className="font-medium text-green-600">79%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isArabic ? 'آخر تدريب:' : 'Last Training:'}</span>
                      <span className="font-medium">{isArabic ? 'اليوم' : 'Today'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isArabic ? 'التوقعات:' : 'Forecasts:'}</span>
                      <span className="font-medium">24</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    {isArabic ? 'نموذج توقع الأداء' : 'Performance Prediction Model'}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isArabic ? 'الخوارزمية:' : 'Algorithm:'}</span>
                      <span className="font-medium">Linear Regression</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isArabic ? 'الدقة:' : 'Accuracy:'}</span>
                      <span className="font-medium text-green-600">84%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isArabic ? 'آخر تدريب:' : 'Last Training:'}</span>
                      <span className="font-medium">{isArabic ? 'اليوم' : 'Today'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{isArabic ? 'التوقعات:' : 'Predictions:'}</span>
                      <span className="font-medium">{employees.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Optimization Settings Modal */}
      {showOptimizationSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? 'إعدادات التحسين' : 'Optimization Settings'}
              </h3>
              <button 
                onClick={() => setShowOptimizationSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? 'أهداف التحسين' : 'Optimization Objectives'}
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        {isArabic ? 'تعظيم الأرباح' : 'Maximize Profit'}
                      </label>
                      <span className="text-sm text-gray-500">{(optimizationSettings.maximizeProfit * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1"
                      value={optimizationSettings.maximizeProfit}
                      onChange={(e) => setOptimizationSettings({
                        ...optimizationSettings,
                        maximizeProfit: parseFloat(e.target.value)
                      })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        {isArabic ? 'تعظيم الاستغلال' : 'Maximize Utilization'}
                      </label>
                      <span className="text-sm text-gray-500">{(optimizationSettings.maximizeUtilization * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1"
                      value={optimizationSettings.maximizeUtilization}
                      onChange={(e) => setOptimizationSettings({
                        ...optimizationSettings,
                        maximizeUtilization: parseFloat(e.target.value)
                      })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        {isArabic ? 'تقليل المخاطر' : 'Minimize Risk'}
                      </label>
                      <span className="text-sm text-gray-500">{(optimizationSettings.minimizeRisk * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1"
                      value={optimizationSettings.minimizeRisk}
                      onChange={(e) => setOptimizationSettings({
                        ...optimizationSettings,
                        minimizeRisk: parseFloat(e.target.value)
                      })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        {isArabic ? 'توازن عبء العمل' : 'Balance Workload'}
                      </label>
                      <span className="text-sm text-gray-500">{(optimizationSettings.balanceWorkload * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1"
                      value={optimizationSettings.balanceWorkload}
                      onChange={(e) => setOptimizationSettings({
                        ...optimizationSettings,
                        balanceWorkload: parseFloat(e.target.value)
                      })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button 
                  onClick={() => {
                    setShowOptimizationSettings(false);
                    runOptimization();
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? 'حفظ وتشغيل' : 'Save & Run'}
                </button>
                <button 
                  onClick={() => setShowOptimizationSettings(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};