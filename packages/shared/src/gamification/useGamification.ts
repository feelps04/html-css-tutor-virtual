import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getFirestore, doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { Badge, Challenge } from '../types';
import { availableBadges } from './badges';
import { dailyChallenges, weeklyChallenges } from './challenges';

interface GamificationState {
  currentLevel: number;
  currentExperience: number;
  badges: Badge[];
  activeChallenges: Challenge[];
  completedChallenges: string[];
  
  // Actions
  addExperience: (amount: number, userId: string) => Promise<void>;
  completeChallenge: (challengeId: string, userId: string) => Promise<void>;
  unlockBadge: (badgeId: string, userId: string) => Promise<void>;
  resetDailyChallenges: () => void;
  resetWeeklyChallenges: () => void;
}

// Experience required for each level
const experienceForLevel = (level: number): number => {
  return level * 100;
};

export const useGamification = create<GamificationState>()(
  persist(
    (set, get) => ({
      currentLevel: 1,
      currentExperience: 0,
      badges: [],
      activeChallenges: [],
      completedChallenges: [],
      
      addExperience: async (amount: number, userId: string) => {
        const db = getFirestore();
        const newExperience = get().currentExperience + amount;
        let newLevel = get().currentLevel;
        
        // Check if user leveled up
        while (newExperience >= experienceForLevel(newLevel)) {
          newLevel++;
        }
        
        // Update Firestore
        const userRef = doc(db, 'userProfiles', userId);
        await updateDoc(userRef, {
          experience: newExperience,
          level: newLevel
        });
        
        set({
          currentExperience: newExperience,
          currentLevel: newLevel
        });
      },
      
      completeChallenge: async (challengeId: string, userId: string) => {
        const db = getFirestore();
        const userRef = doc(db, 'userProfiles', userId);
        
        // Find the challenge
        const challenge = get().activeChallenges.find(c => c.id === challengeId);
        if (!challenge) return;
        
        // Add challenge to completed list
        await updateDoc(userRef, {
          completedChallenges: arrayUnion(challengeId)
        });
        
        // Add experience
        await get().addExperience(challenge.experienceReward, userId);
        
        // Unlock badge if available
        if (challenge.badgeReward) {
          await get().unlockBadge(challenge.badgeReward.id, userId);
        }
        
        set(state => ({
          completedChallenges: [...state.completedChallenges, challengeId],
          activeChallenges: state.activeChallenges.filter(c => c.id !== challengeId)
        }));
      },
      
      unlockBadge: async (badgeId: string, userId: string) => {
        const badge = availableBadges.find(b => b.id === badgeId);
        if (!badge) return;
        
        // Add timestamp to badge
        const badgeWithTimestamp = {
          ...badge,
          unlockedAt: new Date()
        };
        
        const db = getFirestore();
        const userRef = doc(db, 'userProfiles', userId);
        
        // Add badge to user profile
        await updateDoc(userRef, {
          badges: arrayUnion(badgeWithTimestamp)
        });
        
        set(state => ({
          badges: [...state.badges, badgeWithTimestamp]
        }));
      },
      
      resetDailyChallenges: () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        // Create daily challenges
        const dailies = dailyChallenges.map(challenge => ({
          ...challenge,
          startDate: now,
          endDate: tomorrow
        }));
        
        set(state => ({
          activeChallenges: [
            ...state.activeChallenges.filter(c => c.type !== 'daily'),
            ...dailies
          ]
        }));
      },
      
      resetWeeklyChallenges: () => {
        const now = new Date();
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        // Create weekly challenges
        const weeklies = weeklyChallenges.map(challenge => ({
          ...challenge,
          startDate: now,
          endDate: nextWeek
        }));
        
        set(state => ({
          activeChallenges: [
            ...state.activeChallenges.filter(c => c.type !== 'weekly'),
            ...weeklies
          ]
        }));
      }
    }),
    {
      name: 'html-css-tutor-gamification'
    }
  )
);

