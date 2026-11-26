import { createFileRoute, useNavigate  } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ResultCard } from "@/components/site/ResultCard";
import { ScannerShell } from "@/components/site/ScannerShell";
//import { analyzeUrl, saveScan, newId, type ScanRecord } from "@/lib/scan-store";
import {
  saveScan,
  newId,
  type ScanRecord
} from "@/lib/scan-store";

import { scanURL } from "@/lib/api/phishing";

import { Loader2, Link as LinkIcon } from "lucide-react";

export const Route = createFileRoute("/scanners/url")({
  head: () => ({ meta: [{ title: "URL Scanner — CyberShield AI" }] }),
  component: UrlScanner,
});

function UrlScanner() {
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Omit<ScanRecord, "id" | "createdAt"> | null>(null);

  useEffect(() => () => setLoading(false), []);

 // async function onAnalyze() {
   // if (!url.trim()) return;
    //setLoading(true);
    //setResult(null);
    //await new Promise((r) => setTimeout(r, 850));
    //const r = analyzeUrl(url.trim());
    //setResult(r);
    //saveScan({ ...r, id: newId(), createdAt: Date.now() });
    //setLoading(false);
  //}
async function onAnalyze() {
  if (!url.trim()) return;

  setLoading(true);
  setResult(null);

  try {

    const response = await scanURL(url);

    //const resultData = {
    const resultData: Omit<ScanRecord, "id" | "createdAt"> = {
      type: "url",
      input: url,
      verdict:
        response.prediction === "Phishing"
          ? "phishing"
          : "safe",

      confidence: response.confidence || 95,

      features: response.features || [],
    };
    setResult(resultData);

    saveScan({
      ...resultData,
      id: newId(),
      createdAt: Date.now(),
    });

  } catch (err) {
    console.error(err);
  }

  setLoading(false);
}
  return (
    <SiteLayout>
      <ScannerShell
        title="URL Scanner"
        subtitle="Submit any URL and our ML model will classify it with confidence scoring and explainable AI insights."
        icon={<span>🔗</span>}
        left={
          <div className="flex h-full flex-col gap-4">
            <label className="text-sm font-medium text-muted-foreground">Enter URL</label>
            <div className="glass-strong flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example-login.com/verify-account"
                className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground/60"
                onKeyDown={(e) => e.key === "Enter" && onAnalyze()}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Tip: try <code className="rounded bg-white/5 px-1.5 py-0.5">http://secure-paypal-login.verify-account.com</code>
            </p>
            <button
              onClick={onAnalyze}
              disabled={loading || !url.trim()}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-background shadow-neon transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Analyzing with ML model…" : "Analyze URL"}
            </button>

            <button
              onClick={() => navigate({ to: "/browser-logs" })}
              className="rounded-xl border border-cyan-500/30 bg-white/5 px-5 py-3 text-white transition hover:bg-white/10"
            >
              🌐 Scan Logged URLs
            </button>
          </div>
        }
        right={<ResultCard result={result} />}
      />
    </SiteLayout>
  );
}
