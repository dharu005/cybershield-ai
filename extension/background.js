console.log("CyberShield Extension Loaded");

function collectHistory() {

  chrome.history.search(
    {
      text: "",
      maxResults: 100,
    },
    (results) => {

      console.log("History Found:", results);

      const urls = results
        .map(item => item.url)
        .filter(Boolean);

      fetch("http://127.0.0.1:5000/save-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urls: urls,
        }),
      });

      console.log("URLs Sent:", urls);
    }
  );
}

// Extension install aagumbodhu
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
  collectHistory();
});

// Every 1 minute update
setInterval(() => {
  collectHistory();
}, 60000);