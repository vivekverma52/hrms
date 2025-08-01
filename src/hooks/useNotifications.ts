import { useState, useEffect, useCallback } from 'react';
import { notificationManager, NotificationEvent } from '../services/NotificationEngine';

interface UseNotificationsOptions {
  userId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface NotificationHookReturn {
  notifications: any[];
  unreadCount: number;
  channelHealth: any[];
  deliveryStats: any;
  isLoading: boolean;
  error: string | null;
  sendNotification: (event: NotificationEvent) => Promise<void>;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  refreshData: () => void;
}

export const useNotifications = (options: UseNotificationsOptions): NotificationHookReturn => {
  const { userId, autoRefresh = true, refreshInterval = 30000 } = options;
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [channelHealth, setChannelHealth] = useState<any[]>([]);
  const [deliveryStats, setDeliveryStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load notifications from localStorage
  const loadNotifications = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('in_app_notifications') || '[]');
      const userNotifications = stored.filter((notif: any) => 
        notif.recipientId === userId || notif.recipientId === 'all'
      );
      setNotifications(userNotifications);
      setError(null);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error loading notifications:', err);
    }
  }, [userId]);

  // Refresh all data
  const refreshData = useCallback(() => {
    setIsLoading(true);
    try {
      loadNotifications();
      setChannelHealth(notificationManager.getChannelHealth());
      setDeliveryStats(notificationManager.getDeliveryStats());
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  }, [loadNotifications]);

  // Initialize and set up real-time listeners
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        await notificationManager.initialize();
        refreshData();
      } catch (err) {
        setError('Failed to initialize notifications');
        setIsLoading(false);
      }
    };

    initializeNotifications();

    // Set up real-time event listeners
    const handleNotificationProcessed = (event: CustomEvent) => {
      console.log('New notification processed:', event.detail);
      loadNotifications();
      
      // Play notification sound if it's for this user
      const eventData = event.detail;
      if (eventData.event?.metadata?.userId === userId) {
        playNotificationSound();
      }
    };

    const handleDeliveryUpdate = (event: CustomEvent) => {
      console.log('Delivery status updated:', event.detail);
      // Update delivery stats
      setDeliveryStats(notificationManager.getDeliveryStats());
    };

    const handleChannelHealthChanged = (event: CustomEvent) => {
      console.log('Channel health changed:', event.detail);
      setChannelHealth(notificationManager.getChannelHealth());
    };

    notificationManager.addEventListener('notification-processed', handleNotificationProcessed as EventListener);
    notificationManager.addEventListener('delivery-updated', handleDeliveryUpdate as EventListener);
    notificationManager.addEventListener('channel-health-changed', handleChannelHealthChanged as EventListener);

    // Set up auto-refresh
    let refreshTimer: NodeJS.Timeout | undefined;
    if (autoRefresh) {
      refreshTimer = setInterval(refreshData, refreshInterval);
    }

    return () => {
      notificationManager.removeEventListener('notification-processed', handleNotificationProcessed as EventListener);
      notificationManager.removeEventListener('delivery-updated', handleDeliveryUpdate as EventListener);
      notificationManager.removeEventListener('channel-health-changed', handleChannelHealthChanged as EventListener);
      
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  }, [userId, autoRefresh, refreshInterval, loadNotifications, refreshData]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;

  // Send notification
  const sendNotification = useCallback(async (event: NotificationEvent) => {
    try {
      await notificationManager.sendNotification(event);
    } catch (err) {
      setError('Failed to send notification');
      throw err;
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('in_app_notifications', JSON.stringify(updated));
  }, [notifications]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('in_app_notifications', JSON.stringify(updated));
  }, [notifications]);

  // Delete notification
  const deleteNotification = useCallback((notificationId: string) => {
    const updated = notifications.filter(n => n.id !== notificationId);
    setNotifications(updated);
    localStorage.setItem('in_app_notifications', JSON.stringify(updated));
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    channelHealth,
    deliveryStats,
    isLoading,
    error,
    sendNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshData
  };
};

// Utility function to play notification sound
const playNotificationSound = () => {
  try {
    // Create a simple notification sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    // Fallback to HTML5 audio if Web Audio API fails
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore errors
    } catch (fallbackError) {
      // Ignore audio errors completely
    }
  }
};

// Hook for sending specific notification types
export const useNotificationSender = () => {
  const sendDocumentExpiryAlert = useCallback(async (employeeData: {
    employeeId: string;
    employeeName: string;
    documentType: string;
    expiryDate: string;
    daysRemaining: number;
  }) => {
    const event: NotificationEvent = {
      id: `doc_expiry_${Date.now()}`,
      type: 'document_expiry_check',
      source: 'document_monitor',
      data: employeeData,
      metadata: {
        timestamp: new Date()
      },
      priority: employeeData.daysRemaining <= 7 ? 'critical' : 'high'
    };

    return notificationManager.sendNotification(event);
  }, []);

  const sendProjectStatusChange = useCallback(async (projectData: {
    projectId: string;
    projectName: string;
    oldStatus: string;
    newStatus: string;
    changedBy: string;
    reason: string;
    nextActions?: string;
  }) => {
    const event: NotificationEvent = {
      id: `proj_status_${Date.now()}`,
      type: 'project_status_changed',
      source: 'project_manager',
      data: projectData,
      metadata: {
        timestamp: new Date()
      },
      priority: 'high'
    };

    return notificationManager.sendNotification(event);
  }, []);

  const sendPayrollComplete = useCallback(async (payrollData: {
    payrollPeriod: string;
    employeeCount: number;
    totalAmount: number;
    processedBy: string;
    paymentDate: string;
  }) => {
    const event: NotificationEvent = {
      id: `payroll_${Date.now()}`,
      type: 'payroll_processed',
      source: 'payroll_system',
      data: { ...payrollData, status: 'completed' },
      metadata: {
        timestamp: new Date()
      },
      priority: 'medium'
    };

    return notificationManager.sendNotification(event);
  }, []);

  const sendCustomNotification = useCallback(async (
    type: string,
    data: any,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) => {
    const event: NotificationEvent = {
      id: `custom_${Date.now()}`,
      type,
      source: 'manual',
      data,
      metadata: {
        timestamp: new Date()
      },
      priority
    };

    return notificationManager.sendNotification(event);
  }, []);

  return {
    sendDocumentExpiryAlert,
    sendProjectStatusChange,
    sendPayrollComplete,
    sendCustomNotification
  };
};

// Hook for notification preferences management
export const useNotificationPreferences = (userId: string) => {
  const [preferences, setPreferences] = useState({
    channels: ['email_primary', 'in_app'],
    frequency: 'immediate' as 'immediate' | 'batched' | 'digest',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
      timezone: 'Asia/Riyadh'
    },
    languages: ['en-US', 'ar-SA'],
    soundEnabled: true
  });

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`notification_preferences_${userId}`);
      if (stored) {
        setPreferences({ ...preferences, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  }, [userId]);

  // Save preferences to localStorage
  const updatePreferences = useCallback((newPreferences: Partial<typeof preferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem(`notification_preferences_${userId}`, JSON.stringify(updated));
  }, [preferences, userId]);

  return {
    preferences,
    updatePreferences
  };
};