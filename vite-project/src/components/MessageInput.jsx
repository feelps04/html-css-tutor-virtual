import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MessageInput = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  suggestedQuestions,
  onSuggestedQuestionClick,
  theme,
}) => {
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const inputRef = useRef(null);
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 380;

  // Handle send message
  const onSend = () => {
    if (inputMessage.trim() === '' || isLoading) return;
    handleSendMessage();
    setIsSuggestionsOpen(false);
  };

  // Handle suggestion click
  const handleSuggestionClick = (question) => {
    onSuggestedQuestionClick(question);
    setIsSuggestionsOpen(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  // Toggle suggestions visibility
  const toggleSuggestions = () => {
    setIsSuggestionsOpen(!isSuggestionsOpen);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={[
        styles.container,
        theme === 'dark' ? styles.darkContainer : styles.lightContainer
      ]}
    >
      {/* Suggested questions */}
      {isSuggestionsOpen && suggestedQuestions.length > 0 && (
        <View style={[
          styles.suggestionsContainer,
          theme === 'dark' ? styles.darkSuggestions : styles.lightSuggestions
        ]}>
          <View style={styles.suggestionsHeader}>
            <Text style={[
              styles.suggestionsTitle,
              theme === 'dark' ? styles.darkText : styles.lightText
            ]}>
              Perguntas Sugeridas
            </Text>
            <TouchableOpacity
              onPress={toggleSuggestions}
              style={styles.closeSuggestionsButton}
            >
              <Ionicons
                name="close"
                size={20}
                color={theme === 'dark' ? '#fff' : '#333'}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal={false}
            showsVerticalScrollIndicator={true}
            style={styles.suggestionsScrollView}
          >
            {suggestedQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionItem,
                  theme === 'dark' ? styles.darkSuggestionItem : styles.lightSuggestionItem
                ]}
                onPress={() => handleSuggestionClick(question)}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.suggestionText,
                    theme === 'dark' ? styles.darkText : styles.lightText,
                    isLoading && styles.disabledText
                  ]}
                  numberOfLines={2}
                >
                  {question}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.inputContainer}>
        {/* Suggestions toggle button */}
        <TouchableOpacity
          style={[
            styles.suggestionsButton,
            theme === 'dark' ? styles.darkButton : styles.lightButton,
            isLoading && styles.disabledButton
          ]}
          onPress={toggleSuggestions}
          disabled={isLoading}
        >
          <Ionicons
            name="help-circle-outline"
            size={24}
            color={theme === 'dark' ? (isLoading ? '#666' : '#fff') : (isLoading ? '#ccc' : '#666')}
          />
        </TouchableOpacity>

        {/* Text input */}
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            theme === 'dark' ? styles.darkInput : styles.lightInput,
            isLoading && styles.disabledInput
          ]}
          placeholder="Digite sua mensagem..."
          placeholderTextColor={theme === 'dark' ? '#777' : '#aaa'}
          value={inputMessage}
          onChangeText={setInputMessage}
          multiline={true}
          maxHeight={100}
          editable={!isLoading}
          returnKeyType="send"
          onSubmitEditing={onSend}
          blurOnSubmit={false}
        />

        {/* Send button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            inputMessage.trim() === '' || isLoading ? styles.disabledSendButton : styles.activeSendButton
          ]}
          onPress={onSend}
          disabled={inputMessage.trim() === '' || isLoading}
        >
          <Ionicons
            name="send"
            size={isSmallScreen ? 18 : 20}
            color={inputMessage.trim() === '' || isLoading ? '#bbb' : '#fff'}
          />
        </TouchableOpacity>
      </View>

      {/* Mobile keyboard spacer */}
      {Platform.OS === 'ios' && <View style={styles.keyboardSpacer} />}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderTopWidth: 1,
  },
  lightContainer: {
    backgroundColor: '#fff',
    borderTopColor: '#e0e0e0',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
    borderTopColor: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  suggestionsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  lightButton: {
    backgroundColor: '#f0f0f0',
  },
  darkButton: {
    backgroundColor: '#333',
  },
  disabledButton: {
    opacity: 0.6,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 1,
  },
  lightInput: {
    backgroundColor: '#f5f5f5',
    color: '#333',
    borderColor: '#e0e0e0',
  },
  darkInput: {
    backgroundColor: '#333',
    color: '#fff',
    borderColor: '#444',
  },
  disabledInput: {
    opacity: 0.7,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  activeSendButton: {
    backgroundColor: '#4a90e2',
  },
  disabledSendButton: {
    backgroundColor: '#e0e0e0',
  },
  disabledText: {
    opacity: 0.7,
  },
  suggestionsContainer: {
    maxHeight: 200,
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  lightSuggestions: {
    backgroundColor: '#fff',
    borderBottomColor: '#e0e0e0',
  },
  darkSuggestions: {
    backgroundColor: '#1a1a1a',
    borderBottomColor: '#333',
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  lightText: {
    color: '#333',
  },
  darkText: {
    color: '#f0f0f0',
  },
  closeSuggestionsButton: {
    padding: 4,
  },
  suggestionsScrollView: {
    maxHeight: 150,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  lightSuggestionItem: {
    borderBottomColor: '#f0f0f0',
  },
  darkSuggestionItem: {
    borderBottomColor: '#333',
  },
  suggestionText: {
    fontSize: 14,
  },
  keyboardSpacer: {
    height: 20,
  },
});

export default MessageInput;

