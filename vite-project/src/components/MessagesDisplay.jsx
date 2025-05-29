import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Message = ({
  message,
  isLastMessage,
  lastMessageIsExercise,
  hasEvaluatedLastExercise,
  handleExerciseEvaluation,
  handleFeedback,
  theme,
}) => {
  const { sender, text, timestamp, feedback, feedbackShown } = message;
  const isTutor = sender === 'tutor';
  const isExercise = isLastMessage && lastMessageIsExercise && isTutor;
  
  // Function to format the message text
  const formatText = (text) => {
    // Simple formatting - in a real app, you might use a markdown renderer
    // or a more sophisticated formatting system
    return text;
  };

  return (
    <View style={[
      styles.messageContainer,
      isTutor ? styles.tutorMessageContainer : styles.userMessageContainer,
    ]}>
      <View style={[
        styles.messageBubble,
        isTutor 
          ? (theme === 'dark' ? styles.darkTutorBubble : styles.lightTutorBubble) 
          : (theme === 'dark' ? styles.darkUserBubble : styles.lightUserBubble),
        isExercise && styles.exerciseBubble,
      ]}>
        <Text style={[
          styles.messageText,
          theme === 'dark' ? styles.darkText : styles.lightText,
          isExercise && styles.exerciseText,
        ]}>
          {formatText(text)}
        </Text>
        
        <Text style={[
          styles.timestampText,
          theme === 'dark' ? styles.darkTimestamp : styles.lightTimestamp,
        ]}>
          {timestamp}
        </Text>
        
        {/* Feedback options for tutor messages */}
        {isTutor && !feedbackShown && !isExercise && (
          <View style={styles.feedbackContainer}>
            <TouchableOpacity
              style={styles.feedbackButton}
              onPress={() => handleFeedback(message.id, 'like', text)}
            >
              <Ionicons 
                name="thumbs-up-outline" 
                size={16} 
                color={theme === 'dark' ? '#aaa' : '#666'} 
              />
              <Text style={[
                styles.feedbackText,
                theme === 'dark' ? styles.darkSubText : styles.lightSubText,
              ]}>
                Útil
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.feedbackButton}
              onPress={() => handleFeedback(message.id, 'dislike', text)}
            >
              <Ionicons 
                name="thumbs-down-outline" 
                size={16} 
                color={theme === 'dark' ? '#aaa' : '#666'} 
              />
              <Text style={[
                styles.feedbackText,
                theme === 'dark' ? styles.darkSubText : styles.lightSubText,
              ]}>
                Melhorar
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Feedback status after user provides feedback */}
        {isTutor && feedbackShown && (
          <View style={styles.feedbackStatus}>
            <Ionicons 
              name={feedback === 'like' ? 'thumbs-up' : 'thumbs-down'} 
              size={16} 
              color={feedback === 'like' ? '#4CAF50' : '#FF5252'} 
            />
            <Text style={styles.feedbackStatusText}>
              {feedback === 'like' ? 'Feedback positivo enviado' : 'Feedback para melhoria enviado'}
            </Text>
          </View>
        )}
      </View>
      
      {/* Exercise evaluation buttons */}
      {isExercise && !hasEvaluatedLastExercise && (
        <View style={styles.exerciseEvalContainer}>
          <Text style={[
            styles.exerciseQuestion,
            theme === 'dark' ? styles.darkText : styles.lightText,
          ]}>
            A resposta está correta?
          </Text>
          
          <View style={styles.exerciseButtonsContainer}>
            <TouchableOpacity
              style={[styles.exerciseButton, styles.correctButton]}
              onPress={() => handleExerciseEvaluation(true)}
            >
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text style={styles.exerciseButtonText}>Sim, está correto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.exerciseButton, styles.incorrectButton]}
              onPress={() => handleExerciseEvaluation(false)}
            >
              <Ionicons name="close-circle" size={18} color="#fff" />
              <Text style={styles.exerciseButtonText}>Não, está incorreto</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Show feedback after exercise evaluation */}
      {isExercise && hasEvaluatedLastExercise && (
        <View style={styles.exerciseEvalContainer}>
          <Text style={[
            styles.exerciseEvaluated,
            theme === 'dark' ? styles.darkText : styles.lightText,
          ]}>
            Obrigado por avaliar este exercício!
          </Text>
        </View>
      )}
    </View>
  );
};

