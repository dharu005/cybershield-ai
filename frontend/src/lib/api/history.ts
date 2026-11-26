const API = "http://127.0.0.1:5000";
console.log("history.ts loaded");
export async function scanLoggedURLs () {

  const response = await fetch(
    `${API}/scan-logged-urls`,
    {
      method: "GET",
      headers: {
        "Content-Type":
          "application/json",
      },
    }
  );

  return await response.json();
}