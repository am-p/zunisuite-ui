import { getTokenUnsafe } from "./auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

function authHeader(): Record<string, string> {
  const t = getTokenUnsafe();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function apiRegister(params) {
  const res = await fetch(
    `${API_BASE}/auth/register?name=${params.name}&email=${params.email}&password=${params.password}`,
    { method: "POST" }
  );
  if (!res.ok) throw new Error(await safeError(res));
  return res.json();
}


export async function apiLogin(params: { email: string; password: string }) {
  const body = new URLSearchParams();
  body.set("username", params.email);
  body.set("password", params.password);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) throw new Error(await safeError(res));
  return res.json() as Promise<{ access_token: string; token_type: string }>;
}

export async function apiUploadPdf(file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: "POST",
    headers: { ...authHeader() },
    body: form,
  });

  if (!res.ok) throw new Error(await safeError(res));

  const blob = await res.blob();
  const filename = filenameFromResponse(res) ?? fallbackExcelName(file.name);
  triggerDownload(blob, filename);

  return { filename };
}

function filenameFromResponse(res: Response): string | null {
  const cd = res.headers.get("content-disposition");
  if (!cd) return null;
  const match = /filename\*?=(?:UTF-8''|")?([^";]+)"?/i.exec(cd);
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

function fallbackExcelName(pdfName: string) {
  return pdfName.toLowerCase().endsWith(".pdf")
    ? pdfName.slice(0, -4) + ".xlsx"
    : pdfName + ".xlsx";
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function safeError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data?.detail ? JSON.stringify(data.detail) : JSON.stringify(data);
  } catch {
    return `${res.status} ${res.statusText}`;
  }
}
