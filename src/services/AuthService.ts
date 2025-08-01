// Authentication Service with JWT and Session Management

import Cookies from 'js-cookie';
import { 
  User, 
  LoginCredentials, 
  AuthResponse, 
  SessionConfig,
  MOCK_USERS 
} from '../types/auth';

export class AuthService {
  private static readonly SESSION_CONFIG: SessionConfig = {
    tokenKey: 'HRMS_token',
    refreshTokenKey: 'HRMS_refresh_token',
    userKey: 'HRMS_user',
    expiryKey: 'HRMS_expiry',
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
    refreshThreshold: 30 * 60 * 1000 // 30 minutes
  };

  private static readonly LOGIN_ATTEMPTS_KEY = 'HRMS_login_attempts';
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  /**
   * Authenticate user with credentials
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Attempting login for user:', credentials.username);
      
      // Check for rate limiting
      const rateLimitCheck = this.checkRateLimit(credentials.username);
      if (!rateLimitCheck.allowed) {
        console.warn('Login rate limited for user:', credentials.username);
        return {
          success: false,
          message: `Too many login attempts. Please try again in ${Math.ceil(rateLimitCheck.timeRemaining / 60000)} minutes.`,
          errors: ['RATE_LIMITED']
        };
      }

      // Validate input
      const validation = this.validateCredentials(credentials);
      if (!validation.valid) {
        this.recordFailedAttempt(credentials.username);
        console.warn('Login validation failed for user:', credentials.username, validation.errors);
        return {
          success: false,
          message: 'Invalid credentials provided',
          errors: validation.errors
        };
      }

      // Simulate API call delay
      await this.simulateNetworkDelay(500, 1500);

      // Find user in mock database
      const mockUser = MOCK_USERS.find(user => 
        user.username === credentials.username && 
        user.password === credentials.password
      );

      if (!mockUser || !mockUser.isActive) {
        this.recordFailedAttempt(credentials.username);
        console.warn('Login failed - invalid credentials or inactive user:', credentials.username);
        return {
          success: false,
          message: 'Invalid username or password',
          errors: ['INVALID_CREDENTIALS']
        };
      }

      // Create user object
      const user: User = {
        ...mockUser,
        id: `user_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date()
      };

      // Generate tokens
      const token = this.generateJWT(user);
      const refreshToken = this.generateRefreshToken(user);
      const expiresIn = this.SESSION_CONFIG.maxAge;
      const sessionExpiry = new Date(Date.now() + expiresIn);

      // Store session data
      this.storeSession(user, token, refreshToken, sessionExpiry, credentials.rememberMe);

      // Clear failed attempts
      this.clearFailedAttempts(credentials.username);

      // Log successful login
      console.log(`User ${user.username} logged in successfully at ${new Date().toISOString()}`);

      return {
        success: true,
        user,
        token,
        refreshToken,
        expiresIn,
        message: 'Login successful'
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login. Please try again.',
        errors: ['SYSTEM_ERROR']
      };
    }
  }

  /**
   * Logout user and clear session
   */
  static async logout(): Promise<void> {
    try {
      const user = this.getCurrentUser();
      
      console.log('Logging out user:', user?.username);
      
      // Clear all session data
      this.clearSession();
      
      // Log logout
      if (user) {
        console.log(`User ${user.username} logged out at ${new Date().toISOString()}`);
      }

      // Simulate API call to invalidate server-side session
      await this.simulateNetworkDelay(200, 500);

    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local session even if server call fails
      this.clearSession();
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = this.getRefreshToken();
      const user = this.getCurrentUser();

      if (!refreshToken || !user) {
        return {
          success: false,
          message: 'No valid refresh token found',
          errors: ['NO_REFRESH_TOKEN']
        };
      }

      // Validate refresh token
      if (!this.validateRefreshToken(refreshToken)) {
        this.clearSession();
        return {
          success: false,
          message: 'Invalid refresh token',
          errors: ['INVALID_REFRESH_TOKEN']
        };
      }

      // Generate new tokens
      const newToken = this.generateJWT(user);
      const newRefreshToken = this.generateRefreshToken(user);
      const expiresIn = this.SESSION_CONFIG.maxAge;
      const sessionExpiry = new Date(Date.now() + expiresIn);

      // Update session
      this.storeSession(user, newToken, newRefreshToken, sessionExpiry, true);

      console.log(`Token refreshed for user ${user.username}`);

      return {
        success: true,
        user,
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn,
        message: 'Token refreshed successfully'
      };

    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearSession();
      return {
        success: false,
        message: 'Failed to refresh token',
        errors: ['REFRESH_FAILED']
      };
    }
  }

