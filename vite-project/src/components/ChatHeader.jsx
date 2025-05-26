    import React from 'react';

    const ChatHeader = ({
      currentTopic,
      learningTopics,
      handleTopicChange,
      currentMode,
      handleModeChange,
      theme,
      toggleTheme,
      onBackToPath,
      isLoading,
    }) => {
      return (
        <div className="chat-header">
          <h1>Tutor Virtual de HTML & CSS</h1>
          <div className="controls">
            <select onChange={handleTopicChange} value={currentTopic} disabled={isLoading}>
              {Object.entries(learningTopics).map(([key, topic]) => (
                <option key={key} value={key}>
                  {topic.name}
                </option>
              ))}
            </select>
            <select onChange={handleModeChange} value={currentMode} disabled={isLoading}>
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
            <button onClick={toggleTheme} className="theme-toggle-button">
              {theme === 'light' ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
            </button>
            <button className="back-to-path-button" onClick={onBackToPath}>
              Voltar à Trilha
            </button>
          </div>
        </div>
      );
    };

    export default ChatHeader;
    