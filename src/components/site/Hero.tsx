// src/components/site/Hero.tsx
import React, { useState, useEffect, useRef } from "react";
import ask from "../../api/ask";

const rotatingSuggestions = [
  "Which credit card has the lowest forex markup?",
  "Which card offers maximum airport lounge access?",
  "What is the best card for frequent hotel stays?",
  "Which card gives the highest cashback on international spending?",
];

const TYPING_SPEED = 50; // ms per word

const Hero: React.FC = () => {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState(rotatingSuggestions[0]);
  const [answer, setAnswer] = useState(""); // full HTML
  const [displayedAnswer, setDisplayedAnswer] = useState(""); // progressive typing
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const answerRef = useRef<HTMLDivElement | null>(null);

  // rotate placeholder
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % rotatingSuggestions.length;
      setPlaceholder(rotatingSuggestions[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAsk = async (customQuery?: string) => {
    const q = customQuery || query || placeholder;
    if (!q) return;

    setLoading(true);
    setAnswer("");
    setDisplayedAnswer("");
    setSuggestedQuestions([]);

    try {
      const response = await ask(q);
      setAnswer(response.html);
      setSuggestedQuestions(response.suggestedQuestions);

      // ---- typing effect ----
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = response.html;
      const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

      let nodeIndex = 0, wordIndex = 0;

      const liveDiv = document.createElement("div");
      liveDiv.innerHTML = response.html;
      textNodes.forEach((n) => (n.nodeValue = "")); // clear all text

      const interval = setInterval(() => {
        if (nodeIndex < textNodes.length) {
          const words = (response.html.split(/\s+/));
          if (wordIndex < words.length) {
            textNodes[nodeIndex].nodeValue +=
              (wordIndex > 0 ? " " : "") + words[wordIndex];
            wordIndex++;
          } else {
            nodeIndex++;
            wordIndex = 0;
          }
          setDisplayedAnswer(liveDiv.innerHTML);
        } else {
          clearInterval(interval);
          setDisplayedAnswer(response.html);
        }
      }, TYPING_SPEED);

      setTimeout(() => {
        answerRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch {
      setAnswer("<p>Sorry, something went wrong.</p>");
      setDisplayedAnswer("Sorry, something went wrong.");
    }
    setLoading(false);
    setQuery("");
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen pb-32 px-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Answer Section */}
        {answer && (
          <div ref={answerRef} className="space-y-6">
            <div
              className="prose max-w-none p-4 border rounded bg-gray-50 shadow-sm"
              dangerouslySetInnerHTML={{ __html: displayedAnswer }}
            />
            {suggestedQuestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleAsk(q)}
                    className="px-4 py-2 text-sm rounded-full border border-gray-300 bg-white shadow-sm hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Persistent Input Bar */}
      <div className="fixed bottom-0 left-0 w-full border-t bg-white p-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <textarea
            value={query}
            placeholder={placeholder}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            rows={2}
            className="flex-grow border rounded-md px-4 py-2 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "..." : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
