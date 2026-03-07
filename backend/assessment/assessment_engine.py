import pandas as pd

df = pd.read_csv("student_career_assessment_questions.csv")

career_map = {

"Technology & Software":[
"Software Developer","AI Engineer","Data Scientist"
],

"Engineering":[
"Mechanical Engineer","Civil Engineer","Robotics Engineer"
],

"Finance & Banking":[
"Investment Banker","Financial Analyst"
],

"Healthcare & Medicine":[
"Doctor","Medical Researcher","Nurse"
],

"Design & Creative":[
"UI/UX Designer","Graphic Designer"
],

"Arts & Media":[
"Filmmaker","Content Creator","Journalist"
],

"Law & Legal":[
"Lawyer","Legal Advisor"
],

"Business & Management":[
"Product Manager","Entrepreneur"
],

"Education & Teaching":[
"Professor","Teacher"
],

"Science & Research":[
"Scientist","Research Analyst"
],

"Nonprofit & Social Work":[
"Social Worker","Community Manager"
],

"Government & Public Service":[
"Civil Servant","Policy Analyst"
]

}

def run_assessment(responses):

    df["score"] = responses

    category_scores = df.groupby("category")["score"].sum()

    category_scores = category_scores.sort_values(ascending=False)

    top_categories = category_scores.head(3)

    recommendations = {}

    for category in top_categories.index:

        recommendations[category] = career_map.get(category,[])

    return {
        "scores":category_scores.to_dict(),
        "top_categories":list(top_categories.index),
        "recommendations":recommendations
    }