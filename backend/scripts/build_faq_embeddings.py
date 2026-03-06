import json
from pathlib import Path

import numpy as np
from sentence_transformers import SentenceTransformer


def main():
    root = Path(__file__).resolve().parents[1]
    data_path = root.parent / "data" / "faq.json"
    out_path = root.parent / "data" / "faq_embeddings.npz"
    model_name = "all-MiniLM-L6-v2"

    if not data_path.exists():
        raise SystemExit(f"Missing {data_path}")

    data = json.loads(data_path.read_text())
    questions = [row["question"] for row in data]

    model = SentenceTransformer(model_name)
    embeddings = model.encode(questions, show_progress_bar=True, normalize_embeddings=True)
    np.savez_compressed(out_path, embeddings=embeddings)
    print(f"Wrote {len(questions)} embeddings to {out_path}")


if __name__ == "__main__":
    main()
