import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { scanLoggedURLs } from "@/lib/api/history";

export const Route = createFileRoute("/browser-logs")({
  component: BrowserLogs,
});

function BrowserLogs() {
  const [results, setResults] = useState<any[]>([]);

  async function loadLogs() {
    //const urls = JSON.parse(
      //  localStorage.getItem(
        //    "cybershield_logs"
    //) || "[]"
    //);

    //const urls = JSON.parse(
      //  localStorage.getItem("cybershield_logs") || "[]"
    //);

    //const urls = [
      //"https://google.com",
      //"https://facebook.com",
      //"http://secure-paypal-login.com",
      //"http://verify-bank-account.net",
    //];

    //const data = await scanLoggedURLs();
    
    //console.log("Sending URLs:", urls);
    //console.log(data);
    ///console.log("Response:", data);
    ///alert(JSON.stringify(data));

    //const logs = JSON.parse(
      //  localStorage.getItem("cybershield_logs") || "[]"
    //);

    //console.log("Logs:", logs);

    const data = await scanLoggedURLs();

    console.log("Response:", data);

    setResults(data);
  }

  return (
    <SiteLayout>
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-4">
          Browser URL Logs
        </h1>

        <button
          onClick={loadLogs}
          className="rounded-xl bg-blue-500 px-4 py-2"
        >
          Analyze Browser Logs
        </button>

        <div className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-white/5">
          <table className="w-full text-sm">

            <thead>
              <tr>
                <th className="p-3 text-left">URL</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Confidence</th>
                {/*
                  <th>XAI</th>
                */}
              </tr>
            </thead>

            <tbody>
              {results.map((r, i) => (
                <tr 
                  key={i}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="p-3 break-all max-w-[500px]">
                    {r.url}
                  </td>
                  <td className="text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        r.status?.toLowerCase() === "phishing"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>{r.confidence}%</td>

                  <td>
                    {r.features
                      ?.map((f: any) => f.token)
                      .join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </SiteLayout>
  );
}