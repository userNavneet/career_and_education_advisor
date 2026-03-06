import json
from datetime import datetime
from pathlib import Path

from database.db import get_db


FAQ_PATH = Path("/Users/cheshta/Documents/GitHub/career_and_education_advisor/data/faq.json")


def main():
    if not FAQ_PATH.exists():
        raise SystemExit(f"Missing FAQ file: {FAQ_PATH}")

    db = get_db()
    db.faqs.create_index("question")

    rows = json.loads(FAQ_PATH.read_text())
    now = datetime.utcnow()
    inserted = 0
    updated = 0

    for row in rows:
        question = str(row.get("question", "")).strip()
        answer = str(row.get("answer", "")).strip()
        if not question or not answer:
            continue

        result = db.faqs.update_one(
            {"question": question},
            {"$set": {"answer": answer, "updated_at": now}, "$setOnInsert": {"created_at": now}},
            upsert=True,
        )
        if result.upserted_id:
            inserted += 1
        else:
            updated += 1

    print(f"FAQ sync complete: inserted={inserted}, updated={updated}")


if __name__ == "__main__":
    main()
