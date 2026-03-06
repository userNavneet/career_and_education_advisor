import re
from collections import defaultdict

from bson import ObjectId

from database.db import get_db


def normalize(text: str) -> str:
    text = (text or "").lower()
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def main():
    db = get_db()
    groups = defaultdict(list)

    for doc in db.scholarships.find({}, {"name": 1, "provider": 1}):
        key = (normalize(doc.get("name")), normalize(doc.get("provider")))
        groups[key].append(doc["_id"])

    to_delete = []
    for ids in groups.values():
        if len(ids) > 1:
            # keep first, delete rest
            to_delete.extend(ids[1:])

    if to_delete:
        db.scholarships.delete_many({"_id": {"$in": to_delete}})
    print(f"Deleted {len(to_delete)} duplicates")


if __name__ == "__main__":
    main()
