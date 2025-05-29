import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Chip, ActivityIndicator, Searchbar, Avatar, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../contexts/AuthContext';

// Placeholder community projects data
const communityProjects = [
  {
    id: 'project-1',
    title: 'Navbar Responsiva',
    description: 'Uma navbar que se adapta a diferentes tamanhos de tela usando apenas HTML e CSS.',
    creator: {
      id: 'user-1',
      name: 'Marina Silva',
      photoURL: 'https://randomuser.me/api/portraits/women/32.jpg',
    },
    tags: ['HTML', 'CSS', 'Responsivo'],
    likes: 28,
    views: 156,
    createdAt: new Date('2025-05-20T14:30:00'),
    thumbnailUrl: 'https://via.placeholder.com/300x200/3b82f6/FFFFFF?text=Navbar+Responsiva',
  },
  {
    id: 'project-2',
    title: 'Galeria de Imagens com Flexbox',
    description: 'Uma galeria de imagens responsiva usando flexbox para organização dos itens.',
    creator: {
      id: 'user-2',
      name: 'Pedro Alves',
      photoURL: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    tags: ['HTML', 'CSS', 'Flexbox'],
    likes: 42,
    views: 210,
    createdAt: new Date('2025-05-22T09:15:00'),
    thumbnailUrl: 'https://via.placeholder.com/300x200/10b981/FFFFFF?text=Galeria+Flexbox',
  },
  {
    id: 'project-3',
    title: 'Formulário de Contato Animado',
    description: 'Um formulário de contato com animações CSS nos campos de entrada.',
    creator: {
      id: 'user-3',
      name: 'Ana Costa',
      photoURL: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    tags: ['HTML', 'CSS', 'JavaScript', 'Animações'],
    likes: 35,
    views: 178,
    createdAt: new Date('2025-05-25T16:45:00'),
    thumbnailUrl: 'https://via.placeholder.com/300x200/8b5cf6/FFFFFF?text=Formulário+Animado',
  },
  {
    id: 'project-4',
    title: 'Cards de Preços',
    description: 'Uma seção de cards de preços para um site de serviços, com hover effects.',
    creator: {
      id: 'user-4',
      name: 'Lucas Mendes',
      photoURL: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    tags: ['HTML', 'CSS', 'Pricing'],
    likes: 19,
    views: 103,
    createdAt: new Date('2025-05-26T10:30:00'),
    thumbnailUrl: 'https://via.placeholder.com/300x200/f59e0b/FFFFFF?text=Cards+de+Preços',
  },
];

const CommunityScreen = () => {
  const navigation = useNavigation();
  const { authState } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(communityProjects);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('recent'); // 'recent', 'popular', 'views'
  
  // Simulate loading projects
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  // Handle search
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    filterProjects(query, activeTag);
  };
  
  // Filter projects by search query and tag
  const filterProjects = (query: string, tag: string | null) => {
    let filtered = communityProjects;
    
    // Apply search filter
    if (query.trim() !== '') {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(query.toLowerCase()) || 
        project.description.toLowerCase().includes(query.toLowerCase()) ||
        project.creator.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Apply tag filter
    if (tag) {
      filtered = filtered.filter(project => 
        project.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    }
    
    // Apply sort
    filtered = sortProjects(filtered, sort);
    
    setFilteredProjects(filtered);
  };
  
  // Sort projects
  const sortProjects = (projects: typeof communityProjects, sortBy: string) => {
    const sorted = [...projects];
    
    switch(sortBy) {
      case 'recent':
        return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'popular':
        return sorted.sort((a, b) => b.likes - a.likes);
      case 'views':
        return sorted.sort((a, b) => b.views - a.views);
      default:
        return sorted;
    }
  };
  
  // Change sort method
  const changeSort = (sortBy: string) => {
    setSort(sortBy);
    setFilteredProjects(sortProjects(filteredProjects, sortBy));
  };
  
  // Handle tag selection
  const handleTagPress = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null);
      filterProjects(searchQuery, null);
    } else {
      setActiveTag(tag);
      filterProjects(searchQuery, tag);
    }
  };
  
  // Get all unique tags from projects
  const getAllTags = () => {
    const tags = new Set<string>();
    communityProjects.forEach(project => {
      project.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  };
  
  // Format date to relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} min atrás`;
      }
      return `${diffHours} h atrás`;
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return `${diffDays} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };
  
  // Navigate to project detail
  const navigateToProject = (projectId: string, title: string) => {
    navigation.navigate(
      'ProjectDetail' as never, 
      { id: projectId, title } as never
    );
  };
  
  // Render project card
  const renderProjectCard = ({ item }: { item: typeof communityProjects[0] }) => (
    <Card 
      style={styles.projectCard}
      onPress={() => navigateToProject(item.id, item.title)}
    >
      <Image 
        source={{ uri: item.thumbnailUrl }}
        style={styles.projectThumbnail}
        resizeMode="cover"
      />
      
      <Card.Content>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <Text style={styles.projectDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <Chip 
              key={index}
              style={styles.tagChip}
              textStyle={styles.tagText}
              onPress={() => handleTagPress(tag)}
            >
              {tag}
            </Chip>
          ))}
        </View>
        
        <View style={styles.projectFooter}>
          <View style={styles.creatorContainer}>
            <Avatar.Image 
              size={24} 
              source={{ uri: item.creator.photoURL }}
            />
            <Text style={styles.creatorName}>{item.creator.name}</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="heart" size={16} color="#ef4444" />
              <Text style={styles.statText}>{item.likes}</Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="eye" size={16} color="#6b7280" />
              <Text style={styles.statText}>{item.views}</Text>
            </View>
            
            <Text style={styles.dateText}>
              {formatRelativeTime(item.createdAt)}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
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
        placeholder="Buscar projetos"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {getAllTags().map((tag, index) => (
            <Chip 
              key={index}
              style={[
                styles.filterChip,
                activeTag === tag && styles.activeFilterChip
              ]}
              textStyle={[
                styles.filterChipText,
                activeTag === tag && styles.activeFilterChipText
              ]}
              onPress={() => handleTagPress(tag)}
            >
              {tag}
            </Chip>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Ordenar por:</Text>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sort === 'recent' && styles.activeSortButton
          ]}
          onPress={() => changeSort('recent')}
        >
          <Text style={[
            styles.sortButtonText,
            sort === 'recent' && styles.activeSortButtonText
          ]}>
            Recentes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.sortButton,
            sort === 'popular' && styles.activeSortButton
          ]}
          onPress={() => changeSort('popular')}
        >
          <Text style={[
            styles.sortButtonText,
            sort === 'popular' && styles.activeSortButtonText
          ]}>
            Populares
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.sortButton,
            sort === 'views' && styles.activeSortButton
          ]}
          onPress={() => changeSort('views')}
        >
          <Text style={[
            styles.sortButtonText,
            sort === 'views' && styles.activeSortButtonText
          ]}>
            Mais vistos
          </Text>
        </TouchableOpacity>
      </View>
      
      {filteredProjects.length > 0 ? (
        <FlatList
          data={filteredProjects}
          keyExtractor={(item) => item.id}
          renderItem={renderProjectCard}
          contentContainerStyle={styles.projectsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="magnify-close" size={60} color="#d1d5db" />
          <Text style={styles.emptyText}>
            Nenhum projeto encontrado para sua busca.
          </Text>
          <TouchableOpacity onPress={() => {
            setSearchQuery('');
            setActiveTag(null);
            setFilteredProjects(communityProjects);
          }}>
            <Text style={styles.resetText}>
              Limpar filtros
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Button 
        mode="contained" 
        icon="plus" 
        style={styles.createButton}
        onPress={() => navigation.navigate('Editor' as never)}
      >
        Criar Projeto
      </Button>
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
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: '#f3f4f6',
  },
  activeFilterChip: {
    backgroundColor: '#dbeafe',
  },
  filterChipText: {
    color: '#6b7280',
  },
  activeFilterChipText: {
    color: '#3b82f6',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  sortButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    borderRadius: 4,
  },
  activeSortButton: {
    backgroundColor: '#dbeafe',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeSortButtonText: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  projectsList: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Space for the create button
  },
  projectCard: {
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  projectThumbnail: {
    width: '100%',
    height: 150,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tagChip: {
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: '#e5e7eb',
    height: 24,
  },
  tagText: {
    fontSize: 12,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 8,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorName: {
    fontSize: 14,
    marginLeft: 8,
    color: '#4b5563',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
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
  createButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderRadius: 28,
    elevation: 4,
    backgroundColor: '#3b82f6',
  },
});

export default CommunityScreen;

