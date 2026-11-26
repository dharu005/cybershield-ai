import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ScannerShell } from "@/components/site/ScannerShell";
//import { simulateUsbScan, saveScan, newId } from "@/lib/scan-store";
import { Loader2, Usb, ShieldCheck, ShieldAlert } from "lucide-react";

import { saveScan, newId } from "@/lib/scan-store";
import { scanUSB } from "@/lib/api/usb";

export const Route = createFileRoute("/scanners/usb")({
  head: () => ({ meta: [{ title: "USB Scanner — CyberShield AI" }] }),
  component: UsbScanner,
});

function UsbScanner() {
  const [loading, setLoading] = useState(false);
  const [scan, setScan] = useState<any>(null);

async function onScan() {
  setLoading(true);
  setScan(null);

  try {
    const data = await scanUSB();

    const deviceNames = data.devices
      .map((d: any) => d.name)
      .join(", ");

    const result = {
      type: "usb" as const,
      input: deviceNames || "No USB Device",
      verdict: (data.threats_found > 0 ? "phishing" : "safe") as "phishing" | "safe",
      confidence: data.devices[0]?.confidence || 95,
      features: [],
      devices: data.devices.map((d: any) => ({
        name: d.name,
        status: d.status,
        risk: d.risk,
      })),
      risk: (data.threats_found > 0 ? "medium" : "low") as "medium" | "low",
      scanTime: parseFloat(
        data.scan_time?.replace(" sec", "") || "1"
      ),
    };

    setScan(result);

    saveScan({
      id: newId(),
      createdAt: Date.now(),
      type: "usb",
      input: deviceNames,
      verdict: result.verdict,
      confidence: result.confidence,
      features: [],
      meta: {
        risk: result.risk,
        scanTime: result.scanTime,
      },
    });

  } catch (err) {
    console.error(err);
  }

  setLoading(false);
}

  const risk = scan?.risk ?? "low";
  const riskColor = risk === "high" ? "text-destructive" : risk === "medium" ? "text-warning" : "text-success";

  return (
    <SiteLayout>
      <ScannerShell
        title="USB Scanner"
        subtitle="Inspect connected USB devices for autorun threats, hidden executables and unknown vendors."
        icon={<span>💾</span>}
        left={
          <div className="flex h-full flex-col gap-6">
            <div className="glass-strong rounded-xl border border-white/10 p-6 text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/5 ring-1 ring-primary/30">
                <Usb className={`h-9 w-9 ${loading ? "animate-pulse text-primary" : "text-primary"}`} />
              </div>
              <p className="mt-4 font-display text-lg font-semibold">
                {loading ? "Scanning USB devices…" : scan ? "Scan complete" : "USB Scanner Ready"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {loading
                  ? "Reading device descriptors and inspecting filesystem"
                  : "Click below to start a deep inspection of all connected USB devices."}
              </p>
            </div>
            <button
              onClick={onScan}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 font-semibold text-background shadow-neon transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Scanning…" : scan ? "Re-scan Devices" : "Start USB Scan"}
            </button>
          </div>
        }
        right={
          <div className="glass flex h-full min-h-[420px] flex-col gap-5 p-6">
            <header className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Threat Report</h3>
              <span className={`text-xs uppercase tracking-widest ${riskColor}`}>
                {scan ? `Risk: ${risk}` : "Idle"}
              </span>
            </header>

            {!scan ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                <Usb className="h-10 w-10 text-primary/60" />
                <p>Run a scan to view connected devices and threat status.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <Box label="Devices" value={String(scan.devices.length)} />
                  <Box label="Risk Level" value={scan.risk.toUpperCase()} accent={riskColor} />
                  <Box label="Scan Time" value={`${scan.scanTime}s`} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Connected devices</p>
                  <ul className="mt-2 divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5">
                    {scan.devices.map((d: any) => {
                      const clean = 
                        d.status === "Connected" ||
                        d.status === "Clean";
                      return (
                        <li key={d.name} className="flex items-center justify-between p-3 text-sm">
                          <div className="flex items-center gap-3">
                            {clean ? <ShieldCheck className="h-4 w-4 text-success" /> : <ShieldAlert className="h-4 w-4 text-destructive" />}
                            <span className="font-medium">{d.name}</span>
                          </div>
                          <span className={clean ? "text-success" : "text-destructive"}>{d.status}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Confidence</p>
                  <div className="mt-2 flex items-end justify-between">
                    <p className="font-display text-2xl font-bold tabular-nums">{scan.confidence}%</p>
                    <p className={`text-sm font-semibold ${scan.verdict === "safe" ? "text-success" : "text-destructive"}`}>
                      {scan.verdict === "safe" ? "No threats detected" : "Threats detected"}
                    </p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full ${scan.verdict === "safe" ? "bg-success" : "bg-gradient-to-r from-warning to-destructive"}`}
                      style={{ width: `${scan.confidence}%` }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">XAI signals</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {scan.features.map((f: { token: string; weight: number }) => (
                      <span
                        key={f.token}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs"
                        style={{ boxShadow: `0 0 ${8 + f.weight * 60}px -4px var(--neon-cyan)` }}
                      >
                        #{f.token}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        }
      />
    </SiteLayout>
  );
}

function Box({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-sm font-semibold ${accent ?? ""}`}>{value}</p>
    </div>
  );
}
