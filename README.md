# Projeto de Aplicação Interativa com React e Tailwind CSS

Este projeto é uma aplicação web interativa desenvolvida com React e Vite, estilizada com Tailwind CSS. Ele apresenta várias seções dinâmicas, incluindo um sistema de personalização de avatar, uma trilha de aprendizado visual e uma interface de chat interativa com suporte a markdown e temas.

## Visão Geral

A aplicação é projetada para demonstrar uma série de funcionalidades modernas de desenvolvimento web, focando em:
- **Componentização** com React.
- **Estilização rápida e responsiva** com Tailwind CSS.
- **Interatividade** através de formulários e controles dinâmicos.
- **Experiência do usuário** com temas claro/escuro e feedback visual.

## Funcionalidades

- **Personalização de Avatar**: Crie e visualize um avatar personalizado selecionando diferentes estilos e cores para cabeça, corpo e pernas.
- **Trilha de Aprendizado Interativa**: Explore uma lista de tópicos de aprendizado apresentados como "cartões flutuantes" em um layout de grid responsivo, indicando o tópico ativo.
- **Interface de Chat Dinâmica**:
    - Envie e receba mensagens, simulando uma conversa entre usuário e um "tutor".
    - Suporte a blocos de código Markdown com destaque de sintaxe.
    - Botão para copiar snippets de código diretamente do chat.
    - Sugestões de perguntas pré-definidas para iniciar conversas.
    - Mensagens com animação de fade-in.
- **Temas Claro e Escuro**: Alterne entre um tema claro e escuro para aprimorar a experiência visual.
- **Design Responsivo**: A interface se adapta a diferentes tamanhos de tela (desktop, tablet, mobile).

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Vite**: Ferramenta de build de próxima geração para projetos front-end, oferecendo um ambiente de desenvolvimento rápido.
- **Tailwind CSS**: Framework CSS utility-first para estilização rápida e personalizada.
- **PostCSS** e **Autoprefixer**: Para processamento e otimização do CSS.
- **highlight.js**: Para destaque de sintaxe em blocos de código Markdown.
- **react-markdown**: Componente React para renderizar Markdown.
- **uuid**: Para geração de IDs únicas.

## Instalação

Siga os passos abaixo para configurar e rodar o projeto em sua máquina local:

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd vite-project
    ```
    *(Substitua `[URL_DO_SEU_REPOSITORIO]` pela URL real do seu repositório Git.)*

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

## Como Rodar o Projeto

Após a instalação das dependências, você pode iniciar o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

Isso iniciará o aplicativo em `http://localhost:5173` (ou em outra porta disponível, que será exibida no terminal).

## Estrutura do Projeto (Exemplo de diretórios e arquivos importantes)

```
vite-project/
├── public/
├── src/
│   ├── App.jsx         # Componente principal da aplicação
│   ├── main.jsx        # Ponto de entrada do React (renderiza App.jsx)
│   ├── App.css         # Estilos globais e customizações com Tailwind
│   └── components/     # Possíveis componentes (ex: AvatarCustomization, LearningPath, ChatInterface)
├── index.html          # O arquivo HTML principal
├── package.json        # Dependências e scripts do projeto
├── tailwind.config.js  # Configuração do Tailwind CSS
├── postcss.config.js   # Configuração do PostCSS para Tailwind e Autoprefixer
├── README.md           # Este arquivo
└── vite.config.js      # Configuração do Vite
```

## Contribuição

Contribuições são bem-vindas! Se você tiver sugestões, melhorias ou encontrar bugs, sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
