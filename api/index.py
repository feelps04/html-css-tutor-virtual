import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import traceback
import uuid # Importa a biblioteca uuid para gerar IDs de sessão
import datetime # Para timestamps no log de feedback

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

app = Flask(__name__)
CORS(app)

GOOGLE_API_KEY = "AIzaSyDALvy-YuIX3iecbV-TNr146o9gdxXZ29c"


# Dicionários globais para armazenar o estado por sessão
session_histories = {}
session_modes = {}
session_current_topic = {}

# --- NOVOS TÓPICOS DE APRENDIZAGEM PARA HTML E CSS ---
LEARNING_TOPICS = {
    "html_intro": {
        "name": "Introdução ao HTML",
        "description": "Conceitos básicos de HTML, estrutura de um documento HTML, elementos e tags essenciais (<html>, <head>, <body>, <p>, <h1>-<h6>).",
        "next": "html_text"
    },
    "html_text": {
        "name": "Estruturação de Texto em HTML",
        "description": "Como usar tags para formatar texto (<b>, <i>, <u>, <em>, <strong>), criar listas (<ol>, <ul>, <li>) e links (<a>).",
        "next": "html_media"
    },
    "html_media": {
        "name": "Mídia em HTML",
        "description": "Inserção de imagens (<img>), áudio (<audio>) e vídeo (<video>) em páginas web.",
        "next": "html_forms"
    },
    "html_forms": {
        "name": "Formulários em HTML",
        "description": "Criação de formulários (<form>) e uso de diferentes tipos de entrada (<input>, <textarea>, <select>, <button>).",
        "next": "css_intro"
    },
    "css_intro": {
        "name": "Introdução ao CSS",
        "description": "O que é CSS, como aplicar estilos (inline, interno, externo), e seletores básicos (tag, id, class).",
        "next": "css_colors_fonts"
    },
    "css_colors_fonts": {
        "name": "Cores e Fontes com CSS",
        "description": "Uso de propriedades CSS para cores (color, background-color) e estilos de fonte (font-family, font-size, font-weight).",
        "next": "css_box_model"
    },
    "css_box_model": {
        "name": "O Modelo de Caixa CSS",
        "description": "Compreendendo margin, border, padding e content para controlar o espaçamento e o layout dos elementos.",
        "next": "css_flexbox"
    },
    "css_flexbox": {
        "name": "Layouts com Flexbox",
        "description": "Utilizando Flexbox para criar layouts unidimensionais responsivos e alinhamento de itens.",
        "next": "css_grid"
    },
    "css_grid": {
        "name": "Layouts com CSS Grid",
        "description": "Utilizando CSS Grid para criar layouts bidimensionais complexos e organizar conteúdo.",
        "next": "responsive_design"
    },
    "responsive_design": {
        "name": "Design Responsivo com Media Queries",
        "description": "Adaptando o design do site para diferentes tamanhos de tela e dispositivos usando media queries.",
        "next": "html_css_project"
    },
    "html_css_project": {
        "name": "Desafio Final de HTML e CSS",
        "description": "Um projeto abrangente para testar e consolidar seus conhecimentos em HTML e CSS.",
        "next": None # Último estágio da trilha
    }
}


if GOOGLE_API_KEY:
    try:
        genai.configure(api_key=GOOGLE_API_KEY)
        gemini_model = genai.GenerativeModel('gemini-2.0-flash')
        print("Modelo Gemini-2.0-flash carregado com sucesso.")
    except Exception as e:
        print(f"Erro ao configurar a API ou carregar o modelo Gemini: {e}")
        gemini_model = None
else:
    print("AVISO: A variável de ambiente GOOGLE_API_KEY não está definida.")
    print("Por favor, crie um arquivo .env na mesma pasta de app.py com GOOGLE_API_KEY='SUA_CHAVE_DA_API_AQUI'.")
    print("Você pode obter uma chave em: https://aistudio.google.com/app/apikey")
    print("Sem a chave, a integração com a API do Gemini NÃO FUNCIONARÁ.")
    gemini_model = None

