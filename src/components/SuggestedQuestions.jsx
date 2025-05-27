
    import React from 'react';

    const SuggestedQuestions = ({
      suggestedQuestions, // Renomeado de nextTopicSuggestion para suggestedQuestions
      onSuggestedQuestionClick,
      isLoading,
    }) => {
      return (
        <div className="suggested-questions">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => onSuggestedQuestionClick(question)}
              disabled={isLoading}
              className="suggested-question-button"
            >
              {question}
            </button>
          ))}
        </div>
      );
    };

    export default SuggestedQuestions;
