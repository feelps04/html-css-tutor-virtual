import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

// Importa os componentes refatorados
import Home from './components/home.jsx';
import LearningPath from './components/LearningPath.jsx';
import ChatHeader from './components/ChatHeader.jsx';
import ScoreDisplay from './components/ScoreDisplay.jsx';
import MessagesDisplay from './components/MessagesDisplay.jsx';
import SuggestedQuestions from './components/SuggestedQuestions.jsx';
import MessageInput from './components/MessageInput.jsx';

function App() {
  // Estados da aplicação
  const [currentPage, setCurrentPage] = useState('home'); // Controla a página atual (home, learningPath, chat)
  const [userData, setUserData] = useState(null); // Dados do usuário (nome, email)
  const [messages, setMessages] = useState([]); // Array de mensagens do chat
  const [inputMessage, setInputMessage] = useState(''); // Mensagem digitada pelo usuário
  const [isLoading, setIsLoading] = useState(false); // Indica se uma requisição está em andamento
  const [sessionId, setSessionId] = useState(null); // ID da sessão para o backend
  const [currentMode, setCurrentMode] = useState('iniciante'); // Modo de dificuldade atual
  const [currentTopic, setCurrentTopic] = useState('html_intro'); // Tópico de aprendizado atual
  const [learningTopics, setLearningTopics] = useState({}); // Tópicos de aprendizado disponíveis
  const [nextTopicSuggestion, setNextTopicSuggestion] = useState(null); // Sugestão de próximo tópico
  const [theme, setTheme] = useState('light'); // Tema atual (light/dark)

  // Estados para o sistema de pontuação e exercícios
  const [totalExercisesAttempted, setTotalExercisesAttempted] = useState(0); // Total de exercícios tentados
  const [correctExercisesCount, setCorrectExercisesCount] = useState(0); // Contagem de exercícios corretos
  const [lastMessageIsExercise, setLastMessageIsExercise] = useState(false); // Indica se a última mensagem do tutor foi um exercício
  const [hasEvaluatedLastExercise, setHasEvaluatedLastExercise] = useState(false); // Indica se o último exercício foi avaliado

  // Efeito para aplicar a classe do tema ao body do documento
  useEffect(() => {
    document.body.className = `${theme}-theme`;
  }, [theme]);

  // Função para alternar o tema entre claro e escuro
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Função para iniciar a jornada do usuário, recebendo dados e buscando tópicos
  const handleStartJourney = (data) => {
    setUserData(data);
    setCurrentPage('learningPath');
    fetchLearningTopics();
  };

  // Função para selecionar um tópico de aprendizado e mudar para a página de chat
  const handleTopicSelect = (topicKey) => {
    setCurrentTopic(topicKey);
    setCurrentPage('chat');
    // Enviar mensagem inicial para o tutor sobre o tópico selecionado
    sendInitialTopicMessage(topicKey);
  };

  // Função para retornar à trilha de aprendizado
  const handleBackToPath = () => {
    setCurrentPage('learningPath');
  };

  // Função assíncrona para buscar os tópicos de aprendizado do backend
  const fetchLearningTopics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/learning_topics'); // Requisição para a API
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLearningTopics(data.topics); // Atualiza os tópicos de aprendizado no estado
    } catch (error) {
      console.error('Erro ao buscar tópicos de aprendizado:', error);
      // Adiciona uma mensagem de erro ao chat se a requisição falhar
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          text: 'Desculpe, não consegui carregar os tópicos de aprendizado no momento.',
          sender: 'tutor',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false); // Finaliza o estado de carregamento
    }
  };

  // Função para enviar mensagens para o backend (bot)
  const sendMessageToBot = useCallback(async (messageText, isUserMessage = true, isExercise = false) => {
    setIsLoading(true);
    setLastMessageIsExercise(isExercise);
    setHasEvaluatedLastExercise(false); // Reinicia o status de avaliação para um novo exercício

    const userMessage = {
      id: uuidv4(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    if (isUserMessage) {
      setMessages((prev) => [...prev, userMessage]); // Adiciona a mensagem do usuário ao chat
      setInputMessage(''); // Limpa o campo de input
    } else {
      // Se não for uma mensagem do usuário (ex: mensagem interna do tutor), apenas adiciona
      setMessages((prev) => [...prev, userMessage]);
    }

    try {
      const payload = {
        message: messageText,
        session_id: sessionId,
        user_name: userData.name,
        user_email: userData.email,
        difficulty: currentMode,
        topic: currentTopic,
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!sessionId) {
        setSessionId(data.session_id); // Define o ID da sessão se ainda não estiver definido
      }

      const tutorMessage = {
        id: uuidv4(),
        text: data.response,
        sender: 'tutor',
        timestamp: new Date().toLocaleTimeString(),
        isExercise: data.is_exercise, // Indica se a resposta do tutor é um exercício
      };

      setMessages((prev) => [...prev, tutorMessage]); // Adiciona a resposta do tutor ao chat
      setNextTopicSuggestion(data.next_topic_suggestion); // Atualiza a sugestão de próximo tópico
      setLastMessageIsExercise(data.is_exercise); // Atualiza o estado se a última mensagem é um exercício

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // Adiciona uma mensagem de erro ao chat
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          text: 'Desculpe, houve um erro ao processar sua solicitação. Tente novamente.',
          sender: 'tutor',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false); // Finaliza o estado de carregamento
    }
  }, [sessionId, userData, currentMode, currentTopic]); // Dependências do useCallback

  // Função para enviar a mensagem do input
  const handleSendMessage = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    if (inputMessage.trim() && !isLoading) {
      sendMessageToBot(inputMessage);
    }
  };

  // Função para enviar uma mensagem inicial quando um tópico é selecionado
  const sendInitialTopicMessage = (topicKey) => {
    const topicName = learningTopics[topicKey]?.name || topicKey;
    const initialMessage = `Olá! Gostaria de aprender sobre "${topicName}" no modo ${currentMode}.`;
    sendMessageToBot(initialMessage, true); // Envia como mensagem do usuário
  };

  // Função para lidar com a mudança de tópico no ChatHeader
  const handleTopicChange = (e) => {
    const newTopic = e.target.value;
    setCurrentTopic(newTopic);
    sendInitialTopicMessage(newTopic); // Envia mensagem inicial para o novo tópico
  };

  // Função para lidar com a mudança de modo de dificuldade
  const handleModeChange = (e) => {
    const newMode = e.target.value;
    setCurrentMode(newMode);
    // Opcional: enviar uma mensagem ao bot informando a mudança de modo
    sendMessageToBot(`Mudei o modo de dificuldade para "${newMode}".`, false);
  };

  // Função para lidar com o clique em uma pergunta sugerida
  const handleSuggestedQuestionClick = (question) => {
    sendMessageToBot(question);
  };

  // Função para lidar com o feedback do usuário sobre as respostas do tutor
  const handleFeedback = (messageId, feedbackType, messageText) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, feedback: feedbackType, feedbackShown: true } : msg
      )
    );
    // Enviar feedback para o backend (opcional)
    // console.log(`Feedback ${feedbackType} para a mensagem: ${messageText}`);
  };

  // Função para avaliar um exercício
  const handleExerciseEvaluation = (isCorrect) => {
    setTotalExercisesAttempted((prev) => prev + 1);
    if (isCorrect) {
      setCorrectExercisesCount((prev) => prev + 1);
    }
    setHasEvaluatedLastExercise(true); // Marca o exercício como avaliado
    // Opcional: enviar feedback de avaliação do exercício para o backend
    sendMessageToBot(`Marquei o exercício como ${isCorrect ? 'correto' : 'incorreto'}.`, false);
  };

  return (
    <div className="app-container">
      {currentPage === 'home' && <Home onStartJourney={handleStartJourney} />}

      {currentPage === 'learningPath' && (
        <LearningPath learningTopics={learningTopics} onTopicSelect={handleTopicSelect} currentTopic={currentTopic} />
      )}

      {currentPage === 'chat' && (
        <div className="chat-interface w-full flex flex-col h-full">
          <ChatHeader
            currentTopic={currentTopic}
            learningTopics={learningTopics}
            handleTopicChange={handleTopicChange}
            currentMode={currentMode}
            handleModeChange={handleModeChange}
            theme={theme}
            toggleTheme={toggleTheme}
            onBackToPath={handleBackToPath}
            isLoading={isLoading}
          />

          <ScoreDisplay
            correctExercisesCount={correctExercisesCount}
            totalExercisesAttempted={totalExercisesAttempted}
          />

          <MessagesDisplay
            messages={messages}
            isLoading={isLoading}
            handleFeedback={handleFeedback}
            lastMessageIsExercise={lastMessageIsExercise}
            hasEvaluatedLastExercise={hasEvaluatedLastExercise}
            handleExerciseEvaluation={handleExerciseEvaluation}
          />

          <SuggestedQuestions
            nextTopicSuggestion={nextTopicSuggestion}
            learningTopics={learningTopics}
            handleTopicChange={handleTopicChange}
            handleSuggestedQuestionClick={handleSuggestedQuestionClick}
            currentTopic={currentTopic}
            isLoading={isLoading}
          />

          <MessageInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}

export default App;
