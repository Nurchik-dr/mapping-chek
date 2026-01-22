export async function saveOverride(key: string, status: string, reason: string) {
  await fetch("http://localhost:3001/api/overrides", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, status, reason })
  });
}
