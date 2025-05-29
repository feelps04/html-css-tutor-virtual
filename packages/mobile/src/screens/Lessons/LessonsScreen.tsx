import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, ActivityIndicator, Searchbar, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../contexts/AuthContext';

// Placeholder lesson data
const modules = [
  {
    id: 'module-1',
    title: 'Fundamentos de HTML',
    lessons: [
      {
        id: 'lesson-1',
        title: 'Introdução ao HTML',
        description: 'Aprenda os conceitos básicos da linguagem de marcação HTML.',
        duration: 15,
        difficulty: 'beginner',
        completed: true,
      },
      {
        id: 'lesson-2',
        title: 'Estrutura Básica',
        description: 'Entenda a estrutura básica de um documento HTML.',
        duration: 20,
        difficulty: 'beginner',
        completed: true,
      },
      {
        id: 'lesson-3',
        title: 'Elementos e Tags',
        description: 'Conheça os principais elementos e tags HTML.',
        duration: 25,
        difficulty: 'beginner',
        completed: false,
      }
    ]
  },
  {
    id: 'module-2',
    title: 'Fundamentos de CSS',
    lessons: [
      {
        id: 'lesson-4',
        title: 'Introdução ao CSS',
        description: 'Aprenda os conceitos básicos de estilização com CSS.',
        duration: 15,
        difficulty: 'beginner',
        completed: false,
      },
      {
        id: 'lesson-5',
        title: 'Seletores CSS',
        description: 'Entenda como selecionar elementos HTML para aplicar estilos.',
        duration: 20,
        difficulty: 'beginner',
        completed: false,
      },
      {
        id: 'lesson-6',
        title: 'Box Model',
        description: 'Compreenda o modelo de caixa do CSS e suas propriedades.',
        duration: 25,
        difficulty: 'intermediate',
        completed: false,
      }
    ]
  },
  {
    id: 'module-3',
    title: 'Layouts Responsivos',
    lessons: [
      {
        id: 'lesson-7',
        title: 'Media Queries',
        description: 'Aprenda a criar sites que se adaptam a diferentes tamanhos de tela.',
        duration: 30,
        difficulty: 'intermediate',
        completed: false,
      },
      {
        id: 'lesson-8',
        title: 'Flexbox',
        description: 'Use o flexbox para criar layouts flexíveis e responsivos.',
        duration: 35,
        difficulty: 'intermediate',
        completed: false,
      },
      {
        id: 'lesson-9',
        title: 'CSS Grid',
        description: 'Crie layouts complexos e bi-dimensionais com CSS Grid.',
        duration: 40,
        difficulty: 'advanced',
        completed: false,
      }
    ]
  }
];

