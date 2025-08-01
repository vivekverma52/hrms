// Modern Login Form Component with Security Features

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  Building2
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoginCredentials } from '../../types/auth';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess, 
  redirectTo = '/dashboard'
}) => {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || redirectTo;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state, redirectTo]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!credentials.username.trim()) {
      errors.push('Username is required');
    } else if (credentials.username.length < 3) {
      errors.push('Username must be at least 3 characters');
    }

    if (!credentials.password.trim()) {
      errors.push('Password is required');
    } else if (credentials.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting || isLoading) {
      return;
    }
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      const success = await login(credentials);
      
      if (success) {
        setLoginSuccess(true);
        
        // Handle successful login
        if (onSuccess) {
          onSuccess();
        } else {
          // Navigate to intended destination or default
          const from = location.state?.from?.pathname || redirectTo;
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      console.error('Login submission error:', error);
      setValidationErrors(['An unexpected error occurred']);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  // Demo credentials helper
  const fillDemoCredentials = (role: 'admin' | 'hr' | 'ops' | 'finance') => {
    const demoCredentials = {
      admin: { username: 'admin', password: 'admin123' },
      hr: { username: 'hr.manager', password: 'hr123' },
      ops: { username: 'ops.supervisor', password: 'ops123' },
      finance: { username: 'finance.clerk', password: 'finance123' }
    };

    setCredentials(prev => ({
      ...prev,
      ...demoCredentials[role]
    }));
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting && !isLoading) {
      handleSubmit(e as any);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4" onKeyDown={handleKeyDown}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            HRMS
          </h1>
          <p className="text-gray-600">
            Operations & General Contracting
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sign In
            </h2>
            <p className="text-gray-600">
              Enter your credentials to access the system
            </p>
          </div>

          {/* Success Message */}
          {loginSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Login successful! Redirecting...
              </span>
            </div>
          )}

          {/* Error Messages */}
          {(error || validationErrors.length > 0) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">
                  Login Error
                </span>
              </div>
              {error && (
                <p className="text-red-700 text-sm mb-2">{error}</p>
              )}
              {validationErrors.map((err, index) => (
                <p key={index} className="text-red-700 text-sm">{err}</p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute top-1/2 transform -translate-y-1/2 text-gray-400 left-3" />
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter your username"
                  disabled={isSubmitting || loginSuccess || isLoading}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute top-1/2 transform -translate-y-1/2 text-gray-400 left-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
                  disabled={isSubmitting || loginSuccess || isLoading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 right-3"
                  disabled={isSubmitting || loginSuccess || isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={credentials.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  disabled={isSubmitting || loginSuccess || isLoading}
                />
                <span className="text-sm text-gray-600 ml-2">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-green-600 hover:text-green-800 font-medium"
                disabled={isSubmitting || loginSuccess || isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loginSuccess || isLoading || !credentials.username.trim() || !credentials.password.trim()}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : loginSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Success!
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 text-center">
              Demo credentials for testing:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fillDemoCredentials('admin')}
                className="text-xs bg-red-100 text-red-800 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
                disabled={isSubmitting || loginSuccess || isLoading}
              >
                Admin
              </button>
              <button
                onClick={() => fillDemoCredentials('hr')}
                className="text-xs bg-blue-100 text-blue-800 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                disabled={isSubmitting || loginSuccess || isLoading}
              >
                HR Manager
              </button>
              <button
                onClick={() => fillDemoCredentials('ops')}
                className="text-xs bg-green-100 text-green-800 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors"
                disabled={isSubmitting || loginSuccess || isLoading}
              >
                Operations
              </button>
              <button
                onClick={() => fillDemoCredentials('finance')}
                className="text-xs bg-purple-100 text-purple-800 px-3 py-2 rounded-lg hover:bg-purple-200 transition-colors"
                disabled={isSubmitting || loginSuccess || isLoading}
              >
                Finance
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Security Notice
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Your session is protected with advanced encryption and secure authentication. You will be automatically logged out after 8 hours of inactivity.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            © 2024 HRMS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};