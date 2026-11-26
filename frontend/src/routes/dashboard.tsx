import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { loadScans, type ScanRecord } from "@/lib/scan-store";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, AreaChart, Area, Legend,
} from "recharts";
import { Activity, ShieldAlert, ShieldCheck, Mail, Smartphone, Link as LinkIcon, Usb, BarChart3 } from "lucide-react";
import { scanLoggedURLs } from "@/lib/api/history";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CyberShield AI" }] }),
  component: Dashboard,
});

function useScans() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  useEffect(() => {
    const refresh = () => setScans(loadScans());
    refresh();
    window.addEventListener("scans:updated", refresh);
    return () => window.removeEventListener("scans:updated", refresh);
  }, []);
  return scans;
}

function useCounter(target: number, durationMs = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return v;
}

const COLORS = ["#00E5FF", "#6C63FF", "#00C853", "#FF5252", "#FFC107"];

function Dashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
  async function loadBrowserLogs() {
    try {
      const data = await scanLoggedURLs();
      setBrowserLogs(data);
    } catch (err) {
      console.error(err);
    }
  }

  loadBrowserLogs();
}, []);


  const scans = useScans();
  
  const [browserLogs, setBrowserLogs] = useState<any[]>([]);

  const stats = useMemo(() => {
    const by = (t: ScanRecord["type"]) => scans.filter((s) => s.type === t).length;
    return {
      total: scans.length,
      url: by("url"),
      email: by("email"),
      sms: by("sms"),
      usb: by("usb"),
      phishing: scans.filter((s) => s.verdict === "phishing").length,
      safe: scans.filter((s) => s.verdict === "safe").length,
    };
  }, [scans]);

  const browserStats = useMemo(() => {
    const total = browserLogs.length;

    const safe = browserLogs.filter(
      (x) => x.status === "Safe"
    ).length;

    const phishing = browserLogs.filter(
      (x) => x.status === "Phishing"
    ).length;

    const lastScan =
      browserLogs.length > 0
        ? new Date().toLocaleTimeString()
        : "No Scan";

    return {
      total,
      safe,
      phishing,
      lastScan,
    };

  }, [browserLogs]);

  const pieData = [
    { name: "URL", value: stats.url },
    { name: "Email", value: stats.email },
    { name: "SMS", value: stats.sms },
    { name: "USB", value: stats.usb },
  ];

  // Activity over last 7 days
  const lineData = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      const count = scans.filter((s) => new Date(s.createdAt).toISOString().slice(0, 10) === key).length;
      const rand = mounted ? Math.round(8 + Math.random() * 6) : 8;
      return { day: d.toLocaleDateString("en", { weekday: "short" }), scans: count,};
    });
    return days;
  }, [scans, mounted]);

  //const barData = [
    //{ name: "Credentials", value: 42 },
    //{ name: "Payment", value: 28 },
    //{ name: "Lottery", value: 17 },
    //{ name: "Malware", value: 23 },
    //{ name: "Impersonation", value: 31 },
  //];

  //const areaData = useMemo(() =>
    //Array.from({ length: 12 }).map((_, i) => ({
      //month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
      //safe: mounted ? 80 + Math.round(Math.random() * 40) : 80,
      //phishing: mounted ? 30 + Math.round(Math.random() * 40) : 30,
    //})),
  //[mounted]);
  

  const monthMap: Record<
    string,
    { month: string; safe: number; phishing: number }
  > = {};

  scans.forEach((scan) => {
    const month = new Date(scan.createdAt).toLocaleString(
      "default",
      { month: "short" }
    );

    if (!monthMap[month]) {
      monthMap[month] = {
        month,
        safe: 0,
        phishing: 0,
      };
    }

    if (scan.verdict === "safe") {
      monthMap[month].safe += 1;
    } else {
      monthMap[month].phishing += 1;
    }
  });

  const areaData = Object.values(monthMap);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-primary">Analytics</p>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">Security Operations Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Real-time view of scans, threats and detection performance.</p>
          </div>
          <div className="glass flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" /> Live · ML pipeline healthy
          </div>
        </header>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <StatCard icon={Activity} label="Total Scans" value={stats.total} accent="text-primary" />
          <StatCard icon={LinkIcon} label="URL Scans" value={stats.url} />
          <StatCard icon={Mail} label="Email Scans" value={stats.email} />
          <StatCard icon={Smartphone} label="SMS Scans" value={stats.sms} />
          <StatCard icon={ShieldAlert} label="Phishing" value={stats.phishing} accent="text-destructive" />
          <StatCard icon={ShieldCheck} label="Safe" value={stats.safe} accent="text-success" />
        </div>

        {/* Charts */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ChartCard title="Detection Distribution" subtitle="Scans grouped by channel">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={4}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Scan Activity" subtitle="Last 7 days">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={lineData}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="scans" stroke="#00E5FF" strokeWidth={3} dot={{ fill: "#00E5FF", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/*<ChartCard title="Threat Categories" subtitle="Distribution of detected attack types">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[8,8,0,0]} fill="url(#barG)" />
                <defs>
                  <linearGradient id="barG" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00E5FF" />
                    <stop offset="100%" stopColor="#6C63FF" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>*/}

          {/*<ChartCard
            title="Browser URL Analysis"
            subtitle="Chrome Extension Logs"
          >
            <div className="space-y-4 text-sm">

              <div>
                <strong>Total Logged URLs:</strong>
                {" "}
                {browserStats.total}
              </div>

              <div>
                <strong>Safe URLs:</strong>
                {" "}
                {browserStats.safe}
              </div>

              <div>
                <strong>Phishing URLs:</strong>
                {" "}
                {browserStats.phishing}
              </div>

              <div>
                <strong>Last Scan Time:</strong>
                {" "}
                {browserStats.lastScan}
              </div>

            </div>
          </ChartCard>*/}
          <ChartCard
            title="Monthly Scan Statistics"
            subtitle="Safe vs Phishing Trend"
          >
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="aSafe" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00C853" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#00C853" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="aPhish" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#FF5252" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#FF5252" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={tooltipStyle} />

                <Area
                  type="monotone"
                  dataKey="safe"
                  stroke="#00C853"
                  fill="url(#aSafe)"
                />

                <Area
                  type="monotone"
                  dataKey="phishing"
                  stroke="#FF5252"
                  fill="url(#aPhish)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/*<ChartCard title="Monthly Scan Statistics" subtitle="Safe vs phishing trend">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="aSafe" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00C853" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#00C853" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="aPhish" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#FF5252" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#FF5252" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="safe" stroke="#00C853" fill="url(#aSafe)" />
                <Area type="monotone" dataKey="phishing" stroke="#FF5252" fill="url(#aPhish)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>*/}

          
          <ChartCard
            title="Browser URL Distribution"
            subtitle="Safe vs Phishing"
          >
            <ResponsiveContainer
              width="100%"
              height={260}
            >
              <BarChart
                data={[
                  {
                    name: "Safe",
                    value: browserStats.safe,
                  },
                  {
                    name: "Phishing",
                    value: browserStats.phishing,
                  },
                ]}
              >
                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                />

                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                />

                <YAxis
                  stroke="#94a3b8"
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                />

                <Bar
                  dataKey="value"
                  fill="#00E5FF"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>

        
        {/* Recent activity */}
        <RecentActivity scans={scans} />
      </section>
    </SiteLayout>
  );
}

