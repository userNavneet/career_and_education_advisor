import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

st.set_page_config(page_title="Career Assessment")

st.title("🎓 Career Interest Assessment")

st.write("Answer the following questions to discover your career interests.")

# Load dataset
df = pd.read_csv("student_career_assessment_questions.csv")

responses = []

# Likert scale options
scale = {
"Strongly Disagree":1,
"Disagree":2,
"Neutral":3,
"Agree":4,
"Strongly Agree":5
}

st.subheader("Assessment Questions")

# Display questions
for index, row in df.iterrows():

    answer = st.radio(
        row["question"],
        list(scale.keys()),
        key=index
    )

    responses.append(scale[answer])

# Submit button
if st.button("Submit Assessment"):

    df["score"] = responses

    category_scores = df.groupby("category")["score"].sum()

    category_scores = category_scores.sort_values(ascending=False)

    st.subheader("📊 Your Career Interest Profile")

    fig, ax = plt.subplots(figsize=(10,6))

    sns.barplot(
        x=category_scores.values,
        y=category_scores.index,
        ax=ax
    )

    ax.set_xlabel("Interest Score")
    ax.set_ylabel("Career Domain")

    st.pyplot(fig)

    # Career recommendations
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

    st.subheader("💼 Recommended Careers")

    top_categories = category_scores.head(3)

    for category in top_categories.index:

        st.write("###", category)

        careers = career_map.get(category,[])

        for career in careers:

            st.write("-",career)