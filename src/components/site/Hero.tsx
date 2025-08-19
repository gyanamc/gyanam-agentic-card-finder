"use client";

import { useState } from "react";

export default function Hero() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      setResponse({
        html: "<p>Sorry, something went wrong.</p>",
        suggestedQuestions: [],
      });
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  const handleSuggestedClick = (q: string) => {
    setQuery(q);
    handleAsk();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full pb-32">
      <div className="max-w-2xl w-full p-6">
        {/* Response Section */}
        {response && (
          <div className="mt-6 space-y-4">
            <div
              className="p-4 border rounded bg-gray-50"
              dangerouslySetInnerHTML={{ __html: response.html }}
            />
            <div className="flex flex-wrap gap-2">
              {response.suggestedQuestions?.map((q: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedClick(q)}
                  className="px-3 py-1 text-sm border rounded-full bg-white hover:bg-gray-100"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Bar at Bottom (like ChatGPT) */}
      <div className="fixed bottom-0 left-0 w-full border-t bg-white p-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            className="flex-grow border rounded px-3 py-2"
            placeholder="Ask a question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "..." : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );
}
