import streamlit as st
import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

st.set_page_config(page_title="EduMatch", page_icon="🎓", layout="wide")

st.title("🎓 EduMatch")
st.subheader("Find the Best College for Your Future")

# --------------------------------
# LOAD DATA
# --------------------------------

@st.cache_data
def load_data():
    df = pd.read_csv("kk_14.csv")
    embeddings = np.load("college_embeddings.npy")
    return df, embeddings

df, embeddings = load_data()

# --------------------------------
# LOAD MODEL
# --------------------------------

@st.cache_resource
def load_model():
    return SentenceTransformer("all-MiniLM-L6-v2")

model = load_model()

# --------------------------------
# CREATE FAISS INDEX
# --------------------------------

dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

# --------------------------------
# CREATE UNIQUE FIELD DROPDOWN
# --------------------------------

all_fields = set()

for field in df["FIELD"].dropna():
    parts = field.split(",")
    for p in parts:
        all_fields.add(p.strip())

field_options = sorted(list(all_fields))

# --------------------------------
# CREATE STATE DROPDOWN
# --------------------------------

state_options = ["ALL"] + sorted(df["STATE"].dropna().unique())

# --------------------------------
# SEARCH OPTIONS
# --------------------------------

st.markdown("### 🔎 Search Options")

col1, col2 = st.columns(2)

with col1:
    selected_field = st.selectbox("Select Field", field_options)

with col2:
    selected_state = st.selectbox("Filter by State", state_options)

query = st.text_input(
    "Or Ask EduMatch AI (Example: best engineering colleges in delhi)"
)

top_k = st.slider("Number of Results", 5, 20, 10)

# --------------------------------
# SEARCH BUTTON
# --------------------------------

if st.button("Find Colleges 🎓"):

    # ----------------------------
    # AI SMART SEARCH
    # ----------------------------

    if query.strip() != "":
        query_vector = model.encode([query])
        distances, indices = index.search(query_vector, top_k)
        results = df.iloc[indices[0]]

    # ----------------------------
    # DROPDOWN FILTER SEARCH
    # ----------------------------

    else:
        results = df[df["FIELD"].str.contains(selected_field, case=False, na=False)]

        if selected_state != "ALL":
            results = results[
                results["STATE"].str.contains(selected_state, case=False, na=False)
            ]

        results = results.head(top_k)

    st.success(f"{len(results)} Colleges Found")

# --------------------------------
# DISPLAY RESULTS
# --------------------------------

    for _, row in results.iterrows():

        st.markdown("---")

        st.subheader(row["INSTITUTE NAME"])

        col1, col2 = st.columns(2)

        with col1:
            st.write("📍 Address:", row["INSTI_ADDRESS"])
            st.write("🏫 State:", row["STATE"])

        with col2:
            st.write("🎯 Placement:", row["PLACEMENT"])
            st.write("🏅 Accreditation:", row["ACCREDITED_BY"])

        st.write("🌐 Website:", row["WEBSITE"])