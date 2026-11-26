import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { loadScans, deleteScan, clearScans, type ScanRecord, type ScanType } from "@/lib/scan-store";
import { Download, Trash2, Link as LinkIcon, Mail, Smartphone, Usb, Search } from "lucide-react";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — CyberShield AI" }] }),
  component: History,
});

const FILTERS: { key: ScanType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "url", label: "URL" },
  { key: "email", label: "Email" },
  { key: "sms", label: "SMS" },
  { key: "usb", label: "USB" },
];

function History() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [filter, setFilter] = useState<ScanType | "all">("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    const refresh = () => setScans(loadScans());
    refresh();
    window.addEventListener("scans:updated", refresh);
    return () => window.removeEventListener("scans:updated", refresh);
  }, []);

  const filtered = useMemo(() => {
    return scans
      .filter((s) => filter === "all" || s.type === filter)
      .filter((s) => [s.id, s.input, s.verdict].some((x) => x.toLowerCase().includes(q.toLowerCase())));
  }, [scans, filter, q]);

  function exportCsv() {
    const headers = ["id","type","input","verdict","confidence","createdAt"];
    const rows = filtered.map((s) => [s.id, s.type, JSON.stringify(s.input), s.verdict, s.confidence, new Date(s.createdAt).toISOString()].join(","));
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `cybershield-history-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const Icon = (t: ScanType) =>
    t === "url" ? LinkIcon : t === "email" ? Mail : t === "sms" ? Smartphone : Usb;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-primary">Investigation Logs</p>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">Scan History</h1>
            <p className="mt-1 text-muted-foreground">Searchable archive of every scan performed by your team.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportCsv} className="glass inline-flex items-center gap-2 px-4 py-2 text-sm hover:text-primary">
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button
              onClick={() => { if (confirm("Clear all scan history?")) clearScans(); }}
              className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive hover:bg-destructive/20"
            >
              <Trash2 className="h-4 w-4" /> Clear All
            </button>
          </div>
        </header>

        <div className="glass mt-6 flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  filter === f.key
                    ? "bg-gradient-primary text-background"
                    : "border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search history…"
              className="w-56 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        <div className="glass mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Input</th>
                  <th className="px-5 py-3">Verdict</th>
                  <th className="px-5 py-3">Confidence</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">No history yet — run a scan to start logging activity.</td></tr>
                )}
                {filtered.map((s) => {
                  const I = Icon(s.type);
                  const color = s.verdict === "phishing" ? "text-destructive" : s.verdict === "suspicious" ? "text-warning" : "text-success";
                  return (
                    <tr key={s.id} className="transition-colors hover:bg-white/5">
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{s.id}</td>
                      <td className="px-5 py-3"><span className="inline-flex items-center gap-2"><I className="h-4 w-4 text-primary" />{s.type.toUpperCase()}</span></td>
                      <td className="max-w-[320px] truncate px-5 py-3">{s.input}</td>
                      <td className={`px-5 py-3 font-semibold ${color}`}>{s.verdict.toUpperCase()}</td>
                      <td className="px-5 py-3 tabular-nums">{s.confidence}%</td>
                      <td className="px-5 py-3 text-muted-foreground">{new Date(s.createdAt).toLocaleString()}</td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => deleteScan(s.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs text-destructive hover:bg-destructive/20"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
