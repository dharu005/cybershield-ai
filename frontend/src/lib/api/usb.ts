const API = "http://127.0.0.1:5000";

export async function scanUSB() {
  const response = await fetch(`${API}/scan-usb`);

  if (!response.ok) {
    throw new Error("USB scan failed");
  }

  return await response.json();
}