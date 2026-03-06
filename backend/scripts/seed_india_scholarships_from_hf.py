import re
from datetime import datetime

from datasets import load_dataset

from database.db import get_db


DATASET_NAME = "NetraVerse/indian-govt-scholarships"

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


def _extract_title(row):
    for key in ("title", "name", "scheme", "scholarship"):
        if key in row and row[key]:
            return str(row[key]).strip()
    return ""


def _extract_text(row):
    for key in ("text", "content", "document_text", "body"):
        if key in row and row[key]:
            return str(row[key]).strip()
    return ""


def _extract_provider(text):
    for token in ("Ministry", "Government of", "Govt.", "Department", "Council", "Board"):
        if token in text:
            return token
    return ""


def _normalize_name(name, text):
    if name:
        return name
    if text:
        # Take first line as fallback name
        return text.splitlines()[0][:120].strip()
    return "Government Scholarship"


def main():
    print(f"Loading dataset: {DATASET_NAME}")
    ds = load_dataset(DATASET_NAME)
    split = "train" if "train" in ds else list(ds.keys())[0]
    records = ds[split]

    now = datetime.utcnow()
    docs = []
    seen = set()

    for row in records:
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

    db = get_db()
    if docs:
        db.scholarships.insert_many(docs)
    print(f"Imported {len(docs)} scholarships")


if __name__ == "__main__":
    main()
