import React, { useState } from "react";
import { askGyanam } from "../api/ask";

const Hero: React.FC = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setAnswer("");
    setLoading(true);

    try {
      await askGyanam(query, (chunk: string) => {
        // Append word by word
        setAnswer((prev) => prev + chunk);
      });
    } catch (err) {
      console.error(err);
      setAnswer("⚠️ Error fetching answer.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky search bar */}
      <div className="sticky top-0 bg-white shadow-md p-4 z-10">
        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-grow border px-3 py-2 rounded-lg"
            placeholder="Ask me anything about credit cards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handleAsk}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>
      </div>

      {/* Answer display */}
      <div className="p-6 max-w-3xl mx-auto">
        {answer ? (
          <div
            className="prose prose-blue max-w-none"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        ) : (
          <p className="text-gray-400">Your answer will appear here...</p>
        )}
      </div>
    </div>
  );
};

export default Hero;
