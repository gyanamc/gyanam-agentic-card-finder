"use client";

import React, { useState } from "react";

export default function Hero() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [html, setHtml] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [resultsShown, setResultsShown] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setHtml("");
    setSuggestedQuestions([]);

    try {
      const response = await fetch(
        "https://primary-production-da3f.up.railway.app/webhook/gyanam.store",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: { message: input } }),
        }
      );

      let data: any;
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // fallback in case n8n responds with text/html
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch (err) {
          throw new Error("Invalid response format from server");
        }
      }

      setHtml(data.html || "");
      setSuggestedQuestions(
        Array.isArray(data.suggestedQuestions)
          ? data.suggestedQuestions
          : (data.suggestedQuestions || "").split(",")
      );
      setResultsShown(true);
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-6">
      <div className={`w-full max-w-3xl transition-all ${resultsShown ? "mt-6" : "mt-24"}`}>
        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center shadow-lg rounded-full overflow-hidden border border-gray-200"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Find the best credit card for you..."
            className="flex-1 px-6 py-4 text-lg outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 font-semibold transition"
          >
            {loading ? "Searching..." : "Find my card"}
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

        {/* Results Section */}
        {resultsShown && !error && (
          <div className="mt-10 bg-white shadow-md rounded-xl p-6">
            {/* AI Answer */}
            {html && (
              <div
                className="prose max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}

            {/* Suggested Questions */}
            {suggestedQuestions.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  You might also ask:
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {suggestedQuestions.map((q, i) => (
                    <li
                      key={i}
                      className="cursor-pointer hover:text-blue-600"
                      onClick={() => setInput(q)}
                    >
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
