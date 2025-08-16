"use client";
import { useState } from "react";

export default function Hero() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [suggested, setSuggested] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(q?: string) {
    const question = q || query;
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");
    setSuggested([]);

    try {
      const res = await fetch(
        "https://primary-production-da3f.up.railway.app/webhook/gyanam.store",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: question }),
        }
      );

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();

      setAnswer(data.html || "No answer found.");
      setSuggested(data.suggestedQuestions || []);
    } catch (err: any) {
      console.error(err);
      setError("Network error, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center px-4 py-12">
      {/* Search box */}
      <div
        className={`w-full max-w-2xl transition-all duration-300 ${
          answer ? "mt-4" : "mt-32"
        }`}
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about the best credit card..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-5 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Find my card"}
          </button>
        </div>
      </div>

      {/* Answer section */}
      {error && (
        <p className="mt-6 text-red-600 font-medium">{error}</p>
      )}

      {answer && !error && (
        <div className="mt-8 w-full max-w-2xl text-gray-800">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      )}

      {/* Suggested questions */}
      {suggested.length > 0 && (
        <div className="mt-6 w-full max-w-2xl">
          <p className="font-semibold mb-2">You might also ask:</p>
          <ul className="list-disc list-inside space-y-2">
            {suggested.map((q, i) => (
              <li
                key={i}
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => {
                  setQuery(q);
                  handleSearch(q);
                }}
              >
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
