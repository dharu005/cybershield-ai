const API = "http://localhost:5000";

export async function scanURL(url: string) {

  const res = await fetch(
    `${API}/predict-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    }
  );

  return await res.json();
}

export async function scanSMS(sms: string) {

  const res = await fetch(
    `${API}/predict-sms`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sms }),
    }
  );

  return await res.json();
}

export async function scanSMSFile(file: File) {
  const formData = new FormData();

  formData.append(
    "sms_file",
    file
  );

  const response = await fetch(
    "http://localhost:5000/scan_sms_file",
    {
      method: "POST",
      body: formData,
    }
  );

  return await response.json();
}

export async function scanEmail(email: string) {

  const res = await fetch(
    `${API}/predict-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );

  return await res.json();
}

export async function scanEmailFile(file: File) {

  const formData = new FormData();

  formData.append(
    "email_file",
    file
  );

  const response = await fetch(
    "http://127.0.0.1:5000/scan_email_file",
    {
      method: "POST",
      body: formData,
    }
  );

  return response.json();
}