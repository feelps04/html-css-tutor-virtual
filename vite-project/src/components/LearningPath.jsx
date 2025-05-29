import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LearningPath = ({ learningTopics, onTopicSelect, currentTopic, theme }) => {
  const { width } = useWindowDimensions();
  const isPortrait = width < 768;

  // If no topics are provided, show a placeholder message
  if (!learningTopics || Object.keys(learningTopics).length === 0) {
    return (
      <View style={[
        styles.container, 
        theme === 'dark' ? styles.darkContainer : styles.lightContainer
      ]}>
        <Text style={[
          styles.emptyText,
          theme === 'dark' ? styles.darkText : styles.lightText
        ]}>
          Carregando tópicos de aprendizado...
        </Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      theme === 'dark' ? styles.darkContainer : styles.lightContainer
    ]}>
      <Text style={[
        styles.title,
        theme === 'dark' ? styles.darkText : styles.lightText
      ]}>
        Sua Trilha de Aprendizado
      </Text>
      
      <Text style={[
        styles.subtitle,
        theme === 'dark' ? styles.darkSubText : styles.lightSubText
      ]}>
        Selecione um tópico para começar a aprender
      </Text>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pathContainer}>
          {/* Path line that connects all topics */}
          <View style={[
            styles.pathLine,
            theme === 'dark' ? styles.darkPathLine : styles.lightPathLine
          ]} />
          
          {/* Topic cards arranged along the path */}
          {Object.entries(learningTopics).map(([key, topicInfo], index) => {
            const isActive = currentTopic === key;
            const isOdd = index % 2 !== 0;
            
            return (
              <View 
                key={key} 
                style={[
                  styles.topicWrapper,
                  isPortrait ? styles.topicWrapperPortrait : (isOdd ? styles.topicWrapperRight : styles.topicWrapperLeft)
                ]}
              >
                {/* Circle marker on the path */}
                <View style={[
                  styles.pathMarker,
                  theme === 'dark' ? styles.darkPathMarker : styles.lightPathMarker,
                  isActive && (theme === 'dark' ? styles.activeMarkerDark : styles.activeMarkerLight)
                ]}>
                  {isActive && (
                    <View style={styles.innerMarker} />
                  )}
                </View>
                
                {/* Topic card */}
                <TouchableOpacity
                  style={[
                    styles.topicCard,
                    theme === 'dark' ? styles.darkTopicCard : styles.lightTopicCard,
                    isActive && (theme === 'dark' ? styles.activeCardDark : styles.activeCardLight)
                  ]}
                  onPress={() => onTopicSelect(key)}
                  activeOpacity={0.8}
                >
                  <View style={styles.topicHeader}>
                    <Text style={[
                      styles.topicTitle,
                      theme === 'dark' ? styles.darkText : styles.lightText,
                      isActive && styles.activeText
                    ]}>
                      {topicInfo.name}
                    </Text>
                    
                    {isActive && (
                      <View style={styles.currentIndicator}>
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                      </View>
                    )}
                  </View>
                  
                  <Text style={[
                    styles.topicDescription,
                    theme === 'dark' ? styles.darkSubText : styles.lightSubText
                  ]}>
                    {topicInfo.description || 'Aprenda os conceitos básicos deste tópico.'}
                  </Text>
                  
                  {isActive && (
                    <Text style={styles.currentTopicText}>Tópico Atual</Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  lightContainer: {
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  lightText: {
    color: '#333',
  },
  darkText: {
    color: '#f0f0f0',
  },
  lightSubText: {
    color: '#666',
  },
  darkSubText: {
    color: '#aaa',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  pathContainer: {
    position: 'relative',
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  pathLine: {
    position: 'absolute',
    width: 4,
    height: '100%',
    left: '50%',
    marginLeft: -2,
    zIndex: 1,
  },
  lightPathLine: {
    backgroundColor: '#4a90e2',
  },
  darkPathLine: {
    backgroundColor: '#5a9ff2',
  },
  pathMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  lightPathMarker: {
    backgroundColor: '#fff',
    borderColor: '#4a90e2',
  },
  darkPathMarker: {
    backgroundColor: '#333',
    borderColor: '#5a9ff2',
  },
  activeMarkerLight: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: '#2e7d32',
    backgroundColor: '#fff',
  },
  activeMarkerDark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: '#4CAF50',
    backgroundColor: '#333',
  },
  innerMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  topicWrapper: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 30,
    alignItems: 'center',
  },
  topicWrapperPortrait: {
    paddingLeft: 40,
  },
  topicWrapperLeft: {
    justifyContent: 'flex-end',
    paddingRight: '55%',
  },
  topicWrapperRight: {
    justifyContent: 'flex-start',
    paddingLeft: '55%',
  },
  topicCard: {
    borderRadius: 12,
    padding: 16,
    marginLeft: 16,
    flex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lightTopicCard: {
    backgroundColor: '#fff',
  },
  darkTopicCard: {
    backgroundColor: '#2a2a2a',
  },
  activeCardLight: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  activeCardDark: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  activeText: {
    color: '#4CAF50',
  },
  topicDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  currentIndicator: {
    marginLeft: 8,
  },
  currentTopicText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'right',
  },
});

export default LearningPath;

