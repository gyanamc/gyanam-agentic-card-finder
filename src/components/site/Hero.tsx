import * as React from "react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import DOMPurify from "dompurify";
import logo from "@/assets/logo-gradient.svg"; // Ensure file exists

const placeholderQuestions = [
  "Tell me the best card for international travel",
  "Which credit card has the best rewards?",
  "Find me a card with no annual fees",
  "Best card for online shopping in India",
];

const Hero = () => {
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0);
  const [placeholderVisible, setPlaceholderVisible] = React.useState(false);
  const [typingStarted, setTypingStarted] = React.useState(false);

  const startRotation = React.useCallback(() => {
    let interval: NodeJS.Timeout;
    const timeout = setTimeout(() => {
      setPlaceholderVisible(true);
      interval = setInterval(() => {
        setPlaceholderVisible(false);
        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholderQuestions.length);
          setPlaceholderVisible(true);
        }, 300);
      }, 2000);
    }, 1500);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    const cleanup = startRotation();
    return cleanup;
  }, [startRotation]);

  // Restart placeholder when cleared
  React.useEffect(() => {
    if (query === "" && typingStarted) {
      setTypingStarted(false);
      const cleanup = startRotation();
      return cleanup;
    }
  }, [query, typingStarted, startRotation]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setError(null);
    setResult(null);
    try {
      setLoading(true);
      const res = await fetch(
        "https://primary-production-da3f.up.railway.app/webhook/gyanam.store",
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
        const msg = `Webhook error ${res.status}${text ? `: ${text}` : ""}`;
        setError(msg);
        toast.error(`Webhook error: ${res.status}`);
      }
    } catch (err) {
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

          {/* Logo */}
          <img
            src={logo}
            alt="Gyanam Agentic AI Logo"
            className="mx-auto mb-6 h-16 w-16 sm:h-20 sm:w-20"
          />

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
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (!typingStarted && e.target.value !== "") {
                    setTypingStarted(true);
                    setPlaceholderVisible(false);
                  }
                }}
                placeholder={
                  typingStarted
                    ? ""
                    : placeholderVisible
                    ? placeholderQuestions[placeholderIndex]
                    : ""
                }
                aria-label="Search"
                autoFocus
                autoComplete="on"
                className={`h-14 rounded-full px-6 text-base shadow-lg border-input bg-background focus-visible:ring-ring transition-opacity duration-300 ${
                  placeholderVisible ? "opacity-100" : "opacity-0"
                }`}
                disabled={loading}
              />
              <button type="submit" className="sr-only">Search</button>
            </form>
          </div>

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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
