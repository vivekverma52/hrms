import React, { createContext, useContext, useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

// Bilingual Context for Language Management
interface BilingualContextType {
  language: 'en';
  setLanguage: (lang: 'en') => void;
  isRTL: boolean;
  t: (key: string, fallback?: string) => string;
  formatNumber: (num: number) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date | string) => string;
}

const BilingualContext = createContext<BilingualContextType | undefined>(undefined);

export const useBilingual = () => {
  const context = useContext(BilingualContext);
  if (!context) {
    throw new Error('useBilingual must be used within BilingualProvider');
  }
  return context;
};

// Enhanced Translation Dictionary
const translations = {
  // Navigation & Header
  'nav.dashboard': { en: 'Dashboard' },
  'nav.company': { en: 'Company & Clients' },
  'nav.manpower': { en: 'Workforce Management' },
  'nav.fleet': { en: 'Fleet Management' },
  'nav.invoices': { en: 'Smart Invoicing' },
  'nav.payroll': { en: 'Payroll Management' },
  'nav.compliance': { en: 'Compliance & Reports' },
  'nav.operations': { en: 'Operations Department' },
  'nav.finance': { en: 'Finance Department' },
  'nav.hr': { en: 'Human Resources' },
  'nav.ai': { en: 'AI Optimization' },
  
  // Common Actions
  'action.save': { en: 'Save' },
  'action.cancel': { en: 'Cancel' },
  'action.edit': { en: 'Edit' },
  'action.delete': { en: 'Delete' },
  'action.view': { en: 'View' },
  'action.export': { en: 'Export' },
  'action.import': { en: 'Import' },
  'action.search': { en: 'Search' },
  'action.filter': { en: 'Filter' },
  'action.refresh': { en: 'Refresh' },
  
  // Status Labels
  'status.active': { en: 'Active' },
  'status.inactive': { en: 'Inactive' },
  'status.pending': { en: 'Pending' },
  'status.completed': { en: 'Completed' },
  'status.cancelled': { en: 'Cancelled' },
  'status.approved': { en: 'Approved' },
  'status.rejected': { en: 'Rejected' },
  
  // Time & Date
  'time.today': { en: 'Today' },
  'time.yesterday': { en: 'Yesterday' },
  'time.thisWeek': { en: 'This Week' },
  'time.thisMonth': { en: 'This Month' },
  'time.thisYear': { en: 'This Year' },
  
  // Company Information
  'company.name': { en: 'HRMS' },
  'company.tagline': { en: 'Operations & General Contracting' },
  'company.description': { en: 'Leading provider of workforce and operational solutions in Saudi Arabia' },
  
  // Dashboard Metrics
  'metrics.totalWorkforce': { en: 'Total Workforce' },
  'metrics.activeProjects': { en: 'Active Projects' },
  'metrics.realTimeProfits': { en: 'Real-Time Profits' },
  'metrics.utilizationRate': { en: 'Utilization Rate' },
  
  // Form Labels
  'form.name': { en: 'Name' },
  'form.email': { en: 'Email' },
  'form.phone': { en: 'Phone' },
  'form.address': { en: 'Address' },
  'form.date': { en: 'Date' },
  'form.amount': { en: 'Amount' },
  'form.description': { en: 'Description' },
  'form.notes': { en: 'Notes' },
  
  // Validation Messages
  'validation.required': { en: 'This field is required' },
  'validation.email': { en: 'Please enter a valid email address' },
  'validation.phone': { en: 'Please enter a valid phone number' },
  'validation.minLength': { en: 'Minimum length is {min} characters' },
  
  // Success Messages
  'success.saved': { en: 'Successfully saved!' },
  'success.deleted': { en: 'Successfully deleted!' },
  'success.updated': { en: 'Successfully updated!' },
  'success.created': { en: 'Successfully created!' },
  
  // Error Messages
  'error.general': { en: 'An error occurred. Please try again.' },
  'error.network': { en: 'Network error. Please check your connection.' },
  'error.unauthorized': { en: 'You are not authorized to perform this action.' },
  'error.notFound': { en: 'The requested item was not found.' }
};

// Bilingual Provider Component
interface BilingualProviderProps {
  children: React.ReactNode;
  defaultLanguage?: 'en';
}

