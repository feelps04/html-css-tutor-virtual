import React, { useState, lazy, Suspense } from 'react';
// Dynamic import for Discord icon
const FaDiscord = lazy(() => import('react-icons/fa').then(module => ({
  default: module.FaDiscord
})));
// Import optimized avatar image
import meuAvatar from '../assets/img/meu_avatarr.png'; // This will be optimized by vite-imagemin

const Home = ({ onStartJourney }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [nameError, setNameError] = useState(''); // Estado para erro do nome
  const [emailError, setEmailError] = useState(''); // Estado para erro do email
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar submissão

  // Validação de nome para não permitir números ou caracteres especiais
  const isValidName = (name) => {
    // Regex para permitir apenas letras (maiúsculas e minúsculas, incluindo acentos) e espaços
    return /^[\p{L}\s]+$/u.test(name);
  };

  // Validação de email com regex mais completa
  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpar erros anteriores
    setNameError('');
    setEmailError('');

    // Flag para verificar se há erros
    let hasErrors = false;

    // 1. Validação de campos vazios
    if (userName.trim() === '') {
      setNameError('O nome é obrigatório.');
      hasErrors = true;
    }

    if (userEmail.trim() === '') {
      setEmailError('O e-mail é obrigatório.');
      hasErrors = true;
    }

    if (hasErrors) return;

    // 2. Validação de nome no frontend
    if (!isValidName(userName)) {
      setNameError('O nome deve conter apenas letras e espaços.');
      hasErrors = true;
    }

    // 3. Validação de formato de e-mail
    if (!isValidEmail(userEmail)) {
      setEmailError('Por favor, insira um endereço de e-mail válido.');
      hasErrors = true;
    }

    if (hasErrors) return;

    // Mostra indicador de carregamento
    setIsSubmitting(true);

    try {
      // Se tudo estiver OK, prossegue com a jornada
      await onStartJourney({ 
        name: userName.trim(), 
        email: userEmail.trim() 
      });
      // Limpar formulário após sucesso (opcional)
      // setUserName('');
      // setUserEmail('');
    } catch (error) {
      console.error('Erro ao iniciar jornada:', error);
      // Poderia adicionar um estado para erro geral do formulário aqui
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="home-container flex flex-col items-center justify-center p-8 rounded-xl shadow-lg w-full max-w-md transition-colors duration-300 bg-white dark:bg-gray-800 shadow-gray-300 dark:shadow-900">
      <img
        src={meuAvatar}
        alt="Avatar do Tutor"
        className="w-32 h-32 rounded-full mb-6 border-4 border-blue-500 dark:border-blue-400 shadow-md"
        loading="lazy"
      />
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Bem-vindo ao Tutor Web!</h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Antes de começarmos sua jornada de aprendizado em HTML e CSS, por favor, nos diga um pouco sobre você.
      </p>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div className="form-group flex flex-col">
          <label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Seu Nome:</label>
          <input
            type="text"
            id="name"
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
          />
          {nameError && (
            <p id="name-error" className="text-red-500 text-sm mt-2 font-medium">{nameError}</p>
          )}
        </div>
        <div className="form-group flex flex-col">
          <label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Seu Email:</label>
          <input
            type="email"
            id="email"
            value={userEmail}
            onChange={(e) => {
              setUserEmail(e.target.value);
              if (e.target.value.trim() !== '') {
                setEmailError(''); // Limpa erro ao digitar no email
              }
            }}
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
          />
          {emailError && (
            <p id="email-error" className="text-red-500 text-sm mt-2 font-medium">{emailError}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-6 py-3 px-6 rounded-lg text-lg font-bold transition-all duration-300 ${
            isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:translate-y-0.5'
          } text-white`}
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
      </form>

      {/* Nova seção para links sociais */}
      <div className="social-links mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 w-full flex flex-col items-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Conecte-se Conosco!</p>
        <a 
          href="https://discord.gg/zuGxsgy5" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
        >
          <Suspense fallback={<div className="w-6 h-6 mr-2 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>}>
            <FaDiscord className="text-3xl mr-2" />
          </Suspense>
          <span className="text-lg font-semibold">Junte-se ao nosso Discord</span>
        </a>
      </div>
    </div>
  );
};

export default Home;
