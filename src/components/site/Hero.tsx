import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Hero = () => {
  const [coords, setCoords] = useState({ x: 50, y: 20 });

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setCoords({ x, y });
    };
    window.addEventListener("pointermove", handler, { passive: true });
    return () => window.removeEventListener("pointermove", handler);
  }, []);

  return (
    <section
      className="relative isolate overflow-hidden"
      style={{
        // Signature gradient that subtly follows the pointer
        // Uses design tokens; disabled for users preferring reduced motion
        ["--pointer-x" as any]: `${coords.x}%`,
        ["--pointer-y" as any]: `${coords.y}%`,
      }}
    >
      <div className="bg-hero">
        <div className="container mx-auto px-6 py-24 md:py-32 text-center">
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-extrabold tracking-tight md:text-6xl">
            Get the best <span className="text-gradient">Credit Card</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            No one will ask your phone number here since this is Agentic AI :)
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="xl" variant="hero">Get started</Button>
            <Button size="xl" variant="outline">Read the docs</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
