import * as React from "react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import DOMPurify from "dompurify";
import Logo from "@/assets/logo-gradient.svg"; // Your new gradient logo

const suggestions = [
  "Tell me the best card for international travel",
  "Which credit card is best for cashback?",
  "Show me cards with zero annual fee",
  "Best card for students in India",
  "Which card gives the best airport lounge access?"
];

const Hero = () => {
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [currentSuggestion, setCurrentSuggestion] = React.useState(suggestions[0]);
  const [fade, setFade] = React.useState(true);
  const suggestionIndex = React.useRef(0);
  const suggestionTimer = React.useRef<NodeJS.Timeout | null>(null);

  // For brightness detection
  const [isBackgroundLight, setIsBackgroundLight] = React.useState(false);
  const [glowColor, setGlowColor] = React.useState("rgba(0,255,255,0.6)");

  const toHtml = React.useMemo(() => {
    if (!result) return "";
    const looksLikeHtml = /<\/?(?:p|div|ul|ol|li|br|h[1-6]|strong|em|a)\b/i.test(result);
    let html = result;
    if (!looksLikeHtml) {
      const withLinks = result
        .replace(/(https?:\/\/[^\s)]+)|(www\.[^\s)]+)/gi, (url) => {
          const href = url.startsWith("http") ? url : `https://${url}`;
          return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="underline">${url}</a>`;
        })
        .split(/\n{2,}/)
        .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
        .join("");
      html = withLinks;
    }
    return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  }, [result]);

  // Handle gradient brightness & glow sync
  React.useEffect(() => {
    const colors = [
      { r: 0, g: 102, b: 255 }, // blue
      { r: 0, g: 255, b: 255 }  // cyan
    ];
    let t = 0;
    const animate = () => {
      t = (t + 0.005) % 1; // speed
      const r = Math.round(colors[0].r * (1 - t) + colors[1].r * t);
      const g = Math.round(colors[0].g * (1 - t) + colors[1].g * t);
      const b = Math.round(colors[0].b * (1 - t) + colors[1].b * t);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      setIsBackgroundLight(brightness > 160);
      setGlowColor(`rgba(${r},${g},${b},0.6)`);
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  // Rotating placeholder
  React.useEffect(() => {
    if (!query) {
      suggestionTimer.current = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          suggestionIndex.current = (suggestionIndex.current + 1) % suggestions.length;
          setCurrentSuggestion(suggestions[suggestionIndex.current]);
          setFade(true);
        }, 300);
      }, 3000);
    }
    return () => {
      if (suggestionTimer.current) clearInterval(suggestionTimer.current);
    };
  }, [query]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = query.trim() || currentSuggestion;
    if (!q) return;
    setError(null);
    setResult(null);
    try {
      setLoading(true);
      const res = await fetch(
        "https://primary-production-da3f.up.railway.app/webhook/credit-card-recommendation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        }
      );
      const contentType = res.headers.get("content-type") || "";
      if (res.ok) {
        let dataText = "";
        if (contentType.includes("application/json")) {
          const data = await res.json();
          if (typeof data === "string") {
            dataText = data;
          } else if (Array.isArray(data)) {
            dataText = JSON.stringify(data, null, 2);
          } else if ((data as any)?.message) {
            dataText = String((data as any).message);
          } else if ((data as any)?.answer) {
            dataText = String((data as any).answer);
          } else if ((data as any)?.result) {
            const r = (data as any).result;
            dataText = typeof r === "string" ? r : JSON.stringify(r, null, 2);
          } else {
            dataText = JSON.stringify(data, null, 2);
          }
        } else {
          dataText = await res.text();
        }
        setResult(dataText || "No results.");
        toast.success("Results received");
      } else {
        const text = await res.text();
        setError(`Webhook error ${res.status}${text ? `: ${text}` : ""}`);
        toast.error(`Webhook error: ${res.status}`);
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 animate-gradient">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Hero Content */}
      <div className="relative container mx-auto px-6 py-24 md:py-32 text-center">
        {/* Logo */}
        <img src={Logo} alt="Agentic AI Logo" className="mx-auto w-20 md:w-24 mb-6" />

        {/* Headline */}
        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-extrabold tracking-tight md:text-6xl text-white">
          Get the best{" "}
          <span
            className="relative text-cyan-300"
            style={{
              textShadow: `0 0 12px ${glowColor}, 0 0 20px ${glowColor}`
            }}
          >
            Credit Card
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
          No one will ask your phone number here since this is Agentic AI :)
        </p>

        {/* Search Form */}
        <div className="mt-10 flex items-center justify-center">
          <form
            role="search"
            aria-label="Site search"
            onSubmit={handleSubmit}
            className="w-full max-w-2xl"
          >
            <Input
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={fade ? currentSuggestion : ""}
              aria-label="Search"
              autoFocus
              autoComplete="off"
              className={`h-14 rounded-full px-6 text-base shadow-lg border-input transition-colors duration-300 ${
                isBackgroundLight
                  ? "bg-white text-black placeholder-black"
                  : "bg-black text-white placeholder-white"
              }`}
              disabled={loading}
            />
            <button type="submit" className="sr-only">Search</button>
          </form>
        </div>

        {/* Results */}
        <div
          className="mx-auto mt-8 w-full max-w-3xl px-6 text-left"
          aria-live="polite"
          aria-busy={loading}
        >
          {loading && (
            <p className="text-sm text-white/80">
              Searching the best card for you.. just hold tight
            </p>
          )}
          {!loading && error && (
            <div role="alert" className="rounded-md border border-red-400 bg-red-100 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          {!loading && result && (
            <section className="rounded-lg border bg-white text-black shadow-sm">
              <article className="p-6">
                <div
                  className="space-y-3 leading-relaxed text-sm [&_a]:text-blue-500 [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: toHtml }}
                />
              </article>
            </section>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
