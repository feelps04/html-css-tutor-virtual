import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Button, Divider, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useGamification, formatFriendlyDate, LessonProgress } from '@html-css-tutor/shared';

// Placeholder data for recent lessons
const recentLessons = [
  {
    id: '1',
    title: 'Introdução ao HTML',
    description: 'Aprenda os fundamentos do HTML e estrutura básica de uma página web.',
    progress: 75,
  },
  {
    id: '2',
    title: 'Estilizando com CSS',
    description: 'Domine as propriedades básicas do CSS para estilizar suas páginas.',
    progress: 40,
  },
  {
    id: '3',
    title: 'Layouts Responsivos',
    description: 'Crie layouts que se adaptam a diferentes tamanhos de tela.',
    progress: 10,
  },
];

// Placeholder data for daily challenges
const dailyChallenges = [
  {
    id: 'dc1',
    title: 'Crie um Botão Animado',
    xpReward: 50,
    difficulty: 'easy',
  },
  {
    id: 'dc2',
    title: 'Implemente um Menu Responsivo',
    xpReward: 75,
    difficulty: 'medium',
  },
];

const HomeScreen = () => {
  const { authState } = useAuthContext();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [lessonsProgress, setLessonsProgress] = useState<LessonProgress[]>([]);
  const gamification = useGamification();
  
  useEffect(() => {
    // Simulate loading lessons progress
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    // Load daily challenges
    gamification.resetDailyChallenges();
  }, []);
  
  if (!authState.profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      {/* Welcome card */}
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <View style={styles.welcomeHeader}>
            <View>
              <Text style={styles.welcomeText}>
                Olá, {authState.profile.displayName}!
              </Text>
              <Text style={styles.dateText}>
                {formatFriendlyDate(new Date())}
              </Text>
            </View>
            <Avatar.Image
              size={50}
              source={
                authState.profile.photoURL
                  ? { uri: authState.profile.photoURL }
                  : require('@assets/default-avatar.png')
              }
            />
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Nível {authState.profile.level}</Text>
              <Text style={styles.statLabel}>Seu nível</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{authState.profile.experience} XP</Text>
              <Text style={styles.statLabel}>Experiência</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{authState.profile.badges.length}</Text>
              <Text style={styles.statLabel}>Conquistas</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      {/* Continue Learning Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Continue Aprendendo</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Lessons' as never)}
          >
            <Text style={styles.seeAllText}>Ver tudo</Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <ActivityIndicator style={styles.loader} size="small" color="#3b82f6" />
        ) : (
          <FlatList
            data={recentLessons}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Card 
                style={styles.lessonCard}
                onPress={() => 
                  navigation.navigate(
                    'Lessons' as never, 
                    { 
                      screen: 'LessonDetail', 
                      params: { id: item.id, title: item.title } 
                    } as never
                  )
                }
              >
                <Card.Content>
                  <Text style={styles.lessonTitle}>{item.title}</Text>
                  <Text style={styles.lessonDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${item.progress}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>{item.progress}%</Text>
                  </View>
                </Card.Content>
              </Card>
            )}
          />
        )}
      </View>
      
      <Divider style={styles.divider} />
      
      {/* Daily Challenges Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Desafios Diários</Text>
          <TouchableOpacity 
            onPress={() => 
              navigation.navigate(
                'Profile' as never,
                { screen: 'Challenges' } as never
              )
            }
          >
            <Text style={styles.seeAllText}>Ver tudo</Text>
          </TouchableOpacity>
        </View>
        
        {dailyChallenges.map((challenge) => (
          <Card 
            key={challenge.id}
            style={styles.challengeCard}
            onPress={() => 
              navigation.navigate(
                'Profile' as never,
                { screen: 'Challenges' } as never
              )
            }
          >
            <Card.Content>
              <View style={styles.challengeHeader}>
                <MaterialCommunityIcons 
                  name="trophy-outline" 
                  size={24} 
                  color="#f59e0b" 
                />
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
              </View>
              
              <View style={styles.challengeFooter}>
                <View style={styles.challengeReward}>
                  <Text style={styles.rewardText}>+{challenge.xpReward} XP</Text>
                </View>
                
                <View style={[
                  styles.difficultyBadge,
                  challenge.difficulty === 'easy' ? styles.easyBadge :
                  challenge.difficulty === 'medium' ? styles.mediumBadge :
                  styles.hardBadge
                ]}>
                  <Text style={styles.difficultyText}>
                    {challenge.difficulty === 'easy' ? 'Fácil' :
                     challenge.difficulty === 'medium' ? 'Médio' :
                     'Difícil'}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
      
      <Divider style={styles.divider} />
      
      {/* Quick Actions */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('Editor' as never)}
          >
            <View style={[styles.quickActionIcon, styles.editorIcon]}>
              <MaterialCommunityIcons name="code-tags" size={24} color="#3b82f6" />
            </View>
            <Text style={styles.quickActionText}>Editor</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => 
              navigation.navigate(
                'Editor' as never,
                { screen: 'ScanQR' } as never
              )
            }
          >
            <View style={[styles.quickActionIcon, styles.scanIcon]}>
              <MaterialCommunityIcons name="qrcode-scan" size={24} color="#8b5cf6" />
            </View>
            <Text style={styles.quickActionText}>Escanear QR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('Community' as never)}
          >
            <View style={[styles.quickActionIcon, styles.communityIcon]}>
              <MaterialCommunityIcons name="account-group" size={24} color="#10b981" />
            </View>
            <Text style={styles.quickActionText}>Comunidade</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => 
              navigation.navigate(
                'Profile' as never,
                { screen: 'Badges' } as never
              )
            }
          >
            <View style={[styles.quickActionIcon, styles.badgesIcon]}>
              <MaterialCommunityIcons name="medal" size={24} color="#f59e0b" />
            </View>
            <Text style={styles.quickActionText}>Conquistas</Text>
          </TouchableOpacity>
        </View>
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
  welcomeCard: {
    margin: 16,
    elevation: 4,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
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
  lessonCard: {
    width: 250,
    marginRight: 12,
    elevation: 2,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  loader: {
    marginVertical: 20,
  },
  divider: {
    marginVertical: 16,
  },
  challengeCard: {
    marginBottom: 12,
    elevation: 2,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  easyBadge: {
    backgroundColor: '#dcfce7',
  },
  mediumBadge: {
    backgroundColor: '#fef9c3',
  },
  hardBadge: {
    backgroundColor: '#fee2e2',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickActionItem: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  editorIcon: {
    backgroundColor: '#dbeafe',
  },
  scanIcon: {
    backgroundColor: '#ede9fe',
  },
  communityIcon: {
    backgroundColor: '#d1fae5',
  },
  badgesIcon: {
    backgroundColor: '#fef3c7',
  },
  quickActionText: {
    fontWeight: '500',
  },
});

export default HomeScreen;

