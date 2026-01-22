const API = "http://localhost:3001/api/overrides";

export async function getOverrides() {
  const res = await fetch(API);
  const arr = await res.json();
  const map = new Map();
  arr.forEach((item: any) => {
    map.set(item.key, { status: item.status, reason: item.reason });
  });
  return map;
}

export async function saveOverride(key: string, status: string, reason: string) {
  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, status, reason }),
  });
}
