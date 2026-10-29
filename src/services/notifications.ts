import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';
import { lightColors } from '@/theme/light';

const NOTIFICATION_CHANNEL_COLOR = lightColors.primary;

// Configure default notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  /**
   * Initializes notification channels and handler.
   */
  static async initialize(): Promise<void> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Task & Event Reminders',
        importance: AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: NOTIFICATION_CHANNEL_COLOR,
      });
    }
  }

  /**
   * Requests notification permissions from the user.
   */
  static async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  }

  /**
   * Schedules a local notification for a task at a specific trigger date.
   */
  static async scheduleTaskReminder(
    taskId: string,
    title: string,
    body: string,
    triggerDate: Date,
  ): Promise<string | null> {
    try {
      const now = new Date();
      if (triggerDate <= now) return null;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { taskId, type: 'task_reminder' },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
          channelId: 'reminders',
        },
      });

      return notificationId;
    } catch {
      return null;
    }
  }

  /**
   * Cancels a previously scheduled notification by ID.
   */
  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch {
      // ignore
    }
  }

  /**
   * Cancels all pending notifications.
   */
  static async cancelAll(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch {
      // ignore
    }
  }
}
