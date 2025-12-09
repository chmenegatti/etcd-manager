import fs from "fs";
import { Etcd3, IOptions } from "etcd3";

let client: Etcd3 | null = null;

function asBuffer(value?: string): Buffer | undefined {
  if (!value) return undefined;
  // If value looks like PEM content, return directly; otherwise try to read as file path.
  if (value.includes("-----BEGIN")) return Buffer.from(value);
  if (fs.existsSync(value)) return fs.readFileSync(value);
  return Buffer.from(value);
}

function buildClient(): Etcd3 {
  const hosts = (process.env.ETCD_ENDPOINTS ?? process.env.ETCD_ENDPOINT ?? "http://127.0.0.1:2379")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);

  const options: IOptions = {
    hosts,
  };

  const privateKey = asBuffer(process.env.ETCD_KEY);
  const certChain = asBuffer(process.env.ETCD_CERT);
  const rootCertificate = asBuffer(process.env.ETCD_CA);

  if (rootCertificate || privateKey || certChain) {
    // etcd3 types require rootCertificate; fall back to empty buffer when not provided.
    const credentials: IOptions["credentials"] = {
      rootCertificate: rootCertificate ?? Buffer.alloc(0),
    };
    if (privateKey) credentials.privateKey = privateKey;
    if (certChain) credentials.certChain = certChain;
    options.credentials = credentials;
  }

  if (process.env.ETCD_USERNAME) {
    options.auth = {
      username: process.env.ETCD_USERNAME,
      password: process.env.ETCD_PASSWORD ?? "",
    };
  }

  return new Etcd3(options);
}

export function getEtcdClient() {
  if (!client) {
    client = buildClient();
  }
  return client;
}

export function mapKv(kv: any) {
  return {
    key: kv.key?.toString() ?? "",
    value: kv.value?.toString() ?? "",
    version: Number(kv.version ?? 0),
    createRevision: Number(kv.create_revision ?? 0),
    modRevision: Number(kv.mod_revision ?? 0),
  };
}
