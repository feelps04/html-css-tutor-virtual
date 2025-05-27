import React, { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/atom-one-dark.css'; // Estilo de tema escuro para o código

// Function to dynamically load language syntax
const loadLanguage = async (langName) => {
  try {
    // Map common language names to highlight.js modules
    const langMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'xml',
      'css': 'css',
      'json': 'json',
      'python': 'python',
      'py': 'python',
      'bash': 'bash',
      'sh': 'bash',
      // Add more mappings as needed
    };

    // Get the correct language name from the map or use the provided name
    const language = langMap[langName] || langName;

    // Dynamically import only the needed language
    const languageModule = await import(`highlight.js/lib/languages/${language}`);
    
    // Register the language with highlight.js
    hljs.registerLanguage(language, languageModule.default);
    
    return language;
  } catch (error) {
    console.error(`Could not load language: ${langName}`, error);
    return null;
  }
};

const CodeBlock = ({ inline, className, children }) => {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : '';
  const code = String(children).replace(/\n$/, '');
  const codeRef = useRef(null);
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);

  useEffect(() => {
    if (lang && codeRef.current) {
      // Only load the language if specified
      loadLanguage(lang).then((loadedLanguage) => {
        if (loadedLanguage) {
          setIsLanguageLoaded(true);
        }
      });
    }
  }, [lang]);

  useEffect(() => {
    if (codeRef.current && isLanguageLoaded) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, isLanguageLoaded]);

  const handleCopyCode = () => {
    // Usando document.execCommand para compatibilidade em iframes
    const textArea = document.createElement('textarea');
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      // Não usar alert(), mas sim um feedback visual no futuro
      console.log('Código copiado para a área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar código: ', err);
    }
    document.body.removeChild(textArea);
  };

  if (inline) {
    return <code className={className}>{children}</code>;
  }

  return (
    <div style={{ position: 'relative' }}>
      <pre className={className}>
        <code ref={codeRef} className={`language-${lang}`}>
          {code}
        </code>
      </pre>
      <button onClick={handleCopyCode} className="copy-code-button">Copiar</button>
    </div>
  );
};

export default CodeBlock;