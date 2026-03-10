from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import os
import re
import requests as http_requests

router = APIRouter()

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
OLLAMA_URL = "http://localhost:11434/api/chat"
OLLAMA_MODEL = "qwen2.5:0.5b"
SIMILARITY_THRESHOLD = 0.5          # L2 distance; lower = better match
OLLAMA_TIMEOUT = 60                 # seconds

# ---------------------------------------------------------------------------
# Load FAQ index (FAISS + sentence-transformers)
# ---------------------------------------------------------------------------
_chatbot_available = False
_df = None
_model = None
_index = None

try:
    import pandas as pd
    import numpy as np
    import faiss
    from sentence_transformers import SentenceTransformer

    FAQ_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "AI-hybrid-chatbot", "faq.xlsx")
    if os.path.exists(FAQ_PATH):
        _df = pd.read_excel(FAQ_PATH)
        _df.columns = ["question", "answer"]
        _model = SentenceTransformer("all-MiniLM-L6-v2")
        _questions = _df["question"].tolist()
        _embeddings = _model.encode(_questions)
        _dimension = _embeddings.shape[1]
        _index = faiss.IndexFlatL2(_dimension)
        _index.add(np.array(_embeddings))
        _chatbot_available = True
        print("[Chatbot] FAQ index loaded successfully")
    else:
        print(f"[Chatbot] FAQ file not found at {FAQ_PATH}")
except ImportError as e:
    print(f"[Chatbot] AI dependencies not available ({e})")
except Exception as e:
    print(f"[Chatbot] Failed to build FAQ index ({e})")

# ---------------------------------------------------------------------------
# Load career data once (used as context for Ollama)
# ---------------------------------------------------------------------------
_career_summary: str = ""
try:
    from app.database import get_careers
    _careers = get_careers()
    _fields = sorted(set(c["field"] for c in _careers))
    _career_lines = []
    for f in _fields:
        titles = [c["title"] for c in _careers if c["field"] == f]
        _career_lines.append(f"  {f}: {', '.join(titles)}")
    _career_summary = "\n".join(_career_lines)
    print(f"[Chatbot] Loaded {len(_careers)} careers across {len(_fields)} fields for context")
except Exception as e:
    print(f"[Chatbot] Could not load career data for context ({e})")


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------
class UserContext(BaseModel):
    firstName: Optional[str] = None
    interests: list[str] = []
    topCategories: list[str] = []
    hasAssessment: bool = False
    school: Optional[str] = None
    scores: Optional[dict] = None


class ChatRequest(BaseModel):
    message: str
    user_context: Optional[UserContext] = None


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _build_system_prompt(ctx: Optional[UserContext]) -> str:
    """Build a system prompt that includes career data and user profile."""
    parts = [
        "You are EduCareer Assistant, a helpful career and education advisor chatbot.",
        "Answer concisely in 2-4 sentences unless the user asks for detail.",
        "Be friendly, encouraging, and specific.",
        "",
        "=== CAREER DATABASE ===",
        f"We have 36 careers across 12 fields:",
        _career_summary or "(career data unavailable)",
        "",
        "=== PLATFORM FEATURES ===",
        "- Career Assessment: 20-question aptitude test covering 12 career fields",
        "- Career Explorer: detailed career profiles with salary, skills, education, growth rate",
        "- College Directory: 70,000+ colleges across India with AI-powered search",
        "- Scholarships: merit-based, need-based, and field-specific funding opportunities",
        "- Study Resources: free platforms like Khan Academy, Coursera, MIT OCW",
    ]

    if ctx:
        parts.append("")
        parts.append("=== CURRENT USER ===")
        if ctx.firstName:
            parts.append(f"Name: {ctx.firstName}")
        if ctx.school:
            parts.append(f"School: {ctx.school}")
        if ctx.interests:
            parts.append(f"Interests: {', '.join(ctx.interests)}")
        if ctx.hasAssessment and ctx.topCategories:
            parts.append(f"Assessment completed: Yes")
            parts.append(f"Top career fields: {', '.join(ctx.topCategories)}")
            if ctx.scores:
                sorted_scores = sorted(ctx.scores.items(), key=lambda x: x[1], reverse=True)[:5]
                score_parts = [f"{cat}: {score}%" for cat, score in sorted_scores]
                parts.append(f"Scores: {', '.join(score_parts)}")
        else:
            parts.append("Assessment completed: No — encourage the user to take it for personalized results")

        parts.append("")
        parts.append("Use the user's profile to personalize your answers. Reference their interests, assessment results, and top fields when relevant.")

    return "\n".join(parts)


