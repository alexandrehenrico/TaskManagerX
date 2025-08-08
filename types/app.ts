export interface Company {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  email: string;
  phone: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Person {
  id: string;
  name: string;
  position: string;
  contact: string;
  profilePhoto?: string;
  activityHistory: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ActivityStatus = 'pending' | 'started' | 'completed' | 'overdue';

export interface Activity {
  id: string;
  title: string;
  description: string;
  personId: string;
  startDate: Date;
  deadline: Date;
  status: ActivityStatus;
  reminderEnabled: boolean;
  history: ActivityHistoryEntry[];
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityHistoryEntry {
  id: string;
  date: Date;
  action: string;
  observation?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  dailySummaryTime: string; // HH:MM format
  soundEnabled: boolean;
  reminderBeforeDays: number;
}

export interface AppSettings {
  company?: Company;
  notifications: NotificationSettings;
  initialized: boolean;
}