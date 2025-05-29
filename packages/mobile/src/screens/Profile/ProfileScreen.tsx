import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Surface, Button, Divider, ActivityIndicator, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../contexts/AuthContext';
import { formatFriendlyDate } from '@html-css-tutor/shared';

const ProfileScreen = () => {
  const { authState, authActions } = useAuthContext();
  const navigation = useNavigation();
  
  if (!authState.profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }
  
  const profile = authState.profile;
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await authActions.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  // Calculate progress percentage to next level
  const nextLevelExperience = profile.level * 100;
  const progressPercentage = Math.min(
    Math.floor((profile.experience / nextLevelExperience) * 100),
    100
  );
  
  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Surface style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <Avatar.Image
            size={80}
            source={
              profile.photoURL
                ? { uri: profile.photoURL }
                : require('@assets/default-avatar.png')
            }
          />
          
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{profile.displayName}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
            <Text style={styles.profileDate}>
              Membro desde {formatFriendlyDate(profile.createdAt)}
            </Text>
          </View>
        </View>
        
        <View style={styles.levelContainer}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelText}>Nível {profile.level}</Text>
            <Text style={styles.experienceText}>
              {profile.experience} / {nextLevelExperience} XP
            </Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
        </View>
      </Surface>
      
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons name="book-open-variant" size={30} color="#3b82f6" />
            <Text style={styles.statValue}>{profile.completedLessons.length}</Text>
            <Text style={styles.statLabel}>Lições Completadas</Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons name="medal" size={30} color="#f59e0b" />
            <Text style={styles.statValue}>{profile.badges.length}</Text>
            <Text style={styles.statLabel}>Conquistas</Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons name="trophy" size={30} color="#10b981" />
            <Text style={styles.statValue}>
              {profile.completedLessons.length > 0 
                ? Math.floor((profile.experience / profile.completedLessons.length))
                : 0}
            </Text>
            <Text style={styles.statLabel}>XP Média</Text>
          </Card.Content>
        </Card>
      </View>
      
      <Divider style={styles.divider} />
      
      {/* Recent Badges */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Conquistas Recentes</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Badges' as never)}
          >
            <Text style={styles.seeAllText}>Ver tudo</Text>
          </TouchableOpacity>
        </View>
        
        {profile.badges.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.badgesScroll}
          >
            {profile.badges.slice(0, 5).map((badge, index) => (
              <Card key={index} style={styles.badgeCard}>
                <Card.Content style={styles.badgeContent}>
                  <Image 
                    source={{ uri: badge.imageUrl }} 
                    style={styles.badgeImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.badgeName}>{badge.name}</Text>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>
            Você ainda não possui conquistas. Complete lições e desafios para ganhar badges!
          </Text>
        )}
      </View>
      
      <Divider style={styles.divider} />
      
      {/* Profile Menu */}
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Challenges' as never)}
        >
          <MaterialCommunityIcons name="trophy-outline" size={24} color="#3b82f6" />
          <Text style={styles.menuText}>Desafios</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#9ca3af" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Badges' as never)}
        >
          <MaterialCommunityIcons name="medal-outline" size={24} color="#3b82f6" />
          <Text style={styles.menuText}>Minhas Conquistas</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#9ca3af" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings' as never)}
        >
          <MaterialCommunityIcons name="cog-outline" size={24} color="#3b82f6" />
          <Text style={styles.menuText}>Configurações</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#9ca3af" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleSignOut}
        >
          <MaterialCommunityIcons name="logout" size={24} color="#ef4444" />
          <Text style={[styles.menuText, styles.logoutText]}>Sair</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  profileHeader: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
    elevation: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileText: {
    marginLeft: 20,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  profileDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  levelContainer: {
    marginTop: 10,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  experienceText: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    width: '30%',
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    padding: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  divider: {
    marginVertical: 16,
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  badgesScroll: {
    flexDirection: 'row',
  },
  badgeCard: {
    width: 100,
    marginRight: 12,
    elevation: 2,
  },
  badgeContent: {
    alignItems: 'center',
    padding: 10,
  },
  badgeImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
    marginVertical: 20,
  },
  menuContainer: {
    marginHorizontal: 16,
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },
  logoutText: {
    color: '#ef4444',
  },
});

export default ProfileScreen;

