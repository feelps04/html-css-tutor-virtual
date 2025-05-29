import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
// Import icons for the theme toggle button
import Ionicons from 'react-native-vector-icons/Ionicons';
// Import the avatar image
// Note: You might need to adjust the path based on your project structure
import meuAvatar from '../assets/img/meu_avatarr.png';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 380;

const Home = ({ onStartJourney, theme, toggleTheme }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Validation for name to allow only letters and spaces
  const isValidName = (name) => {
    // Regex for letters and spaces only (simplified for mobile)
    return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name);
  };

  const handleSubmit = () => {
    // Reset errors
    setNameError('');
    setEmailError('');
    
    // 1. Validate empty fields
    if (userName.trim() === '') {
      setNameError('O nome é obrigatório.');
      return;
    }
    
    if (userEmail.trim() === '') {
      setEmailError('O email é obrigatório.');
      return;
    }
    
    // 2. Validate name format
    if (!isValidName(userName)) {
      setNameError('O nome deve conter apenas letras e espaços.');
      return;
    }
    
    // 3. Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      setEmailError('Formato de email inválido.');
      return;
    }
    
    // If all validations pass, start the journey
    onStartJourney(userName, userEmail);
  };

  // Filter name input to remove numbers and special characters in real-time
  const handleNameChange = (text) => {
    const filteredText = text.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
    setUserName(filteredText);
    setNameError('');
  };

  return (
    <ScrollView 
      contentContainerStyle={[
        styles.container,
        theme === 'dark' ? styles.darkContainer : styles.lightContainer
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={[
            styles.themeToggle,
            theme === 'dark' ? styles.darkThemeToggle : styles.lightThemeToggle
          ]} 
          onPress={toggleTheme}
        >
          <Ionicons 
            name={theme === 'dark' ? 'sunny' : 'moon'} 
            size={24} 
            color={theme === 'dark' ? '#FFF' : '#333'} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.avatarContainer}>
        <Image
          source={meuAvatar}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>
      
      <Text style={[
        styles.title,
        theme === 'dark' ? styles.darkText : styles.lightText
      ]}>
        Bem-vindo ao Tutor Web!
      </Text>
      
      <Text style={[
        styles.subtitle,
        theme === 'dark' ? styles.darkSubText : styles.lightSubText
      ]}>
        Antes de começarmos sua jornada de aprendizado em HTML e CSS, por favor, nos diga um pouco sobre você.
      </Text>
      
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[
            styles.label,
            theme === 'dark' ? styles.darkText : styles.lightText
          ]}>
            Seu Nome:
          </Text>
          <TextInput
            style={[
              styles.input,
              theme === 'dark' ? styles.darkInput : styles.lightInput,
              nameError ? styles.inputError : null
            ]}
            placeholder="Digite seu nome"
            placeholderTextColor={theme === 'dark' ? '#999' : '#999'}
            value={userName}
            onChangeText={handleNameChange}
          />
          {nameError ? (
            <Text style={styles.errorText}>{nameError}</Text>
          ) : null}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[
            styles.label,
            theme === 'dark' ? styles.darkText : styles.lightText
          ]}>
            Seu Email:
          </Text>
          <TextInput
            style={[
              styles.input,
              theme === 'dark' ? styles.darkInput : styles.lightInput,
              emailError ? styles.inputError : null
            ]}
            placeholder="Digite seu email"
            placeholderTextColor={theme === 'dark' ? '#999' : '#999'}
            value={userEmail}
            onChangeText={(text) => {
              setUserEmail(text);
              setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Começar a Aprender!</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.socialLinks}>
        <Text style={[
          styles.socialText,
          theme === 'dark' ? styles.darkSubText : styles.lightSubText
        ]}>
          Conecte-se Conosco!
        </Text>
        
        <TouchableOpacity 
          style={styles.discordButton}
          onPress={() => {
            // You would implement this differently in React Native
            // Perhaps using Linking to open a URL
            Alert.alert("Discord", "Você seria redirecionado para o Discord em um app real.");
          }}
        >
          <Ionicons name="logo-discord" size={24} color="#7289DA" />
          <Text style={styles.discordText}>Junte-se ao nosso Discord</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  headerContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  themeToggle: {
    padding: 8,
    borderRadius: 20,
  },
  lightThemeToggle: {
    backgroundColor: '#f0f0f0',
  },
  darkThemeToggle: {
    backgroundColor: '#333',
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#4a90e2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  lightText: {
    color: '#333',
  },
  darkText: {
    color: '#f0f0f0',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  lightSubText: {
    color: '#666',
  },
  darkSubText: {
    color: '#aaa',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
  },
  lightInput: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    color: '#333',
  },
  darkInput: {
    backgroundColor: '#333',
    borderColor: '#555',
    color: '#fff',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#4a90e2',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialLinks: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  socialText: {
    fontSize: 16,
    marginBottom: 15,
  },
  discordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  discordText: {
    color: '#7289DA',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default Home;

