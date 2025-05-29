import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ScoreDisplay = ({ correctExercisesCount, totalExercisesAttempted, theme }) => {
  // Calculate the percentage of correct answers
  const percentage = totalExercisesAttempted > 0
    ? Math.round((correctExercisesCount / totalExercisesAttempted) * 100)
    : 0;
  
  // Determine progress color based on percentage
  const getProgressColor = () => {
    if (percentage >= 80) return '#4CAF50'; // Green for good performance
    if (percentage >= 60) return '#FFC107'; // Yellow for medium performance
    return '#F44336'; // Red for needs improvement
  };
  
  // Width of the progress bar - for responsive design
  const { width } = Dimensions.get('window');
  const progressBarWidth = width > 600 ? 200 : width * 0.5;
  
  // Should we display the component?
  const shouldDisplay = totalExercisesAttempted > 0;
  
  if (!shouldDisplay) {
    return null; // Don't render anything if no exercises attempted
  }
  
  return (
    <View style={[
      styles.container,
      theme === 'dark' ? styles.darkContainer : styles.lightContainer
    ]}>
      <View style={styles.scoreSection}>
        {/* Star icon for good performance */}
        {percentage >= 80 && (
          <Ionicons 
            name="star" 
            size={18} 
            color="#FFD700" 
            style={styles.starIcon} 
          />
        )}
        
        {/* Score text */}
        <Text style={[
          styles.scoreText,
          theme === 'dark' ? styles.darkText : styles.lightText
        ]}>
          {correctExercisesCount} de {totalExercisesAttempted} exercícios corretos ({percentage}%)
        </Text>
      </View>
      
      {/* Progress bar */}
      <View style={[styles.progressContainer, { width: progressBarWidth }]}>
        <View 
          style={[
            styles.progressBackground,
            theme === 'dark' ? styles.darkProgressBackground : styles.lightProgressBackground
          ]}
        >
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${percentage}%`,
                backgroundColor: getProgressColor() 
              }
            ]}
          />
        </View>
      </View>
      
      {/* Motivational message based on performance */}
      <Text style={[
        styles.motivationText,
        theme === 'dark' ? styles.darkSubText : styles.lightSubText
      ]}>
        {percentage >= 80 ? 'Excelente trabalho!' : 
         percentage >= 60 ? 'Bom progresso!' : 
         totalExercisesAttempted > 0 ? 'Continue praticando!' : 
         'Tente resolver alguns exercícios!'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  lightContainer: {
    backgroundColor: '#fff',
    borderTopColor: '#e0e0e0',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
    borderTopColor: '#333',
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starIcon: {
    marginRight: 6,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
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
  progressContainer: {
    marginBottom: 8,
  },
  progressBackground: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  lightProgressBackground: {
    backgroundColor: '#e0e0e0',
  },
  darkProgressBackground: {
    backgroundColor: '#333',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  motivationText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default ScoreDisplay;

