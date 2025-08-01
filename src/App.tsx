import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LoginForm } from './components/auth/LoginForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SessionManager } from './components/auth/SessionManager';
import { BilingualProvider } from './components/BilingualLayout';
import { EnhancedBilingualHeader } from './components/EnhancedBilingualHeader';
import { EnhancedBilingualSidebar } from './components/EnhancedBilingualSidebar';
import { EnhancedBilingualDashboard } from './components/EnhancedBilingualDashboard';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CompanyManagement } from './components/CompanyManagement';
import { ManpowerManagement } from './components/ManpowerManagement';
import { FleetManagement } from './components/FleetManagement';
import { InvoiceManagement } from './components/InvoiceManagement';
import { PayrollManagement } from './components/PayrollManagement';
import { ComplianceReporting } from './components/ComplianceReporting';
import { OperationsDepartment } from './components/OperationsDepartment';
import { FinanceDepartment } from './components/FinanceDepartment';
import { HRDepartment } from './components/HRDepartment';
import { SystemSetup } from './components/SystemSetup';
import { UserManagement } from './components/UserManagement';
import { WorkProgress } from './components/WorkProgress';
import { LeadManagement } from './components/LeadManagement';
import { TaskManagement } from './components/TaskManagement';
import { UserAccessRoles } from './components/UserAccessRoles';
import { ZATCAInvoicingSystem } from './components/ZATCAInvoicingSystem';
import { HourlyRateManagement } from './components/HourlyRateManagement';
import { EmployeeManagementHub } from './components/hrms/EmployeeManagementHub';
import { NotificationDashboard } from './components/notifications/NotificationDashboard';
import { NotificationTester } from './components/notifications/NotificationTester';
import { AIOptimizationDashboard } from './components/ai/AIOptimizationDashboard';
import { PrivateEmployeeDashboard } from './components/dashboard/PrivateEmployeeDashboard';
import { ComprehensiveAdminDashboard } from './components/dashboard/ComprehensiveAdminDashboard';

type ActiveModule = 'dashboard' | 'company' | 'manpower' | 'fleet' | 'invoices' | 'payroll' | 'compliance' | 'operations' | 'finance' | 'hr' | 'system' | 'users' | 'work-progress' | 'lead-management' | 'task-management' | 'user-access-roles' | 'hourly-rates' | 'notifications' | 'notification-tester' | 'ai-optimization';

// Main App Component with Authentication
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <p className="text-gray-600">Loading HRMS System...</p>
        </div>
      </div>
    );
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        // Check if user has admin role for admin dashboard
        const isAdmin = user?.role.level >= 8 || user?.role.id === 'admin';
        if (isAdmin) {
          return <ComprehensiveAdminDashboard />;
        }
        // Check if user has employee role for private dashboard
        const isEmployee = user?.role.id === 'employee' || user?.role.level < 5;
        if (isEmployee) {
          return <PrivateEmployeeDashboard />;
        }
        return <Dashboard />;
      case 'company':
        return <CompanyManagement />;
      case 'manpower':
        return <ManpowerManagement />;
      case 'fleet':
        return <FleetManagement />;
      case 'invoices':
        return <ZATCAInvoicingSystem />;
      case 'payroll':
        return <PayrollManagement />;
      case 'compliance':
        return <ComplianceReporting />;
      case 'operations':
        return <OperationsDepartment />;
      case 'finance':
        return <FinanceDepartment />;
      case 'hr':
        return <EmployeeManagementHub />;
      case 'system':
        return <SystemSetup />;
      case 'users':
        return <UserManagement />;
      case 'work-progress':
        return <WorkProgress />;
      case 'lead-management':
        return <LeadManagement />;
      case 'task-management':
        return <TaskManagement />;
      case 'user-access-roles':
        return <UserAccessRoles />;
      case 'hourly-rates':
        return <HourlyRateManagement />;
      case 'notifications':
        return <NotificationDashboard />;
      case 'notification-tester':
        return <NotificationTester />;
      case 'ai-optimization':
        return <AIOptimizationDashboard />;
      default:
        return <Dashboard />;
    }
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30">
      {/* Session Manager for timeout warnings */}
      <SessionManager />
      
      {/* Enhanced Bilingual Layout */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 hidden lg:block`}>
          <EnhancedBilingualSidebar
            activeModule={activeModule}
            setActiveModule={setActiveModule}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
            <div className="w-64">
              <EnhancedBilingualSidebar
                activeModule={activeModule}
                setActiveModule={(module) => {
                  setActiveModule(module);
                  setMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <EnhancedBilingualHeader
            onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
          
          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6 backdrop-blur-sm">
            {renderActiveModule()}
          </main>
        </div>
      </div>
      
      {/* Fallback for non-enhanced components */}
      <div className="hidden">
        <Sidebar 
          activeModule={activeModule} 
          setActiveModule={setActiveModule}
        />
      </div>
    </div>
  );
};

// Root App Component with Routing and Providers
function App() {
  return (
    <Router>
      <AuthProvider>
        <BilingualProvider defaultLanguage="en">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginForm />} />
            
            {/* Protected Routes */}
            <Route path="/*" element={<AppContent />} />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BilingualProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;