import { z } from "zod";
import type { Ciphertext, Keypair } from "@/securecloud/types";

// -----------------------------------------------------------------------------
// SIMULATED HOMOMORPHIC ENCRYPTION (TOY)
// -----------------------------------------------------------------------------
// This is NOT cryptographically secure.
// Goal: demonstrate architecture + data flow:
// - Client can encrypt/decrypt
// - Server can combine ciphertexts to get a ciphertext that decrypts to correct sum
//
// Scheme idea:
//   private key: k (integer)
//   encrypt(m): c = m + k + nonce
//   decrypt(c): m = c - k - nonce
//   homomorphic add on ciphertext: add c's and add nonces
//
// This allows server to compute encrypted sum without knowing plaintext.
// Average is implemented as encrypted_sum + meta.count; client divides after decrypt.
// Count does not require encryption; we still wrap it as an "encrypted" value for UI.
// -----------------------------------------------------------------------------

const keypairSchema = z.object({
  publicKey: z.string().min(1),
  privateKey: z.string().min(1),
  createdAt: z.string().min(1),
});

type KeypairParsed = z.infer<typeof keypairSchema>;

function randomInt(minInclusive: number, maxInclusive: number) {
  return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;
}

export function generateKeypair(): Keypair {
  const k = randomInt(10_000, 99_999);
  return {
    publicKey: `SIM-PUB-${k}`,
    privateKey: `SIM-PRIV-${k}`,
    createdAt: new Date().toISOString(),
  };
}

function extractKFromKey(key: string): number {
  const m = key.match(/(\d+)/);
  if (!m) throw new Error("Invalid key format.");
  return Number(m[1]);
}

export function encryptNumber(value: number, publicKey: string): Ciphertext {
  if (!Number.isFinite(value)) throw new Error("Value must be a finite number.");
  const k = extractKFromKey(publicKey);
  const nonce = randomInt(1, 999);
  return { c: value + k + nonce, nonce };
}

export function decryptNumber(cipher: Ciphertext, privateKey: string): number {
  const k = extractKFromKey(privateKey);
  return cipher.c - k - cipher.nonce;
}

export function encryptConstant(value: number, publicKey: string): Ciphertext {
  // Useful for "encrypted count" display.
  return encryptNumber(value, publicKey);
}

export function assertKeypair(input: unknown): Keypair {
  const parsed: KeypairParsed = keypairSchema.parse(input);
  return parsed as Keypair;
}
