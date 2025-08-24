export default function Hero() {
  // ... (same logic as before)

  return (
    <div className="w-full px-2 sm:px-6 md:px-12 flex justify-center">
      <div
        className={`
          transition-all duration-200
          w-full
          ${messages.length > 0 ? "max-w-5xl" : "max-w-2xl"}
          mx-auto mt-8 bg-gray-50 rounded-lg shadow
          flex flex-col
          p-4
        `}
      >
        {/* Chat Window */}
        <div className="min-h-[200px] max-h-[60vh] overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`w-fit max-w-2xl p-3 rounded-lg ${
                msg.type === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-white text-gray-800 mr-auto shadow-sm"
              }`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
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
    </div>
  );
}
