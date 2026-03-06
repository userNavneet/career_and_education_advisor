from datetime import datetime

from database.db import get_db


SEED_SCHOLARSHIPS = [
    {
        "name": "Gates Scholarship",
        "amount": "Full tuition + expenses",
        "deadline": "2024-09-15",
        "eligibility": "High school seniors from low-income households",
        "category": "Merit-based",
        "description": "Covers full cost of attendance at any US accredited college.",
        "provider": "Gates Foundation",
        "application_link": "https://www.thegatesscholarship.org",
    },
    {
        "name": "National Merit Scholarship",
        "amount": "$2,500",
        "deadline": "2024-10-01",
        "eligibility": "High PSAT/NMSQT scorers",
        "category": "Merit-based",
        "description": "Awarded to finalists in the National Merit Scholarship Program.",
        "provider": "National Merit Scholarship Corporation",
        "application_link": "https://www.nationalmerit.org",
    },
    {
        "name": "Coca-Cola Scholars Program",
        "amount": "$20,000",
        "deadline": "2024-10-31",
        "eligibility": "High school seniors with minimum 3.0 GPA",
        "category": "Merit-based",
        "description": "For students demonstrating leadership and community service.",
        "provider": "Coca-Cola Scholars Foundation",
        "application_link": "https://www.coca-colascholarsfoundation.org",
    },
    {
        "name": "Dell Scholars Program",
        "amount": "$20,000 + laptop",
        "deadline": "2024-12-01",
        "eligibility": "Students participating in college readiness programs",
        "category": "Need-based",
        "description": "For students who demonstrate determination to succeed.",
        "provider": "Dell Foundation",
        "application_link": "https://www.dellscholars.org",
    },
    {
        "name": "QuestBridge National College Match",
        "amount": "Full 4-year scholarship",
        "deadline": "2024-09-27",
        "eligibility": "High-achieving, low-income students",
        "category": "Need-based",
        "description": "Matches students with full scholarships to top colleges.",
        "provider": "QuestBridge",
        "application_link": "https://www.questbridge.org",
    },
    {
        "name": "STEM Excellence Scholarship",
        "amount": "$5,000",
        "deadline": "2024-11-15",
        "eligibility": "Students pursuing STEM degrees",
        "category": "Field-specific",
        "description": "For students showing exceptional promise in STEM fields.",
        "provider": "STEM Foundation",
        "application_link": "https://www.stemscholarship.org",
    },
]


def main():
    db = get_db()
    now = datetime.utcnow()
    docs = []
    for s in SEED_SCHOLARSHIPS:
        doc = {**s, "created_at": now, "updated_at": now}
        docs.append(doc)
    if docs:
        db.scholarships.insert_many(docs)
    print(f"Seeded {len(docs)} scholarships")


if __name__ == "__main__":
    main()
