"use client";

import { useState } from "react";

export default function Hero() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [suggested, setSuggested] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (q?: string) => {
    const question = q || query;
    if (!question.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question }),
      });

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();

      // Expecting: [{ html: "...", suggestedQuestions: [...] }]
      const payload = Array.isArray(data) ? data[0] : data;

      setAnswer(payload.html || "");
      setSuggested(payload.suggestedQuestions || []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col">
      {/* Sticky Search Bar */}
      <header
        className={`w-full bg-white shadow-sm transition-all ${
          answer ? "sticky top-0 z-10" : "mt-32"
        }`}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading}
            className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >
            Ask
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-6">
        {loading && <p className="text-gray-500">Loading...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {answer && (
          <div
            className="prose prose-indigo max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        )}

        {suggested.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Suggested questions:
            </h3>
            <div className="flex flex-wrap gap-2">
              {suggested.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(s);
                    handleAsk(s);
                  }}
                  className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
