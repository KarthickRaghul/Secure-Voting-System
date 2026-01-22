import * as React from "react";
import type { Ciphertext, DecryptedResult, Keypair, ServerEncryptedResult } from "@/securecloud/types";

type SecureCloudState = {
  plaintextNumbers: number[];
  keypair: Keypair | null;
  ciphertextNumbers: Ciphertext[];
  datasetId: string | null;
  lastServerResult: ServerEncryptedResult | null;
  decryptedHistory: DecryptedResult[];
};

type SecureCloudActions = {
  setPlaintextNumbers(values: number[]): void;
  setKeypair(keypair: Keypair | null): void;
  setCiphertextNumbers(values: Ciphertext[]): void;
  setDatasetId(id: string | null): void;
  setLastServerResult(res: ServerEncryptedResult | null): void;
  addDecryptedResult(r: DecryptedResult): void;
  resetAll(): void;
};

const SecureCloudContext = React.createContext<(SecureCloudState & SecureCloudActions) | null>(null);

const initialState: SecureCloudState = {
  plaintextNumbers: [],
  keypair: null,
  ciphertextNumbers: [],
  datasetId: null,
  lastServerResult: null,
  decryptedHistory: [],
};

export function SecureCloudProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<SecureCloudState>(initialState);

  const api = React.useMemo<SecureCloudState & SecureCloudActions>(() => {
    return {
      ...state,
      setPlaintextNumbers: (values) =>
        setState((s) => ({ ...s, plaintextNumbers: values, ciphertextNumbers: [], datasetId: null, lastServerResult: null })),
      setKeypair: (keypair) => setState((s) => ({ ...s, keypair, ciphertextNumbers: [], datasetId: null, lastServerResult: null })),
      setCiphertextNumbers: (values) => setState((s) => ({ ...s, ciphertextNumbers: values, datasetId: null, lastServerResult: null })),
      setDatasetId: (id) => setState((s) => ({ ...s, datasetId: id })),
      setLastServerResult: (res) => setState((s) => ({ ...s, lastServerResult: res })),
      addDecryptedResult: (r) => setState((s) => ({ ...s, decryptedHistory: [r, ...s.decryptedHistory].slice(0, 20) })),
      resetAll: () => setState(initialState),
    };
  }, [state]);

  return <SecureCloudContext.Provider value={api}>{children}</SecureCloudContext.Provider>;
}

export function useSecureCloud() {
  const ctx = React.useContext(SecureCloudContext);
  if (!ctx) throw new Error("useSecureCloud must be used within <SecureCloudProvider />");
  return ctx;
}
