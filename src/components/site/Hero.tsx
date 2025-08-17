import React, { useState, useEffect } from "react";
import ask from "../../lib/ask";

const Hero: React.FC = () => {
  const rotatingSuggestions = [
    "Which credit card has the lowest forex markup?",
    "Which card offers maximum airport lounge access?",
    "What is the best card for frequent hotel stays?",
    "Which card gives the highest cashback on international spending?",
  ];

  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState(rotatingSuggestions[0]);
  const [response, setResponse] = useState("");
  const [suggested, setSuggested] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);

  // Cycle placeholder every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingSuggestions.length);
      setPlaceholder(rotatingSuggestions[(index + 1) % rotatingSuggestions.length]);
    }, 3000);
    return () => clearInterval(interval);
  }, [index]);

  // Handle query submission
  const handleAsk = async (q?: string) => {
    const finalQuery = q || query || placeholder;
    if (!finalQuery.trim()) return;

    setLoading(true);
    setResponse("");
    setSuggested([]);

    try {
      const data = await ask(finalQuery);

      if (data && Array.isArray(data) && data[0]) {
        setResponse(data[0].html || "No answer found.");
        setSuggested(data[0].suggestedQuestions || []);
      } else {
        setResponse("No answer found.");
      }
    } catch (err) {
      console.error("Ask error:", err);
      setResponse("Error fetching response. Please try again.");
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 bg-white shadow-md px-4 py-3 z-10">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            placeholder={placeholder}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Asking..." : "Ask"}
          </button>
        </div>
        {/* Clickable placeholder */}
        <div className="text-center text-sm mt-2 text-gray-500">
          <button
            onClick={() => handleAsk(placeholder)}
            className="italic underline hover:text-blue-600"
          >
            {placeholder}
          </button>
        </div>
      </div>

      {/* Centered Content (Response + Suggested Questions) */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-10">
        <div className="w-full max-w-3xl text-center">
          {/* Response Box */}
          {response && (
            <div className="w-full bg-white border rounded-lg p-6 shadow-sm whitespace-pre-wrap break-words mb-6">
              <div
                dangerouslySetInnerHTML={{ __html: response }}
                className="prose max-w-none text-left"
              />
            </div>
          )}

          {/* Suggested Questions */}
          {suggested.length > 0 && (
            <div className="w-full text-left">
              <h3 className="font-semibold mb-3">Suggested Questions</h3>
              <ul className="list-disc list-inside space-y-2">
                {suggested.map((s, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleAsk(s)}
                      className="text-blue-600 hover:underline text-left"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
