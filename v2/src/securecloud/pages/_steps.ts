import { useLocation } from "react-router-dom";
import { useSecureCloud } from "@/securecloud/SecureCloudProvider";
import type { Step } from "@/securecloud/components/StepIndicator";

export function useSecureCloudSteps(): Step[] {
  const { pathname } = useLocation();
  const { plaintextNumbers, keypair, ciphertextNumbers, datasetId, lastServerResult } = useSecureCloud();

  const steps: Step[] = [
    { key: "datasets", label: "Dataset", done: plaintextNumbers.length > 0, current: pathname === "/datasets" },
    { key: "keys", label: "Keys", done: !!keypair, current: pathname === "/keys" },
    { key: "encrypt", label: "Encrypt", done: ciphertextNumbers.length > 0, current: pathname === "/encrypt" },
    { key: "send", label: "Send", done: !!datasetId, current: pathname === "/send" },
    { key: "compute", label: "Compute", done: !!lastServerResult, current: pathname === "/compute" },
    { key: "result", label: "Decrypt", done: false, current: pathname === "/result" },
  ];

  return steps;
}
