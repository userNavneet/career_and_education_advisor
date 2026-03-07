from __future__ import annotations

import argparse
from datetime import datetime
from pathlib import Path

import pandas as pd

from database.db import get_db


def _clean(value):
    if value is None:
        return ""
    text = str(value).strip()
    if not text or text.lower() == "nan":
        return ""
    return text


def main():
    parser = argparse.ArgumentParser(description="Import entrance/admission/scholarship dates to important_dates collection.")
    parser.add_argument("--input", required=True, help="CSV path with columns: title,date,category,notes")
    parser.add_argument("--clear", action="store_true", help="Clear old important dates before import")
    args = parser.parse_args()

    path = Path(args.input)
    if not path.exists():
        raise SystemExit(f"Missing input file: {path}")

    df = pd.read_csv(path)
    cols = {c: str(c).strip().lower() for c in df.columns}
    df = df.rename(columns=cols)
    if "title" not in df.columns or "date" not in df.columns:
        raise SystemExit(f"Input must have title,date columns. Found: {list(df.columns)}")

    db = get_db()
    if args.clear:
        db.important_dates.delete_many({})
    db.important_dates.create_index("date")
    db.important_dates.create_index("category")

    inserted = 0
    for _, row in df.iterrows():
        title = _clean(row.get("title"))
        date = _clean(row.get("date"))
        category = _clean(row.get("category")) or "exam"
        notes = _clean(row.get("notes"))
        if not title or not date:
            continue
        db.important_dates.update_one(
            {"title": title, "date": date, "category": category},
            {
                "$set": {"notes": notes, "updated_at": datetime.utcnow()},
                "$setOnInsert": {"created_at": datetime.utcnow()},
            },
            upsert=True,
        )
        inserted += 1

    print(f"Important dates import complete: processed={inserted}")


if __name__ == "__main__":
    main()
