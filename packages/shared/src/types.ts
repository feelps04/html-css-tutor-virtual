// Shared types for both web and mobile applications

// User profile types
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  level: number;
  experience: number;
  completedLessons: string[];
  badges: Badge[];
  createdAt: Date;
  lastActive: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'high-contrast';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  notifications: boolean;
  studyReminders: boolean;
  autoSaveCode: boolean;
}

// Gamification types
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  unlockedAt?: Date;
  category: BadgeCategory;
}

export type BadgeCategory = 
  | 'achievement' 
  | 'skill' 
  | 'participation' 
  | 'challenge';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
  experienceReward: number;
  requirements: string[];
  startDate: Date;
  endDate: Date;
  badgeReward?: Badge;
}

// Learning content types
export interface LessonProgress {
  lessonId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  score: number;
  lastAccessed: Date;
  completedExercises: string[];
}

export interface CodeProject {
  id: string;
  userId: string;
  title: string;
  description: string;
  htmlCode: string;
  cssCode: string;
  jsCode?: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  likes: number;
  views: number;
  tags: string[];
}

