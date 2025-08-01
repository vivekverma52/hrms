import { WorkSchedule, EmployeeSchedule, ScheduleException } from '../types/attendance';

export class ScheduleService {
  private static readonly SCHEDULES_KEY = 'work_schedules';
  private static readonly EMPLOYEE_SCHEDULES_KEY = 'employee_schedules';
  private static readonly EXCEPTIONS_KEY = 'schedule_exceptions';

  /**
   * Create a new work schedule template
   * @param scheduleData - Schedule configuration
   * @returns Promise<WorkSchedule>
   */
  static async createSchedule(
    scheduleData: Omit<WorkSchedule, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<WorkSchedule> {
    try {
      const schedule: WorkSchedule = {
        ...scheduleData,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const schedules = this.getWorkSchedules();
      schedules.push(schedule);
      localStorage.setItem(this.SCHEDULES_KEY, JSON.stringify(schedules));

      console.log('Schedule created:', schedule);
      return schedule;

    } catch (error) {
      console.error('Create schedule failed:', error);
      throw error;
    }
  }

  /**
   * Assign schedule to employee with effective date
   * @param employeeId - Employee ID
   * @param scheduleId - Schedule ID
   * @param effectiveDate - When schedule becomes active
   * @returns Promise<EmployeeSchedule>
   */
  static async assignScheduleToEmployee(
    employeeId: string, 
    scheduleId: string, 
    effectiveDate: string
  ): Promise<EmployeeSchedule> {
    try {
      // End previous schedule assignment
      const employeeSchedules = this.getEmployeeSchedules();
      const activeSchedules = employeeSchedules.filter(
        es => es.employeeId === employeeId && es.isActive
      );

      activeSchedules.forEach(schedule => {
        schedule.isActive = false;
        schedule.endDate = effectiveDate;
      });

      // Create new schedule assignment
      const assignment: EmployeeSchedule = {
        id: this.generateId(),
        employeeId,
        scheduleId,
        effectiveDate,
        isActive: true,
        createdAt: new Date()
      };

      employeeSchedules.push(assignment);
      localStorage.setItem(this.EMPLOYEE_SCHEDULES_KEY, JSON.stringify(employeeSchedules));

      console.log('Schedule assigned:', assignment);
      return assignment;

    } catch (error) {
      console.error('Schedule assignment failed:', error);
      throw error;
    }
  }

  /**
   * Get employee's current active schedule
   * @param employeeId - Employee ID
   * @param date - Date to check (defaults to today)
   * @returns Promise<WorkSchedule | null>
   */
  static async getEmployeeSchedule(
    employeeId: string, 
    date?: string
  ): Promise<WorkSchedule | null> {
    try {
      const checkDate = date ? new Date(date) : new Date();
      const employeeSchedules = this.getEmployeeSchedules();
      const workSchedules = this.getWorkSchedules();

      const activeAssignment = employeeSchedules.find(es => {
        if (es.employeeId !== employeeId || !es.isActive) return false;
        
        const effectiveDate = new Date(es.effectiveDate);
        const endDate = es.endDate ? new Date(es.endDate) : null;
        
        return checkDate >= effectiveDate && (!endDate || checkDate <= endDate);
      });

      if (!activeAssignment) return null;

      return workSchedules.find(ws => ws.id === activeAssignment.scheduleId) || null;

    } catch (error) {
      console.error('Get employee schedule failed:', error);
      return null;
    }
  }

  /**
   * Check if employee should be working on given date/time
   * @param employeeId - Employee ID
   * @param dateTime - Date and time to check
   * @returns Promise<boolean>
   */
  static async isScheduledToWork(employeeId: string, dateTime: Date): Promise<boolean> {
    try {
      const schedule = await this.getEmployeeSchedule(employeeId, dateTime.toISOString().split('T')[0]);
      if (!schedule) return false;

      // Check if it's a work day
      const dayOfWeek = dateTime.getDay() || 7; // Convert Sunday from 0 to 7
      if (!schedule.workDays.includes(dayOfWeek)) return false;

      // Check for exceptions
      const exceptions = this.getScheduleExceptions();
      const dateString = dateTime.toISOString().split('T')[0];
      const hasException = exceptions.some(ex => 
        (ex.employeeId === employeeId || ex.scheduleId === schedule.id) &&
        ex.exceptionDate === dateString
      );

      if (hasException) return false;

      // Check time range for fixed schedules
      if (schedule.scheduleType === 'fixed' && schedule.startTime && schedule.endTime) {
        const currentTime = dateTime.toTimeString().substr(0, 5);
        return currentTime >= schedule.startTime && currentTime <= schedule.endTime;
      }

      return true;

    } catch (error) {
      console.error('Check scheduled work failed:', error);
      return false;
    }
  }

  /**
   * Calculate expected hours for employee in date range
   * @param employeeId - Employee ID
   * @param startDate - Period start
   * @param endDate - Period end
   * @returns Promise<number>
   */
  static async calculateExpectedHours(
    employeeId: string, 
    startDate: string, 
    endDate: string
  ): Promise<number> {
    try {
      const schedule = await this.getEmployeeSchedule(employeeId, startDate);
      if (!schedule) return 0;

      const start = new Date(startDate);
      const end = new Date(endDate);
      let expectedHours = 0;

      // Iterate through each day in the range
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const isWorkDay = await this.isScheduledToWork(employeeId, date);
        if (isWorkDay) {
          // Calculate daily hours based on schedule type
          if (schedule.scheduleType === 'fixed' && schedule.startTime && schedule.endTime) {
            const startTime = this.parseTime(schedule.startTime);
            const endTime = this.parseTime(schedule.endTime);
            const dailyHours = (endTime - startTime) / (1000 * 60 * 60) - (schedule.breakDuration / 60);
            expectedHours += Math.max(0, dailyHours);
          } else {
            // Default to 8 hours for flexible schedules
            expectedHours += 8;
          }
        }
      }

      return expectedHours;

    } catch (error) {
      console.error('Calculate expected hours failed:', error);
      return 0;
    }
  }

  /**
   * Add schedule exception (holiday, vacation, etc.)
   * @param exceptionData - Exception information
   * @returns Promise<ScheduleException>
   */
  static async addScheduleException(
    exceptionData: Omit<ScheduleException, 'id' | 'createdAt'>
  ): Promise<ScheduleException> {
    try {
      const exception: ScheduleException = {
        ...exceptionData,
        id: this.generateId(),
        createdAt: new Date()
      };

      const exceptions = this.getScheduleExceptions();
      exceptions.push(exception);
      localStorage.setItem(this.EXCEPTIONS_KEY, JSON.stringify(exceptions));

      return exception;

    } catch (error) {
      console.error('Add schedule exception failed:', error);
      throw error;
    }
  }

  // Private helper methods
  private static getWorkSchedules(): WorkSchedule[] {
    try {
      const schedules = localStorage.getItem(this.SCHEDULES_KEY);
      return schedules ? JSON.parse(schedules) : [];
    } catch (error) {
      console.error('Error loading work schedules:', error);
      return [];
    }
  }

  private static getEmployeeSchedules(): EmployeeSchedule[] {
    try {
      const schedules = localStorage.getItem(this.EMPLOYEE_SCHEDULES_KEY);
      return schedules ? JSON.parse(schedules) : [];
    } catch (error) {
      console.error('Error loading employee schedules:', error);
      return [];
    }
  }

  private static getScheduleExceptions(): ScheduleException[] {
    try {
      const exceptions = localStorage.getItem(this.EXCEPTIONS_KEY);
      return exceptions ? JSON.parse(exceptions) : [];
    } catch (error) {
      console.error('Error loading schedule exceptions:', error);
      return [];
    }
  }

  private static parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date().setHours(hours, minutes, 0, 0);
  }

  private static generateId(): string {
    return `sch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}