"use client";

import { useState, useRef, useEffect } from "react";
import ask from "../../api/ask";

const TYPING_SPEED = 40;

export default function Hero() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ type: "user" | "bot"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

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

        // Update last bot message only
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
    <div className="flex flex-col items-center w-full min-h-screen pb-28">
      {/* Chat Window */}
      <div className="w-full max-w-2xl flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg shadow-sm ${
                msg.type === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 w-full border-t bg-white p-4">
        <div className="max-w-2xl mx-auto flex gap-2">
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "..." : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );
}