const tooltipStyle: React.CSSProperties = {
  background: "rgba(11,18,32,0.92)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#fff",
  backdropFilter: "blur(8px)",
};

function StatCard({ icon: Icon, label, value, accent }: { icon: typeof Activity; label: string; value: number; accent?: string }) {
  const v = useCounter(value);
  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
        <Icon className={`h-4 w-4 ${accent ?? "text-primary"}`} />
      </div>
      <p className={`mt-2 font-display text-3xl font-bold tabular-nums ${accent ?? ""}`}>{v}</p>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="glass p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <BarChart3 className="h-4 w-4 text-primary" />
      </div>
      {children}
    </div>
  );
}

function RecentActivity({ scans }: { scans: ScanRecord[] }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = scans.filter((s) =>
    [s.id, s.type, s.input, s.verdict].some((x) => x.toLowerCase().includes(q.toLowerCase())),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const view = filtered.slice((page - 1) * perPage, page * perPage);

  const Icon = (t: ScanRecord["type"]) =>
    t === "url" ? LinkIcon : t === "email" ? Mail : t === "sms" ? Smartphone : Usb;

  return (
    <div className="glass mt-8 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5">
        <div>
          <h3 className="font-display text-lg font-semibold">Recent Activity</h3>
          <p className="text-xs text-muted-foreground">Latest scans across all channels</p>
        </div>
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          placeholder="Search by id, input, verdict…"
          className="w-full max-w-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary/50"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Scan Type</th>
              <th className="px-5 py-3">Input</th>
              <th className="px-5 py-3">Result</th>
              <th className="px-5 py-3">Confidence</th>
              <th className="px-5 py-3">Date & Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {view.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">No scans yet — run your first scan to populate this table.</td></tr>
            )}
            {view.map((s) => {
              const I = Icon(s.type);
              const color = s.verdict === "phishing" ? "text-destructive" : s.verdict === "suspicious" ? "text-warning" : "text-success";
              return (
                <tr key={s.id} className="transition-colors hover:bg-white/5">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{s.id}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-2"><I className="h-4 w-4 text-primary" />{s.type.toUpperCase()}</span>
                  </td>
                  <td className="max-w-[280px] truncate px-5 py-3">{s.input}</td>
                  <td className={`px-5 py-3 font-semibold ${color}`}>{s.verdict.toUpperCase()}</td>
                  <td className="px-5 py-3 tabular-nums">{s.confidence}%</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(s.createdAt).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 p-4 text-xs text-muted-foreground">
        <span>{filtered.length} entries</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-md border border-white/10 px-3 py-1 hover:bg-white/5" disabled={page === 1}>Prev</button>
          <span>Page {page} / {pages}</span>
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} className="rounded-md border border-white/10 px-3 py-1 hover:bg-white/5" disabled={page === pages}>Next</button>
        </div>
      </div>
    </div>
  );
}
