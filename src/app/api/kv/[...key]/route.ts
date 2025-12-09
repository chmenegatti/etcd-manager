import { NextResponse } from "next/server";
import { getEtcdClient } from "@/lib/etcd";

export const runtime = "nodejs";

export async function DELETE(_: Request, { params }: { params: { key: string[] } }) {
  try {
    const decoded = decodeURIComponent(params.key.join("/"));
    if (!decoded) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const client = getEtcdClient();
    await client.delete().key(decoded);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/kv failed", error);
    return NextResponse.json({ error: "Failed to delete key" }, { status: 500 });
  }
}
