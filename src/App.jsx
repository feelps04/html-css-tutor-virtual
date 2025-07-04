import React, { useState, useEffect, useCallback, Suspense, Component } from 'react';
import './App.css';
import './styles/global.css'; // Seus estilos globais (incluindo variáveis de tema)
import './styles/responsive-enhancements.css'; // Importa melhorias responsivas adicionais
import meuAvatar from './assets/img/meu_avatarr.png'; // Importing avatar image

// ErrorBoundary para capturar erros de componentes
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erro capturado:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg m-4 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-2">Algo deu errado</h2>
          <p className="mb-4">Tente recarregar a página ou contate o suporte se o problema persistir.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Recarregar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load components
const ChatHeader = React.lazy(() => import('./components/ChatHeader'));
const MessagesDisplay = React.lazy(() => import('./components/MessagesDisplay'));
const MessageInput = React.lazy(() => import('./components/MessageInput'));
const ScoreDisplay = React.lazy(() => import('./components/ScoreDisplay'));
const LearningPath = React.lazy(() => import('./components/LearningPath'));
const Home = React.lazy(() => import('./components/home'));

// Simple loading component com melhorias de responsividade
const Loading = ({ message = "Carregando..." }) => (
  <div className="loading-spinner flex flex-col items-center justify-center h-screen w-full p-4 bg-white dark:bg-gray-800">
    <div className="spinner mb-4"></div>
    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 text-center">{message}</p>
  </div>
);

