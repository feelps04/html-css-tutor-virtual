import React, { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

// Importa os componentes refatorados
import Home from './components/home.jsx';
// AvatarCustomization foi removido, então não é mais importado
import LearningPath from './components/LearningPath.jsx';
import ChatHeader from './components/ChatHeader.jsx';
import ScoreDisplay from './components/ScoreDisplay.jsx';
import MessagesDisplay from './components/MessagesDisplay.jsx';
import SuggestedQuestions from './components/SuggestedQuestions.jsx';
import MessageInput from './components/MessageInput.jsx';


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userData, setUserData] = useState(null);
  // O estado avatarParts não é mais necessário, pois a personalização do avatar foi removida.
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentMode, setCurrentMode] = useState('iniciante');
  const [currentTopic, setCurrentTopic] = useState('html_intro');
  const [learningTopics, setLearningTopics] = useState({});
  const [nextTopicSuggestion, setNextTopicSuggestion] = useState(null);
  const [theme, setTheme] = useState('light');

  const [totalExercisesAttempted, setTotalExercisesAttempted] = useState(0);
  const [correctExercisesCount, setCorrectExercisesCount] = useState(0);
  const [lastMessageIsExercise, setLastMessageIsExercise] = useState(false);
  const [hasEvaluatedLastExercise, setHasEvaluatedLastExercise] = useState(false);


  useEffect(() => {
    if (!sessionId) {
      setSessionId(uuidv4());
    }
    fetchLearningTopics();
  }, [sessionId]);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [theme]);

  const fetchLearningTopics = async () => {
    try {
      // Ajuste a URL para usar o proxy do Vercel /api
      const response = await fetch('/api/get-learning-topics');
      if (!response.ok) throw new Error('Falha ao carregar tópicos de aprendizado.');
      const data = await response.json();
      setLearningTopics(data);
    } catch (error) {
      console.error("Erro ao carregar tópicos de aprendizado:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          text: "Erro ao carregar tópicos de aprendizado. Por favor, tente novamente mais tarde.",
          sender: "system-error",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  const sendMessageToBackend = async (messageText, mode, topic) => {
    setIsLoading(true);
    setLastMessageIsExercise(false);
    setHasEvaluatedLastExercise(false);

    try {
      // Ajuste a URL para usar o proxy do Vercel /api
      const response = await fetch('/api/ask-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, sessionId, mode, topic }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const tutorResponse = data.reply;
      const newNextTopic = data.nextTopicSuggestion;
      const updatedTopic = data.currentTopic;

      setMessages((prev) => [
        ...prev,
        { id: uuidv4(), text: tutorResponse, sender: "tutor", timestamp: new Date().toLocaleTimeString() },
      ]);

      if (tutorResponse.toLowerCase().includes('exercício') || tutorResponse.toLowerCase().includes('desafio')) {
        setLastMessageIsExercise(true);
      }

      if (newNextTopic && newNextTopic !== currentTopic) {
        setNextTopicSuggestion(newNextTopic);
        setCurrentTopic(updatedTopic);
      } else {
        setNextTopicSuggestion(null);
        setCurrentTopic(updatedTopic);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem para o backend:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          text: `Desculpe, houve um erro ao processar sua solicitação: ${error.message}. Por favor, tente novamente.`,
          sender: "system-error",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: uuidv4(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    await sendMessageToBackend(inputMessage, currentMode, currentTopic);
  };

  const handleSuggestedQuestionClick = async (question) => {
    const userMessage = {
      id: uuidv4(),
      text: question,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    if (question.toLowerCase().includes('gerar exercício') || question.toLowerCase().includes('gerar exercicio')) {
      setTotalExercisesAttempted(prev => prev + 1);
    }

    await sendMessageToBackend(question, currentMode, currentTopic);
  };

  const handleTopicSelect = (topicKey) => {
    setCurrentTopic(topicKey);
    setCurrentPage('chat');
    setMessages([]);
    setTotalExercisesAttempted(0);
    setCorrectExercisesCount(0);
    setLastMessageIsExercise(false);
    setHasEvaluatedLastExercise(false);
    sendMessageToBackend(`Comece a me ensinar sobre "${learningTopics[topicKey]?.name}".`, currentMode, topicKey);
  };

  const handleTopicChange = async (event) => {
    const newTopicKey = event.target.value;
    const newTopicName = learningTopics[newTopicKey]?.name || "Tópico Desconhecido";

    const userMessage = {
      id: uuidv4(),
      text: `Mudei para o tópico: ${newTopicName}.`,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setCurrentTopic(newTopicKey);
    setNextTopicSuggestion(null);
    setTotalExercisesAttempted(0);
    setCorrectExercisesCount(0);
    setLastMessageIsExercise(false);
    setHasEvaluatedLastExercise(false);

    await sendMessageToBackend(`Inicie a conversa sobre o tópico: ${newTopicName}.`, currentMode, newTopicKey);
  };

  const handleModeChange = async (event) => {
    const newMode = event.target.value;
    const userMessage = {
      id: uuidv4(),
      text: `Mudei o modo para: ${newMode}.`,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setCurrentMode(newMode);
    await sendMessageToBackend(`A partir de agora, responda no modo: ${newMode}.`, newMode, currentTopic);
  };

  const handleFeedback = async (messageId, feedbackType, messageText) => {
    try {
      // Ajuste a URL para usar o proxy do Vercel /api
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, feedbackType, messageText, sessionId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.message);

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId
            ? { ...msg, feedback: feedbackType, feedbackShown: true }
            : msg
        )
      );

      setTimeout(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, feedbackShown: false } : msg
          )
        );
      }, 2000);
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
    }
  };

  const handleExerciseEvaluation = (isCorrect) => {
    if (hasEvaluatedLastExercise) return;

    if (isCorrect) {
      setCorrectExercisesCount(prev => prev + 1);
    }
    setHasEvaluatedLastExercise(true);
    setLastMessageIsExercise(false);
  };

  const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));

  const handleHomeComplete = (data) => {
    setUserData(data);
    // Após a conclusão da Home, agora vai direto para a trilha de aprendizado.
    setCurrentPage('path'); 
  };

  const handleBackToPath = () => {
    setCurrentPage('path');
    setCurrentTopic('html_intro');
    setMessages([]);
    setTotalExercisesAttempted(0);
    setCorrectExercisesCount(0);
    setLastMessageIsExercise(false);
    setHasEvaluatedLastExercise(false);
  };

  return (
    <div className="app-container">
      {currentPage === 'home' && (
        <Home onStartJourney={handleHomeComplete} />
      )}

      {/* A seção de personalização do avatar foi removida */}

      {currentPage === 'path' && (
        <LearningPath
          learningTopics={learningTopics}
          onTopicSelect={handleTopicSelect}
          currentTopic={currentTopic}
        />
      )}

      {currentPage === 'chat' && (
        <div className="chat-container">
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
            hasEvaluatedLastExercise={hasEvalualedLastExercise}
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
