import React, { useState, lazy, Suspense, useEffect, useRef } from 'react';
// Dynamic import for icons
const FaDiscord = lazy(() => import('react-icons/fa').then(module => ({
  default: module.FaDiscord
})));
const FaArrowRight = lazy(() => import('react-icons/fa').then(module => ({
  default: module.FaArrowRight
})));
const FaArrowLeft = lazy(() => import('react-icons/fa').then(module => ({
  default: module.FaArrowLeft
})));
// Import optimized avatar image
import meuAvatar from '../assets/img/meu_avatarr.png'; // This will be optimized by vite-imagemin

const Home = ({ onStartJourney }) => {
  // Estados básicos
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para o fluxo de etapas
  const [currentStep, setCurrentStep] = useState(1); // 1 = nome, 2 = email
  const [animationDirection, setAnimationDirection] = useState('forward'); // 'forward' ou 'backward'
  const [formTransitioning, setFormTransitioning] = useState(false);
  
  // Refs para os elementos do formulário
  const formRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const continueButtonRef = useRef(null);
  const submitButtonRef = useRef(null);

  // Validação de nome para não permitir números ou caracteres especiais
  const isValidName = (name) => {
    // Regex para permitir apenas letras (maiúsculas e minúsculas, incluindo acentos) e espaços
    return /^[\p{L}\s]+$/u.test(name);
  };

  // Validação de email com regex mais completa
  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };
  // Função para prevenir o comportamento padrão de scroll
  const preventDefaultScroll = (e) => {
    // Previne o comportamento padrão apenas para teclas de seta para cima/baixo
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  };

  // Efeito para adicionar event listeners para prevenir scroll indesejado
  useEffect(() => {
    // Adiciona listeners globais para prevenir comportamento padrão de scroll
    window.addEventListener('keydown', preventDefaultScroll, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', preventDefaultScroll);
    };
  }, []);

  // Efeito para focar nos inputs corretos quando a etapa muda
  useEffect(() => {
    // Pequeno timeout para garantir que o foco seja aplicado após as animações
    const focusTimer = setTimeout(() => {
      if (currentStep === 1 && nameInputRef.current) {
        nameInputRef.current.focus();
      } else if (currentStep === 2 && emailInputRef.current) {
        emailInputRef.current.focus();
      }
    }, 350); // Um pouco mais que a duração da animação (300ms)
    
    return () => clearTimeout(focusTimer);
  }, [currentStep]);

  // Função para navegar para a próxima etapa
  const goToNextStep = () => {
    // Validar o campo atual antes de prosseguir
    if (currentStep === 1) {
      // Validação do nome
      if (userName.trim() === '') {
        setNameError('O nome é obrigatório.');
        return;
      }
      
      if (!isValidName(userName)) {
        setNameError('O nome deve conter apenas letras e espaços.');
        return;
      }

      // Animação
      setAnimationDirection('forward');
      setFormTransitioning(true);
      
      // Aguardar a animação de saída antes de mudar a etapa
      setTimeout(() => {
        setCurrentStep(2);
        setFormTransitioning(false);
      }, 300);
    }
  };

  // Função para voltar para a etapa anterior
  const goToPrevStep = () => {
    if (currentStep === 2) {
      // Animação
      setAnimationDirection('backward');
      setFormTransitioning(true);
      
      // Aguardar a animação de saída antes de mudar a etapa
      setTimeout(() => {
        setCurrentStep(1);
        setFormTransitioning(false);
      }, 300);
    }
  };

  // Manipulação de navegação por teclado para melhorar acessibilidade
  const handleKeyDown = (e, inputType) => {
    // Previne comportamento padrão de scroll para setas
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      
      // Gerencia o foco com base nas teclas de seta
      if (e.key === 'ArrowDown') {
        if (inputType === 'name' && continueButtonRef.current) {
          e.preventDefault();
          continueButtonRef.current.focus();
        } else if (inputType === 'email' && submitButtonRef.current) {
          e.preventDefault();
          submitButtonRef.current.focus();
        }
      } else if (e.key === 'ArrowUp') {
        if (inputType === 'continueBttn' && nameInputRef.current) {
          e.preventDefault();
          nameInputRef.current.focus();
        } else if (inputType === 'submitBttn' && emailInputRef.current) {
          e.preventDefault();
          emailInputRef.current.focus();
        }
      }
    }
    
    // Enter para navegar entre etapas
    if (e.key === 'Enter') {
      if (currentStep === 1 && inputType === 'name' && !e.shiftKey) {
        e.preventDefault();
        goToNextStep();
      } else if (currentStep === 1 && inputType === 'continueBttn') {
        e.preventDefault();
        goToNextStep();
      }
    }
    
    // Tab + Shift para voltar (no email)
    if (e.key === 'Tab' && e.shiftKey && currentStep === 2 && inputType === 'email') {
      e.preventDefault();
      goToPrevStep();
    }
  };

  // Impedir scrolling quando o usuário clicar nos botões
  const preventScrollOnClick = (e) => {
    // Impede que o navegador faça scroll após o clique
    e.preventDefault();
    e.stopPropagation();
    
    // Em dispositivos móveis, remove o foco para evitar que o teclado virtual apareça
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  // Função final de submissão
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Impede comportamentos de scroll indesejados
    preventScrollOnClick(e);
    
    // Evitar submissão durante transição de animação
    if (formTransitioning) return;
    
    // Limpar erros anteriores
    setEmailError('');

    // Validação do email
    if (userEmail.trim() === '') {
      setEmailError('O e-mail é obrigatório.');
      return;
    }
    
    if (!isValidEmail(userEmail)) {
      setEmailError('Por favor, insira um endereço de e-mail válido.');
      return;
    }

    // Mostrar indicador de carregamento
    setIsSubmitting(true);

    try {
      // Se tudo estiver OK, prossegue com a jornada
      await onStartJourney({ 
        name: userName.trim(), 
        email: userEmail.trim() 
      });
    } catch (error) {
      console.error('Erro ao iniciar jornada:', error);
      // Adiciona um feedback visual em caso de erro
      alert('Ocorreu um erro ao iniciar sua jornada. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div 
      className="home-container flex flex-col items-center justify-center p-8 rounded-xl shadow-lg w-full max-w-md transition-colors duration-300 bg-white dark:bg-gray-800 shadow-gray-300 dark:shadow-gray-900"
      // Prevenir eventos de scrolling na div principal
      onWheel={(e) => {
        // Impede o scroll da página quando estiver interagindo com o formulário
        if (formRef.current && formRef.current.contains(e.target)) {
          e.preventDefault();
        }
      }}
    >
      {/* Avatar e Cabeçalho */}
      <img
        src={meuAvatar}
        alt="Avatar do Tutor"
        className="w-32 h-32 rounded-full mb-6 border-4 border-blue-500 dark:border-blue-400 shadow-md transform hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">Bem-vindo ao Tutor Web!</h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
        Antes de começarmos sua jornada de aprendizado em HTML e CSS, por favor, nos diga um pouco sobre você.
      </p>
      
      {/* Indicador de Progresso */}
      <div className="w-full mb-6 flex items-center justify-between px-2">
        <div className="flex items-center w-full">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
            1
          </div>
          <div className={`h-1 flex-grow mx-2 transition-colors duration-500 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
            2
          </div>
        </div>
      </div>

      {/* Formulário com Etapas */}
      <form 
        ref={formRef}
        onSubmit={handleSubmit} 
        className="w-full flex flex-col gap-4" 
        aria-live="polite"
        // Impedir comportamento padrão de form submit
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
            e.preventDefault();
          }
        }}
      >
        {/* Container para animação de etapas */}
        <div className="relative w-full overflow-hidden">
          {/* Etapa 1: Nome */}
          <div 
            className={`transform transition-transform duration-300 ${
              currentStep === 1 
                ? 'translate-x-0 opacity-100' 
                : animationDirection === 'forward' 
                  ? '-translate-x-full opacity-0 absolute inset-0' 
                  : 'translate-x-full opacity-0 absolute inset-0'
            }`}
            aria-hidden={currentStep !== 1}
          >
            <div className="form-group flex flex-col">
              <label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Seu Nome:</label>
              <input
                type="text"
                id="name"
                ref={nameInputRef}
                value={userName}
                onChange={(e) => {
                  // FILTRAGEM EM TEMPO REAL: remove números e caracteres especiais
                  const inputValue = e.target.value;
                  const filteredValue = inputValue.replace(/[^\p{L}\s]/gu, ''); // Permite apenas letras e espaços
                  setUserName(filteredValue);
                  if (filteredValue.trim() !== '') {
                    setNameError(''); // Limpa erro ao digitar no nome
                  }
                }}
                onKeyDown={(e) => handleKeyDown(e, 'name')}
                onBlur={() => {
                  if (userName.trim() === '') {
                    setNameError('O nome é obrigatório.');
                  } else if (!isValidName(userName)) {
                    setNameError('O nome deve conter apenas letras e espaços.');
                  }
                }}
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 transition-colors ${
                  nameError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Digite seu nome"
                aria-invalid={nameError ? 'true' : 'false'}
                aria-describedby={nameError ? 'name-error' : undefined}
                required
                disabled={currentStep !== 1 || isSubmitting}
              />
              {nameError && (
                <p id="name-error" className="text-red-500 text-sm mt-2 font-medium" role="alert">{nameError}</p>
              )}

              {/* Botão para próxima etapa */}
              <button
                type="button"
                ref={continueButtonRef}
                onClick={(e) => {
                  preventScrollOnClick(e);
                  goToNextStep();
                }}
                onKeyDown={(e) => handleKeyDown(e, 'continueBttn')}
                disabled={isSubmitting || formTransitioning}
                className={`mt-6 py-3 px-6 rounded-lg text-lg font-bold transition-all duration-300 flex items-center justify-center ${
                  isSubmitting || formTransitioning
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:translate-y-0.5'
                } text-white`}
                aria-label="Continuar para o email"
              >
                Continuar
                <Suspense fallback={<div className="w-4 h-4 ml-2"></div>}>
                  <FaArrowRight className="ml-2" />
                </Suspense>
              </button>
            </div>
          </div>

          {/* Etapa 2: Email */}
          <div 
            className={`transform transition-transform duration-300 ${
              currentStep === 2 
                ? 'translate-x-0 opacity-100' 
                : animationDirection === 'forward' 
                  ? 'translate-x-full opacity-0 absolute inset-0' 
                  : '-translate-x-full opacity-0 absolute inset-0'
            }`}
            aria-hidden={currentStep !== 2}
          >
            <div className="form-group flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold">Seu Email:</label>
                <button 
                  type="button" 
                  onClick={(e) => {
                    preventScrollOnClick(e);
                    goToPrevStep();
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm"
                  aria-label="Voltar para o campo de nome"
                >
                  <Suspense fallback={<div className="w-3 h-3 mr-1"></div>}>
                    <FaArrowLeft className="mr-1" />
                  </Suspense>
                  Voltar
                </button>
              </div>
              <input
                type="email"
                id="email"
                ref={emailInputRef}
                value={userEmail}
                onChange={(e) => {
                  setUserEmail(e.target.value);
                  if (e.target.value.trim() !== '') {
                    setEmailError(''); // Limpa erro ao digitar no email
                  }
                }}
                onKeyDown={(e) => handleKeyDown(e, 'email')}
                onBlur={() => {
                  if (userEmail.trim() === '') {
                    setEmailError('O e-mail é obrigatório.');
                  } else if (!isValidEmail(userEmail)) {
                    setEmailError('Por favor, insira um endereço de e-mail válido.');
                  }
                }}
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 transition-colors ${
                  emailError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Digite seu email"
                aria-invalid={emailError ? 'true' : 'false'}
                aria-describedby={emailError ? 'email-error' : undefined}
                required
                disabled={currentStep !== 2 || isSubmitting}
              />
              {emailError && (
                <p id="email-error" className="text-red-500 text-sm mt-2 font-medium" role="alert">{emailError}</p>
              )}

              {/* Botão de submissão final */}
              <button
                type="submit"
                ref={submitButtonRef}
                disabled={isSubmitting || formTransitioning}
                onKeyDown={(e) => handleKeyDown(e, 'submitBttn')}
                className={`mt-6 py-3 px-6 rounded-lg text-lg font-bold transition-all duration-300 ${
                  isSubmitting || formTransitioning
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:translate-y-0.5'
                } text-white`}
                aria-label="Começar a aprender"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando...
                  </span>
                ) : (
                  "Começar a Aprender!"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      {/* Seção para links sociais melhorada */}
      <div className="social-links mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 w-full flex flex-col items-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Conecte-se Conosco!</p>
        <a 
          href="https://discord.gg/zuGxsgy5" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
          aria-label="Junte-se ao nosso Discord"
        >
          <Suspense fallback={<div className="w-6 h-6 mr-2 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>}>
            <FaDiscord className="text-3xl mr-2" />
          </Suspense>
          <span className="text-lg font-semibold">Junte-se ao nosso Discord</span>
        </a>
      </div>
      
      {/* Informações sobre segurança */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        <p>Seus dados estão protegidos e nunca serão compartilhados.</p>
        <p className="mt-1">© {new Date().getFullYear()} Tutor Web - Todos os direitos reservados</p>
      </div>
    </div>
  );
};

export default Home;
