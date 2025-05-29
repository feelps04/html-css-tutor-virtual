import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
const KEYS = {
  PUSH_TOKEN: 'notification_push_token',
  STUDY_REMINDER: 'notification_study_reminder',
  SETTINGS: 'notification_settings',
};

// Types for notification settings
interface NotificationSettings {
  enabled: boolean;
  studyReminders: boolean;
  studyReminderTime: string; // Format: "HH:MM"
  challengeReminders: boolean;
  dailyTips: boolean;
}

// Default notification settings
const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  studyReminders: true,
  studyReminderTime: '18:00',
  challengeReminders: true,
  dailyTips: false,
};

export class NotificationService {
  private static instance: NotificationService;
  private settings: NotificationSettings = DEFAULT_SETTINGS;
  private initialized: boolean = false;
  
  private constructor() {}
  
  // Singleton pattern
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }
  
  // Initialize notification handler
  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    
    // Load saved settings
    await this.loadSettings();
    
    this.initialized = true;
  }
  
  // Request permissions for notifications
  public async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return false;
    }
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }
    
    // For Android, set notification channel
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    
    return true;
  }
  
  // Get Expo push token
  public async getExpoPushToken(): Promise<string | null> {
    // First check if we have a stored token
    try {
      const storedToken = await AsyncStorage.getItem(KEYS.PUSH_TOKEN);
      if (storedToken) return storedToken;
    } catch (error) {
      console.error('Error retrieving stored push token:', error);
    }
    
    // If no stored token, request a new one
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return null;
    }
    
    try {
      const permission = await this.requestPermissions();
      if (!permission) return null;
      
      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })).data;
      
      // Store the token for future use
      await AsyncStorage.setItem(KEYS.PUSH_TOKEN, token);
      
      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }
  
  // Send a local notification immediately
  public async sendLocalNotification(title: string, body: string, data: any = {}): Promise<void> {
    if (!this.settings.enabled) return;
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Send immediately
    });
  }
  
  // Schedule a study reminder
  public async scheduleStudyReminder(): Promise<void> {
    if (!this.settings.enabled || !this.settings.studyReminders) return;
    
    // Cancel existing study reminders
    await this.cancelStudyReminder();
    
    // Parse the time
    const [hours, minutes] = this.settings.studyReminderTime.split(':').map(Number);
    
    // Schedule a new reminder
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hora de estudar!',
        body: 'Mantenha sua rotina de estudos para continuar progredindo.',
        sound: true,
        badge: 1,
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
    
    // Save the identifier for later management
    await AsyncStorage.setItem(KEYS.STUDY_REMINDER, identifier);
  }
  
  // Cancel study reminder
  public async cancelStudyReminder(): Promise<void> {
    try {
      const identifier = await AsyncStorage.getItem(KEYS.STUDY_REMINDER);
      if (identifier) {
        await Notifications.cancelScheduledNotificationAsync(identifier);
        await AsyncStorage.removeItem(KEYS.STUDY_REMINDER);
      }
    } catch (error) {
      console.error('Error cancelling study reminder:', error);
    }
  }
  
  // Schedule a notification for a new challenge
  public async scheduleNewChallengeNotification(title: string, body: string, date: Date): Promise<void> {
    if (!this.settings.enabled || !this.settings.challengeReminders) return;
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: date,
    });
  }
  
  // Cancel all scheduled notifications
  public async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Clean up stored identifiers
    await AsyncStorage.removeItem(KEYS.STUDY_REMINDER);
  }
  
  // Get notification settings
  public getSettings(): NotificationSettings {
    return this.settings;
  }
  
  // Update notification settings
  public async updateSettings(newSettings: Partial<NotificationSettings>): Promise<void> {
    this.settings = {
      ...this.settings,
      ...newSettings,
    };
    
    // Save settings to storage
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(this.settings));
    
    // Apply new settings
    if (this.settings.enabled) {
      if (this.settings.studyReminders) {
        await this.scheduleStudyReminder();
      } else {
        await this.cancelStudyReminder();
      }
    } else {
      // If notifications are disabled, cancel all
      await this.cancelAllNotifications();
    }
  }
  
  // Load settings from storage
  private async loadSettings(): Promise<void> {
    try {
      const storedSettings = await AsyncStorage.getItem(KEYS.SETTINGS);
      if (storedSettings) {
        this.settings = JSON.parse(storedSettings);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }
  
  // Set up notification listeners
  public async setupNotificationListeners(
    onNotificationReceived: (notification: Notifications.Notification) => void,
    onNotificationResponse: (response: Notifications.NotificationResponse) => void
  ): Promise<() => void> {
    // When a notification is received while the app is in the foreground
    const receivedSubscription = Notifications.addNotificationReceivedListener(onNotificationReceived);
    
    // When the user taps on a notification
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(onNotificationResponse);
    
    // Return cleanup function
    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }
}

// Export a singleton instance
export default NotificationService.getInstance();