def _strip_thinking(text: str) -> str:
    """Remove <think>...</think> blocks from deepseek-r1 output."""
    # Remove closed thinking blocks
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL)
    # Remove unclosed thinking block (model ran out of tokens mid-thought)
    text = re.sub(r"<think>.*", "", text, flags=re.DOTALL)
    return text.strip()


def _ollama_answer(question: str, ctx: Optional[UserContext]) -> str | None:
    """Get an answer from the local Ollama model with career context."""
    try:
        system_prompt = _build_system_prompt(ctx)
        response = http_requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": question},
                ],
                "stream": False,
                "options": {"temperature": 0.7, "num_predict": 1024},
            },
            timeout=OLLAMA_TIMEOUT,
        )
        if response.status_code == 200:
            raw = response.json().get("message", {}).get("content", "")
            return _strip_thinking(raw) or None
    except Exception as e:
        print(f"[Chatbot] Ollama error: {e}")
    return None


def _faq_search(user_query: str) -> dict | None:
    """Search FAQ index. Returns result dict if confidence is good, else None."""
    if not _chatbot_available:
        return None

    import numpy as np
    query_vector = _model.encode([user_query])
    distances, indices = _index.search(query_vector, k=1)

    similarity_score = float(distances[0][0])
    if similarity_score < SIMILARITY_THRESHOLD:
        faq_answer = str(_df.iloc[indices[0][0]]["answer"])
        matched_question = str(_df.iloc[indices[0][0]]["question"])
        return {
            "answer": faq_answer,
            "source": "faq",
            "confidence": round(1 - similarity_score, 3),
            "matchedQuestion": matched_question,
        }
    return None


def _rule_based_answer(user_query: str) -> dict:
    """Last-resort answers when neither FAQ nor Ollama is available."""
    q = user_query.lower()

    if any(w in q for w in ["career", "job", "profession", "work"]):
        answer = "I can help you explore careers! We have information on 36+ careers across 12 fields including Technology, Engineering, Healthcare, Finance, and more. Take the Career Assessment to get personalized recommendations, or browse the Career Explorer to discover opportunities."
    elif any(w in q for w in ["college", "university", "school", "admission"]):
        answer = "Our College Directory has 70,000+ colleges across India. You can search by field, state, and more. Use the AI-powered search to find colleges that match your interests and career goals."
    elif any(w in q for w in ["scholarship", "financial aid", "funding"]):
        answer = "Check out our Scholarships page for various funding opportunities! We list scholarships by category including merit-based, need-based, and field-specific awards."
    elif any(w in q for w in ["assessment", "test", "quiz"]):
        answer = "The Career Assessment is a 20-question questionnaire that evaluates your interests across 12 career fields. It takes about 5-10 minutes and gives personalized career recommendations. Head to the Assessment page to start!"
    elif any(w in q for w in ["hello", "hi", "hey", "greet"]):
        answer = "Hello! I'm your EduCareer assistant. I can help with career exploration, college search, scholarships, study resources, and career assessments. What would you like to know?"
    elif any(w in q for w in ["thank", "thanks"]):
        answer = "You're welcome! I'm always here to help with your career and education journey. Feel free to ask me anything!"
    else:
        answer = "I can help you with:\n\n• Career Exploration — discover careers matching your interests\n• College Search — find the perfect college from 70,000+ options\n• Scholarships — browse funding opportunities\n• Study Resources — access free learning materials\n• Career Assessment — take an aptitude test\n\nWhat would you like to explore?"

    return {"answer": answer, "source": "rule_based"}


# ---------------------------------------------------------------------------
# Main endpoint
# ---------------------------------------------------------------------------
@router.post("/ask")
def ask(req: ChatRequest):
    """Hybrid chatbot: FAQ first → Ollama with context → rule-based fallback."""
    if not req.message.strip():
        return {"answer": "Please enter a question.", "source": "system"}

    # 1. Try FAQ match (fast, from our dataset)
    faq_result = _faq_search(req.message)
    if faq_result:
        return faq_result

    # 2. Try Ollama with career data + user profile context
    ollama_response = _ollama_answer(req.message, req.user_context)
    if ollama_response:
        return {"answer": ollama_response, "source": "ollama"}

    # 3. Rule-based fallback
    return _rule_based_answer(req.message)
