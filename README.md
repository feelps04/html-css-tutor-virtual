# Tutor Virtual de Lógica de Programação

Um assistente virtual interativo para aprender HTML, CSS e programação, que utiliza inteligência artificial para fornecer um tutor personalizado e responsivo para estudantes.

![Logica de Programação - Tutor Virtual](https://img.shields.io/badge/Tutor%20Virtual-Lógica%20de%20Programação-blue)
![Versão](https://img.shields.io/badge/Versão-1.0.0-green)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Vite](https://img.shields.io/badge/Vite-6-646CFF)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC)

## 📖 Descrição

O Tutor Virtual de Lógica de Programação é uma aplicação web interativa que oferece uma experiência de aprendizado personalizada para iniciantes em programação web. A aplicação simula um tutor virtual que responde perguntas, fornece explicações detalhadas, apresenta exemplos de código e aplica exercícios práticos sobre HTML, CSS e lógica de programação.

A interface é totalmente responsiva e foi otimizada para funcionar perfeitamente em dispositivos móveis, tablets e desktops, permitindo que os estudantes aprendam em qualquer lugar.

## ✨ Funcionalidades

- **Trilha de Aprendizado Personalizada**: Percurso estruturado de tópicos de HTML e CSS
- **Chat Interativo com AI**: Assistente inteligente que responde perguntas e fornece explicações
- **Diferentes Níveis de Dificuldade**: Modos iniciante, intermediário e avançado
- **Sugestões de Perguntas**: Interface intuitiva com sugestões de tópicos e perguntas relevantes
- **Exercícios Práticos**: Desafios para testar o conhecimento adquirido
- **Sistema de Feedback**: Avaliação da utilidade das respostas do tutor
- **Acompanhamento de Progresso**: Contagem de exercícios realizados e acertos
- **Tema Claro/Escuro**: Opção de alternar entre modo claro e escuro para melhor experiência visual
- **Totalmente Responsivo**: Design otimizado para dispositivos móveis, tablets e desktops

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19**: Framework JavaScript para construção da interface
- **Vite 6**: Ferramenta de build ultrarrápida para desenvolvimento
- **Tailwind CSS 3**: Framework CSS para design responsivo
- **React Icons**: Biblioteca de ícones para React
- **React Markdown**: Renderização de markdown para respostas formatadas
- **Monaco Editor**: Editor de código integrado para exemplos interativos
- **Zustand**: Gerenciamento de estado global
- **Firebase**: Autenticação e armazenamento de dados

### Backend
- **Node.js**: Ambiente de execução JavaScript no servidor
- **Express**: Framework web para Node.js
- **Google Gemini API**: Modelo de linguagem para o assistente virtual
- **SQLite**: Banco de dados local para armazenamento de dados de sessão

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js (v18 ou superior)
- npm (v9 ou superior)

### Passos para Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/logica_de_programacao.git
cd logica_de_programacao
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
VITE_GOOGLE_API_KEY=sua_chave_api
VITE_FIREBASE_API_KEY=sua_chave_firebase
VITE_FIREBASE_AUTH_DOMAIN=seu_dominio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse a aplicação em `http://localhost:3000`

## 📱 Recursos Responsivos

A aplicação foi cuidadosamente otimizada para proporcionar uma experiência excelente em todos os tamanhos de tela:

- **Layout Adaptativo**: Reorganização de elementos baseado no tamanho da tela
- **Touch-Friendly**: Controles otimizados para interação por toque em dispositivos móveis
- **Sugestões de Perguntas Responsivas**: Botões de sugestão com texto que se adapta a diferentes tamanhos de tela
- **Interface de Chat Otimizada**: Bolhas de mensagem e entrada de texto responsivas
- **Desempenho Mobile-First**: Carregamento otimizado para conexões móveis
- **Suporte a Gestos**: Navegação intuitiva com suporte a gestos de toque
- **Altura Dinâmica da Viewport**: Utilização de `dvh` para melhor suporte a barras de navegação móveis
- **Safe Areas**: Suporte às "notches" e áreas seguras em dispositivos modernos

## 📂 Estrutura do Projeto

```
logica_de_programacao/
├── api/                   # Backend da aplicação
│   ├── index.js           # Ponto de entrada da API
│   └── routes/            # Rotas da API
├── public/                # Arquivos estáticos
├── src/                   # Código-fonte frontend
│   ├── assets/            # Imagens e recursos
│   ├── components/        # Componentes React
│   │   ├── ChatHeader.jsx          # Cabeçalho do chat
│   │   ├── CodeBlock.jsx           # Componente para exibição de código
│   │   ├── LearningPath.jsx        # Trilha de aprendizado
│   │   ├── MessageInput.jsx        # Input de mensagens
│   │   ├── MessagesDisplay.jsx     # Exibição de mensagens
│   │   ├── ScoreDisplay.jsx        # Placar de exercícios
│   │   ├── SuggestedQuestions.jsx  # Sugestões de perguntas
│   │   └── home.jsx                # Página inicial
│   ├── styles/            # Estilos CSS
│   │   ├── global.css              # Estilos globais
│   │   └── responsive-enhancements.css  # Melhorias responsivas
│   ├── App.jsx            # Componente principal
│   ├── App.css            # Estilos do App
│   ├── main.jsx           # Ponto de entrada do React
│   └── index.css          # Estilos base
├── .gitignore             # Arquivos ignorados pelo Git
├── index.html             # HTML principal
├── package.json           # Dependências e scripts
├── postcss.config.js      # Configuração do PostCSS
├── tailwind.config.js     # Configuração do Tailwind
├── vite.config.js         # Configuração do Vite
└── README.md              # Este arquivo
```

## 🌐 Implantação

### Implantação na Vercel

O projeto está configurado para fácil implantação na Vercel:

1. Faça login ou crie uma conta em [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub à Vercel
3. Configure as variáveis de ambiente necessárias no painel da Vercel
4. Implante o projeto com um clique

Alternativamente, você pode implantar diretamente via CLI:

```bash
# Instale a CLI da Vercel
npm install -g vercel

# Faça login
vercel login

# Implante
vercel
```

### Configurações de Produção

O arquivo `vercel.json` na raiz do projeto contém todas as configurações necessárias para uma implantação bem-sucedida, incluindo redirecionamentos para a API e configurações de cache.

## 🔮 Melhorias Futuras

- **Módulo de Exercícios Expandido**: Mais exercícios práticos com feedback detalhado
- **Editor de Código Interativo**: Permitir que os usuários editem e executem código diretamente na plataforma
- **Integração com GitHub**: Salvar projetos e exercícios no GitHub do usuário
- **Modo Offline**: Funcionalidades básicas disponíveis sem conexão à internet
- **Gamificação**: Sistema de pontos, conquistas e desafios para aumentar o engajamento
- **Comunidade**: Fórum de discussão para estudantes trocarem experiências
- **Múltiplos Idiomas**: Suporte para outros idiomas além do português
- **Acessibilidade Aprimorada**: Melhorias de acessibilidade para usuários com necessidades especiais
- **Modo de Colaboração**: Permitir que múltiplos usuários trabalhem juntos em tempo real

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 👥 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests para melhorar o projeto.

---

Desenvolvido com ❤️ para ajudar pessoas a aprenderem programação de forma interativa e acessível.

# 📚 Tutor Virtual de HTML & CSS

![Avatar do Tutor](https://github.com/feelps04/html-css-tutor-virtual/blob/main/src/assets/img/meu_avatar.png?raw=true)

Um tutor interativo baseado em IA para auxiliar no aprendizado de HTML e CSS. Este projeto foi desenvolvido com React (Vite) para o frontend e Flask para o backend, utilizando a API Gemini para fornecer respostas inteligentes e personalizadas.

## ✨ Funcionalidades

* **Trilha de Aprendizado Personalizada:** Siga um caminho estruturado de tópicos de HTML e CSS, desde o básico até conceitos avançados.
* **Modos de Dificuldade:** Altere a profundidade e complexidade das explicações entre "Iniciante", "Intermediário" e "Avançado".
* **Conversa Interativa:** Tire suas dúvidas e receba explicações detalhadas sobre qualquer conceito de HTML e CSS.
* **Exercícios Interativos:** Responda a perguntas para testar seu conhecimento e receba feedback instantâneo.
* **Sistema de Pontuação:** Acompanhe seu progresso nos exercícios.
* **Feedback de Mensagens:** Avalie as respostas do tutor (like/dislike) para ajudar a melhorar a qualidade do aprendizado.
* **Temas Claro/Escuro:** Alterne entre os modos de visualização para maior conforto.
* **Avatar Personalizável:** (Funcionalidade anteriormente considerada, se não estiver presente, remova este item ou ajuste a descrição).
* **Integração com Discord:** Junte-se à nossa comunidade para mais discussões e suporte.

## 🚀 Tecnologias Utilizadas

* **Frontend:**
    * [React](https://react.dev/) (com [Vite](https://vitejs.dev/) para o bundling)
    * [Tailwind CSS](https://tailwindcss.com/) (para estilização rápida e responsiva)
    * [React Icons](https://react-icons.github.io/react-icons/) (para ícones como o do Discord)
* **Backend:**
    * [Python](https://www.python.org/)
    * [Flask](https://flask.palletsprojects.com/) (para a API REST)
    * [Google Gemini API](https://ai.google.dev/models/gemini) (para inteligência artificial e geração de respostas)
    * [python-dotenv](https://pypi.org/project/python-dotenv/) (para gerenciamento de variáveis de ambiente)
    * [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/) (para lidar com requisições cross-origin)
    * [uuid](https://docs.python.org/3/library/uuid.html) (para geração de IDs de sessão)

## 🛠️ Como Executar o Projeto Localmente

Siga estas instruções para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

* Node.js (versão LTS recomendada)
* Python (versão 3.8+)
* npm ou yarn
* pip

### 1. Configuração do Backend (API Flask)

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/feelps04/html-css-tutor-virtual.git](https://github.com/feelps04/html-css-tutor-virtual.git)
    cd html-css-tutor-virtual
    ```

2.  **Crie um ambiente virtual (recomendado):**
    ```bash
    python -m venv venv
    ```

3.  **Ative o ambiente virtual:**
    * **Windows:**
        ```bash
        .\venv\Scripts\activate
        ```
    * **macOS/Linux:**
        ```bash
        source venv/bin/activate
        ```

4.  **Instale as dependências Python:**
    ```bash
    pip install -r requirements.txt
    ```
    *(Se você não tiver um `requirements.txt`, pode criá-lo com `pip freeze > requirements.txt` após instalar as libs manualmente (`flask`, `flask-cors`, `python-dotenv`, `google-generativeai`, `uuid`)*

5.  **Configure a API Key do Google Gemini:**
    * Crie um arquivo `.env` na raiz do diretório `backend` (ou na raiz do projeto, se o seu `index.py` estiver lá).
    * Obtenha sua chave da API Gemini em [Google AI Studio](https://aistudio.google.com/app/apikey).
    * Adicione a chave ao arquivo `.env`:
        ```
        GOOGLE_API_KEY=SUA_CHAVE_API_AQUI
        ```

6.  **Inicie o servidor Flask:**
    ```bash
    flask run
    ```
    O servidor backend estará rodando em `http://127.0.0.1:5000/`.

### 2. Configuração do Frontend (React com Vite)

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd frontend # Ou o nome da sua pasta do frontend, se houver uma. Caso contrário, você já estará na raiz do projeto.
    ```

2.  **Instale as dependências Node.js:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Inicie o aplicativo React:**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```
    O aplicativo frontend estará acessível em `http://localhost:5173/` (ou outra porta, conforme indicado pelo Vite).

## ☁️ Deploy no Vercel

Este projeto está configurado para um deploy fácil no [Vercel](https://vercel.com/).

1.  **Conecte seu repositório Git** (`https://github.com/feelps04/html-css-tutor-virtual.git`) à sua conta Vercel.
2.  Ao importar o projeto, o Vercel deve detectar automaticamente a configuração do Vite.
3.  **Configure as variáveis de ambiente** no Vercel Dashboard (em `Project Settings -> Environment Variables`), adicionando `GOOGLE_API_KEY` com sua chave da API.
4.  Realize o deploy!

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.

---

**Conecte-se Conosco!**

[![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/zuGxsgy5)