// Componente para Suspense com mensagens específicas
const LoadingWrapper = ({ children, message }) => (
  <ErrorBoundary>
    <Suspense fallback={<Loading message={message} />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

// Hook para detectar tamanho da tela
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
    isMobile: false,
  });
  
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      setWindowSize({
        width,
        height: window.innerHeight,
        isMobile: width < 640, // Breakpoint SM do Tailwind
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Chamada inicial
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return windowSize;
}

// Função para limpar completamente o localStorage e sessionStorage
function clearAllStorage() {
  console.log("Limpando todo o storage...");
  // Limpar localStorage
  localStorage.removeItem('sessionId');
  localStorage.removeItem('currentTopic');
  localStorage.removeItem('currentMode');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('correctExercisesCount');
  localStorage.removeItem('totalExercisesAttempted');
  
  // Limpar sessionStorage
  sessionStorage.removeItem('chatMessages');
  
  console.log("Storage limpo com sucesso!");
}

function App() {
  // Detectar tamanho da tela para otimizações específicas de dispositivo
  const { isMobile } = useWindowSize();
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('html_intro');
  const [currentMode, setCurrentMode] = useState('iniciante');
  // Check if reset parameter is in URL
  const [shouldResetSession] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('reset') === 'true';
  });
  
  // DEBUG: Sempre inicia como não autenticado para depuração
  const [debugMode] = useState(() => {
    // Verificar se estamos em modo de depuração (force=true na URL)
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('force') === 'true';
  });
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
  // Estado para controlar se o usuário já fez login (visualizou a tela Home)
  // MODIFICADO: Sempre começar como não autenticado (false)
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  // Estado para forçar iniciar pela página inicial
  const [forceStartWithHome, setForceStartWithHome] = useState(true); // MODIFICADO: Sempre começar com a Home
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

  // Efeito para limpar o localStorage/sessionStorage na inicialização
  useEffect(() => {
    console.log("Inicializando App, estado userAuthenticated:", userAuthenticated);
    console.log("Modo de depuração:", debugMode ? "ATIVADO" : "DESATIVADO");
    
    // Se estamos em modo de depuração, sempre limpa o storage
    if (debugMode) {
      console.log("Modo de depuração ativado, limpando storage...");
      clearAllStorage();
      // Alerta para confirmar que estamos em modo de depuração
      alert("App iniciado em modo de depuração. Storage limpo!");
    }
  }, [debugMode]); // Executa apenas uma vez na inicialização

  // Efeito para carregar o histórico e a sessão se existir
  useEffect(() => {
    console.log("Verificando se devemos carregar sessão anterior...");
    
    // Sempre carrega o tema salvo, independente de reset
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }

    // MODIFICADO: Adicionado modo de depuração para forçar reset
    // Se estiver no modo de reset ou forceStartWithHome ou debugMode, não carrega sessão anterior
    if (shouldResetSession || forceStartWithHome || debugMode) {
      console.log("Reset ativado! Não carregando sessão anterior.");
      
      // Limpa a URL para não ficar com o parâmetro reset=true
      if ((shouldResetSession || debugMode) && window.history.pushState) {
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState({ path: newUrl }, '', newUrl);
      }
      return; // Não carrega dados da sessão anterior
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
      // Definir que o usuário está autenticado se existir dados salvos
      if (storedUserName && storedUserEmail) {
        setUserAuthenticated(true);
      }
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
  }, [shouldResetSession, forceStartWithHome]); // Dependências incluem flags de reset

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

  // Adiciona classe 'chat-open' ao body quando estiver na tela de chat
  useEffect(() => {
    if (!showLearningPath) {
      document.body.classList.add('chat-open');
    } else {
      document.body.classList.remove('chat-open');
    }
    
    return () => {
      document.body.classList.remove('chat-open');
    };
  }, [showLearningPath]);

  const handleStartJourney = async (userData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/start-session', { // ALTERADO: Caminho relativo
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: userData.name, userEmail: userData.email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      setCurrentTopic(data.currentTopic);
      setCurrentMode(data.currentMode);
      setUserName(userData.name);
      setUserEmail(userData.email);
      setUserAuthenticated(true); // Marca o usuário como autenticado
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

  // Function to reset session and go back to Home
  const handleLogout = () => {
    console.log("Realizando logout e limpando dados...");
    setUserAuthenticated(false);
    setShowLearningPath(false);
    setMessages([]);
    setForceStartWithHome(true); // Force start with home page on next load
    
    // Usar a função global para limpar todo o storage
    clearAllStorage();
  };

  // Function to reset the session via URL and reload
  const resetAndReload = () => {
    console.log("Redirecionando para reset via URL...");
    // Primeiro limpa todo o storage
    clearAllStorage();
    // Redirect to the same page with force=true parameter (modo de depuração)
    window.location.href = window.location.pathname + '?force=true';
  };

  const handleTopicSelect = (topicKey) => {
    setCurrentTopic(topicKey);
    // Não esconde mais a trilha automaticamente, apenas atualiza o tópico selecionado
    // setShowLearningPath(false); // Removido para manter o usuário na trilha
    
    // Limpa as mensagens ao mudar de tópico (será usado quando ir para o chat)
    setMessages([]); 
    setLastMessageIsExercise(false); // Reseta o estado do exercício
    setHasEvaluatedLastExercise(false); // Reseta a avaliação do exercício
  };
  
  // Nova função para iniciar o gerador de perguntas após seleção do tópico
  const startQuestionGenerator = () => {
    if (!currentTopic) {
      // Se nenhum tópico foi selecionado, mostra um alerta
      alert("Por favor, selecione um tópico da trilha antes de prosseguir.");
      return;
    }
    
    setShowLearningPath(false); // Agora sim esconde a trilha para mostrar o chat
    
    const topicName = learningTopics[currentTopic]?.name || currentTopic;
    // Gera uma pergunta para o usuário e a envia automaticamente
    const suggested = generateSuggestedQuestions(currentTopic, currentMode);
    if (suggested.length > 0) {
      sendUserMessageToTutor(suggested[0]); // Envia a primeira pergunta sugerida automaticamente
    } else {
      // Se não houver sugestões, ainda envia uma mensagem inicial
      sendUserMessageToTutor(`Olá! Estou pronto para aprender sobre \"${topicName}\".`);
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

  // MODIFICADO: Adicionado log para depuração
  console.log("Renderizando App, userAuthenticated =", userAuthenticated);
  
  // Sempre mostra a tela Home se o usuário não estiver autenticado
  if (!userAuthenticated) {
    console.log("Mostrando tela Home (usuário não autenticado)");
    return (
      <div>
        {/* Botão de reset mesmo na tela inicial */}
        <button 
          onClick={resetAndReload}
          className="fixed top-2 right-2 z-50 bg-red-500 dark:bg-red-600 text-white text-xs p-2 rounded-md shadow-md hover:bg-red-600 dark:hover:bg-red-700"
          title="Forçar reinício da aplicação"
        >
          Forçar Reset
        </button>
        
        <LoadingWrapper message="Preparando sua jornada de aprendizado...">
          <Home onStartJourney={handleStartJourney} />
        </LoadingWrapper>
      </div>
    );
  }

  
  return (
    <div className="app-container" role="application" aria-label="Tutor Virtual de Lógica de Programação">
      {/* Botão de reset mais visível no topo da tela */}
      <button 
        onClick={resetAndReload}
        className="fixed top-2 right-2 z-50 bg-red-500 dark:bg-red-600 text-white text-xs p-2 rounded-md shadow-md hover:bg-red-600 dark:hover:bg-red-700 touch-optimized"
        title="Voltar para a tela inicial"
      >
        Reiniciar Aplicação
      </button>
      {showLearningPath ? (
        <LoadingWrapper message="Carregando trilha de aprendizado...">
          <LearningPath
            learningTopics={learningTopics}
            onTopicSelect={handleTopicSelect}
            currentTopic={currentTopic}
            isMobile={isMobile}
            userName={userName}
            userAvatar={meuAvatar}
            onStartQuestionGenerator={startQuestionGenerator}
          />
        </LoadingWrapper>
      ) : (
        <div className="chat-container" role="main">
          <ErrorBoundary>
            <Suspense fallback={<div className="h-14 xs:h-16 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>}>
              <div className="flex-shrink-0 chat-header">
                <ChatHeader
                  learningTopics={learningTopics}
                  handleTopicChange={handleTopicChange}
                  currentMode={currentMode}
                  handleModeChange={handleModeChange}
                  theme={theme}
                  toggleTheme={toggleTheme}
                  onBackToPath={handleBackToPath}
                  onLogout={handleLogout}
                  isLoading={isLoading}
                />
              </div>
            </Suspense>
            
            <ErrorBoundary>
              <Suspense fallback={<div className="flex-grow bg-gray-50 dark:bg-gray-900 animate-pulse flex items-center justify-center"><p>Carregando mensagens...</p></div>}>
                <MessagesDisplay
                  messages={messages}
                  isLoading={isLoading}
                  handleFeedback={handleFeedback}
                  lastMessageIsExercise={lastMessageIsExercise}
                  hasEvaluatedLastExercise={hasEvaluatedLastExercise}
                  handleExerciseEvaluation={handleExerciseEvaluation}
                />
              </Suspense>
            </ErrorBoundary>
            
            <ErrorBoundary>
              <Suspense fallback={<div className="h-20 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>}>
                <MessageInput
                  inputMessage={inputMessage}
                  setInputMessage={setInputMessage}
                  handleSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  suggestedQuestions={suggestedQuestions}
                  onSuggestedQuestionClick={handleSuggestedQuestionClick}
                />
              </Suspense>
            </ErrorBoundary>
            
            <ErrorBoundary>
              <Suspense fallback={<div className="h-8 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>}>
                <ScoreDisplay
                  correctExercisesCount={correctExercisesCount}
                  totalExercisesAttempted={totalExercisesAttempted}
                />
              </Suspense>
            </ErrorBoundary>
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}

export default App;