@app.route('/')
def home():
    return "Backend do Tutor Virtual de Programação está rodando!"

@app.route('/ask-tutor', methods=['POST'])
def ask_tutor():
    if not GOOGLE_API_KEY or not gemini_model:
        return jsonify({"error": "Serviço Gemini não configurado ou inicializado. Verifique sua API Key e logs do backend."}), 500

    data = request.json
    user_message = data.get('message')
    session_id = data.get('sessionId')
    requested_mode = data.get('mode') # Novo: modo de tutoria solicitado
    requested_topic = data.get('topic') # Novo: tópico solicitado

    if not user_message:
        return jsonify({"error": "Mensagem do usuário não fornecido."}), 400
    
    # Gerencia ID de sessão e inicializa estados
    is_new_session = False
    if not session_id or session_id not in session_histories:
        session_id = str(uuid.uuid4())
        session_histories[session_id] = []
        session_modes[session_id] = "iniciante" # Modo padrão
        session_current_topic[session_id] = "html_intro" # TÓPICO INICIAL AGORA É HTML_INTRO
        is_new_session = True
        print(f"Nova sessão iniciada: {session_id}")
    
    # Atualiza o modo da sessão se for explicitamente solicitado e for válido
    if requested_mode and requested_mode in ["iniciante", "intermediario", "avancado"] and session_modes[session_id] != requested_mode:
        session_modes[session_id] = requested_mode
        session_histories[session_id] = [] # Reinicia histórico
        print(f"Sessão {session_id}: Modo atualizado para {requested_mode}. Histórico limpo.")
        
    # Atualiza o tópico da sessão se for explicitamente solicitado e for válido
    if requested_topic and requested_topic in LEARNING_TOPICS and session_current_topic[session_id] != requested_topic:
        session_current_topic[session_id] = requested_topic
        session_histories[session_id] = [] # Reinicia histórico
        print(f"Sessão {session_id}: Tópico atualizado para {requested_topic}. Histórico limpo.")

    current_mode = session_modes[session_id]
    current_topic_key = session_current_topic[session_id]
    current_topic_info = LEARNING_TOPICS[current_topic_key]
    
    print(f"Mensagem recebida do frontend para sessão {session_id}, modo '{current_mode}', tópico '{current_topic_info['name']}': {user_message}")

    try:
        # Instrução de sistema dinâmica baseada no modo e tópico
        system_instruction_text = (
            f"Você é um Tutor Virtual de Desenvolvimento Web, focado em HTML e CSS. Seu objetivo é ensinar HTML e CSS. "
            f"Sua abordagem deve ser para um nível '{current_mode}'. "
            f"Atualmente, o foco é no tópico '{current_topic_info['name']}: {current_topic_info['description']}'. "
            "Seja sempre amigável, claro e direto. "
            "Responda a saudações de forma apropriada. "
            "Se a pergunta for sobre o tópico atual ou HTML/CSS em geral, forneça a melhor explicação possível e, se apropriado, um pequeno exemplo de código HTML ou CSS formatado em Markdown. "
            "Se a pergunta não for sobre HTML/CSS ou desenvolvimento web, direcione o usuário de volta ao tópico de forma educada. "
            "Quando um exercício é solicitado (palavra 'exercício' ou 'desafio') ou sugerido, gere um pequeno problema de desenvolvimento web RELEVANTE AO TÓPICO ATUAL para o usuário resolver. "
            "Quando perguntado 'quem é você' ou sobre sua identidade, responda que você é um modelo de linguagem grande, treinado pelo Google, e que está aqui para ajudar com HTML e CSS. "
        )
        
        # Sugestão de próximo passo
        next_topic_key = current_topic_info.get('next')
        if next_topic_key:
            system_instruction_text += (
                f" Ao final de cada resposta, sugira o próximo passo ou um tópico relacionado. "
                f"O próximo tópico sugerido após '{current_topic_info['name']}' é '{LEARNING_TOPICS[next_topic_key]['name']}'.")
        else:
            system_instruction_text += (
                f" Você concluiu a trilha de tópicos. Agora podemos fazer um '{current_topic_info['name']}'.")
            
        # Adiciona a mensagem do usuário ao histórico ANTES de enviar ao Gemini
        contents_for_gemini = []
        contents_for_gemini.append({"role": "user", "parts": [{"text": system_instruction_text}]})

        for msg in session_histories[session_id]:
            contents_for_gemini.append({"role": msg["role"], "parts": [{"text": msg["text"]}]})

        contents_for_gemini.append({"role": "user", "parts": [{"text": user_message}]})

        response = gemini_model.generate_content(contents=contents_for_gemini)
        
        gemini_response_text = response.text
        print(f"Resposta bruta do Gemini: {gemini_response_text}")

        tutor_reply = gemini_response_text
        
        if not tutor_reply.strip():
            tutor_reply = "Desculpe, não consegui gerar uma resposta útil no momento. Poderia tentar reformular?"

        # Atualiza o histórico da sessão
        session_histories[session_id].append({"role": "user", "text": user_message})
        session_histories[session_id].append({"role": "model", "text": tutor_reply})
        
        # Prepara as sugestões de próximos tópicos para o frontend
        next_topic_name = LEARNING_TOPICS[next_topic_key]['name'] if next_topic_key else None

        return jsonify({
            "reply": tutor_reply,
            "sessionId": session_id,
            "currentMode": current_mode,
            "currentTopic": current_topic_key,
            "nextTopicSuggestion": next_topic_name
        })

    except genai.types.BlockedPromptException as e:
        block_reason = e.response.prompt_feedback.block_reason.name if e.response.prompt_feedback.block_reason else "Desconhecido"
        print(f"Sua pergunta foi bloqueada pela API do Gemini. Razão: {block_reason}")
        tutor_reply = f"Sua pergunta foi bloqueada por razões de segurança: {block_reason}. Por favor, tente reformular."
        return jsonify({"reply": tutor_reply, "sessionId": session_id}), 400
    except genai.types.ClientError as e:
        print(f"Erro da API do Gemini (ClientError): {e}")
        traceback.print_exc()
        return jsonify({"error": f"Erro da API do Gemini: {str(e)}", "sessionId": session_id}), 500
    except Exception as e:
        print(f"Erro inesperado no backend: {e}")
        traceback.print_exc()
        return jsonify({"error": f"Erro interno do servidor: {str(e)}", "sessionId": session_id}), 500

