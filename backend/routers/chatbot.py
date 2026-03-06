from pathlib import Path
import re
import time

from fastapi import APIRouter, HTTPException
from sentence_transformers import SentenceTransformer

from database.db import get_db
from schemas.models import FaqMatch, FaqQuery, FaqResponse
from services.faq_semantic import FaqItem, FaqSemanticIndex

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

_FAQ_PATH = Path(__file__).resolve().parents[2] / "data" / "faq.json"
_FAQ_ROWS = None
_SEMANTIC_INDEX = None
_MODEL = None
_LAST_REFRESH_TS = 0.0
_CACHE_TTL_SECONDS = 120
_LAST_INDEX_COUNT = 0
_WORD_RE = re.compile(r"[a-z0-9]+")


def _normalize(text: str) -> str:
    return " ".join(_WORD_RE.findall((text or "").lower()))


def _tokenize(text: str) -> set[str]:
    return set(_WORD_RE.findall((text or "").lower()))


def _load_rows_from_db():
    db = get_db()
    collections = ["chatbot_faq", "faqs", "faq", "chatbot_faqs"]
    rows = []
    seen = set()

    for collection in collections:
        try:
            docs = list(db[collection].find({}, {"question": 1, "answer": 1, "answer ": 1}))
            for doc in docs:
                q = str(doc.get("question", "")).strip()
                a = str(doc.get("answer", doc.get("answer ", ""))).strip()
                key = _normalize(q)
                if q and a and key and key not in seen:
                    rows.append({"question": q, "answer": a})
                    seen.add(key)
        except Exception:
            continue

    return rows


def _load_rows_from_json():
    if not _FAQ_PATH.exists():
        raise HTTPException(status_code=500, detail="FAQ data not found")

    import json

    data = json.loads(_FAQ_PATH.read_text())
    rows = []
    for item in data:
        q = str(item.get("question", "")).strip()
        a = str(item.get("answer", "")).strip()
        if q and a:
            rows.append({"question": q, "answer": a})
    return rows


def _get_rows():
    global _FAQ_ROWS, _LAST_REFRESH_TS
    now = time.time()
    if _FAQ_ROWS is not None and (now - _LAST_REFRESH_TS) < _CACHE_TTL_SECONDS:
        return _FAQ_ROWS

    rows = _load_rows_from_db()
    if not rows:
        rows = _load_rows_from_json()

    _FAQ_ROWS = rows
    _LAST_REFRESH_TS = now
    return _FAQ_ROWS


def _ensure_semantic_index(rows):
    global _MODEL, _SEMANTIC_INDEX, _LAST_INDEX_COUNT

    if _MODEL is None:
        _MODEL = SentenceTransformer("all-MiniLM-L6-v2")

    if _SEMANTIC_INDEX is None or _LAST_INDEX_COUNT != len(rows):
        items = [FaqItem(question=row["question"], answer=row["answer"]) for row in rows]
        _SEMANTIC_INDEX = FaqSemanticIndex.from_items(_MODEL, items)
        _LAST_INDEX_COUNT = len(rows)

    return _SEMANTIC_INDEX, _MODEL


def _keyword_search(rows, query, top_k):
    q_tokens = _tokenize(query)
    if not q_tokens:
        return []

    scored = []
    for row in rows:
        row_tokens = _tokenize(row["question"])
        overlap = len(q_tokens & row_tokens)
        union = max(len(q_tokens | row_tokens), 1)
        score = overlap / union
        if score > 0:
            scored.append((row, score))

    scored.sort(key=lambda x: x[1], reverse=True)
    return scored[:top_k]


@router.post("/faq", response_model=FaqResponse)
def faq_search(payload: FaqQuery):
    rows = _get_rows()

    matches = []
    try:
        semantic_index, model = _ensure_semantic_index(rows)
        results = semantic_index.search(model, payload.query, top_k=payload.top_k)
        matches = [FaqMatch(question=i.question, answer=i.answer, score=float(score)) for i, score in results]
    except Exception:
        results = _keyword_search(rows, payload.query, payload.top_k)
        matches = [FaqMatch(question=r["question"], answer=r["answer"], score=float(score)) for r, score in results]

    dedup = {}
    for match in sorted(matches, key=lambda m: m.score, reverse=True):
        key = _normalize(match.question)
        if key and key not in dedup:
            dedup[key] = match

    filtered = [m for m in dedup.values() if m.score >= payload.min_score]
    return {"matches": filtered[: payload.top_k]}
