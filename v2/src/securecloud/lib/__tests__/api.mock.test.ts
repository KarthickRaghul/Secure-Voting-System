import { describe, it, expect, vi } from "vitest";
import { uploadEncryptedDataset, computeEncrypted } from "../api";
import { generateKeypair, encryptNumber, decryptNumber } from "../simulatedHe";

describe("api mock", () => {
    it("should upload and compute sum correctly", async () => {
        const keypair = generateKeypair();
        const values = [10, 20, 30];
        const ciphertext = values.map(v => encryptNumber(v, keypair.publicKey));

        const { datasetId } = await uploadEncryptedDataset({
            publicKey: keypair.publicKey,
            ciphertext
        });

        expect(datasetId).toBeDefined();

        const result = await computeEncrypted("sum", { datasetId });
        expect(result.op).toBe("sum");

        const decrypted = decryptNumber(result.encrypted, keypair.privateKey);
        expect(decrypted).toBe(60); // 10 + 20 + 30
    });

    it("should compute average correctly", async () => {
        const keypair = generateKeypair();
        const values = [10, 20, 30];
        const ciphertext = values.map(v => encryptNumber(v, keypair.publicKey));

        const { datasetId } = await uploadEncryptedDataset({
            publicKey: keypair.publicKey,
            ciphertext
        });

        const result = await computeEncrypted("avg", { datasetId });
        expect(result.op).toBe("avg");
        expect(Number(result.meta?.count)).toBe(3);

        const decryptedSum = decryptNumber(result.encrypted, keypair.privateKey);
        const avg = decryptedSum / Number(result.meta?.count);
        expect(avg).toBe(20); // (10 + 20 + 30) / 3
    });
});
