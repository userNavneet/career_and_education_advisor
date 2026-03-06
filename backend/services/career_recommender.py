from __future__ import annotations

import re
from typing import Any

import numpy as np
from sentence_transformers import SentenceTransformer

from services.assessment_bank import FIELDS

_MODEL = None
_WORD_RE = re.compile(r"[a-z0-9]+")

FIELD_KEYWORDS = {
    "tech": {"technology", "software", "it", "data", "ai"},
    "engineering": {"engineering", "engineer"},
    "healthcare": {"health", "healthcare", "medical", "medicine"},
    "business": {"business", "management", "marketing"},
    "finance": {"finance", "banking", "accounting"},
    "design": {"design", "ux", "ui", "creative"},
    "arts": {"arts", "media", "visual"},
    "education": {"education", "teaching", "teacher"},
    "science": {"science", "research"},
    "law": {"law", "legal"},
    "nonprofit": {"nonprofit", "social", "community"},
    "government": {"government", "public service", "policy"},
}


def _get_model():
    global _MODEL
    if _MODEL is None:
        _MODEL = SentenceTransformer("all-MiniLM-L6-v2")
    return _MODEL


def _normalize(text: str) -> set[str]:
    return set(_WORD_RE.findall((text or "").lower()))


def _cosine_similarity_matrix(vector: np.ndarray, matrix: np.ndarray) -> np.ndarray:
    vector_norm = np.linalg.norm(vector) + 1e-9
    matrix_norm = np.linalg.norm(matrix, axis=1) + 1e-9
    return (matrix @ vector) / (matrix_norm * vector_norm)


def _field_match_bonus(career: dict[str, Any], top_keys: list[str], field_scores: dict[str, float]) -> float:
    field_text = f"{career.get('field', '')} {career.get('title', '')}".lower()
    tokens = _normalize(field_text)
    bonus = 0.0
    for key in top_keys:
        if tokens & FIELD_KEYWORDS.get(key, set()):
            bonus += 0.08 + min(float(field_scores.get(key, 0)) / 60.0, 0.07)
    return min(bonus, 0.25)


def recommend_careers_ml(db, field_scores: dict[str, float], top_k: int = 8):
    careers = list(db.careers.find({}))
    if not careers:
        return []

    top_keys = [k for k, _ in sorted(field_scores.items(), key=lambda x: x[1], reverse=True)[:3]]
    profile_parts = []
    for key in top_keys:
        label = FIELDS.get(key, key)
        intensity = max(1, int(round(float(field_scores.get(key, 0)) / 3)))
        profile_parts.extend([label] * min(intensity, 6))
    profile_text = " ".join(profile_parts) if profile_parts else "career guidance"

    texts = []
    for career in careers:
        skills = ", ".join((career.get("skills") or [])[:8])
        text = (
            f"{career.get('title', '')}. "
            f"{career.get('field', '')}. "
            f"{career.get('description', '')}. "
            f"Skills: {skills}"
        )
        texts.append(text)

    try:
        model = _get_model()
        career_embeddings = model.encode(texts, convert_to_numpy=True)
        profile_embedding = model.encode([profile_text], convert_to_numpy=True)[0]
        semantic_scores = _cosine_similarity_matrix(profile_embedding, career_embeddings)
    except Exception:
        # Deterministic fallback if model download/load fails
        profile_tokens = _normalize(profile_text)
        semantic_scores = []
        for text in texts:
            tokens = _normalize(text)
            overlap = len(profile_tokens & tokens)
            union = max(len(profile_tokens | tokens), 1)
            semantic_scores.append(overlap / union)
        semantic_scores = np.array(semantic_scores, dtype=float)

    ranked = []
    for idx, career in enumerate(careers):
        sem = float(semantic_scores[idx])
        score = sem + _field_match_bonus(career, top_keys, field_scores)
        ranked.append((score, career))

    ranked.sort(key=lambda x: x[0], reverse=True)
    out = []
    seen = set()
    for score, career in ranked:
        title = str(career.get("title", "")).strip().lower()
        if not title or title in seen:
            continue
        seen.add(title)
        out.append(
            {
                "id": str(career.get("_id")),
                "title": career.get("title"),
                "field": career.get("field"),
                "average_salary": career.get("average_salary"),
                "demand_level": career.get("demand_level"),
                "image_url": career.get("image_url"),
                "match_score": round(float(score), 4),
            }
        )
        if len(out) >= top_k:
            break
    return out
