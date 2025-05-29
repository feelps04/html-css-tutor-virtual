    import React, { lazy, Suspense } from 'react';
    
    // Importações lazy para ícones para melhorar performance
    const FiSun = lazy(() => import('react-icons/fi').then(module => ({ default: module.FiSun })));
    const FiMoon = lazy(() => import('react-icons/fi').then(module => ({ default: module.FiMoon })));
    const FiArrowLeft = lazy(() => import('react-icons/fi').then(module => ({ default: module.FiArrowLeft })));

    // Componente de fallback para ícones durante carregamento
    const IconFallback = () => <span className="animate-pulse w-4 h-4 inline-block bg-gray-300 dark:bg-gray-600 rounded-full"></span>;
    
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
      // Determina o nome atual do tópico a partir do objeto learningTopics
      const currentTopicName = currentTopic && learningTopics[currentTopic] 
        ? learningTopics[currentTopic].name 
        : 'Tópico atual';

      return (
        <div className="chat-header">
          <div className="flex items-center justify-between mb-2">
            <button 
              className="back-to-path-button md:hidden mr-2" 
              onClick={onBackToPath}
              title="Voltar à trilha de aprendizado"
            >
              <Suspense fallback={<IconFallback />}>
                <FiArrowLeft className="text-lg" />
              </Suspense>
            </button>
            <h1 className="flex-grow">Tutor Virtual de HTML & CSS</h1>
            <button 
              onClick={toggleTheme} 
              className="theme-toggle-button md:hidden"
              title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            >
              <Suspense fallback={<IconFallback />}>
                {theme === 'light' ? <FiMoon className="text-lg" /> : <FiSun className="text-lg" />}
              </Suspense>
            </button>
          </div>
          
          <div className="controls">
            <div className="w-full sm:w-auto">
              <label htmlFor="topic-select" className="sr-only">Selecionar tópico</label>
              <select 
                id="topic-select"
                onChange={handleTopicChange} 
                value={currentTopic} 
                disabled={isLoading}
                aria-label="Selecionar tópico"
                title="Selecionar tópico de estudo"
              >
                {Object.entries(learningTopics).map(([key, topic]) => (
                  <option key={key} value={key}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-full sm:w-auto">
              <label htmlFor="mode-select" className="sr-only">Selecionar nível</label>
              <select 
                id="mode-select"
                onChange={handleModeChange} 
                value={currentMode} 
                disabled={isLoading}
                aria-label="Selecionar nível"
                title="Selecionar nível de dificuldade"
              >
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </div>
            
            <button onClick={toggleTheme} className="theme-toggle-button hidden md:flex items-center">
              <Suspense fallback={<IconFallback />}>
                {theme === 'light' ? <FiMoon className="mr-1" /> : <FiSun className="mr-1" />}
              </Suspense>
              <span className="hidden sm:inline">
                {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
              </span>
            </button>
            
            <button className="back-to-path-button hidden md:flex items-center" onClick={onBackToPath}>
              <Suspense fallback={<IconFallback />}>
                <FiArrowLeft className="mr-1" />
              </Suspense>
              <span>Voltar à Trilha</span>
            </button>
          </div>
          
          {/* Mostrar informações sobre o tópico atual em telas pequenas */}
          <div className="md:hidden mt-2 text-xs text-center text-gray-600 dark:text-gray-400">
            <p>Tópico: <span className="font-semibold">{currentTopicName}</span> • Nível: <span className="font-semibold">{currentMode}</span></p>
          </div>
        </div>
      );
    };

    export default ChatHeader;
    