import React, { useState, useEffect, useCallback, Suspense } from 'react';
import './App.css';
import './styles/global.css'; // Seus estilos globais (incluindo variáveis de tema)

// Lazy load components
const ChatHeader = React.lazy(() => import('./components/ChatHeader'));
const MessagesDisplay = React.lazy(() => import('./components/MessagesDisplay'));
const MessageInput = React.lazy(() => import('./components/MessageInput'));
const ScoreDisplay = React.lazy(() => import('./components/ScoreDisplay'));
const LearningPath = React.lazy(() => import('./components/LearningPath'));
const Home = React.lazy(() => import('./components/home'));

// Simple loading component
const Loading = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Carregando...</p>
  </div>
);

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('html_intro');
  const [currentMode, setCurrentMode] = useState('iniciante');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [learningTopics, setLearningTopics] = useState({});
  // Estado inicial para mostrar a tela de login.
  // A trilha de aprendizado será mostrada após o login.
  const [showLearningPath, setShowLearningPath] = useState(false); 
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [correctExercisesCount, setCorrectExercisesCount] = useState(0);
  const [totalExercisesAttempted, setTotalExercisesAttempted] = useState(0);
  const [lastMessageIsExercise, setLastMessageIsExercise] = useState(false);
  const [hasEvaluatedLastExercise, setHasEvaluatedLastExercise] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);

  // Função para gerar perguntas sugeridas com base no tópico e modo
  const generateSuggestedQuestions = useCallback((topicKey, mode) => {
    const questions = [];
    const topicName = learningTopics[topicKey]?.name || 'este tópico';

    if (mode === 'iniciante') {
      questions.push(`O que é ${topicName}?`);
      questions.push(`Quais os conceitos básicos de ${topicName}?`);
      questions.push(`Poderia dar um exemplo simples de ${topicName}?`);
    } else if (mode === 'intermediario') {
      questions.push(`Como posso aplicar ${topicName} em um projeto real?`);
      questions.push(`Quais são as melhores práticas para ${topicName}?`);
      questions.push(`Existe algum problema comum ao usar ${topicName} e como resolvê-lo?`);
    } else if (mode === 'avancado') {
      questions.push(`Explique as nuances avançadas de ${topicName}.`);
      questions.push(`Quais são os casos de uso complexos para ${topicName}?`);
      questions.push(`Compare ${topicName} com tecnologias alternativas.`);
    }

    // Adicionar perguntas gerais independentemente do modo/tópico
    questions.push("Poderia me dar um exercício sobre o tema atual?");
    questions.push("Quais os próximos passos na trilha de aprendizado?");

    return questions;
  }, [learningTopics]);

  // Efeito para carregar os tópicos de aprendizado do backend
  useEffect(() => {
    const fetchLearningTopics = async () => {
      try {
        const response = await fetch('/api/get-learning-topics'); // ALTERADO: Caminho relativo
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLearningTopics(data);
      } catch (error) {
        console.error("Falha ao buscar tópicos de aprendizado:", error);
      }
    };

    fetchLearningTopics();
  }, []);

  // Efeito para gerar perguntas sugeridas sempre que o tópico ou modo muda
  useEffect(() => {
    if (Object.keys(learningTopics).length > 0) {
      setSuggestedQuestions(generateSuggestedQuestions(currentTopic, currentMode));
    }
  }, [currentTopic, currentMode, generateSuggestedQuestions, learningTopics]);

  // Efeito para aplicar a classe 'dark' ao elemento html e salvar a preferência
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Efeito para carregar o histórico e a sessão se existir
  useEffect(() => {
    // Apenas carrega o tema salvo, se houver.
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }

    const storedSessionId = localStorage.getItem('sessionId');
    const storedTopic = localStorage.getItem('currentTopic');
    const storedMode = localStorage.getItem('currentMode');
    const storedMessages = sessionStorage.getItem('chatMessages');
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');
    const storedCorrectExercises = localStorage.getItem('correctExercisesCount');
    const storedTotalExercises = localStorage.getItem('totalExercisesAttempted');

    if (storedSessionId) {
      setSessionId(storedSessionId);
      setShowLearningPath(false); // Se há sessão, pula a tela de login
      if (storedTopic) setCurrentTopic(storedTopic);
      if (storedMode) setCurrentMode(storedMode);
      if (storedMessages) setMessages(JSON.parse(storedMessages));
      if (storedUserName) setUserName(storedUserName);
      if (storedUserEmail) setUserEmail(storedUserEmail);
      setCorrectExercisesCount(parseInt(storedCorrectExercises) || 0);
      setTotalExercisesAttempted(parseInt(storedTotalExercises) || 0);
      fetchScores(storedSessionId); // Pega as pontuações do backend

      // Inicializa o histórico da sessão no backend, se necessário
      // ALTERADO: Caminho relativo
      fetch('/api/start-session', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: storedUserName, userEmail: storedUserEmail, sessionId: storedSessionId })
      }).then(response => response.json())
        .then(data => {
          console.log("Sessão reativada no backend.");
        })
        .catch(error => console.error("Erro ao reativar sessão:", error));
    }
  }, []); // Dependência vazia para rodar apenas uma vez na montagem

  const fetchScores = async (currentSessionId) => {
    try {
      const response = await fetch(`/api/get-scores?sessionId=${currentSessionId}`); // ALTERADO: Caminho relativo
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCorrectExercisesCount(data.correct);
      setTotalExercisesAttempted(data.total);
    } catch (error) {
      console.error("Failed to fetch scores:", error);
    }
  };

  // Efeito para salvar a sessão e configurações no localStorage/sessionStorage
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('currentTopic', currentTopic);
      localStorage.setItem('currentMode', currentMode);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userEmail', userEmail);
    }
    sessionStorage.setItem('chatMessages', JSON.stringify(messages)); // Salva mensagens
    localStorage.setItem('correctExercisesCount', correctExercisesCount);
    localStorage.setItem('totalExercisesAttempted', totalExercisesAttempted);

  }, [sessionId, currentTopic, currentMode, messages, userName, userEmail, correctExercisesCount, totalExercisesAttempted]);

  const handleStartJourney = async (name, email) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/start-session', { // ALTERADO: Caminho relativo
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: name, userEmail: email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      setCurrentTopic(data.currentTopic);
      setCurrentMode(data.currentMode);
      setUserName(name);
      setUserEmail(email);
      setShowLearningPath(true); // Vai para a trilha após o login
      setMessages([]); // Limpa mensagens para nova sessão
      setCorrectExercisesCount(0);
      setTotalExercisesAttempted(0);
      setLastMessageIsExercise(false);
      setHasEvaluatedLastExercise(false);
    } catch (error) {
      console.error("Erro ao iniciar a sessão:", error);
      // Usar uma modal ou mensagem na UI em vez de alert
      // alert("Falha ao iniciar a sessão. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Nova função para enviar a mensagem do usuário para o tutor
  const sendUserMessageToTutor = async (messageText) => {
    if (!messageText.trim() || !sessionId || isLoading) return;

    const newMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage(''); // Limpa o input após enviar
    setIsLoading(true);
    setLastMessageIsExercise(false);
    setHasEvaluatedLastExercise(false);

    try {
      const response = await fetch('/api/chat', { // ALTERADO: Caminho relativo
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText, // Usa o messageText passado como argumento
          sessionId: sessionId,
          currentTopic: currentTopic,
          currentMode: currentMode,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const tutorResponse = {
        id: messages.length + 2,
        text: data.response,
        sender: 'tutor',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, tutorResponse]);
      setLastMessageIsExercise(data.isExercise);

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: messages.length + 2,
          text: "Desculpe, não consegui processar sua solicitação no momento. Tente novamente mais tarde.",
          sender: 'tutor',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // handleSendMessage agora apenas chama a nova função sendUserMessageToTutor
  const handleSendMessage = async (e) => {
    e.preventDefault();
    sendUserMessageToTutor(inputMessage);
  };

  const handleTopicChange = (e) => {
    const newTopic = e.target.value;
    setCurrentTopic(newTopic);
    const initialMessage = `Estou a começar o tópico: ${learningTopics[newTopic]?.name}.`;
    sendUserMessageToTutor(initialMessage); // Envia a mensagem inicial ao tutor
  };

  const handleModeChange = (e) => {
    const newMode = e.target.value;
    setCurrentMode(newMode);
    const initialMessage = `Mudei para o modo ${newMode}.`;
    sendUserMessageToTutor(initialMessage); // Envia a mensagem inicial ao tutor
  };

  const handleFeedback = async (messageId, feedbackType, messageText) => {
    try {
      const response = await fetch('/api/feedback', { // ALTERADO: Caminho relativo
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, feedbackType, messageText, sessionId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "success") {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, feedback: feedbackType, feedbackShown: true } : msg
          )
        );
      }
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleBackToPath = () => {
    setShowLearningPath(true);
  };

  const handleTopicSelect = (topicKey) => {
    setCurrentTopic(topicKey);
    setShowLearningPath(false); // Esconde a trilha para mostrar o chat
    setMessages([]); // Limpa as mensagens ao mudar de tópico
    setLastMessageIsExercise(false); // Reseta o estado do exercício
    setHasEvaluatedLastExercise(false); // Reseta a avaliação do exercício

    const topicName = learningTopics[topicKey]?.name || topicKey;
    // Gera uma pergunta para o usuário e a envia automaticamente
    const suggested = generateSuggestedQuestions(topicKey, currentMode);
    if (suggested.length > 0) {
      sendUserMessageToTutor(suggested[0]); // Envia a primeira pergunta sugerida automaticamente
    } else {
      // Se não houver sugestões, ainda envia uma mensagem inicial
      sendUserMessageToTutor(`Olá! Estou pronto para aprender sobre "${topicName}".`);
    }
  };

  const handleExerciseEvaluation = async (isCorrect) => {
    setHasEvaluatedLastExercise(true); // Marca que o exercício foi avaliado

    try {
      const response = await fetch('/api/exercise-evaluation', { // ALTERADO: Caminho relativo
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, isCorrect }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCorrectExercisesCount(data.scores.correct);
      setTotalExercisesAttempted(data.scores.total);
    } catch (error) {
      console.error("Erro ao avaliar exercício:", error);
    }
  };

  // Nova função para lidar com o clique nas perguntas sugeridas
  const handleSuggestedQuestionClick = (question) => {
    sendUserMessageToTutor(question); // Envia a pergunta sugerida diretamente
  };

  // Se não houver sessionId e userName, exibe a tela inicial (Home)
  if (!sessionId && !userName) {
    return (
      <Suspense fallback={<Loading />}>
        <Home onStartJourney={handleStartJourney} />
      </Suspense>
    );
  }

  return (
    <div className={`app-container`}>
      {showLearningPath ? (
        <Suspense fallback={<Loading />}>
          <LearningPath
            learningTopics={learningTopics}
            onTopicSelect={handleTopicSelect}
            currentTopic={currentTopic}
          />
        </Suspense>
      ) : (
        <div className="chat-container">
          <Suspense fallback={<Loading />}>
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
            <MessagesDisplay
              messages={messages}
              isLoading={isLoading}
              handleFeedback={handleFeedback}
              lastMessageIsExercise={lastMessageIsExercise}
              hasEvaluatedLastExercise={hasEvaluatedLastExercise}
              handleExerciseEvaluation={handleExerciseEvaluation}
            />
            <MessageInput
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              isLoading={isLoading}
              suggestedQuestions={suggestedQuestions} /* Adicionado */
              onSuggestedQuestionClick={handleSuggestedQuestionClick} /* Adicionado */
            />
            <ScoreDisplay
              correctExercisesCount={correctExercisesCount}
              totalExercisesAttempted={totalExercisesAttempted}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}

export default App;