const MessagesDisplay = ({
  messages,
  isLoading,
  handleFeedback,
  lastMessageIsExercise,
  hasEvaluatedLastExercise,
  handleExerciseEvaluation,
  theme,
}) => {
  const scrollViewRef = useRef();
  
  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isLoading]);
  
  // Get device height for better UX
  const { height } = Dimensions.get('window');
  const emptyStateMinHeight = height * 0.6;

  return (
    <View style={[
      styles.container,
      theme === 'dark' ? styles.darkContainer : styles.lightContainer
    ]}>
      {messages.length === 0 && !isLoading ? (
        // Empty state
        <View style={[styles.emptyContainer, { minHeight: emptyStateMinHeight }]}>
          <Ionicons 
            name="chatbubble-ellipses-outline" 
            size={50}
            color={theme === 'dark' ? '#555' : '#ddd'} 
          />
          <Text style={[
            styles.emptyText,
            theme === 'dark' ? styles.darkText : styles.lightText
          ]}>
            Envie uma mensagem para começar a conversa com o tutor.
          </Text>
        </View>
      ) : (
        // Messages list
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesScrollView}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={true}
        >
          {messages.map((message, index) => (
            <Message
              key={message.id}
              message={message}
              isLastMessage={index === messages.length - 1}
              lastMessageIsExercise={lastMessageIsExercise}
              hasEvaluatedLastExercise={hasEvaluatedLastExercise}
              handleExerciseEvaluation={handleExerciseEvaluation}
              handleFeedback={handleFeedback}
              theme={theme}
            />
          ))}
          
          {/* Loading indicator for new messages */}
          {isLoading && (
            <View style={[
              styles.loadingContainer,
              theme === 'dark' ? styles.darkLoading : styles.lightLoading
            ]}>
              <ActivityIndicator 
                size="small"
                color={theme === 'dark' ? '#fff' : '#4a90e2'} 
              />
              <Text style={[
                styles.loadingText,
                theme === 'dark' ? styles.darkSubText : styles.lightSubText
              ]}>
                O tutor está digitando...
              </Text>
            </View>
          )}
          
          {/* Extra space at the bottom for better UX */}
          <View style={styles.bottomSpace} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  lightContainer: {
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  messagesScrollView: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    maxWidth: '80%',
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
  messageContainer: {
    marginBottom: 16,
    maxWidth: '100%',
  },
  tutorMessageContainer: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  lightTutorBubble: {
    backgroundColor: '#fff',
  },
  darkTutorBubble: {
    backgroundColor: '#2a2a2a',
  },
  lightUserBubble: {
    backgroundColor: '#e3f2fd',
  },
  darkUserBubble: {
    backgroundColor: '#1a3c5a',
  },
  exerciseBubble: {
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 6,
  },
  exerciseText: {
    fontWeight: '500',
  },
  timestampText: {
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  lightTimestamp: {
    color: '#999',
  },
  darkTimestamp: {
    color: '#777',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  lightLoading: {
    backgroundColor: '#fff',
  },
  darkLoading: {
    backgroundColor: '#2a2a2a',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  feedbackContainer: {
    flexDirection: 'row',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  feedbackText: {
    fontSize: 12,
    marginLeft: 4,
  },
  feedbackStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  feedbackStatusText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#777',
  },
  exerciseEvalContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 183, 77, 0.1)',
  },
  exerciseQuestion: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exerciseButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  correctButton: {
    backgroundColor: '#4CAF50',
  },
  incorrectButton: {
    backgroundColor: '#F44336',
  },
  exerciseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  exerciseEvaluated: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomSpace: {
    height: 16,
  },
});

export default MessagesDisplay;

