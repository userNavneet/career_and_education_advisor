import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import List, Tuple


_WORD_RE = re.compile(r"[a-z0-9]+")


@dataclass
class FaqItem:
    question: str
    answer: str
    norm_question: str
    tokens: set[str]


def _normalize(text: str) -> str:
    return " ".join(_WORD_RE.findall(text.lower()))


def _tokenize(text: str) -> set[str]:
    return set(_WORD_RE.findall(text.lower()))


def load_faq(path: Path) -> List[FaqItem]:
    data = json.loads(path.read_text())
    items: List[FaqItem] = []
    for row in data:
        question = str(row.get("question", "")).strip()
        answer = str(row.get("answer", "")).strip()
        if not question or not answer:
            continue
        items.append(
            FaqItem(
                question=question,
                answer=answer,
                norm_question=_normalize(question),
                tokens=_tokenize(question),
            )
        )
    return items


def _score(query_tokens: set[str], query_norm: str, item: FaqItem) -> float:
    if not query_tokens or not item.tokens:
        return 0.0
    overlap = len(query_tokens & item.tokens)
    jaccard = overlap / max(len(query_tokens | item.tokens), 1)

    # Simple character-level similarity
    if query_norm == item.norm_question:
        char_sim = 1.0
    else:
        char_sim = 1.0 - (abs(len(query_norm) - len(item.norm_question)) / max(len(query_norm), len(item.norm_question), 1))

    return (0.7 * jaccard) + (0.3 * char_sim)


def search_faq(items: List[FaqItem], query: str, top_k: int = 5) -> List[Tuple[FaqItem, float]]:
    query_norm = _normalize(query)
    query_tokens = _tokenize(query)
    scored = [(item, _score(query_tokens, query_norm, item)) for item in items]
    scored.sort(key=lambda x: x[1], reverse=True)
    return scored[:top_k]
