export async function getOverrides() {
  const res = await fetch("http://localhost:3001/api/overrides");
  const arr = await res.json();

  const map = new Map();
  arr.forEach((it: any) => {
    map.set(it.key, { status: it.status, reason: it.reason });
  });

  return map;
}
