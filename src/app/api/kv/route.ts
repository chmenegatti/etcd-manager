import { NextResponse } from "next/server";
import { getEtcdClient, mapKv } from "@/lib/etcd";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const prefix = searchParams.get("prefix") ?? "/";

    const client = getEtcdClient();
    const result = await client.getAll().prefix(prefix).exec();
    const kvs = Array.isArray(result.kvs) ? result.kvs : [];

    return NextResponse.json({ items: kvs.map(mapKv) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch keys";
    console.error("GET /api/kv failed", error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const key = String(body?.key ?? "").trim();
    const value = String(body?.value ?? "");

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const client = getEtcdClient();
    await client.put(key).value(value);

    const meta = await client.get(key).exec();
    const kv = Array.isArray(meta.kvs) && meta.kvs[0] ? mapKv(meta.kvs[0]) : { key, value };

    return NextResponse.json({ item: kv });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save key";
    console.error("PUT /api/kv failed", error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
