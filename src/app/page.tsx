"use client";

import { useState } from 'react';

// In a real application, this would likely be fetched from a file or API.
// To adhere to the single-file requirement, the knowledge base is hardcoded here.
const loadKnowledgeBase = (): string => {
  return `
Anna University is a public state university located in Tamil Nadu, India. 
The main campus is in Guindy, Chennai and the satellite campus is in Chromepet, Chennai.
It was established on 4 September 1978.
It is ranked among the top universities in India.
The university's main campus houses the College of Engineering, Guindy; Alagappa College of Technology; School of Architecture and Planning; and three technical departments of the University of Madras.
It offers various undergraduate and postgraduate courses in engineering, technology, and applied sciences.
The admission process is highly competitive and is based on entrance examinations.
`;
};

// A simplified simulation of the RAG model's answer generation logic.
const answerQuestion = (question: string, kbText: string): string => {
  const lowerCaseQuestion = question.toLowerCase();
  const sentences = kbText.split('.').filter(s => s.trim() !== '');

  // Very basic keyword matching to find a relevant sentence.
  const questionKeywords = lowerCaseQuestion.replace(/[^a-zA-Z\s]/g, '').split(' ').filter(word => word.length > 3);

  for (const sentence of sentences) {
    const lowerCaseSentence = sentence.toLowerCase();
    if (questionKeywords.some(keyword => lowerCaseSentence.includes(keyword))) {
      return sentence.trim() + '.';
    }
  }

  return "I'm sorry, I couldn't find an answer to that question in my knowledge base.";
};

export default function RagChatbotPage() {
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [warning, setWarning] = useState<string>("");

  const kbText = loadKnowledgeBase();

  const handleGetAnswer = () => {
    setAnswer('');
    setWarning('');

    if (userQuestion.trim()) {
      const generatedAnswer = answerQuestion(userQuestion, kbText);
      setAnswer(generatedAnswer);
    } else {
      setWarning("Please enter a question.");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        handleGetAnswer();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white p-4 sm:p-8 md:p-24">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">
            Anna University RAG Chatbot 🤖
          </h1>
          <p className="text-lg text-gray-400">
            Ask questions about Anna University, and I'll answer from my knowledge base.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your question:"
            className="flex-grow bg-gray-800 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleGetAnswer}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200"
          >
            Get Answer
          </button>
        </div>

        <div className="mt-6 w-full">
          {warning && (
            <div className="bg-yellow-900 border border-yellow-700 text-yellow-200 p-4 rounded-md shadow-lg">
              <p>{warning}</p>
            </div>
          )}
          {answer && (
            <div className="bg-green-900 border border-green-700 text-green-200 p-4 rounded-md shadow-lg">
              <p className="font-semibold mb-2">Answer:</p>
              <p>{answer}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
