import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
      </main>
      <footer className="border-t">
        <div className="container mx-auto py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Gyanam. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
