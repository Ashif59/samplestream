import streamlit as st
from utils import load_knowledge_base, answer_question

st.set_page_config(page_title="Anna University RAG Chatbot", page_icon="🤖")

st.title("Anna University RAG Chatbot 🤖")
st.write("Ask questions about Anna University, and I'll answer from my knowledge base.")

# Load knowledge base
kb_text = load_knowledge_base("knowledge_base.txt")

# Input box
user_question = st.text_input("Enter your question:")

if st.button("Get Answer"):
    if user_question.strip():
        answer = answer_question(user_question, kb_text)
        st.success(answer)
    else:
        st.warning("Please enter a question.")
