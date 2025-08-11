import { Button } from "@/components/ui/button";

const Hero = () => {
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
