import AsyncStorage from '@react-native-async-storage/async-storage';
import { Company, Person, Activity, AppSettings } from '@/types/app';

const STORAGE_KEYS = {
  COMPANY: '@taskmanager_company',
  PEOPLE: '@taskmanager_people',
  ACTIVITIES: '@taskmanager_activities',
  SETTINGS: '@taskmanager_settings',
};

export class StorageService {
  // Company methods
  static async saveCompany(company: Company): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(company));
    } catch (error) {
      console.error('Error saving company:', error);
      throw error;
    }
  }

  static async getCompany(): Promise<Company | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPANY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting company:', error);
      return null;
    }
  }

  // People methods
  static async savePeople(people: Person[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(people));
    } catch (error) {
      console.error('Error saving people:', error);
      throw error;
    }
  }

  static async getPeople(): Promise<Person[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PEOPLE);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting people:', error);
      return [];
    }
  }

  static async addPerson(person: Person): Promise<void> {
    try {
      const people = await this.getPeople();
      people.push(person);
      await this.savePeople(people);
    } catch (error) {
      console.error('Error adding person:', error);
      throw error;
    }
  }

  static async updatePerson(updatedPerson: Person): Promise<void> {
    try {
      const people = await this.getPeople();
      const index = people.findIndex(p => p.id === updatedPerson.id);
      if (index !== -1) {
        people[index] = updatedPerson;
        await this.savePeople(people);
      }
    } catch (error) {
      console.error('Error updating person:', error);
      throw error;
    }
  }

  static async deletePerson(personId: string): Promise<void> {
    try {
      const people = await this.getPeople();
      const filtered = people.filter(p => p.id !== personId);
      await this.savePeople(filtered);
    } catch (error) {
      console.error('Error deleting person:', error);
      throw error;
    }
  }

  // Activities methods
  static async saveActivities(activities: Activity[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving activities:', error);
      throw error;
    }
  }

  static async getActivities(): Promise<Activity[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting activities:', error);
      return [];
    }
  }

  static async addActivity(activity: Activity): Promise<void> {
    try {
      const activities = await this.getActivities();
      activities.push(activity);
      await this.saveActivities(activities);
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  }

  static async updateActivity(updatedActivity: Activity): Promise<void> {
    try {
      const activities = await this.getActivities();
      const index = activities.findIndex(a => a.id === updatedActivity.id);
      if (index !== -1) {
        activities[index] = updatedActivity;
        await this.saveActivities(activities);
      }
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  }

  static async deleteActivity(activityId: string): Promise<void> {
    try {
      const activities = await this.getActivities();
      const filtered = activities.filter(a => a.id !== activityId);
      await this.saveActivities(filtered);
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }

  // Settings methods
  static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  static async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
        notifications: {
          enabled: true,
          dailySummaryTime: '08:00',
          soundEnabled: true,
          reminderBeforeDays: 1,
        },
        initialized: false,
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        notifications: {
          enabled: true,
          dailySummaryTime: '08:00',
          soundEnabled: true,
          reminderBeforeDays: 1,
        },
        initialized: false,
      };
    }
  }

  // Clear all data
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}