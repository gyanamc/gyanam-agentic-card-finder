// src/components/site/Hero.tsx

import React, { useState } from "react";
import { askGyanam } from "../../api/ask";

const Hero: React.FC = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggested, setSuggested] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setAnswer("");
    setSuggested([]);

    try {
      await askGyanam(query, (chunk) => {
        setAnswer((prev) => prev + chunk);
      });

      // Mock — suggestions could be parsed dynamically later
      setSuggested([
        "Which credit card has the lowest forex markup?",
        "Which card offers maximum airport lounge access?",
        "What is the best card for frequent hotel stays?",
        "Which card gives the highest cashback on international spending?",
      ]);
    } catch (err) {
      console.error(err);
      setAnswer("⚠️ Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="max-w-3xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              className="flex-grow border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Ask Gyanam about credit cards..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? "Thinking..." : "Ask"}
            </button>
          </form>
        </div>
      </div>

      {/* Answer Section */}
      <div className="max-w-3xl mx-auto p-6 flex-1 w-full">
        {answer && (
          <div
            className="prose max-w-none bg-white p-6 rounded-lg shadow"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        )}

        {/* Suggested Questions */}
        {suggested.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Suggested Questions</h3>
            <ul className="list-disc list-inside space-y-1">
              {suggested.map((q, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => setQuery(q)}
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
    </div>
  );
};

export default Hero;
