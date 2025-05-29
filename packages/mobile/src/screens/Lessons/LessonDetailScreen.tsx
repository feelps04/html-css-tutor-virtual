import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Divider, Card, ActivityIndicator, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../contexts/AuthContext';

// Markdown rendering dependencies would be imported here
// We're using a WebView-based solution for simplicity in this example

type ParamList = {
  LessonDetail: {
    id: string;
    title: string;
  };
};

// Placeholder lesson content with markdown and code examples
const lessonContent = `
# Introdução ao HTML

HTML (HyperText Markup Language) é a linguagem padrão para criar páginas web. Ela descreve a estrutura de uma página web usando elementos chamados **tags**.

## Estrutura básica

Todo documento HTML começa com a declaração do tipo de documento (doctype) e possui uma estrutura básica:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>Título da página</title>
  <meta charset="UTF-8">
</head>
<body>
  <!-- Conteúdo da página vai aqui -->
  <h1>Olá Mundo!</h1>
  <p>Este é um parágrafo.</p>
</body>
</html>
\`\`\`

## Elementos principais

Os elementos HTML são representados por tags. As tags mais comuns são:

- **Títulos**: \`<h1>\` até \`<h6>\`
- **Parágrafos**: \`<p>\`
- **Links**: \`<a>\`
- **Imagens**: \`<img>\`
- **Listas**: \`<ul>\`, \`<ol>\`, \`<li>\`

## Exemplo prático

Veja como criar uma página simples:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>Minha primeira página</title>
</head>
<body>
  <h1>Bem-vindo ao HTML</h1>
  <p>Este é um <strong>exemplo</strong> de HTML.</p>
  <p>Visite o <a href="https://www.w3schools.com">W3Schools</a> para aprender mais.</p>
  
  <h2>Lista de Conceitos</h2>
  <ul>
    <li>Tags</li>
    <li>Elementos</li>
    <li>Atributos</li>
  </ul>
</body>
</html>
\`\`\`

## Exercício

Tente criar uma página HTML simples com um título, um parágrafo e uma lista de itens.
`;

