import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ResultCard } from "@/components/site/ResultCard";
import { ScannerShell } from "@/components/site/ScannerShell";
//import { analyzeEmail, saveScan, newId, type ScanRecord } from "@/lib/scan-store";
import {
  saveScan,
  newId,
  type ScanRecord
} from "@/lib/scan-store";
import { scanEmail, scanEmailFile  } from "@/lib/api/phishing";

import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/scanners/email")({
  head: () => ({ meta: [{ title: "Email Scanner — CyberShield AI" }] }),
  component: EmailScanner,
});

function EmailScanner() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Omit<ScanRecord, "id" | "createdAt"> | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileResults, setFileResults] = useState<any[]>([]);

  async function onAnalyze() {
    if (!text.trim()) return;
    setLoading(true); setResult(null);
    await new Promise((r) => setTimeout(r, 950));
    //const r = analyzeEmail(text);
    const response = await scanEmail(text);

    //const r = {
    const r: Omit<ScanRecord, "id" | "createdAt"> = {
      type: "email",
      input: text,
      verdict:
        response.prediction === "Phishing Email"
          ? "phishing"
          : "safe",

      confidence: 95,
      features: response.features || [],
    };
    
    setResult(r);
    saveScan({ ...r, id: newId(), createdAt: Date.now() });
    setLoading(false);
  }

  async function onFileAnalyze() {

    if (!file) return;

    setLoading(true);

    try {

      const data = await scanEmailFile(file);

      setFileResults(data.results || []);

      const phishingCount =
        (data.results || []).filter(
          (x: any) =>
            x.prediction === "PHISHING"
        ).length;

      setResult({
        type: "email",
        input: `${data.results.length} Emails scanned`,
        verdict:
          phishingCount > 0
            ? "phishing"
            : "safe",
        confidence:
          data.results.length > 0
            ? Math.round(
                data.results.reduce(
                  (sum: number, item: any) =>
                    sum + item.confidence,
                  0
                ) /
                  data.results.length
              )
            : 0,
        features: [],
      });

    } catch (err) {

      console.error(err);

    }

    setLoading(false);
  }

  return (
    <SiteLayout>

      {fileResults.length > 0 ? (

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            Email Scan Results
          </h2>

          <div className="glass p-6 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Verdict</th>
                  <th>Confidence</th>
                </tr>
              </thead>

              <tbody>
                {fileResults.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td className="max-w-4xl break-words">
                      {item.email}
                    </td>

                    <td
                      className={
                        item.prediction === "PHISHING"
                          ? "text-red-500 font-bold"
                          : "text-green-500 font-bold"
                      }
                    >
                      {item.prediction}
                    </td>

                    <td>
                      {item.confidence}%
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

      ) : (

        <ScannerShell
          title="Email Scanner"
          subtitle="Paste the full email body..."
          icon={<span>📧</span>}
          left={
            <div className="flex h-full flex-col gap-4">
              <label className="text-sm font-medium text-muted-foreground">Email content</label>
              <textarea
                rows={8}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="From: suspicious@email.com\nSubject: Verify your account\n\nClick here to verify your account..."
                className="glass-strong w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary/50"
              />
              <button
                onClick={onAnalyze}
                disabled={loading || !text.trim()}
                className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-background shadow-neon transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Analyzing email…" : "Analyze Email"}
              </button>

              <div className="mt-6 border-t border-white/10 pt-6">
                <label className="text-sm font-medium text-muted-foreground">
                  Upload Email CSV
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) =>
                    setFile(e.target.files?.[0] || null)
                  }
                  className="mt-2 block w-full"
                />

                <button
                  onClick={onFileAnalyze}
                  disabled={loading || !file}
                  className="mt-3 rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-background"
                >
                  Scan Email File
                </button>
              </div>
            </div>
          }
          right={<ResultCard result={result} />}
        />

      )}

    </SiteLayout>
  );
}
