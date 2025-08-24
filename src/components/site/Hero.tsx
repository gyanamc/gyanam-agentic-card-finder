"use client";

import { useState, useRef, useEffect } from "react";
import ask from "../../api/ask";

const TYPING_SPEED = 40;

type Message = {
  type: "user" | "bot";
  text: string;
};

export default function Hero() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Process HTML responses to convert apply URLs to buttons
  const processResponse = (html: string): string => {
    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = html;
    
    // Find all links that might be "apply" links
    const links = container.querySelectorAll('a');
    
    links.forEach(link => {
      // Check if this looks like an application link
      const linkText = link.textContent?.toLowerCase() || '';
      const href = link.getAttribute('href') || '';
      
      if (linkText.includes('apply') || href.includes('apply')) {
        // Replace with a button
        const button = document.createElement('button');
        button.textContent = link.textContent || 'Apply Now';
        button.className = 'apply-btn bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition';
        button.setAttribute('data-url', href);
        
        // Replace the link with the button
        link.parentNode?.replaceChild(button, link);
      }
    });
    
    return container.innerHTML;
  };

  // Handle apply button clicks
  useEffect(() => {
    const handleApplyClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('apply-btn')) {
        const url = target.getAttribute('data-url');
        if (url) {
          window.open(url, '_blank');
        }
      }
    };

    document.addEventListener('click', handleApplyClick);
    return () => {
      document.removeEventListener('click', handleApplyClick);
    };
  }, []);

  const handleAsk = async () => {
    if (!query.trim()) return;

    const userMessage: Message = { type: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const res = await ask(userMessage.text);
      let botFullAnswer: string = res.html || "Sorry, no response.";
      
      // Process the response to convert apply URLs to buttons
      botFullAnswer = processResponse(botFullAnswer);
      
      let progressiveAnswer = "";

      // Create a placeholder bot message
      const tempIndex = messages.length + 1;
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
      <div
        className={`w-full ${
          messages.length > 0 ? "max-w-4xl" : "max-w-xl"
        } mx-auto mt-8 bg-gray-50 rounded-2xl shadow-lg flex flex-col p-6 transition-all duration-200`}
      >
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
                             [&_ul]:list-disc [&_ul]:pl-4 
                             [&_ol]:list-decimal [&_ol]:pl-4 
                             [&_li]:mb-1 
                             [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-2 
                             [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2 
                             [&_h3]:text-base [&_h3]:font-medium [&_h3]:mb-1 
                             [&_strong]:font-semibold 
                             [&_em]:italic 
                             [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-pink-600 
                             [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 
                             [&_th]:bg-gray-100 [&_th]:p-2 [&_th]:text-left [&_th]:font-medium 
                             [&_td]:p-2 [&_td]:border-b [&_td]:border-gray-200 
                             [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:bg-blue-50 [&_blockquote]:p-3 [&_blockquote]:italic
                             [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800"
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              ) : (
                <div>{msg.text}</div>
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
