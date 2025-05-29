import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { Text, Surface, Button, Divider, ActivityIndicator, Chip, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../contexts/AuthContext';

type ParamList = {
  ProjectDetail: {
    id: string;
    title: string;
  };
};

// Placeholder project data
const projectData = {
  id: 'project-1',
  title: 'Navbar Responsiva',
  description: 'Uma navbar que se adapta a diferentes tamanhos de tela usando apenas HTML e CSS, sem precisar de JavaScript. Este exemplo usa flexbox para organização e media queries para ajustar a exibição em diferentes dispositivos.',
  creator: {
    id: 'user-1',
    name: 'Marina Silva',
    photoURL: 'https://randomuser.me/api/portraits/women/32.jpg',
  },
  tags: ['HTML', 'CSS', 'Responsivo'],
  likes: 28,
  views: 156,
  createdAt: new Date('2025-05-20T14:30:00'),
  updatedAt: new Date('2025-05-21T09:15:00'),
  thumbnailUrl: 'https://via.placeholder.com/600x300/3b82f6/FFFFFF?text=Navbar+Responsiva',
  htmlCode: `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Navbar Responsiva</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <nav class="navbar">
    <div class="logo">
      <a href="#">LogoMarca</a>
    </div>
    <ul class="nav-links">
      <li><a href="#">Início</a></li>
      <li><a href="#">Sobre</a></li>
      <li><a href="#">Serviços</a></li>
      <li><a href="#">Portfólio</a></li>
      <li><a href="#">Contato</a></li>
    </ul>
    <div class="burger">
      <div class="line1"></div>
      <div class="line2"></div>
      <div class="line3"></div>
    </div>
  </nav>
  <div class="content">
    <h1>Navbar Responsiva</h1>
    <p>Redimensione a janela para ver a navbar se adaptar.</p>
  </div>
</body>
</html>`,
  cssCode: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
}

.navbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-height: 8vh;
  background-color: #3b82f6;
  color: white;
}

.logo {
  font-size: 20px;
  letter-spacing: 3px;
}

.logo a {
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  justify-content: space-around;
  width: 50%;
}

.nav-links li {
  list-style: none;
}

.nav-links a {
  color: white;
  text-decoration: none;
  letter-spacing: 1px;
  font-weight: bold;
  font-size: 14px;
}

.burger {
  display: none;
  cursor: pointer;
}

.burger div {
  width: 25px;
  height: 3px;
  background-color: white;
  margin: 5px;
  transition: all 0.3s ease;
}

.content {
  padding: 20px;
  text-align: center;
}

@media screen and (max-width: 768px) {
  body {
    overflow-x: hidden;
  }
  .nav-links {
    position: absolute;
    right: 0px;
    height: 92vh;
    top: 8vh;
    background-color: #3b82f6;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
    transform: translateX(100%);
    transition: transform 0.5s ease-in;
    z-index: 1;
  }
  .nav-links li {
    opacity: 0;
  }
  .burger {
    display: block;
  }
}

.nav-active {
  transform: translateX(0%);
}

@keyframes navLinkFade {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
}`,
  jsCode: `// JavaScript para toggle do menu móvel
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links li');
  
  burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('nav-active');
    
    // Animate Links
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = '';
      } else {
        link.style.animation = \`navLinkFade 0.5s ease forwards \${index / 7 + 0.3}s\`;
      }
    });
    
    // Burger Animation
    burger.classList.toggle('toggle');
  });
});`,
  comments: [
    {
      id: 'comment-1',
      user: {
        id: 'user-2',
        name: 'Pedro Alves',
        photoURL: 'https://randomuser.me/api/portraits/men/45.jpg',
      },
      text: 'Muito legal! Adorei como você implementou a animação do menu mobile.',
      createdAt: new Date('2025-05-22T15:30:00'),
    },
    {
      id: 'comment-2',
      user: {
        id: 'user-3',
        name: 'Ana Costa',
        photoURL: 'https://randomuser.me/api/portraits/women/68.jpg',
      },
      text: 'Funciona perfeitamente no meu celular. Vou usar como referência para o meu projeto.',
      createdAt: new Date('2025-05-23T10:15:00'),
    }
  ]
};

