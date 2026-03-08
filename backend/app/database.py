"""Database operations layer using SQLAlchemy + SQLite.

This module provides the same function signatures as the original JSON-file
database so that routers require minimal changes.
"""

import bcrypt
from sqlalchemy.orm import Session
from app.models import SessionLocal, User, Career, init_db


# -- helpers --

def _session() -> Session:
    return SessionLocal()


# -- User operations --

def get_user(email: str) -> dict | None:
    with _session() as db:
        user = db.query(User).filter(User.email == email).first()
        return user.to_dict(include_password=True) if user else None


def save_user(email: str, user_data: dict):
    with _session() as db:
        user = db.query(User).filter(User.email == email).first()
        if user:
            _apply_user_dict(user, user_data)
        else:
            user = User(email=email)
            _apply_user_dict(user, user_data)
            db.add(user)
        db.commit()


def get_all_users() -> dict:
    with _session() as db:
        users = db.query(User).all()
        return {u.email: u.to_dict(include_password=True) for u in users}


def delete_user(email: str) -> bool:
    with _session() as db:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return False
        db.delete(user)
        db.commit()
        return True


def update_user(email: str, updates: dict) -> dict | None:
    with _session() as db:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return None
        _apply_user_dict(user, updates)
        user.profile_completion = _calc_profile_completion(user)
        db.commit()
        db.refresh(user)
        return user.to_dict(include_password=True)


def _calc_profile_completion(user: User) -> int:
    """Calculate profile completion percentage based on filled fields."""
    score = 10  # base score for having an account
    profile = user.profile or {}
    academic = user.academic_info or {}
    interests = user.interests or []
    assessment = user.assessment_status or {}

    if profile.get("firstName"):
        score += 5
    if profile.get("lastName"):
        score += 5
    if profile.get("phone"):
        score += 10
    if profile.get("address"):
        score += 10
    if academic.get("school"):
        score += 10
    if academic.get("grade"):
        score += 10
    if academic.get("gpa"):
        score += 10
    if interests:
        score += 10
    if assessment.get("completed"):
        score += 20
    return min(score, 100)


def _apply_user_dict(user: User, data: dict):
    """Map a frontend-shaped dict onto a User ORM instance."""
    if "id" in data:
        user.id = data["id"]
    if "password_hash" in data:
        user.password_hash = data["password_hash"]
    if "role" in data:
        user.role = data["role"]
    if "profile" in data:
        user.profile = data["profile"]
    if "academicInfo" in data:
        user.academic_info = data["academicInfo"]
    if "interests" in data:
        user.interests = data["interests"]
    if "assessmentStatus" in data:
        user.assessment_status = data["assessmentStatus"]
    if "profileCompletion" in data:
        user.profile_completion = data["profileCompletion"]


# -- Career operations --

def get_careers() -> list[dict]:
    with _session() as db:
        careers = db.query(Career).all()
        return [c.to_dict() for c in careers]


def get_career(career_id: int) -> dict | None:
    with _session() as db:
        career = db.query(Career).filter(Career.id == career_id).first()
        return career.to_dict() if career else None


def save_career(career_data: dict) -> dict:
    with _session() as db:
        career = db.query(Career).filter(Career.id == career_data["id"]).first()
        if career:
            _apply_career_dict(career, career_data)
        else:
            career = Career()
            _apply_career_dict(career, career_data)
            db.add(career)
        db.commit()
        db.refresh(career)
        return career.to_dict()


def delete_career(career_id: int) -> bool:
    with _session() as db:
        career = db.query(Career).filter(Career.id == career_id).first()
        if not career:
            return False
        db.delete(career)
        db.commit()
        return True


def get_next_career_id() -> int:
    with _session() as db:
        from sqlalchemy import func
        max_id = db.query(func.max(Career.id)).scalar()
        return (max_id or 0) + 1


def _apply_career_dict(career: Career, data: dict):
    """Map a frontend-shaped dict onto a Career ORM instance."""
    if "id" in data:
        career.id = data["id"]
    if "title" in data:
        career.title = data["title"]
    if "field" in data:
        career.field = data["field"]
    if "description" in data:
        career.description = data["description"]
    if "averageSalary" in data:
        career.average_salary = data["averageSalary"]
    if "education" in data:
        career.education = data["education"]
    if "skills" in data:
        career.skills = data["skills"]
    if "growthRate" in data:
        career.growth_rate = data["growthRate"]
    if "demandLevel" in data:
        career.demand_level = data["demandLevel"]
    if "image" in data:
        career.image = data["image"]


