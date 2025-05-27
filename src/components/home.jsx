import React, { useState } from 'react';
import { FaDiscord } from 'react-icons/fa'; // Importa o ícone do Discord
import meuAvatar from '../assets/img/meu_avatarr.png'; // Corrected path to avatar image

const Home = ({ onStartJourney }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [nameError, setNameError] = useState(''); // Estado para erro do nome

  // Validação de nome para não permitir números ou caracteres especiais
  const isValidName = (name) => {
    // Regex para permitir apenas letras (maiúsculas e minúsculas, incluindo acentos) e espaços
    return /^[\p{L}\s]+$/u.test(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validação de campos vazios
    if (userName.trim() === '' || userEmail.trim() === '') {
      setNameError(userName.trim() === '' ? 'O nome é obrigatório.' : '');
      if (userEmail.trim() === '') {
        // Você pode definir um estado de erro para o email aqui se quiser uma mensagem específica
        // Ex: setEmailError('O e-mail é obrigatório.');
        // Por enquanto, apenas retornamos para impedir o envio.
        return;
      }
      return;
    }

    // 2. Validação de nome no frontend (final, para garantir)
    if (!isValidName(userName)) {
      setNameError('O nome deve conter apenas letras e espaços.');
      return;
    } else {
      setNameError(''); // Limpa o erro se o nome for válido
    }

    // 3. Validação de formato de e-mail simples (ainda mantida no frontend)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      // Você pode exibir uma mensagem de erro aqui se desejar
      // Ex: setEmailError('Formato de e-mail inválido.');
      return;
    }

    // Se tudo estiver OK, prossegue com a jornada
    onStartJourney({ name: userName, email: userEmail });
  };

  return (
    <div className="home-container flex flex-col items-center justify-center p-8 rounded-xl shadow-lg w-full max-w-md transition-colors duration-300 bg-white dark:bg-gray-800 shadow-gray-300 dark:shadow-900">
      <img
        src={meuAvatar}
        alt="Avatar do Tutor"
        className="w-32 h-32 rounded-full mb-6 border-4 border-blue-500 dark:border-blue-400 shadow-md"
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
              setNameError(''); // Limpa erro ao digitar no nome
            }}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            placeholder="Digite seu nome"
            required
          />
          {nameError && (
            <p className="text-red-500 text-sm mt-2">{nameError}</p>
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
            }}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            placeholder="Digite seu email"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-bold hover:bg-blue-700 transition-colors duration-300"
        >
          Começar a Aprender!
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
          <FaDiscord className="text-3xl mr-2" />
          <span className="text-lg font-semibold">Junte-se ao nosso Discord</span>
        </a>
      </div>
    </div>
  );
};

export default Home;
