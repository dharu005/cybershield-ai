// Mock ML-based detection + localStorage history store.
export type ScanType = "url" | "email" | "sms" | "usb";

export interface ScanRecord {
  id: string;
  type: ScanType;
  input: string;
  verdict: "safe" | "phishing" | "suspicious";
  confidence: number; // 0-100
  features: { token: string; weight: number }[];
  createdAt: number;
  meta?: Record<string, string | number>;
}

const KEY = "cybershield_scans_v1";

export function loadScans(): ScanRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
export function saveScan(rec: ScanRecord) {
  if (typeof window === "undefined") return;
  const all = loadScans();
  all.unshift(rec);
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 500)));
  window.dispatchEvent(new Event("scans:updated"));
}
export function deleteScan(id: string) {
  const all = loadScans().filter((s) => s.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("scans:updated"));
}
export function clearScans() {
  localStorage.setItem(KEY, "[]");
  window.dispatchEvent(new Event("scans:updated"));
}

// Suspicious vocabularies per channel
const URL_TOKENS = ["login", "verify", "account", "secure", "paypal", "update", "bank", "signin", "wallet", "free", "bonus", "confirm"];
const EMAIL_TOKENS = ["urgent", "click", "verify", "payment", "account", "password", "suspended", "invoice", "wire", "gift"];
const SMS_TOKENS = ["winner", "claim", "prize", "lottery", "click here", "otp", "bank", "refund", "kyc", "blocked"];

function scoreText(text: string, vocab: string[]) {
  const lower = text.toLowerCase();
  const hits: { token: string; weight: number }[] = [];
  let score = 0;
  for (const t of vocab) {
    if (lower.includes(t)) {
      const w = 0.08 + Math.random() * 0.12;
      score += w;
      hits.push({ token: t, weight: +w.toFixed(2) });
    }
  }
  // Add noise + heuristic features
  if (/[0-9]{4,}/.test(text)) { score += 0.08; hits.push({ token: "long-digits", weight: 0.08 }); }
  if (/http(s)?:\/\//.test(text) && /https?:\/\/[^ ]{40,}/.test(text)) { score += 0.1; hits.push({ token: "long-url", weight: 0.1 }); }
  if (/[!?]{2,}/.test(text)) { score += 0.05; hits.push({ token: "excess-punct", weight: 0.05 }); }
  return { score: Math.min(score, 0.98), hits: hits.slice(0, 8) };
}

export function analyzeUrl(url: string): Omit<ScanRecord, "id" | "createdAt"> {
  const { score, hits } = scoreText(url, URL_TOKENS);
  let s = score;
  try {
    const u = new URL(url.includes("://") ? url : `http://${url}`);
    if (u.hostname.split(".").length > 3) { s += 0.1; hits.push({ token: "many-subdomains", weight: 0.1 }); }
    if (/[0-9]/.test(u.hostname)) { s += 0.05; hits.push({ token: "digit-in-host", weight: 0.05 }); }
    if (u.protocol !== "https:") { s += 0.07; hits.push({ token: "no-https", weight: 0.07 }); }
  } catch { s += 0.2; hits.push({ token: "invalid-url", weight: 0.2 }); }
  const conf = Math.min(0.99, Math.max(0.55, s + 0.55));
  const verdict: ScanRecord["verdict"] = s >= 0.45 ? "phishing" : s >= 0.25 ? "suspicious" : "safe";
  return { type: "url", input: url, verdict, confidence: +(conf * 100).toFixed(1), features: hits };
}

export function analyzeEmail(text: string): Omit<ScanRecord, "id" | "createdAt"> {
  const { score, hits } = scoreText(text, EMAIL_TOKENS);
  const conf = Math.min(0.99, Math.max(0.5, score + 0.5));
  const verdict: ScanRecord["verdict"] = score >= 0.4 ? "phishing" : score >= 0.2 ? "suspicious" : "safe";
  return { type: "email", input: text.slice(0, 280), verdict, confidence: +(conf * 100).toFixed(1), features: hits };
}

export function analyzeSms(text: string): Omit<ScanRecord, "id" | "createdAt"> {
  const { score, hits } = scoreText(text, SMS_TOKENS);
  const conf = Math.min(0.99, Math.max(0.5, score + 0.55));
  const verdict: ScanRecord["verdict"] = score >= 0.35 ? "phishing" : score >= 0.18 ? "suspicious" : "safe";
  return { type: "sms", input: text.slice(0, 280), verdict, confidence: +(conf * 100).toFixed(1), features: hits };
}

export function simulateUsbScan(): Omit<ScanRecord, "id" | "createdAt"> & { devices: { name: string; status: string }[]; risk: "low" | "medium" | "high"; scanTime: number } {
  const devices = [
    { name: "Kingston DataTraveler 32GB", status: "Clean" },
    { name: "SanDisk Ultra 64GB", status: Math.random() > 0.6 ? "Suspicious autorun.inf" : "Clean" },
  ];
  const suspicious = devices.some((d) => d.status !== "Clean");
  const risk: "low" | "medium" | "high" = suspicious ? (Math.random() > 0.5 ? "high" : "medium") : "low";
  const confidence = suspicious ? 88 + Math.random() * 10 : 95 + Math.random() * 4;
  return {
    type: "usb",
    input: devices.map((d) => d.name).join(", "),
    verdict: suspicious ? "phishing" : "safe",
    confidence: +confidence.toFixed(1),
    features: suspicious
      ? [{ token: "autorun.inf", weight: 0.42 }, { token: "hidden-exe", weight: 0.31 }, { token: "unknown-vendor", weight: 0.18 }]
      : [{ token: "no-autorun", weight: 0.0 }, { token: "known-vendor", weight: 0.0 }],
    devices,
    risk,
    scanTime: +(1.2 + Math.random() * 2.4).toFixed(2),
  };
}

export function newId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}
