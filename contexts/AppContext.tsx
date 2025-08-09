import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Company, Person, Activity, AppSettings, ActivityStatus } from '@/types/app';
import { StorageService } from '@/services/storage';
import { NotificationService } from '@/services/notifications';
import { isOverdue } from '@/utils/dateUtils';
import { createActivityHistoryEntry } from '@/utils/generators';

interface AppContextType {
  // State
  company: Company | null;
  people: Person[];
  activities: Activity[];
  settings: AppSettings;
  loading: boolean;

  // Company methods
  saveCompany: (company: Company) => Promise<void>;

  // People methods
  addPerson: (person: Person) => Promise<void>;
  updatePerson: (person: Person) => Promise<void>;
  deletePerson: (personId: string) => Promise<void>;
  getPersonById: (personId: string) => Person | undefined;

  // Activity methods
  addActivity: (activity: Activity) => Promise<void>;
  updateActivity: (activity: Activity) => Promise<void>;
  deleteActivity: (activityId: string) => Promise<void>;
  updateActivityStatus: (activityId: string, status: ActivityStatus) => Promise<void>;

  // Settings methods
  updateSettings: (settings: AppSettings) => Promise<void>;

  // Data management methods
  clearAllData: () => Promise<void>;

  // Utility methods
  refreshData: () => Promise<void>;
  getActivitiesByPerson: (personId: string) => Activity[];
  getOverdueActivities: () => Activity[];
  getTodayActivities: () => Activity[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    notifications: {
      enabled: true,
      dailySummaryTime: '08:00',
      soundEnabled: true,
      reminderBeforeDays: 1,
    },
    initialized: false,
  });
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Check for overdue activities periodically
  useEffect(() => {
    if (activities.length === 0) return;
    
    const interval = setInterval(checkOverdueActivities, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [activities]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [companyData, peopleData, activitiesData, settingsData] = await Promise.all([
        StorageService.getCompany(),
        StorageService.getPeople(),
        StorageService.getActivities(),
        StorageService.getSettings(),
      ]);

      setCompany(companyData);
      setPeople(peopleData);
      setActivities(activitiesData);
      setSettings(settingsData);

      // Request notification permissions
      await NotificationService.requestPermissions();
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkOverdueActivities = async () => {
    const updatedActivities = activities.map(activity => {
      if (activity.status !== 'completed' && activity.status !== 'overdue' && isOverdue(new Date(activity.deadline))) {
        return {
          ...activity,
          status: 'overdue' as ActivityStatus,
          history: [
            ...activity.history,
            createActivityHistoryEntry('Status alterado automaticamente para Atrasada'),
          ],
          updatedAt: new Date(),
        };
      }
      return activity;
    });

    if (updatedActivities.some((activity, index) => activity.status !== activities[index].status)) {
      setActivities(updatedActivities);
      await StorageService.saveActivities(updatedActivities);
    }
  };

  const saveCompany = async (newCompany: Company) => {
    try {
      await StorageService.saveCompany(newCompany);
      setCompany(newCompany);
      
      // Mark as initialized
      if (!settings.initialized) {
        const updatedSettings = { ...settings, initialized: true };
        await updateSettings(updatedSettings);
      }
    } catch (error) {
      console.error('Error saving company:', error);
      throw error;
    }
  };

  const addPerson = async (person: Person) => {
    try {
      await StorageService.addPerson(person);
      setPeople(prev => [...prev, person]);
    } catch (error) {
      console.error('Error adding person:', error);
      throw error;
    }
  };

  const updatePerson = async (updatedPerson: Person) => {
    try {
      await StorageService.updatePerson(updatedPerson);
      setPeople(prev => prev.map(p => p.id === updatedPerson.id ? updatedPerson : p));
    } catch (error) {
      console.error('Error updating person:', error);
      throw error;
    }
  };

  const deletePerson = async (personId: string) => {
    try {
      await StorageService.deletePerson(personId);
      setPeople(prev => prev.filter(p => p.id !== personId));
      
      // Also remove activities assigned to this person
      const updatedActivities = activities.filter(a => a.personId !== personId);
      setActivities(updatedActivities);
      await StorageService.saveActivities(updatedActivities);
    } catch (error) {
      console.error('Error deleting person:', error);
      throw error;
    }
  };

  const addActivity = async (activity: Activity) => {
    try {
      await StorageService.addActivity(activity);
      setActivities(prev => [...prev, activity]);

      // Schedule notifications
      if (activity.reminderEnabled) {
        await NotificationService.scheduleActivityReminder(activity, settings.notifications);
        await NotificationService.scheduleDeadlineNotification(activity, settings.notifications);
      }
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  };

  const updateActivity = async (updatedActivity: Activity) => {
    try {
      await StorageService.updateActivity(updatedActivity);
      setActivities(prev => prev.map(a => a.id === updatedActivity.id ? updatedActivity : a));

      // Cancel and reschedule notifications
      await NotificationService.cancelActivityNotifications(updatedActivity.id);
      if (updatedActivity.reminderEnabled && updatedActivity.status !== 'completed') {
        await NotificationService.scheduleActivityReminder(updatedActivity, settings.notifications);
        await NotificationService.scheduleDeadlineNotification(updatedActivity, settings.notifications);
      }
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  };

  const deleteActivity = async (activityId: string) => {
    try {
      await StorageService.deleteActivity(activityId);
      setActivities(prev => prev.filter(a => a.id !== activityId));
      
      // Cancel notifications
      await NotificationService.cancelActivityNotifications(activityId);
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  };

  const updateActivityStatus = async (activityId: string, status: ActivityStatus) => {
    try {
      const activity = activities.find(a => a.id === activityId);
      if (!activity) return;

      const updatedActivity = {
        ...activity,
        status,
        history: [
          ...activity.history,
          createActivityHistoryEntry(`Status alterado para ${status}`),
        ],
        updatedAt: new Date(),
      };

      await updateActivity(updatedActivity);
    } catch (error) {
      console.error('Error updating activity status:', error);
      throw error;
    }
  };

  const updateSettings = async (newSettings: AppSettings) => {
    try {
      await StorageService.saveSettings(newSettings);
      setSettings(newSettings);

      // Reschedule daily summary if settings changed
      if (newSettings.notifications.enabled) {
        const todayActivities = getTodayActivities();
        const overdueActivities = getOverdueActivities();
        await NotificationService.scheduleDailySummary(newSettings.notifications, {
          today: todayActivities.length,
          overdue: overdueActivities.length,
        });
      } else {
        await NotificationService.cancelDailySummary();
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const clearAllData = async () => {
    try {
      // Clear storage
      await StorageService.clearAllData();
      
      // Cancel all notifications
      await NotificationService.cancelAllNotifications();
      
      // Reset state
      setCompany(null);
      setPeople([]);
      setActivities([]);
      setSettings({
        notifications: {
          enabled: true,
          dailySummaryTime: '08:00',
          soundEnabled: true,
          reminderBeforeDays: 1,
        },
        initialized: false,
      });
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    await loadInitialData();
  };

  const getPersonById = (personId: string): Person | undefined => {
    return people.find(p => p.id === personId);
  };

  const getActivitiesByPerson = (personId: string): Activity[] => {
    return activities.filter(a => a.personId === personId);
  };

  const getOverdueActivities = (): Activity[] => {
    return activities.filter(a => 
      a.status !== 'completed' && isOverdue(new Date(a.deadline))
    );
  };

  const getTodayActivities = (): Activity[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return activities.filter(a => {
      const deadline = new Date(a.deadline);
      return deadline >= today && deadline < tomorrow && a.status !== 'completed';
    });
  };

  const value: AppContextType = {
    // State
    company,
    people,
    activities,
    settings,
    loading,

    // Methods
    saveCompany,
    addPerson,
    updatePerson,
    deletePerson,
    getPersonById,
    addActivity,
    updateActivity,
    deleteActivity,
    updateActivityStatus,
    updateSettings,
    clearAllData,
    refreshData,
    getActivitiesByPerson,
    getOverdueActivities,
    getTodayActivities,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};