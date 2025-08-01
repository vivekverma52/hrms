import { Notification, NotificationTemplate } from '../types/attendance';

export class NotificationService {
  private static readonly NOTIFICATIONS_KEY = 'notifications';
  private static readonly TEMPLATES_KEY = 'notification_templates';

  /**
   * Initialize default notification templates
   */
  static initializeTemplates(): void {
    const existingTemplates = this.getNotificationTemplates();
    if (existingTemplates.length === 0) {
      const defaultTemplates: NotificationTemplate[] = [
        {
          id: 'clock_in_reminder',
          name: 'Clock-in Reminder',
          type: 'attendance_reminder',
          subject: 'Time to Clock In',
          bodyTemplate: 'Hello {{employeeName}}, your shift starts in {{minutes}} minutes. Please clock in on time.',
          variables: { employeeName: 'string', minutes: 'number' },
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'clock_out_reminder',
          name: 'Clock-out Reminder',
          type: 'attendance_reminder',
          subject: 'Time to Clock Out',
          bodyTemplate: 'Hello {{employeeName}}, your shift has ended. Please remember to clock out.',
          variables: { employeeName: 'string' },
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'leave_request_approval',
          name: 'Leave Request Approval',
          type: 'leave_management',
          subject: 'Leave Request Requires Approval',
          bodyTemplate: '{{employeeName}} has submitted a leave request from {{startDate}} to {{endDate}}. Please review and approve.',
          variables: { employeeName: 'string', startDate: 'string', endDate: 'string' },
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'leave_request_approved',
          name: 'Leave Request Approved',
          type: 'leave_management',
          subject: 'Your Leave Request Has Been Approved',
          bodyTemplate: 'Your leave request from {{startDate}} to {{endDate}} has been approved by {{approverName}}.',
          variables: { startDate: 'string', endDate: 'string', approverName: 'string' },
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'overtime_alert',
          name: 'Overtime Alert',
          type: 'compliance',
          subject: 'Overtime Hours Alert',
          bodyTemplate: '{{employeeName}} has worked {{overtimeHours}} overtime hours this week. Please review if additional approval is needed.',
          variables: { employeeName: 'string', overtimeHours: 'number' },
          isActive: true,
          createdAt: new Date()
        }
      ];

      localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(defaultTemplates));
    }
  }

  /**
   * Send attendance reminder notification
   * @param employeeId - Employee ID
   * @param reminderType - Type of reminder
   * @param variables - Template variables
   * @returns Promise<void>
   */
  static async sendAttendanceReminder(
    employeeId: string, 
    reminderType: 'clock-in' | 'clock-out' | 'break-end',
    variables: any = {}
  ): Promise<void> {
    try {
      let templateId: string;
      switch (reminderType) {
        case 'clock-in':
          templateId = 'clock_in_reminder';
          break;
        case 'clock-out':
          templateId = 'clock_out_reminder';
          break;
        default:
          templateId = 'clock_out_reminder';
      }

      await this.sendNotification(employeeId, templateId, variables);

    } catch (error) {
      console.error('Send attendance reminder failed:', error);
    }
  }

  /**
   * Send leave request notification to approver
   * @param leaveRequestId - Leave request ID
   * @param approverId - Approver employee ID
   * @param variables - Template variables
   * @returns Promise<void>
   */
  static async sendLeaveRequestNotification(
    leaveRequestId: string, 
    approverId: string,
    variables: any
  ): Promise<void> {
    try {
      await this.sendNotification(approverId, 'leave_request_approval', {
        ...variables,
        leaveRequestId
      });

    } catch (error) {
      console.error('Send leave request notification failed:', error);
    }
  }

  /**
   * Send bulk notifications to multiple recipients
   * @param templateId - Notification template ID
   * @param recipients - List of recipient IDs
   * @param variables - Template variables
   * @returns Promise<void>
   */
  static async sendBulkNotification(
    templateId: string, 
    recipients: string[], 
    variables: any
  ): Promise<void> {
    try {
      const promises = recipients.map(recipientId => 
        this.sendNotification(recipientId, templateId, variables)
      );

      await Promise.all(promises);
      console.log(`Bulk notification sent to ${recipients.length} recipients`);

    } catch (error) {
      console.error('Send bulk notification failed:', error);
    }
  }

  /**
   * Send individual notification
   * @param recipientId - Recipient employee ID
   * @param templateId - Template ID
   * @param variables - Template variables
   * @returns Promise<void>
   */
  static async sendNotification(
    recipientId: string,
    templateId: string,
    variables: any = {}
  ): Promise<void> {
    try {
      const template = this.getNotificationTemplates().find(t => t.id === templateId);
      if (!template || !template.isActive) {
        throw new Error('Notification template not found or inactive');
      }

      // Process template variables
      let message = template.bodyTemplate;
      let subject = template.subject || '';

      Object.entries(variables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        message = message.replace(new RegExp(placeholder, 'g'), String(value));
        subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
      });

      const notification: Notification = {
        id: this.generateId(),
        templateId,
        recipientId,
        type: 'in-app', // Default to in-app notification
        subject,
        message,
        data: variables,
        status: 'pending',
        scheduledAt: new Date(),
        retryCount: 0,
        createdAt: new Date()
      };

      // Queue notification
      const notifications = this.getNotifications();
      notifications.push(notification);
      localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));

      // Simulate sending (in real implementation, this would use actual notification services)
      setTimeout(() => {
        this.markNotificationAsSent(notification.id);
      }, 1000);

    } catch (error) {
      console.error('Send notification failed:', error);
    }
  }

  /**
   * Process notification queue
   * @returns Promise<void>
   */
  static async processNotificationQueue(): Promise<void> {
    try {
      const notifications = this.getNotifications();
      const pendingNotifications = notifications.filter(n => n.status === 'pending');

      for (const notification of pendingNotifications) {
        try {
          // Simulate notification delivery
          await this.deliverNotification(notification);
          this.markNotificationAsSent(notification.id);
        } catch (error) {
          this.markNotificationAsFailed(notification.id, error.message);
        }
      }

    } catch (error) {
      console.error('Process notification queue failed:', error);
    }
  }

  /**
   * Get notification history for employee
   * @param employeeId - Employee ID
   * @param page - Page number
   * @param limit - Records per page
   * @returns Promise<{notifications: Notification[], total: number}>
   */
  static async getNotificationHistory(
    employeeId: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{notifications: Notification[], total: number}> {
    try {
      const allNotifications = this.getNotifications()
        .filter(n => n.recipientId === employeeId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const total = allNotifications.length;
      const startIndex = (page - 1) * limit;
      const notifications = allNotifications.slice(startIndex, startIndex + limit);

      return { notifications, total };

    } catch (error) {
      console.error('Get notification history failed:', error);
      return { notifications: [], total: 0 };
    }
  }

  // Private helper methods
  private static async deliverNotification(notification: Notification): Promise<void> {
    // Simulate notification delivery based on type
    switch (notification.type) {
      case 'email':
        await this.sendEmail(notification);
        break;
      case 'push':
        await this.sendPushNotification(notification);
        break;
      case 'sms':
        await this.sendSMS(notification);
        break;
      case 'in-app':
        await this.sendInAppNotification(notification);
        break;
    }
  }

  private static async sendEmail(notification: Notification): Promise<void> {
    // Simulate email sending
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.05) { // 95% success rate
          resolve();
        } else {
          reject(new Error('Email delivery failed'));
        }
      }, 500);
    });
  }

  private static async sendPushNotification(notification: Notification): Promise<void> {
    // Simulate push notification
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.02) { // 98% success rate
          resolve();
        } else {
          reject(new Error('Push notification failed'));
        }
      }, 200);
    });
  }

  private static async sendSMS(notification: Notification): Promise<void> {
    // Simulate SMS sending
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.03) { // 97% success rate
          resolve();
        } else {
          reject(new Error('SMS delivery failed'));
        }
      }, 1000);
    });
  }

  private static async sendInAppNotification(notification: Notification): Promise<void> {
    // In-app notifications are always successful
    return Promise.resolve();
  }

  private static markNotificationAsSent(notificationId: string): void {
    const notifications = this.getNotifications();
    const index = notifications.findIndex(n => n.id === notificationId);
    
    if (index !== -1) {
      notifications[index] = {
        ...notifications[index],
        status: 'sent',
        sentAt: new Date()
      };
      localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }
  }

  private static markNotificationAsFailed(notificationId: string, errorMessage: string): void {
    const notifications = this.getNotifications();
    const index = notifications.findIndex(n => n.id === notificationId);
    
    if (index !== -1) {
      notifications[index] = {
        ...notifications[index],
        status: 'failed',
        errorMessage,
        retryCount: notifications[index].retryCount + 1
      };
      localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }
  }

  private static getNotifications(): Notification[] {
    try {
      const notifications = localStorage.getItem(this.NOTIFICATIONS_KEY);
      return notifications ? JSON.parse(notifications) : [];
    } catch (error) {
      console.error('Error loading notifications:', error);
      return [];
    }
  }

  private static getNotificationTemplates(): NotificationTemplate[] {
    try {
      const templates = localStorage.getItem(this.TEMPLATES_KEY);
      return templates ? JSON.parse(templates) : [];
    } catch (error) {
      console.error('Error loading notification templates:', error);
      return [];
    }
  }

  private static generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}