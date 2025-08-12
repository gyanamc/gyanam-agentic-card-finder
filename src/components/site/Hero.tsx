import * as React from "react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

const Hero = () => {
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

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
          // Try some common shapes, else stringify
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
        console.error("Webhook error:", res.status, text);
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
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Gyanam..."
                aria-label="Search"
                autoFocus
                autoComplete="on"
                className="h-14 rounded-full px-6 text-base shadow-lg border-input bg-background focus-visible:ring-ring"
                disabled={loading}
              />
              <button type="submit" className="sr-only">Search</button>
            </form>
          </div>
          <div className="mx-auto mt-8 w-full max-w-3xl px-6 text-left" aria-live="polite" aria-busy={loading}>
            {loading && (
              <p className="text-sm text-muted-foreground">Searching...</p>
            )}
            {!loading && error && (
              <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}
            {!loading && result && (
              <section className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <article className="p-6">
                  <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed">{result}</pre>
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
