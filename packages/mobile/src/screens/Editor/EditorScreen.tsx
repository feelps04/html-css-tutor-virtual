import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Button, Surface, ToggleButton, ActivityIndicator, FAB } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { github } from 'react-syntax-highlighter/styles/prism';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_WIDTH = Dimensions.get('window').width;

type EditorTab = 'html' | 'css' | 'js';

const EditorScreen = () => {
  const navigation = useNavigation();
  const webViewRef = useRef<WebView>(null);
  const [activeTab, setActiveTab] = useState<EditorTab>('html');
  const [htmlCode, setHtmlCode] = useState('<!DOCTYPE html>\n<html>\n<head>\n  <title>Meu Projeto</title>\n</head>\n<body>\n  <h1>Olá Mundo!</h1>\n  <p>Toque para editar o código HTML.</p>\n</body>\n</html>');
  const [cssCode, setCssCode] = useState('body {\n  font-family: Arial, sans-serif;\n  margin: 20px;\n  background-color: #f5f5f5;\n}\n\nh1 {\n  color: #333;\n}\n\np {\n  line-height: 1.5;\n}');
  const [jsCode, setJsCode] = useState('// Seu código JavaScript aqui\nconsole.log("Olá do JavaScript!");');
  const [previewHtml, setPreviewHtml] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('Meu Projeto');
  
  // Generate preview HTML
  useEffect(() => {
    const generatePreview = () => {
      const combinedCode = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode.replace(/<!DOCTYPE html>|<html>|<\/html>|<head>.*<\/head>/s, '')}
          <script>${jsCode}</script>
        </body>
        </html>
      `;
      
      setPreviewHtml(combinedCode);
      setLoading(false);
    };
    
    generatePreview();
  }, [htmlCode, cssCode, jsCode]);
  
  // Load saved code when component mounts
  useEffect(() => {
    const loadSavedCode = async () => {
      try {
        const savedHtml = await AsyncStorage.getItem('editor_html');
        const savedCss = await AsyncStorage.getItem('editor_css');
        const savedJs = await AsyncStorage.getItem('editor_js');
        const savedProjectName = await AsyncStorage.getItem('editor_project_name');
        
        if (savedHtml) setHtmlCode(savedHtml);
        if (savedCss) setCssCode(savedCss);
        if (savedJs) setJsCode(savedJs);
        if (savedProjectName) setProjectName(savedProjectName);
      } catch (error) {
        console.error('Error loading saved code:', error);
      }
    };
    
    loadSavedCode();
  }, []);
  
  // Save code to AsyncStorage
  const saveCode = async () => {
    try {
      await AsyncStorage.setItem('editor_html', htmlCode);
      await AsyncStorage.setItem('editor_css', cssCode);
      await AsyncStorage.setItem('editor_js', jsCode);
      await AsyncStorage.setItem('editor_project_name', projectName);
    } catch (error) {
      console.error('Error saving code:', error);
    }
  };
  
  // Handle tab change
  const handleTabChange = (tab: EditorTab) => {
    setActiveTab(tab);
  };
  
  // Start editing the code
  const startEditing = () => {
    switch (activeTab) {
      case 'html':
        setEditingValue(htmlCode);
        break;
      case 'css':
        setEditingValue(cssCode);
        break;
      case 'js':
        setEditingValue(jsCode);
        break;
    }
    
    setIsEditing(true);
  };
  
  // Save edited code
  const saveEditing = () => {
    switch (activeTab) {
      case 'html':
        setHtmlCode(editingValue);
        break;
      case 'css':
        setCssCode(editingValue);
        break;
      case 'js':
        setJsCode(editingValue);
        break;
    }
    
    setIsEditing(false);
    saveCode();
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
  };
  
  // Navigate to QR code scanner
  const navigateToQRScanner = () => {
    navigation.navigate('ScanQR' as never);
  };
  
  // Get the current code based on active tab
  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html':
        return htmlCode;
      case 'css':
        return cssCode;
      case 'js':
        return jsCode;
      default:
        return '';
    }
  };
  
  // Get language for syntax highlighting
  const getSyntaxLanguage = () => {
    switch (activeTab) {
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'js':
        return 'javascript';
      default:
        return 'html';
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Editor Tabs */}
      <Surface style={styles.tabContainer}>
        <ToggleButton.Row 
          onValueChange={(value) => handleTabChange(value as EditorTab)}
          value={activeTab}
        >
          <ToggleButton 
            icon="language-html5" 
            value="html" 
            style={[
              styles.tabButton,
              activeTab === 'html' && styles.activeTabButton
            ]}
          />
          <ToggleButton 
            icon="language-css3" 
            value="css" 
            style={[
              styles.tabButton,
              activeTab === 'css' && styles.activeTabButton
            ]}
          />
          <ToggleButton 
            icon="language-javascript" 
            value="js" 
            style={[
              styles.tabButton,
              activeTab === 'js' && styles.activeTabButton
            ]}
          />
        </ToggleButton.Row>
        
        <ToggleButton
          icon={isPreviewMode ? 'code-tags' : 'eye'}
          value="preview"
          status="unchecked"
          onPress={() => setIsPreviewMode(!isPreviewMode)}
          style={styles.previewButton}
        />
      </Surface>
      
      {/* Preview Mode */}
      {isPreviewMode ? (
        <View style={styles.previewContainer}>
          {loading ? (
            <ActivityIndicator style={styles.loader} size="large" color="#3b82f6" />
          ) : (
            <WebView
              ref={webViewRef}
              source={{ html: previewHtml }}
              style={styles.webView}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          )}
        </View>
      ) : (
        // Code Editor Mode
        <ScrollView style={styles.codeContainer}>
          <TouchableOpacity 
            style={styles.codeEditorContainer}
            onPress={startEditing}
            activeOpacity={0.7}
          >
            <SyntaxHighlighter
              language={getSyntaxLanguage()}
              style={github}
              fontSize={14}
              highlighter="prism"
            >
              {getCurrentCode()}
            </SyntaxHighlighter>
          </TouchableOpacity>
        </ScrollView>
      )}
      
      {/* FAB */}
      <FAB
        icon="qrcode-scan"
        style={styles.fab}
        onPress={navigateToQRScanner}
        color="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 2,
  },
  tabButton: {
    borderRadius: 0,
  },
  activeTabButton: {
    backgroundColor: '#dbeafe',
  },
  previewButton: {
    marginLeft: 10,
  },
  codeContainer: {
    flex: 1,
    padding: 10,
  },
  codeEditorContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    minHeight: 300,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  webView: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#3b82f6',
  },
  // Modal styles would be added here for the code editing modal
});

export default EditorScreen;

