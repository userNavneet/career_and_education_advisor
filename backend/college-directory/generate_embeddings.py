import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer

print("Loading dataset...")

df = pd.read_csv("kk_14.csv")

df["SEARCH_TEXT"] = (
    df["FIELD"].fillna("") + " " +
    df["STATE"].fillna("") + " " +
    df["INSTITUTE NAME"].fillna("")
)

print("Loading model...")

model = SentenceTransformer("all-MiniLM-L6-v2")

print("Generating embeddings...")

embeddings = model.encode(
    df["SEARCH_TEXT"].tolist(),
    show_progress_bar=True
)

np.save("college_embeddings.npy", embeddings)

print("Embeddings saved as college_embeddings.npy")