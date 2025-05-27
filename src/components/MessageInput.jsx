import React from 'react';
import SuggestedQuestions from './SuggestedQuestions'; // Importe o componente SuggestedQuestions

const MessageInput = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  suggestedQuestions, // Adicionado
  onSuggestedQuestionClick, // Adicionado
}) => {
  return (
    <form onSubmit={handleSendMessage} className="message-input-form">
      {/* Adicionado o componente SuggestedQuestions aqui */}
      {suggestedQuestions && suggestedQuestions.length > 0 && (
        <div className="suggested-questions-container">
          <SuggestedQuestions
            suggestedQuestions={suggestedQuestions}
            onSuggestedQuestionClick={onSuggestedQuestionClick}
            isLoading={isLoading}
          />
        </div>
      )}
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder={isLoading ? "Aguarde..." : "Pergunte sobre HTML ou CSS..."}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
};

export default MessageInput;
