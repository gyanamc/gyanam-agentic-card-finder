// src/components/site/Hero.tsx
import React, { useState, useEffect, useRef } from "react";
import ask from "../../api/ask";

const rotatingSuggestions = [
  "Which credit card has the lowest forex markup?",
  "Which card offers maximum airport lounge access?",
  "What is the best card for frequent hotel stays?",
  "Which card gives the highest cashback on international spending?",
];

// Fixed typing speed (ms per word)
const TYPING_SPEED = 50;

const Hero: React.FC = () => {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState(rotatingSuggestions[0]);
  const [answer, setAnswer] = useState(""); // final full HTML
  const [displayedAnswer, setDisplayedAnswer] = useState(""); // progressive HTML typing
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Refs
  const answerRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);

  // Rotate placeholder suggestions
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

      // ---- Typing effect with HTML preserved ----
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = response.html;
      const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null);
      const textNodes: Text[] = [];
      while (walker.nextNode()) {
        textNodes.push(walker.currentNode as Text);
      }

      let nodeIndex = 0;
      let wordIndex = 0;

      const liveDiv = document.createElement("div");
      liveDiv.innerHTML = response.html;
      textNodes.forEach((node) => {
        if (node.nodeValue) node.nodeValue = ""; // clear all text first
      });

      const interval = setInterval(() => {
        if (nodeIndex < textNodes.length) {
          const originalWords = (walker.root.childNodes[nodeIndex]?.textContent || "").split(" ");
          if (wordIndex < originalWords.length) {
            textNodes[nodeIndex].nodeValue += (wordIndex > 0 ? " " : "") + originalWords[wordIndex];
            wordIndex++;
          } else {
            nodeIndex++;
            wordIndex = 0;
          }
          setDisplayedAnswer(liveDiv.innerHTML);
        } else {
          clearInterval(interval);
          setDisplayedAnswer(response.html); // final clean HTML
        }
      }, TYPING_SPEED);

      // Smooth scroll to answer
      setTimeout(() => {
        if (answerRef.current) {
          answerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 200);
    } catch (err) {
      setAnswer("<p>Sorry, something went wrong.</p>");
      setDisplayedAnswer("Sorry, something went wrong.");
      setSuggestedQuestions([]);
    }

    setLoading(false);
  };

  const resetAsk = () => {
    setAnswer("");
    setDisplayedAnswer("");
    setQuery("");
    setSuggestedQuestions([]);

    // Scroll back to top
    setTimeout(() => {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div
      ref={topRef}
      className="hero flex flex-col items-center justify-center p-6 transition-all duration-500 ease-in-out"
    >
      {!answer ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="w-full max-w-xl flex flex-col gap-3 animate-fadeIn"
          key="input-section"
        >
          {/* Search Input (ChatGPT style) */}
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
            className="border rounded-md px-4 py-2 w-full resize-none focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </form>
      ) : (
        <div
          ref={answerRef}
          className="w-full max-w-2xl flex flex-col gap-6 animate-fadeIn"
          key="answer-section"
        >
          {/* Animated answer (HTML preserved) */}
          <div
            className="answer prose max-w-none p-4 border rounded-md bg-gray-50 shadow-sm animate-slideUp whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: displayedAnswer }}
          />

          {/* Clickable suggested questions styled as chips */}
          {suggestedQuestions.length > 0 && (
            <div className="flex flex-wrap gap-2 animate-fadeIn delay-200">
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

          {/* Back to Ask button */}
          <div>
            <button
              onClick={resetAsk}
              className="mt-4 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
            >
              ← Back to Ask
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;