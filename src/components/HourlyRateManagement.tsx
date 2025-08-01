import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  DollarSign, 
  Calculator,
  Users,
  TrendingUp,
  Save,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  Target,
  Award,
  Building2
} from 'lucide-react';

interface HourlyRateManagementProps {
  isArabic: boolean;
}

interface HourlyRate {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNameAr: string;
  hourlyWage: number;
  effectiveDate: string;
  endDate?: string;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'draft' | 'active' | 'expired' | 'suspended';
  notes?: string;
}

interface OvertimeMultiplier {
  id: string;
  name: string;
  nameAr: string;
  multiplier: number;
  description: string;
  isDefault: boolean;
  saudiLaborLawCompliant: boolean;
}

interface MonthlyCalculation {
  regularHours: number;
  overtimeHours: number;
  regularPay: number;
  overtimePay: number;
  totalMonthlyEquivalent: number;
  effectiveHourlyRate: number;
}

interface StandardHoursConfig {
  id: string;
  standardHoursPerMonth: number;
  workingDaysPerMonth: number;
  hoursPerDay: number;
  lastModified: string;
  modifiedBy: string;
  effectiveDate: string;
}

export const HourlyRateManagement: React.FC<HourlyRateManagementProps> = ({ isArabic }) => {
  const [activeTab, setActiveTab] = useState<'rates' | 'configuration' | 'calculations' | 'reports'>('rates');
  const [showAddRate, setShowAddRate] = useState(false);
  const [editingRate, setEditingRate] = useState<HourlyRate | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [calculationInputs, setCalculationInputs] = useState({
    hourlyRate: 25.00,
    standardHours: 176,
    overtimeHours: 0,
    selectedMultiplier: 'time_half'
  });

  // Overtime multiplier options as per Saudi labor law
  const [overtimeMultipliers] = useState<OvertimeMultiplier[]>([
    {
      id: 'regular',
      name: 'Regular Time',
      nameAr: 'الوقت العادي',
      multiplier: 1.00,
      description: 'Standard hourly rate',
      isDefault: false,
      saudiLaborLawCompliant: true
    },
    {
      id: 'time_half',
      name: 'Time and Half',
      nameAr: 'الوقت ونصف',
      multiplier: 1.50,
      description: '50% premium over standard rate (Saudi law minimum)',
      isDefault: true,
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
  ]);

  // Standard hours configuration
  const [standardHoursConfig, setStandardHoursConfig] = useState<StandardHoursConfig>({
    id: 'default',
    standardHoursPerMonth: 176,
    workingDaysPerMonth: 22,
    hoursPerDay: 8,
    lastModified: new Date().toISOString(),
    modifiedBy: 'System Administrator',
    effectiveDate: new Date().toISOString().split('T')[0]
  });

  // Sample hourly rates data
  const [hourlyRates, setHourlyRates] = useState<HourlyRate[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'Ahmed Al-Rashid',
      employeeNameAr: 'أحمد الراشد',
      hourlyWage: 28.50,
      effectiveDate: '2024-01-01',
      createdBy: 'HR Manager',
      createdAt: '2024-01-01T10:00:00Z',
      approvedBy: 'HR Director',
      approvedAt: '2024-01-01T14:30:00Z',
      status: 'active',
      notes: 'Senior supervisor rate'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Mohammad Hassan',
      employeeNameAr: 'محمد حسن',
      hourlyWage: 22.75,
      effectiveDate: '2024-01-15',
      createdBy: 'HR Manager',
      createdAt: '2024-01-15T09:15:00Z',
      approvedBy: 'HR Director',
      approvedAt: '2024-01-15T11:45:00Z',
      status: 'active',
      notes: 'Equipment operator rate'
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: 'Ali Al-Mahmoud',
      employeeNameAr: 'علي المحمود',
      hourlyWage: 25.00,
      effectiveDate: '2024-02-01',
      createdBy: 'HR Manager',
      createdAt: '2024-02-01T08:30:00Z',
      status: 'draft',
      notes: 'Pending approval for new hire'
    }
  ]);

  const [newRate, setNewRate] = useState<Partial<HourlyRate>>({
    employeeId: '',
    employeeName: '',
    employeeNameAr: '',
    hourlyWage: 18.00,
    effectiveDate: new Date().toISOString().split('T')[0],
    status: 'draft',
    notes: ''
  });

  // Calculate monthly equivalent
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

  // Real-time calculation
  const [monthlyCalculation, setMonthlyCalculation] = useState<MonthlyCalculation>(
    calculateMonthlyEquivalent(
      calculationInputs.hourlyRate,
      calculationInputs.standardHours,
      calculationInputs.overtimeHours,
      overtimeMultipliers.find(m => m.id === calculationInputs.selectedMultiplier)?.multiplier || 1.5
    )
  );

  // Update calculation when inputs change
  useEffect(() => {
    const selectedMultiplier = overtimeMultipliers.find(m => m.id === calculationInputs.selectedMultiplier);
    const calculation = calculateMonthlyEquivalent(
      calculationInputs.hourlyRate,
      calculationInputs.standardHours,
      calculationInputs.overtimeHours,
      selectedMultiplier?.multiplier || 1.5
    );
    setMonthlyCalculation(calculation);
  }, [calculationInputs, overtimeMultipliers]);

  // Format SAR currency
  const formatSAR = (amount: number): string => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Validate hourly wage
  const validateHourlyWage = (wage: number): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (wage < 18.00) {
      errors.push(isArabic ? 'الأجر أقل من الحد الأدنى السعودي (18.00 ريال)' : 'Wage below Saudi minimum wage (18.00 SAR)');
    }
    
    if (wage > 500.00) {
      errors.push(isArabic ? 'الأجر يتجاوز الحد الأقصى (500.00 ريال)' : 'Wage exceeds maximum limit (500.00 SAR)');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  };

  const handleAddRate = () => {
    if (!newRate.employeeName || !newRate.hourlyWage) {
      alert(isArabic ? 'يرجى ملء الحقول المطلوبة' : 'Please fill in required fields');
      return;
    }

    const validation = validateHourlyWage(newRate.hourlyWage);
    if (!validation.valid) {
      alert(validation.errors.join('\n'));
      return;
    }

    const rate: HourlyRate = {
      ...newRate,
      id: String(hourlyRates.length + 1),
      employeeId: `EMP${String(hourlyRates.length + 1).padStart(3, '0')}`,
      createdBy: 'Current User',
      createdAt: new Date().toISOString()
    } as HourlyRate;

    setHourlyRates([...hourlyRates, rate]);
    setNewRate({
      employeeId: '',
      employeeName: '',
      employeeNameAr: '',
      hourlyWage: 18.00,
      effectiveDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      notes: ''
    });
    setShowAddRate(false);
    alert(isArabic ? 'تم إضافة معدل الأجر بنجاح!' : 'Hourly rate added successfully!');
  };

  const handleUpdateStandardHours = () => {
    if (standardHoursConfig.standardHoursPerMonth < 120 || standardHoursConfig.standardHoursPerMonth > 220) {
      alert(isArabic ? 'الساعات القياسية يجب أن تكون بين 120 و 220 ساعة شهرياً' : 'Standard hours must be between 120 and 220 hours per month');
      return;
    }

    setStandardHoursConfig({
      ...standardHoursConfig,
      lastModified: new Date().toISOString(),
      modifiedBy: 'Current User'
    });
    
    alert(isArabic ? 'تم تحديث الساعات القياسية بنجاح!' : 'Standard hours updated successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier === 1.00) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (multiplier === 1.50) return 'bg-green-100 text-green-800 border-green-200';
    if (multiplier === 2.00) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? 'إدارة الأجور بالساعة' : 'Hourly Rate Management'}
        </h1>
        <div className="flex items-center gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Calculator className="w-4 h-4" />
            {isArabic ? 'حاسبة الرواتب' : 'Salary Calculator'}
          </button>
          <button 
            onClick={() => setShowAddRate(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isArabic ? 'إضافة معدل جديد' : 'Add New Rate'}
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">{hourlyRates.filter(r => r.status === 'active').length}</div>
              <div className="text-sm text-blue-700">{isArabic ? 'معدلات نشطة' : 'Active Rates'}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {formatSAR(hourlyRates.reduce((avg, rate) => avg + rate.hourlyWage, 0) / hourlyRates.length || 0).replace('﷼', '')}
              </div>
              <div className="text-sm text-green-700">{isArabic ? 'متوسط الأجر' : 'Average Rate'}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">{standardHoursConfig.standardHoursPerMonth}</div>
              <div className="text-sm text-purple-700">{isArabic ? 'ساعات قياسية' : 'Standard Hours'}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-900">1.5x</div>
              <div className="text-sm text-yellow-700">{isArabic ? 'معدل العمل الإضافي' : 'Overtime Rate'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Saudi Labor Law Compliance Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-800">
              {isArabic ? 'متوافق مع قانون العمل السعودي' : 'Saudi Labor Law Compliant'}
            </h3>
            <p className="text-sm text-green-700">
              {isArabic 
                ? 'الحد الأدنى للأجور: 18.00 ريال/ساعة • العمل الإضافي: 1.5x كحد أدنى • ساعات العمل القياسية: 176 ساعة/شهر'
                : 'Minimum wage: 18.00 SAR/hour • Overtime: 1.5x minimum • Standard hours: 176 hours/month'
              }
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-800">100%</div>
            <div className="text-sm text-green-600">{isArabic ? 'متوافق' : 'Compliant'}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('rates')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'rates'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {isArabic ? 'معدلات الأجور' : 'Hourly Rates'}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('configuration')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'configuration'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {isArabic ? 'الإعدادات' : 'Configuration'}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('calculations')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'calculations'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                {isArabic ? 'حاسبة الراتب' : 'Salary Calculator'}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'reports'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                {isArabic ? 'التقارير' : 'Reports'}
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'rates' && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? 'الموظف' : 'Employee'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? 'الأجر بالساعة' : 'Hourly Rate'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? 'الراتب الشهري المكافئ' : 'Monthly Equivalent'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? 'تاريخ السريان' : 'Effective Date'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? 'الحالة' : 'Status'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {isArabic ? 'الإجراءات' : 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {hourlyRates.map((rate) => {
                      const monthlyEquivalent = calculateMonthlyEquivalent(rate.hourlyWage, standardHoursConfig.standardHoursPerMonth);
                      return (
                        <tr key={rate.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {isArabic ? rate.employeeNameAr : rate.employeeName}
                              </div>
                              <div className="text-sm text-gray-500">{rate.employeeId}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                            {formatSAR(rate.hourlyWage)}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-green-600">
                            {formatSAR(monthlyEquivalent.totalMonthlyEquivalent)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {rate.effectiveDate}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(rate.status)}`}>
                              {rate.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setEditingRate(rate)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-800 p-1 rounded">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'configuration' && (
            <div className="space-y-6">
              {/* Overtime Rate Configuration */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {isArabic ? 'إعدادات معدل العمل الإضافي' : 'Overtime Rate Configuration'}
                </h3>
                <p className="text-sm text-blue-700 mb-6">
                  {isArabic 
                    ? 'اختر معدل العمل الإضافي المناسب وفقاً لقانون العمل السعودي'
                    : 'Select appropriate overtime rate according to Saudi labor law'
                  }
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {overtimeMultipliers.map((multiplier) => (
                    <div 
                      key={multiplier.id}
                      onClick={() => setCalculationInputs({...calculationInputs, selectedMultiplier: multiplier.id})}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        calculationInputs.selectedMultiplier === multiplier.id
                          ? getMultiplierColor(multiplier.multiplier) + ' shadow-lg transform scale-105'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl font-bold">
                          {multiplier.multiplier.toFixed(2)}x
                        </div>
                        {multiplier.isDefault && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {isArabic ? 'افتراضي' : 'Default'}
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-gray-900 mb-2">
                        {isArabic ? multiplier.nameAr : multiplier.name}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {multiplier.description}
                      </div>
                      {multiplier.saudiLaborLawCompliant && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          <span>{isArabic ? 'متوافق مع القانون السعودي' : 'Saudi Law Compliant'}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Selected Multiplier Info */}
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {isArabic ? 'المعدل المحدد:' : 'Selected Rate:'}
                  </h4>
                  {(() => {
                    const selected = overtimeMultipliers.find(m => m.id === calculationInputs.selectedMultiplier);
                    return selected ? (
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getMultiplierColor(selected.multiplier)}`}>
                          {selected.multiplier.toFixed(2)}x - {isArabic ? selected.nameAr : selected.name}
                        </span>
                        <span className="text-sm text-gray-600">{selected.description}</span>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>

              {/* Standard Hours Configuration */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  {isArabic ? 'إعدادات الساعات القياسية' : 'Standard Hours Configuration'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'ساعات شهرية قياسية' : 'Standard Hours per Month'}
                    </label>
                    <input 
                      type="number" 
                      value={standardHoursConfig.standardHoursPerMonth}
                      onChange={(e) => setStandardHoursConfig({
                        ...standardHoursConfig,
                        standardHoursPerMonth: parseInt(e.target.value) || 176
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      min="120"
                      max="220"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {isArabic ? 'النطاق: 120-220 ساعة' : 'Range: 120-220 hours'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'أيام العمل شهرياً' : 'Working Days per Month'}
                    </label>
                    <input 
                      type="number" 
                      value={standardHoursConfig.workingDaysPerMonth}
                      onChange={(e) => setStandardHoursConfig({
                        ...standardHoursConfig,
                        workingDaysPerMonth: parseInt(e.target.value) || 22
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      min="20"
                      max="26"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'ساعات يومية' : 'Hours per Day'}
                    </label>
                    <input 
                      type="number" 
                      value={standardHoursConfig.hoursPerDay}
                      onChange={(e) => setStandardHoursConfig({
                        ...standardHoursConfig,
                        hoursPerDay: parseInt(e.target.value) || 8
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      min="6"
                      max="10"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleUpdateStandardHours}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? 'حفظ الإعدادات' : 'Save Configuration'}
                </button>
              </div>

              {/* Validation Rules */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {isArabic ? 'قواعد التحقق' : 'Validation Rules'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">{isArabic ? 'الأجر بالساعة:' : 'Hourly Wage:'}</h4>
                    <ul className="space-y-1 text-yellow-700">
                      <li>• {isArabic ? 'الحد الأدنى: 18.00 ريال' : 'Minimum: 18.00 SAR'}</li>
                      <li>• {isArabic ? 'الحد الأقصى: 500.00 ريال' : 'Maximum: 500.00 SAR'}</li>
                      <li>• {isArabic ? 'دقة: منزلتان عشريتان' : 'Precision: 2 decimal places'}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">{isArabic ? 'العمل الإضافي:' : 'Overtime:'}</h4>
                    <ul className="space-y-1 text-yellow-700">
                      <li>• {isArabic ? 'الحد الأدنى: 1.5x (قانون سعودي)' : 'Minimum: 1.5x (Saudi law)'}</li>
                      <li>• {isArabic ? 'العمل الليلي: +25% إضافي' : 'Night shift: +25% additional'}</li>
                      <li>• {isArabic ? 'عمل العطل: 2.0x' : 'Holiday work: 2.0x'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calculations' && (
            <div className="space-y-6">
              {/* Real-time Salary Calculator */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-green-600" />
                  {isArabic ? 'حاسبة الراتب الشهري المكافئ' : 'Monthly Salary Equivalent Calculator'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Input Section */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">{isArabic ? 'المدخلات' : 'Inputs'}</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? 'الأجر بالساعة (ريال)' : 'Hourly Rate (SAR)'}
                      </label>
                      <input 
                        type="number" 
                        value={calculationInputs.hourlyRate}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          hourlyRate: parseFloat(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        min="18"
                        max="500"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? 'الساعات القياسية' : 'Standard Hours'}
                      </label>
                      <input 
                        type="number" 
                        value={calculationInputs.standardHours}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          standardHours: parseInt(e.target.value) || 176
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        min="120"
                        max="220"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? 'ساعات العمل الإضافي' : 'Overtime Hours'}
                      </label>
                      <input 
                        type="number" 
                        value={calculationInputs.overtimeHours}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          overtimeHours: parseInt(e.target.value) || 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isArabic ? 'معدل العمل الإضافي' : 'Overtime Multiplier'}
                      </label>
                      <select 
                        value={calculationInputs.selectedMultiplier}
                        onChange={(e) => setCalculationInputs({
                          ...calculationInputs,
                          selectedMultiplier: e.target.value
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        {overtimeMultipliers.map(multiplier => (
                          <option key={multiplier.id} value={multiplier.id}>
                            {multiplier.multiplier.toFixed(2)}x - {isArabic ? multiplier.nameAr : multiplier.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">{isArabic ? 'النتائج' : 'Results'}</h4>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">{isArabic ? 'الأجر العادي:' : 'Regular Pay:'}</span>
                          <span className="font-semibold text-gray-900">{formatSAR(monthlyCalculation.regularPay)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">{isArabic ? 'أجر العمل الإضافي:' : 'Overtime Pay:'}</span>
                          <span className="font-semibold text-blue-600">{formatSAR(monthlyCalculation.overtimePay)}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                          <span className="text-lg font-semibold text-gray-900">{isArabic ? 'الإجمالي الشهري:' : 'Monthly Total:'}</span>
                          <span className="text-xl font-bold text-green-600">{formatSAR(monthlyCalculation.totalMonthlyEquivalent)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">{isArabic ? 'الأجر الفعلي بالساعة:' : 'Effective Hourly Rate:'}</span>
                          <span className="font-semibold text-purple-600">{formatSAR(monthlyCalculation.effectiveHourlyRate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown Chart */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h5 className="font-semibold text-gray-800 mb-3">{isArabic ? 'توزيع الراتب' : 'Salary Breakdown'}</h5>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <span className="text-sm">{isArabic ? 'الأجر العادي' : 'Regular Pay'} ({((monthlyCalculation.regularPay / monthlyCalculation.totalMonthlyEquivalent) * 100).toFixed(1)}%)</span>
                        </div>
                        {monthlyCalculation.overtimePay > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <span className="text-sm">{isArabic ? 'العمل الإضافي' : 'Overtime Pay'} ({((monthlyCalculation.overtimePay / monthlyCalculation.totalMonthlyEquivalent) * 100).toFixed(1)}%)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {isArabic ? 'تقارير الأجور بالساعة' : 'Hourly Rate Reports'}
                </h3>
                <div className="text-sm text-gray-600">
                  {isArabic 
                    ? 'سيتم عرض التقارير التفصيلية والتحليلات هنا...'
                    : 'Detailed reports and analytics will be displayed here...'
                  }
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Rate Modal */}
      {showAddRate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isArabic ? 'إضافة معدل أجر جديد' : 'Add New Hourly Rate'}
              </h3>
              <button 
                onClick={() => setShowAddRate(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? 'اسم الموظف (إنجليزي)' : 'Employee Name (English)'} *
                  </label>
                  <input 
                    type="text" 
                    value={newRate.employeeName}
                    onChange={(e) => setNewRate({...newRate, employeeName: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? 'اسم الموظف (عربي)' : 'Employee Name (Arabic)'}
                  </label>
                  <input 
                    type="text" 
                    value={newRate.employeeNameAr}
                    onChange={(e) => setNewRate({...newRate, employeeNameAr: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? 'الأجر بالساعة (ريال)' : 'Hourly Wage (SAR)'} *
                  </label>
                  <input 
                    type="number" 
                    value={newRate.hourlyWage}
                    onChange={(e) => setNewRate({...newRate, hourlyWage: parseFloat(e.target.value) || 18.00})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="18.00"
                    max="500.00"
                    step="0.01"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {isArabic ? 'الحد الأدنى: 18.00 ريال' : 'Minimum: 18.00 SAR'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? 'تاريخ السريان' : 'Effective Date'} *
                  </label>
                  <input 
                    type="date" 
                    value={newRate.effectiveDate}
                    onChange={(e) => setNewRate({...newRate, effectiveDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'ملاحظات' : 'Notes'}
                </label>
                <textarea 
                  value={newRate.notes}
                  onChange={(e) => setNewRate({...newRate, notes: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              {/* Preview Calculation */}
              {newRate.hourlyWage && newRate.hourlyWage >= 18 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {isArabic ? 'معاينة الراتب الشهري' : 'Monthly Salary Preview'}
                  </h4>
                  <div className="text-sm text-blue-700">
                    {isArabic ? 'الراتب الشهري المكافئ:' : 'Monthly Equivalent:'} 
                    <span className="font-bold ml-2">
                      {formatSAR(calculateMonthlyEquivalent(newRate.hourlyWage, standardHoursConfig.standardHoursPerMonth).totalMonthlyEquivalent)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4">
                <button 
                  onClick={handleAddRate}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isArabic ? 'حفظ المعدل' : 'Save Rate'}
                </button>
                <button 
                  onClick={() => setShowAddRate(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
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