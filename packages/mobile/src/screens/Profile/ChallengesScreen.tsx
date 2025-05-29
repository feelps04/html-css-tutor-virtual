import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Surface, Chip, Button, ActivityIndicator, ProgressBar, Portal, Dialog } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Challenge, Badge } from '@html-css-tutor/shared';

// Placeholder challenges data
const dailyChallenges: Challenge[] = [
  {
    id: 'daily-1',
    title: 'Mestres dos Elementos',
    description: 'Utilize pelo menos 5 elementos HTML diferentes em um único projeto',
    type: 'daily',
    difficulty: 'easy',
    experienceReward: 50,
    requirements: ['Usar 5 elementos HTML diferentes'],
    startDate: new Date(),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  },
  {
    id: 'daily-2',
    title: 'Seletor Preciso',
    description: 'Use 3 tipos diferentes de seletores CSS em seu código',
    type: 'daily',
    difficulty: 'medium',
    experienceReward: 75,
    requirements: ['Usar seletor de classe', 'Usar seletor de ID', 'Usar seletor de atributo ou pseudo-classe'],
    startDate: new Date(),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  },
];

const weeklyChallenges: Challenge[] = [
  {
    id: 'weekly-1',
    title: 'Construtor de Landing Page',
    description: 'Crie uma landing page completa para um produto ou serviço fictício',
    type: 'weekly',
    difficulty: 'hard',
    experienceReward: 300,
    requirements: [
      'Incluir cabeçalho e rodapé', 
      'Ter pelo menos 3 seções', 
      'Ser responsivo', 
      'Incluir um formulário de contato'
    ],
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    badgeReward: {
      id: 'landing-page-creator',
      name: 'Criador de Landing Pages',
      description: 'Criou uma landing page completa e responsiva',
      imageUrl: 'https://via.placeholder.com/100/3b82f6/FFFFFF?text=LP',
      category: 'challenge'
    },
  },
  {
    id: 'weekly-2',
    title: 'Desafio Flexbox',
    description: 'Recrie um layout complexo usando apenas Flexbox',
    type: 'weekly',
    difficulty: 'medium',
    experienceReward: 200,
    requirements: [
      'Usar apenas Flexbox para posicionamento', 
      'Incluir um menu de navegação', 
      'Criar um layout de cards'
    ],
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
  },
];

const specialChallenges: Challenge[] = [
  {
    id: 'special-1',
    title: 'Crie um Portfólio',
    description: 'Desenvolva um portfólio profissional usando HTML e CSS',
    type: 'special',
    difficulty: 'hard',
    experienceReward: 500,
    requirements: [
      'Incluir seção sobre você',
      'Exibir seus projetos',
      'Adicionar formulário de contato',
      'Design responsivo para todos os dispositivos',
      'Usar CSS Grid e Flexbox'
    ],
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    badgeReward: {
      id: 'portfolio-master',
      name: 'Mestre de Portfólio',
      description: 'Criou um portfólio profissional impressionante',
      imageUrl: 'https://via.placeholder.com/100/8b5cf6/FFFFFF?text=PM',
      category: 'achievement'
    },
  },
];

// Combine all challenges
const allChallenges = [...dailyChallenges, ...weeklyChallenges, ...specialChallenges];

