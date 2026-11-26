document
  .getElementById("exportBtn")
  .addEventListener("click", () => {

    chrome.storage.local.get(
      ["cybershield_logs"],
      (result) => {

        const urls =
          result.cybershield_logs || [];

        localStorage.setItem(
          "cybershield_logs",
          JSON.stringify(urls)
        );

        alert(
          urls.length +
          " URLs exported"
        );
      }
    );
  });