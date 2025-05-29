import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAuthContext } from '../contexts/AuthContext';

// Auth Screens
import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';

// Main Screens
import HomeScreen from '../screens/Home/HomeScreen';
import LessonsScreen from '../screens/Lessons/LessonsScreen';
import LessonDetailScreen from '../screens/Lessons/LessonDetailScreen';
import EditorScreen from '../screens/Editor/EditorScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import CommunityScreen from '../screens/Community/CommunityScreen';
import ProjectDetailScreen from '../screens/Community/ProjectDetailScreen';
import ScanQRScreen from '../screens/Editor/ScanQRScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import BadgesScreen from '../screens/Profile/BadgesScreen';
import ChallengesScreen from '../screens/Profile/ChallengesScreen';

// Stack navigators
const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();
const LessonsStack = createStackNavigator();
const EditorStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const CommunityStack = createStackNavigator();

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Auth Navigator
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

// Home Stack Navigator
function HomeNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ title: 'Início' }}
      />
    </HomeStack.Navigator>
  );
}

// Lessons Stack Navigator
function LessonsNavigator() {
  return (
    <LessonsStack.Navigator>
      <LessonsStack.Screen 
        name="LessonsScreen" 
        component={LessonsScreen} 
        options={{ title: 'Lições' }}
      />
      <LessonsStack.Screen 
        name="LessonDetail" 
        component={LessonDetailScreen}
        options={({ route }) => ({ 
          title: (route.params as any)?.title || 'Detalhes da Lição' 
        })}
      />
    </LessonsStack.Navigator>
  );
}

// Editor Stack Navigator
function EditorNavigator() {
  return (
    <EditorStack.Navigator>
      <EditorStack.Screen 
        name="EditorScreen" 
        component={EditorScreen} 
        options={{ title: 'Editor de Código' }}
      />
      <EditorStack.Screen 
        name="ScanQR" 
        component={ScanQRScreen} 
        options={{ title: 'Escanear QR Code' }}
      />
    </EditorStack.Navigator>
  );
}

// Profile Stack Navigator
function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen} 
        options={{ title: 'Meu Perfil' }}
      />
      <ProfileStack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Configurações' }}
      />
      <ProfileStack.Screen 
        name="Badges" 
        component={BadgesScreen} 
        options={{ title: 'Minhas Conquistas' }}
      />
      <ProfileStack.Screen 
        name="Challenges" 
        component={ChallengesScreen} 
        options={{ title: 'Desafios' }}
      />
    </ProfileStack.Navigator>
  );
}

// Community Stack Navigator
function CommunityNavigator() {
  return (
    <CommunityStack.Navigator>
      <CommunityStack.Screen 
        name="CommunityScreen" 
        component={CommunityScreen} 
        options={{ title: 'Comunidade' }}
      />
      <CommunityStack.Screen 
        name="ProjectDetail" 
        component={ProjectDetailScreen} 
        options={({ route }) => ({ 
          title: (route.params as any)?.title || 'Projeto' 
        })}
      />
    </CommunityStack.Navigator>
  );
}

// Main Tab Navigator
function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeNavigator} 
        options={{
          headerShown: false,
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Lessons" 
        component={LessonsNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Lições',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-variant" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Editor" 
        component={EditorNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Editor',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="code-tags" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Comunidade',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Root Navigator
export default function Navigation() {
  const { authState } = useAuthContext();
  
  // Show auth screens if user is not logged in
  if (!authState.user) {
    return <AuthNavigator />;
  }
  
  // Show main app screens if user is logged in
  return <MainNavigator />;
}