const LessonsScreen = () => {
  const navigation = useNavigation();
  const { authState } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredModules, setFilteredModules] = useState(modules);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Simulate loading lessons
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  // Handle search
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      applyFilters(selectedFilter);
      return;
    }
    
    const filtered = modules.map(module => {
      const filteredLessons = module.lessons.filter(lesson => 
        lesson.title.toLowerCase().includes(query.toLowerCase()) || 
        lesson.description.toLowerCase().includes(query.toLowerCase())
      );
      
      return filteredLessons.length > 0 
        ? { ...module, lessons: filteredLessons } 
        : null;
    }).filter(Boolean) as typeof modules;
    
    setFilteredModules(filtered);
  };
  
  // Apply filters (all, completed, in-progress)
  const applyFilters = (filter: string) => {
    setSelectedFilter(filter);
    
    if (filter === 'all') {
      setFilteredModules(modules);
      return;
    }
    
    const filtered = modules.map(module => {
      const filteredLessons = module.lessons.filter(lesson => 
        filter === 'completed' ? lesson.completed : !lesson.completed
      );
      
      return filteredLessons.length > 0 
        ? { ...module, lessons: filteredLessons } 
        : null;
    }).filter(Boolean) as typeof modules;
    
    setFilteredModules(filtered);
  };
  
  // Navigate to lesson detail
  const navigateToLesson = (lessonId: string, title: string) => {
    navigation.navigate(
      'LessonDetail' as never, 
      { id: lessonId, title } as never
    );
  };
  
  // Render difficulty badge
  const renderDifficultyBadge = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: '#10b981',
      intermediate: '#f59e0b',
      advanced: '#ef4444'
    };
    
    const labels: Record<string, string> = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado'
    };
    
    return (
      <Chip 
        style={[styles.difficultyChip, { backgroundColor: colors[difficulty] + '20' }]}
        textStyle={{ color: colors[difficulty], fontSize: 12 }}
      >
        {labels[difficulty]}
      </Chip>
    );
  };
  
  // Render lesson item
  const renderLessonItem = ({ item }: { item: typeof modules[0]['lessons'][0] }) => (
    <Card 
      style={[
        styles.lessonCard, 
        item.completed && styles.completedLessonCard
      ]}
      onPress={() => navigateToLesson(item.id, item.title)}
    >
      <Card.Content>
        <View style={styles.lessonHeader}>
          <Text style={styles.lessonTitle}>{item.title}</Text>
          {item.completed && (
            <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
          )}
        </View>
        
        <Text style={styles.lessonDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.lessonFooter}>
          <View style={styles.timeContainer}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#6b7280" />
            <Text style={styles.timeText}>{item.duration} min</Text>
          </View>
          
          {renderDifficultyBadge(item.difficulty)}
        </View>
      </Card.Content>
    </Card>
  );
  
  // Render module with its lessons
  const renderModule = ({ item }: { item: typeof modules[0] }) => (
    <View style={styles.moduleContainer}>
      <View style={styles.moduleHeader}>
        <Text style={styles.moduleTitle}>{item.title}</Text>
        <Badge style={styles.lessonCountBadge}>
          {item.lessons.length}
        </Badge>
      </View>
      
      <FlatList
        data={item.lessons}
        keyExtractor={(lesson) => lesson.id}
        renderItem={renderLessonItem}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
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
      <Searchbar
        placeholder="Buscar lições"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'all' && styles.activeFilterButton
          ]}
          onPress={() => applyFilters('all')}
        >
          <Text style={[
            styles.filterText,
            selectedFilter === 'all' && styles.activeFilterText
          ]}>
            Todas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'completed' && styles.activeFilterButton
          ]}
          onPress={() => applyFilters('completed')}
        >
          <Text style={[
            styles.filterText,
            selectedFilter === 'completed' && styles.activeFilterText
          ]}>
            Concluídas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'in-progress' && styles.activeFilterButton
          ]}
          onPress={() => applyFilters('in-progress')}
        >
          <Text style={[
            styles.filterText,
            selectedFilter === 'in-progress' && styles.activeFilterText
          ]}>
            Em progresso
          </Text>
        </TouchableOpacity>
      </View>
      
      {filteredModules.length > 0 ? (
        <FlatList
          data={filteredModules}
          keyExtractor={(module) => module.id}
          renderItem={renderModule}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.modulesList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="magnify-close" size={60} color="#d1d5db" />
          <Text style={styles.emptyText}>
            Nenhuma lição encontrada para sua busca.
          </Text>
          <TouchableOpacity onPress={() => {
            setSearchQuery('');
            applyFilters('all');
          }}>
            <Text style={styles.resetText}>
              Limpar filtros
            </Text>
          </TouchableOpacity>
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
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
  },
  activeFilterButton: {
    backgroundColor: '#dbeafe',
  },
  filterText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#3b82f6',
  },
  modulesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  moduleContainer: {
    marginBottom: 24,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  lessonCountBadge: {
    backgroundColor: '#e5e7eb',
    color: '#4b5563',
  },
  lessonCard: {
    marginBottom: 10,
    elevation: 2,
  },
  completedLessonCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  difficultyChip: {
    height: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  resetText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LessonsScreen;

