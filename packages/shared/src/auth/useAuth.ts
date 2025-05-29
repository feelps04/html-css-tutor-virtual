import { useState, useEffect } from 'react';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export interface AuthState {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface AuthActions {
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export function useAuth(): [AuthState, AuthActions] {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user profile from Firestore
          const profileDoc = await getDoc(doc(db, 'userProfiles', user.uid));
          const profile = profileDoc.exists() ? profileDoc.data() as UserProfile : null;
          
          setState({
            user,
            profile,
            loading: false,
            error: null
          });
        } catch (error) {
          setState({
            user,
            profile: null,
            loading: false,
            error: 'Failed to load user profile'
          });
        }
      } else {
        setState({
          user: null,
          profile: null,
          loading: false,
          error: null
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setState({ ...state, loading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      await updateProfile(userCredential.user, { displayName });
      
      // Create user profile document
      const newProfile: UserProfile = {
        uid: userCredential.user.uid,
        displayName,
        email,
        level: 1,
        experience: 0,
        completedLessons: [],
        badges: [],
        createdAt: new Date(),
        lastActive: new Date(),
        preferences: {
          theme: 'light',
          difficulty: 'beginner',
          notifications: true,
          studyReminders: true,
          autoSaveCode: true
        }
      };
      
      await setDoc(doc(db, 'userProfiles', userCredential.user.uid), newProfile);
      
      setState({
        user: userCredential.user,
        profile: newProfile,
        loading: false,
        error: null
      });
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: (error as Error).message
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState({ ...state, loading: true, error: null });
      await signInWithEmailAndPassword(auth, email, password);
      // The auth state change listener will update the state
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: (error as Error).message
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      setState({ ...state, loading: true, error: null });
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user profile exists
      const profileDoc = await getDoc(doc(db, 'userProfiles', userCredential.user.uid));
      
      if (!profileDoc.exists()) {
        // Create new profile for Google sign-in
        const newProfile: UserProfile = {
          uid: userCredential.user.uid,
          displayName: userCredential.user.displayName || 'User',
          email: userCredential.user.email || '',
          photoURL: userCredential.user.photoURL || undefined,
          level: 1,
          experience: 0,
          completedLessons: [],
          badges: [],
          createdAt: new Date(),
          lastActive: new Date(),
          preferences: {
            theme: 'light',
            difficulty: 'beginner',
            notifications: true,
            studyReminders: true,
            autoSaveCode: true
          }
        };
        
        await setDoc(doc(db, 'userProfiles', userCredential.user.uid), newProfile);
      }
      
      // The auth state change listener will update the state
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: (error as Error).message
      });
    }
  };

  const signOut = async () => {
    try {
      setState({ ...state, loading: true, error: null });
      await firebaseSignOut(auth);
      // The auth state change listener will update the state
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: (error as Error).message
      });
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!state.user) return;
    
    try {
      setState({ ...state, loading: true, error: null });
      
      // Update profile in Firestore
      const userRef = doc(db, 'userProfiles', state.user.uid);
      await setDoc(userRef, data, { merge: true });
      
      // Get updated profile
      const profileDoc = await getDoc(userRef);
      const updatedProfile = profileDoc.data() as UserProfile;
      
      setState({
        ...state,
        profile: updatedProfile,
        loading: false
      });
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error: (error as Error).message
      });
    }
  };

  const actions: AuthActions = {
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateUserProfile
  };

  return [state, actions];
}

