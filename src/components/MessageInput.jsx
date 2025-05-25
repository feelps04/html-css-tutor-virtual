    import React from 'react';

    const MessageInput = ({ inputMessage, setInputMessage, handleSendMessage, isLoading }) => {
      return (
        <form onSubmit={handleSendMessage} className="message-input-form">
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
    