@app.route('/get-learning-topics', methods=['GET'])
def get_learning_topics():
    # Retorna a lista de tópicos e suas descrições
    return jsonify(LEARNING_TOPICS)

@app.route('/feedback', methods=['POST'])
def receive_feedback():
    data = request.json
    message_id = data.get('messageId')
    feedback_type = data.get('feedbackType') # 'like' ou 'dislike'
    message_text = data.get('messageText') # Texto da mensagem avaliada
    session_id = data.get('sessionId') # Pega o ID da sessão para o log
    
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    feedback_entry = (
        f"[{timestamp}] Session ID: {session_id}, "
        f"Message ID: {message_id}, "
        f"Feedback: {feedback_type}, "
        "Message: \"" + message_text.replace("\n", " ").strip() + "\"\n" # LINHA CORRIGIDA
    )
    
    # --- SALVA O FEEDBACK EM UM ARQUIVO DE LOG ---
    try:
        with open("feedback.log", "a", encoding="utf-8") as f:
            f.write(feedback_entry)
        print(f"Feedback registrado no arquivo: {feedback_entry.strip()}")
        return jsonify({"status": "success", "message": "Feedback registrado!"})
    except Exception as e:
        print(f"Erro ao salvar feedback em arquivo: {e}")
        traceback.print_exc()
        return jsonify({"status": "error", "message": "Erro ao registrar feedback no servidor."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
