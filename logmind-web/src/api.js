const base = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function parseError(res) {
  try {
    const data = await res.json();
    return data.error || res.statusText;
  } catch {
    return res.statusText;
  }
}

export async function uploadLog(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${base}/api/logs`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return res.json();
}

export async function listAnalyses() {
  const res = await fetch(`${base}/api/analyses`);
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return res.json();
}

export async function getAnalysis(id) {
  const res = await fetch(`${base}/api/analyses/${id}`);
  if (!res.ok) {
    throw new Error(await parseError(res));
  }
  return res.json();
}

export function getApiBase() {
  return base;
}
