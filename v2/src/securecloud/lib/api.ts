import { z } from "zod";
import type { Ciphertext, ServerEncryptedResult } from "@/securecloud/types";

const cipherSchema = z.object({
  c: z.number(),
  nonce: z.number(),
});

const uploadResponseSchema = z.object({
  dataset_id: z.string().min(1),
});

const encryptedResultSchema = z.object({
  op: z.enum(["sum", "avg", "count"]),
  encrypted: cipherSchema,
  meta: z.record(z.unknown()).optional(),
});

type EncryptedResult = z.infer<typeof encryptedResultSchema>;

export function getApiBaseUrl(): string {
  // Default for local development; can be overridden via VITE_API_BASE_URL.
  return (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8000";
}

export async function uploadEncryptedDataset(input: {
  publicKey: string;
  ciphertext: Ciphertext[];
}): Promise<{ datasetId: string }> {
  const res = await fetch(`${getApiBaseUrl()}/api/encrypted-datasets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_key: input.publicKey, ciphertext: input.ciphertext }),
  });

  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
  const json = await res.json();
  const parsed = uploadResponseSchema.parse(json);
  return { datasetId: parsed.dataset_id };
}

export async function computeEncrypted(op: "sum" | "avg" | "count", input: {
  datasetId: string;
}): Promise<ServerEncryptedResult> {
  const res = await fetch(`${getApiBaseUrl()}/api/compute/${op}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataset_id: input.datasetId }),
  });
  if (!res.ok) throw new Error(`Compute failed (${res.status})`);
  const json = await res.json();
  const parsed: EncryptedResult = encryptedResultSchema.parse(json);
  return parsed as ServerEncryptedResult;
}
