import os
import re
from datetime import datetime

import requests

from database.db import get_db


DATASET = "NetraVerse/indian-govt-scholarships"
CONFIG = "default"
SPLIT = "train"

ROWS_URL = "https://datasets-server.huggingface.co/rows"

RE_AMOUNT = re.compile(r"(₹|INR)\s?[\d,]+(?:\s?(lakh|lakhs|crore|cr))?", re.IGNORECASE)
RE_DEADLINE = re.compile(
    r"(deadline|last date|closing date|apply by)\s*[:\-]?\s*([A-Za-z0-9 ,\/-]{4,40})",
    re.IGNORECASE,
)
RE_URL = re.compile(r"https?://\S+")


def _first_match(regex, text):
    if not text:
        return ""
    m = regex.search(text)
    if not m:
        return ""
    return m.group(0)


def _extract_text(row):
    for key in ("text", "content", "document_text", "body"):
        if key in row and row[key]:
            return str(row[key]).strip()
    return ""


def _extract_title(row):
    for key in ("title", "name", "scheme", "scholarship"):
        if key in row and row[key]:
            return str(row[key]).strip()
    return ""


def _normalize_name(name, text):
    if name:
        return name
    if text:
        return text.splitlines()[0][:120].strip()
    return "Government Scholarship"


def _extract_provider(text):
    for token in ("Ministry", "Government of", "Govt.", "Department", "Council", "Board"):
        if token in text:
            return token
    return ""


def fetch_rows(offset: int, length: int):
    params = {
        "dataset": DATASET,
        "config": CONFIG,
        "split": SPLIT,
        "offset": offset,
        "length": length,
    }
    resp = requests.get(ROWS_URL, params=params, timeout=60)
    resp.raise_for_status()
    return resp.json()


def main():
    batch_size = int(os.getenv("HF_BATCH_SIZE", "100"))
    max_rows = int(os.getenv("HF_MAX_ROWS", "1000"))

    db = get_db()
    now = datetime.utcnow()
    seen = set()
    inserted = 0

    offset = 0
    while offset < max_rows:
        payload = fetch_rows(offset, batch_size)
        rows = payload.get("rows", [])
        if not rows:
            break

        docs = []
        for entry in rows:
            row = entry.get("row", {})
            name = _extract_title(row)
            text = _extract_text(row)
            name = _normalize_name(name, text)
            if not name:
                continue

            amount = _first_match(RE_AMOUNT, text)
            deadline = ""
            m = RE_DEADLINE.search(text or "")
            if m:
                deadline = m.group(2).strip()

            link = _first_match(RE_URL, text)
            provider = _extract_provider(text)

            key = (name.lower().strip(), provider.lower().strip())
            if key in seen:
                continue
            seen.add(key)

            docs.append(
                {
                    "name": name,
                    "provider": provider or "Government of India",
                    "amount": amount,
                    "deadline": deadline,
                    "eligibility": "",
                    "description": text[:1200] if text else "",
                    "category": "Government",
                    "application_link": link,
                    "created_at": now,
                    "updated_at": now,
                }
            )

        if docs:
            db.scholarships.insert_many(docs)
            inserted += len(docs)

        offset += batch_size

    print(f"Imported {inserted} scholarships from HF rows API")


if __name__ == "__main__":
    main()
