import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Custom Dropdown component for React Native (since there's no direct equivalent to HTML select)
const Dropdown = ({ options, selectedValue, onValueChange, placeholder, disabled, theme }) => {
  const [visible, setVisible] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(() => {
    const selected = options.find(option => option.value === selectedValue);
    return selected ? selected.label : placeholder;
  });

  const toggleDropdown = () => {
    if (disabled) return;
    setVisible(!visible);
  };

  const onItemSelect = (item) => {
    setSelectedLabel(item.label);
    onValueChange(item.value);
    setVisible(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          theme === 'dark' ? styles.darkDropdown : styles.lightDropdown,
          disabled && styles.disabledDropdown
        ]}
        onPress={toggleDropdown}
        disabled={disabled}
      >
        <Text 
          style={[
            styles.dropdownText, 
            theme === 'dark' ? styles.darkText : styles.lightText,
            disabled && styles.disabledText
          ]}
          numberOfLines={1}
        >
          {selectedLabel}
        </Text>
        <Ionicons 
          name="chevron-down" 
          size={16} 
          color={theme === 'dark' ? (disabled ? '#666' : '#fff') : (disabled ? '#ccc' : '#333')} 
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setVisible(false)}
        >
          <View 
            style={[
              styles.dropdown,
              theme === 'dark' ? styles.darkDropdownList : styles.lightDropdownList
            ]}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    selectedValue === item.value && (
                      theme === 'dark' ? styles.darkSelectedItem : styles.lightSelectedItem
                    )
                  ]}
                  onPress={() => onItemSelect(item)}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    theme === 'dark' ? styles.darkText : styles.lightText,
                    selectedValue === item.value && styles.selectedItemText
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const ChatHeader = ({
  currentTopic,
  learningTopics,
  handleTopicChange,
  currentMode,
  handleModeChange,
  theme,
  toggleTheme,
  onBackToPath,
  isLoading,
}) => {
  // Get device width to adjust layout
  const { width } = Dimensions.get('window');
  const isSmallScreen = width < 480;

  // Format topic options for dropdown
  const topicOptions = Object.entries(learningTopics).map(([key, topic]) => ({
    value: key,
    label: topic.name,
  }));

  // Mode options
  const modeOptions = [
    { value: 'iniciante', label: 'Iniciante' },
    { value: 'intermediario', label: 'Intermediário' },
    { value: 'avancado', label: 'Avançado' },
  ];

  // Get current topic name
  const currentTopicName = currentTopic && learningTopics[currentTopic]
    ? learningTopics[currentTopic].name
    : 'Tópico atual';

  return (
    <View style={[
      styles.container,
      theme === 'dark' ? styles.darkContainer : styles.lightContainer
    ]}>
      <View style={styles.headerTop}>
        {/* Back button (visible on small screens) */}
        {isSmallScreen && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onBackToPath}
            disabled={isLoading}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme === 'dark' ? '#fff' : '#333'}
              style={{ opacity: isLoading ? 0.5 : 1 }}
            />
          </TouchableOpacity>
        )}

        {/* Header title */}
        <Text style={[
          styles.title,
          theme === 'dark' ? styles.darkText : styles.lightText,
          isSmallScreen && styles.smallTitle
        ]}>
          Tutor Virtual de HTML & CSS
        </Text>

        {/* Theme toggle button (visible on small screens) */}
        {isSmallScreen && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={toggleTheme}
            disabled={isLoading}
          >
            <Ionicons
              name={theme === 'dark' ? 'sunny' : 'moon'}
              size={24}
              color={theme === 'dark' ? '#fff' : '#333'}
              style={{ opacity: isLoading ? 0.5 : 1 }}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Controls row */}
      <View style={styles.controlsRow}>
        {/* Topic dropdown */}
        <View style={styles.dropdownWrapper}>
          <Dropdown
            options={topicOptions}
            selectedValue={currentTopic}
            onValueChange={handleTopicChange}
            placeholder="Selecionar tópico"
            disabled={isLoading}
            theme={theme}
          />
        </View>

        {/* Mode dropdown */}
        <View style={styles.dropdownWrapper}>
          <Dropdown
            options={modeOptions}
            selectedValue={currentMode}
            onValueChange={handleModeChange}
            placeholder="Selecionar nível"
            disabled={isLoading}
            theme={theme}
          />
        </View>

        {/* Additional controls for larger screens */}
        {!isSmallScreen && (
          <>
            {/* Theme toggle button */}
            <TouchableOpacity
              style={[
                styles.button,
                theme === 'dark' ? styles.darkButton : styles.lightButton
              ]}
              onPress={toggleTheme}
              disabled={isLoading}
            >
              <Ionicons
                name={theme === 'dark' ? 'sunny' : 'moon'}
                size={18}
                color={theme === 'dark' ? '#fff' : '#333'}
                style={{ marginRight: 5, opacity: isLoading ? 0.5 : 1 }}
              />
              <Text style={[
                styles.buttonText,
                theme === 'dark' ? styles.darkText : styles.lightText,
                { opacity: isLoading ? 0.5 : 1 }
              ]}>
                {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
              </Text>
            </TouchableOpacity>

            {/* Back to path button */}
            <TouchableOpacity
              style={[
                styles.button,
                theme === 'dark' ? styles.darkButton : styles.lightButton
              ]}
              onPress={onBackToPath}
              disabled={isLoading}
            >
              <Ionicons
                name="arrow-back"
                size={18}
                color={theme === 'dark' ? '#fff' : '#333'}
                style={{ marginRight: 5, opacity: isLoading ? 0.5 : 1 }}
              />
              <Text style={[
                styles.buttonText,
                theme === 'dark' ? styles.darkText : styles.lightText,
                { opacity: isLoading ? 0.5 : 1 }
              ]}>
                Voltar à Trilha
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={theme === 'dark' ? '#fff' : '#4a90e2'}
          />
          <Text style={[
            styles.loadingText,
            theme === 'dark' ? styles.darkSubText : styles.lightSubText
          ]}>
            Carregando...
          </Text>
        </View>
      )}

      {/* Mobile info line */}
      {isSmallScreen && (
        <View style={styles.mobileInfo}>
          <Text style={[
            styles.mobileInfoText,
            theme === 'dark' ? styles.darkSubText : styles.lightSubText
          ]}>
            Tópico: <Text style={styles.infoHighlight}>{currentTopicName}</Text> • 
            Nível: <Text style={styles.infoHighlight}>{
              modeOptions.find(m => m.value === currentMode)?.label || currentMode
            }</Text>
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    borderBottomWidth: 1,
  },
  lightContainer: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#e0e0e0',
  },
  darkContainer: {
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#333',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  smallTitle: {
    fontSize: 16,
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
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dropdownWrapper: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 8,
    minWidth: 150,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  lightDropdown: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  darkDropdown: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  disabledDropdown: {
    opacity: 0.7,
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
  },
  disabledText: {
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdown: {
    position: 'absolute',
    width: '80%',
    maxHeight: 300,
    borderRadius: 6,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lightDropdownList: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  darkDropdownList: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  lightSelectedItem: {
    backgroundColor: '#f0f7ff',
  },
  darkSelectedItem: {
    backgroundColor: '#1a3c5a',
  },
  dropdownItemText: {
    fontSize: 14,
  },
  selectedItemText: {
    fontWeight: 'bold',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  lightButton: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  darkButton: {
    backgroundColor: '#333',
    borderColor: '#555',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loadingText: {
    fontSize: 12,
    marginLeft: 6,
  },
  mobileInfo: {
    alignItems: 'center',
    paddingTop: 8,
  },
  mobileInfoText: {
    fontSize: 12,
    textAlign: 'center',
  },
  infoHighlight: {
    fontWeight: 'bold',
  },
});

export default ChatHeader;