# -- Seed data --

INITIAL_CAREERS = [
    {"id": 1, "title": "Software Developer", "field": "Technology & Software", "description": "Design, develop, and maintain software applications using modern programming languages and frameworks.", "averageSalary": "$95,000 - $150,000", "education": "Bachelor's in Computer Science or related field", "skills": ["Programming", "Problem Solving", "Data Structures", "Algorithms", "Git"], "growthRate": "22%", "demandLevel": "Very High", "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400"},
    {"id": 2, "title": "AI/Machine Learning Engineer", "field": "Technology & Software", "description": "Build intelligent systems using machine learning, deep learning, and natural language processing.", "averageSalary": "$110,000 - $180,000", "education": "Bachelor's/Master's in CS, AI, or Data Science", "skills": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Statistics"], "growthRate": "36%", "demandLevel": "Very High", "image": "https://images.unsplash.com/photo-1677442135136-760c813028c4?w=400"},
    {"id": 3, "title": "Data Scientist", "field": "Technology & Software", "description": "Analyze complex datasets to extract insights and drive business decisions using statistical methods.", "averageSalary": "$100,000 - $160,000", "education": "Bachelor's/Master's in Data Science, Statistics, or CS", "skills": ["Python", "SQL", "Machine Learning", "Statistics", "Data Visualization"], "growthRate": "30%", "demandLevel": "Very High", "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"},
    {"id": 4, "title": "Mechanical Engineer", "field": "Engineering", "description": "Design, analyze, and manufacture mechanical systems from engines to medical devices.", "averageSalary": "$70,000 - $110,000", "education": "Bachelor's in Mechanical Engineering", "skills": ["CAD", "Thermodynamics", "Mechanics", "Problem Solving", "MATLAB"], "growthRate": "7%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400"},
    {"id": 5, "title": "Civil Engineer", "field": "Engineering", "description": "Plan, design, and oversee construction of infrastructure projects like bridges, roads, and buildings.", "averageSalary": "$70,000 - $105,000", "education": "Bachelor's in Civil Engineering", "skills": ["AutoCAD", "Project Management", "Structural Analysis", "Planning"], "growthRate": "8%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400"},
    {"id": 6, "title": "Robotics Engineer", "field": "Engineering", "description": "Design, build, and program robots and automated systems for manufacturing, healthcare, and exploration.", "averageSalary": "$85,000 - $130,000", "education": "Bachelor's/Master's in Robotics or Mechatronics", "skills": ["ROS", "Embedded Systems", "C++", "Control Systems", "Computer Vision"], "growthRate": "15%", "demandLevel": "High", "image": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400"},
    {"id": 7, "title": "Investment Banker", "field": "Finance & Banking", "description": "Advise corporations on mergers, acquisitions, and capital raising through financial markets.", "averageSalary": "$100,000 - $200,000", "education": "Bachelor's in Finance, Economics, or MBA", "skills": ["Financial Modeling", "Valuation", "Excel", "Deal Structuring", "Communication"], "growthRate": "8%", "demandLevel": "High", "image": "https://images.unsplash.com/photo-1554224311-beee460c201f?w=400"},
    {"id": 8, "title": "Financial Analyst", "field": "Finance & Banking", "description": "Analyze financial data, prepare reports, and guide investment and business decisions.", "averageSalary": "$65,000 - $100,000", "education": "Bachelor's in Finance, Accounting, or Economics", "skills": ["Excel", "Financial Modeling", "Analysis", "Reporting", "SQL"], "growthRate": "6%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400"},
    {"id": 9, "title": "Chartered Accountant", "field": "Finance & Banking", "description": "Manage financial accounting, auditing, taxation, and regulatory compliance for organizations.", "averageSalary": "$60,000 - $120,000", "education": "CA/CPA Certification + Bachelor's in Accounting", "skills": ["Accounting", "Taxation", "Auditing", "Financial Reporting", "Compliance"], "growthRate": "5%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400"},
    {"id": 10, "title": "Doctor / Physician", "field": "Healthcare & Medicine", "description": "Diagnose and treat illnesses, injuries, and medical conditions to maintain patient health.", "averageSalary": "$200,000 - $400,000", "education": "Medical Degree (MD/MBBS) + Residency", "skills": ["Medical Knowledge", "Patient Care", "Diagnosis", "Communication", "Critical Thinking"], "growthRate": "7%", "demandLevel": "High", "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400"},
    {"id": 11, "title": "Medical Researcher", "field": "Healthcare & Medicine", "description": "Conduct clinical and laboratory research to develop new treatments, drugs, and medical technologies.", "averageSalary": "$80,000 - $140,000", "education": "MD/PhD in Biomedical Sciences or related field", "skills": ["Research Methods", "Clinical Trials", "Data Analysis", "Lab Techniques", "Scientific Writing"], "growthRate": "10%", "demandLevel": "High", "image": "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400"},
    {"id": 12, "title": "Pharmacist", "field": "Healthcare & Medicine", "description": "Dispense medications, advise patients on drug interactions, and ensure safe pharmaceutical practices.", "averageSalary": "$90,000 - $130,000", "education": "Doctor of Pharmacy (PharmD) or B.Pharm", "skills": ["Pharmacology", "Patient Counseling", "Drug Interactions", "Attention to Detail"], "growthRate": "4%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400"},
    {"id": 13, "title": "UI/UX Designer", "field": "Design & Creative", "description": "Create user-friendly interfaces and experiences for websites, apps, and digital products.", "averageSalary": "$70,000 - $120,000", "education": "Bachelor's in Design, HCI, or related field", "skills": ["Figma", "User Research", "Prototyping", "Visual Design", "Wireframing"], "growthRate": "13%", "demandLevel": "High", "image": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400"},
    {"id": 14, "title": "Graphic Designer", "field": "Design & Creative", "description": "Create visual content for branding, marketing, print media, and digital platforms.", "averageSalary": "$45,000 - $80,000", "education": "Bachelor's in Graphic Design or Visual Arts", "skills": ["Adobe Creative Suite", "Typography", "Branding", "Illustration", "Color Theory"], "growthRate": "6%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400"},
    {"id": 15, "title": "Product Designer", "field": "Design & Creative", "description": "Design end-to-end product experiences from concept to launch, combining research and visual design.", "averageSalary": "$80,000 - $140,000", "education": "Bachelor's in Industrial/Product Design or HCI", "skills": ["Design Thinking", "Prototyping", "User Research", "Figma", "Product Strategy"], "growthRate": "11%", "demandLevel": "High", "image": "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400"},
    {"id": 16, "title": "Filmmaker / Director", "field": "Arts & Media", "description": "Direct and produce films, documentaries, and video content for entertainment and education.", "averageSalary": "$50,000 - $120,000", "education": "Bachelor's in Film Studies, Media Production, or related", "skills": ["Storytelling", "Video Editing", "Cinematography", "Direction", "Scriptwriting"], "growthRate": "9%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400"},
    {"id": 17, "title": "Content Creator", "field": "Arts & Media", "description": "Produce engaging digital content including videos, podcasts, blogs, and social media for audiences.", "averageSalary": "$40,000 - $100,000", "education": "Bachelor's in Media, Communications, or self-taught", "skills": ["Video Production", "Social Media", "Writing", "SEO", "Audience Engagement"], "growthRate": "18%", "demandLevel": "High", "image": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400"},
    {"id": 18, "title": "Journalist", "field": "Arts & Media", "description": "Research, investigate, and report news stories across print, broadcast, and digital media.", "averageSalary": "$40,000 - $80,000", "education": "Bachelor's in Journalism or Mass Communication", "skills": ["Writing", "Research", "Interviewing", "Reporting", "Critical Thinking"], "growthRate": "3%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=400"},
    {"id": 19, "title": "Lawyer / Attorney", "field": "Law & Legal", "description": "Represent clients in legal matters, provide counsel, and advocate in courts and negotiations.", "averageSalary": "$80,000 - $180,000", "education": "Law Degree (LLB/JD) + Bar Exam", "skills": ["Legal Research", "Argumentation", "Negotiation", "Writing", "Critical Analysis"], "growthRate": "6%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400"},
    {"id": 20, "title": "Legal Advisor", "field": "Law & Legal", "description": "Provide expert legal guidance to corporations on compliance, contracts, and regulatory matters.", "averageSalary": "$90,000 - $160,000", "education": "Law Degree + specialization in Corporate Law", "skills": ["Contract Law", "Compliance", "Risk Assessment", "Advisory", "Regulatory Knowledge"], "growthRate": "7%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400"},
    {"id": 21, "title": "Corporate Counsel", "field": "Law & Legal", "description": "Serve as in-house legal expert for companies, handling contracts, IP, and corporate governance.", "averageSalary": "$100,000 - $200,000", "education": "Law Degree (LLB/JD) + Corporate experience", "skills": ["Corporate Law", "IP Law", "Contract Drafting", "Governance", "Negotiation"], "growthRate": "8%", "demandLevel": "High", "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400"},
    {"id": 22, "title": "Product Manager", "field": "Business & Management", "description": "Lead product development from ideation to launch, aligning business goals with user needs.", "averageSalary": "$90,000 - $160,000", "education": "Bachelor's in Business, CS, or MBA", "skills": ["Product Strategy", "Agile", "Data Analysis", "Leadership", "Communication"], "growthRate": "12%", "demandLevel": "Very High", "image": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400"},
    {"id": 23, "title": "Management Consultant", "field": "Business & Management", "description": "Advise organizations on strategy, operations, and organizational improvement to boost performance.", "averageSalary": "$85,000 - $170,000", "education": "Bachelor's/MBA in Business, Economics, or related", "skills": ["Strategy", "Problem Solving", "Presentation", "Data Analysis", "Client Management"], "growthRate": "10%", "demandLevel": "High", "image": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400"},
    {"id": 24, "title": "Entrepreneur", "field": "Business & Management", "description": "Start and grow businesses, identify market opportunities, and build innovative products or services.", "averageSalary": "Variable (equity-based)", "education": "Any background; MBA/Business degree helpful", "skills": ["Leadership", "Innovation", "Risk Management", "Fundraising", "Marketing"], "growthRate": "15%", "demandLevel": "High", "image": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400"},
    {"id": 25, "title": "University Professor", "field": "Education & Teaching", "description": "Teach at university level, conduct academic research, and mentor students in their field of expertise.", "averageSalary": "$70,000 - $130,000", "education": "PhD in relevant field", "skills": ["Teaching", "Research", "Academic Writing", "Mentoring", "Subject Expertise"], "growthRate": "5%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400"},
    {"id": 26, "title": "School Teacher", "field": "Education & Teaching", "description": "Educate and inspire K-12 students through engaging lesson plans and classroom instruction.", "averageSalary": "$45,000 - $75,000", "education": "Bachelor's in Education + Teaching Certificate", "skills": ["Pedagogy", "Communication", "Classroom Management", "Patience", "Curriculum Design"], "growthRate": "4%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400"},
    {"id": 27, "title": "Instructional Designer", "field": "Education & Teaching", "description": "Design effective learning experiences, e-learning courses, and training programs using modern pedagogy.", "averageSalary": "$60,000 - $100,000", "education": "Bachelor's/Master's in Instructional Design or Education", "skills": ["Course Design", "LMS", "E-Learning Tools", "Assessment Design", "UX for Learning"], "growthRate": "11%", "demandLevel": "High", "image": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400"},
    {"id": 28, "title": "Research Scientist", "field": "Science & Research", "description": "Conduct experiments and investigations to advance scientific knowledge in physics, chemistry, or biology.", "averageSalary": "$75,000 - $130,000", "education": "PhD in a scientific discipline", "skills": ["Research Methods", "Data Analysis", "Lab Techniques", "Scientific Writing", "Critical Thinking"], "growthRate": "8%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400"},
    {"id": 29, "title": "Environmental Scientist", "field": "Science & Research", "description": "Study and develop solutions to environmental problems including pollution, climate change, and conservation.", "averageSalary": "$60,000 - $100,000", "education": "Bachelor's/Master's in Environmental Science", "skills": ["Environmental Analysis", "GIS", "Field Research", "Policy", "Data Modeling"], "growthRate": "10%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400"},
    {"id": 30, "title": "Biotechnologist", "field": "Science & Research", "description": "Apply biological systems and organisms to develop products in healthcare, agriculture, and industry.", "averageSalary": "$70,000 - $120,000", "education": "Bachelor's/Master's in Biotechnology or Biology", "skills": ["Molecular Biology", "Genetics", "Lab Techniques", "Bioinformatics", "Research"], "growthRate": "12%", "demandLevel": "High", "image": "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400"},
    {"id": 31, "title": "Social Worker", "field": "Nonprofit & Social Work", "description": "Help individuals and families cope with challenges through counseling, advocacy, and community resources.", "averageSalary": "$40,000 - $65,000", "education": "Bachelor's/Master's in Social Work (BSW/MSW)", "skills": ["Counseling", "Empathy", "Case Management", "Advocacy", "Crisis Intervention"], "growthRate": "9%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400"},
    {"id": 32, "title": "Community Development Manager", "field": "Nonprofit & Social Work", "description": "Plan and execute programs to improve communities through economic, social, and health initiatives.", "averageSalary": "$50,000 - $85,000", "education": "Bachelor's in Social Sciences, Public Policy, or related", "skills": ["Program Management", "Community Engagement", "Grant Writing", "Leadership", "Planning"], "growthRate": "7%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400"},
    {"id": 33, "title": "NGO Program Director", "field": "Nonprofit & Social Work", "description": "Lead nonprofit programs focused on education, health, poverty, or human rights across communities.", "averageSalary": "$55,000 - $95,000", "education": "Bachelor's/Master's in Nonprofit Management or Public Admin", "skills": ["Program Strategy", "Fundraising", "Leadership", "Impact Assessment", "Stakeholder Relations"], "growthRate": "8%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400"},
    {"id": 34, "title": "Civil Servant (IAS/IPS)", "field": "Government & Public Service", "description": "Serve in government administration, managing public services, policies, and district governance.", "averageSalary": "$30,000 - $80,000", "education": "Bachelor's degree + Competitive Exam (UPSC/Civil Services)", "skills": ["Public Administration", "Policy Analysis", "Leadership", "Communication", "Decision Making"], "growthRate": "3%", "demandLevel": "High", "image": "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=400"},
    {"id": 35, "title": "Policy Analyst", "field": "Government & Public Service", "description": "Research and analyze public policies, evaluate their impact, and recommend improvements to government.", "averageSalary": "$55,000 - $100,000", "education": "Master's in Public Policy, Political Science, or Economics", "skills": ["Policy Research", "Data Analysis", "Report Writing", "Statistics", "Critical Thinking"], "growthRate": "6%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400"},
    {"id": 36, "title": "Urban Planner", "field": "Government & Public Service", "description": "Design and plan urban spaces, zoning, land use, and community development for cities and regions.", "averageSalary": "$55,000 - $95,000", "education": "Master's in Urban Planning or Architecture", "skills": ["GIS", "Zoning", "Community Planning", "Environmental Policy", "Project Management"], "growthRate": "7%", "demandLevel": "Medium", "image": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400"},
]


def seed_db():
    """Seed the database with initial data if tables are empty."""
    init_db()
    db = SessionLocal()
    try:
        # Seed admin + demo student if no users exist
        if db.query(User).count() == 0:
            admin = User(
                id="admin-1",
                email="admin@example.com",
                password_hash=bcrypt.hashpw(b"admin123", bcrypt.gensalt()).decode(),
                role="admin",
                profile={"firstName": "Michael", "lastName": "Chen", "phone": "+1-234-567-8902", "avatar": "https://i.pravatar.cc/150?img=8"},
            )
            student = User(
                id="student-1",
                email="student@example.com",
                password_hash=bcrypt.hashpw(b"student123", bcrypt.gensalt()).decode(),
                role="student",
                profile={"firstName": "Alex", "lastName": "Johnson", "phone": "+1-234-567-8900", "avatar": "https://i.pravatar.cc/150?img=12"},
                academic_info={"grade": "12th", "school": "Lincoln High School", "gpa": 3.8, "satScore": 1450, "actScore": 32},
                interests=["Technology", "Robotics", "Music", "Sports"],
                assessment_status={"completed": False, "results": None},
                profile_completion=85,
            )
            db.add_all([admin, student])
            db.commit()
            print("[DB] Seeded admin and demo student")

        # Seed careers if table is empty
        if db.query(Career).count() == 0:
            for c_data in INITIAL_CAREERS:
                career = Career(
                    id=c_data["id"],
                    title=c_data["title"],
                    field=c_data["field"],
                    description=c_data["description"],
                    average_salary=c_data["averageSalary"],
                    education=c_data["education"],
                    skills=c_data["skills"],
                    growth_rate=c_data["growthRate"],
                    demand_level=c_data["demandLevel"],
                    image=c_data["image"],
                )
                db.add(career)
            db.commit()
            print(f"[DB] Seeded {len(INITIAL_CAREERS)} careers")
    finally:
        db.close()
