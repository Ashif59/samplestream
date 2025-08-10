import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- Placeholder for utils.py logic ---

# In a real application, this would read from a file.
# We'll define the content directly for this example.
KNOWLEDGE_BASE_TEXT = """
Anna University is a public state university located in Tamil Nadu, India. 
The main campus is in Guindy, Chennai. Established on 4 September 1978, 
it is named after C. N. Annadurai, the former Chief Minister of Tamil Nadu.
The university offers various undergraduate and postgraduate courses in engineering, 
technology, and applied sciences. Admission to undergraduate courses is primarily 
based on the Tamil Nadu Engineering Admissions (TNEA) counseling.
"""

def load_knowledge_base():
    """Loads the knowledge base text."""
    return KNOWLEDGE_BASE_TEXT

def answer_question(question: str, knowledge_base: str) -> str:
    """
    A simple placeholder for a RAG model.
    It checks for keywords in the question and returns a relevant snippet.
    """
    question_lower = question.lower()
    
    if "location" in question_lower or "campus" in question_lower or "where" in question_lower:
        return "Anna University's main campus is located in Guindy, Chennai, Tamil Nadu, India."
    elif "admission" in question_lower or "tnea" in question_lower:
        return "Admission to undergraduate courses is primarily based on the Tamil Nadu Engineering Admissions (TNEA) counseling."
    elif "when" in question_lower or "established" in question_lower:
        return "Anna University was established on 4 September 1978."
    elif "who" in question_lower or "named after" in question_lower:
        return "It is named after C. N. Annadurai, the former Chief Minister of Tamil Nadu."
    
    # A very basic fallback search to see if any word from the question is in the KB
    words = question_lower.replace('?', '').split()
    if any(word in knowledge_base.lower() for word in words if len(word) > 3):
         return "I found some information related to your question in my knowledge base, but cannot provide a specific answer. Please try rephrasing."

    return "I'm sorry, I couldn't find an answer to your question in my knowledge base."

# --- FastAPI Application ---

app = FastAPI(
    title="Anna University RAG Chatbot API",
    version="1.0.0"
)

# CORS (Cross-Origin Resource Sharing) Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for simplicity
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# Load knowledge base on startup
kb_text = load_knowledge_base()

class QuestionRequest(BaseModel):
    question: str

@app.post("/ask")
async def ask_question(request: QuestionRequest):
    """
    Receives a question, processes it, and returns an answer.
    """
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    
    answer = answer_question(request.question, kb_text)
    return {"answer": answer}

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Anna University RAG Chatbot API"}
