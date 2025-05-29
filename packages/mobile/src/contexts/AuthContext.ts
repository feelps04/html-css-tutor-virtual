import { createContext, useContext } from 'react';
import { AuthState, AuthActions } from '@html-css-tutor/shared';

interface AuthContextType {
  authState: AuthState;
  authActions: AuthActions;
}

// Create auth context with default values
export const AuthContext = createContext<AuthContextType>({
  authState: {
    user: null,
    profile: null,
    loading: true,
    error: null
  },
  authActions: {
    signUp: async () => {},
    signIn: async () => {},
    signInWithGoogle: async () => {},
    signOut: async () => {},
    updateUserProfile: async () => {}
  }
});

// Custom hook to use auth context
export const useAuthContext = () => useContext(AuthContext);

