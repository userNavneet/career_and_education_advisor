import re
from datetime import datetime
from pathlib import Path
import os
from urllib.parse import quote_plus

import pandas as pd

from database.db import get_db


XLSX_PATH = Path(
    os.getenv(
        "CAREERS_XLSX_PATH",
        "/Users/cheshta/Documents/GitHub/career_and_education_advisor/data/careers.xlsx",
    )
)
MAX_SKILLS_PER_CAREER = int(os.getenv("MAX_SKILLS_PER_CAREER", "12"))
EXPAND_SKILL_CAREERS = os.getenv("EXPAND_SKILL_CAREERS", "").lower() in {"1", "true", "yes"}
CLEAR_CAREERS_BEFORE_IMPORT = os.getenv("CLEAR_CAREERS_BEFORE_IMPORT", "").lower() in {
    "1",
    "true",
    "yes",
}

FIELD_MAP = {
    "software": "Technology",
    "developer": "Technology",
    "development": "Technology",
    "data": "Technology",
    "ai": "Technology",
    "artificial": "Technology",
    "machine": "Technology",
    "cloud": "Technology",
    "cyber": "Technology",
    "security": "Technology",
    "engineer": "Engineering",
    "engineering": "Engineering",
    "civil": "Engineering",
    "mechanical": "Engineering",
    "electrical": "Engineering",
    "health": "Healthcare",
    "medical": "Healthcare",
    "nurse": "Healthcare",
    "doctor": "Healthcare",
    "finance": "Finance",
    "account": "Finance",
    "business": "Business",
    "marketing": "Business",
    "sales": "Business",
    "design": "Design",
    "ux": "Design",
    "ui": "Design",
    "art": "Arts",
    "law": "Law",
    "legal": "Law",
    "teacher": "Education",
    "education": "Education",
    "research": "Science",
    "science": "Science",
    "government": "Government",
    "public": "Government",
    "ngo": "Nonprofit",
    "social": "Nonprofit",
}


def normalize(text: str) -> str:
    text = (text or "").lower()
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def infer_field(name: str) -> str:
    low = name.lower()
    for key, field in FIELD_MAP.items():
        if key in low:
            return field
    return "General"


def parse_skills(raw: str):
    if not raw:
        return []
    parts = re.split(r"[,/;]\s*", raw)
    cleaned = []
    seen = set()
    for p in parts:
        skill = re.sub(r"\s+", " ", str(p).strip())
        if not skill:
            continue
        if len(skill) < 2 or len(skill) > 40:
            continue
        if len(skill.split()) > 5:
            continue
        key = skill.lower()
        if key in seen:
            continue
        seen.add(key)
        cleaned.append(skill)
        if len(cleaned) >= MAX_SKILLS_PER_CAREER:
            break
    return cleaned


def first_present(row, keys: list[str], default=""):
    for key in keys:
        if key in row and pd.notna(row[key]):
            value = str(row[key]).strip()
            if value:
                return value
    return default


def fallback_image_url(title: str, field: str) -> str:
    text = quote_plus(f"{title}")
    return f"https://placehold.co/1200x800/png?text={text}"


