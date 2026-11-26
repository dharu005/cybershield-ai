import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function ScannerShell({
  title,
  subtitle,
  icon,
  left,
  right,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to overview
      </Link>
      <header className="mt-6 flex items-start gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-2xl shadow-neon">
          {icon}
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">{subtitle}</p>
        </div>
      </header>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass p-6">{left}</div>
        {right}
      </div>
    </section>
  );
}
