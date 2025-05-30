import React, { useState, lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react';
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
  const [userPassword, setUserPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para o fluxo de etapas
  const [currentStep, setCurrentStep] = useState(1); // 1 = nome, 2 = email, 3 = senha
  const [animationDirection, setAnimationDirection] = useState('forward'); // 'forward' ou 'backward'
  const [formTransitioning, setFormTransitioning] = useState(false);
  
  // Refs para os elementos do formulário
  const formRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const continueButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
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
  
  // Validação de senha: mínimo 6 caracteres, pelo menos 1 letra e 1 número
  const isValidPassword = (password) => {
    return password.length >= 6 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  };
  // Função direta para navegar para o próximo campo e aplicar foco
  const directNextStep = () => {
    if (currentStep < 3) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Aplicar foco diretamente
      setTimeout(() => {
        if (nextStep === 2 && emailInputRef.current) {
          emailInputRef.current.focus();
        } else if (nextStep === 3 && passwordInputRef.current) {
          passwordInputRef.current.focus();
        }
      }, 0);
    }
  };
  
  // Função direta para navegar para o campo anterior e aplicar foco
  const directPrevStep = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      // Aplicar foco diretamente
      setTimeout(() => {
        if (prevStep === 1 && nameInputRef.current) {
          nameInputRef.current.focus();
        } else if (prevStep === 2 && emailInputRef.current) {
          emailInputRef.current.focus();
        }
      }, 0);
    }
  };
  
  // Função para focar o próximo input com animação - para botões
  const focusNextInput = () => {
    // Animação
    setAnimationDirection('forward');
    setFormTransitioning(true);
    
    // Determinar a próxima etapa com base na etapa atual
    const nextStep = currentStep < 3 ? currentStep + 1 : currentStep;
    
    // Aguardar a animação de saída antes de mudar a etapa
    setTimeout(() => {
      setCurrentStep(nextStep);
      setFormTransitioning(false);
      
      // Garantir que o foco vá para o campo correto
      setTimeout(() => {
        if (nextStep === 2 && emailInputRef.current) {
          emailInputRef.current.focus();
          console.log('Focando email via botão');
        } else if (nextStep === 3 && passwordInputRef.current) {
          passwordInputRef.current.focus();
          console.log('Focando senha via botão');
        }
      }, 50);
    }, 300);
  };
  
  // Função para focar o input anterior com animação - para botões
  const focusPrevInput = () => {
    // Animação
    setAnimationDirection('backward');
    setFormTransitioning(true);
    
    // Determinar a etapa anterior com base na etapa atual
    const prevStep = currentStep > 1 ? currentStep - 1 : currentStep;
    
    // Aguardar a animação de saída antes de mudar a etapa
    setTimeout(() => {
      setCurrentStep(prevStep);
      setFormTransitioning(false);
      
      // Garantir que o foco vá para o campo correto
      setTimeout(() => {
        if (prevStep === 1 && nameInputRef.current) {
          nameInputRef.current.focus();
          console.log('Focando nome via botão');
        } else if (prevStep === 2 && emailInputRef.current) {
          emailInputRef.current.focus();
          console.log('Focando email via botão');
        }
      }, 50);
    }, 300);
  };
  
  // Função para navegação com teclas de seta - com foco direto
  const handleArrowKeyNavigation = (e) => {
    // Capturar apenas teclas de seta
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      // Impedir comportamento padrão imediatamente
      e.preventDefault();
      e.stopPropagation();
      
      // Mostrar feedback visual para o usuário
      const indicator = document.getElementById('keyboard-nav-indicator');
      if (indicator) {
        indicator.classList.add('visible');
        indicator.textContent = e.key === 'ArrowDown' ? 'Navegando para baixo' : 'Navegando para cima';
        setTimeout(() => indicator.classList.remove('visible'), 800);
      }
      
      // Verificar qual elemento está atualmente focado
      const activeElement = document.activeElement;
      
      // Navegar e aplicar foco diretamente com base no elemento ativo
      if (e.key === 'ArrowDown') {
        // Avançar para o próximo input (nome → email → senha)
        if (activeElement === nameInputRef.current) {
          setCurrentStep(2);
          emailInputRef.current?.focus();
          console.log('Navegando do nome para o email via seta');
        } else if (activeElement === emailInputRef.current) {
          setCurrentStep(3);
          passwordInputRef.current?.focus();
          console.log('Navegando do email para a senha via seta');
        }
      } else if (e.key === 'ArrowUp') {
        // Voltar para o input anterior (senha → email → nome)
        if (activeElement === passwordInputRef.current) {
          setCurrentStep(2);
          emailInputRef.current?.focus();
          console.log('Navegando da senha para o email via seta');
        } else if (activeElement === emailInputRef.current) {
          setCurrentStep(1);
          nameInputRef.current?.focus();
          console.log('Navegando do email para o nome via seta');
        }
      }
      
      // Garantir que o evento não se propague
      return false;
    }
  };
  // Adicione estilos CSS para feedback visual durante a navegação
  useEffect(() => {
    // Adicionar estilos globais para feedback visual
    const style = document.createElement('style');
    style.textContent = `
      .key-nav-active {
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5) !important;
        transition: box-shadow 0.15s ease-in-out !important;
      }
      
      @keyframes focusPulse {
        0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
        70% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0); }
        100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
      }
      
      /* Animação para indicador de navegação por teclado */
      @keyframes pulseIndicator {
        0% { transform: scale(1) translateX(-50%); }
        50% { transform: scale(1.1) translateX(-45%); }
        100% { transform: scale(1) translateX(-50%); }
      }
      
      @keyframes stepChange {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      .step-change {
        animation: stepChange 0.3s ease-out;
      }
      
      input:focus, button:focus {
        animation: focusPulse 0.8s ease-out;
      }
      
      #keyboard-nav-indicator.visible {
        opacity: 1 !important;
        animation: pulseIndicator 0.5s ease-in-out;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Remover o useEffect de foco - agora o foco é gerenciado diretamente pelo handleArrowKeyNavigation

  // Este useEffect foi removido pois é redundante

  // As funções goToNextStep e goToPrevStep continuam para os botões de navegação
  
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
        // Garantir que o foco vá para o campo de email
        setTimeout(() => {
          if (emailInputRef.current) {
            emailInputRef.current.focus();
          }
        }, 50);
      }, 300);
    } else if (currentStep === 2) {
      // Validação do email
      if (userEmail.trim() === '') {
        setEmailError('O e-mail é obrigatório.');
        return;
      }
      
      if (!isValidEmail(userEmail)) {
        setEmailError('Por favor, insira um endereço de e-mail válido.');
        return;
      }

      // Animação
      setAnimationDirection('forward');
      setFormTransitioning(true);
      
      // Aguardar a animação de saída antes de mudar a etapa
      setTimeout(() => {
        setCurrentStep(3);
        setFormTransitioning(false);
        // Garantir que o foco vá para o campo de senha
        setTimeout(() => {
          if (passwordInputRef.current) {
            passwordInputRef.current.focus();
          }
        }, 50);
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
        // Garantir que o foco vá para o campo de nome
        setTimeout(() => {
          if (nameInputRef.current) {
            nameInputRef.current.focus();
          }
        }, 50);
      }, 300);
    } else if (currentStep === 3) {
      // Animação
      setAnimationDirection('backward');
      setFormTransitioning(true);
      
      // Aguardar a animação de saída antes de mudar a etapa
      setTimeout(() => {
        setCurrentStep(2);
        setFormTransitioning(false);
        // Garantir que o foco vá para o campo de email
        setTimeout(() => {
          if (emailInputRef.current) {
            emailInputRef.current.focus();
          }
        }, 50);
      }, 300);
    }
  };

  // Removendo a função handleKeyDown duplicada, pois agora temos o handleArrowKeys centralizado

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
    setPasswordError('');

    // Validação da senha
    if (userPassword.trim() === '') {
      setPasswordError('A senha é obrigatória.');
      return;
    }
    
    if (!isValidPassword(userPassword)) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres, incluindo letras e números.');
      return;
    }

    // Mostrar indicador de carregamento
    setIsSubmitting(true);

    try {
      // Se tudo estiver OK, prossegue com a jornada
      await onStartJourney({ 
        name: userName.trim(), 
        email: userEmail.trim(),
        password: userPassword.trim()
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
      style={{
        '--step-transition-time': '300ms'
      }}
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
          <div className={`h-1 flex-grow mx-2 transition-colors duration-500 ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
            3
          </div>
        </div>
      </div>

      {/* Formulário com Etapas */}
      <form 
        ref={formRef}
        onSubmit={handleSubmit} 
        className="w-full flex flex-col gap-4 transition-all duration-150 relative" 
        aria-live="polite"
        tabIndex="-1"
        // Handler de teclado com prevenção garantida
        onKeyDown={(e) => {
          // Prevenir comportamento padrão para teclas de seta imediatamente
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            e.stopPropagation();
            handleArrowKeyNavigation(e);
            return false;
          }
          // Impedir envio do formulário com Enter em campos de texto
          else if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
            e.preventDefault();
          }
        }}
      >
        {/* Indicador de navegação por teclado */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs py-1 px-3 rounded-full opacity-0 transition-opacity duration-200 font-bold" 
             id="keyboard-nav-indicator"
             aria-live="polite">
          Use ↑↓ para navegar
        </div>
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
                // Remover handler individual - usando apenas o handler global
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
                // Não precisa de onKeyDown aqui - o tratamento é feito no nível do formulário
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
                : animationDirection === 'forward' && currentStep < 3
                  ? 'translate-x-full opacity-0 absolute inset-0' 
                  : animationDirection === 'backward' && currentStep < 2
                    ? '-translate-x-full opacity-0 absolute inset-0'
                    : animationDirection === 'forward' && currentStep > 2
                      ? '-translate-x-full opacity-0 absolute inset-0'
                      : 'translate-x-full opacity-0 absolute inset-0'
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
                // Remover handler individual - usando apenas o handler global
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

              {/* Botão para próxima etapa */}
              <button
                type="button"
                ref={nextButtonRef}
                onClick={(e) => {
                  preventScrollOnClick(e);
                  goToNextStep();
                }}
                // Não precisa de onKeyDown aqui - o tratamento é feito no nível do formulário
                disabled={isSubmitting || formTransitioning}
                className={`mt-6 py-3 px-6 rounded-lg text-lg font-bold transition-all duration-300 flex items-center justify-center ${
                  isSubmitting || formTransitioning
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:translate-y-0.5'
                } text-white`}
                aria-label="Continuar para o campo de senha"
              >
                Continuar
                <Suspense fallback={<div className="w-4 h-4 ml-2"></div>}>
                  <FaArrowRight className="ml-2" />
                </Suspense>
              </button>
            </div>
          </div>

          {/* Etapa 3: Senha */}
          <div 
            className={`transform transition-transform duration-300 ${
              currentStep === 3 
                ? 'translate-x-0 opacity-100' 
                : animationDirection === 'forward' 
                  ? 'translate-x-full opacity-0 absolute inset-0' 
                  : '-translate-x-full opacity-0 absolute inset-0'
            }`}
            aria-hidden={currentStep !== 3}
          >
            <div className="form-group flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-semibold">Sua Senha:</label>
                <button 
                  type="button" 
                  onClick={(e) => {
                    preventScrollOnClick(e);
                    goToPrevStep();
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm"
                  aria-label="Voltar para o campo de email"
                >
                  <Suspense fallback={<div className="w-3 h-3 mr-1"></div>}>
                    <FaArrowLeft className="mr-1" />
                  </Suspense>
                  Voltar
                </button>
              </div>
              <input
                type="password"
                id="password"
                ref={passwordInputRef}
                value={userPassword}
                onChange={(e) => {
                  setUserPassword(e.target.value);
                  if (e.target.value.trim() !== '') {
                    setPasswordError(''); // Limpa erro ao digitar a senha
                  }
                }}
                // Remover handler individual - usando apenas o handler global
                onBlur={() => {
                  if (userPassword.trim() === '') {
                    setPasswordError('A senha é obrigatória.');
                  } else if (!isValidPassword(userPassword)) {
                    setPasswordError('A senha deve ter pelo menos 6 caracteres, incluindo letras e números.');
                  }
                }}
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 transition-colors ${
                  passwordError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Digite sua senha"
                aria-invalid={passwordError ? 'true' : 'false'}
                aria-describedby={passwordError ? 'password-error' : undefined}
                required
                disabled={currentStep !== 3 || isSubmitting}
              />
              {passwordError && (
                <p id="password-error" className="text-red-500 text-sm mt-2 font-medium" role="alert">{passwordError}</p>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                A senha deve ter pelo menos 6 caracteres, incluindo letras e números.
              </p>

              {/* Botão de submissão final */}
              <button
                type="submit"
                ref={submitButtonRef}
                disabled={isSubmitting || formTransitioning}
                // Não precisa de onKeyDown aqui - o tratamento é feito no nível do formulário
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
