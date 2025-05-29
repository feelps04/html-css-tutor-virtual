import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { useAuthContext } from '../../contexts/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;

type Props = {
  navigation: SignInScreenNavigationProp;
};

const SignInScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { authState, authActions } = useAuthContext();
  
  // Handle sign in
  const handleSignIn = async () => {
    try {
      await authActions.signIn(email, password);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };
  
  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      await authActions.signInWithGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };
  
  // Navigate to sign up
  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('@assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Tutor de HTML & CSS</Text>
        </View>
        
        <View style={styles.formContainer}>
          {authState.error && (
            <Text style={styles.errorText}>{authState.error}</Text>
          )}
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry={secureTextEntry}
            mode="outlined"
            right={
              <TextInput.Icon 
                icon={secureTextEntry ? 'eye' : 'eye-off'} 
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
          />
          
          <Button 
            mode="contained"
            onPress={handleSignIn}
            style={styles.button}
            loading={authState.loading}
            disabled={authState.loading}
          >
            Entrar
          </Button>
          
          <Button 
            mode="outlined"
            onPress={handleGoogleSignIn}
            style={styles.googleButton}
            icon="google"
            disabled={authState.loading}
          >
            Entrar com Google
          </Button>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta?</Text>
          <TouchableOpacity onPress={navigateToSignUp}>
            <Text style={styles.signUpText}> Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  surface: {
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 6,
  },
  googleButton: {
    marginTop: 15,
    paddingVertical: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  footerText: {
    color: '#6b7280',
  },
  signUpText: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default SignInScreen;

