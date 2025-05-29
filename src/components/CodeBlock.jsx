import React, { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/core';
// Import fixed themes for light and dark mode
import 'highlight.js/styles/atom-one-light.css'; // Light theme
import 'highlight.js/styles/atom-one-dark.css'; // Dark theme
import { FiCopy, FiCheck } from 'react-icons/fi'; // Import icons only for copy

// Create a simple CSS to fix theme conflicts and ensure proper highlighting
const highlightjsThemeStyles = `
  /* Light mode specific styles (default) */
  pre code.hljs {
    display: block;
    overflow-x: auto;
    padding: 1em;
  }
  
  /* Force light theme when not in dark mode */
  html:not(.dark) code.hljs {
    background: transparent !important;
    color: inherit;
  }
  
  /* Force dark theme when in dark mode */
  html.dark code.hljs {
    background: transparent !important;
    color: inherit;
  }
  
  /* Ensure highlight.js classes aren't overridden by Tailwind */
  .hljs-doctag,
  .hljs-keyword,
  .hljs-meta .hljs-keyword,
  .hljs-template-tag,
  .hljs-template-variable,
  .hljs-type,
  .hljs-variable.language_ {
    /* These will be preserved and not purged by Tailwind */
  }
  
  /* Additional style overrides to ensure syntax highlighting works */
  html.dark .hljs-attr,
  html.dark .hljs-attribute,
  html.dark .hljs-literal,
  html.dark .hljs-meta,
  html.dark .hljs-number,
  html.dark .hljs-operator,
  html.dark .hljs-selector-attr,
  html.dark .hljs-selector-class,
  html.dark .hljs-selector-id,
  html.dark .hljs-variable {
    color: #79b8ff;
  }
  
  html.dark .hljs-regexp,
  html.dark .hljs-string,
  html.dark .hljs-meta .hljs-string {
    color: #9ecbff;
  }
  
  html.dark .hljs-built_in,
  html.dark .hljs-class .hljs-title,
  html.dark .hljs-title.class_ {
    color: #f2c088;
  }
  
  html.dark .hljs-comment,
  html.dark .hljs-formula {
    color: #8b949e;
  }
  
  html.dark .hljs-name,
  html.dark .hljs-quote,
  html.dark .hljs-selector-tag,
  html.dark .hljs-selector-pseudo {
    color: #7ee787;
  }
  
  html.dark .hljs-subst {
    color: #c9d1d9;
  }
  
  html.dark .hljs-section {
    color: #1f6feb;
    font-weight: bold;
  }
  
  html.dark .hljs-bullet {
    color: #f2cc60;
  }
  
  html:not(.dark) .hljs-emphasis {
    color: #1f6feb;
    font-style: italic;
  }
  
  html.dark .hljs-emphasis {
    color: #c9d1d9;
    font-style: italic;
  }
  
  html.dark .hljs-strong {
    color: #c9d1d9;
    font-weight: bold;
  }
`;

// Create style tag with our custom styles
const StyleTag = () => {
  useEffect(() => {
    // Add the style tag to the head
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'highlight-js-styles';
    style.appendChild(document.createTextNode(highlightjsThemeStyles));
    document.head.appendChild(style);
    
    return () => {
      // Clean up on unmount
      const existingStyle = document.getElementById('highlight-js-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);
  
  return null;
};

// Simplified function to load only HTML syntax highlighting
const loadLanguage = async () => {
  try {
    // Always load XML module (which handles HTML in highlight.js)
    const languageModule = await import('highlight.js/lib/languages/xml');
    
    // Register the language with highlight.js
    hljs.registerLanguage('xml', languageModule.default);
    
    return 'xml'; // XML module handles HTML in highlight.js
  } catch (error) {
    console.error('Could not load HTML language module', error);
    return null;
  }
};

// Load HTML language module on component mount
(async function preloadHtmlLanguage() {
  await loadLanguage();
})();

const CodeBlock = ({ inline, className, children }) => {
  // Ignore any language specified in the className
  const code = String(children).replace(/\n$/, '');
  
  // Always use HTML (xml in highlight.js) regardless of content or specified language
  const [lang] = useState('html');
  
  const codeRef = useRef(null);
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Check if the document has dark mode class
  const [isDarkMode, setIsDarkMode] = useState(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  
  // Include the StyleTag component to inject our custom styles
  const styleTagRef = useRef(<StyleTag />);
  // Load HTML language module on mount
  useEffect(() => {
    if (codeRef.current) {
      // We've already preloaded the HTML language module
      setIsLanguageLoaded(true);
    }
  }, []);
  
  // Effect to detect theme changes in the document
  useEffect(() => {
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    // Set up a MutationObserver to watch for theme class changes
    if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            handleThemeChange();
          }
        });
      });
      
      observer.observe(document.documentElement, { attributes: true });
      
      return () => observer.disconnect();
    }
  }, []);

  // Apply HTML syntax highlighting when component mounts or code changes
  useEffect(() => {
    if (codeRef.current && isLanguageLoaded) {
      // Always set the language class to HTML
      codeRef.current.className = 'language-html hljs w-full';
      
      // Force highlight.js to use HTML highlighting
      hljs.highlightElement(codeRef.current);
    }
  }, [code, isLanguageLoaded]);

  const handleCopyCode = () => {
    // Use newer navigator.clipboard API if available, fallback to execCommand
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Error copying code: ', err);
      }
      document.body.removeChild(textArea);
    }
  };

  if (inline) {
    return (
      <>
        {styleTagRef.current}
        <code className={`language-html hljs px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm border border-gray-200 dark:border-gray-700`}>
          {children}
        </code>
      </>
    );
  }

  return (
    <div className="relative group my-4">
      {styleTagRef.current}
      <div className="absolute right-2 top-2 z-10">
        {/* Copy button */}
        <button 
          onClick={handleCopyCode} 
          className="copy-code-button flex items-center justify-center rounded-md p-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ease-in-out shadow-sm border border-gray-200 dark:border-gray-700"
          aria-label="Copiar código"
          title="Copiar código"
        >
          {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
          <span className="ml-1 hidden sm:inline">{copied ? 'Copiado!' : 'Copiar'}</span>
        </button>
      </div>
      
      {/* HTML Language indicator */}
      <div className="absolute left-2 top-0 -mt-3 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-md border border-gray-200 dark:border-gray-700">
        html
      </div>
      
      <pre className={`${className || ''} overflow-x-auto p-4 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm leading-relaxed font-mono`}>
        <code ref={codeRef} className="language-html hljs w-full">
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;