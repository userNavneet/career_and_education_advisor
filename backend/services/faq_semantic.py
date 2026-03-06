import json
from dataclasses import dataclass
from pathlib import Path
from typing import List, Tuple

import numpy as np
from sentence_transformers import SentenceTransformer


@dataclass
class FaqItem:
    question: str
    answer: str


class FaqSemanticIndex:
    def __init__(self, items: List[FaqItem], embeddings: np.ndarray):
        self.items = items
        self.embeddings = embeddings / np.linalg.norm(embeddings, axis=1, keepdims=True)

    @classmethod
    def load(cls, data_path: Path, embeddings_path: Path):
        data = json.loads(data_path.read_text())
        items = [FaqItem(question=row["question"], answer=row["answer"]) for row in data]
        loaded = np.load(embeddings_path)
        embeddings = loaded["embeddings"]
        return cls(items, embeddings)

    @classmethod
    def from_items(cls, model: SentenceTransformer, items: List[FaqItem]):
        if not items:
            return cls([], np.zeros((0, 384)))
        questions = [item.question for item in items]
        embeddings = model.encode(questions, normalize_embeddings=True)
        return cls(items, np.array(embeddings))

    def search(self, model: SentenceTransformer, query: str, top_k: int = 5) -> List[Tuple[FaqItem, float]]:
        query_vec = model.encode([query], normalize_embeddings=True)
        scores = np.dot(self.embeddings, query_vec[0])
        top_idx = np.argsort(scores)[::-1][:top_k]
        return [(self.items[i], float(scores[i])) for i in top_idx]