const BilingualProvider: React.FC<BilingualProviderProps> = ({ 
  children, 
  defaultLanguage = 'en' 
}) => {
  const [language, setLanguage] = useState<'en'>(() => {
    const stored = localStorage.getItem('preferred_language');
    return (stored as 'en') || defaultLanguage;
  });

  const isRTL = false;

  // Save language preference
  useEffect(() => {
    localStorage.setItem('preferred_language', language);
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string, fallback?: string): string => {
    const translation = translations[key as keyof typeof translations];
    if (translation) {
      return translation[language];
    }
    return fallback || key;
  };

  // Number formatting
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Currency formatting
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Date formatting
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const contextValue: BilingualContextType = {
    language,
    setLanguage,
    isRTL,
    t,
    formatNumber,
    formatCurrency,
    formatDate
  };

  return (
    <BilingualContext.Provider value={contextValue}>
      <div className="min-h-screen ltr" dir="ltr">
        {children}
      </div>
    </BilingualContext.Provider>
  );
};

// Enhanced Language Switcher Component
const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage, t } = useBilingual();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nameNative: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentLanguage?.flag} {currentLanguage?.nameNative}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as 'en');
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                language === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex-1">
                <div className="font-medium">{lang.nameNative}</div>
                <div className="text-xs text-gray-500">{lang.name}</div>
              </div>
              {language === lang.code && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Bilingual Text Component
interface BilingualTextProps {
  en: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

const BilingualText: React.FC<BilingualTextProps> = ({ 
  en, 
  className = '', 
  tag = 'span' 
}) => {
  const Component = tag;
  
  return (
    <Component className={className}>
      {en}
    </Component>
  );
};

// Enhanced Form Field Component with Bilingual Support
interface BilingualFormFieldProps {
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const BilingualFormField: React.FC<BilingualFormFieldProps> = ({
  label,
  placeholder,
  error,
  required = false,
  children,
  className = ''
}) => {
  const { isRTL } = useBilingual();

  return (
    <div className={`space-y-2 ${className}`}>
      <label className={`block text-sm font-medium text-gray-700 text-left`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {React.cloneElement(children as React.ReactElement, {
          placeholder: placeholder,
          className: `w-full border border-gray-300 rounded-lg px-3 py-2 text-left ${
            error ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'
          } focus:outline-none focus:ring-1 focus:ring-blue-500`
        })}
      </div>
      
      {error && (
        <p className={`text-sm text-red-600 text-left`}>
          {error}
        </p>
      )}
    </div>
  );
};

// Bilingual Status Badge Component
interface BilingualStatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  className?: string;
}

const BilingualStatusBadge: React.FC<BilingualStatusBadgeProps> = ({
  status,
  variant = 'default',
  className = ''
}) => {
  const variantClasses = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${variantClasses[variant]} ${className}`}>
      {status}
    </span>
  );
};

// Bilingual Data Table Component
interface BilingualTableColumn {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface BilingualTableProps {
  columns: BilingualTableColumn[];
  data: any[];
  className?: string;
  emptyMessage?: string;
}

const BilingualTable: React.FC<BilingualTableProps> = ({
  columns,
  data,
  className = '',
  emptyMessage = 'No data available'
}) => {
  const { isRTL } = useBilingual();

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left`}
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-4 text-sm text-gray-900 text-left`}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Bilingual Modal Component
interface BilingualModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const BilingualModal: React.FC<BilingualModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = ''
}) => {
  const { isRTL } = useBilingual();

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-xl w-full ${sizeClasses[size]} max-h-screen overflow-y-auto ${className}`}>
        <div className={`flex items-center justify-between p-6 border-b border-gray-200`}>
          <h3 className="text-xl font-bold text-gray-900">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Bilingual Card Component
interface BilingualCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}

const BilingualCard: React.FC<BilingualCardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  headerActions
}) => {
  const { isRTL } = useBilingual();

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {(title || subtitle || headerActions) && (
        <div className={`p-6 border-b border-gray-200 text-left`}>
          <div className={`flex items-center justify-between`}>
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {headerActions && (
              <div className={`flex items-center gap-2`}>
                {headerActions}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

// Export all components
export {
  BilingualProvider,
  LanguageSwitcher,
  BilingualText,
  BilingualFormField,
  BilingualStatusBadge,
  BilingualTable,
  BilingualModal,
  BilingualCard
};