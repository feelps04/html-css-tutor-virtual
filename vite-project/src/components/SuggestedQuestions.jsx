
    import React from 'react';

    const SuggestedQuestions = ({
      nextTopicSuggestion,
      learningTopics,
      handleTopicChange,
      handleSuggestedQuestionClick,
      currentTopic,
      isLoading,
    }) => {
      return (
        <div className="suggested-questions">
          {nextTopicSuggestion && (
            <button onClick={() => handleTopicChange({ target: { value: nextTopicSuggestion } })} disabled={isLoading} className="suggested-question-button next-topic">Avançar para: {learningTopics[nextTopicSuggestion]?.name}</button>
          )}
          {currentTopic === "html_intro" && (
            <>
              <button onClick={() => handleSuggestedQuestionClick("O que é HTML?")} disabled={isLoading} className="suggested-question-button">O que é HTML?</button>
              <button onClick={() => handleSuggestedQuestionClick("Qual a estrutura básica de um documento HTML?")} disabled={isLoading} className="suggested-question-button">Estrutura HTML</button>
              <button onClick={() => handleSuggestedQuestionClick("O que são tags e elementos em HTML?")} disabled={isLoading} className="suggested-question-button">Tags HTML</button>
            </>
          )}
          {currentTopic === "html_text" && (
            <>
              <button onClick={() => handleSuggestedQuestionClick("Como criar um parágrafo em HTML?")} disabled={isLoading} className="suggested-question-button">Criar Parágrafo</button>
              <button onClick={() => handleSuggestedQuestionClick("Como fazer uma lista em HTML?")} disabled={isLoading} className="suggested-question-button">Listas em HTML</button>
              <button onClick={() => handleSuggestedQuestionClick("Como adicionar um link em HTML?")} disabled={isLoading} className="suggested-question-button">Adicionar Link</button>
            </>
          )}
          {currentTopic === "css_intro" && (
            <>
              <button onClick={() => handleSuggestedQuestionClick("O que é CSS e para que serve?")} disabled={isLoading} className="suggested-question-button">O que é CSS?</button>
              <button onClick={() => handleSuggestedQuestionClick("Quais as formas de incluir CSS?")} disabled={isLoading} className="suggested-question-button">Incluir CSS</button>
              <button onClick={() => handleSuggestedQuestionClick("O que são seletores CSS?")} disabled={isLoading} className="suggested-question-button">Seletores CSS</button>
            </>
          )}
          {currentTopic === "css_box_model" && (
            <>
              <button onClick={() => handleSuggestedQuestionClick("Explique o Modelo de Caixa do CSS.")} disabled={isLoading} className="suggested-question-button">Modelo de Caixa</button>
              <button onClick={() => handleSuggestedQuestionClick("Qual a diferença entre margin e padding?")} disabled={isLoading} className="suggested-question-button">Margin vs Padding</button>
            </>
          )}
          {["html_media", "html_forms", "css_colors_fonts", "css_flexbox", "css_grid", "responsive_design", "html_css_project"].includes(currentTopic) && (
            <button onClick={() => handleSuggestedQuestionClick(`Gere um exercício sobre ${learningTopics[currentTopic]?.name} para mim!`)} disabled={isLoading} className="suggested-question-button exercise-button">Gerar Exercício</button>
          )}
        </div>
      );
    };

    export default SuggestedQuestions;
    
