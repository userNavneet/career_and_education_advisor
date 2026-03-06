FIELDS = {
    "tech": "Technology & Software",
    "engineering": "Engineering",
    "healthcare": "Healthcare & Medicine",
    "business": "Business & Management",
    "finance": "Finance & Banking",
    "design": "Design & Creative",
    "arts": "Arts & Media",
    "education": "Education & Teaching",
    "science": "Science & Research",
    "law": "Law & Legal",
    "nonprofit": "Nonprofit & Social Work",
    "government": "Government & Public Service",
}


def _likert_options(field_key: str):
    return [
        {"id": "a", "text": "Strongly agree", "weight": {field_key: 3}},
        {"id": "b", "text": "Agree", "weight": {field_key: 2}},
        {"id": "c", "text": "Neutral", "weight": {field_key: 1}},
        {"id": "d", "text": "Disagree", "weight": {field_key: 0}},
    ]


def get_questions():
    questions = []
    q_id = 1

    field_items = list(FIELDS.items())
    # 12 fields total. We need 20 questions:
    # First 8 fields get 2 questions each (16), remaining 4 fields get 1 question each (4).
    two_question_fields = {key for key, _ in field_items[:8]}

    for field_key, field_label in field_items:
        questions.append(
            {
                "id": str(q_id),
                "category": field_label,
                "question": f"I enjoy learning and working in {field_label.lower()}.",
                "options": _likert_options(field_key),
            }
        )
        q_id += 1

        if field_key in two_question_fields:
            questions.append(
                {
                    "id": str(q_id),
                    "category": field_label,
                    "question": f"I can see myself building a career in {field_label.lower()}.",
                    "options": _likert_options(field_key),
                }
            )
            q_id += 1

    return questions


COURSE_RECOMMENDATIONS = {
    "tech": ["Python Programming", "Web Development", "Data Structures & Algorithms"],
    "engineering": ["Engineering Design Basics", "CAD Fundamentals", "Electronics & Circuits"],
    "healthcare": ["Human Biology", "Public Health Basics", "Medical Terminology"],
    "business": ["Business Fundamentals", "Marketing Essentials", "Entrepreneurship"],
    "finance": ["Financial Accounting", "Personal Finance", "Investment Basics"],
    "design": ["Graphic Design", "UI/UX Foundations", "Creative Thinking"],
    "arts": ["Digital Media", "Storytelling", "Visual Arts"],
    "education": ["Teaching Methods", "Learning Psychology", "Classroom Management"],
    "science": ["Research Methods", "Lab Safety", "Scientific Writing"],
    "law": ["Legal Studies 101", "Constitutional Law Basics", "Ethics & Society"],
    "nonprofit": ["Social Impact", "Fundraising Basics", "Community Development"],
    "government": ["Public Administration", "Policy Analysis", "Civic Studies"],
}
