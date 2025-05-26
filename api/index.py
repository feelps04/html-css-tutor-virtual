import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import traceback
import uuid # Importa a biblioteca uuid para gerar IDs de sessão
import datetime # Para timestamps no log de feedback
from google.api_core import exceptions # Importa as exceções da API Core

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Use uma variável de ambiente para a chave da API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Inicializa o modelo Gemini
# Verifica se a chave da API está definida antes de configurar o genai
if GOOGLE_API_KEY:
    try:
        genai.configure(api_key=GOOGLE_API_KEY)
        # Alterado o modelo para gemini-1.5-flash-latest
        gemini_model = genai.GenerativeModel('gemini-1.5-flash-latest') 
        print("Modelo Gemini-1.5-flash-latest carregado com sucesso.")
    except Exception as e:
        print(f"Erro ao configurar a API ou carregar o modelo Gemini: {e}")
        gemini_model = None
else:
    print("AVISO: A variável de ambiente GOOGLE_API_KEY não está definida.")
    print("Por favor, crie um arquivo .env na mesma pasta de app.py com GOOGLE_API_KEY='SUA_CHAVE_DA_API_AQUI'.")
    print("Você pode obter uma chave em: https://aistudio.google.com/app/apikey")
    print("Sem a chave, a integração com a API do Gemini NÃO FUNCIONARÁ.")
    gemini_model = None


# Dicionários globais para armazenar o estado por sessão
session_histories = {}
session_modes = {}
session_current_topic = {}
session_exercise_scores = {} # Armazena {session_id: {'correct': 0, 'total': 0}}

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
        "description": "Incorporar imagens (<img>), áudio (<audio>) e vídeo (<video>) em páginas web.",
        "next": "html_forms"
    },
    "html_forms": {
        "name": "Formulários HTML",
        "description": "Criar formulários interativos com diferentes tipos de input (<input>, <textarea>, <button>), labels e atributos.",
        "next": "css_intro"
    },
    "css_intro": {
        "name": "Introdução ao CSS",
        "description": "O que é CSS, como incluir CSS em HTML (inline, interno, externo) e seletores básicos (elemento, classe, ID).",
        "next": "css_colors_fonts"
    },
    "css_colors_fonts": {
        "name": "Cores e Fontes em CSS",
        "description": "Aplicar cores (color, background-color), escolher fontes (font-family, font-size, font-weight) e ajustar o estilo do texto.",
        "next": "css_box_model"
    },
    "css_box_model": {
        "name": "Modelo de Caixa do CSS",
        "description": "Entender margin, padding, border e content para o layout e espaçamento de elementos na página.",
        "next": "css_flexbox"
    },
    "css_flexbox": {
        "name": "Flexbox para Layouts",
        "description": "Criar layouts flexíveis e responsivos usando Flexbox (display: flex, justify-content, align-items, flex-direction).",
        "next": "css_grid"
    },
    "css_grid": {
        "name": "Grid CSS para Layouts Complexos",
        "description": "Construir layouts baseados em grade com CSS Grid (display: grid, grid-template-columns, grid-template-rows, gap).",
        "next": "responsive_design"
    },
    "responsive_design": {
        "name": "Design Responsivo",
        "description": "Tornar páginas web adaptáveis a diferentes tamanhos de tela usando Media Queries e princípios de design responsivo.",
        "next": "html_css_project"
    },
    "html_css_project": {
        "name": "Projeto Prático HTML & CSS",
        "description": "Aplicar todos os conhecimentos adquiridos em um projeto prático de construção de uma página web completa.",
        "next": None # Último tópico
    }
}


@app.route('/start-session', methods=['POST'])
def start_session():
    data = request.json
    user_name = data.get('userName')
    user_email = data.get('userEmail')
    session_id = str(uuid.uuid4()) # Gera um UUID único para a sessão

    session_histories[session_id] = []
    session_modes[session_id] = "iniciante" # Modo padrão
    session_current_topic[session_id] = "html_intro" # Tópico padrão
    session_exercise_scores[session_id] = {'correct': 0, 'total': 0}

    print(f"Nova sessão iniciada: {session_id} para {user_name} ({user_email})")
    return jsonify({"sessionId": session_id, "currentTopic": "html_intro", "currentMode": "iniciante"})

