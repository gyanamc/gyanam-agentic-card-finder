import { Link } from "react-router-dom";
import logo from "@/assets/logo-gradient.svg"; // Place your SVG file here

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b">
      {/* Logo + Site Name */}
      <Link to="/" className="flex items-center space-x-2">
        <img
          src={logo}
          alt="Gyanam Logo"
          className="h-8 w-8 sm:h-10 sm:w-10"
        />
        <span className="text-xl font-bold tracking-tight">Gyanam</span>
      </Link>

      {/* Navigation Menu (keep existing or add new links) */}
      <nav className="flex items-center space-x-6">
        <Link
          to="/about"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}
