import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QRProjectData {
  htmlCode: string;
  cssCode: string;
  jsCode?: string;
  title: string;
  description?: string;
}

const ScanQRScreen = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashMode, setFlashMode] = useState(BarCodeScanner.Constants.FlashMode.off);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  // Handle barcode scan
  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    
    try {
      // Parse the QR code data
      const projectData = JSON.parse(data) as QRProjectData;
      
      // Validate project data
      if (!projectData.htmlCode || !projectData.cssCode || !projectData.title) {
        showSnackbar('QR code inválido. Formato de projeto não reconhecido.');
        return;
      }
      
      // Save project data to AsyncStorage
      await AsyncStorage.setItem('editor_html', projectData.htmlCode);
      await AsyncStorage.setItem('editor_css', projectData.cssCode);
      
      if (projectData.jsCode) {
        await AsyncStorage.setItem('editor_js', projectData.jsCode);
      }
      
      await AsyncStorage.setItem('editor_project_name', projectData.title);
      
      // Show success message
      showSnackbar('Projeto carregado com sucesso!');
      
      // Navigate to editor after a brief delay
      setTimeout(() => {
        navigation.navigate('EditorScreen' as never);
      }, 1500);
      
    } catch (error) {
      showSnackbar('Erro ao processar o QR code. Verifique se é um projeto válido.');
      console.error('QR code parsing error:', error);
    }
  };
  
  // Toggle flash
  const toggleFlash = () => {
    setFlashMode(
      flashMode === BarCodeScanner.Constants.FlashMode.off
        ? BarCodeScanner.Constants.FlashMode.torch
        : BarCodeScanner.Constants.FlashMode.off
    );
  };
  
  // Show snackbar with message
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };
  
  // Handle permission denied
  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.permissionText}>
          Solicitando permissão da câmera...
        </Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialCommunityIcons name="camera-off" size={60} color="#ef4444" />
        <Text style={styles.permissionText}>
          Acesso à câmera negado. Por favor, habilite a permissão da câmera nas configurações do seu dispositivo.
        </Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Voltar
        </Button>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
        flashMode={flashMode}
      />
      
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
      </View>
      
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Aponte a câmera para um QR code de projeto para carregar no editor
        </Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.flashButton}
          onPress={toggleFlash}
        >
          <MaterialCommunityIcons 
            name={flashMode === BarCodeScanner.Constants.FlashMode.off ? "flash" : "flash-off"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
        
        {scanned && (
          <Button 
            mode="contained" 
            onPress={() => setScanned(false)}
            style={styles.scanButton}
          >
            Escanear Novamente
          </Button>
        )}
      </View>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  permissionText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#4b5563',
    fontSize: 16,
    lineHeight: 24,
  },
  backButton: {
    marginTop: 20,
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#3b82f6',
    backgroundColor: 'transparent',
  },
  instructionsContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 20,
  },
  instructionsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 30,
    marginRight: 20,
  },
  scanButton: {
    backgroundColor: '#3b82f6',
  },
  snackbar: {
    backgroundColor: '#1f2937',
  },
});

export default ScanQRScreen;