@app.route('/chat', methods=['POST'])
def chat():
    if not GOOGLE_API_KEY or not gemini_model:
        return jsonify({"error": "Serviço Gemini não configurado ou inicializado. Verifique sua API Key e logs do backend."}), 500

    data = request.json
    user_message = data.get('message')
    session_id = data.get('sessionId')
    current_topic_key = data.get('currentTopic')
    current_mode = data.get('currentMode')

    if not session_id or session_id not in session_histories:
        return jsonify({"error": "Sessão inválida ou não iniciada."}), 400

    if not user_message:
        return jsonify({"error": "Mensagem vazia."}), 400

    # Atualiza o tópico e o modo para a sessão
    session_current_topic[session_id] = current_topic_key
    session_modes[session_id] = current_mode

    history = session_histories[session_id]
    topic_name = LEARNING_TOPICS.get(current_topic_key, {}).get("name", "tópico desconhecido")

    # Construção da prompt com base no modo e tópico
    if current_mode == "iniciante":
        prompt_prefix = (
            f"Você é um tutor de HTML e CSS muito paciente e didático para iniciantes. "
            f"Explique os conceitos de forma simples, com exemplos claros e analogias. "
            f"Foque no tópico '{topic_name}'. "
            f"Sempre ofereça um pequeno exercício prático ao final de cada explicação longa. "
            f"Responda de forma concisa e direta, mas sempre completa para o nível iniciante. "
            f"Mantenha um tom amigável e encorajador."
        )
    elif current_mode == "intermediario":
        prompt_prefix = (
            f"Você é um tutor de HTML e CSS para nível intermediário. "
            f"Explique os conceitos com mais profundidade, incluindo melhores práticas e otimizações. "
            f"Foque no tópico '{topic_name}'. "
            f"Inclua desafios de código e cenários de uso reais. "
            f"Estimule a experimentação e a resolução de problemas."
        )
    else: # avancado
        prompt_prefix = (
            f"Você é um tutor de HTML e CSS para nível avançado. "
            f"Aborde os tópicos com detalhes técnicos, discussões sobre performance, "
            f"compatibilidade de navegadores e padrões da indústria. "
            f"Foque no tópico '{topic_name}'. "
            f"Apresente problemas complexos para o utilizador resolver e discuta arquiteturas. "
            f"Seja desafiador e proporcione insights aprofundados."
        )

    full_prompt = f"{prompt_prefix}\n\nUtilizador: {user_message}"

    try:
        chat_session = gemini_model.start_chat(history=history)
        response = chat_session.send_message(full_prompt)
        ai_response_text = response.text

        # Atualiza o histórico da sessão
        history.append({"role": "user", "parts": [{"text": user_message}]})
        history.append({"role": "model", "parts": [{"text": ai_response_text}]})
        session_histories[session_id] = history

        # Determinar se a última mensagem do tutor é um exercício
        is_exercise = "exercício" in ai_response_text.lower() or "desafio" in ai_response_text.lower()

        return jsonify({
            "response": ai_response_text,
            "sessionId": session_id,
            "isExercise": is_exercise
        })
    except genai.types.BlockedPromptException as e:
        block_reason = e.response.prompt_feedback.block_reason.name if e.response.prompt_feedback.block_reason else "Desconhecido"
        print(f"Sua pergunta foi bloqueada pela API do Gemini. Razão: {block_reason}")
        tutor_reply = f"Sua pergunta foi bloqueada por razões de segurança: {block_reason}. Por favor, tente reformular."
        return jsonify({"reply": tutor_reply, "sessionId": session_id}), 400
    # Captura exceções mais genéricas ou específicas da API Core
    except exceptions.NotFound as e:
        print(f"Erro da API do Gemini (NotFound): {e}")
        traceback.print_exc()
        return jsonify({"error": f"Erro da API do Gemini: Modelo não encontrado ou não suportado. Detalhes: {str(e)}", "sessionId": session_id}), 500
    except exceptions.GoogleAPICallError as e:
        print(f"Erro da API do Gemini (GoogleAPICallError): {e}")
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
        return jsonify({"status": "success", "message": "Feedback recebido."})
    except Exception as e:
        print(f"Erro ao escrever feedback no arquivo: {e}")
        return jsonify({"status": "error", "message": "Erro ao registrar feedback.", "error": str(e)}), 500

@app.route('/exercise-evaluation', methods=['POST'])
def exercise_evaluation():
    data = request.json
    session_id = data.get('sessionId')
    is_correct = data.get('isCorrect')

    if not session_id or session_id not in session_exercise_scores:
        return jsonify({"error": "Sessão inválida ou não iniciada."}), 400

    scores = session_exercise_scores[session_id]
    scores['total'] += 1
    if is_correct:
        scores['correct'] += 1

    session_exercise_scores[session_id] = scores
    print(f"Avaliação de exercício para sessão {session_id}: Correctos={scores['correct']}, Total={scores['total']}")
    return jsonify({"status": "success", "scores": scores})

@app.route('/get-scores', methods=['GET'])
def get_scores():
    session_id = request.args.get('sessionId')
    if not session_id or session_id not in session_exercise_scores:
        return jsonify({"correct": 0, "total": 0})
    return jsonify(session_exercise_scores[session_id])

if __name__ == '__main__':
    app.run(debug=True)
