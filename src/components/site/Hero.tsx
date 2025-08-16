"use client";

import { useState } from "react";

export default function Hero() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");
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

      if (!response.ok) throw new Error("Network error");

      const data = await response.json();

      setAnswer(data.html || "No answer found.");
      setSuggestedQuestions(data.suggestedQuestions || []);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-white to-gray-50 px-6">
      {/* Search Bar Section */}
      <div className="w-full max-w-3xl mt-16 text-center">
        {!answer && (
          <>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Get the best{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 drop-shadow-md">
                Credit Card
              </span>
            </h1>
            <p className="text-gray-500 mb-8">
              No one will ask your phone number here since this is Agentic AI :)
            </p>
          </>
        )}

        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-full shadow-lg p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Ask me about the best credit card..."
            className="flex-1 px-4 py-2 rounded-full focus:outline-none text-gray-700"
          />
          <button
            onClick={handleSearch}
            className="ml-2 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Searching..." : "Find my card"}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full max-w-3xl mt-10 text-left">
        {error && <p className="text-red-500">{error}</p>}

        {answer && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        )}

        {suggestedQuestions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">You can also ask:</h3>
            <ul className="list-disc list-inside space-y-1">
              {suggestedQuestions.map((q, i) => (
                <li
                  key={i}
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={() => setInput(q)}
                >
                  {q}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
