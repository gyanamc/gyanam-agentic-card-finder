import * as React from "react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

const Hero = () => {
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
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
      if (res.ok) {
        toast.success("Request sent to webhook");
      } else {
        const text = await res.text();
        toast.error(`Webhook error: ${res.status}`);
        console.error("Webhook error:", res.status, text);
      }
    } catch (err) {
      console.error(err);
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
