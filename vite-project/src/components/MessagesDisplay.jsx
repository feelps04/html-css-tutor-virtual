    import React, { useRef, useEffect } from 'react';
    import ReactMarkdown from 'react-markdown';
    import CodeBlock from './CodeBlock'; // Certifique-se que o caminho esteja correto

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
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);

      return (
        <div className="messages-display">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <ReactMarkdown components={{ code: CodeBlock }}>{msg.text}</ReactMarkdown>
              <span className="timestamp">{msg.timestamp}</span>
              {msg.sender === "tutor" && !msg.feedback && (
                <div className="feedback-buttons">
                  <button onClick={() => handleFeedback(msg.id, 'like', msg.text)}>👍</button>
                  <button onClick={() => handleFeedback(msg.id, 'dislike', msg.text)}>👎</button>
                </div>
              )}
              {msg.feedbackShown && (
                <span className="feedback-confirmation">
                  Feedback {msg.feedback === 'like' ? 'positivo' : 'negativo'} registrado!
                </span>
              )}
              {lastMessageIsExercise && msg.id === messages[messages.length - 1]?.id && msg.sender === "tutor" && !hasEvaluatedLastExercise && (
                <div className="exercise-evaluation-buttons">
                  <button onClick={() => handleExerciseEvaluation(true)} className="exercise-correct-button">Marquei Correto</button>
                  <button onClick={() => handleExerciseEvaluation(false)} className="exercise-incorrect-button">Marquei Incorreto</button>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="message tutor loading">
              <span>Digitando...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      );
    };

    export default MessagesDisplay;
    