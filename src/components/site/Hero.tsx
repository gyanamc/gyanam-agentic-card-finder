"use client";

import { useState, useRef, useEffect } from "react";
import ask from "../../api/ask";

const TYPING_SPEED = 40;

export default function Hero() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ type: "user" | "bot"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleAsk = async () => {
    if (!query.trim()) return;

    const userMessage = { type: "user" as const, text: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const res = await ask(userMessage.text);
      const botFullAnswer = res.html || "Sorry, no response.";
      let progressiveAnswer = "";

      // Create a temporary bot message first
      const tempIndex = messages.length + 1; // future index
      setMessages((prev) => [...prev, { type: "bot", text: "" }]);

      const words = botFullAnswer.split(" ");
      for (let i = 0; i < words.length; i++) {
        progressiveAnswer += (i > 0 ? " " : "") + words[i];
        await new Promise((r) => setTimeout(r, TYPING_SPEED));
        setMessages((prev) =>
          prev.map((m, idx) =>
            idx === tempIndex ? { ...m, text: progressiveAnswer } : m
          )
        );
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "⚠️ Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-16 flex justify-center">
      <div className={`w-full ${messages.length > 0 ? "max-w-4xl" : "max-w-xl"} mx-auto mt-8 bg-gray-50 rounded-2xl shadow-lg flex flex-col p-6 transition-all duration-200`}>
        {/* Chat Window */}
        <div className="min-h-[220px] max-h-[65vh] overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`w-fit max-w-2xl p-4 rounded-xl ${
                msg.type === "user"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-white text-gray-900 mr-auto shadow prose prose-sm max-w-none"
              }`}
            >
              {msg.type === "bot" ? (
  <div
    className="prose prose-sm max-w-none text-gray-800 leading-relaxed
               [&>ul]:list-disc [&>ul]:pl-4 
               [&>ol]:list-decimal [&>ol]:pl-4 
               [&>li]:mb-1 
               [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mb-2 
               [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:mb-2 
               [&>h3]:text-base [&>h3]:font-medium [&>h3]:mb-1 
               [&>strong]:font-semibold 
               [&>em]:italic 
               [&>code]:bg-gray-100 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>code]:text-pink-600 
               [&>table]:w-full [&>table]:border-collapse [&>table]:my-4 
               [&>th]:bg-gray-100 [&>th]:p-2 [&>th]:text-left [&>th]:font-medium 
               [&>td]:p-2 [&>td]:border-b [&>td]:border-gray-200 
               [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:bg-blue-50 [&>blockquote]:p-3 [&>blockquote]:italic
               [&>a]:text-blue-600 [&>a]:underline hover:[&>a]:text-blue-800"
    dangerouslySetInnerHTML={{ __html: msg.text }}
  />
) : (
  <div dangerouslySetInnerHTML={{ __html: msg.text }} />
)}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {/* Input Bar */}
        <div className="flex items-end gap-2 bg-white p-4 rounded-xl shadow">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            rows={2}
            placeholder="Ask me anything about credit cards..."
            className="flex-grow border rounded-md px-4 py-2 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-md font-medium transition"
          >
            {loading ? "..." : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );
}
