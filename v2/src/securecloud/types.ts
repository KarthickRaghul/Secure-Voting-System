export type DemoDatasetId = "secure_voting" | "marks_analysis";

export type Keypair = {
  publicKey: string;
  privateKey: string;
  createdAt: string;
};

export type Ciphertext = {
  c: number;
  nonce: number;
};

export type ServerEncryptedResult = {
  op: "sum" | "avg" | "count";
  encrypted: Ciphertext;
  meta?: Record<string, unknown>;
};

export type DecryptedResult = {
  op: ServerEncryptedResult["op"];
  value: number;
  decryptedAt: string;
};
