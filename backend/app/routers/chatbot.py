from fastapi import APIRouter, Header
from pydantic import BaseModel
from typing import Optional
import os

router = APIRouter()

# Try to load AI chatbot dependencies
_chatbot_available = False
_df = None
_model = None
_index = None

try:
    import pandas as pd
    import numpy as np
    import faiss
    from sentence_transformers import SentenceTransformer
    import requests as http_requests

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
        print("[Chatbot] AI chatbot loaded successfully")
    else:
        print(f"[Chatbot] FAQ file not found at {FAQ_PATH}, using rule-based fallback")
except ImportError as e:
    print(f"[Chatbot] AI dependencies not available ({e}), using rule-based fallback")
except Exception as e:
    print(f"[Chatbot] Failed to initialize AI chatbot ({e}), using rule-based fallback")

OLLAMA_URL = "http://localhost:11434/api/generate"
SIMILARITY_THRESHOLD = 0.5


def _llama_answer(question: str) -> str | None:
    """Try to get an answer from local Ollama Llama3 model."""
    try:
        import requests as http_requests
        response = http_requests.post(
            OLLAMA_URL,
            json={"model": "llama3", "prompt": question, "stream": False},
            timeout=30,
        )
        if response.status_code == 200:
            return response.json().get("response")
    except Exception:
        return None
    return None


def _hybrid_answer(user_query: str) -> dict:
    """Get answer from FAQ (FAISS) or fall back to Llama3."""
    if not _chatbot_available:
        return _rule_based_answer(user_query)

    import numpy as np
    query_vector = _model.encode([user_query])
    distances, indices = _index.search(query_vector, k=1)

    similarity_score = float(distances[0][0])
    faq_answer = _df.iloc[indices[0][0]]["answer"]
    matched_question = _df.iloc[indices[0][0]]["question"]

    if similarity_score < SIMILARITY_THRESHOLD:
        return {
            "answer": str(faq_answer),
            "source": "faq",
            "confidence": round(1 - similarity_score, 3),
            "matchedQuestion": str(matched_question),
        }

    # Try Llama3 fallback
    llama_response = _llama_answer(user_query)
    if llama_response:
        return {
            "answer": llama_response,
            "source": "llama3",
            "confidence": None,
        }

    # If Llama is not available, return best FAQ match anyway
    return {
        "answer": str(faq_answer),
        "source": "faq_fallback",
        "confidence": round(1 - similarity_score, 3),
        "matchedQuestion": str(matched_question),
    }


def _rule_based_answer(user_query: str) -> dict:
    """Provide helpful answers when AI models are not available."""
    q = user_query.lower()

    if any(w in q for w in ["career", "job", "profession", "work"]):
        answer = "I can help you explore careers! We have information on 36+ careers across 12 fields including Technology, Engineering, Healthcare, Finance, and more. Take the Career Assessment to get personalized recommendations, or browse the Career Explorer to discover opportunities."
    elif any(w in q for w in ["college", "university", "school", "admission"]):
        answer = "Our College Directory has 70,000+ colleges across India. You can search by field, state, and more. Use the AI-powered search to find colleges that match your interests and career goals."
    elif any(w in q for w in ["scholarship", "financial aid", "funding"]):
        answer = "Check out our Scholarships page for various funding opportunities! We list scholarships by category including merit-based, need-based, and field-specific awards. Each listing includes eligibility criteria and application links."
    elif any(w in q for w in ["assessment", "test", "quiz"]):
        answer = "The Career Assessment is a 20-question questionnaire that evaluates your interests across 12 career fields. It takes about 5-10 minutes and gives personalized career recommendations based on your responses. Head to the Assessment page to get started!"
    elif any(w in q for w in ["resource", "study", "learn", "course"]):
        answer = "We have curated study resources including platforms like Khan Academy, Coursera, MIT OpenCourseWare, and more. These cover various subjects and are completely free. Visit the Study Resources page to start learning!"
    elif any(w in q for w in ["hello", "hi", "hey", "greet"]):
        answer = "Hello! I'm your EduCareer assistant. I can help you with career exploration, college search, scholarships, study resources, and career assessments. What would you like to know?"
    elif any(w in q for w in ["thank", "thanks"]):
        answer = "You're welcome! I'm always here to help with your career and education journey. Feel free to ask me anything!"
    elif any(w in q for w in ["salary", "pay", "earn", "income"]):
        answer = "Salary information varies by career and experience level. Check the Career Explorer for detailed salary ranges across all 36+ careers. For example, Software Developers earn $95K-$150K, while AI Engineers can earn $110K-$180K."
    elif any(w in q for w in ["skill", "qualification", "requirement"]):
        answer = "Each career has specific skill requirements. Visit the Career Explorer to see detailed skill lists, education requirements, and growth rates for each career. Taking the Career Assessment can also help identify which skills align with your strengths."
    else:
        answer = "I can help you with:\n\n• Career Exploration — discover careers matching your interests\n• College Search — find the perfect college from 70,000+ options\n• Scholarships — browse funding opportunities\n• Study Resources — access free learning materials\n• Career Assessment — take an aptitude test\n\nWhat would you like to explore?"

    return {"answer": answer, "source": "rule_based"}


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


def _personalize(answer: str, query: str, ctx: Optional[UserContext]) -> str:
    """Augment a generic answer with user-specific information."""
    if not ctx:
        return answer

    q = query.lower()
    name = ctx.firstName or "there"
    extras = []

    # For career/skill/job questions, inject assessment results
    if any(w in q for w in ["career", "skill", "job", "match", "profession", "work", "recommend"]):
        if ctx.hasAssessment and ctx.topCategories:
            extras.append(
                f"Based on your assessment results, {name}, your top career fields are: "
                f"{', '.join(ctx.topCategories)}."
            )
            if ctx.scores:
                # Show top 3 scoring categories with percentages
                sorted_scores = sorted(ctx.scores.items(), key=lambda x: x[1], reverse=True)[:3]
                score_parts = [f"{cat} ({score}%)" for cat, score in sorted_scores]
                extras.append(f"Your strongest areas: {', '.join(score_parts)}.")
            if ctx.interests:
                extras.append(f"Your listed interests ({', '.join(ctx.interests)}) align well with these fields.")
            extras.append("Visit the Career Explorer to see detailed career paths in your recommended fields.")
        else:
            extras.append(
                f"Hi {name}! I'd recommend taking the Career Assessment first to get personalized "
                f"career matches based on your unique strengths and interests."
            )
            if ctx.interests:
                extras.append(f"Given your interests in {', '.join(ctx.interests)}, you might want to start there.")
        return " ".join(extras)

    # For college questions, add field context
    if any(w in q for w in ["college", "university", "admission"]):
        if ctx.hasAssessment and ctx.topCategories:
            extras.append(
                f"{name}, since your top fields are {' and '.join(ctx.topCategories[:2])}, "
                f"I'd recommend looking at colleges with strong programs in those areas."
            )

    # For scholarship questions, add field context
    if any(w in q for w in ["scholarship", "financial"]):
        if ctx.hasAssessment and ctx.topCategories:
            extras.append(
                f"Given your interest in {ctx.topCategories[0]}, also look for field-specific scholarships."
            )

    if extras:
        return answer + "\n\n" + " ".join(extras)
    return answer


@router.post("/ask")
def ask(req: ChatRequest):
    """Send a message to the hybrid chatbot."""
    if not req.message.strip():
        return {"answer": "Please enter a question.", "source": "system"}

    result = _hybrid_answer(req.message)
    result["answer"] = _personalize(result["answer"], req.message, req.user_context)
    return result
