import * as React from "react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import DOMPurify from "dompurify";

const Hero = () => {
  const rotatingSuggestions = [
    "Tell me the best card for international travel",
    "Which credit card gives maximum lounge access?",
    "Best card for cashback on shopping",
    "Which card has the lowest forex markup?",
  ];

  const [query, setQuery] = React.useState(rotatingSuggestions[0]);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = React.useState<string[]>([]);

  // Cycle placeholder suggestions
  React.useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % rotatingSuggestions.length;
      setQuery(rotatingSuggestions[i]);
    }, 4000); // every 4s
    return () => clearInterval(interval);
  }, []);

  const toHtml = React.useMemo(() => {
    if (!result) return "";
    return DOMPurify.sanitize(result, { USE_PROFILES: { html: true } });
  }, [result]);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const q = (overrideQuery ?? query).trim();
    if (!q) return;

    setError(null);
    setResult(null);
    setSuggestedQuestions([]);
    try {
      setLoading(true);
      const res = await fetch(
        "https://primary-production-da3f.up.railway.app/webhook/gyanam.store",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: { message: q } }),
        }
      );
      const contentType = res.headers.get("content-type") || "";
      if (res.ok) {
        let data: any;
        if (contentType.includes("application/json")) {
          data = await res.json();
        } else {
          data = { html: await res.text(), suggestedQuestions: [] };
        }

        setResult(data.html || "No results.");
        setSuggestedQuestions(data.suggestedQuestions || []);
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
      <div className="bg-hero">
        <div className="container mx-auto px-6 py-24 md:py-32 text-center">
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-extrabold tracking-tight md:text-6xl">
            Get the best <span className="text-gradient drop-shadow-md">Credit Card</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            No one will ask your phone number here since this is Agentic AI :)
          </p>

          {/* Search Bar */}
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
                placeholder="Search Gyanam..."
                aria-label="Search"
                autoFocus
                autoComplete="on"
                className="h-14 rounded-full px-6 text-base shadow-lg border-input bg-white text-black focus-visible:ring-ring"
                disabled={loading}
              />
              <button type="submit" className="sr-only">
                Search
              </button>
            </form>
          </div>

          {/* Results */}
          <div
            className="mx-auto mt-8 w-full max-w-3xl px-6 text-left"
            aria-live="polite"
            aria-busy={loading}
          >
            {loading && (
              <p className="text-sm text-muted-foreground">
                Searching the best card for you... just hold tight
              </p>
            )}
            {!loading && error && (
              <div
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
              >
                {error}
              </div>
            )}
            {!loading && result && (
              <section className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <article className="p-6">
                  <div
                    className="space-y-3 leading-relaxed text-sm [&_a]:text-primary [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: toHtml }}
                  />
                </article>
              </section>
            )}

            {/* Suggested Questions */}
            {!loading && suggestedQuestions.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubmit(undefined, q)}
                    className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
