import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Alert,
  Animated,
  useColorScheme
} from 'react-native';

// Lazy loading equivalents for React Native
// Instead of using React.lazy, we'll use direct imports for simplicity in React Native
import Home from './components/Home';
import ChatHeader from './components/ChatHeader';
import MessagesDisplay from './components/MessagesDisplay';
import MessageInput from './components/MessageInput';
import ScoreDisplay from './components/ScoreDisplay';
import LearningPath from './components/LearningPath';

// Loading component
const Loading = ({ message = "Carregando..." }) => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#4a90e2" />
    <Text style={styles.loadingText}>{message}</Text>
  </View>
);

// Hook to detect screen dimensions (similar to useWindowSize in web)
function useWindowDimensions() {
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    isMobile: true, // Always true in React Native
  });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        isMobile: true,
      });
    };

    // Handle dimension changes (e.g., rotation)
    const subscription = Dimensions.addEventListener('change', updateDimensions);

    return () => {
      // Cleanup
      subscription.remove();
    };
  }, []);

  return dimensions;
}

function App() {
  // Get system color scheme
  const systemColorScheme = useColorScheme();
  
  // State similar to web app
  const { width, height, isMobile } = useWindowDimensions();
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('html_intro');
  const [currentMode, setCurrentMode] = useState('iniciante');
  const [theme, setTheme] = useState(() => {
    // Use system theme as default
    return systemColorScheme || 'light';
  });
  const [learningTopics, setLearningTopics] = useState({});
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [correctExercisesCount, setCorrectExercisesCount] = useState(0);
  const [totalExercisesAttempted, setTotalExercisesAttempted] = useState(0);
  const [lastMessageIsExercise, setLastMessageIsExercise] = useState(false);
  const [hasEvaluatedLastExercise, setHasEvaluatedLastExercise] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);

  // Function to generate suggested questions based on topic and mode
  const generateSuggestedQuestions = useCallback((topicKey, mode) => {
    const questions = [];
    const topicName = learningTopics[topicKey]?.name || 'este tópico';

    if (mode === 'iniciante') {
      questions.push(`O que é ${topicName}?`);
      questions.push(`Quais os conceitos básicos de ${topicName}?`);
      questions.push(`Poderia dar um exemplo simples de ${topicName}?`);
    } else if (mode === 'intermediario') {
      questions.push(`Como posso aplicar ${topicName} em um projeto real?`);
      questions.push(`Quais são as melhores práticas para ${topicName}?`);
      questions.push(`Existe algum problema comum ao usar ${topicName} e como resolvê-lo?`);
    } else if (mode === 'avancado') {
      questions.push(`Explique as nuances avançadas de ${topicName}.`);
      questions.push(`Quais são os casos de uso complexos para ${topicName}?`);
      questions.push(`Compare ${topicName} com tecnologias alternativas.`);
    }

    // Add general questions regardless of mode/topic
    questions.push("Poderia me dar um exercício sobre o tema atual?");
    questions.push("Quais os próximos passos na trilha de aprendizado?");

    return questions;
  }, [learningTopics]);

  // Effect to load learning topics
  useEffect(() => {
    const fetchLearningTopics = async () => {
      try {
        setIsLoading(true);
        // In React Native, you would typically use a base URL or full URL for API calls
        const response = await fetch('http://your-api-server.com/api/get-learning-topics');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLearningTopics(data);
      } catch (error) {
        console.error("Failed to fetch learning topics:", error);
        Alert.alert(
          "Erro",
          "Falha ao buscar tópicos de aprendizado. Verifique sua conexão."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningTopics();
  }, []);

  // Effect to generate suggested questions when topic or mode changes
  useEffect(() => {
    if (Object.keys(learningTopics).length > 0) {
      setSuggestedQuestions(generateSuggestedQuestions(currentTopic, currentMode));
    }
  }, [currentTopic, currentMode, generateSuggestedQuestions, learningTopics]);

  // Handle starting journey
  const handleStartJourney = async (name, email) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://your-api-server.com/api/start-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: name, userEmail: email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      setCurrentTopic(data.currentTopic);
      setCurrentMode(data.currentMode);
      setUserName(name);
      setUserEmail(email);
      setShowLearningPath(true); // Show learning path after login
      setMessages([]); // Clear messages for new session
      setCorrectExercisesCount(0);
      setTotalExercisesAttempted(0);
      setLastMessageIsExercise(false);
      setHasEvaluatedLastExercise(false);
    } catch (error) {
      console.error("Error starting session:", error);
      Alert.alert(
        "Erro",
        "Falha ao iniciar a sessão. Por favor, tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to send user message to tutor
  const sendUserMessageToTutor = async (messageText) => {
    if (!messageText.trim() || !sessionId || isLoading) return;

    const newMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage('');
    setIsLoading(true);
    setLastMessageIsExercise(false);
    setHasEvaluatedLastExercise(false);

    try {
      const response = await fetch('http://your-api-server.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText,
          sessionId: sessionId,
          currentTopic: currentTopic,
          currentMode: currentMode,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const tutorResponse = {
        id: messages.length + 2,
        text: data.response,
        sender: 'tutor',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, tutorResponse]);
      setLastMessageIsExercise(data.isExercise);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: messages.length + 2,
          text: "Desculpe, não consegui processar sua solicitação no momento. Tente novamente mais tarde.",
          sender: 'tutor',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle send message
  const handleSendMessage = () => {
    sendUserMessageToTutor(inputMessage);
  };

  // Handle topic change
  const handleTopicChange = (newTopic) => {
    setCurrentTopic(newTopic);
    const initialMessage = `Estou a começar o tópico: ${learningTopics[newTopic]?.name}.`;
    sendUserMessageToTutor(initialMessage);
  };

  // Handle mode change
  const handleModeChange = (newMode) => {
    setCurrentMode(newMode);
    const initialMessage = `Mudei para o modo ${newMode}.`;
    sendUserMessageToTutor(initialMessage);
  };

  // Handle feedback
  const handleFeedback = async (messageId, feedbackType, messageText) => {
    try {
      const response = await fetch('http://your-api-server.com/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messageId, feedbackType, messageText, sessionId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "success") {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, feedback: feedbackType, feedbackShown: true } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      Alert.alert(
        "Erro",
        "Falha ao enviar feedback. Por favor, tente novamente."
      );
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Handle back to path
  const handleBackToPath = () => {
    setShowLearningPath(true);
  };

  // Handle topic select
  const handleTopicSelect = (topicKey) => {
    setCurrentTopic(topicKey);
    setShowLearningPath(false);
    setMessages([]);
    setLastMessageIsExercise(false);
    setHasEvaluatedLastExercise(false);

    const topicName = learningTopics[topicKey]?.name || topicKey;
    const suggested = generateSuggestedQuestions(topicKey, currentMode);
    if (suggested.length > 0) {
      sendUserMessageToTutor(suggested[0]);
    } else {
      sendUserMessageToTutor(`Olá! Estou pronto para aprender sobre "${topicName}".`);
    }
  };

  // Handle exercise evaluation
  const handleExerciseEvaluation = async (isCorrect) => {
    setHasEvaluatedLastExercise(true);

    try {
      const response = await fetch('http://your-api-server.com/api/exercise-evaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId, isCorrect }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCorrectExercisesCount(data.scores.correct);
      setTotalExercisesAttempted(data.scores.total);
    } catch (error) {
      console.error("Error evaluating exercise:", error);
      Alert.alert(
        "Erro",
        "Falha ao avaliar exercício. Por favor, tente novamente."
      );
    }
  };

  // Handle suggested question click
  const handleSuggestedQuestionClick = (question) => {
    sendUserMessageToTutor(question);
  };

  // If there's no sessionId and userName, show the initial screen (Home)
  if (!sessionId && !userName) {
    return (
      <SafeAreaView style={[
        styles.container, 
        theme === 'dark' ? styles.darkContainer : styles.lightContainer
      ]}>
        <StatusBar 
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
          backgroundColor={theme === 'dark' ? '#121212' : '#ffffff'} 
        />
        {isLoading ? (
          <Loading message="Preparando sua jornada de aprendizado..." />
        ) : (
          <Home onStartJourney={handleStartJourney} theme={theme} toggleTheme={toggleTheme} />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[
      styles.container, 
      theme === 'dark' ? styles.darkContainer : styles.lightContainer
    ]}>
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={theme === 'dark' ? '#121212' : '#ffffff'} 
      />
      
      {showLearningPath ? (
        isLoading ? (
          <Loading message="Carregando trilha de aprendizado..." />
        ) : (
          <LearningPath
            learningTopics={learningTopics}
            onTopicSelect={handleTopicSelect}
            currentTopic={currentTopic}
            theme={theme}
          />
        )
      ) : (
        <View style={styles.chatContainer}>
          <ChatHeader
            currentTopic={currentTopic}
            learningTopics={learningTopics}
            handleTopicChange={handleTopicChange}
            currentMode={currentMode}
            handleModeChange={handleModeChange}
            theme={theme}
            toggleTheme={toggleTheme}
            onBackToPath={handleBackToPath}
            isLoading={isLoading}
          />
          
          <MessagesDisplay
            messages={messages}
            isLoading={isLoading}
            handleFeedback={handleFeedback}
            lastMessageIsExercise={lastMessageIsExercise}
            hasEvaluatedLastExercise={hasEvaluatedLastExercise}
            handleExerciseEvaluation={handleExerciseEvaluation}
            theme={theme}
          />
          
          <MessageInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            suggestedQuestions={suggestedQuestions}
            onSuggestedQuestionClick={handleSuggestedQuestionClick}
            theme={theme}
          />
          
          <ScoreDisplay
            correctExercisesCount={correctExercisesCount}
            totalExercisesAttempted={totalExercisesAttempted}
            theme={theme}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    width: '100%',
  },
});

export default App;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Image,
  Dimensions,
} from 'react-native-web';

// Get device dimensions for responsive design
const windowWidth = Dimensions.get('window').width;

const App = () => {
  // State for fitness tracking
  const [steps, setSteps] = useState(0);
  const [water, setWater] = useState(0);
  const [calories, setCalories] = useState(0);
  const [exercise, setExercise] = useState('');
  const [exercises, setExercises] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Animation values
  const progressAnim = useState(new Animated.Value(0))[0];
  const dailyGoal = 10000; // Steps goal

  // Update progress animation when steps change
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: steps / dailyGoal,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [steps]);

  // Calculate progress width based on animation value
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  // Function to add a new exercise
  const addExercise = () => {
    if (exercise.trim()) {
      setExercises([...exercises, { id: Date.now(), name: exercise, completed: false }]);
      setExercise('');
      // Add some calories for each exercise added
      setCalories(calories + Math.floor(Math.random() * 100) + 50);
    }
  };

  // Function to toggle exercise completion
  const toggleExercise = (id) => {
    setExercises(
      exercises.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Function to remove an exercise
  const removeExercise = (id) => {
    setExercises(exercises.filter(item => item.id !== id));
  };

  // Render the dashboard tab
  const renderDashboard = () => (
    <View style={styles.dashboardContainer}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{steps.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Steps</Text>
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                { width: progressWidth }
              ]}
            />
          </View>
          <Text style={styles.goalText}>{Math.round((steps / dailyGoal) * 100)}% of daily goal</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{water}</Text>
          <Text style={styles.statLabel}>Glasses of Water</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.decrementButton]}
              onPress={() => setWater(Math.max(0, water - 1))}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.incrementButton]}
              onPress={() => setWater(water + 1)}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{calories}</Text>
          <Text style={styles.statLabel}>Calories Burned</Text>
          <TouchableOpacity
            style={[styles.fullWidthButton, styles.addStepsButton]}
            onPress={() => setSteps(steps + 1000)}
          >
            <Text style={styles.fullWidthButtonText}>Add 1000 Steps (+50 calories)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{exercises.length}</Text>
          <Text style={styles.statLabel}>Workouts Planned</Text>
          <Text style={styles.completedText}>
            {exercises.filter(ex => ex.completed).length} completed
          </Text>
        </View>
      </View>

      <View style={styles.motivationCard}>
        <Text style={styles.motivationText}>
          "The only bad workout is the one that didn't happen."
        </Text>
      </View>
    </View>
  );

  // Render the exercises tab
  const renderExercises = () => (
    <View style={styles.exercisesContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new exercise..."
          value={exercise}
          onChangeText={setExercise}
          onSubmitEditing={addExercise}
        />
        <TouchableOpacity style={styles.addButton} onPress={addExercise}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.exercisesList}>
        {exercises.length === 0 ? (
          <Text style={styles.emptyText}>No exercises yet. Add one to get started!</Text>
        ) : (
          exercises.map(item => (
            <View key={item.id} style={styles.exerciseItem}>
              <TouchableOpacity
                style={[styles.checkbox, item.completed && styles.checkboxChecked]}
                onPress={() => toggleExercise(item.id)}
              >
                {item.completed && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text
                style={[
                  styles.exerciseName,
                  item.completed && styles.exerciseCompleted
                ]}
              >
                {item.name}
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeExercise(item.id)}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FitTrack</Text>
        <Text style={styles.headerSubtitle}>Your Personal Fitness Companion</Text>
      </View>

      <View style={styles.content}>
        {activeTab === 'dashboard' ? renderDashboard() : renderExercises()}
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText]}>
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'exercises' && styles.activeTab]}
          onPress={() => setActiveTab('exercises')}
        >
          <Text style={[styles.tabText, activeTab === 'exercises' && styles.activeTabText]}>
            Exercises
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles using React Native StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#4a90e2',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  dashboardContainer: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: windowWidth > 600 ? 'row' : 'column',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flex: 1,
    marginHorizontal: windowWidth > 600 ? 5 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4a90e2',
  },
  goalText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decrementButton: {
    backgroundColor: '#ff6b6b',
  },
  incrementButton: {
    backgroundColor: '#4a90e2',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  fullWidthButton: {
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  addStepsButton: {
    backgroundColor: '#4CAF50',
  },
  fullWidthButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  completedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 5,
  },
  motivationCard: {
    backgroundColor: '#4a90e2',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  exercisesContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    width: 80,
    height: 45,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exercisesList: {
    flex: 1,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4a90e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#4a90e2',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  exerciseName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  exerciseCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 30,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  activeTab: {
    borderTopWidth: 3,
    borderTopColor: '#4a90e2',
  },
  tabText: {
    fontSize: 14,
    color: '#888',
  },
  activeTabText: {
    color: '#4a90e2',
    fontWeight: 'bold',
  },
});

export default App;

