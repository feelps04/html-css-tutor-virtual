    import React, { useRef, useEffect, lazy, Suspense, useState, Fragment, useMemo } from 'react';
    // We're replacing ReactMarkdown with a custom solution
    // Importar ícones para os botões de feedback
    const FiThumbsUp = lazy(() => import('react-icons/fi').then(module => ({ default: module.FiThumbsUp })));
    const FiThumbsDown = lazy(() => import('react-icons/fi').then(module => ({ default: module.FiThumbsDown })));

    // Lazy load the CodeBlock component
    const CodeBlock = lazy(() => import('./CodeBlock'));

    // Simple loading component for code blocks
    const CodeBlockLoading = () => (
      <div className="bg-gray-100 dark:bg-gray-800 p-2 xs:p-3 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse my-2 xs:my-3 sm:my-4">
        <div className="text-xs xs:text-sm text-center text-gray-600 dark:text-gray-400">Carregando código...</div>
      </div>
    );

    // Custom markdown processor to avoid nesting issues
    function processMarkdown(text) {
      if (!text) return { html: '', codeBlocks: [] };
      
      // Store code blocks to render them separately
      const codeBlocks = [];
      
      // Replace code blocks with placeholders to prevent them from being processed as markdown
      const textWithoutCodeBlocks = text.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, language, code, offset) => {
        const id = `code-block-${codeBlocks.length}`;
        codeBlocks.push({ id, language, code });
        return `<div class="code-block-placeholder" data-id="${id}"></div>`;
      });
      
      // Basic markdown processing for non-code content
      // This is a simplified version - we focus on common patterns
      let html = textWithoutCodeBlocks
        // Handle headings (# Heading)
        .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
        .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
        .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
        
        // Handle bold and italic
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/_(.+?)_/g, '<em>$1</em>')
        
        // Handle inline code
        .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded text-sm bg-gray-100 dark:bg-gray-800">$1</code>')
        
        // Handle lists
        .replace(/^\s*\*\s+(.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n)+/g, '<ul>$&</ul>')
        
        // Handle numbered lists
        .replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n)+/g, match => {
          // Only wrap in <ol> if not already wrapped in <ul>
          return match.includes('<ul>') ? match : `<ol>${match}</ol>`;
        })
        
        // Handle links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        
        // Handle paragraphs (lines with content)
        .replace(/^([^<\n][^\n]+)$/gm, '<p>$1</p>')
        
        // Fix empty lines
        .replace(/\n\n+/g, '<br/><br/>');
      
      return { html, codeBlocks };
    }
    
    // A component to render markdown content safely
    const MarkdownContent = ({ text }) => {
      // Process markdown only when text changes
      const { html, codeBlocks } = useMemo(() => processMarkdown(text), [text]);
      
      // Function to render HTML with code blocks
      const renderContentWithCodeBlocks = () => {
        // If no code blocks, simply render the HTML
        if (codeBlocks.length === 0) {
          return <div dangerouslySetInnerHTML={{ __html: html }} />;
        }
        
        // Split by code block placeholders
        const parts = html.split(/<div class="code-block-placeholder" data-id="([^"]+)"><\/div>/);
        
        // Render parts with code blocks interleaved
        const result = [];
        for (let i = 0; i < parts.length; i++) {
          // Regular HTML part
          if (parts[i] && parts[i].trim()) {
            result.push(
              <div key={`part-${i}`} dangerouslySetInnerHTML={{ __html: parts[i] }} />
            );
          }
          
          // Code block placeholder
          const codeId = parts[i + 1];
          if (codeId) {
            // Find the matching code block
            const codeBlock = codeBlocks.find(block => block.id === codeId);
            if (codeBlock) {
              result.push(
                <div key={codeId} className="my-4 not-prose">
                  <Suspense fallback={<CodeBlockLoading />}>
                    <CodeBlock className={`language-${codeBlock.language} text-xs xs:text-sm sm:text-base`}>
                      {codeBlock.code}
                    </CodeBlock>
                  </Suspense>
                </div>
              );
            }
            i++; // Skip the next part which is the ID we just processed
          }
        }
        
        return result;
      };
      
      return (
        <div className="markdown-content">
          {renderContentWithCodeBlocks()}
        </div>
      );
    };

    const MessagesDisplay = ({
      messages,
      isLoading,
      handleFeedback,
      lastMessageIsExercise,
      hasEvaluatedLastExercise,
      handleExerciseEvaluation,
    }) => {
      const messagesEndRef = useRef(null);

      useEffect(() => {
        // Scroll to bottom when messages change
        if (messagesEndRef.current) {
          // Use a small timeout to ensure content is rendered before scrolling
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }, [messages]);
      
      // Enhanced scroll performance for mobile
      useEffect(() => {
        const messagesContainer = document.querySelector('.messages-display');
        if (messagesContainer) {
          // Add CSS properties for better scroll performance
          messagesContainer.style.webkitOverflowScrolling = 'touch';
          messagesContainer.style.overscrollBehavior = 'contain';
        }
      }, []);

      return (
        <div className="flex-1 overflow-y-auto p-2 xs:p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 overscroll-contain overscroll-behavior-y-contain -webkit-overflow-scrolling-touch">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`mb-3 xs:mb-4 sm:mb-6 p-2.5 xs:p-3 sm:p-4 rounded-lg animate-fadeIn
                ${msg.sender === 'user' 
                  ? 'bg-blue-50 dark:bg-blue-900 ml-auto mr-1.5 xs:mr-2 sm:mr-4 max-w-[92%] xs:max-w-[90%] sm:max-w-[80%] md:max-w-[70%]' 
                  : 'bg-white dark:bg-gray-800 mr-auto ml-1.5 xs:ml-2 sm:ml-4 max-w-[92%] xs:max-w-[90%] sm:max-w-[80%] md:max-w-[70%] shadow-sm'
                }`}
            >
              <div className="prose prose-xs xs:prose-sm sm:prose dark:prose-invert max-w-none break-words overflow-x-auto">
                <MarkdownContent text={msg.text} />
              </div>
              
              <div className="flex flex-wrap items-center justify-between mt-2 gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">{msg.timestamp}</span>
                
                {msg.sender === "tutor" && !msg.feedback && (
                  <div className="flex gap-1 xs:gap-2">
                    <button 
                      onClick={() => handleFeedback(msg.id, 'like', msg.text)}
                      aria-label="Feedback positivo"
                      title="Marcar como útil"
                      className="min-h-[44px] min-w-[44px] p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-105 active:scale-95 touch-manipulation"
                    >
                      <Suspense fallback="👍">
                        <FiThumbsUp className="text-blue-500 w-5 h-5" />
                      </Suspense>
                    </button>
                    <button 
                      onClick={() => handleFeedback(msg.id, 'dislike', msg.text)}
                      aria-label="Feedback negativo"
                      title="Marcar como não útil"
                      className="min-h-[44px] min-w-[44px] p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-105 active:scale-95 touch-manipulation"
                    >
                      <Suspense fallback="👎">
                        <FiThumbsDown className="text-red-500 w-5 h-5" />
                      </Suspense>
                    </button>
                  </div>
                )}
              </div>
              
              {msg.feedbackShown && (
                <span className="feedback-confirmation">
                  Feedback {msg.feedback === 'like' ? 'positivo' : 'negativo'} registrado!
                </span>
              )}
              
              {msg.feedbackShown && (
                <span className="block text-xs italic text-gray-500 dark:text-gray-400 mt-1">
                  Feedback {msg.feedback === 'like' ? 'positivo' : 'negativo'} registrado!
                </span>
              )}
              
              {/* Added debug for tracing (remove in production) */}
              {false && (
                <div className="text-xs text-gray-400 mt-2 p-1 border border-gray-200 rounded">
                  <strong>Debug:</strong> ID: {msg.id}, Sender: {msg.sender}
                </div>
              )}
              
              {lastMessageIsExercise && msg.id === messages[messages.length - 1]?.id && msg.sender === "tutor" && !hasEvaluatedLastExercise && (
                <div className="mt-2 xs:mt-3 sm:mt-4 flex flex-col xs:flex-row gap-2">
                  <button 
                    onClick={() => handleExerciseEvaluation(true)} 
                    className="min-h-[44px] bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-lg py-2 px-3 text-sm font-medium transition-colors touch-manipulation flex-1"
                  >
                    Marquei Correto
                  </button>
                  <button 
                    onClick={() => handleExerciseEvaluation(false)} 
                    className="min-h-[44px] bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-lg py-2 px-3 text-sm font-medium transition-colors touch-manipulation flex-1"
                  >
                    Marquei Incorreto
                  </button>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg mr-auto ml-2 sm:ml-4 max-w-[60%] shadow-sm mb-4">
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce delay-200"></span>
                <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce delay-300"></span>
                <span className="ml-1 text-sm">Digitando</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      );
    };

    // Adicionar keyframes para animação de fadeIn
    const fadeInAnimation = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    /* Define custom prose sizes for tiny screens */
    .prose-xs {
      font-size: 0.875rem;
      line-height: 1.5;
    }
    
    .prose-xs p,
    .prose-xs ul,
    .prose-xs ol {
      margin-top: 0.75em;
      margin-bottom: 0.75em;
    }
    
    .prose-xs h1,
    .prose-xs h2,
    .prose-xs h3 {
      margin-top: 1em;
      margin-bottom: 0.5em;
    }
    
    /* Smooth scrolling and touch behavior */
    .overscroll-behavior-y-contain {
      overscroll-behavior-y: contain;
    }
    
    .-webkit-overflow-scrolling-touch {
      -webkit-overflow-scrolling: touch;
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out forwards;
    }
    
    /* Custom scrollbar styles for webkit browsers */
    .scrollbar-thin::-webkit-scrollbar {
      height: 4px;
      width: 4px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 4px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
    }
    
    .dark .scrollbar-thin::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
    }
    
    .dark .scrollbar-thin::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
    }
    `;

    const MessagesDisplayWithAnimations = (props) => (
      <>
        <style>{fadeInAnimation}</style>
        <MessagesDisplay {...props} />
      </>
    );

    export default MessagesDisplayWithAnimations;
    
