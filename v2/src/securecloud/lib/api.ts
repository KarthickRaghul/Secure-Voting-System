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

// --- MOCK STORAGE ---
const mockStorage = {
  datasets: new Map<string, { publicKey: string; ciphertext: Ciphertext[] }>(),
};

export function getApiBaseUrl(): string {
  return "MOCK_API";
}

export async function uploadEncryptedDataset(input: {
  publicKey: string;
  ciphertext: Ciphertext[];
}): Promise<{ datasetId: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const datasetId = `ds_${Math.random().toString(36).substring(2, 9)}`;
  mockStorage.datasets.set(datasetId, { publicKey: input.publicKey, ciphertext: input.ciphertext });

  return { datasetId };
}

export async function computeEncrypted(
  op: "sum" | "avg" | "count",
  input: { datasetId: string }
): Promise<ServerEncryptedResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const dataset = mockStorage.datasets.get(input.datasetId);
  if (!dataset) throw new Error("Dataset not found in mock storage.");

  const extractK = (key: string): bigint => {
    const hex = key.split("-")[1];
    return hex ? BigInt("0x" + hex) : 0n;
  };

  const k = extractK(dataset.publicKey);

  let resultC = 0n;
  let resultNonce = 0n;

  if (op === "sum" || op === "avg") {
    // Homomorphic addition: sum of (value + k + nonce) = sum(value) + count*k + sum(nonce)
    for (const item of dataset.ciphertext) {
      resultC += BigInt(item.c);
      resultNonce += BigInt(item.nonce);
    }
    // Correct the sum so it only has ONE 'k', making it a valid single ciphertext
    if (dataset.ciphertext.length > 0) {
      resultC = resultC - BigInt(dataset.ciphertext.length - 1) * k;
    }
  } else if (op === "count") {
    // Count is special; we encrypt the actual count so it demonstrates the flow.
    const count = BigInt(dataset.ciphertext.length);
    const nonce = BigInt(Math.floor(Math.random() * 9000000) + 1000000);
    resultC = count + k + nonce;
    resultNonce = nonce;
  }

  const result: ServerEncryptedResult = {
    op,
    encrypted: { c: Number(resultC), nonce: Number(resultNonce) },
    meta: op === "avg" ? { count: dataset.ciphertext.length } : {},
  };

  return result;
}
