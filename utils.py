def load_knowledge_base(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def answer_question(question, kb_text):
    # Very simple "retrieval" — checks if keywords are in KB
    question_lower = question.lower()
    for line in kb_text.split("\n"):
        if question_lower in line.lower():
            return line
    return "Sorry, I couldn't find an answer in the knowledge base."
