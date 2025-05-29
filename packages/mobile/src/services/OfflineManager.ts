import AsyncStorage from '@react-native-async-storage/async-storage';
import { NetInfo } from '@react-native-community/netinfo';
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

// Define keys for AsyncStorage
const KEYS = {
  LESSONS: 'offline_lessons',
  CHALLENGES: 'offline_challenges',
  PROJECTS: 'offline_projects',
  USER_DATA: 'offline_user_data',
  LAST_SYNC: 'offline_last_sync',
};

// Define types for offline content
interface OfflineContent {
  lessons: any[];
  challenges: any[];
  projects: any[];
  userData: any;
  lastSync: string;
}

export class OfflineManager {
  private static instance: OfflineManager;
  private isOnline: boolean = true;
  private db = getFirestore();
  
  private constructor() {
    // Subscribe to network state changes
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected || false;
      
      // When coming back online, sync data
      if (this.isOnline) {
        this.syncOfflineChanges();
      }
    });
  }
  
  // Singleton pattern
  public static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }
  
  // Check if device is online
  public isConnected(): boolean {
    return this.isOnline;
  }
  
  // Get offline content
  public async getOfflineContent(): Promise<OfflineContent> {
    try {
      const [lessons, challenges, projects, userData, lastSync] = await Promise.all([
        AsyncStorage.getItem(KEYS.LESSONS),
        AsyncStorage.getItem(KEYS.CHALLENGES),
        AsyncStorage.getItem(KEYS.PROJECTS),
        AsyncStorage.getItem(KEYS.USER_DATA),
        AsyncStorage.getItem(KEYS.LAST_SYNC),
      ]);
      
      return {
        lessons: lessons ? JSON.parse(lessons) : [],
        challenges: challenges ? JSON.parse(challenges) : [],
        projects: projects ? JSON.parse(projects) : [],
        userData: userData ? JSON.parse(userData) : null,
        lastSync: lastSync || '',
      };
    } catch (error) {
      console.error('Error getting offline content:', error);
      return {
        lessons: [],
        challenges: [],
        projects: [],
        userData: null,
        lastSync: '',
      };
    }
  }
  
  // Save lessons for offline use
  public async saveLessonsOffline(limit = 10): Promise<void> {
    if (!this.isOnline) return;
    
    try {
      // Fetch lessons from Firestore
      const lessonsCollection = collection(this.db, 'lessons');
      const lessonsQuery = query(lessonsCollection, orderBy('order'), limit(limit));
      const lessonDocs = await getDocs(lessonsQuery);
      
      const lessons = lessonDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(KEYS.LESSONS, JSON.stringify(lessons));
    } catch (error) {
      console.error('Error saving lessons offline:', error);
    }
  }
  
  // Save challenges for offline use
  public async saveChallengesOffline(): Promise<void> {
    if (!this.isOnline) return;
    
    try {
      // Fetch active challenges from Firestore
      const challengesCollection = collection(this.db, 'challenges');
      const now = new Date();
      const challengesQuery = query(
        challengesCollection,
        where('endDate', '>', now)
      );
      const challengeDocs = await getDocs(challengesQuery);
      
      const challenges = challengeDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(KEYS.CHALLENGES, JSON.stringify(challenges));
    } catch (error) {
      console.error('Error saving challenges offline:', error);
    }
  }
  
  // Save user projects for offline use
  public async saveUserProjectsOffline(userId: string): Promise<void> {
    if (!this.isOnline) return;
    
    try {
      // Fetch user projects from Firestore
      const projectsCollection = collection(this.db, 'projects');
      const projectsQuery = query(
        projectsCollection,
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      const projectDocs = await getDocs(projectsQuery);
      
      const projects = projectDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving user projects offline:', error);
    }
  }
  
  // Save user data for offline use
  public async saveUserDataOffline(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data offline:', error);
    }
  }
  
  // Save the timestamp of the last sync
  private async saveLastSyncTimestamp(): Promise<void> {
    try {
      const now = new Date().toISOString();
      await AsyncStorage.setItem(KEYS.LAST_SYNC, now);
    } catch (error) {
      console.error('Error saving last sync timestamp:', error);
    }
  }
  
  // Download all content for offline use
  public async downloadAllContent(userId: string): Promise<void> {
    if (!this.isOnline) {
      console.log('Cannot download content while offline');
      return;
    }
    
    try {
      await Promise.all([
        this.saveLessonsOffline(),
        this.saveChallengesOffline(),
        this.saveUserProjectsOffline(userId),
      ]);
      
      await this.saveLastSyncTimestamp();
      
      console.log('All content downloaded for offline use');
    } catch (error) {
      console.error('Error downloading all content:', error);
    }
  }
  
  // Sync offline changes when coming back online
  private async syncOfflineChanges(): Promise<void> {
    try {
      // Here you would implement logic to sync changes made while offline
      // For example, updating completed challenges, lesson progress, etc.
      console.log('Syncing offline changes...');
      
      // After syncing, update the timestamp
      await this.saveLastSyncTimestamp();
    } catch (error) {
      console.error('Error syncing offline changes:', error);
    }
  }
  
  // Clear all offline data
  public async clearOfflineData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(KEYS.LESSONS),
        AsyncStorage.removeItem(KEYS.CHALLENGES),
        AsyncStorage.removeItem(KEYS.PROJECTS),
        AsyncStorage.removeItem(KEYS.USER_DATA),
        AsyncStorage.removeItem(KEYS.LAST_SYNC),
      ]);
      
      console.log('All offline data cleared');
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }
  
  // Get the size of offline data in bytes
  public async getOfflineDataSize(): Promise<number> {
    try {
      const [lessons, challenges, projects, userData] = await Promise.all([
        AsyncStorage.getItem(KEYS.LESSONS),
        AsyncStorage.getItem(KEYS.CHALLENGES),
        AsyncStorage.getItem(KEYS.PROJECTS),
        AsyncStorage.getItem(KEYS.USER_DATA),
      ]);
      
      const size = 
        (lessons ? lessons.length : 0) +
        (challenges ? challenges.length : 0) +
        (projects ? projects.length : 0) +
        (userData ? userData.length : 0);
      
      return size;
    } catch (error) {
      console.error('Error getting offline data size:', error);
      return 0;
    }
  }
}

// Export a singleton instance
export default OfflineManager.getInstance();