def main():
    if not XLSX_PATH.exists():
        raise SystemExit(f"Missing {XLSX_PATH}")

    df = pd.read_excel(XLSX_PATH)
    cols = {c: c.strip().lower() for c in df.columns}
    df = df.rename(columns=cols)
    if "career" not in df.columns:
        # handle common alternatives
        if "title" in df.columns:
            df = df.rename(columns={"title": "career"})
        elif "career_title" in df.columns:
            df = df.rename(columns={"career_title": "career"})
        elif "career name" in df.columns:
            df = df.rename(columns={"career name": "career"})

    if "skill" not in df.columns:
        if "skills" in df.columns:
            df = df.rename(columns={"skills": "skill"})
        elif "key skills" in df.columns:
            df = df.rename(columns={"key skills": "skill"})
        elif "required skills" in df.columns:
            df = df.rename(columns={"required skills": "skill"})

    if "career" not in df.columns:
        raise SystemExit(f"Missing career/title column. Found: {list(df.columns)}")

    db = get_db()
    db.careers.create_index("title_norm")
    db.careers.create_index("field")
    if CLEAR_CAREERS_BEFORE_IMPORT:
        db.careers.delete_many({})
    now = datetime.utcnow()
    inserted = 0
    updated = 0

    # Row-wise mode: create one career-card per (career, skill).
    # Useful when source file has only a few broad careers but many skills.
    if EXPAND_SKILL_CAREERS and "career" in df.columns and "skill" in df.columns:
        for _, row in df.iterrows():
            base_title = str(row.get("career", "")).strip()
            skill = str(row.get("skill", "")).strip()
            if not base_title or not skill:
                continue

            field = first_present(row, ["field", "category", "domain"], infer_field(base_title))
            title = f"{base_title} - {skill}"
            title_norm = normalize(title)
            description = f"Career track in {base_title} focused on {skill}."
            image_url = first_present(row, ["image_url", "image", "image link"], "")
            if not image_url:
                image_url = fallback_image_url(base_title, field)

            result = db.careers.update_one(
                {"title_norm": title_norm, "field": field},
                {
                    "$set": {
                        "title": title,
                        "title_norm": title_norm,
                        "field": field,
                        "description": description,
                        "average_salary": "",
                        "education_required": "",
                        "skills": [skill],
                        "growth_rate": "",
                        "demand_level": "",
                        "image_url": image_url,
                        "updated_at": now,
                    },
                    "$setOnInsert": {"created_at": now},
                },
                upsert=True,
            )
            if result.upserted_id:
                inserted += 1
            else:
                updated += 1

        print(
            "Careers import complete (expanded by skill): "
            f"inserted={inserted}, updated={updated}"
        )
        return

    for _, row in df.iterrows():
        title = str(row.get("career", "")).strip()
        if not title:
            continue
        skills = parse_skills(str(row.get("skill", "")).strip())
        field = first_present(row, ["field", "category", "domain"], infer_field(title))
        description = first_present(row, ["description", "summary", "about"], "")
        average_salary = first_present(row, ["average_salary", "salary", "avg salary"], "")
        education_required = first_present(
            row, ["education_required", "education", "qualification"], ""
        )
        growth_rate = first_present(row, ["growth_rate", "growth"], "")
        demand_level = first_present(row, ["demand_level", "demand"], "")
        image_url = first_present(row, ["image_url", "image", "image link"], "")
        if not image_url:
            image_url = fallback_image_url(title, field)

        key = {"title_norm": normalize(title), "field": field}
        existing = db.careers.find_one(key)

        if existing:
            existing_skills = existing.get("skills") or []
            merged = []
            seen = set()
            for s in skills + existing_skills:
                skill = str(s or "").strip()
                if not skill:
                    continue
                key = skill.lower()
                if key in seen:
                    continue
                seen.add(key)
                merged.append(skill)
                if len(merged) >= MAX_SKILLS_PER_CAREER:
                    break
            db.careers.update_one(
                {"_id": existing["_id"]},
                {
                    "$set": {
                        "skills": merged,
                        "description": description or existing.get("description", ""),
                        "average_salary": average_salary or existing.get("average_salary", ""),
                        "education_required": education_required
                        or existing.get("education_required", ""),
                        "growth_rate": growth_rate or existing.get("growth_rate", ""),
                        "demand_level": demand_level or existing.get("demand_level", ""),
                        "image_url": image_url or existing.get("image_url", ""),
                        "updated_at": now,
                    }
                },
            )
            updated += 1
        else:
            doc = {
                "title": title,
                "title_norm": normalize(title),
                "field": field,
                "description": description,
                "average_salary": average_salary,
                "education_required": education_required,
                "skills": skills,
                "growth_rate": growth_rate,
                "demand_level": demand_level,
                "image_url": image_url,
                "created_at": now,
                "updated_at": now,
            }
            db.careers.insert_one(doc)
            inserted += 1

    print(f"Careers import complete: inserted={inserted}, updated={updated}")


if __name__ == "__main__":
    main()
