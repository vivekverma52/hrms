// Authentication Hook for React Components

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { AuthService } from '../services/AuthService';
import { User, LoginCredentials, AuthState } from '../types/auth';

// Auth Context
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  hasRole: (roleId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    sessionExpiry: null
  });

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = AuthService.getCurrentUser();
        const token = AuthService.getToken();
        const sessionExpiry = AuthService.getSessionExpiry();
        const isAuthenticated = AuthService.isAuthenticated();

        setAuthState({
          user,
          token,
          isAuthenticated,
          isLoading: false,
          error: null,
          sessionExpiry
        });

        // Set up token refresh if needed
        if (isAuthenticated && AuthService.needsTokenRefresh()) {
          await refreshToken();
        }

      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to initialize authentication'
        }));
      }
    };

    initializeAuth();
  }, []);

  // Set up automatic token refresh
  useEffect(() => {
    if (!authState.isAuthenticated || !authState.sessionExpiry) return;

    const checkTokenExpiry = () => {
      if (AuthService.needsTokenRefresh()) {
        refreshToken();
      } else if (AuthService.isSessionExpired()) {
        logout();
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000);
    
    return () => clearInterval(interval);
  }, [authState.isAuthenticated, authState.sessionExpiry]);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await AuthService.login(credentials);

      if (response.success && response.user && response.token) {
        setAuthState({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          sessionExpiry: new Date(Date.now() + (response.expiresIn || 8 * 60 * 60 * 1000))
        });

        // Log successful login
        console.log('Login successful for user:', response.user.username);
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Login failed'
        }));

        console.error('Login failed:', response.message);
        return false;
      }

    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'An unexpected error occurred during login'
      }));

      return false;
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const currentUser = authState.user;
      await AuthService.logout();
      
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        sessionExpiry: null
      });

      // Log successful logout
      if (currentUser) {
        console.log('Logout successful for user:', currentUser.username);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear state even if logout call fails
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        sessionExpiry: null
      });
    }
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await AuthService.refreshToken();

      if (response.success && response.user && response.token) {
        setAuthState(prev => ({
          ...prev,
          user: response.user!,
          token: response.token!,
          sessionExpiry: new Date(Date.now() + (response.expiresIn || 8 * 60 * 60 * 1000)),
          error: null
        }));

        return true;
      } else {
        await logout();
        return false;
      }

    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      return false;
    }
  }, [logout]);

  // Permission check function
  const hasPermission = useCallback((permission: string): boolean => {
    return AuthService.hasPermission(permission);
  }, [authState.user]);

  // Role check function
  const hasRole = useCallback((roleId: string): boolean => {
    return AuthService.hasRole(roleId);
  }, [authState.user]);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshToken,
    hasPermission,
    hasRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook for protected components
export const useRequireAuth = (requiredPermissions?: string[], requiredRole?: string) => {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isLoading) {
      // Redirect to login or show login modal
      console.warn('Authentication required');
    }
  }, [auth.isAuthenticated, auth.isLoading]);

  const hasRequiredPermissions = !requiredPermissions || 
    requiredPermissions.every(permission => auth.hasPermission(permission));
  
  const hasRequiredRole = !requiredRole || auth.hasRole(requiredRole);

  return {
    ...auth,
    hasRequiredPermissions,
    hasRequiredRole,
    canAccess: auth.isAuthenticated && hasRequiredPermissions && hasRequiredRole
  };
};

// Session management hook
export const useSession = () => {
  const auth = useAuth();
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number>(0);

  useEffect(() => {
    if (!auth.sessionExpiry) return;

    const updateTimer = () => {
      const now = new Date();
      const expiry = new Date(auth.sessionExpiry!);
      const timeLeft = Math.max(0, expiry.getTime() - now.getTime());
      setTimeUntilExpiry(timeLeft);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [auth.sessionExpiry]);

  const formatTimeRemaining = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isExpiringSoon = timeUntilExpiry <= 5 * 60 * 1000; // 5 minutes

  return {
    timeUntilExpiry,
    timeRemainingFormatted: formatTimeRemaining(timeUntilExpiry),
    isExpiringSoon,
    extendSession: auth.refreshToken
  };
};