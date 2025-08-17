import React, { useState, useEffect } from "react";
import { askGyanam } from "../../api/ask";

const Hero: React.FC = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [suggested, setSuggested] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔄 Rotating placeholder
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const rotatingSuggestions = [
    "Which credit card has the lowest forex markup?",
    "Which card offers maximum airport lounge access?",
    "What is the best card for frequent hotel stays?",
    "Which card gives the highest cashback on international spending?",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % rotatingSuggestions.length);
    }, 3000); // change every 3s
    return () => clearInterval(interval);
  }, []);

  const handleAsk = async (q?: string) => {
    const finalQ = q || query || rotatingSuggestions[placeholderIndex]; // 👈 fallback to rotating suggestion
    if (!finalQ.trim()) return;

    setLoading(true);
    setResponse("");
    setQuery(finalQ);

    try {
      await askGyanam(finalQ, (chunk) => {
        setResponse((prev) => prev + chunk);
      }).then((res) => {
        if (res.suggestedQuestions) {
          setSuggested(res.suggestedQuestions);
        }
      });
    } catch (error) {
      setResponse("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <section className="relative bg-gray-50 min-h-screen flex flex-col items-center pt-24 px-4">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-10 bg-gray-50 w-full py-4 shadow-sm flex justify-center">
        <div className="flex w-full max-w-2xl gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={rotatingSuggestions[placeholderIndex]} // 👈 rotating hint
            className="flex-1 border rounded-lg px-4 py-2 text-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>
      </div>

      {/* Answer Area */}
      {response && (
        <div className="w-full max-w-3xl mt-8 bg-white border rounded-lg p-6 shadow-sm whitespace-pre-wrap break-words">
          <div
            dangerouslySetInnerHTML={{ __html: response }}
            className="prose max-w-none"
          />
        </div>
      )}

      {/* Suggested Questions */}
      {suggested.length > 0 && (
        <div className="w-full max-w-3xl mt-6">
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
    </section>
  );
};

export default Hero;