// Convert markdown to HTML
const convertMarkdownToHtml = (markdown: string) => {
  // In a real app, we would use a proper markdown parser
  // This is a simplified version for demonstration
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
          padding: 16px;
          color: #333;
        }
        pre {
          background-color: #f5f5f5;
          padding: 16px;
          border-radius: 4px;
          overflow-x: auto;
        }
        code {
          font-family: 'Courier New', monospace;
        }
        h1, h2, h3 {
          color: #2563eb;
        }
        a {
          color: #3b82f6;
          text-decoration: none;
        }
        ul, ol {
          padding-left: 20px;
        }
        img {
          max-width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body>
      ${markdown
        .replace(/# (.*?)\n/g, '<h1>$1</h1>')
        .replace(/## (.*?)\n/g, '<h2>$1</h2>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\`(.*?)\`/g, '<code>$1</code>')
        .replace(/\n- (.*)/g, '<ul><li>$1</li></ul>')
        .replace(/<\/ul><ul>/g, '')
        .replace(/\`\`\`html\n([\s\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>')}
    </body>
    </html>
  `;
  
  return html;
};

const LessonDetailScreen = () => {
  const route = useRoute<RouteProp<ParamList, 'LessonDetail'>>();
  const navigation = useNavigation();
  const { authState } = useAuthContext();
  const webViewRef = useRef<WebView>(null);
  
  const [loading, setLoading] = useState(true);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [showExercise, setShowExercise] = useState(false);
  
  // Simulate loading lesson content
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      
      // Check if lesson is already completed
      const completedLessons = authState.profile?.completedLessons || [];
      if (completedLessons.includes(route.params.id)) {
        setLessonCompleted(true);
        setLessonProgress(1);
      } else {
        // Start with some progress
        setLessonProgress(0.15);
      }
    }, 1000);
    
    // Simulate progress as user scrolls
    const progressInterval = setInterval(() => {
      if (!lessonCompleted) {
        setLessonProgress(prev => {
          const newProgress = prev + 0.05;
          return newProgress > 0.9 ? 0.9 : newProgress;
        });
      }
    }, 5000);
    
    return () => clearInterval(progressInterval);
  }, [lessonCompleted]);
  
  // Mark lesson as completed
  const markAsCompleted = () => {
    setLessonCompleted(true);
    setLessonProgress(1);
    
    // In a real app, we would update the user's progress in the backend
    // authActions.updateProgress(route.params.id, 'completed');
  };
  
  // Handle next lesson
  const goToNextLesson = () => {
    // In a real app, we would navigate to the next lesson
    // For now, just go back to the lessons list
    navigation.goBack();
  };
  
  // Toggle exercise view
  const toggleExercise = () => {
    setShowExercise(!showExercise);
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
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ProgressBar 
          progress={lessonProgress} 
          color={lessonCompleted ? '#10b981' : '#3b82f6'} 
          style={styles.progressBar}
        />
        <Text style={styles.progressText}>
          {Math.round(lessonProgress * 100)}% concluído
        </Text>
      </View>
      
      {/* Lesson Content */}
      {showExercise ? (
        <View style={styles.exerciseContainer}>
          <Card style={styles.exerciseCard}>
            <Card.Content>
              <Text style={styles.exerciseTitle}>Exercício Prático</Text>
              <Text style={styles.exerciseDescription}>
                Crie uma página HTML simples com um título, um parágrafo e uma lista de itens.
              </Text>
              
              <View style={styles.codePreview}>
                <Text style={styles.codePreviewText}>
                  {`<!DOCTYPE html>\n<html>\n<head>\n  <title>Minha Página</title>\n</head>\n<body>\n  <!-- Seu código aqui -->\n  \n</body>\n</html>`}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.editorButton}
                onPress={() => navigation.navigate('Editor' as never)}
              >
                <MaterialCommunityIcons name="code-tags" size={20} color="#fff" />
                <Text style={styles.editorButtonText}>Abrir no Editor</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
          
          <Button 
            mode="outlined" 
            onPress={toggleExercise}
            style={styles.backButton}
          >
            Voltar para a lição
          </Button>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ html: convertMarkdownToHtml(lessonContent) }}
          style={styles.webView}
          onNavigationStateChange={(event) => {
            // Handle link clicks here
            if (event.url !== 'about:blank') {
              // Open external links in browser
            }
          }}
        />
      )}
      
      {/* Bottom Actions */}
      <View style={styles.actionsContainer}>
        {lessonCompleted ? (
          <Button 
            mode="contained" 
            onPress={goToNextLesson}
            style={styles.completeButton}
            icon="arrow-right"
          >
            Próxima Lição
          </Button>
        ) : (
          <View style={styles.actionButtons}>
            <Button 
              mode="outlined" 
              onPress={toggleExercise}
              style={[styles.actionButton, styles.exerciseButton]}
              icon="code-brackets"
            >
              Ver Exercício
            </Button>
            
            <Button 
              mode="contained" 
              onPress={markAsCompleted}
              style={[styles.actionButton, styles.completeButton]}
              icon="check"
            >
              Marcar como Concluída
            </Button>
          </View>
        )}
      </View>
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
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'right',
  },
  webView: {
    flex: 1,
  },
  actionsContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
  },
  exerciseButton: {
    marginRight: 8,
  },
  completeButton: {
    backgroundColor: '#3b82f6',
  },
  exerciseContainer: {
    flex: 1,
    padding: 16,
  },
  exerciseCard: {
    marginBottom: 16,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  codePreview: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 4,
    marginBottom: 16,
  },
  codePreviewText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#1f2937',
  },
  editorButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 4,
  },
  editorButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  backButton: {
    marginTop: 8,
  },
});

export default LessonDetailScreen;

