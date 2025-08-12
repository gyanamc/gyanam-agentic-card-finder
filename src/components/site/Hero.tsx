import * as React from "react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import DOMPurify from "dompurify";

const defaultSuggestions = [
  "tell me the best card for international travel",
  "which card has the best rewards program",
  "what’s the best card for fuel cashback",
  "suggest a credit card for students",
  "which credit card is best for online shopping"
];

const Hero = () => {
  const [query, setQuery] = React.useState(defaultSuggestions[0]);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = React.useState(0);
  const [userTyping, setUserTyping] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [debouncing, setDebouncing] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [showResults, setShowResults] = React.useState(false);

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

  const runSearch = async (searchQuery: string) => {
    setError(null);
    setResult(null);
    setShowResults(false); // reset animation
    setDebouncing(false);
    try {
      setLoading(true);
      const res = await fetch(
        "https://primary-production-da3f.up.railway.app/webhook/gyanam.store",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery }),
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
        setTimeout(() => setShowResults(true), 50); // trigger fade animation
      } else {
        const text = await res.text();
        const msg = `Webhook error ${res.status}${text ? `: ${text}` : ""}`;
        setError(msg);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    runSearch(query.trim() || defaultSuggestions[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() !== "" && value !== defaultSuggestions[currentSuggestionIndex]) {
      setUserTyping(true);
    }
  };

  // Run default search on first load
  React.useEffect(() => {
    runSearch(defaultSuggestions[0]);
  }, []);

  // Debounced search when typing
  React.useEffect(() => {
    if (userTyping && query.trim().length >= 3) {
      setDebouncing(true);
      const delay = setTimeout(() => {
        runSearch(query);
      }, 500);
      return () => clearTimeout(delay);
    }
  }, [query, userTyping]);

  // Cycle suggestions forever until user types
  React.useEffect(() => {
    if (userTyping) return;
    const interval = setInterval(() => {
      setCurrentSuggestionIndex((prev) => {
        const nextIndex = (prev + 1) % defaultSuggestions.length;
        setQuery(defaultSuggestions[nextIndex]);
        return nextIndex;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [userTyping]);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="bg-hero">
        <div className="container mx-auto px-6 py-24 md:py-32 text-center">
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-extrabold tracking-tight md:text-6xl">
            Get the best <span className="text-gradient">Credit Card</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            No one will ask your phone number here since this is Agentic AI :)
          </p>
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
                onChange={handleChange}
                placeholder={defaultSuggestions[0]}
                aria-label="Search"
                autoFocus
                autoComplete="on"
                className="h-14 rounded-full px-6 text-base shadow-lg border-input bg-background focus-visible:ring-ring"
                disabled={loading}
              />
              <button type="submit" className="sr-only">Search</button>
            </form>
          </div>
          <div
            className="mx-auto mt-8 w-full max-w-3xl px-6 text-left min-h-[1.5rem]"
            aria-live="polite"
            aria-busy={loading || debouncing}
          >
            {/* Crossfade debounce/loading */}
            <div className="relative h-5">
              <p
                className={`absolute inset-0 text-sm text-muted-foreground transition-opacity duration-500 ${
                  debouncing && !loading ? "opacity-100" : "opacity-0"
                }`}
              >
                Searching the best card for you… just hold tight
              </p>
              <p
                className={`absolute inset-0 text-sm text-muted-foreground transition-opacity duration-500 ${
                  loading ? "opacity-100" : "opacity-0"
                }`}
              >
                Searching...
              </p>
            </div>

            {/* Error */}
            {!loading && error && (
              <div
                role="alert"
                className="mt-2 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive transition-opacity duration-500"
              >
                {error}
              </div>
            )}

            {/* Smooth cascade fade-in + blur reveal results */}
            {!loading && result && (
              <section
                className={`mt-2 rounded-lg border bg-card text-card-foreground shadow-sm transition-opacity duration-700 ease-out ${
                  showResults ? "opacity-100" : "opacity-0"
                }`}
              >
                <article className="p-6">
                  {toHtml
                    .split(/<\/p>|<br\s*\/?>/i)
                    .filter((block) => block.trim() !== "")
                    .map((block, i) => {
                      const randomOffset = Math.floor(Math.random() * 60) - 30; // ±30ms random
                      return (
                        <div
                          key={i}
                          className={`transition-all duration-700 ease-out ${
                            showResults ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                          }`}
                          style={{
                            transitionDelay: `${i * 100 + randomOffset}ms`,
                          }}
                          dangerouslySetInnerHTML={{ __html: block + "</p>" }}
                        />
                      );
                    })}
                </article>
              </section>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
