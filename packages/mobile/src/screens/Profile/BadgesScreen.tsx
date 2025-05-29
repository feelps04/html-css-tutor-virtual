import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, ActivityIndicator, Surface, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthContext } from '../../contexts/AuthContext';
import { formatFriendlyDate, Badge } from '@html-css-tutor/shared';

const BadgesScreen = () => {
  const { authState } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [badgesByCategory, setBadgesByCategory] = useState<Record<string, Badge[]>>({});
  
  useEffect(() => {
    // Simulate loading badges
    setTimeout(() => {
      if (authState.profile) {
        // Organize badges by category
        const categorized: Record<string, Badge[]> = {};
        
        // Get badges from profile
        const availableBadges: Badge[] = [
          // Achievement badges
          {
            id: 'first-lesson',
            name: 'Primeiros Passos',
            description: 'Completou sua primeira lição de HTML',
            imageUrl: 'https://via.placeholder.com/100/3b82f6/FFFFFF?text=HTML',
            category: 'achievement'
          },
          {
            id: 'css-master',
            name: 'Mestre do CSS',
            description: 'Completou todas as lições de CSS',
            imageUrl: 'https://via.placeholder.com/100/8b5cf6/FFFFFF?text=CSS',
            category: 'achievement'
          },
          {
            id: 'html-guru',
            name: 'Guru do HTML',
            description: 'Completou todas as lições de HTML',
            imageUrl: 'https://via.placeholder.com/100/10b981/FFFFFF?text=HTML',
            category: 'achievement'
          },
          {
            id: 'responsive-designer',
            name: 'Designer Responsivo',
            description: 'Criou seu primeiro layout responsivo',
            imageUrl: 'https://via.placeholder.com/100/f59e0b/FFFFFF?text=RWD',
            category: 'skill'
          },
          // Skill badges
          {
            id: 'flexbox-master',
            name: 'Mestre do Flexbox',
            description: 'Dominou os conceitos de Flexbox',
            imageUrl: 'https://via.placeholder.com/100/ef4444/FFFFFF?text=FLEX',
            category: 'skill'
          },
          {
            id: 'grid-wizard',
            name: 'Mago do Grid',
            description: 'Dominou os conceitos de CSS Grid',
            imageUrl: 'https://via.placeholder.com/100/14b8a6/FFFFFF?text=GRID',
            category: 'skill'
          },
          // Participation badges
          {
            id: 'seven-day-streak',
            name: '7 Dias Seguidos',
            description: 'Acessou o tutor por 7 dias consecutivos',
            imageUrl: 'https://via.placeholder.com/100/6366f1/FFFFFF?text=7',
            category: 'participation'
          },
          {
            id: 'thirty-day-streak',
            name: '30 Dias Seguidos',
            description: 'Acessou o tutor por 30 dias consecutivos',
            imageUrl: 'https://via.placeholder.com/100/a855f7/FFFFFF?text=30',
            category: 'participation'
          },
          // Challenge badges
          {
            id: 'challenge-champion',
            name: 'Campeão de Desafios',
            description: 'Completou 10 desafios',
            imageUrl: 'https://via.placeholder.com/100/ec4899/FFFFFF?text=10',
            category: 'challenge'
          },
          {
            id: 'speed-coder',
            name: 'Programador Veloz',
            description: 'Completou um desafio em menos de 5 minutos',
            imageUrl: 'https://via.placeholder.com/100/f97316/FFFFFF?text=FAST',
            category: 'challenge'
          }
        ];
        
        // For demonstration, set some badges as unlocked
        const unlockedBadgeIds = ['first-lesson', 'responsive-designer', 'flexbox-master', 'seven-day-streak'];
        
        // Add unlocked dates to unlocked badges
        const badgesWithUnlockDates = availableBadges.map(badge => {
          if (unlockedBadgeIds.includes(badge.id)) {
            return {
              ...badge,
              unlockedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in the last 30 days
            };
          }
          return badge;
        });
        
        // Organize by category
        badgesWithUnlockDates.forEach(badge => {
          if (!categorized[badge.category]) {
            categorized[badge.category] = [];
          }
          categorized[badge.category].push(badge);
        });
        
        setBadgesByCategory(categorized);
      }
      
      setLoading(false);
    }, 1000);
  }, [authState.profile]);
  
  // Get category name from key
  const getCategoryName = (key: string): string => {
    const names: Record<string, string> = {
      achievement: 'Conquistas',
      skill: 'Habilidades',
      participation: 'Participação',
      challenge: 'Desafios'
    };
    return names[key] || key;
  };
  
  // Check if badge is unlocked
  const isBadgeUnlocked = (badge: Badge): boolean => {
    return !!badge.unlockedAt;
  };
  
  // Handle badge press
  const handleBadgePress = (badge: Badge) => {
    setSelectedBadge(badge);
  };
  
  // Close badge detail
  const closeBadgeDetail = () => {
    setSelectedBadge(null);
  };
  
  // Render a single badge
  const renderBadge = ({ item }: { item: Badge }) => {
    const isUnlocked = isBadgeUnlocked(item);
    
    return (
      <TouchableOpacity
        style={styles.badgeItem}
        onPress={() => handleBadgePress(item)}
      >
        <View style={[styles.badgeImageContainer, !isUnlocked && styles.lockedBadgeContainer]}>
          <Image
            source={{ uri: item.imageUrl }}
            style={[styles.badgeImage, !isUnlocked && styles.lockedBadgeImage]}
            resizeMode="contain"
          />
          {!isUnlocked && (
            <View style={styles.lockIconContainer}>
              <MaterialCommunityIcons name="lock" size={20} color="#fff" />
            </View>
          )}
        </View>
        <Text style={styles.badgeName} numberOfLines={2}>
          {item.name}
        </Text>
        {isUnlocked && item.unlockedAt && (
          <Text style={styles.badgeDate}>
            {formatFriendlyDate(item.unlockedAt)}
          </Text>
        )}
      </TouchableOpacity>
    );
  };
  
  // Render a category section
  const renderCategory = (category: string, badges: Badge[]) => (
    <View key={category} style={styles.categoryContainer}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>{getCategoryName(category)}</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {badges.filter(isBadgeUnlocked).length} / {badges.length}
          </Text>
        </View>
      </View>
      
      <FlatList
        data={badges}
        keyExtractor={(item) => item.id}
        renderItem={renderBadge}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.badgesList}
      />
      
      <Divider style={styles.divider} />
    </View>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Badge Stats */}
      <Surface style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Object.values(badgesByCategory).flat().filter(isBadgeUnlocked).length}
          </Text>
          <Text style={styles.statLabel}>Desbloqueadas</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Object.values(badgesByCategory).flat().length}
          </Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Math.round((Object.values(badgesByCategory).flat().filter(isBadgeUnlocked).length / 
              Object.values(badgesByCategory).flat().length) * 100)}%
          </Text>
          <Text style={styles.statLabel}>Progresso</Text>
        </View>
      </Surface>
      
      {/* Categories */}
      <FlatList
        data={Object.entries(badgesByCategory)}
        keyExtractor={([category]) => category}
        renderItem={({ item: [category, badges] }) => renderCategory(category, badges)}
        contentContainerStyle={styles.categoriesList}
      />
      
      {/* Badge Detail Modal */}
      {selectedBadge && (
        <View style={styles.modalOverlay}>
          <Surface style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeBadgeDetail}>
              <MaterialCommunityIcons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
            
            <View style={styles.badgeDetailContainer}>
              <View style={[
                styles.detailBadgeContainer,
                !isBadgeUnlocked(selectedBadge) && styles.detailLockedBadgeContainer
              ]}>
                <Image
                  source={{ uri: selectedBadge.imageUrl }}
                  style={[
                    styles.detailBadgeImage,
                    !isBadgeUnlocked(selectedBadge) && styles.detailLockedBadgeImage
                  ]}
                  resizeMode="contain"
                />
                {!isBadgeUnlocked(selectedBadge) && (
                  <View style={styles.detailLockIconContainer}>
                    <MaterialCommunityIcons name="lock" size={30} color="#fff" />
                  </View>
                )}
              </View>
              
              <Text style={styles.detailBadgeName}>{selectedBadge.name}</Text>
              
              <Chip style={styles.categoryChip}>
                {getCategoryName(selectedBadge.category)}
              </Chip>
              
              <Text style={styles.detailBadgeDescription}>
                {selectedBadge.description}
              </Text>
              
              {isBadgeUnlocked(selectedBadge) && selectedBadge.unlockedAt ? (
                <Text style={styles.detailBadgeDate}>
                  Desbloqueado em {formatFriendlyDate(selectedBadge.unlockedAt)}
                </Text>
              ) : (
                <Text style={styles.lockedMessage}>
                  Complete os requisitos para desbloquear
                </Text>
              )}
            </View>
          </Surface>
        </View>
      )}
    </View>
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
  statsContainer: {
    flexDirection: 'row',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#e5e7eb',
  },
  categoriesList: {
    paddingBottom: 20,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
  },
  badgesList: {
    paddingHorizontal: 16,
  },
  badgeItem: {
    width: 100,
    marginRight: 16,
    alignItems: 'center',
  },
  badgeImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  lockedBadgeContainer: {
    backgroundColor: '#d1d5db',
  },
  badgeImage: {
    width: 60,
    height: 60,
  },
  lockedBadgeImage: {
    opacity: 0.5,
  },
  lockIconContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDate: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  divider: {
    marginTop: 16,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '80%',
    borderRadius: 8,
    padding: 20,
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  badgeDetailContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  detailBadgeContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  detailLockedBadgeContainer: {
    backgroundColor: '#d1d5db',
  },
  detailBadgeImage: {
    width: 90,
    height: 90,
  },
  detailLockedBadgeImage: {
    opacity: 0.5,
  },
  detailLockIconContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailBadgeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  categoryChip: {
    marginBottom: 16,
  },
  detailBadgeDescription: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  detailBadgeDate: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  lockedMessage: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});

export default BadgesScreen;

