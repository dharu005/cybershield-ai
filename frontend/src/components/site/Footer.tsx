import { Link } from "@tanstack/react-router";
import { Shield, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-background/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary">
              <Shield className="h-5 w-5 text-background" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-semibold">
              Cyber<span className="text-gradient">Shield</span> AI
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            AI-powered phishing detection with Explainable AI for enterprises and security teams.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
            <li><Link to="/history" className="hover:text-primary">History</Link></li>
            <li><Link to="/scanners/url" className="hover:text-primary">URL Scanner</Link></li>
            <li><Link to="/scanners/email" className="hover:text-primary">Email Scanner</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><a href="#" className="hover:text-primary">Contact</a></li>
            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Follow</h4>
          <div className="mt-3 flex gap-3">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="glass grid h-9 w-9 place-items-center transition-colors hover:text-primary">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-muted-foreground">
        © 2026 CyberShield AI. All Rights Reserved.
      </div>
    </footer>
  );
}
