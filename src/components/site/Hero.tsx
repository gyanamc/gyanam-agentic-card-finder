// src/components/site/Hero.tsx
import React, { useState, useEffect } from "react";
import ask from "../../api/ask";

const rotatingSuggestions = [
  "Which credit card has the lowest forex markup?",
  "Which card offers maximum airport lounge access?",
  "What is the best card for frequent hotel stays?",
  "Which card gives the highest cashback on international spending?",
];

const Hero: React.FC = () => {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState(rotatingSuggestions[0]);
  const [answer, setAnswer] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Rotate placeholder suggestions
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % rotatingSuggestions.length;
      setPlaceholder(rotatingSuggestions[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAsk = async (customQuery?: string) => {
    const q = customQuery || query || placeholder; // fallback to rotating suggestion
    if (!q) return;

    setLoading(true);
    setAnswer("");
    setSuggestedQuestions([]);

    const response = await ask(q);

    setAnswer(response.html);
    setSuggestedQuestions(response.suggestedQuestions);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAsk();
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 bg-white w-full max-w-2xl mx-auto z-10 shadow-md rounded-lg p-4">
        <h1 className="text-3xl font-bold mb-4">Find Your Best Credit Card</h1>

        <div className="flex">
          <input
            type="text"
            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={() => handleAsk()}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
          >
            Ask
          </button>
        </div>
      </div>

      {/* Response Section */}
      <div className="flex flex-col items-center justify-center flex-grow w-full mt-8">
        {loading && <p className="text-gray-500">Thinking...</p>}

        {answer && (
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl text-left">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          </div>
        )}

        {/* Suggested Questions */}
        {suggestedQuestions.length > 0 && (
          <div className="mt-6 w-full max-w-2xl text-left">
            <h3 className="font-semibold mb-2">Suggested Questions:</h3>
            <ul className="list-disc pl-5 space-y-2">
              {suggestedQuestions.map((q, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleAsk(q)}
                    className="text-blue-600 hover:underline"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
