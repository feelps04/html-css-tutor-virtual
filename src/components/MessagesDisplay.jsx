
    import React, { useRef, useEffect, lazy, Suspense } from 'react';
    import ReactMarkdown from 'react-markdown';

    // Lazy load the CodeBlock component
    const CodeBlock = lazy(() => import('./CodeBlock'));

    // Simple loading component for code blocks
    const CodeBlockLoading = () => (
      <div className="code-block-loading">
        <p>Loading code...</p>
      </div>
    );

    // Custom renderer for code that uses lazy-loaded CodeBlock with Suspense
    const CodeRenderer = (props) => (
      <Suspense fallback={<CodeBlockLoading />}>
        <CodeBlock {...props} />
      </Suspense>
    );

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
              <ReactMarkdown components={{ code: CodeRenderer }}>{msg.text}</ReactMarkdown>
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
    
