import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Particles } from "@/components/site/Particles";
import {
  Link as LinkIcon,
  Mail,
  Smartphone,
  Usb,
  ScrollText,
  BarChart3,
  ArrowRight,
  Shield,
  Sparkles,
  Cpu,
  Eye,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CyberShield AI — AI-Powered Phishing Detection Platform" },
      {
        name: "description",
        content:
          "Detect malicious URLs, emails, SMS messages and USB threats using Machine Learning and Explainable AI.",
      },
      { property: "og:title", content: "CyberShield AI — Phishing Detection" },
      { property: "og:description", content: "Enterprise-grade AI phishing detection with Explainable AI." },
    ],
  }),
  component: Landing,
});

const services = [
  { icon: LinkIcon,    emoji: "🔗", title: "URL Scanner",   desc: "Analyze URLs and detect phishing websites using Machine Learning.", to: "/scanners/url" as const,   cta: "Open Scanner" },
  { icon: Mail,        emoji: "📧", title: "Email Scanner", desc: "Detect phishing emails and suspicious content in seconds.",         to: "/scanners/email" as const, cta: "Open Scanner" },
  { icon: Smartphone,  emoji: "📱", title: "SMS Scanner",   desc: "Identify spam and phishing SMS messages instantly.",                to: "/scanners/sms" as const,   cta: "Open Scanner" },
  { icon: Usb,         emoji: "💾", title: "USB Scanner",   desc: "Scan connected USB devices for suspicious threats.",                to: "/scanners/usb" as const,   cta: "Open Scanner" },
  { icon: ScrollText,  emoji: "📜", title: "History",       desc: "View previous scans and investigation logs.",                       to: "/history" as const,        cta: "View History" },
  { icon: BarChart3,   emoji: "📊", title: "Dashboard",     desc: "View analytics, phishing statistics and reports.",                  to: "/dashboard" as const,      cta: "Open Dashboard" },
];

const xaiTags = [
  { token: "login", w: 92 },
  { token: "verify", w: 88 },
  { token: "urgent", w: 84 },
  { token: "account", w: 78 },
  { token: "bank", w: 72 },
  { token: "otp", w: 68 },
  { token: "winner", w: 65 },
  { token: "paypal", w: 60 },
  { token: "click here", w: 58 },
  { token: "suspended", w: 55 },
];

function Landing() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="cyber-grid absolute inset-0 -z-10" />
        <Particles count={40} />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:py-28 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="glass inline-flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-success/20 text-success">
                <Sparkles className="h-3 w-3" />
              </span>
              ML + Explainable AI · Real-time detection
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              AI-Powered <span className="text-gradient">Phishing Detection</span> Platform
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Detect malicious URLs, emails, SMS messages and USB threats using Machine Learning
              and Explainable AI — purpose-built for modern security teams.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/scanners/url"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-background shadow-neon transition-transform hover:scale-[1.03]"
              >
                Start Scanning <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="glass inline-flex items-center gap-2 px-5 py-3 font-medium text-foreground transition-colors hover:text-primary"
              >
                View Dashboard
              </Link>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-3 text-center">
              {[
                { v: "99.2%", l: "Accuracy" },
                { v: "<800ms", l: "Avg latency" },
                { v: "4", l: "Threat channels" },
              ].map((s) => (
                <div key={s.l} className="glass p-3">
                  <p className="font-display text-xl font-bold text-gradient">{s.v}</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero illustration */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 -z-10 animate-pulse-glow rounded-[3rem]" />
            <div className="glass-strong glass relative aspect-square overflow-hidden p-6">
              <div className="absolute inset-0 cyber-grid opacity-60" />
              <div className="relative grid h-full place-items-center">
                <div className="animate-float-slow relative grid h-48 w-48 place-items-center rounded-full border border-primary/40 bg-background/40 shadow-neon">
                  <div className="grid h-32 w-32 place-items-center rounded-full border border-secondary/40 bg-background/60">
                    <Shield className="h-16 w-16 text-primary drop-shadow-[0_0_24px_var(--neon-cyan)]" />
                  </div>
                  {/* Orbits */}
                  {[Cpu, Eye, LinkIcon, Mail].map((Icon, i) => {
                    const angle = (i * 90 * Math.PI) / 180;
                    const r = 120;
                    return (
                      <span
                        key={i}
                        className="absolute grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-background/70 backdrop-blur"
                        style={{
                          transform: `translate(${Math.cos(angle) * r}px, ${Math.sin(angle) * r}px)`,
                          boxShadow: "0 0 18px -6px var(--neon-violet)",
                        }}
                      >
                        <Icon className="h-5 w-5 text-primary" />
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-primary">Detection Services</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            One platform. Every phishing surface.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Six dedicated modules powered by the same ML core, with Explainable AI baked into every verdict.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.title}
              to={s.to}
              className="glass group relative overflow-hidden p-6 transition-all hover:-translate-y-1 hover:shadow-neon"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-primary opacity-0 blur-3xl transition-opacity group-hover:opacity-30" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-2xl ring-1 ring-white/10">
                    {s.emoji}
                  </div>
                  <s.icon className="h-5 w-5 text-primary opacity-70" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  {s.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* XAI */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="glass relative overflow-hidden p-8 sm:p-12">
          <div aria-hidden className="absolute inset-0 cyber-grid opacity-50" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-primary">Explainable AI</p>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
                Explainable AI Insights
              </h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                The system highlights important words and features that influenced the machine learning model's prediction —
                so every verdict is transparent, auditable, and trustworthy.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { label: "Token weighting", v: "SHAP" },
                  { label: "Model", v: "XGBoost · BERT" },
                  { label: "Latency", v: "<800 ms" },
                ].map((b) => (
                  <div key={b.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{b.label}</p>
                    <p className="font-display text-sm font-semibold text-gradient">{b.v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap content-start gap-2">
              {xaiTags.map((t) => (
                <span
                  key={t.token}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm"
                  style={{ boxShadow: `0 0 ${t.w / 3}px -4px var(--neon-cyan)` }}
                >
                  <span className="text-primary">#</span>
                  {t.token}
                  <span className="rounded bg-background/40 px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
                    {t.w}%
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
