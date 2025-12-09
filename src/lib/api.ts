import { EtcdEntry } from "@/types/etcd";

const base = process.env.NEXT_PUBLIC_API_BASE ?? "";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body.error ?? res.statusText;
    throw new Error(message || "Erro desconhecido");
  }
  return res.json() as Promise<T>;
}

export async function listKeys(prefix = "/"): Promise<EtcdEntry[]> {
  const res = await fetch(`${base}/api/kv?prefix=${encodeURIComponent(prefix || "/")}`, {
    cache: "no-store",
  });
  const data = await handle<{ items: EtcdEntry[] }>(res);
  return data.items ?? [];
}

export async function upsertKey(key: string, value: string): Promise<EtcdEntry> {
  const res = await fetch(`${base}/api/kv`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  const data = await handle<{ item: EtcdEntry }>(res);
  return data.item;
}

export async function deleteKey(key: string): Promise<void> {
  await handle(
    await fetch(`${base}/api/kv/${encodeURIComponent(key)}`, {
      method: "DELETE",
    }),
  );
}
