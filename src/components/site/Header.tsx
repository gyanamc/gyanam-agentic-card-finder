import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/gyanam-logo.png";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3" aria-label="Gyanam home">
          <img
            src={logo}
            alt="Gyanam logo"
            className="h-8 w-auto"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <span className="text-lg font-semibold tracking-tight">Gyanam</span>
        </Link>
        {/* Navigation removed as requested */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hidden sm:inline-flex">Log in</Button>
          <Button variant="hero" size="sm">Sign up</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
