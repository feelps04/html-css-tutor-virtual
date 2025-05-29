import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { Text, Surface, Button, Divider, RadioButton, List, Dialog, Portal, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthContext } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Notification scheduling utility
async function schedulePushNotification(hour: number, minute: number, title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      badge: 1,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
}

// Reset all notifications
async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// User settings interface
interface UserSettings {
  theme: 'light' | 'dark' | 'high-contrast';
  fontSize: 'small' | 'medium' | 'large';
  notificationsEnabled: boolean;
  studyReminders: boolean;
  studyReminderTime: string;
  autoSaveCode: boolean;
  offlineContent: boolean;
  accessibilityFeatures: {
    screenReader: boolean;
    highContrast: boolean;
    reduceMotion: boolean;
  };
}

// Default settings
const defaultSettings: UserSettings = {
  theme: 'light',
  fontSize: 'medium',
  notificationsEnabled: true,
  studyReminders: true,
  studyReminderTime: '18:00',
  autoSaveCode: true,
  offlineContent: false,
  accessibilityFeatures: {
    screenReader: false,
    highContrast: false,
    reduceMotion: false,
  },
};

const SettingsScreen = () => {
  const { authState } = useAuthContext();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [tempTime, setTempTime] = useState('18:00');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  // Load settings from storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem('user_settings');
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  // Update a setting
  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setUnsavedChanges(true);
  };
  
  // Update an accessibility feature
  const updateAccessibilityFeature = (feature: keyof UserSettings['accessibilityFeatures'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      accessibilityFeatures: {
        ...prev.accessibilityFeatures,
        [feature]: value
      }
    }));
    setUnsavedChanges(true);
  };
  
  // Save settings
  const saveSettings = async () => {
    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem('user_settings', JSON.stringify(settings));
      
      // Configure notifications based on settings
      if (settings.notificationsEnabled) {
        if (settings.studyReminders) {
          // Parse reminder time
          const [hours, minutes] = settings.studyReminderTime.split(':').map(Number);
          
          // Cancel existing notifications and schedule new ones
          await cancelAllNotifications();
          await schedulePushNotification(
            hours,
            minutes,
            'Hora de estudar!',
            'Mantenha sua rotina de estudos para continuar progredindo.'
          );
        }
      } else {
        // Cancel all notifications if disabled
        await cancelAllNotifications();
      }
      
      // Show success message
      Alert.alert('Configurações salvas', 'Suas preferências foram atualizadas com sucesso.');
      setUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Erro', 'Não foi possível salvar suas configurações. Tente novamente.');
    }
  };
  
  // Request notification permissions
  const requestNotificationPermission = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Para receber notificações, você precisa conceder permissão nas configurações do seu dispositivo.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Configurações',
              onPress: () => {
                // Open app settings
                if (Platform.OS === 'ios') {
                  // For iOS
                  // Linking.openURL('app-settings:');
                } else {
                  // For Android
                  // Linking.openSettings();
                }
              }
            }
          ]
        );
        return false;
      }
      return true;
    } else {
      Alert.alert('Notificações indisponíveis', 'As notificações só estão disponíveis em dispositivos físicos.');
      return false;
    }
  };
  
  // Toggle notifications
  const toggleNotifications = async (value: boolean) => {
    if (value) {
      // Request permission when enabling notifications
      const granted = await requestNotificationPermission();
      if (granted) {
        updateSetting('notificationsEnabled', true);
      }
    } else {
      // Simply disable notifications
      updateSetting('notificationsEnabled', false);
      await cancelAllNotifications();
    }
  };
  
  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };
  
  // Confirm time selection
  const confirmTimeSelection = () => {
    updateSetting('studyReminderTime', tempTime);
    setTimePickerVisible(false);
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
      {/* Appearance Section */}
      <List.Section>
        <List.Subheader>Aparência</List.Subheader>
        
        <Surface style={styles.section}>
          <List.Item
            title="Tema"
            description="Escolha o tema de sua preferência"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <View style={styles.radioGroup}>
                <RadioButton.Group
                  onValueChange={value => updateSetting('theme', value as UserSettings['theme'])}
                  value={settings.theme}
                >
                  <View style={styles.radioOption}>
                    <RadioButton value="light" />
                    <Text>Claro</Text>
                  </View>
                  <View style={styles.radioOption}>
                    <RadioButton value="dark" />
                    <Text>Escuro</Text>
                  </View>
                  <View style={styles.radioOption}>
                    <RadioButton value="high-contrast" />
                    <Text>Alto contraste</Text>
                  </View>
                </RadioButton.Group>
              </View>
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Tamanho da fonte"
            description="Ajuste o tamanho dos textos no aplicativo"
            left={props => <List.Icon {...props} icon="format-size" />}
            right={() => (
              <View style={styles.radioGroup}>
                <RadioButton.Group
                  onValueChange={value => updateSetting('fontSize', value as UserSettings['fontSize'])}
                  value={settings.fontSize}
                >
                  <View style={styles.radioOption}>
                    <RadioButton value="small" />
                    <Text style={{ fontSize: 12 }}>A</Text>
                  </View>
                  <View style={styles.radioOption}>
                    <RadioButton value="medium" />
                    <Text style={{ fontSize: 16 }}>A</Text>
                  </View>
                  <View style={styles.radioOption}>
                    <RadioButton value="large" />
                    <Text style={{ fontSize: 20 }}>A</Text>
                  </View>
                </RadioButton.Group>
              </View>
            )}
          />
        </Surface>
      </List.Section>
      
      {/* Notifications Section */}
      <List.Section>
        <List.Subheader>Notificações</List.Subheader>
        
        <Surface style={styles.section}>
          <List.Item
            title="Notificações"
            description="Permitir notificações push"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={toggleNotifications}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Lembretes de estudo"
            description="Receba lembretes para estudar regularmente"
            left={props => <List.Icon {...props} icon="bell-ring" />}
            right={() => (
              <Switch
                value={settings.studyReminders}
                onValueChange={value => updateSetting('studyReminders', value)}
                disabled={!settings.notificationsEnabled}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Horário do lembrete"
            description={`${formatTime(settings.studyReminderTime)}`}
            left={props => <List.Icon {...props} icon="clock-outline" />}
            onPress={() => {
              setTempTime(settings.studyReminderTime);
              setTimePickerVisible(true);
            }}
            disabled={!settings.notificationsEnabled || !settings.studyReminders}
          />
        </Surface>
      </List.Section>
      
      {/* Offline Section */}
      <List.Section>
        <List.Subheader>Offline e Armazenamento</List.Subheader>
        
        <Surface style={styles.section}>
          <List.Item
            title="Auto-salvar código"
            description="Salvar automaticamente seu código enquanto edita"
            left={props => <List.Icon {...props} icon="content-save" />}
            right={() => (
              <Switch
                value={settings.autoSaveCode}
                onValueChange={value => updateSetting('autoSaveCode', value)}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Conteúdo offline"
            description="Baixar lições para acesso sem internet"
            left={props => <List.Icon {...props} icon="download" />}
            right={() => (
              <Switch
                value={settings.offlineContent}
                onValueChange={value => updateSetting('offlineContent', value)}
              />
            )}
          />
        </Surface>
      </List.Section>
      
      {/* Accessibility Section */}
      <List.Section>
        <List.Subheader>Acessibilidade</List.Subheader>
        
        <Surface style={styles.section}>
          <List.Item
            title="Leitor de tela"
            description="Otimizar para tecnologias assistivas"
            left={props => <List.Icon {...props} icon="text-to-speech" />}
            right={() => (
              <Switch
                value={settings.accessibilityFeatures.screenReader}
                onValueChange={value => updateAccessibilityFeature('screenReader', value)}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Alto contraste"
            description="Aumentar contraste de cores"
            left={props => <List.Icon {...props} icon="contrast-box" />}
            right={() => (
              <Switch
                value={settings.accessibilityFeatures.highContrast}
                onValueChange={value => updateAccessibilityFeature('highContrast', value)}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Reduzir movimento"
            description="Minimizar animações e transições"
            left={props => <List.Icon {...props} icon="motion-pause" />}
            right={() => (
              <Switch
                value={settings.accessibilityFeatures.reduceMotion}
                onValueChange={value => updateAccessibilityFeature('reduceMotion', value)}
              />
            )}
          />
        </Surface>
      </List.Section>
      
      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={saveSettings}
          style={styles.saveButton}
          disabled={!unsavedChanges}
        >
          Salvar Configurações
        </Button>
      </View>
      
      {/* Time Picker Dialog */}
      <Portal>
        <Dialog
          visible={timePickerVisible}
          onDismiss={() => setTimePickerVisible(false)}
        >
          <Dialog.Title>Horário do lembrete</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Horário (HH:MM)"
              value={tempTime}
              onChangeText={setTempTime}
              keyboardType="numbers-and-punctuation"
              placeholder="18:00"
              style={styles.timeInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setTimePickerVisible(false)}>Cancelar</Button>
            <Button onPress={confirmTimeSelection}>Confirmar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  section: {
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  radioGroup: {
    flexDirection: 'column',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  buttonContainer: {
    padding: 16,
    marginBottom: 32,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
  },
  timeInput: {
    marginTop: 16,
  },
});

export default SettingsScreen;

