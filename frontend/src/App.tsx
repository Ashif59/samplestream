import React, { useState, FormEvent, CSSProperties, useEffect } from 'react';
import axios from 'axios';

const styles: { [key: string]: CSSProperties } = {
  container: {
    maxWidth: '700px',
    margin: '2rem auto',
    padding: '2rem',
    fontFamily: 'sans-serif',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '2.5rem',
    color: '#333',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginTop: '1.5rem',
  },
  input: {
    flexGrow: 1,
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: 'white',
    backgroundColor: '#ff4b4b',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
    cursor: 'not-allowed',
  },
  resultContainer: {
    marginTop: '2rem',
    padding: '1rem',
    borderRadius: '4px',
    textAlign: 'left',
    lineHeight: '1.6',
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
  },
  warning: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    border: '1px solid #ffeeba',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
  },
};

function App() {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    document.title = 'Anna University RAG Chatbot';
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setAnswer('');
      setMessage('Please enter a question.');
      return;
    }

    setIsLoading(true);
    setAnswer('');
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/ask`, {
        question: question,
      });
      setAnswer(response.data.answer);
    } catch (error) {
      setMessage('Error: Could not connect to the backend. Please ensure it is running.');
      console.error('API call failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Anna University RAG Chatbot 🤖</h1>
      <p>Ask questions about Anna University, and I'll answer from my knowledge base.</p>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question:"
          style={styles.input}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          style={isLoading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
          disabled={isLoading}
        >
          {isLoading ? 'Thinking...' : 'Get Answer'}
        </button>
      </form>

      {message && (
        <div style={{ ...styles.resultContainer, ...(message.startsWith('Error') ? styles.error : styles.warning) }}>
          <p>{message}</p>
        </div>
      )}
      
      {answer && (
        <div style={{ ...styles.resultContainer, ...styles.success }}>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default App;
