import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // Estilo de tema escuro para o código

const CodeBlock = ({ inline, className, children }) => {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : '';
  const code = String(children).replace(/\n$/, '');
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code]);

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