const ProjectDetailScreen = () => {
  const route = useRoute<RouteProp<ParamList, 'ProjectDetail'>>();
  const navigation = useNavigation();
  const { authState } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(projectData.likes);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(projectData.comments);
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'css' | 'js'>('preview');
  const webViewRef = useRef<WebView>(null);
  
  // Simulate loading project data
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  // Generate preview HTML
  const generatePreviewHtml = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${projectData.cssCode}</style>
      </head>
      <body>
        ${projectData.htmlCode.replace(/<!DOCTYPE html>|<html>.*<\/head>/s, '')}
        <script>${projectData.jsCode}</script>
      </body>
      </html>
    `;
  };
  
  // Handle like button press
  const handleLike = () => {
    if (liked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setLiked(!liked);
  };
  
  // Handle comment submission
  const handleComment = () => {
    if (!commentText.trim()) return;
    
    const newComment = {
      id: `comment-${comments.length + 1}`,
      user: {
        id: authState.user?.uid || 'user-temp',
        name: authState.profile?.displayName || 'Usuário',
        photoURL: authState.profile?.photoURL || 'https://via.placeholder.com/100',
      },
      text: commentText,
      createdAt: new Date(),
    };
    
    setComments([...comments, newComment]);
    setCommentText('');
  };
  
  // Handle tab change
  const handleTabChange = (tab: 'preview' | 'html' | 'css' | 'js') => {
    setActiveTab(tab);
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
  
  // Open project in editor
  const openInEditor = async () => {
    try {
      // In a real app, we would save the project to AsyncStorage
      // and then navigate to the editor
      navigation.navigate('Editor' as never);
    } catch (error) {
      console.error('Error opening project in editor:', error);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      {/* Project Header */}
      <Image 
        source={{ uri: projectData.thumbnailUrl }}
        style={styles.projectImage}
        resizeMode="cover"
      />
      
      <View style={styles.projectHeader}>
        <Text style={styles.projectTitle}>{projectData.title}</Text>
        
        <View style={styles.creatorContainer}>
          <Avatar.Image 
            size={36} 
            source={{ uri: projectData.creator.photoURL }}
          />
          <View style={styles.creatorInfo}>
            <Text style={styles.creatorName}>{projectData.creator.name}</Text>
            <Text style={styles.dateText}>
              Atualizado {formatRelativeTime(projectData.updatedAt)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.projectDescription}>
          {projectData.description}
        </Text>
        
        <View style={styles.tagsContainer}>
          {projectData.tags.map((tag, index) => (
            <Chip 
              key={index}
              style={styles.tagChip}
              textStyle={styles.tagText}
            >
              {tag}
            </Chip>
          ))}
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="eye" size={20} color="#6b7280" />
            <Text style={styles.statText}>{projectData.views} visualizações</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={handleLike}
          >
            <MaterialCommunityIcons 
              name={liked ? "heart" : "heart-outline"} 
              size={20} 
              color={liked ? "#ef4444" : "#6b7280"} 
            />
            <Text style={[styles.statText, liked && styles.likedText]}>
              {likes} curtidas
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Divider style={styles.divider} />
      
      {/* Code Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'preview' && styles.activeTabButton
          ]}
          onPress={() => handleTabChange('preview')}
        >
          <MaterialCommunityIcons 
            name="eye" 
            size={20} 
            color={activeTab === 'preview' ? "#3b82f6" : "#6b7280"} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'preview' && styles.activeTabText
          ]}>
            Preview
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'html' && styles.activeTabButton
          ]}
          onPress={() => handleTabChange('html')}
        >
          <MaterialCommunityIcons 
            name="language-html5" 
            size={20} 
            color={activeTab === 'html' ? "#e34c26" : "#6b7280"} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'html' && { color: '#e34c26' }
          ]}>
            HTML
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'css' && styles.activeTabButton
          ]}
          onPress={() => handleTabChange('css')}
        >
          <MaterialCommunityIcons 
            name="language-css3" 
            size={20} 
            color={activeTab === 'css' ? "#264de4" : "#6b7280"} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'css' && { color: '#264de4' }
          ]}>
            CSS
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'js' && styles.activeTabButton
          ]}
          onPress={() => handleTabChange('js')}
        >
          <MaterialCommunityIcons 
            name="language-javascript" 
            size={20} 
            color={activeTab === 'js' ? "#f7df1e" : "#6b7280"} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'js' && { color: '#f0db4f' }
          ]}>
            JS
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Code Preview */}
      <View style={styles.codeContainer}>
        {activeTab === 'preview' ? (
          <View style={styles.previewContainer}>
            <WebView
              ref={webViewRef}
              source={{ html: generatePreviewHtml() }}
              style={styles.webView}
              originWhitelist={['*']}
            />
          </View>
        ) : (
          <ScrollView 
            style={styles.codeScrollView}
            horizontal={false}
          >
            <View style={styles.codeContent}>
              <Text style={styles.codeText}>
                {activeTab === 'html' 
                  ? projectData.htmlCode 
                  : activeTab === 'css' 
                  ? projectData.cssCode 
                  : projectData.jsCode}
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
      
      <Button 
        mode="contained" 
        icon="code-tags" 
        style={styles.editorButton}
        onPress={openInEditor}
      >
        Abrir no Editor
      </Button>
      
      <Divider style={styles.divider} />
      
      {/* Comments Section */}
      <View style={styles.commentsSection}>
        <Text style={styles.sectionTitle}>Comentários ({comments.length})</Text>
        
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Adicione um comentário..."
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <Button 
            mode="contained" 
            onPress={handleComment}
            disabled={!commentText.trim()}
            style={styles.commentButton}
          >
            Enviar
          </Button>
        </View>
        
        {comments.length > 0 ? (
          comments.map(comment => (
            <View key={comment.id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <Avatar.Image 
                  size={36} 
                  source={{ uri: comment.user.photoURL }}
                />
                <View style={styles.commentInfo}>
                  <Text style={styles.commentAuthor}>{comment.user.name}</Text>
                  <Text style={styles.commentDate}>
                    {formatRelativeTime(comment.createdAt)}
                  </Text>
                </View>
              </View>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noCommentsText}>
            Seja o primeiro a comentar neste projeto!
          </Text>
        )}
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
  projectImage: {
    width: '100%',
    height: 200,
  },
  projectHeader: {
    padding: 16,
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  creatorInfo: {
    marginLeft: 12,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#6b7280',
  },
  projectDescription: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tagChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#e5e7eb',
  },
  tagText: {
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likedText: {
    color: '#ef4444',
  },
  divider: {
    marginVertical: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  activeTabButton: {
    backgroundColor: '#eff6ff',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  codeContainer: {
    marginHorizontal: 16,
    height: 300,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  webView: {
    flex: 1,
  },
  codeScrollView: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  codeContent: {
    padding: 16,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#e2e8f0',
  },
  editorButton: {
    marginHorizontal: 16,
    backgroundColor: '#3b82f6',
  },
  commentsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    backgroundColor: 'white',
    minHeight: 40,
  },
  commentButton: {
    backgroundColor: '#3b82f6',
  },
  noCommentsText: {
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 16,
  },
  commentItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  commentHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  commentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  commentAuthor: {
    fontWeight: '500',
  },
  commentDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});

export default ProjectDetailScreen;

