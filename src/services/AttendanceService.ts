import { AttendanceRecord } from '../types/attendance';

export class AttendanceService {
  private static readonly STORAGE_KEY = 'attendance_records';

  /**
   * Add manual attendance record
   * @param record - Attendance record data
   * @returns Promise<AttendanceRecord>
   */
  static async addAttendanceRecord(
    record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<AttendanceRecord> {
    try {
      const attendanceRecord: AttendanceRecord = {
        ...record,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const records = this.getAttendanceRecords();
      records.push(attendanceRecord);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));

      console.log('Manual attendance record added:', attendanceRecord);
      return attendanceRecord;

    } catch (error) {
      console.error('Add attendance record failed:', error);
      throw error;
    }
  }

  /**
   * Update attendance record
   * @param recordId - Record ID
   * @param updates - Updates to apply
   * @returns Promise<AttendanceRecord>
   */
  static async updateAttendanceRecord(
    recordId: string,
    updates: Partial<AttendanceRecord>
  ): Promise<AttendanceRecord> {
    try {
      const records = this.getAttendanceRecords();
      const recordIndex = records.findIndex(r => r.id === recordId);
      
      if (recordIndex === -1) {
        throw new Error('Attendance record not found');
      }

      records[recordIndex] = {
        ...records[recordIndex],
        ...updates,
        updatedAt: new Date()
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
      return records[recordIndex];

    } catch (error) {
      console.error('Update attendance record failed:', error);
      throw error;
    }
  }

  /**
   * Get attendance records for employee in date range
   * @param employeeId - Employee ID
   * @param startDate - Start date
   * @param endDate - End date
   * @returns AttendanceRecord[]
   */
  static getEmployeeAttendance(
    employeeId: string, 
    startDate: string, 
    endDate: string
  ): AttendanceRecord[] {
    const records = this.getAttendanceRecords();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return records.filter(record => {
      if (record.employeeId !== employeeId) return false;
      const recordDate = new Date(record.date);
      return recordDate >= start && recordDate <= end;
    });
  }

  /**
   * Calculate attendance statistics for employee
   * @param employeeId - Employee ID
   * @param startDate - Start date
   * @param endDate - End date
   * @returns AttendanceStats
   */
  static calculateAttendanceStats(
    employeeId: string, 
    startDate: string, 
    endDate: string
  ): {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    totalHours: number;
    regularHours: number;
    overtimeHours: number;
    attendanceRate: number;
    averageHoursPerDay: number;
  } {
    const records = this.getEmployeeAttendance(employeeId, startDate, endDate);

    const totalHours = records.reduce((sum, r) => sum + r.hoursWorked + r.overtimeHours, 0);
    const regularHours = records.reduce((sum, r) => sum + r.hoursWorked, 0);
    const overtimeHours = records.reduce((sum, r) => sum + r.overtimeHours, 0);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const presentDays = records.length;
    const absentDays = totalDays - presentDays;
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
    const averageHoursPerDay = presentDays > 0 ? totalHours / presentDays : 0;

    return {
      totalDays,
      presentDays,
      absentDays,
      totalHours,
      regularHours,
      overtimeHours,
      attendanceRate,
      averageHoursPerDay
    };
  }

  // Private helper methods
  private static getAttendanceRecords(): AttendanceRecord[] {
    try {
      const records = localStorage.getItem(this.STORAGE_KEY);
      return records ? JSON.parse(records) : [];
    } catch (error) {
      console.error('Error loading attendance records:', error);
      return [];
    }
  }

  private static generateId(): string {
    return `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}