# Guia de Implantação para o Tutor Virtual

Este guia descreve como implantar o Tutor Virtual de Lógica de Programação na plataforma Vercel. A aplicação é composta por um frontend React/Vite e um backend Python utilizando a API Gemini.

## Pré-requisitos

Antes de iniciar o processo de implantação, certifique-se de ter:

1. Uma conta na [Vercel](https://vercel.com/)
2. O código-fonte em um repositório Git (GitHub, GitLab ou Bitbucket)
3. Uma chave de API do Google Gemini (obtenha em [Google AI Studio](https://aistudio.google.com/app/apikey))
4. Credenciais do Firebase (se a aplicação utilizar autenticação/banco de dados Firebase)

## Passos para Implantação

### 1. Preparação do Projeto

Certifique-se de que seu projeto contém os seguintes arquivos essenciais:

- `vercel.json` (configuração do Vercel - já criado)
- `package.json` com o script `vercel-build` (deve apontar para `npm run build`)
- `api/requirements.txt` listando todas as dependências Python:
  ```
  flask==2.2.3
  flask-cors==3.0.10
  python-dotenv==1.0.0
  google-generativeai==0.2.1
  uuid==1.30
  ```

### 2. Configuração das Variáveis de Ambiente

Antes de implantar, você precisa configurar as variáveis de ambiente no Vercel:

1. Acesse o [Dashboard da Vercel](https://vercel.com/dashboard)
2. Selecione seu projeto (ou crie um novo)
3. Navegue até "Settings" > "Environment Variables"
4. Adicione as seguintes variáveis:
   - `VITE_GOOGLE_API_KEY`: Sua chave da API do Google Gemini
   - `VITE_FIREBASE_API_KEY`: Sua chave da API do Firebase
   - `VITE_FIREBASE_AUTH_DOMAIN`: Domínio de autenticação do Firebase
   - `VITE_FIREBASE_PROJECT_ID`: ID do projeto Firebase
   - `VITE_FIREBASE_STORAGE_BUCKET`: Bucket de armazenamento do Firebase
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: ID do remetente de mensagens do Firebase
   - `VITE_FIREBASE_APP_ID`: ID do aplicativo Firebase

### 3. Implantação na Vercel

#### Opção 1: Implantação via Dashboard

1. Acesse o [Dashboard da Vercel](https://vercel.com/dashboard)
2. Clique em "New Project"
3. Importe seu repositório Git
4. Selecione o repositório do Tutor Virtual
5. Na configuração do projeto:
   - O framework deve ser detectado automaticamente como "Vite"
   - Verifique se o diretório raiz está correto (geralmente `/`)
   - Verifique se o comando de build está definido para `npm run vercel-build`
   - Verifique se o diretório de saída está definido para `dist`
6. Clique em "Deploy"

#### Opção 2: Implantação via CLI

1. Instale a CLI da Vercel (se ainda não tiver):
   ```bash
   npm install -g vercel
   ```
   
2. Faça login na sua conta Vercel:
   ```bash
   vercel login
   ```
   
3. Navegue até o diretório do seu projeto e execute:
   ```bash
   vercel
   ```
   
4. Siga as instruções na tela para concluir a implantação

### 4. Verificação da Implantação

Após a implantação, verifique se:

1. O frontend está carregando corretamente (página inicial)
2. A API está funcionando (tente enviar uma mensagem)
3. O login está funcionando (se aplicável)
4. A aplicação está responsiva em dispositivos móveis

## Solução de Problemas Comuns

### API Não Funciona

Se a API não estiver funcionando:

1. Verifique se `api/index.py` está no caminho correto
2. Verifique se todas as dependências estão listadas em `api/requirements.txt`
3. Verifique os logs da função serverless em "Deployments" > Selecione o deploy > "Functions" > Clique na função `/api/...`
4. Verifique se as variáveis de ambiente foram configuradas corretamente

### Problemas com o Frontend

Se o frontend não estiver funcionando:

1. Verifique os logs de build em "Deployments" > Selecione o deploy > "Build Logs"
2. Certifique-se de que o comando de build está definido corretamente
3. Verifique se o diretório de saída (`dist`) está configurado corretamente
4. Verifique o console do navegador para erros JavaScript

### Erro 404 ao Atualizar a Página

Se você obtiver um erro 404 ao atualizar a página:

1. Verifique se as rotas no `vercel.json` estão configuradas corretamente
2. Certifique-se de que a rota catch-all (`"src": "/(.*)", "dest": "/index.html"`) está presente

## Atualizações e Reimplantação

Para atualizar sua aplicação:

1. Faça as alterações no código
2. Envie as alterações para o repositório Git
3. A Vercel detectará automaticamente as alterações e reimplantará a aplicação

Alternativamente, você pode forçar uma reimplantação:

1. Acesse o Dashboard da Vercel
2. Selecione seu projeto
3. Clique em "Deployments"
4. Clique em "Redeploy" no deploy mais recente

## Domínio Personalizado

Para configurar um domínio personalizado:

1. Acesse o Dashboard da Vercel
2. Selecione seu projeto
3. Clique em "Settings" > "Domains"
4. Adicione seu domínio personalizado
5. Siga as instruções para configurar os registros DNS

---

Caso encontre dificuldades durante o processo de implantação, consulte a [documentação oficial da Vercel](https://vercel.com/docs) ou entre em contato com o suporte.

