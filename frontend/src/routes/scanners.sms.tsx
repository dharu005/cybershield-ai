import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ResultCard } from "@/components/site/ResultCard";
import { ScannerShell } from "@/components/site/ScannerShell";
//import { analyzeSms, saveScan, newId, type ScanRecord } from "@/lib/scan-store";
import {
  saveScan,
  newId,
  type ScanRecord
} from "@/lib/scan-store";
import { scanSMS, scanSMSFile } from "@/lib/api/phishing";

import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/scanners/sms")({
  head: () => ({ meta: [{ title: "SMS Scanner — CyberShield AI" }] }),
  component: SmsScanner,
});

function SmsScanner() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Omit<ScanRecord, "id" | "createdAt"> | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileResults, setFileResults] = useState<any[]>([]);

  async function onAnalyze() {
    if (!text.trim()) return;
    setLoading(true); setResult(null);
    await new Promise((r) => setTimeout(r, 800));
    //const r = analyzeSms(text);
    const response = await scanSMS(text);
    //const r = {
    const r: Omit<ScanRecord, "id" | "createdAt"> = {
      type: "sms",
      input: text,
      verdict:
        response.prediction?.toLowerCase() === "spam"
          ? "phishing"
          : "safe",

      confidence: response.confidence ||95,
      features:  response.features || [],
    };

    setResult(r);
    saveScan({ ...r, id: newId(), createdAt: Date.now() });
    setLoading(false);
  }

  async function onFileAnalyze() {
  if (!file) return;

  setLoading(true);

  try {
    const data = await scanSMSFile(file);

    
    setFileResults(data.results || []);

    const phishingCount = (data.results || []).filter(
      (x: any) => x.prediction === "PHISHING"
    ).length;

    setResult({
      type: "sms",
      input: `${data.results.length} SMS scanned`,
      verdict: phishingCount > 0 ? "phishing" : "safe",
      confidence:
        data.results.length > 0
          ? Math.round(
              data.results.reduce(
                (sum: number, item: any) =>
                  sum + (item.confidence || 0),
                0
              ) / data.results.length
            )
          : 0,
      features: [],
    });
  } catch (error) {
    console.error(error);
  }

  setLoading(false);
}
  return (
    <SiteLayout>
      <ScannerShell
        title="SMS Scanner"
        subtitle="Paste a suspicious text message — get a confidence-rated verdict in under a second."
        icon={<span>📱</span>}
        left={
          <div className="flex h-full flex-col gap-4">
            <label className="text-sm font-medium text-muted-foreground">SMS content</label>
            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Congratulations! You are today's WINNER. Claim your prize: click here http://bit.ly/xyz"
              className="glass-strong w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary/50"
            />
            <button
              onClick={onAnalyze}
              disabled={loading || !text.trim()}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-background shadow-neon transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Classifying SMS…" : "Analyze SMS"}
            </button>

            <div className="mt-6 border-t border-white/10 pt-6">
              <label className="text-sm font-medium text-muted-foreground">
                Upload SMS Backup XML
              </label>
              <div className="mt-6">
                
              </div>
              <input
                type="file"
                accept=".xml"
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
                Scan SMS File
              </button>

              {fileResults.length > 0 && (
                <div className="fixed inset-0 z-50 bg-background p-6 overflow-auto">
          
                  <table className="w-full text-sm border border-white/10">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="p-2 text-left">#</th>
                        <th className="p-2 text-left">SMS</th>
                        <th className="p-2 text-left">Verdict</th>
                        <th className="p-2 text-left">Confidence</th>
                      </tr>
                    </thead>

                    <tbody>
                      {fileResults.map((item, index) => (
                        <tr key={index} className="border-b border-white/5">
                          <td className="p-2">{index + 1}</td>

                          <td className="p-2 max-w-md break-words">
                            {item.sms}
                          </td>

                          <td
                            className={`p-2 font-semibold ${
                              item.prediction === "PHISHING"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {item.prediction}
                          </td>

                          <td className="p-2">
                            {item.confidence}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
              )}
            </div>
          </div>
        }
        right={fileResults.length === 0 ? (
          <ResultCard result={result} />
        ) : null}
      />
    </SiteLayout>
  );
}

          {/*</div>
        }
        right={<ResultCard result={result} />}
      />
    </SiteLayout>
  );
}
*/}
