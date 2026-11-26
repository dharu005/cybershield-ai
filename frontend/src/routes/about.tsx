import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Cpu, Eye, ShieldCheck, Zap } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — CyberShield AI" }] }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-sm uppercase tracking-[0.25em] text-primary">About</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
          Building the next generation of <span className="text-gradient">phishing defence</span>.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          CyberShield AI is a unified detection platform that combines classic Machine Learning with modern
          Explainable AI to protect organisations from URL, email, SMS and USB-based phishing attacks.
          Every verdict is auditable — security analysts always know <em>why</em> a piece of content was flagged.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {[
            { icon: Cpu, title: "Multi-model pipeline", desc: "Gradient-boosted trees for URL features, transformer encoders for text content, behavioural heuristics for devices." },
            { icon: Eye, title: "Explainable AI", desc: "SHAP-style token weighting surfaces the exact words and features behind each prediction." },
            { icon: Zap, title: "Sub-second latency", desc: "Optimised inference paths deliver verdicts in under 800 milliseconds at the edge." },
            { icon: ShieldCheck, title: "Enterprise ready", desc: "Audit logs, history export and per-channel dashboards built for SOC workflows." },
          ].map((f) => (
            <div key={f.title} className="glass p-6">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass mt-10 p-8 text-center">
          <h3 className="font-display text-2xl font-semibold"></h3>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            CyberShield AI demonstrates a production-grade, enterprise SaaS approach to phishing detection — comparable in
            scope to platforms like CrowdStrike, Darktrace, Microsoft Defender and Splunk.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
