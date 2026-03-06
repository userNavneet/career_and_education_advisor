from __future__ import annotations

import argparse
import json
from pathlib import Path

from database.db import get_db


DEFAULT_INPUT = Path(
    "/Users/cheshta/Documents/GitHub/career_and_education_advisor/data/colleges_mongo.json"
)


def main():
    parser = argparse.ArgumentParser(description="Import enriched college JSON into MongoDB.")
    parser.add_argument("--input", default=str(DEFAULT_INPUT))
    parser.add_argument("--clear", action="store_true", help="Delete existing colleges before import.")
    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        raise SystemExit(f"Missing input: {input_path}")

    docs = json.loads(input_path.read_text(encoding="utf-8"))
    if not isinstance(docs, list):
        raise SystemExit("Input JSON must be a list of documents")

    db = get_db()
    if args.clear:
        db.colleges.delete_many({})

    db.colleges.create_index("name")
    db.colleges.create_index("location")

    inserted = 0
    updated = 0
    for doc in docs:
        name = str(doc.get("name", "")).strip()
        location = str(doc.get("location", "")).strip()
        if not name:
            continue
        result = db.colleges.update_one(
            {"name": name, "location": location},
            {"$set": doc},
            upsert=True,
        )
        if result.upserted_id:
            inserted += 1
        else:
            updated += 1

    print(f"College import complete: inserted={inserted}, updated={updated}, total={len(docs)}")


if __name__ == "__main__":
    main()
