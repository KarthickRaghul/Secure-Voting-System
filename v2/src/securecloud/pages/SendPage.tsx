import * as React from "react";
import { AppShell } from "@/securecloud/components/AppShell";
import { StepIndicator } from "@/securecloud/components/StepIndicator";
import { useSecureCloudSteps } from "@/securecloud/pages/_steps";
import { SecurityCallout } from "@/securecloud/components/SecurityCallout";
import { useSecureCloud } from "@/securecloud/SecureCloudProvider";
import { getApiBaseUrl, uploadEncryptedDataset } from "@/securecloud/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function SendPage() {
  const steps = useSecureCloudSteps();
  const { toast } = useToast();
  const { keypair, ciphertextNumbers, datasetId, setDatasetId } = useSecureCloud();
  const [busy, setBusy] = React.useState(false);
  const baseUrl = getApiBaseUrl();

  const canSend = !!keypair && ciphertextNumbers.length > 0;

  async function onSend() {
    if (!keypair) return;
    setBusy(true);
    try {
      const res = await uploadEncryptedDataset({ publicKey: keypair.publicKey, ciphertext: ciphertextNumbers });
      setDatasetId(res.datasetId);
      toast({ title: "Uploaded ciphertext", description: `dataset_id: ${res.datasetId}` });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e?.message ?? "Unknown error", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
        <StepIndicator steps={steps} />
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Send Encrypted Data</h1>
          <p className="text-sm text-muted-foreground">
            The server receives ciphertext only. The private key never leaves the browser.
          </p>
        </header>

        <SecurityCallout
          title="What gets sent"
          items={["Ciphertext array", "Public key (safe)", "NO private key"]}
        />

        <Card>
          <CardHeader>
            <CardTitle>Upload to Cloud</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">API base URL: {baseUrl}</div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={onSend} disabled={!canSend || busy}>
                {busy ? "Uploading…" : "Upload ciphertext"}
              </Button>
              <Button asChild variant="secondary" disabled={!datasetId}>
                <Link to="/compute">Next: Compute</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/encrypt">Back: Encrypt</Link>
              </Button>
            </div>

            <Separator />

            <div className="space-y-1 text-sm">
              <div>
                <span className="text-muted-foreground">Current dataset_id:</span> {datasetId ?? "—"}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
