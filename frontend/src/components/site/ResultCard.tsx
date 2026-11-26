import { AlertTriangle, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import type { ScanRecord } from "@/lib/scan-store";

export function ResultCard({ result }: { result: Omit<ScanRecord, "id" | "createdAt"> | null }) {
  if (!result) {
    return (
      <div className="glass flex h-full min-h-[420px] flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/5">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <h3 className="font-display text-lg font-semibold">Awaiting analysis</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Submit input on the left and our ML model will return a verdict with Explainable AI insights.
        </p>
      </div>
    );
  }

  const isPhish = result.verdict === "phishing";
  const isSusp = result.verdict === "suspicious";
  const color = isPhish ? "text-destructive" : isSusp ? "text-warning" : "text-success";
  const ring = isPhish ? "ring-destructive/40" : isSusp ? "ring-warning/40" : "ring-success/40";
  const Icon = isPhish ? ShieldAlert : isSusp ? AlertTriangle : CheckCircle2;
  const label = isPhish ? "Phishing Detected" : isSusp ? "Suspicious Content" : "Legitimate / Safe";

  return (
    <div className="glass animate-counter flex h-full flex-col gap-6 p-6">
      <div className={`flex items-center gap-4 rounded-xl bg-white/5 p-4 ring-1 ${ring}`}>
        <div className={`grid h-12 w-12 place-items-center rounded-xl bg-background/40 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Detection Result</p>
          <p className={`font-display text-xl font-semibold ${color}`}>{label}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Confidence</p>
          <p className="font-display text-2xl font-bold tabular-nums">{result.confidence}%</p>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Model confidence</span>
          <span className="tabular-nums">{result.confidence}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isPhish ? "bg-gradient-to-r from-destructive to-warning"
              : isSusp ? "bg-gradient-to-r from-warning to-primary"
              : "bg-gradient-to-r from-success to-primary"
            }`}
            style={{ width: `${result.confidence}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <Stat label="Verdict" value={result.verdict.toUpperCase()} accent={color} />
        <Stat label="Features" value={String(result.features.length)} />
        <Stat label="Channel" value={result.type.toUpperCase()} />
      </div>

      <div className="flex-1">
        <h4 className="font-display text-base font-semibold">Why did AI make this decision?</h4>
        <p className="mt-1 text-xs text-muted-foreground">
          Top features and tokens that influenced the model's prediction.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {result.features.length === 0 && (
            <span className="text-sm text-muted-foreground">No strong signals detected.</span>
          )}
          {result.features.map((f) => (
            <span
              key={f.token}
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium"
              style={{
                boxShadow: `0 0 ${8 + f.weight * 60}px -2px ${isPhish ? "rgba(255,82,82,0.5)" : "rgba(0,229,255,0.45)"}`,
              }}
            >
              <span className={isPhish ? "text-destructive" : "text-primary"}>#</span>
              {f.token}
              <span className="rounded bg-background/40 px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
                {(f.weight * 100).toFixed(0)}%
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-sm font-semibold ${accent ?? ""}`}>{value}</p>
    </div>
  );
}
