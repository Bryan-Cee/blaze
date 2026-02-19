import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { ReminderSetting } from '../types';

/**
 * Call once at app start. Sets the foreground notification handler
 * and creates the Android notification channel.
 * Silently no-ops in Expo Go where notifications aren't supported.
 */
export function initializeNotifications() {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('reminders', {
        name: 'Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
      });
    }
  } catch {
    // expo-notifications not available (e.g. Expo Go)
  }
}

/**
 * Request notification permissions. Skips on simulators/emulators
 * where push tokens aren't available.
 */
export async function requestPermissions(): Promise<boolean> {
  try {
    if (!Device.isDevice) {
      return false;
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

// ── Notification content per reminder type ──────────────────────────

interface NotificationContent {
  title: string;
  body: string;
}

const CONTENT: Record<ReminderSetting['type'], NotificationContent> = {
  workout: {
    title: 'Time to train!',
    body: "Your workout is ready. Let's go!",
  },
  hydration: {
    title: 'Hydration Check',
    body: 'Time to drink some water!',
  },
  mealPrep: {
    title: 'Meal Prep Time',
    body: 'Get your meals ready for the week.',
  },
  checkIn: {
    title: 'Weekly Check-in',
    body: 'Log your weight and track your progress.',
  },
};

// ── Schedule definitions ────────────────────────────────────────────

// expo-notifications weekday: 1 = Sunday … 7 = Saturday
const SUNDAY = 1;
const MONDAY = 2;
const TUESDAY = 3;
const WEDNESDAY = 4;
const THURSDAY = 5;
const FRIDAY = 6;

interface WeeklyTrigger {
  weekday: number;
  hour: number;
  minute: number;
}

function triggersForType(type: ReminderSetting['type']): WeeklyTrigger[] {
  switch (type) {
    case 'workout':
      // Mon–Fri at 06:45
      return [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY].map((weekday) => ({
        weekday,
        hour: 6,
        minute: 45,
      }));

    case 'hydration': {
      // Every day at 08:00, 09:30, 11:00, 12:30, 14:00, 15:30, 17:00, 18:30
      const times = [
        { hour: 8, minute: 0 },
        { hour: 9, minute: 30 },
        { hour: 11, minute: 0 },
        { hour: 12, minute: 30 },
        { hour: 14, minute: 0 },
        { hour: 15, minute: 30 },
        { hour: 17, minute: 0 },
        { hour: 18, minute: 30 },
      ];
      const triggers: WeeklyTrigger[] = [];
      for (let weekday = SUNDAY; weekday <= 7; weekday++) {
        for (const t of times) {
          triggers.push({ weekday, hour: t.hour, minute: t.minute });
        }
      }
      return triggers;
    }

    case 'mealPrep':
      // Sunday 17:00 + Wednesday 18:00
      return [
        { weekday: SUNDAY, hour: 17, minute: 0 },
        { weekday: WEDNESDAY, hour: 18, minute: 0 },
      ];

    case 'checkIn':
      // Monday 07:30
      return [{ weekday: MONDAY, hour: 7, minute: 30 }];
  }
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Cancel all existing notifications and reschedule based on the
 * current set of enabled reminders.
 * Silently no-ops in Expo Go where notifications aren't supported.
 */
export async function syncReminders(reminders: ReminderSetting[]) {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const enabled = reminders.filter((r) => r.enabled);

    for (const reminder of enabled) {
      const content = CONTENT[reminder.type];
      const triggers = triggersForType(reminder.type);

      for (const trigger of triggers) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: content.title,
            body: content.body,
            sound: 'default',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: trigger.weekday,
            hour: trigger.hour,
            minute: trigger.minute,
          },
        });
      }
    }

    if (__DEV__) {
      const scheduled =
        await Notifications.getAllScheduledNotificationsAsync();
      console.log(
        `Notifications: synced ${scheduled.length} scheduled notifications`
      );
    }
  } catch {
    // expo-notifications not available (e.g. Expo Go)
  }
}
