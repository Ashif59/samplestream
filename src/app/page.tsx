'use client';

import { useState } from 'react';

// Placeholder for knowledge base content. In a real app, this would be loaded from a file or database.
const KNOWLEDGE_BASE_TEXT = `
Anna University is a public state university located in Tamil Nadu, India. The main campus is in Guindy, Chennai.
It was established on 4 September 1978. It is ranked 42nd among universities in India by the National Institutional Ranking Framework (NIRF) in 2023.
The university's main campus extends over 189 acres and houses the College of Engineering, Guindy; Alagappa College of Technology; School of Architecture and Planning; and three technical departments of the University of Madras.
Admission to undergraduate programs is based on Tamil Nadu Engineering Admissions (TNEA) counseling, which is based on marks obtained in the higher secondary examination.
For postgraduate programs, admission is through the Tamil Nadu Common Entrance Test (TANCET).
The university offers various courses in engineering, technology, and applied sciences.
Notable alumni from Anna University include A. P. J. Abdul Kalam, former President of India, and Sundar Pichai, CEO of Google.
`;

/**
 * Simulates a simple RAG (Retrieval-Augmented Generation) process.
 * This is a simplified version of the 'answer_question' function.
 * @param question The user's question.
 * @param context The knowledge base text.
 * @returns A string answer based on the context.
 */
const answerQuestion = (question: string, context: string): string => {
  const lowerCaseQuestion = question.toLowerCase();
  const questionKeywords = lowerCaseQuestion.replace(/[^a-z0-9\s]/g, '').split(' ').filter(word => word.length > 2);
  
  const sentences = context.split(/\.\s*/).filter(sentence => sentence.trim() !== '');
  
  const relevantSentences = sentences.filter(sentence => {
    const lowerCaseSentence = sentence.toLowerCase();
    return questionKeywords.some(keyword => lowerCaseSentence.includes(keyword));
  });

  if (relevantSentences.length > 0) {
    return relevantSentences.join('. ') + '.';
  }

  return "I couldn't find an answer to your question in my knowledge base. Please try rephrasing.";
};

export default function RagChatbotPage() {
  const [userQuestion, setUserQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [warning, setWarning] = useState('');

  const handleGetAnswer = () => {
    if (userQuestion.trim()) {
      setWarning('');
      const generatedAnswer = answerQuestion(userQuestion, KNOWLEDGE_BASE_TEXT);
      setAnswer(generatedAnswer);
    } else {
      setAnswer('');
      setWarning('Please enter a question.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-2">
          Anna University RAG Chatbot 🤖
        </h1>
        <p className="text-md sm:text-lg text-gray-600 text-center mb-8">
          Ask questions about Anna University, and I'll answer from my knowledge base.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGetAnswer()}
            placeholder="Enter your question:"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
          <button
            onClick={handleGetAnswer}
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            Get Answer
          </button>
        </div>

        {warning && (
          <div className="w-full p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg">
            <p>{warning}</p>
          </div>
        )}

        {answer && (
          <div className="w-full mt-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-800 rounded-r-lg">
            <p className="font-semibold mb-2">Answer:</p>
            <p className="whitespace-pre-wrap">{answer}</p>
          </div>
        )}
      </div>
    </main>
  );
}
