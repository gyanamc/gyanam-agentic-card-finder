import React, { useState } from "react";
import { askGyanam } from "../../api/ask";

const Hero: React.FC = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [suggested, setSuggested] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (q?: string) => {
    const finalQ = q || query;
    if (!finalQ.trim()) return;

    setLoading(true);
    setResponse(""); // reset output
    setQuery(finalQ);

    try {
      await askGyanam(finalQ, (chunk) => {
        setResponse((prev) => prev + chunk); // typing effect
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

  return (
    <section className="relative bg-gray-50 min-h-screen flex flex-col items-center pt-24 px-4">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-gray-50 w-full py-4 shadow-sm flex justify-center">
        <div className="flex w-full max-w-2xl gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about credit cards..."
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

      {/* Chatbot Response */}
      <div className="w-full max-w-3xl mt-8">
        <div className="bg-white border rounded-lg p-6 shadow-sm min-h-[150px] whitespace-pre-wrap break-words">
          {response ? (
            <div
              dangerouslySetInnerHTML={{ __html: response }}
              className="prose max-w-none"
            />
          ) : (
            <p className="text-gray-400 italic">
              Ask me anything about the best credit cards ✨
            </p>
          )}
        </div>
      </div>

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
