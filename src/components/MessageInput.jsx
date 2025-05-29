import React, { lazy, Suspense } from 'react';
import SuggestedQuestions from './SuggestedQuestions'; // Importe o componente SuggestedQuestions

// Importação lazy para ícones
const FiSend = lazy(() => import('react-icons/fi').then(module => ({ default: module.FiSend })));

// Componente de fallback para ícones
const IconFallback = () => <span className="animate-pulse w-4 h-4 inline-block bg-gray-300 dark:bg-gray-600 rounded-full"></span>;

const MessageInput = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  suggestedQuestions, // Adicionado
  onSuggestedQuestionClick, // Adicionado
}) => {
  return (
    <form 
      onSubmit={handleSendMessage} 
      className="p-2 xs:p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg" 
      aria-label="Formulário de mensagem"
    >
      {/* Adicionado o componente SuggestedQuestions aqui */}
      {suggestedQuestions && suggestedQuestions.length > 0 && (
        <div 
          className="mb-2 xs:mb-2.5 sm:mb-3 rounded-lg bg-gray-50 dark:bg-gray-700 p-1.5 xs:p-2 sm:p-3 overflow-hidden transition-all" 
          role="region" 
          aria-label="Perguntas sugeridas"
        >
          <div className="mb-1 px-1 flex justify-between items-center">
            <h3 className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Sugestões:</h3>
            <span className="text-xs text-gray-400 dark:text-gray-500 hidden xs:inline-block animate-pulse">
              ← deslize para ver mais →
            </span>
          </div>
          <SuggestedQuestions
            suggestedQuestions={suggestedQuestions}
            onSuggestedQuestionClick={onSuggestedQuestionClick}
            isLoading={isLoading}
          />
        </div>
      )}
      
      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 w-full">
        <label htmlFor="message-input" className="sr-only">Mensagem</label>
        <input
          id="message-input"
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={isLoading ? "Aguarde..." : "Pergunte sobre HTML ou CSS..."}
          disabled={isLoading}
          aria-label="Digite sua mensagem"
          className="flex-grow py-2 sm:py-3 px-2.5 xs:px-3 sm:px-4 rounded-lg 
                    border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-700 
                    text-gray-800 dark:text-gray-200 text-sm sm:text-base
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    transition-all duration-200 shadow-sm
                    placeholder:text-gray-400 dark:placeholder:text-gray-500"
          autoComplete="off"
          style={{ minHeight: '46px', fontSize: '16px' }} /* Para evitar zoom em iOS */
        />
        <button 
          type="submit" 
          disabled={isLoading}
          aria-label={isLoading ? "Enviando mensagem" : "Enviar mensagem"}
          title={isLoading ? "Enviando..." : "Enviar mensagem"}
          className="min-h-[46px] min-w-[46px] sm:h-auto sm:py-2.5 sm:px-4.5 
                    flex items-center justify-center rounded-lg
                    bg-blue-500 hover:bg-blue-600 active:bg-blue-700
                    disabled:bg-blue-300 disabled:cursor-not-allowed
                    text-white font-medium 
                    transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                    touch-manipulation shadow-md
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {/* Ícone para telas pequenas, texto para telas maiores */}
          <span className="sm:hidden">
            <Suspense fallback={<IconFallback />}>
              <FiSend className={`text-xl ${isLoading ? 'animate-pulse' : ''}`} />
            </Suspense>
          </span>
          <span className="hidden sm:inline">
            {isLoading ? "Enviando..." : "Enviar"}
          </span>
        </button>
      </div>
    </form>
  );
};

// Add some custom CSS for better mobile experience
const MessageInputWithStyles = (props) => {
  return (
    <>
      <style jsx="true">{`
        /* Extra small screen optimizations */
        @media (max-width: 359px) {
          .message-input-container input {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            font-size: 0.875rem !important;
          }
        }
        
        /* Add smooth scrolling behavior */
        @media (max-width: 640px) {
          input, button {
            touch-action: manipulation;
          }
        }
        
        /* Prevent iOS zoom on focus */
        @media screen and (max-width: 640px) {
          input[type="text"] {
            font-size: 16px !important;
          }
        }
        
        /* Custom animations */
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      <div className="message-input-container">
        <MessageInput {...props} />
      </div>
    </>
  );
};

export default MessageInputWithStyles;
