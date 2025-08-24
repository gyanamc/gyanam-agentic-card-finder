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
    <div className="flex flex-col h-[calc(100vh-80px)] px-4 py-6 bg-gray-50">
      {/* Chat Window */}
      <div className="flex-grow overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-md p-3 rounded-lg ${
              msg.type === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-white text-gray-800 mr-auto shadow-sm"
            }`}
            dangerouslySetInnerHTML={{ __html: msg.text }}
          />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar Fixed at Bottom */}
      <div className="flex items-end gap-2 bg-white p-4 rounded-lg shadow-sm">
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
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-2 rounded-md font-medium transition"
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>
    </div>
  );
}
