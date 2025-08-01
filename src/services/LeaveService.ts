import { LeaveRequest, LeaveBalance, LeaveType } from '../types/attendance';

export class LeaveService {
  private static readonly LEAVE_REQUESTS_KEY = 'leave_requests';
  private static readonly LEAVE_BALANCES_KEY = 'leave_balances';
  private static readonly LEAVE_TYPES_KEY = 'leave_types';

  /**
   * Initialize default leave types
   */
  static initializeLeaveTypes(): void {
    const existingTypes = this.getLeaveTypes();
    if (existingTypes.length === 0) {
      const defaultTypes: LeaveType[] = [
        {
          id: 'annual',
          name: 'Annual Leave',
          description: 'Yearly vacation allowance',
          maxDaysPerYear: 21,
          requiresApproval: true,
          advanceNoticeDays: 7,
          isPaid: true,
          carryOverAllowed: true,
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'sick',
          name: 'Sick Leave',
          description: 'Medical leave for illness',
          maxDaysPerYear: 30,
          requiresApproval: false,
          advanceNoticeDays: 0,
          isPaid: true,
          carryOverAllowed: false,
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'personal',
          name: 'Personal Leave',
          description: 'Personal time off',
          maxDaysPerYear: 5,
          requiresApproval: true,
          advanceNoticeDays: 3,
          isPaid: false,
          carryOverAllowed: false,
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'emergency',
          name: 'Emergency Leave',
          description: 'Emergency family situations',
          requiresApproval: true,
          advanceNoticeDays: 0,
          isPaid: true,
          carryOverAllowed: false,
          isActive: true,
          createdAt: new Date()
        }
      ];

      localStorage.setItem(this.LEAVE_TYPES_KEY, JSON.stringify(defaultTypes));
    }
  }

