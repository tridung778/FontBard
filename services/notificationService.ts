import * as Notifications from 'expo-notifications';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
}

export class NotificationService {
  // Request notification permissions
  static async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  }

  // Schedule a local notification
  static async scheduleNotification(
    notificationData: NotificationData,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    const hasPermission = await this.requestPermissions();
    
    if (!hasPermission) {
      throw new Error('Notification permission not granted');
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: notificationData.title,
        body: notificationData.body,
        data: notificationData.data || {},
        sound: true,
      },
      trigger: trigger || null, // null means show immediately
    });

    return notificationId;
  }

  // Schedule a notification to show after a specific delay (in seconds)
  static async scheduleDelayedNotification(
    notificationData: NotificationData,
    delaySeconds: number
  ): Promise<string> {
    return this.scheduleNotification(notificationData, {
      seconds: delaySeconds,
    } as Notifications.TimeIntervalTriggerInput);
  }

  // Schedule a notification for a specific date
  static async scheduleNotificationForDate(
    notificationData: NotificationData,
    date: Date
  ): Promise<string> {
    return this.scheduleNotification(notificationData, {
      date: date,
    } as Notifications.DateTriggerInput);
  }

  // Cancel a specific notification
  static async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Cancel all scheduled notifications
  static async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Get all scheduled notifications
  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // Add notification response listener
  static addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  // Add notification received listener (when app is in foreground)
  static addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  // Remove notification listener
  static removeNotificationSubscription(subscription: Notifications.Subscription): void {
    subscription.remove();
  }

  // Get notification permissions status
  static async getPermissionsStatus(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.getPermissionsAsync();
  }

  // Check if notifications are enabled
  static async areNotificationsEnabled(): Promise<boolean> {
    const permissions = await this.getPermissionsStatus();
    return permissions.status === 'granted';
  }
}
