import React, { useEffect, useState } from "react";

export default function Hero() {
  const [isWhite, setIsWhite] = useState(true);

  // Function to calculate brightness from RGB
  const getBrightness = (r: number, g: number, b: number) =>
    (r * 299 + g * 587 + b * 114) / 1000;

  // Convert hex color to RGB
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace("#", "");
    const bigint = parseInt(cleanHex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  useEffect(() => {
    // Your gradient colors
    const color1 = hexToRgb("#2563eb"); // blue-600
    const color2 = hexToRgb("#06b6d4"); // cyan-500

    // Average the brightness of both colors
    const avgBrightness =
      (getBrightness(color1.r, color1.g, color1.b) +
        getBrightness(color2.r, color2.g, color2.b)) /
      2;

    setIsWhite(avgBrightness > 128);
  }, []);

  return (
    <section className="relative text-center py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 animate-gradient"></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <span
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img
            src="/logo-gradient.svg"
            alt="Agentic AI Logo"
            className="w-16 h-16 drop-shadow-lg"
          />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Get the best{" "}
          <span className="text-cyan-300 brightness-125">Credit Card</span>
        </h1>
        <p className="mt-3 text-lg text-white/80">
          No one will ask your phone number here since this is Agentic AI :)
        </p>

        {/* Search Input */}
        <div className="mt-8 w-full max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search Gyanam..."
            className={`w-full rounded-full px-5 py-3 text-lg shadow-lg border transition-colors duration-300
              ${
                isWhite
                  ? "bg-white text-black placeholder-gray-500 border-gray-300"
                  : "bg-black text-white placeholder-gray-300 border-gray-600"
              }
            `}
          />
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-float {
          animation-name: float;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>
    </section>
  );
}
