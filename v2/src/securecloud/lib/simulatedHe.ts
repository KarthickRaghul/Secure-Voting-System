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

function randomBigInt(min: bigint, max: bigint) {
  const range = max - min;
  const rand = BigInt(Math.floor(Math.random() * Number(range)));
  return min + rand;
}

export function generateKeypair(): Keypair {
  // Use a much larger constant for the "key" to look complex
  const k = randomBigInt(100_000_000_000n, 999_999_999_999n);
  // Hash-like hex strings
  const pub = `PUB-${k.toString(16).toUpperCase()}`;
  const priv = `PRIV-${k.toString(16).toUpperCase()}`;

  return {
    publicKey: pub,
    privateKey: priv,
    createdAt: new Date().toISOString(),
  };
}

function extractKFromKey(key: string): bigint {
  const hex = key.split("-")[1];
  if (!hex) throw new Error("Invalid key format.");
  return BigInt("0x" + hex);
}

export function encryptNumber(value: number, publicKey: string): Ciphertext {
  if (!Number.isFinite(value)) throw new Error("Value must be a finite number.");
  const k = extractKFromKey(publicKey);
  // Larger nonces for complexity
  const nonce = Number(randomBigInt(1_000_000n, 9_999_999n));
  // Keep the math: c = m + k + nonce
  // Using BigInt for c calculation to avoid overflow issues with large k
  const c = BigInt(value) + k + BigInt(nonce);
  return { c: Number(c), nonce }; // Note: c might still be large, but JS numbers handle up to ~2^53 accurately.
  // Actually, let's keep c as number for now but we'll use much larger k.
  // If k is ~10^12, and value is small, c is fine in double.
}

export function decryptNumber(cipher: Ciphertext, privateKey: string): number {
  const k = extractKFromKey(privateKey);
  const m = BigInt(cipher.c) - k - BigInt(cipher.nonce);
  return Number(m);
}

export function encryptConstant(value: number, publicKey: string): Ciphertext {
  return encryptNumber(value, publicKey);
}

export function assertKeypair(input: unknown): Keypair {
  const parsed: KeypairParsed = keypairSchema.parse(input);
  return parsed as Keypair;
}

