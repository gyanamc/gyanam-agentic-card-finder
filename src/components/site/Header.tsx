import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Product", href: "#product" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
  { label: "Changelog", href: "#changelog" },
  { label: "Docs", href: "#docs" },
  { label: "Discord", href: "https://discord.gg/lovable" },
];

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="Gyanam home">
          <span className="text-lg font-semibold tracking-tight">Gyanam</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hidden sm:inline-flex">Log in</Button>
          <Button variant="hero" size="sm">Sign up</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
