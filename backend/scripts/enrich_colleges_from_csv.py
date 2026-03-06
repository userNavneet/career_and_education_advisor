from __future__ import annotations

import argparse
import json
import os
import re
from datetime import datetime
from pathlib import Path

import pandas as pd
import requests


DEFAULT_INPUT = Path("/Users/cheshta/Downloads/KKcombined_cleaned (1).csv")
DEFAULT_OUTPUT_CSV = Path(
    "/Users/cheshta/Documents/GitHub/career_and_education_advisor/data/colleges_enriched.csv"
)
DEFAULT_OUTPUT_JSON = Path(
    "/Users/cheshta/Documents/GitHub/career_and_education_advisor/data/colleges_mongo.json"
)


def _clean_text(value: object) -> str:
    if value is None:
        return ""
    s = str(value).strip()
    if not s or s.lower() == "nan":
        return ""
    return re.sub(r"\s+", " ", s)


def _pick(*values: object) -> str:
    for value in values:
        cleaned = _clean_text(value)
        if cleaned:
            return cleaned
    return ""


def _normalize_name(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", (name or "").lower()).strip()


def _infer_college_type(name: str, current: str) -> str:
    if current:
        return current
    low = name.lower()
    if "institute of technology" in low or low.startswith("iit"):
        return "Public"
    if any(k in low for k in ["government", "state university", "national institute", "central"]):
        return "Public"
    if any(k in low for k in ["private", "deemed", "foundation"]):
        return "Private"
    return ""


def _split_programs(text: str) -> list[str]:
    if not text:
        return []
    parts = re.split(r"[,/;|]", text)
    out = []
    seen = set()
    for part in parts:
        p = _clean_text(part)
        if not p:
            continue
        key = p.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append(p)
        if len(out) >= 10:
            break
    return out


def _website_from_wikidata(name: str, session: requests.Session) -> str:
    # Free API fallback. Keep this lightweight and optional.
    try:
        resp = session.get(
            "https://www.wikidata.org/w/api.php",
            params={
                "action": "wbsearchentities",
                "search": name,
                "language": "en",
                "format": "json",
                "limit": 1,
                "type": "item",
            },
            timeout=8,
        )
        resp.raise_for_status()
        data = resp.json()
        items = data.get("search") or []
        if not items:
            return ""
        entity_id = items[0].get("id")
        if not entity_id:
            return ""

        entity_resp = session.get(
            "https://www.wikidata.org/wiki/Special:EntityData/" + entity_id + ".json",
            timeout=8,
        )
        entity_resp.raise_for_status()
        entity_data = entity_resp.json()
        entities = entity_data.get("entities", {})
        entity = entities.get(entity_id, {})
        claims = entity.get("claims", {})
        p856 = claims.get("P856") or []
        if not p856:
            return ""
        datavalue = (
            p856[0]
            .get("mainsnak", {})
            .get("datavalue", {})
            .get("value", "")
        )
        return _clean_text(datavalue)
    except Exception:
        return ""


def build_enriched_dataframe(df: pd.DataFrame, web_enrich: bool, web_limit: int) -> pd.DataFrame:
    cols = {c: str(c).strip().lower() for c in df.columns}
    df = df.rename(columns=cols)

    required = "institute name"
    if required not in df.columns:
        raise SystemExit(f"Missing required column: {required}")

    # Collapse duplicate rows by institute name
    grouped = {}
    for _, row in df.iterrows():
        name = _clean_text(row.get("institute name"))
        if not name:
            continue
        key = _normalize_name(name)
        entry = grouped.get(key)
        if entry is None:
            entry = {
                "name": name,
                "location": "",
                "college_type": "",
                "ranking": "",
                "tuition_fees": "",
                "programs": [],
                "acceptance_rate": "",
                "average_sat": "",
                "campus_size": "",
                "website": "",
                "image_url": "",
                "accredited_by": "",
                "placement": "",
                "avg_package": "",
                "highest_package": "",
                "aishe_code": "",
                "source": "csv",
                "updated_at": datetime.utcnow().isoformat(),
            }
            grouped[key] = entry

        entry["location"] = _pick(
            entry["location"],
            row.get("insti_address"),
            row.get("state"),
        )
        entry["college_type"] = _infer_college_type(
            entry["name"],
            _pick(entry["college_type"], row.get("college type"), row.get("type")),
        )
        entry["ranking"] = _pick(entry["ranking"], row.get("ranking"), row.get("rank"), row.get("rating_rank"))
        entry["tuition_fees"] = _pick(
            entry["tuition_fees"],
            row.get("course fees"),
            row.get("ug_fee"),
            row.get("pg_fee"),
            row.get("ug fee"),
            row.get("pg fee"),
        )
        entry["website"] = _pick(entry["website"], row.get("website"), row.get("insti_website"))
        entry["accredited_by"] = _pick(entry["accredited_by"], row.get("accredited_by"), row.get("aided by"))
        entry["placement"] = _pick(entry["placement"], row.get("placement"))
        entry["avg_package"] = _pick(entry["avg_package"], row.get("avg_package"), row.get("average packege"))
        entry["highest_package"] = _pick(
            entry["highest_package"], row.get("highest_package"), row.get("highest package")
        )
        entry["aishe_code"] = _pick(entry["aishe_code"], row.get("aishe code"))

        program_text = _pick(row.get("stream"), row.get("field"), row.get("stream "))
        for p in _split_programs(program_text):
            if p.lower() not in {x.lower() for x in entry["programs"]}:
                entry["programs"].append(p)
                if len(entry["programs"]) >= 10:
                    break

    items = list(grouped.values())

    if web_enrich:
        session = requests.Session()
        enriched = 0
        for item in items:
            if enriched >= web_limit:
                break
            if item["website"]:
                continue
            website = _website_from_wikidata(item["name"], session)
            if website:
                item["website"] = website
                item["source"] = "csv+wikidata"
                enriched += 1

    # always provide an image fallback for frontend cards
    for item in items:
        if not item["image_url"]:
            query = requests.utils.quote(item["name"])
            item["image_url"] = f"https://placehold.co/1200x800/png?text={query}"

    return pd.DataFrame(items).sort_values("name").reset_index(drop=True)


def to_mongo_docs(df: pd.DataFrame) -> list[dict]:
    docs = []
    now = datetime.utcnow()
    for _, row in df.iterrows():
        docs.append(
            {
                "name": _clean_text(row.get("name")),
                "location": _clean_text(row.get("location")),
                "college_type": _clean_text(row.get("college_type")),
                "ranking": int(float(row["ranking"])) if _clean_text(row.get("ranking")).replace(".", "", 1).isdigit() else None,
                "tuition_fees": _clean_text(row.get("tuition_fees")),
                "programs": row.get("programs") if isinstance(row.get("programs"), list) else [],
                "acceptance_rate": _clean_text(row.get("acceptance_rate")),
                "average_sat": _clean_text(row.get("average_sat")),
                "campus_size": _clean_text(row.get("campus_size")),
                "image_url": _clean_text(row.get("image_url")),
                "website": _clean_text(row.get("website")),
                "created_at": now,
                "updated_at": now,
            }
        )
    return docs


def main():
    parser = argparse.ArgumentParser(description="Enrich college directory CSV and prepare Mongo JSON.")
    parser.add_argument("--input", default=str(DEFAULT_INPUT))
    parser.add_argument("--output-csv", default=str(DEFAULT_OUTPUT_CSV))
    parser.add_argument("--output-json", default=str(DEFAULT_OUTPUT_JSON))
    parser.add_argument("--web-enrich", action="store_true", help="Try Wikidata website enrichment for missing websites.")
    parser.add_argument("--web-limit", type=int, default=300, help="Max rows to query via web enrichment.")
    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        raise SystemExit(f"Input not found: {input_path}")

    df = pd.read_csv(input_path, low_memory=False)
    enriched = build_enriched_dataframe(df, web_enrich=args.web_enrich, web_limit=args.web_limit)

    output_csv = Path(args.output_csv)
    output_csv.parent.mkdir(parents=True, exist_ok=True)
    enriched.to_csv(output_csv, index=False)

    docs = to_mongo_docs(enriched)
    output_json = Path(args.output_json)
    output_json.parent.mkdir(parents=True, exist_ok=True)
    with output_json.open("w", encoding="utf-8") as f:
        json.dump(docs, f, default=str, ensure_ascii=False, indent=2)

    print(f"Input rows: {len(df)}")
    print(f"Unique colleges: {len(enriched)}")
    print(f"Wrote enriched CSV: {output_csv}")
    print(f"Wrote Mongo JSON: {output_json}")


if __name__ == "__main__":
    main()
