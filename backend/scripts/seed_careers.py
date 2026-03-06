from datetime import datetime

from database.db import get_db


SEED_CAREERS = [
    {
        "title": "Software Engineer",
        "field": "Technology",
        "description": "Design, develop, and maintain software applications and systems.",
        "average_salary": "$95,000 - $150,000",
        "education_required": "Bachelor's in Computer Science or related field",
        "skills": ["Programming", "Problem Solving", "Algorithms", "Data Structures"],
        "growth_rate": "22%",
        "demand_level": "Very High",
        "image_url": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
    },
    {
        "title": "Data Scientist",
        "field": "Technology",
        "description": "Analyze complex data to help companies make better decisions.",
        "average_salary": "$100,000 - $160,000",
        "education_required": "Bachelor's or Master's in Data Science, Statistics, or Computer Science",
        "skills": ["Python", "Machine Learning", "Statistics", "SQL"],
        "growth_rate": "36%",
        "demand_level": "Very High",
        "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    },
    {
        "title": "Physician",
        "field": "Healthcare",
        "description": "Diagnose and treat illnesses and injuries to maintain patient health.",
        "average_salary": "$200,000 - $400,000",
        "education_required": "Medical Degree (MD or DO) + Residency",
        "skills": ["Medical Knowledge", "Patient Care", "Communication", "Critical Thinking"],
        "growth_rate": "7%",
        "demand_level": "High",
        "image_url": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    },
    {
        "title": "Mechanical Engineer",
        "field": "Engineering",
        "description": "Design and develop mechanical systems and products.",
        "average_salary": "$70,000 - $110,000",
        "education_required": "Bachelor's in Mechanical Engineering",
        "skills": ["CAD", "Thermodynamics", "Mechanics", "Problem Solving"],
        "growth_rate": "7%",
        "demand_level": "Medium",
        "image_url": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
    },
    {
        "title": "Marketing Manager",
        "field": "Business",
        "description": "Develop marketing strategies to promote products and services.",
        "average_salary": "$75,000 - $130,000",
        "education_required": "Bachelor's in Marketing, Business, or related field",
        "skills": ["Marketing Strategy", "Digital Marketing", "Analytics", "Communication"],
        "growth_rate": "10%",
        "demand_level": "High",
        "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    },
    {
        "title": "UX/UI Designer",
        "field": "Design",
        "description": "Create user-friendly interfaces and enhance user experience.",
        "average_salary": "$70,000 - $120,000",
        "education_required": "Bachelor's in Design, HCI, or related field",
        "skills": ["Figma", "User Research", "Prototyping", "Visual Design"],
        "growth_rate": "13%",
        "demand_level": "High",
        "image_url": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
    },
    {
        "title": "Financial Analyst",
        "field": "Finance",
        "description": "Analyze financial data to guide business decisions.",
        "average_salary": "$65,000 - $100,000",
        "education_required": "Bachelor's in Finance, Accounting, or Economics",
        "skills": ["Excel", "Financial Modeling", "Analysis", "Reporting"],
        "growth_rate": "6%",
        "demand_level": "Medium",
        "image_url": "https://images.unsplash.com/photo-1554224311-beee460c201f?w=400",
    },
    {
        "title": "Civil Engineer",
        "field": "Engineering",
        "description": "Design and oversee construction of infrastructure projects.",
        "average_salary": "$70,000 - $105,000",
        "education_required": "Bachelor's in Civil Engineering",
        "skills": ["AutoCAD", "Project Management", "Structural Analysis", "Planning"],
        "growth_rate": "8%",
        "demand_level": "Medium",
        "image_url": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400",
    },
]


def main():
    db = get_db()
    now = datetime.utcnow()
    docs = []
    for c in SEED_CAREERS:
        doc = {**c, "created_at": now, "updated_at": now}
        docs.append(doc)
    if docs:
        db.careers.insert_many(docs)
    print(f"Seeded {len(docs)} careers")


if __name__ == "__main__":
    main()
