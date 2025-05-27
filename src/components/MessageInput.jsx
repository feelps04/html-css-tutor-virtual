import React from 'react';

const MessageInput = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  suggestedQuestions, // Nova prop
  onSuggestedQuestionClick, // Nova prop
}) => {
  return (
    <form onSubmit={handleSendMessage} className="message-input-form">
      {suggestedQuestions && suggestedQuestions.length > 0 && (
        <div className="suggested-questions-container">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              type="button" // Importante: type="button" para não submeter o formulário
              onClick={() => onSuggestedQuestionClick(question)}
              className="suggested-question-button"
              disabled={isLoading}
            >
              {question}
            </button>
          ))}
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
