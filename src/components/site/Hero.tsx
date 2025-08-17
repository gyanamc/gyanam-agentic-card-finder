// src/components/Hero.tsx
import React, { useState } from "react";
import { ask } from "../api/ask";

const Hero: React.FC = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAnswer(null);
    setError(null);

    try {
      const result = await ask(query);
      setAnswer(result.html);
      setSuggestedQuestions(result.suggestedQuestions || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleAsk(); // automatically search on click
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-10 bg-white shadow-md p-4">
        <form onSubmit={handleAsk} className="flex w-full max-w-3xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything about credit cards..."
            className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-r-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </form>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-3xl mx-auto p-6 w-full">
        {error && (
          <p className="text-red-600 mb-4">
            ⚠️ {error}
          </p>
        )}

        {answer && (
          <div
            className="prose prose-indigo bg-white p-6 rounded-lg shadow-md"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        )}

        {suggestedQuestions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Suggested Questions</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(q)}
                  className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 text-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