const ChallengesScreen = () => {
  const { authState } = useAuthContext();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [completedRequirements, setCompletedRequirements] = useState<Record<string, boolean>>({});
  
  // Simulate loading challenges and user progress
  useEffect(() => {
    setTimeout(() => {
      // For demonstration, set some challenges as completed
      setCompletedChallenges(['daily-1']);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Calculate days remaining until challenge end
  const getDaysRemaining = (endDate: Date): string => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return 'Expirado';
    } else if (diffDays === 1) {
      return 'Termina hoje';
    } else {
      return `${diffDays} dias restantes`;
    }
  };
  
  // Get challenge completion progress
  const getChallengeProgress = (challengeId: string): number => {
    // For simplicity, return predefined values
    if (completedChallenges.includes(challengeId)) {
      return 1; // 100% completed
    }
    
    if (Object.keys(completedRequirements).some(key => key.startsWith(challengeId))) {
      // Count completed requirements for this challenge
      const requirements = allChallenges.find(c => c.id === challengeId)?.requirements || [];
      const completedCount = requirements.filter((_, index) => 
        completedRequirements[`${challengeId}-${index}`]
      ).length;
      
      return completedCount / requirements.length;
    }
    
    return 0; // Not started
  };
  
  // Handle challenge press
  const handleChallengePress = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    
    // Initialize requirement completion state if not already set
    if (!completedChallenges.includes(challenge.id)) {
      const initialState: Record<string, boolean> = {};
      challenge.requirements.forEach((_, index) => {
        initialState[`${challenge.id}-${index}`] = false;
      });
      
      setCompletedRequirements(prev => ({
        ...prev,
        ...initialState
      }));
    }
  };
  
  // Toggle requirement completion
  const toggleRequirement = (requirementIndex: number) => {
    if (!selectedChallenge) return;
    
    const key = `${selectedChallenge.id}-${requirementIndex}`;
    setCompletedRequirements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Check if all requirements are completed
  const areAllRequirementsCompleted = (): boolean => {
    if (!selectedChallenge) return false;
    
    return selectedChallenge.requirements.every((_, index) => 
      completedRequirements[`${selectedChallenge.id}-${index}`]
    );
  };
  
  // Complete challenge
  const completeChallenge = () => {
    if (!selectedChallenge) return;
    
    // Mark challenge as completed
    setCompletedChallenges(prev => [...prev, selectedChallenge.id]);
    
    // Show completion dialog
    setShowCompletionDialog(true);
  };
  
  // Close completion dialog and challenge details
  const closeCompletionDialog = () => {
    setShowCompletionDialog(false);
    setSelectedChallenge(null);
  };
  
  // Render challenge card
  const renderChallengeCard = ({ item }: { item: Challenge }) => {
    const isCompleted = completedChallenges.includes(item.id);
    const progress = getChallengeProgress(item.id);
    
    return (
      <Card 
        style={[styles.challengeCard, isCompleted && styles.completedCard]}
        onPress={() => handleChallengePress(item)}
      >
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.challengeTitle}>{item.title}</Text>
              {isCompleted && (
                <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
              )}
            </View>
            
            <Chip 
              style={[
                styles.difficultyChip,
                item.difficulty === 'easy' ? styles.easyChip :
                item.difficulty === 'medium' ? styles.mediumChip :
                styles.hardChip
              ]}
            >
              {item.difficulty === 'easy' ? 'Fácil' :
               item.difficulty === 'medium' ? 'Médio' :
               'Difícil'}
            </Chip>
          </View>
          
          <Text style={styles.challengeDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.progressContainer}>
            <ProgressBar 
              progress={progress} 
              color={isCompleted ? '#10b981' : '#3b82f6'} 
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
          
          <View style={styles.cardFooter}>
            <View style={styles.rewardContainer}>
              <MaterialCommunityIcons name="star" size={16} color="#f59e0b" />
              <Text style={styles.rewardText}>{item.experienceReward} XP</Text>
            </View>
            
            <Text style={styles.timeRemaining}>
              {isCompleted ? 'Concluído' : getDaysRemaining(item.endDate)}
            </Text>
          </View>
          
          {item.badgeReward && (
            <View style={styles.badgeIndicator}>
              <MaterialCommunityIcons name="medal" size={16} color="#8b5cf6" />
              <Text style={styles.badgeText}>Recompensa: {item.badgeReward.name}</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Challenge sections */}
      <FlatList
        data={[
          { title: 'Desafios Diários', data: dailyChallenges },
          { title: 'Desafios Semanais', data: weeklyChallenges },
          { title: 'Desafios Especiais', data: specialChallenges }
        ]}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              <Chip style={styles.countChip}>
                {item.data.filter(challenge => 
                  completedChallenges.includes(challenge.id)
                ).length} / {item.data.length}
              </Chip>
            </View>
            
            <FlatList
              data={item.data}
              keyExtractor={(challenge) => challenge.id}
              renderItem={renderChallengeCard}
              horizontal={false}
              scrollEnabled={false}
            />
          </View>
        )}
      />
      
      {/* Challenge Detail Modal */}
      <Portal>
        <Dialog
          visible={!!selectedChallenge && !showCompletionDialog}
          onDismiss={() => setSelectedChallenge(null)}
          style={styles.dialog}
        >
          {selectedChallenge && (
            <>
              <Dialog.Title>{selectedChallenge.title}</Dialog.Title>
              <Dialog.Content>
                <Text style={styles.dialogDescription}>
                  {selectedChallenge.description}
                </Text>
                
                <View style={styles.dialogMeta}>
                  <Chip 
                    style={[
                      styles.difficultyChip,
                      selectedChallenge.difficulty === 'easy' ? styles.easyChip :
                      selectedChallenge.difficulty === 'medium' ? styles.mediumChip :
                      styles.hardChip
                    ]}
                  >
                    {selectedChallenge.difficulty === 'easy' ? 'Fácil' :
                     selectedChallenge.difficulty === 'medium' ? 'Médio' :
                     'Difícil'}
                  </Chip>
                  
                  <Text style={styles.timeRemaining}>
                    {completedChallenges.includes(selectedChallenge.id) 
                      ? 'Concluído' 
                      : getDaysRemaining(selectedChallenge.endDate)}
                  </Text>
                </View>
                
                <View style={styles.rewardDetail}>
                  <Text style={styles.rewardTitle}>Recompensa:</Text>
                  <Text style={styles.rewardValue}>{selectedChallenge.experienceReward} XP</Text>
                  
                  {selectedChallenge.badgeReward && (
                    <View style={styles.badgeDetail}>
                      <Text style={styles.badgeTitle}>Badge:</Text>
                      <View style={styles.badgeInfo}>
                        <MaterialCommunityIcons name="medal" size={20} color="#8b5cf6" />
                        <Text style={styles.badgeName}>{selectedChallenge.badgeReward.name}</Text>
                      </View>
                    </View>
                  )}
                </View>
                
                <Text style={styles.requirementsTitle}>Requisitos:</Text>
                {selectedChallenge.requirements.map((requirement, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={styles.requirementItem}
                    onPress={() => !completedChallenges.includes(selectedChallenge.id) && toggleRequirement(index)}
                    disabled={completedChallenges.includes(selectedChallenge.id)}
                  >
                    <MaterialCommunityIcons 
                      name={completedRequirements[`${selectedChallenge.id}-${index}`] || completedChallenges.includes(selectedChallenge.id)
                        ? "checkbox-marked" 
                        : "checkbox-blank-outline"
                      } 
                      size={24} 
                      color={completedRequirements[`${selectedChallenge.id}-${index}`] || completedChallenges.includes(selectedChallenge.id)
                        ? "#10b981" 
                        : "#6b7280"
                      } 
                    />
                    <Text style={[
                      styles.requirementText,
                      (completedRequirements[`${selectedChallenge.id}-${index}`] || completedChallenges.includes(selectedChallenge.id)) && 
                      styles.completedRequirement
                    ]}>
                      {requirement}
                    </Text>
                  </TouchableOpacity>
                ))}
                
                {!completedChallenges.includes(selectedChallenge.id) && (
                  <Button 
                    mode="contained"
                    onPress={completeChallenge}
                    style={styles.completeButton}
                    disabled={!areAllRequirementsCompleted()}
                  >
                    Concluir Desafio
                  </Button>
                )}
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setSelectedChallenge(null)}>Fechar</Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </Portal>
      
      {/* Challenge Completion Dialog */}
      <Portal>
        <Dialog
          visible={showCompletionDialog}
          onDismiss={closeCompletionDialog}
          style={styles.completionDialog}
        >
          <View style={styles.completionContent}>
            <MaterialCommunityIcons name="trophy" size={60} color="#f59e0b" />
            <Text style={styles.completionTitle}>Parabéns!</Text>
            <Text style={styles.completionMessage}>
              Você completou o desafio "{selectedChallenge?.title}"
            </Text>
            
            <View style={styles.rewardBox}>
              <Text style={styles.rewardBoxTitle}>Recompensas:</Text>
              <View style={styles.xpReward}>
                <MaterialCommunityIcons name="star" size={24} color="#f59e0b" />
                <Text style={styles.xpText}>{selectedChallenge?.experienceReward} XP</Text>
              </View>
              
              {selectedChallenge?.badgeReward && (
                <View style={styles.badgeReward}>
                  <MaterialCommunityIcons name="medal" size={24} color="#8b5cf6" />
                  <Text style={styles.badgeRewardText}>{selectedChallenge.badgeReward.name}</Text>
                </View>
              )}
            </View>
            
            <Button 
              mode="contained"
              onPress={closeCompletionDialog}
              style={styles.continueButton}
            >
              Continuar
            </Button>
          </View>
        </Dialog>
      </Portal>
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
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
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
  countChip: {
    backgroundColor: '#e5e7eb',
  },
  challengeCard: {
    marginBottom: 12,
    elevation: 2,
  },
  completedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  difficultyChip: {
    height: 24,
  },
  easyChip: {
    backgroundColor: '#d1fae5',
  },
  mediumChip: {
    backgroundColor: '#fef3c7',
  },
  hardChip: {
    backgroundColor: '#fee2e2',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    minWidth: 32,
    textAlign: 'right',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '500',
    marginLeft: 4,
  },
  timeRemaining: {
    fontSize: 12,
    color: '#6b7280',
  },
  badgeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#8b5cf6',
    marginLeft: 4,
  },
  dialog: {
    maxHeight: '80%',
  },
  dialogDescription: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 16,
    lineHeight: 24,
  },
  dialogMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rewardDetail: {
    marginBottom: 16,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  rewardValue: {
    fontSize: 18,
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  badgeDetail: {
    marginTop: 8,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  badgeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 16,
    color: '#8b5cf6',
    marginLeft: 8,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 8,
    flex: 1,
  },
  completedRequirement: {
    color: '#10b981',
    textDecorationLine: 'line-through',
  },
  completeButton: {
    marginTop: 16,
    backgroundColor: '#3b82f6',
  },
  completionDialog: {
    borderRadius: 16,
  },
  completionContent: {
    padding: 24,
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  completionMessage: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 24,
  },
  rewardBox: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  rewardBoxTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  xpReward: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginLeft: 8,
  },
  badgeReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeRewardText: {
    fontSize: 16,
    color: '#8b5cf6',
    marginLeft: 8,
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#3b82f6',
  },
});

export default ChallengesScreen;

