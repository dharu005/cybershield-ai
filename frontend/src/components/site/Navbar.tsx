import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";

type NavLink = { to: "/" | "/dashboard" | "/history" | "/about"; label: string; hash?: boolean };
const links: NavLink[] = [
  { to: "/", label: "Home" },
  { to: "/", label: "Features", hash: true },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/history", label: "History" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-3 max-w-7xl px-4">
        <nav className="glass flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="group flex items-center gap-2">
            <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary shadow-[0_0_24px_-4px_var(--neon-cyan)]">
              <Shield className="h-5 w-5 text-background" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Cyber<span className="text-gradient">Shield</span> AI
            </span>
          </Link>
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) =>
              l.hash ? (
                <li key={l.label}>
                  <a
                    href="/#features"
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ) : (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    activeOptions={{ exact: true }}
                    activeProps={{ className: "text-primary bg-white/5" }}
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <Link
            to="/scanners/url"
            className="hidden rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-background shadow-[0_0_24px_-6px_var(--neon-cyan)] transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            Start Scanning
          </Link>
        </nav>
      </div>
    </header>
  );
}
