"use client";

import { useState, useEffect } from "react";

export default function Hero() {
  const [input, setInput] = useState("");
  const [placeholder, setPlaceholder] = useState("Best credit card for students");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [htmlResponse, setHtmlResponse] = useState(""); 
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false); // <-- toggle layout

  // Suggestions for placeholder rotation
  const suggestions = [
    "Best credit card for students",
    "Best card for cashback on shopping",
    "Best card for international travel",
    "Best card for airport lounge access",
  ];

  // Cycle suggestions only if input is empty and not yet searched
  useEffect(() => {
    if (input !== "" || hasSearched) return;
    let index = 0;
    const interval = setInterval(() => {
      setPlaceholder(suggestions[index]);
      index = (index + 1) % suggestions.length;
    }, 3000);

    return () => clearInterval(interval);
  }, [input, hasSearched]);

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setStatus("Fetching results...");
    setHtmlResponse("");
    setHasSearched(true);

    try {
      const response = await fetch(
        "https://primary-production-da3f.up.railway.app/webhook/gyanam.store",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: { message: input } }),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      if (data.html) {
        setHtmlResponse(data.html);
        setStatus("Results received");
        setSuggestedQuestions(data.suggestedQuestions || []);
      } else {
        setHtmlResponse("<p>Sorry, no answer found.</p>");
        setStatus("No results found");
      }
    } catch (error) {
      setHtmlResponse("<p>Network error. Please try again.</p>");
      setStatus("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Handle clicking a suggested question
  const handleSuggestedClick = (question: string) => {
    setInput(question);
    handleSearch();
  };

  return (
    <section className="flex flex-col items-center justify-start text-center px-6 py-10">
      {/* Search bar container (position changes based on state) */}
      <div
        className={`w-full max-w-3xl transition-all duration-500 ${
          hasSearched ? "mt-4" : "mt-24"
        }`}
      >
        {/* Heading only before search */}
        {!hasSearched && (
          <>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              Get the best{" "}
              <span className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">
                Credit Card
              </span>
            </h1>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              No one will ask your phone number here since this is Agentic AI :)
            </p>
          </>
        )}

        {/* Search Input */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setInput("")}
            className="flex-grow p-4 rounded-full border border-gray-300 text-black placeholder-gray-500 shadow-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 rounded-full bg-blue-500 text-white font-medium shadow-md hover:bg-blue-600 transition"
          >
            {loading ? "Searching..." : "Find my card"}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="mt-8 w-full max-w-3xl text-left">
          {/* Status */}
          {status && <p className="text-sm text-gray-400 mb-4">{status}</p>}

          {/* Answer */}
          {htmlResponse && (
            <div
              className="bg-white/10 p-6 rounded-lg shadow-lg text-white prose prose-invert"
              dangerouslySetInnerHTML={{ __html: htmlResponse }}
            />
          )}

          {/* Suggested follow-up questions */}
          {suggestedQuestions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                You can also ask:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-blue-300">
                {suggestedQuestions.map((q, idx) => (
                  <li
                    key={idx}
                    className="cursor-pointer hover:underline"
                    onClick={() => handleSuggestedClick(q)}
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