  /**
   * Get current authenticated user
   */
  static getCurrentUser(): User | null {
    try {
      const userJson = localStorage.getItem(this.SESSION_CONFIG.userKey);
      if (!userJson) return null;

      const user = JSON.parse(userJson);
      
      // Validate session expiry
      if (this.isSessionExpired()) {
        this.clearSession();
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Get current authentication token
   */
  static getToken(): string | null {
    return Cookies.get(this.SESSION_CONFIG.tokenKey) || null;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user && !this.isSessionExpired());
  }

  /**
   * Check if session is expired
   */
  static isSessionExpired(): boolean {
    const expiryStr = localStorage.getItem(this.SESSION_CONFIG.expiryKey);
    if (!expiryStr) return true;

    const expiry = new Date(expiryStr);
    return new Date() >= expiry;
  }

  /**
   * Check if token needs refresh
   */
  static needsTokenRefresh(): boolean {
    const expiryStr = localStorage.getItem(this.SESSION_CONFIG.expiryKey);
    if (!expiryStr) return false;

    const expiry = new Date(expiryStr);
    const now = new Date();
    const timeUntilExpiry = expiry.getTime() - now.getTime();

    return timeUntilExpiry <= this.SESSION_CONFIG.refreshThreshold;
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Admin has all permissions
    if (user.role.permissions.includes('*')) return true;

    // Check specific permissions
    return user.permissions.some(perm => 
      perm.resource === '*' || 
      perm.resource === permission.split('.')[0] ||
      user.role.permissions.some(rolePerm => 
        rolePerm === permission || 
        rolePerm === permission.split('.')[0] + '.*'
      )
    );
  }

  /**
   * Check if user has specific role
   */
  static hasRole(roleId: string): boolean {
    const user = this.getCurrentUser();
    return user?.role.id === roleId;
  }

  /**
   * Get session expiry time
   */
  static getSessionExpiry(): Date | null {
    const expiryStr = localStorage.getItem(this.SESSION_CONFIG.expiryKey);
    return expiryStr ? new Date(expiryStr) : null;
  }

  // ==================== PRIVATE METHODS ====================

  private static validateCredentials(credentials: LoginCredentials): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!credentials.username?.trim()) {
      errors.push('Username is required');
    }

    if (!credentials.password?.trim()) {
      errors.push('Password is required');
    }

    if (credentials.username && credentials.username.length < 3) {
      errors.push('Username must be at least 3 characters');
    }

    if (credentials.password && credentials.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    // Check for basic injection attempts
    const dangerousPatterns = [/<script/i, /javascript:/i, /on\w+=/i, /sql/i];
    const inputText = credentials.username + credentials.password;
    
    if (dangerousPatterns.some(pattern => pattern.test(inputText))) {
      errors.push('Invalid characters detected');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private static generateJWT(user: User): string {
    // In production, use a proper JWT library like jsonwebtoken
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      username: user.username,
      role: user.role.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor((Date.now() + this.SESSION_CONFIG.maxAge) / 1000)
    }));
    const signature = btoa(`signature_${user.id}_${Date.now()}`);
    
    return `${header}.${payload}.${signature}`;
  }

  private static generateRefreshToken(user: User): string {
    return btoa(`refresh_${user.id}_${Date.now()}_${Math.random()}`);
  }

  private static validateRefreshToken(token: string): boolean {
    try {
      const decoded = atob(token);
      return decoded.startsWith('refresh_') && decoded.length > 20;
    } catch {
      return false;
    }
  }

  private static storeSession(
    user: User, 
    token: string, 
    refreshToken: string, 
    expiry: Date, 
    persistent: boolean = false
  ): void {
    const cookieOptions = {
      expires: persistent ? 30 : undefined, // 30 days if remember me
      secure: window.location.protocol === 'https:',
      sameSite: 'strict' as const,
      path: '/'
    };

    // Store tokens in httpOnly-like cookies (simulated)
    Cookies.set(this.SESSION_CONFIG.tokenKey, token, cookieOptions);
    Cookies.set(this.SESSION_CONFIG.refreshTokenKey, refreshToken, cookieOptions);

    // Store user data and expiry in localStorage
    localStorage.setItem(this.SESSION_CONFIG.userKey, JSON.stringify(user));
    localStorage.setItem(this.SESSION_CONFIG.expiryKey, expiry.toISOString());
  }

  private static clearSession(): void {
    // Remove cookies
    Cookies.remove(this.SESSION_CONFIG.tokenKey);
    Cookies.remove(this.SESSION_CONFIG.refreshTokenKey);

    // Remove localStorage items
    localStorage.removeItem(this.SESSION_CONFIG.userKey);
    localStorage.removeItem(this.SESSION_CONFIG.expiryKey);
  }

  private static getRefreshToken(): string | null {
    return Cookies.get(this.SESSION_CONFIG.refreshTokenKey) || null;
  }

  private static checkRateLimit(username: string): { allowed: boolean; timeRemaining: number } {
    const attemptsKey = `${this.LOGIN_ATTEMPTS_KEY}_${username}`;
    const attemptsData = localStorage.getItem(attemptsKey);
    
    if (!attemptsData) {
      return { allowed: true, timeRemaining: 0 };
    }

    const { count, lastAttempt } = JSON.parse(attemptsData);
    const timeSinceLastAttempt = Date.now() - lastAttempt;
    
    if (timeSinceLastAttempt > this.LOCKOUT_DURATION) {
      // Reset attempts after lockout period
      localStorage.removeItem(attemptsKey);
      return { allowed: true, timeRemaining: 0 };
    }

    if (count >= this.MAX_LOGIN_ATTEMPTS) {
      return { 
        allowed: false, 
        timeRemaining: this.LOCKOUT_DURATION - timeSinceLastAttempt 
      };
    }

    return { allowed: true, timeRemaining: 0 };
  }

  private static recordFailedAttempt(username: string): void {
    const attemptsKey = `${this.LOGIN_ATTEMPTS_KEY}_${username}`;
    const attemptsData = localStorage.getItem(attemptsKey);
    
    let count = 1;
    if (attemptsData) {
      const existing = JSON.parse(attemptsData);
      count = existing.count + 1;
    }

    localStorage.setItem(attemptsKey, JSON.stringify({
      count,
      lastAttempt: Date.now()
    }));
  }

  private static clearFailedAttempts(username: string): void {
    const attemptsKey = `${this.LOGIN_ATTEMPTS_KEY}_${username}`;
    localStorage.removeItem(attemptsKey);
  }

  private static async simulateNetworkDelay(min: number, max: number): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}