import { useState, useEffect, useRef } from 'react';
import Editor, { OnChange, OnMount } from '@monaco-editor/react';
import { FaHtml5, FaCss3Alt, FaJs } from 'react-icons/fa';
import { saveProjectLocally } from '@html-css-tutor/shared';

interface CodeEditorProps {
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  projectId?: string;
  readOnly?: boolean;
  onCodeChange?: (html: string, css: string, js: string) => void;
}

type EditorTab = 'html' | 'css' | 'js';

const CodeEditor = ({
  initialHtml = '<!DOCTYPE html>\n<html>\n<head>\n  <title>Meu Projeto</title>\n</head>\n<body>\n  <h1>Olá Mundo!</h1>\n  <p>Escreva seu código HTML aqui.</p>\n</body>\n</html>',
  initialCss = 'body {\n  font-family: Arial, sans-serif;\n  margin: 20px;\n  background-color: #f5f5f5;\n}\n\nh1 {\n  color: #333;\n}\n\np {\n  line-height: 1.5;\n}',
  initialJs = '// Seu código JavaScript aqui\nconsole.log("Olá do JavaScript!");',
  projectId,
  readOnly = false,
  onCodeChange
}: CodeEditorProps) => {
  const [htmlCode, setHtmlCode] = useState(initialHtml);
  const [cssCode, setCssCode] = useState(initialCss);
  const [jsCode, setJsCode] = useState(initialJs);
  const [activeTab, setActiveTab] = useState<EditorTab>('html');
  const [previewHtml, setPreviewHtml] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Auto-save timer
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle tab change
  const handleTabChange = (tab: EditorTab) => {
    setActiveTab(tab);
  };
  
  // Handle code change
  const handleCodeChange: OnChange = (value, _event) => {
    if (!value) return;
    
    switch (activeTab) {
      case 'html':
        setHtmlCode(value);
        break;
      case 'css':
        setCssCode(value);
        break;
      case 'js':
        setJsCode(value);
        break;
    }
    
    // Setup auto-save
    if (projectId) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setTimeout(() => {
        saveProjectLocally(projectId, {
          htmlCode,
          cssCode,
          jsCode,
          lastEdited: new Date()
        });
      }, 2000);
    }
    
    // Notify parent about code change
    if (onCodeChange) {
      onCodeChange(htmlCode, cssCode, jsCode);
    }
  };
  
  // Editor mount handler
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Configure editor
    editor.updateOptions({
      minimap: {
        enabled: false
      },
      fontSize: 14,
      wordWrap: 'on',
      lineNumbers: 'on',
      scrollBeyondLastLine: false
    });
    
    // Add custom themes if needed
    monaco.editor.defineTheme('tutorTheme', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#f8f9fa',
        'editor.foreground': '#333',
        'editor.lineHighlightBackground': '#f1f3f5',
        'editorCursor.foreground': '#333',
        'editorWhitespace.foreground': '#d0d7de'
      }
    });
    
    monaco.editor.setTheme('tutorTheme');
  };
  
  // Update preview
  useEffect(() => {
    const combinedCode = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode.replace(/<!DOCTYPE html>|<html>|<\/html>|<head>.*<\/head>/s, '')}
        <script>${jsCode}</script>
      </body>
      </html>
    `;
    
    setPreviewHtml(combinedCode);
    
    // If iframe exists, update its content
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(combinedCode);
        iframeDoc.close();
      }
    }
  }, [htmlCode, cssCode, jsCode]);
  
  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-2">
        <button
          className={`px-4 py-2 flex items-center space-x-2 ${
            activeTab === 'html'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
          onClick={() => handleTabChange('html')}
        >
          <FaHtml5 className="text-orange-500" />
          <span>HTML</span>
        </button>
        
        <button
          className={`px-4 py-2 flex items-center space-x-2 ${
            activeTab === 'css'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
          onClick={() => handleTabChange('css')}
        >
          <FaCss3Alt className="text-blue-500" />
          <span>CSS</span>
        </button>
        
        <button
          className={`px-4 py-2 flex items-center space-x-2 ${
            activeTab === 'js'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
          onClick={() => handleTabChange('js')}
        >
          <FaJs className="text-yellow-500" />
          <span>JavaScript</span>
        </button>
      </div>
      
      {/* Code editor and preview container */}
      <div className="flex flex-1 space-x-4 overflow-hidden">
        {/* Code editor */}
        <div className="w-1/2 h-full border border-gray-200 rounded-md overflow-hidden">
          <Editor
            height="100%"
            language={activeTab}
            value={
              activeTab === 'html'
                ? htmlCode
                : activeTab === 'css'
                ? cssCode
                : jsCode
            }
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            options={{
              readOnly,
              automaticLayout: true
            }}
          />
        </div>
        
        {/* Preview */}
        <div className="w-1/2 h-full border border-gray-200 rounded-md overflow-hidden bg-white">
          <iframe
            ref={iframeRef}
            title="Code Preview"
            className="w-full h-full"
            sandbox="allow-scripts"
            srcDoc={previewHtml}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;

