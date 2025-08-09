import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Activity, NotificationSettings } from '@/types/app';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return true; // Web doesn't require notification permissions for our use case
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  static async scheduleActivityReminder(
    activity: Activity,
    settings: NotificationSettings
  ): Promise<string | null> {
    if (!settings.enabled || !activity.reminderEnabled || Platform.OS === 'web') {
      return null;
    }

    try {
      const now = new Date();
      const deadline = new Date(activity.deadline);
      const reminderDate = new Date(deadline.getTime() - (settings.reminderBeforeDays * 24 * 60 * 60 * 1000));

      // Only schedule if reminder date is in the future
      if (reminderDate <= now) {
        return null;
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Lembrete de Atividade',
          body: `"${activity.title}" vence em ${settings.reminderBeforeDays} dia(s)`,
          sound: settings.soundEnabled,
          data: { activityId: activity.id, type: 'reminder' },
        },
        trigger: {
          date: reminderDate,
        },
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  static async scheduleDeadlineNotification(
    activity: Activity,
    settings: NotificationSettings
  ): Promise<string | null> {
    if (!settings.enabled || !activity.reminderEnabled || Platform.OS === 'web') {
      return null;
    }

    try {
      const deadline = new Date(activity.deadline);
      const now = new Date();

      // Only schedule if deadline is in the future
      if (deadline <= now) {
        return null;
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Prazo de Atividade',
          body: `"${activity.title}" vence hoje!`,
          sound: settings.soundEnabled,
          data: { activityId: activity.id, type: 'deadline' },
        },
        trigger: {
          date: deadline,
        },
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling deadline notification:', error);
      return null;
    }
  }

  static async scheduleDailySummary(
    settings: NotificationSettings,
    activitiesCount: { today: number; overdue: number }
  ): Promise<string | null> {
    if (!settings.enabled || Platform.OS === 'web') {
      return null;
    }

    try {
      // Cancel existing daily summary
      await this.cancelDailySummary();

      const [hours, minutes] = settings.dailySummaryTime.split(':').map(Number);
      const now = new Date();
      const summaryTime = new Date();
      summaryTime.setHours(hours, minutes, 0, 0);

      // If time has passed today, schedule for tomorrow
      if (summaryTime <= now) {
        summaryTime.setDate(summaryTime.getDate() + 1);
      }

      const body = activitiesCount.today > 0 || activitiesCount.overdue > 0
        ? `${activitiesCount.today} atividades vencem hoje. ${activitiesCount.overdue} em atraso.`
        : 'Nenhuma atividade vence hoje. Bom trabalho!';

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Resumo Diário - TaskManagerX',
          body,
          sound: settings.soundEnabled,
          data: { type: 'daily-summary' },
        },
        trigger: {
          date: summaryTime,
          repeats: true,
        },
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling daily summary:', error);
      return null;
    }
  }

  static async cancelDailySummary(): Promise<void> {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      const dailySummaryNotifications = notifications.filter(
        n => n.content.data?.type === 'daily-summary'
      );

      for (const notification of dailySummaryNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    } catch (error) {
      console.error('Error canceling daily summary:', error);
    }
  }

  static async cancelActivityNotifications(activityId: string): Promise<void> {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      const activityNotifications = notifications.filter(
        n => n.content.data?.activityId === activityId
      );

      for (const notification of activityNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    } catch (error) {
      console.error('Error canceling activity notifications:', error);
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }
}