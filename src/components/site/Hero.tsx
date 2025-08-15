import React, { useState, useEffect, useRef } from "react";

const suggestions = [
  "Find me a card with no annual fees",
  "Which is the best card for international travel?",
  "Show me the top cashback cards",
  "Best credit card for students",
];

const Hero = () => {
  const [currentSuggestion, setCurrentSuggestion] = useState(suggestions[0]);
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cycle placeholder suggestions
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    setCurrentSuggestion(suggestions[index]);
  }, [index]);

  // Stop cycling when typing
  const handleFocus = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleBlur = () => {
    intervalRef.current = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
    }, 3000);
  };

  return (
    <section
      className="relative flex flex-col items-center justify-center text-center px-4 py-16 md:py-24 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #007BFF, #00E5FF, #A855F7)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 12s ease infinite",
      }}
    >
      {/* Particles Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white opacity-25"
            style={{
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 6 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `
                float ${4 + Math.random() * 6}s ease-in-out infinite,
                pulse ${2 + Math.random() * 2}s ease-in-out infinite
              `,
              animationDelay: `${Math.random() * 4}s`,
            }}
          ></span>
        ))}
      </div>

      {/* Radial overlay for focus */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)",
        }}
      ></div>

      {/* Logo */}
      <img
        src="/logo-gradient.svg"
        alt="Agentic AI Logo"
        className="w-16 h-16 mb-6 drop-shadow-lg"
      />

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-white">
        Get the best <span className="text-cyan-300">Credit Card</span>
      </h1>
      <p className="mt-3 text-lg text-white/80 max-w-xl">
        No one will ask your phone number here since this is Agentic AI :)
      </p>

      {/* Search Input */}
      <div className="mt-8 w-full max-w-xl">
        <input
          ref={inputRef}
          type="text"
          placeholder={currentSuggestion}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full rounded-full px-5 py-3 text-lg shadow-lg border border-white/30 focus:border-white focus:outline-none placeholder-gray-300"
        />
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.5); opacity: 0.6; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
