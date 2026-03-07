import streamlit as st
import pandas as pd
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import requests

st.title("AI Hybrid Career Chatbot")

# Load dataset
df = pd.read_excel("faq.xlsx")
df.columns = ["question", "answer"]

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

questions = df["question"].tolist()

embeddings = model.encode(questions)

# Create FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings))


# Llama fallback function
def llama_answer(question):

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3",
            "prompt": question,
            "stream": False
        }
    )

    return response.json()["response"]


# Hybrid chatbot logic
def hybrid_chatbot(user_query):

    query_vector = model.encode([user_query])

    distances, indices = index.search(query_vector, k=1)

    similarity_score = distances[0][0]

    faq_answer = df.iloc[indices[0][0]]["answer"]

    threshold = 0.5

    if similarity_score < threshold:
        return faq_answer
    else:
        return llama_answer(user_query)


# Streamlit chat UI
user_input = st.text_input("Ask a question")

if user_input:

    response = hybrid_chatbot(user_input)

    st.write("Bot:", response)