  /**
   * Submit a new leave request
   * @param leaveData - Leave request information
   * @returns Promise<LeaveRequest>
   */
  static async submitLeaveRequest(
    leaveData: Omit<LeaveRequest, 'id' | 'status' | 'requestedAt' | 'createdAt' | 'updatedAt'>
  ): Promise<LeaveRequest> {
    try {
      // Validate leave dates
      const startDate = new Date(leaveData.startDate);
      const endDate = new Date(leaveData.endDate);
      
      if (startDate >= endDate) {
        throw new Error('End date must be after start date');
      }

      // Calculate total days
      const totalDays = await this.calculateLeaveDays(leaveData.startDate, leaveData.endDate);

      // Check leave balance availability
      const balance = await this.getEmployeeLeaveBalance(leaveData.employeeId, startDate.getFullYear());
      const leaveTypeBalance = balance.find(b => b.leaveTypeId === leaveData.leaveTypeId);
      
      if (leaveTypeBalance && leaveTypeBalance.remainingDays < totalDays) {
        throw new Error('Insufficient leave balance');
      }

      // Check for overlapping requests
      const existingRequests = this.getLeaveRequests();
      const overlapping = existingRequests.some(req => 
        req.employeeId === leaveData.employeeId &&
        req.status !== 'rejected' &&
        req.status !== 'cancelled' &&
        (
          (new Date(req.startDate) <= startDate && new Date(req.endDate) >= startDate) ||
          (new Date(req.startDate) <= endDate && new Date(req.endDate) >= endDate) ||
          (new Date(req.startDate) >= startDate && new Date(req.endDate) <= endDate)
        )
      );

      if (overlapping) {
        throw new Error('Overlapping leave request exists');
      }

      const leaveRequest: LeaveRequest = {
        ...leaveData,
        id: this.generateId(),
        totalDays,
        status: 'pending',
        requestedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save leave request
      const requests = this.getLeaveRequests();
      requests.push(leaveRequest);
      localStorage.setItem(this.LEAVE_REQUESTS_KEY, JSON.stringify(requests));

      // Update pending balance
      if (leaveTypeBalance) {
        leaveTypeBalance.pendingDays += totalDays;
        this.updateLeaveBalance(leaveTypeBalance);
      }

      console.log('Leave request submitted:', leaveRequest);
      return leaveRequest;

    } catch (error) {
      console.error('Submit leave request failed:', error);
      throw error;
    }
  }

  /**
   * Approve or reject leave request
   * @param requestId - Leave request ID
   * @param approverId - Approver employee ID
   * @param decision - Approval decision
   * @param reason - Rejection reason if applicable
   * @returns Promise<LeaveRequest>
   */
  static async processLeaveRequest(
    requestId: string, 
    approverId: string, 
    decision: 'approved' | 'rejected',
    reason?: string
  ): Promise<LeaveRequest> {
    try {
      const requests = this.getLeaveRequests();
      const requestIndex = requests.findIndex(r => r.id === requestId);
      
      if (requestIndex === -1) {
        throw new Error('Leave request not found');
      }

      const request = requests[requestIndex];
      if (request.status !== 'pending') {
        throw new Error('Leave request already processed');
      }

      // Update request status
      requests[requestIndex] = {
        ...request,
        status: decision,
        approvedBy: approverId,
        approvedAt: new Date(),
        rejectionReason: decision === 'rejected' ? reason : undefined,
        updatedAt: new Date()
      };

      localStorage.setItem(this.LEAVE_REQUESTS_KEY, JSON.stringify(requests));

      // Update leave balances
      const balance = await this.getEmployeeLeaveBalance(request.employeeId, new Date(request.startDate).getFullYear());
      const leaveTypeBalance = balance.find(b => b.leaveTypeId === request.leaveTypeId);
      
      if (leaveTypeBalance) {
        leaveTypeBalance.pendingDays -= request.totalDays;
        
        if (decision === 'approved') {
          leaveTypeBalance.usedDays += request.totalDays;
        }
        
        this.updateLeaveBalance(leaveTypeBalance);
      }

      console.log('Leave request processed:', requests[requestIndex]);
      return requests[requestIndex];

    } catch (error) {
      console.error('Process leave request failed:', error);
      throw error;
    }
  }

  /**
   * Get employee leave balance for specific year
   * @param employeeId - Employee ID
   * @param year - Year to check
   * @returns Promise<LeaveBalance[]>
   */
  static async getEmployeeLeaveBalance(employeeId: string, year: number): Promise<LeaveBalance[]> {
    try {
      const balances = this.getLeaveBalances();
      let employeeBalances = balances.filter(b => b.employeeId === employeeId && b.year === year);

      // Initialize balances if they don't exist
      if (employeeBalances.length === 0) {
        const leaveTypes = this.getLeaveTypes();
        employeeBalances = leaveTypes.map(type => ({
          id: this.generateId(),
          employeeId,
          leaveTypeId: type.id,
          year,
          allocatedDays: type.maxDaysPerYear || 0,
          usedDays: 0,
          pendingDays: 0,
          remainingDays: type.maxDaysPerYear || 0,
          carryOverDays: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        // Save new balances
        balances.push(...employeeBalances);
        localStorage.setItem(this.LEAVE_BALANCES_KEY, JSON.stringify(balances));
      }

      return employeeBalances;

    } catch (error) {
      console.error('Get employee leave balance failed:', error);
      return [];
    }
  }

  /**
   * Calculate business days between dates
   * @param startDate - Start date
   * @param endDate - End date
   * @param excludeHolidays - Whether to exclude company holidays
   * @returns Promise<number>
   */
  static async calculateLeaveDays(
    startDate: string, 
    endDate: string, 
    excludeHolidays: boolean = true
  ): Promise<number> {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let businessDays = 0;

      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dayOfWeek = date.getDay();
        
        // Skip weekends (Saturday = 6, Sunday = 0)
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;

        // Check for company holidays if required
        if (excludeHolidays) {
          const isHoliday = await this.isCompanyHoliday(date.toISOString().split('T')[0]);
          if (isHoliday) continue;
        }

        businessDays++;
      }

      return businessDays;

    } catch (error) {
      console.error('Calculate leave days failed:', error);
      return 0;
    }
  }

  /**
   * Get pending leave requests for approval
   * @param approverId - Manager/approver ID
   * @returns Promise<LeaveRequest[]>
   */
  static async getPendingApprovals(approverId: string): Promise<LeaveRequest[]> {
    try {
      const requests = this.getLeaveRequests();
      
      // In a real implementation, this would check manager-employee relationships
      // For demo purposes, return all pending requests
      return requests.filter(r => r.status === 'pending');

    } catch (error) {
      console.error('Get pending approvals failed:', error);
      return [];
    }
  }

  /**
   * Get leave requests for employee
   * @param employeeId - Employee ID
   * @param year - Year to filter (optional)
   * @returns LeaveRequest[]
   */
  static getEmployeeLeaveRequests(employeeId: string, year?: number): LeaveRequest[] {
    const requests = this.getLeaveRequests();
    return requests.filter(r => {
      if (r.employeeId !== employeeId) return false;
      if (year) {
        const requestYear = new Date(r.startDate).getFullYear();
        return requestYear === year;
      }
      return true;
    });
  }

  // Private helper methods
  private static getLeaveRequests(): LeaveRequest[] {
    try {
      const requests = localStorage.getItem(this.LEAVE_REQUESTS_KEY);
      return requests ? JSON.parse(requests) : [];
    } catch (error) {
      console.error('Error loading leave requests:', error);
      return [];
    }
  }

  private static getLeaveBalances(): LeaveBalance[] {
    try {
      const balances = localStorage.getItem(this.LEAVE_BALANCES_KEY);
      return balances ? JSON.parse(balances) : [];
    } catch (error) {
      console.error('Error loading leave balances:', error);
      return [];
    }
  }

  private static getLeaveTypes(): LeaveType[] {
    try {
      const types = localStorage.getItem(this.LEAVE_TYPES_KEY);
      return types ? JSON.parse(types) : [];
    } catch (error) {
      console.error('Error loading leave types:', error);
      return [];
    }
  }

  private static updateLeaveBalance(balance: LeaveBalance): void {
    const balances = this.getLeaveBalances();
    const index = balances.findIndex(b => b.id === balance.id);
    
    if (index !== -1) {
      balance.remainingDays = balance.allocatedDays - balance.usedDays - balance.pendingDays;
      balance.updatedAt = new Date();
      balances[index] = balance;
      localStorage.setItem(this.LEAVE_BALANCES_KEY, JSON.stringify(balances));
    }
  }

  private static async isCompanyHoliday(date: string): Promise<boolean> {
    // In a real implementation, this would check against a company holiday calendar
    // For demo purposes, simulate some holidays
    const holidays = [
      '2024-01-01', // New Year
      '2024-09-23', // Saudi National Day
      '2024-12-25'  // Christmas (if applicable)
    ];
    
    return holidays.includes(date);
  }

  private static generateId(): string {
    return `leave_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}