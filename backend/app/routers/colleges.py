from fastapi import APIRouter, Query
from pydantic import BaseModel
import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import os

router = APIRouter()

# Paths
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "college-directory")
CSV_PATH = os.path.join(DATA_DIR, "kk_14.csv")
EMBEDDINGS_PATH = os.path.join(DATA_DIR, "college_embeddings.npy")

# Load data
_df = pd.read_csv(CSV_PATH)
_df = _df.fillna("")

# Normalize invalid websites
_df["WEBSITE"] = _df["WEBSITE"].apply(
    lambda w: "" if str(w).strip().upper() in ("NOT AVAILABLE", "NA", "N/A", "NONE", "-") else str(w).strip()
)
_df["_has_website"] = (_df["WEBSITE"] != "").astype(int)

# Load embeddings
_embeddings = np.load(EMBEDDINGS_PATH)

# Load model
_model = SentenceTransformer("all-MiniLM-L6-v2")

# Create FAISS index
_dimension = _embeddings.shape[1]
_index = faiss.IndexFlatL2(_dimension)
_index.add(_embeddings)

# Extract unique fields and states for filters
_all_fields = set()
for field in _df["FIELD"].dropna():
    for part in field.split(","):
        stripped = part.strip()
        if stripped:
            _all_fields.add(stripped)

_field_options = sorted(list(_all_fields))
_state_options = sorted(_df["STATE"].dropna().unique().tolist())


def _row_to_dict(row):
    return {
        "name": row["INSTITUTE NAME"],
        "address": row["INSTI_ADDRESS"],
        "state": row["STATE"],
        "website": row["WEBSITE"],
        "field": row["FIELD"],
        "placement": row["PLACEMENT"],
        "accreditation": row["ACCREDITED_BY"],
    }


class SearchRequest(BaseModel):
    query: str = ""
    field: str = ""
    state: str = ""
    limit: int = 50
    page: int = 1


@router.get("/filters")
def get_filters():
    """Return available filter options."""
    return {
        "fields": _field_options,
        "states": _state_options,
    }


@router.post("/search")
def search_colleges(req: SearchRequest):
    """Search colleges by AI query or filters."""
    per_page = min(req.limit, 100)
    page = max(req.page, 1)

    # AI semantic search if query provided
    if req.query.strip():
        # For semantic search, fetch more candidates then apply filters
        sem_limit = min(per_page * 5, 500)
        query_vector = _model.encode([req.query])
        distances, indices = _index.search(query_vector, sem_limit)
        results = _df.iloc[indices[0]]

        if req.field:
            results = results[results["FIELD"].str.contains(req.field, case=False, na=False)]
        if req.state:
            results = results[results["STATE"].str.contains(req.state, case=False, na=False)]

        # Sort: colleges with websites first
        results = results.sort_values("_has_website", ascending=False)

        total = len(results)
        start = (page - 1) * per_page
        page_results = results.iloc[start:start + per_page]
        colleges = [_row_to_dict(row) for _, row in page_results.iterrows()]
        return {"total": total, "page": page, "per_page": per_page, "colleges": colleges}

    # Filter-based search
    results = _df

    if req.field:
        results = results[results["FIELD"].str.contains(req.field, case=False, na=False)]

    if req.state:
        results = results[results["STATE"].str.contains(req.state, case=False, na=False)]

    # Sort: colleges with websites first
    results = results.sort_values("_has_website", ascending=False)

    total = len(results)
    start = (page - 1) * per_page
    page_results = results.iloc[start:start + per_page]
    colleges = [_row_to_dict(row) for _, row in page_results.iterrows()]
    return {"total": total, "page": page, "per_page": per_page, "colleges": colleges}


@router.get("/stats")
def get_stats():
    """Return basic stats about the college database."""
    return {
        "totalColleges": len(_df),
        "totalStates": len(_state_options),
        "totalFields": len(_field_options),
    }
