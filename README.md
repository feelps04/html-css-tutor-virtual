# 📚 Tutor Virtual de HTML & CSS

![Avatar do Tutor](https://github.com/SEU_USUARIO/SEU_REPOSITORIO/blob/main/src/assets/img/meu_avatar.png?raw=true)
*Substitua o caminho da imagem acima para o caminho correto no seu repositório GitHub após o upload.*

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
    git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
    cd SEU_REPOSITORIO
    ```
    *Substitua `SEU_USUARIO` e `SEU_REPOSITORIO` pelos seus dados.*

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

1.  **Conecte seu repositório Git** (GitHub, GitLab, Bitbucket) à sua conta Vercel.
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
